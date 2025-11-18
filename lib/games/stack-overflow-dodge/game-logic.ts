/**
 * Game logic for Stack Overflow Dodge
 * 
 * Core game mechanics: player horizontal movement, error falling, collision detection, survival-based scoring
 */

// Game constants
export const GAME_WIDTH = 800
export const GAME_HEIGHT = 450
export const PLAYER_Y = GAME_HEIGHT - 40 // Player at bottom of screen
export const PLAYER_WIDTH = 20
export const PLAYER_HEIGHT = 20
export const PLAYER_SPEED = 5 // Horizontal movement speed
export const INITIAL_ERROR_SPEED = 2
export const MAX_ERROR_SPEED = 8
export const ERROR_SPEED_INCREASE_RATE = 0.0001 // per frame
export const ERROR_WIDTH = 60
export const ERROR_HEIGHT = 40
export const POWER_UP_WIDTH = 30
export const POWER_UP_HEIGHT = 30
export const SCORE_PER_SECOND = 12 // Gateway of 10-15 pts per second
export const INVINCIBILITY_DURATION = 2500 // 2.5 seconds for "resolveu!"
export const SLOWDOWN_DURATION = 4000 // 4 seconds for "copiou do stackoverflow"
export const SLOWDOWN_MULTIPLIER = 0.5 // Error speed reduced by 50%

// Error types
export type ErrorType =
  | 'TypeError'
  | 'ReferenceError'
  | 'SyntaxError'
  | '404 Not Found'
  | 'NullPointerException'
  | 'Segmentation Fault'
  | 'Undefined is not a function'
  | 'buggy-pixelated-lines'

// Power-up types
export type PowerUpType = 'resolveu' | 'copiou-do-stackoverflow'

// Player position
export interface Player {
  x: number // X position at bottom of screen
  y: number // Fixed Y position (bottom)
}

// Falling error
export interface Error {
  x: number
  y: number
  type: ErrorType
  speed: number
}

// Falling power-up
export interface PowerUp {
  x: number
  y: number
  type: PowerUpType
  speed: number
}

// Game state
export interface GameState {
  player: Player
  errors: Error[]
  powerUps: PowerUp[]
  score: number
  bestScore: number
  gameOver: boolean
  startTime: number
  duration: number
  errorSpeed: number // Current error fall speed
  invincibilityTimer: number | null // Milliseconds remaining
  slowdownTimer: number | null // Milliseconds remaining
  lastErrorSpawnTime: number
  lastPowerUpSpawnTime: number
  errorsAvoided: number // For metadata
  powerUpsCollected: number // For metadata
  chaosMode: boolean // Chaos event active
  chaosEndTime: number | null // When chaos mode ends
}

/**
 * Create initial game state
 */
export function createInitialGameState(): GameState {
  return {
    player: {
      x: GAME_WIDTH / 2, // Start in center
      y: PLAYER_Y,
    },
    errors: [],
    powerUps: [],
    score: 0,
    bestScore: 0,
    gameOver: false,
    startTime: Date.now(),
    duration: 0,
    errorSpeed: INITIAL_ERROR_SPEED,
    invincibilityTimer: null,
    slowdownTimer: null,
    lastErrorSpawnTime: Date.now(),
    lastPowerUpSpawnTime: Date.now(),
    errorsAvoided: 0,
    powerUpsCollected: 0,
    chaosMode: false,
    chaosEndTime: null,
  }
}

/**
 * Update player position based on movement direction
 */
export function updatePlayerPosition(
  state: GameState,
  direction: 'left' | 'right' | null
): GameState {
  if (state.gameOver || !direction) {
    return state
  }

  const player = { ...state.player }
  const moveDistance = PLAYER_SPEED

  if (direction === 'left') {
    player.x = Math.max(PLAYER_WIDTH / 2, player.x - moveDistance)
  } else if (direction === 'right') {
    player.x = Math.min(GAME_WIDTH - PLAYER_WIDTH / 2, player.x + moveDistance)
  }

  return {
    ...state,
    player,
  }
}

