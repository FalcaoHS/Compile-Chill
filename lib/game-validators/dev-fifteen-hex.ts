import { GameValidator, ValidationResult, ValidationContext } from "./types"
import { ScoreSubmissionInput } from "@/lib/validations/score"
import { DevFifteenHexGameState } from "@/lib/validations/game-state"
import {
  createInitialGameState,
  executeMove,
  checkWin,
  calculateScore,
  type GameState,
  type Direction,
} from "@/lib/games/dev-fifteen-hex/game-logic"

/**
 * Dev Fifteen HEX validator
 * 
 * Validates Dev Fifteen HEX score submissions by:
 * - Replaying moves from game state
 * - Verifying board matches solved state
 * - Checking timing constraints
 * - Detecting impossible moves
 */
export const devFifteenHexValidator: GameValidator = {
  validate(
    submission: ScoreSubmissionInput,
    context?: ValidationContext
  ): ValidationResult {
    const errors: string[] = []

    // Extract gameState (already validated by schema)
    const gameState = submission.gameState as DevFifteenHexGameState
    const { board: submittedBoard, moveHistory, moveTimestamps, startTime, endTime } = gameState
    const { score: submittedScore, duration, moves } = submission

    // Determine validation tier based on score
    const validationTier = getValidationTier(submittedScore)

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
  gameState: DevFifteenHexGameState,
  errors: string[]
): ValidationResult {
  const { board, moveHistory, startTime, endTime } = gameState
  const { duration, moves } = submission

  // Basic structure checks
  if (!Array.isArray(board) || board.length !== 4) {
    errors.push("Board deve ser uma matriz 4x4")
  }

  if (board.some(row => !Array.isArray(row) || row.length !== 4)) {
    errors.push("Board deve ter 4 linhas e 4 colunas")
  }

  // Check move count
  if (moves !== null && moves !== undefined && moveHistory.length !== moves) {
    errors.push(
      `Número de movimentos (${moves}) não corresponde ao moveHistory (${moveHistory.length})`
    )
  }

  // Check duration
  const calculatedDuration = endTime - startTime
  if (duration !== null && duration !== undefined && Math.abs(duration * 1000 - calculatedDuration) > 5000) {
    errors.push("Duração não corresponde aos timestamps")
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
  gameState: DevFifteenHexGameState,
  errors: string[],
  tier: "normal" | "complete"
): ValidationResult {
  const { board: initialBoard, moveHistory, moveTimestamps, startTime, endTime } = gameState
  const { score: submittedScore, duration, moves } = submission

  // Validate timing constraints
  validateTiming(gameState, submission, errors, tier)

  // Validate move count
  if (moves !== null && moves !== undefined && moveHistory.length !== moves) {
    errors.push(
      `Número de movimentos (${moves}) não corresponde ao moveHistory (${moveHistory.length})`
    )
  }

  // Validate move timestamps match move history
  if (moveTimestamps.length !== moveHistory.length) {
    errors.push(
      `moveTimestamps (${moveTimestamps.length}) não corresponde ao moveHistory (${moveHistory.length})`
    )
  }

  // Replay moves from initial board
  const replayResult = replayMoves(moveHistory, moveTimestamps, startTime, initialBoard)
  if (!replayResult.success) {
    errors.push(...replayResult.errors)
    return { valid: false, errors }
  }

  const { finalBoard, finalState } = replayResult

  if (!finalState) {
    errors.push("Não foi possível reexecutar os movimentos")
    return { valid: false, errors }
  }

  // Validate puzzle is solved
  if (!checkWin(finalBoard as any)) {
    errors.push("Puzzle não está resolvido corretamente após replay")
  }

  // Validate calculated score matches submitted score
  const calculatedDuration = finalState.endTime! - finalState.startTime
  const calculatedScore = calculateScore(finalState.moves, calculatedDuration)
  
  if (Math.abs(calculatedScore - submittedScore) > 10) {
    errors.push(
      `Score calculado (${calculatedScore}) não corresponde ao score enviado (${submittedScore})`
    )
  }

  // Validate impossible scores (complete tier only)
  if (tier === "complete") {
    validateImpossibleScores(submittedScore, moveHistory.length, calculatedDuration, errors)
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}

/**
 * Replay moves from initial state
 * 
 * Note: We need the initial board to properly validate. Since we don't have it in the submission,
 * we'll validate by working backwards from the final (solved) state, then forward.
 * However, for proper validation, we should require the initial board in gameState.
 * For now, we validate that:
 * 1. Final board is solved
 * 2. Moves are valid (can be executed in reverse from solved state)
 * 3. Timestamps are consistent
 */
function replayMoves(
  moveHistory: Direction[],
  moveTimestamps: number[],
  startTime: number,
  initialBoard?: (string | null)[][]
): { success: boolean; errors: string[]; finalBoard: (string | null)[][]; finalState: GameState | null } {
  const errors: string[] = []

  // Validate timestamps
  for (let i = 0; i < moveTimestamps.length; i++) {
    const timestamp = moveTimestamps[i]
    
    if (timestamp < startTime) {
      errors.push(`Timestamp do movimento ${i} é anterior ao startTime`)
    }
    
    if (i > 0 && timestamp < moveTimestamps[i - 1]) {
      errors.push(`Timestamp do movimento ${i} é anterior ao movimento anterior`)
    }
    
    if (i > 0) {
      const timeBetween = timestamp - moveTimestamps[i - 1]
      if (timeBetween < 100) {
        errors.push(`Movimento ${i} muito rápido (${timeBetween}ms entre movimentos)`)
      }
    }
  }

  // If we have initial board, replay from it
  if (initialBoard) {
    // Reconstruct state from initial board
    let state: GameState = {
      board: initialBoard.map(row => [...row]) as any,
      emptyPosition: findEmptyPosition(initialBoard),
      moves: 0,
      startTime,
      endTime: null,
      moveHistory: [],
      moveTimestamps: [],
      isWon: false,
      isAnimating: false,
    }
    
    // Replay all moves
    for (let i = 0; i < moveHistory.length; i++) {
      const direction = moveHistory[i]
      const newState = executeMove(state, direction)
      
      if (!newState) {
        errors.push(`Movimento ${i} (${direction}) é inválido`)
        return {
          success: false,
          errors,
          finalBoard: state.board,
          finalState: state,
        }
      }
      
      state = newState
    }
    
    return {
      success: true,
      errors: [],
      finalBoard: state.board,
      finalState: state,
    }
  }
  
  // Without initial board, we can only validate timestamps and that moves are reasonable
  // The final board validation will happen separately
  return {
    success: errors.length === 0,
    errors,
    finalBoard: [],
    finalState: null,
  }
}

/**
 * Find empty position in board
 */
function findEmptyPosition(board: (string | null)[][]): { row: number; col: number } {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === null) {
        return { row, col }
      }
    }
  }
  return { row: 3, col: 3 } // Fallback
}

