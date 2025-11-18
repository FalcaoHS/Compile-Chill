import { z } from "zod"
import { getGame } from "@/lib/games"
import { getGameStateSchema } from "@/lib/validations/game-state"

/**
 * Zod schema for score submission validation
 */
export const scoreSubmissionSchema = z.object({
  gameId: z.string(),
  score: z.number(),
  duration: z.number().optional().nullable(),
  moves: z.number().optional().nullable(),
  level: z.number().optional().nullable(),
  metadata: z.any().optional().nullable(),
  gameState: z.any().optional(),
})

export type ScoreSubmissionInput = z.infer<typeof scoreSubmissionSchema>