/**
 * Update error speed (increases over time)
 */
function updateErrorSpeed(state: GameState, deltaTime: number): GameState {
  if (state.gameOver) {
    return state
  }

  // Apply slowdown multiplier if active
  const baseSpeed = Math.min(
    state.errorSpeed + ERROR_SPEED_INCREASE_RATE * deltaTime,
    MAX_ERROR_SPEED
  )

  const slowdownMultiplier = state.slowdownTimer !== null ? SLOWDOWN_MULTIPLIER : 1
  const newSpeed = baseSpeed * slowdownMultiplier

  return {
    ...state,
    errorSpeed: newSpeed,
  }
}

/**
 * Update timers (invincibility and slowdown)
 */
function updateTimers(state: GameState, deltaTime: number): GameState {
  if (state.gameOver) {
    return state
  }

  let invincibilityTimer = state.invincibilityTimer
  let slowdownTimer = state.slowdownTimer

  // Update invincibility timer
  if (invincibilityTimer !== null) {
    invincibilityTimer -= deltaTime
    if (invincibilityTimer <= 0) {
      invincibilityTimer = null
    }
  }

  // Update slowdown timer
  if (slowdownTimer !== null) {
    slowdownTimer -= deltaTime
    if (slowdownTimer <= 0) {
      slowdownTimer = null
    }
  }

  // Update chaos mode timer
  let chaosMode = state.chaosMode
  let chaosEndTime = state.chaosEndTime
  if (chaosMode && chaosEndTime !== null) {
    if (Date.now() >= chaosEndTime) {
      chaosMode = false
      chaosEndTime = null
    }
  }

  return {
    ...state,
    invincibilityTimer,
    slowdownTimer,
    chaosMode,
    chaosEndTime,
  }
}

/**
 * Update score (survival-based)
 */
function updateScore(state: GameState, deltaTime: number): GameState {
  if (state.gameOver) {
    return state
  }

  // Score increases with time: 12 points per second (gateway of 10-15)
  const scoreIncrease = (SCORE_PER_SECOND * deltaTime) / 1000

  return {
    ...state,
    score: state.score + scoreIncrease,
    duration: (Date.now() - state.startTime) / 1000,
  }
}

/**
 * Spawn a new error
 */
function spawnError(state: GameState): GameState {
  if (state.gameOver) {
    return state
  }

  const now = Date.now()
  const timeSinceLastSpawn = now - state.lastErrorSpawnTime

  // Calculate spawn interval (decreases as game progresses)
  const baseSpawnInterval = 1500 // 1.5 seconds base
  const minSpawnInterval = 500 // 0.5 seconds minimum
  const gameDuration = (now - state.startTime) / 1000
  const spawnInterval = Math.max(
    minSpawnInterval,
    baseSpawnInterval - (gameDuration * 10) // Decrease by 10ms per second
  )

  // Chaos mode: spawn much more frequently
  const actualSpawnInterval = state.chaosMode ? spawnInterval * 0.3 : spawnInterval

  if (timeSinceLastSpawn >= actualSpawnInterval) {
    const errorTypes: ErrorType[] = [
      'TypeError',
      'ReferenceError',
      'SyntaxError',
      '404 Not Found',
      'NullPointerException',
      'Segmentation Fault',
      'Undefined is not a function',
      'buggy-pixelated-lines',
    ]

    // Random X position
    const x = Math.random() * (GAME_WIDTH - ERROR_WIDTH) + ERROR_WIDTH / 2

    // Random error type
    const type = errorTypes[Math.floor(Math.random() * errorTypes.length)]

    const newError: Error = {
      x,
      y: -ERROR_HEIGHT, // Start above screen
      type,
      speed: state.errorSpeed,
    }

    return {
      ...state,
      errors: [...state.errors, newError],
      lastErrorSpawnTime: now,
    }
  }

  return state
}

/**
 * Spawn a new power-up (less frequent than errors)
 */
