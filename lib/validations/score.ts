import { z } from "zod"
import { getGame } from "@/lib/games"
import { getGameStateSchema } from "@/lib/validations/game-state"

/**
 * Maximum reasonable score per game to prevent cheating
 * This is a generous limit that should accommodate legitimate high scores
 * while blocking obvious manipulation (e.g., 900 million points)
 */
const MAX_SCORE = 1_000_000 // 1 million points max

/**
 * Zod schema for score submission validation
 * 
 * 🔒 SECURITY: Score is validated to prevent client-side manipulation
 * - Must be a positive integer
 * - Cannot exceed MAX_SCORE (1 million)
 * - Cannot be negative
 */
export const scoreSubmissionSchema = z.object({
  gameId: z.string(),
  score: z
    .number()
    .int("Score must be an integer")
    .min(0, "Score cannot be negative")
    .max(MAX_SCORE, `Score cannot exceed ${MAX_SCORE.toLocaleString()} (possible cheating detected)`),
  duration: z.number().optional().nullable(),
  moves: z.number().optional().nullable(),
  level: z.number().optional().nullable(),
  metadata: z.any().optional().nullable(),
  gameState: z.any().optional(),
})

export type ScoreSubmissionInput = z.infer<typeof scoreSubmissionSchema>

