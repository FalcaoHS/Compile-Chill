import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import type { Adapter } from "next-auth/adapters"
import { logSessionCreated, logSessionDuplicate, logSessionDestroyed } from "@/lib/session-monitor"

// Get the default Prisma adapter
const defaultAdapter = PrismaAdapter(prisma) as Adapter

/**
 * Update user data from OAuth profile
 * 
 * Extracted from signIn callback for better maintainability.
 * Handles updating existing user with fresh OAuth data.
 * 
 * @param userId - Database user ID
 * @param name - User's display name
 * @param avatar - User's avatar URL
 * @param xUsername - User's X/Twitter username
 * @returns Updated user object or null if update failed
 */
export async function updateUserFromOAuth(
  userId: number,
  name: string,
  avatar: string | null,
  xUsername?: string | null
): Promise<{ id: number; name: string; avatar: string | null; xUsername?: string | null } | null> {
  try {
    console.log('🔄 [AUTH-ADAPTER] Updating user from OAuth:', {
      userId,
      name,
      hasAvatar: !!avatar,
      xUsername,
    })
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        avatar,
        ...(xUsername ? { xUsername } : {}),
        updatedAt: new Date(),
      },
    })
    
    console.log('✅ [AUTH-ADAPTER] User updated successfully:', {
      userId: updatedUser.id,
      name: updatedUser.name,
    })
    
    return updatedUser
  } catch (error) {
    // If xUsername field doesn't exist in schema, retry without it
    if (error instanceof Error && error.message.includes('xUsername')) {
      console.warn('⚠️  [AUTH-ADAPTER] Retrying user update without xUsername field')
      try {
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            name,
            avatar,
            updatedAt: new Date(),
          },
        })
        
        console.log('✅ [AUTH-ADAPTER] User updated (without xUsername):', {
          userId: updatedUser.id,
          name: updatedUser.name,
        })
        
        return updatedUser
      } catch (retryError) {
        console.error('❌ [AUTH-ADAPTER] Failed to update user on retry:', retryError)
        return null
      }
    }
    
    console.error('❌ [AUTH-ADAPTER] Failed to update user from OAuth:', error)
    return null
  }
}

// Custom adapter that extends PrismaAdapter to handle xId field and userId type conversion
export const authAdapter: Adapter = {
  ...defaultAdapter,
  
  async createUser(user) {
    // If user has xId (from Twitter/X OAuth), use it
    const xId = (user as any).xId
    const xUsername = (user as any).xUsername
    
    // If user has email and passwordHash (from Credentials provider), use them
    const email = (user as any).email
    const passwordHash = (user as any).passwordHash
    const nameEncrypted = (user as any).nameEncrypted
    
    if (xId) {
      // Twitter/X OAuth user - create with xId
      try {
        const newUser = await prisma.user.create({
          data: {
            xId,
            name: user.name || "",
            avatar: user.image || null,
            ...(xUsername ? { xUsername } : {}), // Only include if provided and field exists
          },
        })
        
        console.log('✅ [AUTH-ADAPTER] User created (X OAuth):', {
          userId: newUser.id,
          xId: newUser.xId,
          name: newUser.name,
        })
        
        return {
          id: newUser.id.toString(),
          name: newUser.name,
          email: null,
          emailVerified: null,
          image: newUser.avatar || null,
        } as any
      } catch (error) {
        console.error('❌ [AUTH-ADAPTER] Error creating X OAuth user:', error)
        throw error
      }
    } else if (email && passwordHash) {
      // Email/Password user - create with email and passwordHash
      try {
        const newUser = await prisma.user.create({
          data: {
            email,
            passwordHash,
            nameEncrypted: nameEncrypted || null,
            name: user.name || "", // Fallback name (will be decrypted from nameEncrypted when needed)
            avatar: user.image || null,
          },
        })
        
        console.log('✅ [AUTH-ADAPTER] User created (Email/Password):', {
          userId: newUser.id,
          email: newUser.email,
        })
        
        return {
          id: newUser.id.toString(),
          name: user.name || "Usuário",
          email: newUser.email,
          emailVerified: null,
          image: newUser.avatar || null,
        } as any
      } catch (error) {
        console.error('❌ [AUTH-ADAPTER] Error creating Email/Password user:', error)
        throw error
      }
    } else {
      // Google OAuth or other providers - create without xId
      // Note: Google users will complete setup on /setup-profile page
      try {
        const newUser = await prisma.user.create({
          data: {
            email: user.email || null,
            name: user.name || "",
            avatar: user.image || null,
            // Google users will have nameEncrypted set on /setup-profile
          },
        })
        
        console.log('✅ [AUTH-ADAPTER] User created (Google/Other):', {
          userId: newUser.id,
          email: newUser.email,
        })
        
        return {
          id: newUser.id.toString(),
          name: newUser.name,
          email: newUser.email,
          emailVerified: null,
          image: newUser.avatar || null,
        } as any
      } catch (error) {
        console.error('❌ [AUTH-ADAPTER] Error creating user (Google/Other):', error)
        throw error
      }
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
      console.error('❌ [AUTH-ADAPTER] Invalid userId in getUser:', id)
      return null
    }
    
    // Get user from database with avatar
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    
    if (!user) {
      console.warn('⚠️  [AUTH-ADAPTER] User not found:', userId)
      return null
    }
    
    console.log('✅ [AUTH-ADAPTER] User fetched:', {
      userId: user.id,
      name: user.name,
      hasAvatar: !!user.avatar,
    })
    
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
        return {
          id: user.id.toString(),
          name: user.name,
          email: null,
          emailVerified: null,
          image: user.avatar || null,
        } as any
      }
    }
    
    // For Google and other providers, use default adapter (searches by Account table)
    // This works because Account table has unique constraint on [provider, providerAccountId]
    if (provider === "google" || provider === "credentials") {
      return defaultAdapter.getUserByAccount!({ providerAccountId, provider })
    }
    
    // Fallback to default adapter behavior for any other provider
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
      console.error('❌ [AUTH-ADAPTER] Invalid userId for session creation:', session.userId)
      throw new Error(`Invalid userId: ${session.userId}`)
    }
    
    // 🔐 SECURITY: Check if session with this token already exists
    // This should NOT happen due to UNIQUE constraint, but we check defensively
    const existingSession = await prisma.session.findUnique({
      where: { sessionToken: session.sessionToken },
      include: { user: { select: { id: true, xId: true, name: true } } },
    })
    
    if (existingSession) {
      // 🚨 CRITICAL: Duplicate session token detected
      console.warn('⚠️  [AUTH-ADAPTER] Duplicate session token detected:', {
        sessionToken: session.sessionToken.substring(0, 8) + '...',
        existingUserId: existingSession.userId,
        newUserId: userId,
      })
      
      // Log duplicate detection for monitoring
      logSessionDuplicate(
        session.sessionToken,
        existingSession.userId,
        userId
      )
      
      // Delete old session before creating new one
      await prisma.session.delete({
        where: { sessionToken: session.sessionToken },
      })
      
      // Log destruction of duplicate session
      logSessionDestroyed(
        existingSession.userId,
        session.sessionToken,
        'duplicate'
      )
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
    
    // 📊 Log successful session creation
    console.log('✅ [AUTH-ADAPTER] Session created:', {
      sessionToken: session.sessionToken.substring(0, 8) + '...',
      userId,
      userName: createdSession.user.name,
      expires: session.expires,
    })
    
    logSessionCreated(userId, session.sessionToken)
    
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

