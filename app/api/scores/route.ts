import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { scoreSubmissionSchema } from "@/lib/validations/score"
import { scoresQuerySchema } from "@/lib/validations/query"
import { validate, validateQuery } from "@/lib/validations/validate"
import { withAuthAndRateLimit } from "@/lib/utils/api-rate-limit"
import { getScoreSubmissionLimiter } from "@/lib/rate-limit"
import { getAuthenticatedUser } from "@/lib/utils/api-auth"
import { handleApiError, ApiErrors } from "@/lib/utils/api-errors"

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
      
      // PT: Log de tentativas suspeitas antes da validação | EN: Log suspicious attempts before validation | ES: Registro de intentos sospechosos antes de validación | FR: Journalisation tentatives suspectes avant validation | DE: Protokollierung verdächtiger Versuche vor Validierung
      // PT: Nota: Jogos idle como crypto-miner podem legitimamente chegar a bilhões | EN: Note: Idle games like crypto-miner can legitimately reach billions | ES: Nota: Juegos idle como crypto-miner pueden legítimamente llegar a billones | FR: Note: Jeux idle comme crypto-miner peuvent légitimement atteindre milliards | DE: Hinweis: Idle-Spiele wie crypto-miner können legitimerweise Milliarden erreichen
      if (body.score > 100_000_000_000) {
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

      // PT: Transação Prisma garante atomicidade ao atualizar isBestScore | EN: Prisma transaction ensures atomicity when updating isBestScore | ES: Transacción Prisma garantiza atomicidad al actualizar isBestScore | FR: Transaction Prisma garantit l'atomicité lors de la mise à jour isBestScore | DE: Prisma-Transaktion gewährleistet Atomarität beim Aktualisieren von isBestScore
      const result = await prisma.$transaction(async (tx) => {
        // PT: Verifica se usuário já tem melhor score para este jogo | EN: Check if user has previous best score for this game | ES: Verifica si usuario ya tiene mejor puntuación para este juego | FR: Vérifie si l'utilisateur a déjà un meilleur score pour ce jeu | DE: Prüft, ob Benutzer bereits beste Punktzahl für dieses Spiel hat
        const previousBest = await tx.score.findFirst({
          where: {
            userId,
            gameId,
            isBestScore: true,
          },
        })

        // PT: Determina se é novo recorde (primeiro score ou maior que anterior) | EN: Determine if this is new best (first score or higher than previous) | ES: Determina si es nuevo récord (primer score o mayor que anterior) | FR: Détermine si c'est un nouveau record (premier score ou supérieur) | DE: Bestimmt, ob dies neuer Rekord ist (erster Score oder höher)
        const isNewBest = !previousBest || score > previousBest.score

        // PT: Cria novo score com flag isBestScore | EN: Create new score with isBestScore flag | ES: Crea nuevo score con flag isBestScore | FR: Crée nouveau score avec flag isBestScore | DE: Erstellt neuen Score mit isBestScore-Flag
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

        // PT: Se é novo recorde, remove flag do anterior (garante apenas 1 isBestScore por jogo) | EN: If new best, remove flag from previous (ensures only 1 isBestScore per game) | ES: Si es nuevo récord, quita flag del anterior (garantiza solo 1 isBestScore por juego) | FR: Si nouveau record, retire flag du précédent (garantit 1 seul isBestScore par jeu) | DE: Wenn neuer Rekord, entfernt Flag vom vorherigen (stellt sicher, dass nur 1 isBestScore pro Spiel)
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

