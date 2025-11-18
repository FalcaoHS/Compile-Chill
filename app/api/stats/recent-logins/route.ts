import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError } from "@/lib/api-errors"

/**
 * Cache structure for in-memory caching
 */
interface CacheEntry {
  logins: RecentLogin[]
  timestamp: number
}

interface RecentLogin {
  username: string
  timestamp: string
}

/**
 * In-memory cache with TTL
 */
let cache: CacheEntry | null = null
const CACHE_TTL_MS = 8 * 1000 // 8 seconds (between 7-10 as specified)

/**
 * Mocked recent logins for fallback
 */
const MOCK_LOGINS: RecentLogin[] = [
  {
    username: "DevBot",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
  },
  {
    username: "CodeNinja",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
  },
  {
    username: "PixelWizard",
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
  },
  {
    username: "NeonCoder",
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 minutes ago
  },
  {
    username: "TerminalMaster",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
  },
]

/**
 * GET /api/stats/recent-logins
 * 
 * Returns the last 5-10 recent user logins with username and timestamp.
 * Uses active sessions to determine recent login activity.
 * Falls back to mocked logins if no data available.
 * 
 * Public access (no authentication required).
 * Cached for 7-10 seconds to reduce database load.
 */
export async function GET(request: NextRequest) {
  try {
    // Check cache
    const now = Date.now()
    if (cache && (now - cache.timestamp) < CACHE_TTL_MS) {
      return NextResponse.json(
        {
          logins: cache.logins,
        },
        { status: 200 }
      )
    }

    // Find recent active sessions (not expired)
    const recentSessions = await prisma.session.findMany({
      where: {
        expires: {
          gt: new Date(), // Session not expired (active)
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            xId: true,
            xUsername: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        expires: "desc", // Order by expiration (newer sessions expire later)
      },
      take: 10,
    })

    // Extract unique users with their login time
    const uniqueUsers = new Map<number, RecentLogin>()

    for (const session of recentSessions) {
      if (!uniqueUsers.has(session.userId)) {
        const username = session.user.xUsername || session.user.xId || session.user.name
        uniqueUsers.set(session.userId, {
          username,
          timestamp: session.user.updatedAt.toISOString(), // Use user's updatedAt as proxy for last activity
        })
      }
    }

    let logins: RecentLogin[] = Array.from(uniqueUsers.values()).slice(0, 10)

    // If no recent logins, use mocked data
    if (logins.length === 0) {
      logins = MOCK_LOGINS
    } else if (logins.length < 5) {
      // Fill remaining slots with mocked logins if needed
      const remaining = 5 - logins.length
      logins = [...logins, ...MOCK_LOGINS.slice(0, remaining)]
    }

    // Ensure we return 5-10 logins
    const result = logins.slice(0, 10)

    // Update cache
    cache = {
      logins: result,
      timestamp: now,
    }

    return Response.json(
      {
        logins: result,
      },
      { status: 200 }
    )
  } catch (error) {
    // On error, return mocked logins
    return Response.json(
      {
        logins: MOCK_LOGINS,
      },
      { status: 200 }
    )
  }
}

