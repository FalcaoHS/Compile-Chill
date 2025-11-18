/**
 * Game logic for Dev Pong
 * 
 * Core game mechanics: ball physics, paddle movement, collision detection, scoring
 */

// Game constants
export const GAME_WIDTH = 800
export const GAME_HEIGHT = 450 // Reduced from 600 for faster gameplay
export const PADDLE_WIDTH = 15
export const PADDLE_HEIGHT = 100
export const BALL_SIZE = 10
export const PADDLE_SPEED = 8 // Used by AI logic
export const INITIAL_BALL_SPEED = 5
export const MAX_BALL_SPEED = 12
export const WINNING_SCORE = 7

// Ball velocity
export interface BallVelocity {
  vx: number
  vy: number
}

// Paddle position
export interface Paddle {
  x: number
  y: number
  width: number
  height: number
}

// Ball position
export interface Ball {
  x: number
  y: number
  size: number
  velocity: BallVelocity
}

// Game state
export interface GameState {
  playerPaddle: Paddle
  aiPaddle: Paddle
  ball: Ball
  playerScore: number
  aiScore: number
  gameOver: boolean
  winner: 'player' | 'ai' | null
  startTime: number
  hitCount: number
  ballSpeed: number
  aiDifficulty: number // 0-1 scale, starts low
}

/**
 * Create initial game state
 */
export function createInitialGameState(): GameState {
  return {
    playerPaddle: {
      x: 30,
      y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    },
    aiPaddle: {
      x: GAME_WIDTH - 30 - PADDLE_WIDTH,
      y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    },
    ball: {
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 2,
      size: BALL_SIZE,
      velocity: {
        vx: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
        vy: INITIAL_BALL_SPEED * (Math.random() * 0.5 - 0.25),
      },
    },
    playerScore: 0,
    aiScore: 0,
    gameOver: false,
    winner: null,
    startTime: Date.now(),
    hitCount: 0,
    ballSpeed: INITIAL_BALL_SPEED,
    aiDifficulty: 0.3, // Start at 30% difficulty
  }
}

/**
 * Reset ball to center after scoring
 */
export function resetBall(state: GameState, favorPlayer: boolean = false): GameState {
  const direction = favorPlayer ? -1 : 1
  const angle = (Math.random() * 0.5 - 0.25) * Math.PI // Random angle -45 to 45 degrees
  
  return {
    ...state,
    ball: {
      ...state.ball,
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 2,
      velocity: {
        vx: INITIAL_BALL_SPEED * direction,
        vy: INITIAL_BALL_SPEED * Math.sin(angle),
      },
    },
    ballSpeed: INITIAL_BALL_SPEED,
  }
}

/**
 * Move player paddle (clamped to game bounds)
 */
export function movePlayerPaddle(state: GameState, targetY: number): GameState {
  const newY = Math.max(0, Math.min(GAME_HEIGHT - PADDLE_HEIGHT, targetY))
  
  return {
    ...state,
    playerPaddle: {
      ...state.playerPaddle,
      y: newY,
    },
  }
}

/**
 * Move AI paddle toward ball (uses adaptive AI from ai-logic.ts)
 * This is a wrapper function for backwards compatibility
 */
