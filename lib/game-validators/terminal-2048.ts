import { GameValidator, ValidationResult, ValidationContext } from "./types"
import { ScoreSubmissionInput } from "@/lib/validations/score"
import { Terminal2048GameState } from "@/lib/validations/game-state"
import {
  createInitialGameState,
  executeMove,
  type Board,
  type Direction,
} from "@/lib/games/terminal-2048/game-logic"

/**
 * Terminal 2048 validator
 * 
 * Validates Terminal 2048 score submissions by:
 * - Replaying moves from game state
 * - Verifying board and score match
 * - Checking timing constraints
 * - Detecting impossible scores
 */
export const terminal2048Validator: GameValidator = {
  validate(
    submission: ScoreSubmissionInput,
    context?: ValidationContext
  ): ValidationResult {
    const errors: string[] = []

    // Extract gameState (already validated by schema)
    const gameState = submission.gameState as Terminal2048GameState
    const { board, moveHistory, startTime, endTime } = gameState
    const { score, duration, moves } = submission

    // Determine validation tier based on score
    const validationTier = getValidationTier(score)

    // Light validation for low scores
    if (validationTier === "light") {
      return validateLight(submission, gameState, errors)
    }

    // Normal and complete validation (full replay)
    return validateFull(submission, gameState, errors, validationTier)
  },
}

/**
 * Get validation tier based on score
 */
function getValidationTier(score: number): "light" | "normal" | "complete" {
  if (score < 200) return "light"
  if (score < 2000) return "normal"
  return "complete"
}

/**
 * Light validation for low scores (< 200)
 * Basic checks without expensive replay
 */
