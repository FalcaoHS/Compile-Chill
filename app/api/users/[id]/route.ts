import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError, ApiErrors } from "@/lib/utils/api-errors"

/**
 * GET /api/users/[id]
 * 
 * Returns public user profile data.
 * Accepts either numeric user ID or username slug (xUsername).
 * Respects privacy settings - if showPublicHistory is false,
 * returns only avatar, name, and privacy message.
 * Public access (no authentication required).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Try to parse as numeric ID first
    const numericId = parseInt(params.id)
    const isNumericId = !isNaN(numericId)

    let dbUser

    if (isNumericId) {
      // Search by numeric ID
      dbUser = await prisma.user.findUnique({
        where: { id: numericId },
        select: {
          id: true,
          name: true,
          avatar: true,
          xId: true,
          xUsername: true,
          showPublicHistory: true,
          createdAt: true,
        },
      })
    } else {
      // Search by username slug (remove @ if present)
      const cleanSlug = params.id.replace(/^@/, '')
      
      dbUser = await prisma.user.findFirst({
        where: {
          xUsername: cleanSlug,
        },
        select: {
          id: true,
          name: true,
          avatar: true,
          xId: true,
          xUsername: true,
          showPublicHistory: true,
          createdAt: true,
        },
      })

      // If not found by xUsername, try xId as fallback
      if (!dbUser) {
        dbUser = await prisma.user.findFirst({
          where: {
            xId: cleanSlug,
          },
          select: {
            id: true,
            name: true,
            avatar: true,
            xId: true,
            xUsername: true,
            showPublicHistory: true,
            createdAt: true,
          },
        })
      }
    }

    if (!dbUser) {
      throw ApiErrors.notFound("Usuário não encontrado")
    }

    const userId = dbUser.id

    // If privacy is disabled, return minimal data
    if (!dbUser.showPublicHistory) {
      return NextResponse.json(
        {
          user: {
            id: dbUser.id,
            name: dbUser.name,
            avatar: dbUser.avatar,
            handle: dbUser.xUsername || dbUser.xId, // Prefer xUsername, fallback to xId
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
          handle: dbUser.xUsername || dbUser.xId, // Prefer xUsername, fallback to xId
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

