import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/api-auth"
import { handleApiError } from "@/lib/api-errors"
import { getAllGames } from "@/lib/games"

/**
 * GET /api/users/me/stats
 * 
 * Returns user statistics: total games played, best scores per game,
 * average duration, favorite games, best streak, activity distribution.
 * Requires authentication.
 */
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const userId = parseInt(user.id)

    // Get all user scores in a single query to prevent N+1
    const scores = await prisma.score.findMany({
      where: { userId },
      select: {
        gameId: true,
        score: true,
        duration: true,
        createdAt: true,
        isBestScore: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Calculate statistics
    const totalGames = scores.length

    // Best score per game
    const bestScoresByGame: Record<string, number> = {}
    scores.forEach((score) => {
      if (score.isBestScore) {
        const currentBest = bestScoresByGame[score.gameId] || 0
        if (score.score > currentBest) {
          bestScoresByGame[score.gameId] = score.score
        }
      }
    })

    // If no best scores marked, find highest score per game
    const allGames = getAllGames()
    allGames.forEach((game) => {
      if (!bestScoresByGame[game.id]) {
        const gameScores = scores.filter((s) => s.gameId === game.id)
        if (gameScores.length > 0) {
          bestScoresByGame[game.id] = Math.max(...gameScores.map((s) => s.score))
        }
      }
    })

    // Average duration (in seconds)
    const durations = scores.filter((s) => s.duration !== null).map((s) => s.duration!)
    const averageDuration = durations.length > 0
      ? Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length)
      : 0

    // Favorite games (most played)
    const gameCounts: Record<string, number> = {}
    scores.forEach((score) => {
      gameCounts[score.gameId] = (gameCounts[score.gameId] || 0) + 1
    })
    const favoriteGames = Object.entries(gameCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([gameId, count]) => ({
        gameId,
        count,
        name: allGames.find((g) => g.id === gameId)?.name || gameId,
      }))

    // Best streak (consecutive days with at least one game)
    // Group scores by date
    const scoresByDate = new Map<string, number>()
    scores.forEach((score) => {
      const date = score.createdAt.toISOString().split("T")[0]
      scoresByDate.set(date, (scoresByDate.get(date) || 0) + 1)
    })

    // Calculate longest streak
    const dates = Array.from(scoresByDate.keys()).sort()
    let bestStreak = 0
    let currentStreak = 0
    let lastDate: Date | null = null

    dates.forEach((dateStr) => {
      const date = new Date(dateStr)
      if (lastDate) {
        const daysDiff = Math.floor(
          (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        if (daysDiff === 1) {
          currentStreak++
        } else {
          bestStreak = Math.max(bestStreak, currentStreak)
          currentStreak = 1
        }
      } else {
        currentStreak = 1
      }
      lastDate = date
    })
    bestStreak = Math.max(bestStreak, currentStreak)

    // Activity time distribution (hour of day when user plays most)
    const hourCounts = new Array(24).fill(0)
    scores.forEach((score) => {
      const hour = score.createdAt.getHours()
      hourCounts[hour]++
    })
    const mostActiveHour = hourCounts.indexOf(Math.max(...hourCounts))

    // Highest global score
    const highestScore = scores.length > 0
      ? Math.max(...scores.map((s) => s.score))
      : 0

    return NextResponse.json(
      {
        stats: {
          totalGames,
          averageDuration,
          highestScore,
          bestScoresByGame,
          favoriteGames,
          bestStreak,
          mostActiveHour,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return handleApiError(error, request)
  }
})

