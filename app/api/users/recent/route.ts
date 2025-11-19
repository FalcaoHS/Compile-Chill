import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError } from "@/lib/api-errors"

/**
 * Cache structure for in-memory caching
 */
interface CacheEntry {
  data: UserData[]
  timestamp: number
}

interface UserData {
  userId: number
  avatar: string | null
  username: string
  lastLogin: string
}

/**
 * In-memory cache with TTL
 */
let cache: CacheEntry | null = null
const CACHE_TTL_MS = 3 * 1000 // 3 seconds (reduced to update avatars faster)

/**
 * Fake user profiles for fallback
 */
const FAKE_PROFILES: UserData[] = [
  {
    userId: -1,
    avatar: null,
    username: "DevBot",
    lastLogin: new Date().toISOString(),
  },
  {
    userId: -2,
    avatar: null,
    username: "CodeNinja",
    lastLogin: new Date().toISOString(),
  },
  {
    userId: -3,
    avatar: null,
    username: "PixelWizard",
    lastLogin: new Date().toISOString(),
  },
  {
    userId: -4,
    avatar: null,
    username: "NeonCoder",
    lastLogin: new Date().toISOString(),
  },
  {
    userId: -5,
    avatar: null,
    username: "TerminalMaster",
    lastLogin: new Date().toISOString(),
  },
  {
    userId: -6,
    avatar: null,
    username: "ByteRunner",
    lastLogin: new Date().toISOString(),
  },
  {
    userId: -7,
    avatar: null,
    username: "StackHero",
    lastLogin: new Date().toISOString(),
  },
  {
    userId: -8,
    avatar: null,
    username: "BugHunter",
    lastLogin: new Date().toISOString(),
  },
]

/**
 * GET /api/users/recent
 * 
 * Returns the last 10 users who logged in within the last 5 minutes.
 * Uses active sessions to determine recent login activity.
 * Falls back to fake profiles if no users are available.
 * 
 * Public access (no authentication required).
 * Cached for 5-10 seconds to reduce database load.
 */
export async function GET(request: NextRequest) {
  try {
    // Check cache
    const now = Date.now()
    if (cache && (now - cache.timestamp) < CACHE_TTL_MS) {
      return NextResponse.json(
        {
          users: cache.data,
        },
        { status: 200 }
      )
    }

    

    // Calculate time threshold (5 minutes ago)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

    // Find users with active sessions (not expired)
    // Note: Session model doesn't have createdAt, so we use expires to filter recent sessions
    // Sessions that expire in the future and were likely created recently
    const recentSessions = await prisma.session.findMany({
      where: {
        expires: {
          gt: new Date(), // Session not expired (active sessions)
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            xId: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        expires: "desc", // Order by expiration (newer sessions expire later)
      },
      take: 10,
    })

    // Also check users with recent profile updates (fallback if no recent sessions)
    let users: UserData[] = []

    if (recentSessions.length > 0) {
      // Use session data
      const uniqueUsers = new Map<number, UserData>()

      for (const session of recentSessions) {
        if (!uniqueUsers.has(session.userId)) {
          const userData: UserData = {
            userId: session.user.id,
            avatar: session.user.avatar,
            username: session.user.xId || session.user.name || "Unknown",
            lastLogin: session.user.updatedAt.toISOString(), // Use user's updatedAt as proxy for last activity
          }
          
          // Debug: Log avatar status
          
          
          uniqueUsers.set(session.userId, userData)
        }
      }

      users = Array.from(uniqueUsers.values()).slice(0, 10)
    } else {
      // Fallback: check users with recent profile updates
      const recentUsers = await prisma.user.findMany({
        where: {
          updatedAt: {
            gte: fiveMinutesAgo,
          },
        },
        select: {
          id: true,
          name: true,
          avatar: true,
          xId: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 10,
      })

      users = recentUsers.map((user) => {
        const userData: UserData = {
          userId: user.id,
          avatar: user.avatar,
          username: user.xId || user.name || "Unknown",
          lastLogin: user.updatedAt.toISOString(),
        }
        
        // Debug: Log avatar status
        
        
        return userData
      })
    }

    // If no users found, use fake profiles
    if (users.length === 0) {
      users = FAKE_PROFILES.slice(0, 10)
    } else if (users.length < 10) {
      // Fill remaining slots with fake profiles if needed
      const remaining = 10 - users.length
      users = [...users, ...FAKE_PROFILES.slice(0, remaining)]
    }

    // Ensure we never return more than 10 users
    const result = users.slice(0, 10)

    // Update cache
    cache = {
      data: result,
      timestamp: now,
    }

    return Response.json(
      {
        users: result,
      },
      { status: 200 }
    )
  } catch (error) {
    return handleApiError(error, request)
  }
}

