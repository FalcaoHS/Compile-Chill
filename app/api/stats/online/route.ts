import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError } from "@/lib/api-errors"

/**
 * Cache structure for in-memory caching
 */
interface CacheEntry {
  count: number
  timestamp: number
}

/**
 * In-memory cache with TTL
 */
let cache: CacheEntry | null = null
const CACHE_TTL_MS = 8 * 1000 // 8 seconds (between 7-10 as specified)

/**
 * Mocked online count for fallback
 */
const MOCK_ONLINE_COUNT = 12

/**
 * GET /api/stats/online
 * 
 * Returns the count of currently online users (active sessions).
 * Falls back to mocked count if no data available.
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
          count: cache.count,
        },
        { status: 200 }
      )
    }

    // Count active sessions (not expired)
    const activeSessions = await prisma.session.count({
      where: {
        expires: {
          gt: new Date(), // Session not expired (active)
        },
      },
    })

    // Get unique users from active sessions
    const uniqueUsers = await prisma.session.findMany({
      where: {
        expires: {
          gt: new Date(),
        },
      },
      select: {
        userId: true,
      },
      distinct: ['userId'],
    })

    const count = uniqueUsers.length

    // If no active sessions, use mocked count
    const result = count > 0 ? count : MOCK_ONLINE_COUNT

    // Update cache
    cache = {
      count: result,
      timestamp: now,
    }

    return Response.json(
      {
        count: result,
      },
      { status: 200 }
    )
  } catch (error) {
    // On error, return mocked count
    return Response.json(
      {
        count: MOCK_ONLINE_COUNT,
      },
      { status: 200 }
    )
  }
}

