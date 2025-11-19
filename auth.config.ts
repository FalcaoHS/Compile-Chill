import Twitter from "next-auth/providers/twitter"
import { authAdapter } from "@/lib/auth-adapter"
import { prisma } from "@/lib/prisma"
import type { NextAuthConfig } from "next-auth"

// Configure Twitter provider using OAuth 2.0.
// We cast the options to `any` to allow passing the `version` field
// and a custom `profile` mapper, which are supported at runtime even
// though not fully covered by the TS types yet.
const twitterProvider = Twitter({
  clientId: process.env.X_CLIENT_ID!,
  clientSecret: process.env.X_CLIENT_SECRET!,
  version: "2.0",
  async profile(profile: any) {
    // A API Free às vezes retorna formatos diferentes, então normalizamos:
    // - { data: { id, name, username, profile_image_url } }
    // - ou o objeto direto com esses campos na raiz
    const user = profile?.data ?? profile ?? {}

    return {
      id: user.id ?? crypto.randomUUID(), // obrigatório para o NextAuth
      // Deixa o nome cru; fallbacks são aplicados depois no callback de signIn
      name: typeof user.name === "string" ? user.name : null,
      // Username pode vir em campos diferentes
      username: user.username ?? user.screen_name ?? null,
      // Deixa o avatar o mais fiel possível ao que a API retornar,
      // sem forçar placeholder aqui (o callback de sessão faz o fallback certo).
      image: user.profile_image_url ?? user.profile_image_url_https ?? null,
    }
  },
} as any)

export const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  adapter: authAdapter,
  providers: [twitterProvider],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "twitter" && account.providerAccountId) {
        try {
          // Provider-specific id do X (Twitter)
          const xId = account.providerAccountId

          // Extrair dados básicos do perfil com fallbacks seguros
          const rawProfile: any = profile ?? {}
          // Username pode vir em campos diferentes
          const xUsername =
            rawProfile.username ||
            rawProfile.screen_name ||
            (rawProfile.data && rawProfile.data.username) ||
            null

          const name =
            rawProfile.name ||
            user.name ||
            null

          // Se não veio nome nenhum do X, não criamos usuário "anônimo":
          // preferimos barrar o login para evitar cadastro lixo.
          if (!name) {
            console.error("⚠️ signIn: X profile sem name. Bloqueando criação de usuário.", {
              xId,
              rawProfileHasName: !!rawProfile.name,
              userHasName: !!user.name,
              xUsername,
            })
            return false
          }

          // ⚠️ Avatar: voltar ao comportamento original que funcionava bem
          // Preferimos sempre o profile_image_url_https da API do X.
          const avatar =
            (typeof rawProfile.profile_image_url_https === "string"
              ? rawProfile.profile_image_url_https
              : null) ||
            (typeof user.image === "string" ? user.image : null) ||
            null

          // Log básico (sem tokens)
          console.log("Account token received:", {
            hasAccessToken: !!account.access_token,
            tokenLength: account.access_token?.length ?? 0,
            tokenType: account.token_type,
            hasRefreshToken: !!account.refresh_token,
            expiresAt: account.expires_at,
            scope: account.scope,
          })

          // Anexar xId/xUsername para o adapter usar em createUser / linkAccount
          ;(user as any).xId = xId
          if (xUsername) {
            ;(user as any).xUsername = xUsername
          }

          // Garantir name/image consistentes para o adapter (sem fallback de "Anonymous Dev")
          user.name = name
          user.image = avatar || undefined

          // Deixar criação/atualização no banco a cargo do adapter (authAdapter)
          return true
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
          } else {
            // Fallback to user object from adapter
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

