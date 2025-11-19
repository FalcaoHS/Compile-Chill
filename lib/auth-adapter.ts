import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import type { Adapter } from "next-auth/adapters"

// Get the default Prisma adapter
const defaultAdapter = PrismaAdapter(prisma) as Adapter

// Custom adapter that extends PrismaAdapter to handle xId field and userId type conversion
export const authAdapter: Adapter = {
  ...defaultAdapter,
  
  async createUser(user) {
    // If user has xId (from signIn callback), use it
    const xId = (user as any).xId
    const xUsername = (user as any).xUsername
    
    if (xId) {
      // createUser should only create NEW users
      // If user exists, NextAuth will use getUserByAccount instead
      // So we just create the user with xId
      try {
        const newUser = await prisma.user.create({
          data: {
            xId,
            name: user.name || "",
            avatar: user.image || null,
            ...(xUsername ? { xUsername } : {}), // Only include if provided and field exists
          },
        })
        
        // Return in the format NextAuth expects
        // ⚠️ ATENÇÃO: AVATAR - Sempre retornar image no createUser
        return {
          id: newUser.id.toString(),
          name: newUser.name,
          email: null,
          emailVerified: null,
          image: newUser.avatar || null, // ⚠️ CRÍTICO: Não remover este campo!
        } as any
      } catch (error) {
        // If error is about missing xUsername field, retry without it
        if (error instanceof Error && error.message.includes('xUsername')) {
          
          const newUser = await prisma.user.create({
            data: {
              xId,
              name: user.name || "",
              avatar: user.image || null,
            },
          })
          return {
            id: newUser.id.toString(),
            name: newUser.name,
            email: null,
            emailVerified: null,
            image: newUser.avatar || null,
          } as any
        }
        // Log error for debugging
        
        throw error // Re-throw if it's a different error
      }
    }
    
    // Fallback to default adapter behavior if no xId
    try {
      return await defaultAdapter.createUser!(user)
    } catch (error) {
      
      throw error
    }
  },
  
  async getUser(id) {
    // ⚠️ ATENÇÃO: AVATAR - NÃO REMOVER image DO RETORNO!
    // Este método é usado pelo NextAuth para buscar dados do usuário.
    // O campo 'image' DEVE sempre ser retornado (mesmo que null).
    // Se remover ou não retornar 'image', o avatar desaparecerá!
    
    
    
    // Convert id from string to int
    const userId = parseInt(id)
    
    if (isNaN(userId)) {
      return null
    }
    
    // Get user from database with avatar
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    
    if (!user) {
      return null
    }
    
    // Return in the format NextAuth expects
    // ⚠️ CRÍTICO: image DEVE ser sempre retornado (user.avatar || null)
    return {
      id: user.id.toString(),
      name: user.name,
      email: null,
      emailVerified: null,
      image: user.avatar || null, // ⚠️ NUNCA remover este campo!
    } as any
  },
  
  async getUserByAccount({ providerAccountId, provider }) {
    // Override to find user by xId for Twitter provider
    if (provider === "twitter") {
      
      
      const user = await prisma.user.findUnique({
        where: { xId: providerAccountId },
        include: {
          accounts: true,
          sessions: true,
        },
      })
      
      if (user) {
        // ⚠️ ATENÇÃO: AVATAR - Sempre retornar image (mesmo que null)
        return {
          id: user.id.toString(),
          name: user.name,
          email: null,
          emailVerified: null,
          image: user.avatar || null, // ⚠️ CRÍTICO: Não remover este campo!
        } as any
      }
    }
    
    // Fallback to default adapter behavior
    return defaultAdapter.getUserByAccount!({ providerAccountId, provider })
  },
  
  async linkAccount(account) {

    // Convert userId from string to int for Prisma
    const userId = parseInt(account.userId)
    
    if (isNaN(userId)) {
      throw new Error(`Invalid userId: ${account.userId}`)
    }

    // Check if account already exists (upsert pattern)
    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        },
      },
    })

    let linkedAccount

    if (existingAccount) {
      // Update existing account with new tokens
      linkedAccount = await prisma.account.update({
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
      // Create new account
      linkedAccount = await prisma.account.create({
        data: {
          userId,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
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

    return {
      ...linkedAccount,
      userId: linkedAccount.userId.toString(),
    } as any
  },
  
  async createSession(session) {
    // Convert userId from string to int for Prisma
    const userId = parseInt(session.userId)
    
    if (isNaN(userId)) {
      throw new Error(`Invalid userId: ${session.userId}`)
    }
    
    // Verificar se já existe uma sessão com este token (NÃO DEVE ACONTECER)
    const existingSession = await prisma.session.findUnique({
      where: { sessionToken: session.sessionToken },
      include: { user: { select: { id: true, xId: true, name: true } } },
    })
    
    if (existingSession) {
      // Deletar sessão antiga antes de criar nova (segurança)
      await prisma.session.delete({
        where: { sessionToken: session.sessionToken },
      })
    }
    
    // Create session with converted userId
    const createdSession = await prisma.session.create({
      data: {
        sessionToken: session.sessionToken,
        userId,
        expires: session.expires,
      },
      include: { user: { select: { id: true, xId: true, name: true } } },
    })
    
    return {
      ...createdSession,
      userId: createdSession.userId.toString(),
    } as any
  },
  
  async updateSession(session) {
    // Convert userId from string to int if provided
    const userId = session.userId ? parseInt(session.userId) : undefined
    
    if (userId !== undefined && isNaN(userId)) {
      throw new Error(`Invalid userId: ${session.userId}`)
    }
    
    // Update session
    const updatedSession = await prisma.session.update({
      where: { sessionToken: session.sessionToken },
      data: {
        ...(userId !== undefined && { userId }),
        ...(session.expires && { expires: session.expires }),
      },
    })
    
    return {
      ...updatedSession,
      userId: updatedSession.userId.toString(),
    } as any
  },
}