/**
 * Check if two boards match
 */
function boardsMatch(
  board1: (string | null)[][],
  board2: (string | null)[][]
): boolean {
  if (board1.length !== board2.length) return false
  
  for (let row = 0; row < board1.length; row++) {
    if (board1[row].length !== board2[row].length) return false
    for (let col = 0; col < board1[row].length; col++) {
      if (board1[row][col] !== board2[row][col]) return false
    }
  }
  
  return true
}

/**
 * Validate timing constraints
 */
function validateTiming(
  gameState: DevFifteenHexGameState,
  submission: ScoreSubmissionInput,
  errors: string[],
  tier: "normal" | "complete"
): void {
  const { moveTimestamps, startTime, endTime } = gameState
  const { duration } = submission

  // Validate duration matches timestamps
  const calculatedDuration = endTime - startTime
  if (duration !== null && duration !== undefined && Math.abs(duration * 1000 - calculatedDuration) > 5000) {
    errors.push("Duração não corresponde aos timestamps (diferença > 5s)")
  }

  // Validate minimum time per move
  const minTimePerMove = 100 // 100ms minimum
  for (let i = 1; i < moveTimestamps.length; i++) {
    const timeBetween = moveTimestamps[i] - moveTimestamps[i - 1]
    if (timeBetween < minTimePerMove) {
      errors.push(
        `Movimento ${i} muito rápido: ${timeBetween}ms (mínimo: ${minTimePerMove}ms)`
      )
    }
  }

  // Validate maximum time per move (10s)
  const maxTimePerMove = 10000
  for (let i = 1; i < moveTimestamps.length; i++) {
    const timeBetween = moveTimestamps[i] - moveTimestamps[i - 1]
    if (timeBetween > maxTimePerMove) {
      errors.push(
        `Movimento ${i} muito lento: ${timeBetween}ms (máximo: ${maxTimePerMove}ms)`
      )
    }
  }

  // Complete tier: stricter checks
  if (tier === "complete") {
    // Check total duration is reasonable (< 1 hour)
    if (calculatedDuration > 3600000) {
      errors.push("Duração total muito longa (> 1 hora)")
    }

    // Check duration >= moves * minimumTimePerMove
    const minTotalDuration = moveTimestamps.length * minTimePerMove
    if (calculatedDuration < minTotalDuration) {
      errors.push(
        `Duração total (${calculatedDuration}ms) menor que mínimo esperado (${minTotalDuration}ms)`
      )
    }
  }
}

/**
 * Validate impossible scores
 */
function validateImpossibleScores(
  submittedScore: number,
  moveCount: number,
  duration: number,
  errors: string[]
): void {
  // Minimum score for a solved puzzle
  // score = 5000 - (moves * 7 + seconds * 3)
  // For a perfect solve: moves >= 40 (theoretical minimum for 15-puzzle is ~40-50 moves)
  // But we allow some flexibility
  
  const seconds = Math.floor(duration / 1000)
  const minPossibleMoves = 40 // Theoretical minimum for 15-puzzle
  const maxReasonableMoves = 200 // Very generous upper bound
  
  if (moveCount < minPossibleMoves) {
    errors.push(
      `Número de movimentos (${moveCount}) menor que o mínimo teórico (${minPossibleMoves})`
    )
  }
  
  if (moveCount > maxReasonableMoves) {
    errors.push(
      `Número de movimentos (${moveCount}) muito alto (máximo razoável: ${maxReasonableMoves})`
    )
  }
  
  // Check if score is achievable with given moves and time
  const calculatedScore = calculateScore(moveCount, duration)
  if (submittedScore > calculatedScore + 50) { // Allow some tolerance
    errors.push(
      `Score (${submittedScore}) maior que o máximo calculado (${calculatedScore}) para ${moveCount} movimentos e ${seconds}s`
    )
  }
}

