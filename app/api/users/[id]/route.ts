import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError, ApiErrors } from "@/lib/api-errors"

/**
 * GET /api/users/[id]
 * 
 * Returns public user profile data.
 * Respects privacy settings - if showPublicHistory is false,
 * returns only avatar, name, and privacy message.
 * Public access (no authentication required).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)

    if (isNaN(userId)) {
      throw ApiErrors.badRequest("ID de usuário inválido")
    }

    // Get user profile data from database
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatar: true,
        xId: true,
        showPublicHistory: true,
        createdAt: true,
      },
    })

    if (!dbUser) {
      throw ApiErrors.notFound("Usuário não encontrado")
    }

    // If privacy is disabled, return minimal data
    if (!dbUser.showPublicHistory) {
      return Response.json(
        {
          user: {
            id: dbUser.id,
            name: dbUser.name,
            avatar: dbUser.avatar,
            handle: dbUser.xId,
            isPrivate: true,
            message: "Este usuário mantém o histórico privado",
          },
        },
        { status: 200 }
      )
    }

    // Get public scores (best scores per game)
    const bestScores = await prisma.score.findMany({
      where: {
        userId,
        isBestScore: true,
      },
      select: {
        gameId: true,
        score: true,
        createdAt: true,
      },
      orderBy: {
        score: "desc",
      },
    })

    // If no best scores marked, get highest score per game
    const allScores = await prisma.score.findMany({
      where: { userId },
      select: {
        gameId: true,
        score: true,
        createdAt: true,
      },
      orderBy: {
        score: "desc",
      },
    })

    // Group by game and get highest score per game
    const bestScoresByGame: Record<string, { score: number; createdAt: Date }> = {}
    allScores.forEach((score) => {
      const existing = bestScoresByGame[score.gameId]
      if (!existing || score.score > existing.score) {
        bestScoresByGame[score.gameId] = {
          score: score.score,
          createdAt: score.createdAt,
        }
      }
    })

    // Calculate total games played (public stat)
    const totalGames = await prisma.score.count({
      where: { userId },
    })

    return Response.json(
      {
        user: {
          id: dbUser.id,
          name: dbUser.name,
          avatar: dbUser.avatar,
          handle: dbUser.xId,
          joinDate: dbUser.createdAt,
          isPrivate: false,
          stats: {
            totalGames,
            bestScoresByGame: Object.entries(bestScoresByGame).map(([gameId, data]) => ({
              gameId,
              score: data.score,
              achievedAt: data.createdAt,
            })),
          },
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return handleApiError(error, request)
  }
}

