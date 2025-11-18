/**
 * AI logic for Dev Pong
 * 
 * Adaptive AI that adjusts difficulty based on player performance
 */

import type { GameState, Paddle, Ball } from './game-logic'
import { GAME_HEIGHT, PADDLE_HEIGHT, PADDLE_SPEED } from './game-logic'

// AI configuration
const MIN_DIFFICULTY = 0.3 // 30% - Starting difficulty
const MAX_DIFFICULTY = 0.85 // 85% - Never reaches 100% (always beatable)
const DIFFICULTY_INCREMENT = 0.05 // Increase per player point
const REACTION_DELAY_MS = 100 // Base reaction delay
const ERROR_TOLERANCE = 15 // Pixels of acceptable error
const INTENTIONAL_MISS_CHANCE = 0.1 // 10% chance to miss intentionally

// AI state tracking
interface AIState {
  targetY: number // Where AI thinks it should move
  reactionTime: number // Delay before reacting to ball
  lastUpdateTime: number // For reaction delay simulation
  errorOffset: number // Intentional positioning error
  consecutiveHits: number // Track successful paddle hits
}

// Store AI state (will be reset on game restart)
let aiState: AIState = {
  targetY: GAME_HEIGHT / 2,
  reactionTime: REACTION_DELAY_MS,
  lastUpdateTime: 0,
  errorOffset: 0,
  consecutiveHits: 0,
}

/**
 * Reset AI state
 */
export function resetAIState(): void {
  aiState = {
    targetY: GAME_HEIGHT / 2,
    reactionTime: REACTION_DELAY_MS,
    lastUpdateTime: 0,
    errorOffset: 0,
    consecutiveHits: 0,
  }
}

/**
 * Calculate AI difficulty based on player score
 */
export function calculateAIDifficulty(state: GameState): number {
  // Base difficulty increases with each player point
  const scoreDifficulty = MIN_DIFFICULTY + (state.playerScore * DIFFICULTY_INCREMENT)
  
  // Cap at maximum difficulty (never perfect)
  return Math.min(scoreDifficulty, MAX_DIFFICULTY)
}

/**
 * Calculate reaction time based on difficulty
 * Lower difficulty = slower reactions
 */
function calculateReactionTime(difficulty: number): number {
  // Scale from 200ms (easy) to 50ms (hard)
  const minReaction = 50
  const maxReaction = 200
  return maxReaction - (difficulty * (maxReaction - minReaction))
}

/**
 * Calculate movement speed based on difficulty
 */
function calculateMovementSpeed(difficulty: number): number {
  // Scale from 40% to 95% of max paddle speed
  const minSpeed = PADDLE_SPEED * 0.4
  const maxSpeed = PADDLE_SPEED * 0.95 // Never full speed
  return minSpeed + (difficulty * (maxSpeed - minSpeed))
}

/**
 * Predict where ball will be when it reaches AI paddle
 */
function predictBallY(ball: Ball, aiPaddle: Paddle): number {
  // Simple prediction: linear extrapolation
  const distanceToAI = aiPaddle.x - ball.x
  
  if (distanceToAI <= 0 || ball.velocity.vx <= 0) {
    // Ball moving away or already past paddle
    return ball.y
  }
  
  const timeToReach = distanceToAI / ball.velocity.vx
  let predictedY = ball.y + (ball.velocity.vy * timeToReach)
  
  // Account for wall bounces (simplified)
  while (predictedY < 0 || predictedY > GAME_HEIGHT) {
    if (predictedY < 0) {
      predictedY = -predictedY
    } else if (predictedY > GAME_HEIGHT) {
      predictedY = GAME_HEIGHT - (predictedY - GAME_HEIGHT)
    }
  }
  
  return predictedY
}

/**
 * Add intentional error to AI positioning
 */
function addPositioningError(targetY: number, difficulty: number): number {
  // Lower difficulty = more error
  const maxError = ERROR_TOLERANCE * (1 - difficulty)
  
  // Occasionally make intentional mistakes
  if (Math.random() < INTENTIONAL_MISS_CHANCE * (1 - difficulty)) {
    // Intentional large error
    return targetY + (Math.random() * maxError * 2 - maxError)
  }
  
  // Normal small error
  return targetY + (Math.random() * maxError - maxError / 2)
}

/**
 * Update AI paddle position with adaptive behavior
 */
export function updateAIPaddle(state: GameState, deltaTime: number): GameState {
  const currentTime = Date.now()
  const difficulty = calculateAIDifficulty(state)
  
  // Update AI difficulty in state
  const newState = {
    ...state,
    aiDifficulty: difficulty,
  }
  
  // Check if enough time has passed for AI to react (reaction delay)
  const reactionTime = calculateReactionTime(difficulty)
  if (currentTime - aiState.lastUpdateTime < reactionTime) {
    // Still in reaction delay, use previous target
    return moveAIPaddleToTarget(newState, aiState.targetY, difficulty)
  }
  
  // Update reaction timestamp
  aiState.lastUpdateTime = currentTime
  
  // Predict where ball will be
  let targetY = predictBallY(state.ball, state.aiPaddle)
  
  // Add positioning error based on difficulty
  targetY = addPositioningError(targetY, difficulty)
  
  // Center target on paddle
  targetY = targetY - PADDLE_HEIGHT / 2
  
  // Store target for next frame
  aiState.targetY = targetY
  
  return moveAIPaddleToTarget(newState, targetY, difficulty)
}

/**
 * Move AI paddle toward target position
 */
function moveAIPaddleToTarget(
  state: GameState,
  targetY: number,
  difficulty: number
): GameState {
  const currentY = state.aiPaddle.y
  const diff = targetY - currentY
  
  // Calculate movement speed based on difficulty
  const moveSpeed = calculateMovementSpeed(difficulty)
  
  let newY = currentY
  
  if (Math.abs(diff) > 2) {
    // Move toward target
    newY += Math.sign(diff) * moveSpeed
  }
  
  // Clamp to bounds
  newY = Math.max(0, Math.min(GAME_HEIGHT - PADDLE_HEIGHT, newY))
  
  return {
    ...state,
    aiPaddle: {
      ...state.aiPaddle,
      y: newY,
    },
  }
}

/**
 * Track AI performance (for future enhancements)
 */
export function trackAIPerformance(state: GameState, hitSuccessful: boolean): void {
  if (hitSuccessful) {
    aiState.consecutiveHits += 1
  } else {
    aiState.consecutiveHits = 0
  }
  
  // Could use this data to further adjust difficulty
}

/**
 * Get AI difficulty as percentage string for display
 */
export function getAIDifficultyPercentage(state: GameState): string {
  const difficulty = calculateAIDifficulty(state)
  return `${Math.round(difficulty * 100)}%`
}

/**
 * Get AI state for debugging
 */
export function getAIState(): AIState {
  return { ...aiState }
}

