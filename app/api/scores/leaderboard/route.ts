import { NextRequest, NextResponse } from "next/server"
import { getGame } from "@/lib/games"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/scores/leaderboard
 * 
 * Returns the global leaderboard for a specific game.
 * Requires gameId query parameter.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get("gameId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    // Validate gameId
    if (!gameId) {
      return NextResponse.json(
        { error: "gameId é obrigatório" },
        { status: 400 }
      )
    }

    // Validate gameId exists
    const game = getGame(gameId)
    if (!game) {
      return NextResponse.json(
        { error: "Jogo não encontrado" },
        { status: 404 }
      )
    }

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Parâmetros de paginação inválidos" },
        { status: 400 }
      )
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get top scores for this game (only best scores)
    const [scores, total] = await Promise.all([
      prisma.score.findMany({
        where: {
          gameId,
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
          gameId,
          isBestScore: true,
        },
      }),
    ])

    return NextResponse.json(
      {
        gameId,
        gameName: game.name,
        leaderboard: scores.map((score, index) => ({
          rank: skip + index + 1,
          id: score.id,
          score: score.score,
          duration: score.duration,
          moves: score.moves,
          level: score.level,
          metadata: score.metadata,
          createdAt: score.createdAt,
          user: {
            id: score.user.id,
            name: score.user.name,
            avatar: score.user.avatar,
          },
        })),
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
    // Log detailed error server-side only
    
    
    // Return generic error message to frontend
    return NextResponse.json(
      { error: "Não foi possível buscar o leaderboard. Tente novamente." },
      { status: 500 }
    )
  }
}

