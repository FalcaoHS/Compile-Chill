import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { scoreSubmissionSchema } from "@/lib/validations/score"
import { scoresQuerySchema } from "@/lib/validations/query"
import { validate, validateQuery } from "@/lib/validations/validate"
import { withAuthAndRateLimit } from "@/lib/api-rate-limit"
import { getScoreSubmissionLimiter } from "@/lib/rate-limit"
import { getAuthenticatedUser } from "@/lib/api-auth"
import { handleApiError, ApiErrors } from "@/lib/api-errors"

// Force Node.js runtime to avoid Prisma Edge Runtime issues
export const runtime = 'nodejs'

/**
 * POST /api/scores
 * 
 * Saves a new game score to the database.
 * Requires authentication and rate limiting (10 requests/minute per user).
 */
export const POST = withAuthAndRateLimit(
  async (request: NextRequest, user) => {
    try {
      // Parse and validate request body
      const body = await request.json()
      
      // Log suspicious score attempts before validation
      if (body.score > 1_000_000) {
        console.warn('🚨 [ANTI-CHEAT] Score manipulation attempt detected:', {
          userId: user.id,
          userName: user.name,
          gameId: body.gameId,
          attemptedScore: body.score,
          timestamp: new Date().toISOString(),
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        })
      }
      
      const { gameId, score, duration, moves, level, metadata } = validate(
        body,
        scoreSubmissionSchema
      )

      const userId = parseInt(user.id)

      // Use Prisma transaction to handle isBestScore flag atomically
      const result = await prisma.$transaction(async (tx) => {
        // Check if user has a previous best score for this game
        const previousBest = await tx.score.findFirst({
          where: {
            userId,
            gameId,
            isBestScore: true,
          },
        })

        // Determine if this is a new best score
        const isNewBest = !previousBest || score > previousBest.score

        // Create new score
        const newScore = await tx.score.create({
          data: {
            userId,
            gameId,
            score,
            duration: duration ?? null,
            moves: moves ?? null,
            level: level ?? null,
            metadata: metadata ?? null,
            isBestScore: isNewBest,
          },
        })

        // If this is a new best, update the previous best
        if (isNewBest && previousBest) {
          await tx.score.update({
            where: { id: previousBest.id },
            data: { isBestScore: false },
          })
        }

        return newScore
      })

      return NextResponse.json(
        {
          id: result.id,
          gameId: result.gameId,
          score: result.score,
          duration: result.duration,
          moves: result.moves,
          level: result.level,
          metadata: result.metadata,
          isBestScore: result.isBestScore,
          createdAt: result.createdAt,
        },
        { status: 201 }
      )
    } catch (error) {
      return handleApiError(error, request)
    }
  },
  {
    limiter: getScoreSubmissionLimiter(),
  }
)

/**
 * GET /api/scores
 * 
 * Lists scores with optional filtering.
 * Supports query parameters: gameId, userId, page, limit
 * 
 * If filtering by userId, requires authentication and ensures user can only query their own scores.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Convert searchParams to object for validation
    const queryParams: Record<string, string | undefined> = {}
    searchParams.forEach((value, key) => {
      queryParams[key] = value
    })

    // Validate query parameters
    const { gameId, userId, page, limit } = validateQuery(queryParams, scoresQuerySchema)

    // If filtering by userId, require authentication and ensure user can only query their own scores
    if (userId !== undefined) {
      const user = await getAuthenticatedUser(request)
      
      if (!user) {
        return NextResponse.json(
          {
            error: {
              code: "unauthorized",
              message: "Não autorizado",
            },
          },
          { status: 401 }
        )
      }

      const authenticatedUserId = parseInt(user.id)

      // Users can only query their own scores
      if (authenticatedUserId !== userId) {
        throw ApiErrors.forbidden("Você só pode consultar seus próprios scores")
      }
    }

    // Build where clause
    const where: any = {}
    if (gameId) {
      where.gameId = gameId
    }
    if (userId !== undefined) {
      where.userId = userId
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get scores with user information
    const [scores, total] = await Promise.all([
      prisma.score.findMany({
        where,
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
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.score.count({ where }),
    ])

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
    return handleApiError(error, request)
  }
}

