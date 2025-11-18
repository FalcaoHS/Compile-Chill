/**
 * Game state validation schemas
 * 
 * Defines Zod schemas for validating game state in score submissions
 */

import { z } from "zod"

/**
 * Validate board structure (4x4 grid)
 */
function isValidBoard(board: unknown[][]): boolean {
  if (!Array.isArray(board) || board.length !== 4) return false
  return board.every(row => Array.isArray(row) && row.length === 4)
}

/**
 * Terminal 2048 game state schema
 */
export const terminal2048GameStateSchema = z.object({
  board: z.array(z.array(z.union([z.number(), z.null()]))).refine(isValidBoard, {
    message: "Board must be a 4x4 grid",
  }),
  moveHistory: z.array(z.enum(["up", "down", "left", "right"])),
  startTime: z.number(),
  endTime: z.number(),
  seed: z.string().optional(),
})

export type Terminal2048GameState = z.infer<typeof terminal2048GameStateSchema>

/**
 * Dev Fifteen HEX game state schema
 */
export const devFifteenHexGameStateSchema = z.object({
  board: z.array(z.array(z.union([
    z.literal('0x01'),
    z.literal('0x02'),
    z.literal('0x03'),
    z.literal('0x04'),
    z.literal('0x05'),
    z.literal('0x06'),
    z.literal('0x07'),
    z.literal('0x08'),
    z.literal('0x09'),
    z.literal('0x0A'),
    z.literal('0x0B'),
    z.literal('0x0C'),
    z.literal('0x0D'),
    z.literal('0x0E'),
    z.literal('0x0F'),
    z.null(),
  ]))).refine(isValidBoard, {
    message: "Board must be a 4x4 grid",
  }),
  moveHistory: z.array(z.enum(["up", "down", "left", "right"])),
  moveTimestamps: z.array(z.number()),
  startTime: z.number(),
  endTime: z.number(),
})

export type DevFifteenHexGameState = z.infer<typeof devFifteenHexGameStateSchema>

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
    case "dev-fifteen-hex":
      return devFifteenHexGameStateSchema
    default:
      throw new Error(`Game state validation não implementado para o jogo: ${gameId}`)
  }
}
