/**
 * Game logic for Bit Runner
 * 
 * Core game mechanics: character movement, obstacle collision, distance tracking
 */

// Game constants
export const GAME_WIDTH = 800
export const GAME_HEIGHT = 450
export const GROUND_Y = GAME_HEIGHT - 50 // Ground level
export const CHARACTER_WIDTH = 16
export const CHARACTER_HEIGHT = 24
export const CHARACTER_RUNNING_Y = GROUND_Y - CHARACTER_HEIGHT
export const CHARACTER_DUCKING_HEIGHT = 12
export const CHARACTER_DUCKING_Y = GROUND_Y - CHARACTER_DUCKING_HEIGHT
export const JUMP_HEIGHT = 100
export const JUMP_DURATION = 600 // milliseconds
export const DUCK_DURATION = 500 // milliseconds
export const INITIAL_GAME_SPEED = 3
export const MAX_GAME_SPEED = 12
export const SPEED_INCREASE_RATE = 0.0001 // per frame

// Character states
export type CharacterState = 'running' | 'jumping' | 'ducking'

// Character position and state
export interface Character {
  x: number
  y: number
  state: CharacterState
  stateStartTime: number // When current state started
  animationFrame: number // Current animation frame (0-3 for running)
}

// Import obstacle types and spawning system
import type { Obstacle } from './obstacles'
import {
  selectSpawnPattern,
  spawnPatternObstacles,
  calculateNextSpawnX,
  calculateAdaptiveSpacing,
  type SpawnPattern,
} from './obstacles'

// Game state
export interface GameState {
  character: Character
  obstacles: Obstacle[]
  distance: number // Distance traveled (score)
  gameSpeed: number // Current scroll speed
  gameOver: boolean
  startTime: number
  lastObstacleSpawnX: number // Track where last obstacle was spawned
  spawnPatterns: string[] // Track patterns for validation
  lastFailureTime: number | null // Track when player last failed (for adaptive difficulty)
  earlyFailure: boolean // Track if player failed early (within 10 seconds)
}

/**
 * Create initial game state
 */
export function createInitialGameState(): GameState {
  return {
    character: {
      x: 100, // Fixed X position (character doesn't move horizontally)
      y: CHARACTER_RUNNING_Y,
      state: 'running',
      stateStartTime: Date.now(),
      animationFrame: 0,
    },
    obstacles: [],
    distance: 0,
    gameSpeed: INITIAL_GAME_SPEED,
    gameOver: false,
    startTime: Date.now(),
    lastObstacleSpawnX: GAME_WIDTH, // Start spawning from right edge
    spawnPatterns: [],
    lastFailureTime: null,
    earlyFailure: false,
  }
}

/**
 * Update character state based on input
 */
export function updateCharacterState(
  state: GameState,
  action: 'jump' | 'duck' | null
): GameState {
  if (state.gameOver) {
    return state
  }

  const now = Date.now()
  const character = { ...state.character }
  const timeInState = now - character.stateStartTime

  // Handle state transitions based on input
  if (action === 'jump' && character.state === 'running') {
    // Start jump
    character.state = 'jumping'
    character.stateStartTime = now
  } else if (action === 'duck' && character.state === 'running') {
    // Start duck
    character.state = 'ducking'
    character.stateStartTime = now
  }

  // Handle automatic state transitions
  if (character.state === 'jumping') {
    if (timeInState >= JUMP_DURATION) {
      // Jump finished, return to running
      character.state = 'running'
      character.stateStartTime = now
      character.y = CHARACTER_RUNNING_Y
    } else {
      // Calculate jump arc (parabolic)
      const jumpProgress = timeInState / JUMP_DURATION
      const jumpHeight = JUMP_HEIGHT * Math.sin(jumpProgress * Math.PI)
      character.y = CHARACTER_RUNNING_Y - jumpHeight
    }
  } else if (character.state === 'ducking') {
    if (timeInState >= DUCK_DURATION) {
      // Duck finished, return to running
      character.state = 'running'
      character.stateStartTime = now
      character.y = CHARACTER_RUNNING_Y
    } else {
      // Keep ducked position
      character.y = CHARACTER_DUCKING_Y
    }
  } else if (character.state === 'running') {
    // Update animation frame (2-4 frames for running)
    const frameRate = 150 // milliseconds per frame
    character.animationFrame = Math.floor((now - character.stateStartTime) / frameRate) % 4
    character.y = CHARACTER_RUNNING_Y
  }

  return {
    ...state,
    character,
  }
}

/**
 * Update game speed (increases over time)
 */
function updateGameSpeed(state: GameState, deltaTime: number): GameState {
  if (state.gameOver) {
    return state
  }

  const newSpeed = Math.min(
    state.gameSpeed + SPEED_INCREASE_RATE * deltaTime,
    MAX_GAME_SPEED
  )

  return {
    ...state,
    gameSpeed: newSpeed,
  }
}

/**
 * Update distance traveled
 */
function updateDistance(state: GameState, deltaTime: number): GameState {
  if (state.gameOver) {
    return state
  }

  // Distance increases based on game speed
  const distanceIncrease = state.gameSpeed * (deltaTime / 16.67) // Normalize to 60 FPS

  return {
    ...state,
    distance: state.distance + distanceIncrease,
  }
}

/**
 * Check collision between character and obstacle
 */
