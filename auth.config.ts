import Twitter from "next-auth/providers/twitter"
import { authAdapter, updateUserFromOAuth } from "@/lib/auth/adapter"
import { prisma } from "@/lib/prisma"
import type { NextAuthConfig } from "next-auth"
import { validateAndLogAuthEnvironment } from "@/lib/auth/env-validation"
import { logSessionUserMismatch } from "@/lib/session-monitor"

// 🔐 SECURITY: Validate authentication environment variables on server startup
// This prevents runtime errors and security misconfigurations
validateAndLogAuthEnvironment()

// 🍪 Extract cookie domain from NEXTAUTH_URL for proper cookie scoping
function getCookieDomain(): string | undefined {
  const nextauthUrl = process.env.NEXTAUTH_URL
  if (!nextauthUrl) return undefined
  
  try {
    const url = new URL(nextauthUrl)
    // Don't set domain for localhost (allows it to work in development)
    if (url.hostname === 'localhost') return undefined
    // Set domain with leading dot for subdomain support (e.g., .compileandchill.dev)
    return `.${url.hostname}`
  } catch {
    return undefined
  }
}

export const authConfig: NextAuthConfig = {
  // 🔐 CRÍTICO: Secret para criptografia de sessões
  // Sem isso, sessões podem vazar entre usuários!
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  adapter: authAdapter,
  
  // 🍪 SECURITY: Explicit cookie configuration to prevent session leakage
  // Without this, NextAuth uses defaults that may be incorrect for custom domains
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? `__Secure-next-auth.session-token` 
        : `next-auth.session-token`,
      options: {
        httpOnly: true, // Prevent client-side JavaScript access
        sameSite: 'lax', // CSRF protection while allowing normal navigation
        path: '/', // Cookie available across entire site
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        domain: getCookieDomain(), // Extracted from NEXTAUTH_URL
      },
    },
  },
  
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
                  
                }
                
                // Atualizar avatar se não tiver (priorizar HTTPS)
                if (!avatar) {
                  avatar = apiUser?.profile_image_url_https || apiUser?.profile_image_url || null
                  if (avatar) {
                    
                  }
                }
                
                // Atualizar xUsername se não tiver
                if (!xUsername && apiUser?.username) {
                  xUsername = apiUser.username
                  
                }
              }
            } catch (apiError) {
              // Não bloquear login se a API falhar
            }
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
              // Apenas anexar xId/xUsername e deixar o adapter criar
              if (!user.id || typeof user.id === 'string') {
                (user as any).xId = xId
                if (xUsername) {
                  (user as any).xUsername = xUsername
                }
              }
              return true
            }
            
            // Update user with fresh OAuth data using extracted utility function
            await updateUserFromOAuth(userId, name, avatar, xUsername)

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
        
        // Debug: Log qual usuário está sendo usado na sessão
        
        
        // Fetch user from database to ensure we have latest avatar
        // This ensures avatar is always up-to-date
        if (user.id) {
          const userId = parseInt(user.id)
          
          try {
            const dbUser = await prisma.user.findUnique({
              where: { id: userId },
              select: { 
                id: true,
                avatar: true, 
                name: true,
                xId: true,
                xUsername: true,
              },
            })
            
            if (dbUser) {
              // 🔐 SECURITY: Validate user ID match to prevent session leakage
              if (dbUser.id !== userId) {
                // 🚨 CRITICAL: User ID mismatch detected!
                console.error('🚨 [SESSION-CALLBACK] CRITICAL: User ID mismatch detected!', {
                  sessionUserId: userId,
                  dbUserId: dbUser.id,
                  sessionUserName: session.user.name,
                  dbUserName: dbUser.name,
                })
                
                logSessionUserMismatch(
                  session.user.id || 'unknown',
                  userId,
                  dbUser.id
                )
                
                // Return existing session data as fallback (safer than returning wrong user)
                return session
              }
              
              // ⚠️ CRÍTICO: Sempre definir image, mesmo que null
              session.user.image = dbUser.avatar || null
              session.user.name = dbUser.name || null
              
              console.log('✅ [SESSION-CALLBACK] Session refreshed:', {
                userId: dbUser.id,
                name: dbUser.name,
                hasAvatar: !!dbUser.avatar,
              })
            } else {
              // User not found in database
              console.warn('⚠️  [SESSION-CALLBACK] User not found in database:', userId)
              
              // Fallback to user object from adapter
              session.user.image = user.image || null
              session.user.name = user.name || null
            }
          } catch (error) {
            // Database query failed
            console.error('❌ [SESSION-CALLBACK] Error fetching user:', error)
            
            // Fallback to user object from adapter (safer than failing)
            session.user.image = user.image || null
            session.user.name = user.name || null
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
      // Authentication successful
    },
  },
}

