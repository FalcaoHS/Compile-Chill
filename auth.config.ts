import Twitter from "next-auth/providers/twitter"
import { authAdapter } from "@/lib/auth-adapter"
import { prisma } from "@/lib/prisma"
import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  adapter: authAdapter,
  providers: [
    Twitter({
      clientId: process.env.X_CLIENT_ID!,
      clientSecret: process.env.X_CLIENT_SECRET!,
      // Profile mapper para lidar com formato do plano Free do X
      profile(profile: any) {
        // O plano Free pode retornar { data: { ... } } ou o objeto direto
        const user = profile?.data ?? profile ?? {}
        
        return {
          id: user.id ?? crypto.randomUUID(),
          name: user.name ?? null,
          username: user.username ?? user.screen_name ?? null,
          image: user.profile_image_url ?? user.profile_image_url_https ?? null,
        }
      },
    } as any),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "twitter" && account.providerAccountId) {
        try {
          // Extract X account data
          const xId = account.providerAccountId
          
          // Profile pode vir em formatos diferentes (plano Free do X)
          // Pode ser: { data: { name, ... } } ou objeto direto
          // Também pode vir como erro: { title, detail, type, status }
          const rawProfile: any = profile ?? {}
          
          // Verificar se profile é um erro (tem title/detail/type)
          const isErrorProfile = rawProfile.title || rawProfile.detail || rawProfile.type
          if (isErrorProfile) {
            console.warn("⚠️ Profile veio como erro do Twitter:", {
              title: rawProfile.title,
              detail: rawProfile.detail,
              type: rawProfile.type,
            })
          }
          
          // Se for erro, usar objeto vazio (vai buscar via API)
          const profileData = isErrorProfile ? {} : (rawProfile.data ?? rawProfile)
          
          // Extract X username (slug) from profile PRIMEIRO (precisa para fallback do name)
          // Twitter/X OAuth profile may have username in different fields
          let xUsername = 
            profileData?.username ||
            profileData?.screen_name ||
            rawProfile?.screen_name || 
            rawProfile?.username || 
            null
          
          // Extrair name de vários lugares possíveis
          // Se não vier name, usar xUsername como fallback (melhor que string vazia)
          let name = 
            profileData?.name || 
            rawProfile?.name || 
            user.name || 
            xUsername || // Fallback: usar @username se não tiver name
            ""
          
          // Extrair avatar
          let avatar = 
            (typeof profileData?.profile_image_url_https === "string" 
              ? profileData.profile_image_url_https 
              : null) ||
            (typeof rawProfile?.profile_image_url_https === "string" 
              ? rawProfile.profile_image_url_https 
              : null) || 
            (typeof user.image === "string" ? user.image : null) || 
            null

          // Se não trouxer nome ou foto do OAuth, buscar via API do Twitter
          // O plano Free do Twitter pode não retornar esses dados no callback
          // Usar /2/users/me que retorna o usuário autenticado sem precisar do ID
          if ((!name || !avatar) && account.access_token) {
            try {
              console.log("🔍 Buscando perfil completo via Twitter API...")
              // Usar /2/users/me que não precisa do ID do usuário
              const twitterApiUrl = `https://api.twitter.com/2/users/me`
              const params = new URLSearchParams({
                "user.fields": "name,username,profile_image_url,profile_image_url_https",
              })

              const apiResponse = await fetch(`${twitterApiUrl}?${params.toString()}`, {
                headers: {
                  Authorization: `Bearer ${account.access_token}`,
                  "Content-Type": "application/json",
                },
              })

              if (apiResponse.ok) {
                const apiData: any = await apiResponse.json()
                const apiUser = apiData?.data ?? apiData
                
                // Atualizar name se não tiver
                if (!name && apiUser?.name) {
                  name = apiUser.name
                  console.log("✅ Nome obtido via API:", name)
                }
                
                // Atualizar avatar se não tiver (priorizar HTTPS)
                if (!avatar) {
                  avatar = apiUser?.profile_image_url_https || apiUser?.profile_image_url || null
                  if (avatar) {
                    console.log("✅ Avatar obtido via API")
                  }
                }
                
                // Atualizar xUsername se não tiver
                if (!xUsername && apiUser?.username) {
                  xUsername = apiUser.username
                  console.log("✅ Username obtido via API:", xUsername)
                }
              } else {
                const errorData = await apiResponse.json().catch(() => ({}))
                console.warn("⚠️ Erro ao buscar perfil via API:", {
                  status: apiResponse.status,
                  error: errorData,
                })
              }
            } catch (apiError) {
              console.warn("⚠️ Erro ao buscar perfil via API (não crítico):", {
                message: apiError instanceof Error ? apiError.message : "Unknown error",
              })
              // Não bloquear login se a API falhar
            }
          }

          // Debug: Log profile structure para entender formato do X
          console.log("Profile structure:", {
            hasProfile: !!profile,
            profileKeys: profile ? Object.keys(profile) : [],
            hasData: !!(profile as any)?.data,
            dataKeys: (profile as any)?.data ? Object.keys((profile as any).data) : [],
            finalName: name,
            finalUsername: xUsername || "NONE",
            finalAvatar: avatar ? "HAS_AVATAR" : "NO_AVATAR",
            userImage: user.image || "NO_USER_IMAGE",
          })

          // Debug: Log account token info (without exposing full token)
          if (account.access_token) {
            console.log("Account token received:", {
              hasAccessToken: !!account.access_token,
              tokenLength: account.access_token.length,
              tokenType: account.token_type,
              hasRefreshToken: !!account.refresh_token,
              expiresAt: account.expires_at,
              scope: account.scope,
            })
          } else {
            console.warn("⚠️ No access_token in account object during signIn")
          }

          // Add xId and xUsername to user object so adapter can use it
          // This ensures the adapter creates the user with xId and xUsername
          if (!user.id) {
            (user as any).xId = xId
            if (xUsername) {
              (user as any).xUsername = xUsername
            }
          }
          
          // Update user object with correct name and image for adapter
          user.name = name
          user.image = avatar || undefined
          
          // If user already exists (has id), update their data
          // ⚠️ IMPORTANTE: user.id pode ser UUID (string) no primeiro login, não número
          // Só tentar update se for um ID numérico válido (usuário já existe no banco)
          if (user.id) {
            const userId = parseInt(user.id)
            // Se não for número válido, é primeiro login - deixa o adapter criar
            if (isNaN(userId)) {
              console.log("⚠️ user.id não é numérico (primeiro login), deixando adapter criar usuário")
              // Apenas anexar xId/xUsername e deixar o adapter criar
              if (!user.id || typeof user.id === 'string') {
                (user as any).xId = xId
                if (xUsername) {
                  (user as any).xUsername = xUsername
                }
              }
              return true
            }
            
            // Try to update with xUsername, but don't fail if field doesn't exist yet
            try {
              console.log("📝 Atualizando usuário existente:", {
                userId,
                hasName: !!name,
                hasAvatar: !!avatar,
                hasUsername: !!xUsername,
                nameValue: name || "VAZIO",
                avatarValue: avatar ? "TEM_AVATAR" : "SEM_AVATAR",
              })
              
              await prisma.user.update({
                where: { id: userId },
                data: {
                  name,
                  avatar,
                  ...(xUsername ? { xUsername } : {}), // Only include if provided
                  updatedAt: new Date(),
                },
              })
              
              console.log("✅ Usuário atualizado com sucesso")
            } catch (updateError) {
              // If xUsername field doesn't exist, update without it
              if (updateError instanceof Error && updateError.message.includes('xUsername')) {
                console.warn("⚠️ xUsername field not found. Updating user without it.")
                await prisma.user.update({
                  where: { id: userId },
                  data: {
                    name,
                    avatar,
                    updatedAt: new Date(),
                  },
                })
              } else {
                throw updateError // Re-throw if it's a different error
              }
            }

            // Ensure account is linked (create or update)
            // This is necessary because NextAuth may not call linkAccount if user already exists
            const existingAccount = await prisma.account.findUnique({
              where: {
                provider_providerAccountId: {
                  provider: "twitter",
                  providerAccountId: xId,
                },
              },
            })

            if (existingAccount) {
              // Update existing account with new tokens
              console.log("📝 Updating account in signIn callback")
              await prisma.account.update({
                where: { id: existingAccount.id },
                data: {
                  refresh_token: account.refresh_token,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: typeof account.id_token === "string" ? account.id_token : null,
                  session_state: typeof account.session_state === "string" ? account.session_state : null,
                },
              })
            } else {
              // Create new account link
              console.log("✨ Creating account in signIn callback")
              await prisma.account.create({
                data: {
                  userId,
                  type: account.type || "oauth",
                  provider: "twitter",
                  providerAccountId: xId,
                  refresh_token: account.refresh_token,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: typeof account.id_token === "string" ? account.id_token : null,
                  session_state: typeof account.session_state === "string" ? account.session_state : null,
                },
              })
            }
          }
        } catch (error) {
          console.error("Error in signIn callback:", {
            message: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined,
            xId: account.providerAccountId,
          })
          return false
        }
      }
      return true
    },
    async session({ session, user }) {
      if (session.user && user) {
        // ⚠️ ATENÇÃO: AVATAR - NÃO REMOVER OU MODIFICAR SEM TESTAR!
        // O avatar do usuário depende deste callback. Sempre garantir que:
        // 1. session.user.image seja SEMPRE definido (mesmo que null)
        // 2. Buscar avatar do banco para garantir valor atualizado
        // 3. Nunca usar apenas user.image sem fallback do banco
        // Se o avatar sumir, verificar este callback primeiro!
        
        // Include user ID in session for future feature integration
        session.user.id = user.id.toString()
        
        // Fetch user from database to ensure we have latest avatar
        // This ensures avatar is always up-to-date
        if (user.id) {
          const userId = parseInt(user.id)
          const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { avatar: true, name: true },
          })
          
          if (dbUser) {
            // ⚠️ CRÍTICO: Sempre definir image, mesmo que null
            session.user.image = dbUser.avatar || null
            session.user.name = dbUser.name || null
            
            // Debug: Log avatar status
            console.log("🔍 Session callback - Avatar do banco:", {
              userId,
              hasAvatar: !!dbUser.avatar,
              avatarValue: dbUser.avatar ? "TEM_AVATAR" : "SEM_AVATAR",
              name: dbUser.name || "SEM_NOME",
            })
          } else {
            // Fallback to user object from adapter
            session.user.image = user.image || null
            session.user.name = user.name || null
            console.warn("⚠️ Usuário não encontrado no banco no session callback")
          }
        } else {
          // Fallback to user object from adapter
          session.user.image = user.image || null
          session.user.name = user.name || null
        }
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Debug: Log redirect info
      console.log("Redirect callback:", {
        url,
        baseUrl,
        envNextAuthUrl: process.env.NEXTAUTH_URL,
        hasSecret: !!process.env.NEXTAUTH_SECRET,
        secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
      })
      
      // Redirect to home page after successful authentication
      if (url === baseUrl || url.startsWith(baseUrl + "/")) {
        return baseUrl
      }
      return baseUrl
    },
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/",
    error: "/?error=auth_failed",
  },
  events: {
    async signIn({ user, account }) {
      // Log successful sign in (server-side only)
      if (account?.provider === "twitter") {
        console.log(`User signed in: ${user.name} (${account.providerAccountId})`)
      }
    },
  },
}