function spawnPowerUp(state: GameState): GameState {
  if (state.gameOver) {
    return state
  }

  const now = Date.now()
  const timeSinceLastSpawn = now - state.lastPowerUpSpawnTime

  // Power-ups spawn less frequently (every 3-5 seconds)
  const spawnInterval = 3000 + Math.random() * 2000 // 3-5 seconds

  if (timeSinceLastSpawn >= spawnInterval) {
    // Random X position
    const x = Math.random() * (GAME_WIDTH - POWER_UP_WIDTH) + POWER_UP_WIDTH / 2

    // Random power-up type
    const powerUpTypes: PowerUpType[] = ['resolveu', 'copiou-do-stackoverflow']
    const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)]

    const newPowerUp: PowerUp = {
      x,
      y: -POWER_UP_HEIGHT, // Start above screen
      type,
      speed: state.errorSpeed * 0.8, // Slightly slower than errors
    }

    return {
      ...state,
      powerUps: [...state.powerUps, newPowerUp],
      lastPowerUpSpawnTime: now,
    }
  }

  return state
}

/**
 * Update errors (move them down, remove off-screen)
 */
function updateErrors(state: GameState, deltaTime: number): GameState {
  if (state.gameOver) {
    return state
  }

  // Move errors down based on their speed
  const updatedErrors = state.errors
    .map(error => ({
      ...error,
      y: error.y + error.speed * (deltaTime / 16.67), // Normalize to 60 FPS
    }))
    .filter(error => error.y < GAME_HEIGHT + ERROR_HEIGHT) // Remove errors that passed bottom

  // Count errors that passed (avoided)
  const avoidedCount = state.errors.length - updatedErrors.length
  const errorsAvoided = state.errorsAvoided + avoidedCount

  return {
    ...state,
    errors: updatedErrors,
    errorsAvoided,
  }
}

/**
 * Update power-ups (move them down, remove off-screen)
 */
function updatePowerUps(state: GameState, deltaTime: number): GameState {
  if (state.gameOver) {
    return state
  }

  // Move power-ups down based on their speed
  const updatedPowerUps = state.powerUps
    .map(powerUp => ({
      ...powerUp,
      y: powerUp.y + powerUp.speed * (deltaTime / 16.67), // Normalize to 60 FPS
    }))
    .filter(powerUp => powerUp.y < GAME_HEIGHT + POWER_UP_HEIGHT) // Remove power-ups that passed bottom

  return {
    ...state,
    powerUps: updatedPowerUps,
  }
}

/**
 * Check collision between player and error
 */
function checkErrorCollision(player: Player, error: Error): boolean {
  // Player bounding box
  const playerLeft = player.x - PLAYER_WIDTH / 2
  const playerRight = player.x + PLAYER_WIDTH / 2
  const playerTop = player.y - PLAYER_HEIGHT
  const playerBottom = player.y

  // Error bounding box
  const errorLeft = error.x - ERROR_WIDTH / 2
  const errorRight = error.x + ERROR_WIDTH / 2
  const errorTop = error.y
  const errorBottom = error.y + ERROR_HEIGHT

  // AABB collision detection
  return (
    playerLeft < errorRight &&
    playerRight > errorLeft &&
    playerTop < errorBottom &&
    playerBottom > errorTop
  )
}

/**
 * Check collision between player and power-up
 */
function checkPowerUpCollision(player: Player, powerUp: PowerUp): boolean {
  // Player bounding box
  const playerLeft = player.x - PLAYER_WIDTH / 2
  const playerRight = player.x + PLAYER_WIDTH / 2
  const playerTop = player.y - PLAYER_HEIGHT
  const playerBottom = player.y

  // Power-up bounding box
  const powerUpLeft = powerUp.x - POWER_UP_WIDTH / 2
  const powerUpRight = powerUp.x + POWER_UP_WIDTH / 2
  const powerUpTop = powerUp.y
  const powerUpBottom = powerUp.y + POWER_UP_HEIGHT

  // AABB collision detection
  return (
    playerLeft < powerUpRight &&
    playerRight > powerUpLeft &&
    playerTop < powerUpBottom &&
    playerBottom > powerUpTop
  )
}

