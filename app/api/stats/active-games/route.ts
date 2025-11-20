import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError } from "@/lib/utils/api-errors"

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
 * Mocked active games count for fallback
 * 
 * Note: In a real implementation, this would track active game sessions.
 * For now, we can estimate based on recent scores or use a mocked value.
 */
const MOCK_ACTIVE_GAMES = 5

/**
 * GET /api/stats/active-games
 * 
 * Returns the count of currently active games.
 * Can be mocked initially or based on recent scores.
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

    // Estimate active games based on scores created in the last 2 minutes
    // This is a proxy for "active games" - users playing right now
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)
    
    const recentScores = await prisma.score.findMany({
      where: {
        createdAt: {
          gte: twoMinutesAgo,
        },
      },
      select: {
        gameId: true,
        userId: true,
      },
      distinct: ['gameId', 'userId'], // Unique game+user combinations
    })

    // Count unique active games (different gameIds being played)
    const uniqueGames = new Set(recentScores.map(score => score.gameId))
    const count = uniqueGames.size

    // If no recent scores, use mocked count
    const result = count > 0 ? count : MOCK_ACTIVE_GAMES

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
        count: MOCK_ACTIVE_GAMES,
      },
      { status: 200 }
    )
  }
}

