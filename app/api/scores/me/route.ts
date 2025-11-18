import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getGame } from "@/lib/games"
import { withAuth } from "@/lib/api-auth"
import { handleApiError, ApiErrors } from "@/lib/api-errors"

/**
 * GET /api/scores/me
 * 
 * Returns all scores for the authenticated user.
 * Supports optional gameId query parameter to filter by specific game.
 */
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get("gameId")
    const userId = parseInt(user.id)

    // If gameId is provided, validate it exists
    if (gameId) {
      const game = getGame(gameId)
      if (!game) {
        throw ApiErrors.notFound("Jogo não encontrado")
      }
    }

    // Build where clause
    const where: any = {
      userId,
    }
    if (gameId) {
      where.gameId = gameId
    }

    // Get user's scores
    const scores = await prisma.score.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        gameId: true,
        score: true,
        duration: true,
        moves: true,
        level: true,
        metadata: true,
        isBestScore: true,
        createdAt: true,
        updatedAt: true,
      },
    })

      return NextResponse.json(
      {
        scores: scores.map((score) => ({
          id: score.id,
          gameId: score.gameId,
          score: score.score,
          duration: score.duration,
          moves: score.moves,
          level: score.level,
          metadata: score.metadata,
          isBestScore: score.isBestScore,
          createdAt: score.createdAt,
          updatedAt: score.updatedAt,
        })),
        total: scores.length,
      },
      { status: 200 }
    )
  } catch (error) {
    return handleApiError(error, request)
  }
})