/**
 * Handle power-up collection
 */
function handlePowerUpCollection(state: GameState, powerUp: PowerUp): GameState {
  let newState = { ...state }

  if (powerUp.type === 'resolveu') {
    // Clear nearby errors (within radius)
    const clearRadius = 150
    newState.errors = newState.errors.filter(error => {
      const distance = Math.sqrt(
        Math.pow(error.x - state.player.x, 2) + Math.pow(error.y - state.player.y, 2)
      )
      return distance > clearRadius
    })

    // Grant invincibility (2-3 seconds)
    newState.invincibilityTimer = INVINCIBILITY_DURATION

    // Add bonus points (+50)
    newState.score += 50
  } else if (powerUp.type === 'copiou-do-stackoverflow') {
    // Reduce error speed for 3-5 seconds
    newState.slowdownTimer = SLOWDOWN_DURATION

    // Add bonus points (+30)
    newState.score += 30
  }

  // Remove collected power-up
  newState.powerUps = newState.powerUps.filter(p => p !== powerUp)
  newState.powerUpsCollected += 1

  return newState
}

/**
 * Check for collisions with errors
 */
function checkErrorCollisions(state: GameState): GameState {
  if (state.gameOver || state.invincibilityTimer !== null) {
    return state
  }

  // Check collision with any error
  const collidingError = state.errors.find(error =>
    checkErrorCollision(state.player, error)
  )

  if (collidingError) {
    return {
      ...state,
      gameOver: true,
    }
  }

  return state
}

/**
 * Check for collisions with power-ups
 */
function checkPowerUpCollisions(state: GameState): GameState {
  if (state.gameOver) {
    return state
  }

  // Check collision with any power-up
  const collidingPowerUp = state.powerUps.find(powerUp =>
    checkPowerUpCollision(state.player, powerUp)
  )

  if (collidingPowerUp) {
    return handlePowerUpCollection(state, collidingPowerUp)
  }

  return state
}

/**
 * Trigger chaos event (intense error rain)
 */
function checkChaosEvent(state: GameState): GameState {
  if (state.gameOver || state.chaosMode) {
    return state
  }

  const gameDuration = (Date.now() - state.startTime) / 1000

  // Trigger chaos every 30 seconds
  if (gameDuration > 0 && Math.floor(gameDuration) % 30 === 0 && gameDuration % 1 < 0.1) {
    return {
      ...state,
      chaosMode: true,
      chaosEndTime: Date.now() + 3000, // 3 seconds of chaos
    }
  }

  return state
}

/**
 * Update game state (called each frame)
 */
export function updateGameState(
  state: GameState,
  direction: 'left' | 'right' | null,
  deltaTime: number
): GameState {
  if (state.gameOver) {
    return state
  }

  let newState = { ...state }

  // Update player position
  newState = updatePlayerPosition(newState, direction)

  // Update timers
  newState = updateTimers(newState, deltaTime)

  // Update error speed
  newState = updateErrorSpeed(newState, deltaTime)

  // Update score
  newState = updateScore(newState, deltaTime)

  // Check for chaos event
  newState = checkChaosEvent(newState)

  // Spawn new errors
  newState = spawnError(newState)

  // Spawn new power-ups
  newState = spawnPowerUp(newState)

  // Update errors
  newState = updateErrors(newState, deltaTime)

  // Update power-ups
  newState = updatePowerUps(newState, deltaTime)

  // Check power-up collisions (before error collisions)
  newState = checkPowerUpCollisions(newState)

  // Check error collisions
  newState = checkErrorCollisions(newState)

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
  return Math.floor((Date.now() - state.startTime) / 1000)
}

/**
 * Load best score from localStorage
 */
export function loadBestScore(): number {
  if (typeof window === 'undefined') {
    return 0
  }

  const stored = localStorage.getItem('stack-overflow-dodge-best-score')
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
    localStorage.setItem('stack-overflow-dodge-best-score', score.toString())
  }
}