function validateLight(
  submission: ScoreSubmissionInput,
  gameState: Terminal2048GameState,
  errors: string[]
): ValidationResult {
  const { board, startTime, endTime } = gameState
  const { score, duration, moves } = submission

  // Validate board structure
  if (!isValidBoardStructure(board)) {
    errors.push("Board contém valores inválidos (apenas potências de 2 ou null são permitidas)")
  }

  // Validate basic timing
  if (duration !== null && duration !== undefined) {
    const calculatedDuration = endTime - startTime
    if (Math.abs(duration - calculatedDuration) > 1000) {
      errors.push("Duração não corresponde à diferença entre startTime e endTime")
    }

    if (duration < 0) {
      errors.push("Duração não pode ser negativa")
    }

    if (duration > 3600000) {
      errors.push("Duração excede o limite máximo de 1 hora")
    }
  }

  // Validate move count if provided
  if (moves !== null && moves !== undefined && gameState.moveHistory.length !== moves) {
    errors.push("Número de movimentos não corresponde ao moveHistory")
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}

/**
 * Full validation with move replay (normal and complete tiers)
 */
function validateFull(
  submission: ScoreSubmissionInput,
  gameState: Terminal2048GameState,
  errors: string[],
  tier: "normal" | "complete"
): ValidationResult {
  const { board: submittedBoard, moveHistory, startTime, endTime } = gameState
  const { score: submittedScore, duration, moves } = submission

  // Validate timing constraints
  validateTiming(gameState, submission, errors, tier)

  // Validate move count
  if (moves !== null && moves !== undefined && moveHistory.length !== moves) {
    errors.push(
      `Número de movimentos (${moves}) não corresponde ao moveHistory (${moveHistory.length})`
    )
  }

  // Replay moves to validate game state
  const replayResult = replayMoves(moveHistory, startTime)
  if (!replayResult.success) {
    errors.push(...replayResult.errors)
    return { valid: false, errors }
  }

  const { finalBoard, calculatedScore, moveCount } = replayResult

  // Validate calculated score matches submitted score
  if (calculatedScore !== submittedScore) {
    errors.push(
      `Score calculado (${calculatedScore}) não corresponde ao score enviado (${submittedScore})`
    )
  }

  // Validate board structure (powers of 2)
  if (!isValidBoardStructure(submittedBoard)) {
    errors.push("Board contém valores inválidos (apenas potências de 2 ou null são permitidas)")
  }

  // Note: We can't validate exact board match without deterministic RNG seed
  // But we validate board structure and score calculation

  // Validate impossible scores (complete tier only)
  if (tier === "complete") {
    validateImpossibleScores(submittedScore, moveHistory.length, calculatedScore, errors)
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}

/**
 * Validate timing constraints
 */
function validateTiming(
  gameState: Terminal2048GameState,
  submission: ScoreSubmissionInput,
  errors: string[],
  tier: "normal" | "complete"
): void {
  const { startTime, endTime, moveHistory } = gameState
  const { duration } = submission

  // Validate duration matches endTime - startTime (within 1 second tolerance)
  if (duration !== null && duration !== undefined) {
    const calculatedDuration = endTime - startTime
    const durationDiff = Math.abs(duration - calculatedDuration)

    if (durationDiff > 1000) {
      errors.push(
        `Duração (${duration}ms) não corresponde à diferença entre timestamps (${calculatedDuration}ms, diferença: ${durationDiff}ms)`
      )
    }

    // Validate minimum time per move (100ms)
    const minTimePerMove = 100
    const minDuration = moveHistory.length * minTimePerMove
    if (duration < minDuration) {
      errors.push(
        `Duração muito curta: ${duration}ms para ${moveHistory.length} movimentos (mínimo: ${minDuration}ms, ${minTimePerMove}ms por movimento)`
      )
    }

    // Validate maximum time per move (10s)
    const maxTimePerMove = 10000
    const maxDuration = moveHistory.length * maxTimePerMove
    if (duration > maxDuration) {
      errors.push(
        `Duração muito longa: ${duration}ms para ${moveHistory.length} movimentos (máximo: ${maxDuration}ms, ${maxTimePerMove}ms por movimento)`
      )
    }

    // Validate global limit (1 hour)
    const maxGlobalDuration = 3600000
    if (duration > maxGlobalDuration) {
      errors.push(`Duração excede o limite máximo de ${maxGlobalDuration}ms (1 hora)`)
    }
  } else {
    // If duration not provided, validate using timestamps
    const calculatedDuration = endTime - startTime
    const minTimePerMove = 100
    const minDuration = moveHistory.length * minTimePerMove

    if (calculatedDuration < minDuration) {
      errors.push(
        `Duração calculada muito curta: ${calculatedDuration}ms para ${moveHistory.length} movimentos (mínimo: ${minDuration}ms)`
      )
    }

    if (calculatedDuration > 3600000) {
      errors.push("Duração calculada excede o limite máximo de 1 hora")
    }
  }
}

/**
 * Replay moves from game state
 * 
 * Note: Without deterministic RNG seed, we can't get exact board match,
 * but we can validate score calculation and move validity
 */
function replayMoves(
  moveHistory: Direction[],
  startTime: number
): {
  success: boolean
  errors: string[]
  finalBoard?: Board
  calculatedScore?: number
  moveCount?: number
} {
  const errors: string[] = []

  try {
    // Create initial game state
    let state = createInitialGameState(0)
    state.startTime = startTime

    // Replay each move
    for (let i = 0; i < moveHistory.length; i++) {
      const direction = moveHistory[i]

      if (!["up", "down", "left", "right"].includes(direction)) {
        errors.push(`Movimento inválido na posição ${i}: ${direction}`)
        return { success: false, errors }
      }

      const previousScore = state.score
      state = executeMove(state, direction as Direction)

      // Check if move was valid (score should increase if move was valid)
      // Note: executeMove returns same state if move is invalid, but score might not change
      // We can't fully validate without deterministic RNG, but we track score progression
    }

    return {
      success: errors.length === 0,
      errors,
      finalBoard: state.board,
      calculatedScore: state.score,
      moveCount: state.moveCount,
    }
  } catch (error) {
    errors.push(
      `Erro ao reaplicar movimentos: ${error instanceof Error ? error.message : "Erro desconhecido"}`
    )
    return { success: false, errors }
  }
}

/**
 * Validate board structure (powers of 2 or null)
 */
function isValidBoardStructure(board: (number | null)[][]): boolean {
  if (!Array.isArray(board) || board.length !== 4) return false

  for (const row of board) {
    if (!Array.isArray(row) || row.length !== 4) return false

    for (const cell of row) {
      if (cell !== null && !isPowerOfTwo(cell)) {
        return false
      }
    }
  }

  return true
}

/**
 * Check if a number is a power of 2
 */
function isPowerOfTwo(value: number): boolean {
  if (value <= 0) return false
  return (value & (value - 1)) === 0
}

/**
 * Validate impossible scores
 * 
 * Checks for scores that are impossible to achieve with the given moves
 */
function validateImpossibleScores(
  submittedScore: number,
  moveCount: number,
  calculatedScore: number,
  errors: string[]
): void {
  // Check if score is too high for the number of moves
  // Rough heuristic: each merge gives at least 4 points (2+2), so max score ≈ moveCount * 4
  // But this is conservative - actual max depends on merges
  const maxReasonableScore = moveCount * 8 // Allow some margin

  if (submittedScore > maxReasonableScore && moveCount < 10) {
    errors.push(
      `Score muito alto (${submittedScore}) para o número de movimentos (${moveCount}). Score máximo razoável: ~${maxReasonableScore}`
    )
  }

  // Check for specific impossible combinations
  // 2048 tile requires at least 11 merges (2^11 = 2048), so minimum ~11 moves
  if (submittedScore >= 2048 && moveCount < 11) {
    errors.push(
      `Score de ${submittedScore} requer pelo menos 11 movimentos para alcançar tile 2048, mas apenas ${moveCount} movimentos foram reportados`
    )
  }

  // 4096 tile requires at least 12 merges, so minimum ~12 moves
  if (submittedScore >= 4096 && moveCount < 12) {
    errors.push(
      `Score de ${submittedScore} requer pelo menos 12 movimentos para alcançar tile 4096, mas apenas ${moveCount} movimentos foram reportados`
    )
  }

  // Check if calculated score from replay is significantly different
  // (accounting for RNG differences, allow 10% variance)
  const scoreVariance = Math.abs(submittedScore - calculatedScore)
  const maxVariance = Math.max(submittedScore * 0.1, 100)

  if (scoreVariance > maxVariance) {
    errors.push(
      `Score calculado (${calculatedScore}) difere significativamente do score enviado (${submittedScore}, diferença: ${scoreVariance})`
    )
  }
}

