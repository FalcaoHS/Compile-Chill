import { z } from "zod"

/**
 * Direction type for Terminal 2048 moves
 */
export const directionSchema = z.enum(["up", "down", "left", "right"])

/**
 * Validates that a number is a power of 2 or null
 * Powers of 2: 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, etc.
 */
function isPowerOfTwoOrNull(value: number | null): boolean {
  if (value === null) return true
  if (value <= 0) return false
  // Check if value is a power of 2: (value & (value - 1)) === 0
  return (value & (value - 1)) === 0
}

/**
 * Validates that a board is a 4x4 grid
 */
function isValidBoard(board: (number | null)[][]): boolean {
  if (!Array.isArray(board) || board.length !== 4) return false
  return board.every((row) => {
    if (!Array.isArray(row) || row.length !== 4) return false
    return row.every((cell) => cell === null || (typeof cell === "number" && isPowerOfTwoOrNull(cell)))
  })
}

/**
 * Zod schema for Terminal 2048 game state
 * 
 * Validates the game state structure required for score validation:
 * - board: 4x4 grid of numbers (powers of 2) or null
 * - moveHistory: array of valid directions
 * - startTime: timestamp when game started
 * - endTime: timestamp when game ended
 * - seed: optional RNG seed for deterministic replay
 */
export const terminal2048GameStateSchema = z
  .object({
    board: z
      .array(z.array(z.union([z.number().int(), z.null()])))
      .refine(isValidBoard, {
        message: "board deve ser uma grade 4x4 com valores que são potências de 2 ou null",
      }),
    moveHistory: z
      .array(directionSchema)
      .min(0, "moveHistory não pode ser vazio")
      .max(10000, "moveHistory não pode ter mais de 10000 movimentos"),
    startTime: z
      .number()
      .int("startTime deve ser um timestamp inteiro")
      .min(0, "startTime deve ser um timestamp válido"),
    endTime: z
      .number()
      .int("endTime deve ser um timestamp inteiro")
      .min(0, "endTime deve ser um timestamp válido"),
    seed: z.string().optional(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "endTime deve ser maior que startTime",
    path: ["endTime"],
  })

export type Terminal2048GameState = z.infer<typeof terminal2048GameStateSchema>

/**
 * Zod schema for Hack Grid game state
 * 
 * Validates the game state structure required for score validation:
 * - currentLevel: current level number
 * - nodes: array of nodes with id, row, col
 * - connections: array of connections between nodes
 * - duration: game duration in milliseconds
 * - moves: number of moves made
 * - segments: total path segments used
 * - completed: whether puzzle is completed
 */
export const hackGridGameStateSchema = z.object({
  currentLevel: z.number().int().min(1),
  nodes: z.array(z.object({
    id: z.string(),
    row: z.number().int().min(0).max(5),
    col: z.number().int().min(0).max(5),
  })),
  connections: z.array(z.object({
    from: z.string(),
    to: z.string(),
    segments: z.number().int().min(0),
  })),
  duration: z.number().int().min(0),
  moves: z.number().int().min(0),
  segments: z.number().int().min(0),
  completed: z.boolean(),
})

export type HackGridGameState = z.infer<typeof hackGridGameStateSchema>

/**
 * Zod schema for Dev Pong game state
 */
export const devPongGameStateSchema = z.object({
  playerScore: z.number().int().min(0),
  aiScore: z.number().int().min(0),
  hitCount: z.number().int().min(0),
  duration: z.number().int().min(0),
})

export type DevPongGameState = z.infer<typeof devPongGameStateSchema>

/**
 * Zod schema for Bit Runner game state
 */
export const bitRunnerGameStateSchema = z.object({
  distance: z.number().min(0),
  gameSpeed: z.number().min(0),
  duration: z.number().int().min(0),
})

export type BitRunnerGameState = z.infer<typeof bitRunnerGameStateSchema>

/**
 * Get game-specific gameState schema by gameId
 * 
 * @param gameId - The game identifier
 * @returns Zod schema for the game's gameState structure
 * @throws Error if gameId is not supported
 */
export function getGameStateSchema(gameId: string): z.ZodSchema {
  switch (gameId) {
    case "terminal-2048":
      return terminal2048GameStateSchema
    case "hack-grid":
      return hackGridGameStateSchema
    case "dev-pong":
      return devPongGameStateSchema
    case "bit-runner":
      return bitRunnerGameStateSchema
    default:
      throw new Error(`Game state validation não implementado para o jogo: ${gameId}`)
  }
}