export function moveAIPaddle(state: GameState): GameState {
  // Import and use AI logic
  // Note: This function is kept for API compatibility
  // The actual AI logic is in updateAIPaddle from ai-logic.ts
  const paddleCenter = state.aiPaddle.y + state.aiPaddle.height / 2
  const ballCenter = state.ball.y
  const diff = ballCenter - paddleCenter
  
  // AI reacts based on difficulty level
  const reactionSpeed = PADDLE_SPEED * state.aiDifficulty
  
  let newY = state.aiPaddle.y
  if (Math.abs(diff) > 5) {
    // Move toward ball
    newY += Math.sign(diff) * reactionSpeed
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
 * Check collision between ball and paddle
 */
function checkPaddleCollision(ball: Ball, paddle: Paddle): boolean {
  return (
    ball.x + ball.size / 2 > paddle.x &&
    ball.x - ball.size / 2 < paddle.x + paddle.width &&
    ball.y + ball.size / 2 > paddle.y &&
    ball.y - ball.size / 2 < paddle.y + paddle.height
  )
}

/**
 * Calculate new ball angle based on where it hits the paddle
 */
function calculateBallAngle(ball: Ball, paddle: Paddle): number {
  const paddleCenter = paddle.y + paddle.height / 2
  const ballRelativeY = ball.y - paddleCenter
  const normalizedY = ballRelativeY / (paddle.height / 2) // -1 to 1
  
  // Angle ranges from -60 to 60 degrees based on hit position
  return normalizedY * (Math.PI / 3)
}

/**
 * Update ball position and handle collisions
 */
export function updateBall(state: GameState): GameState {
  if (state.gameOver) {
    return state
  }
  
  let newState = { ...state }
  let ball = { ...state.ball }
  let velocity = { ...ball.velocity }
  
  // Move ball
  ball.x += velocity.vx
  ball.y += velocity.vy
  
  // Wall collision (top and bottom)
  if (ball.y - ball.size / 2 <= 0 || ball.y + ball.size / 2 >= GAME_HEIGHT) {
    // Increase speed when bouncing off walls to prevent endless bouncing
    const currentSpeed = Math.sqrt(velocity.vx ** 2 + velocity.vy ** 2)
    const speedIncrease = 1.20 // 20% increase per wall bounce - significant boost!
    const newSpeed = Math.min(currentSpeed * speedIncrease, MAX_BALL_SPEED)
    
    // Invert Y direction and apply speed increase
    velocity.vy = -velocity.vy
    const speedRatio = newSpeed / currentSpeed
    velocity.vx *= speedRatio
    velocity.vy *= speedRatio
    
    ball.y = Math.max(ball.size / 2, Math.min(GAME_HEIGHT - ball.size / 2, ball.y))
    
    // Update ball speed in state
    newState.ballSpeed = newSpeed
  }
  
  // Player paddle collision
  if (velocity.vx < 0 && checkPaddleCollision(ball, state.playerPaddle)) {
    const angle = calculateBallAngle(ball, state.playerPaddle)
    const speed = Math.min(newState.ballSpeed * 1.05, MAX_BALL_SPEED) // Increase speed slightly
    
    velocity.vx = Math.abs(velocity.vx) * Math.cos(angle)
    velocity.vy = speed * Math.sin(angle)
    
    ball.x = state.playerPaddle.x + state.playerPaddle.width + ball.size / 2
    
    newState.hitCount += 1
    newState.ballSpeed = speed
  }
  
  // AI paddle collision
  if (velocity.vx > 0 && checkPaddleCollision(ball, state.aiPaddle)) {
    const angle = calculateBallAngle(ball, state.aiPaddle)
    const speed = Math.min(newState.ballSpeed * 1.05, MAX_BALL_SPEED)
    
    velocity.vx = -Math.abs(velocity.vx) * Math.cos(angle)
    velocity.vy = speed * Math.sin(angle)
    
    ball.x = state.aiPaddle.x - ball.size / 2
    
    newState.hitCount += 1
    newState.ballSpeed = speed
  }
  
  // Check for scoring
  if (ball.x < 0) {
    // AI scores
    newState.aiScore += 1
    if (newState.aiScore >= WINNING_SCORE) {
      newState.gameOver = true
      newState.winner = 'ai'
    } else {
      newState = resetBall(newState, true) // Favor player on next serve
    }
    return newState
  }
  
  if (ball.x > GAME_WIDTH) {
    // Player scores
    newState.playerScore += 1
    if (newState.playerScore >= WINNING_SCORE) {
      newState.gameOver = true
      newState.winner = 'player'
    } else {
      newState = resetBall(newState, false) // Favor AI on next serve
    }
    return newState
  }
  
  // Update ball state
  newState.ball = {
    ...ball,
    velocity,
  }
  
  return newState
}

/**
 * Update game state (called each frame)
 */
export function updateGameState(state: GameState, playerPaddleY?: number): GameState {
  if (state.gameOver) {
    return state
  }
  
  let newState = { ...state }
  
  // Update player paddle if Y position provided
  if (playerPaddleY !== undefined) {
    newState = movePlayerPaddle(newState, playerPaddleY)
  }
  
  // Update AI paddle
  newState = moveAIPaddle(newState)
  
  // Update ball
  newState = updateBall(newState)
  
  return newState
}

/**
 * Reset game to initial state
 * Note: Also reset AI state when using adaptive AI from ai-logic.ts
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
  
  const stored = localStorage.getItem('dev-pong-best-score')
  return stored ? parseInt(stored, 10) : 0
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
    localStorage.setItem('dev-pong-best-score', score.toString())
  }
}

