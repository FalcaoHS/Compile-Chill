import { z } from "zod"

/**
 * Zod schema for pagination query parameters
 */
export const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val >= 1, {
      message: "page deve ser maior ou igual a 1",
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .refine((val) => val >= 1 && val <= 100, {
      message: "limit deve estar entre 1 e 100",
    }),
})

/**
 * Zod schema for scores query parameters
 */
export const scoresQuerySchema = paginationQuerySchema.extend({
  gameId: z.string().optional(),
  userId: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || val > 0, {
      message: "userId deve ser um número positivo",
    }),
})

export type ScoresQueryInput = z.infer<typeof scoresQuerySchema>