export function checkCollision(character: Character, obstacle: Obstacle): boolean {
  // Character bounding box
  const charLeft = character.x
  const charRight = character.x + CHARACTER_WIDTH
  const charTop = character.y
  const charBottom = character.y + (character.state === 'ducking' ? CHARACTER_DUCKING_HEIGHT : CHARACTER_HEIGHT)

  // Obstacle bounding box
  const obsLeft = obstacle.x
  const obsRight = obstacle.x + obstacle.width
  const obsTop = obstacle.y
  const obsBottom = obstacle.y + obstacle.height

  // AABB collision detection
  return (
    charLeft < obsRight &&
    charRight > obsLeft &&
    charTop < obsBottom &&
    charBottom > obsTop
  )
}

/**
 * Update obstacles (move them left, remove off-screen)
 */
function updateObstacles(state: GameState, deltaTime: number): GameState {
  if (state.gameOver) {
    return state
  }

  // Move obstacles left based on game speed
  const moveDistance = state.gameSpeed * (deltaTime / 16.67)
  const updatedObstacles = state.obstacles
    .map(obs => ({
      ...obs,
      x: obs.x - moveDistance,
    }))
    .filter(obs => obs.x + obs.width > 0) // Remove obstacles that passed off-screen

  return {
    ...state,
    obstacles: updatedObstacles,
  }
}

/**
 * Spawn new obstacles based on patterns and adaptive difficulty
 */
function spawnObstacles(state: GameState): GameState {
  if (state.gameOver) {
    return state
  }

  // Check if we need to spawn new obstacles
  // Spawn when the rightmost obstacle is within spawn distance
  const spawnDistance = GAME_WIDTH * 0.5 // Spawn when obstacles are 50% across screen
  const rightmostObstacleX = state.obstacles.length > 0
    ? Math.max(...state.obstacles.map(o => o.x + o.width))
    : 0

  if (rightmostObstacleX < GAME_WIDTH - spawnDistance || state.obstacles.length === 0) {
    // Select pattern based on distance and difficulty
    const pattern = selectSpawnPattern(state.distance, 0.25) // 25% variation

    // Calculate adaptive spacing
    const timeSinceLastFailure = state.lastFailureTime
      ? (Date.now() - state.lastFailureTime) / 1000
      : 999 // Large number if no failure yet

    const adaptiveSpacing = calculateAdaptiveSpacing(
      pattern.minSpacing,
      pattern.maxSpacing,
      {
        earlyFailure: state.earlyFailure,
        currentDistance: state.distance,
        averageSpacing: (pattern.minSpacing + pattern.maxSpacing) / 2,
      },
      timeSinceLastFailure
    )

    // Calculate next spawn position
    const nextSpawnX = calculateNextSpawnX(
      state.lastObstacleSpawnX,
      pattern,
      adaptiveSpacing
    )

    // Spawn obstacles from pattern
    const newObstacles = spawnPatternObstacles(pattern, nextSpawnX)

    return {
      ...state,
      obstacles: [...state.obstacles, ...newObstacles],
      lastObstacleSpawnX: nextSpawnX,
      spawnPatterns: [...state.spawnPatterns, pattern.id],
    }
  }

  return state
}

/**
 * Check for collisions with obstacles
 */
function checkObstacleCollisions(state: GameState): GameState {
  if (state.gameOver) {
    return state
  }

  // Check collision with any obstacle
  const hasCollision = state.obstacles.some(obstacle =>
    checkCollision(state.character, obstacle)
  )

  if (hasCollision) {
    const now = Date.now()
    const gameDuration = (now - state.startTime) / 1000
    const earlyFailure = gameDuration < 10 // Failed within 10 seconds

    return {
      ...state,
      gameOver: true,
      lastFailureTime: now,
      earlyFailure: earlyFailure || state.earlyFailure,
    }
  }

  return state
}

/**
 * Update game state (called each frame)
 */
export function updateGameState(
  state: GameState,
  action: 'jump' | 'duck' | null,
  deltaTime: number
): GameState {
  if (state.gameOver) {
    return state
  }

  let newState = { ...state }

  // Update character state
  newState = updateCharacterState(newState, action)

  // Update game speed
  newState = updateGameSpeed(newState, deltaTime)

  // Update distance
  newState = updateDistance(newState, deltaTime)

  // Spawn new obstacles
  newState = spawnObstacles(newState)

  // Update obstacles
  newState = updateObstacles(newState, deltaTime)

  // Check collisions
  newState = checkObstacleCollisions(newState)

  return newState
}

/**
 * Reset game to initial state
 */
export function resetGame(): GameState {
  return createInitialGameState()
}

/**
 * Check if game is over
 */
export function isGameOver(state: GameState): boolean {
  return state.gameOver
}

/**
 * Get match duration in seconds
 */
export function getMatchDuration(state: GameState): number {
  if (state.gameOver) {
    return Math.floor((Date.now() - state.startTime) / 1000)
  }
  return Math.floor((Date.now() - state.startTime) / 1000)
}

/**
 * Load best score from localStorage
 */
export function loadBestScore(): number {
  if (typeof window === 'undefined') {
    return 0
  }

  const stored = localStorage.getItem('bit-runner-best-score')
  return stored ? parseFloat(stored) : 0
}

/**
 * Save best score to localStorage
 */
export function saveBestScore(score: number): void {
  if (typeof window === 'undefined') {
    return
  }

  const currentBest = loadBestScore()
  if (score > currentBest) {
    localStorage.setItem('bit-runner-best-score', score.toString())
  }
}

