import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateQuery } from "@/lib/validations/validate"
import { paginationQuerySchema } from "@/lib/validations/query"
import { handleApiError } from "@/lib/api-errors"
import { getGame } from "@/lib/games"

/**
 * GET /api/scores/global-leaderboard
 * 
 * Returns the global leaderboard with best scores from all games combined.
 * Supports pagination with page and limit query parameters.
 * 
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Convert searchParams to object for validation
    const queryParams: Record<string, string | undefined> = {}
    searchParams.forEach((value, key) => {
      queryParams[key] = value
    })

    // Validate query parameters using Zod schema
    const { page, limit } = validateQuery(queryParams, paginationQuerySchema)

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get top scores across all games (only best scores)
    const [scores, total] = await Promise.all([
      prisma.score.findMany({
        where: {
          isBestScore: true,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          score: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.score.count({
        where: {
          isBestScore: true,
        },
      }),
    ])

    // Map scores with game information and rank
    const leaderboard = scores.map((score, index) => {
      const game = getGame(score.gameId)
      return {
        rank: skip + index + 1,
        id: score.id,
        score: score.score,
        duration: score.duration,
        moves: score.moves,
        level: score.level,
        metadata: score.metadata,
        createdAt: score.createdAt,
        gameId: score.gameId,
        gameName: game?.name || score.gameId,
        gameIcon: game?.icon || '🎮',
        user: {
          id: score.user.id,
          name: score.user.name,
          avatar: score.user.avatar,
        },
      }
    })

    return NextResponse.json(
      {
        leaderboard,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    // Use centralized error handler
    return handleApiError(error, request)
  }
}

