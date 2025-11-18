/**
 * Tests for Dev Pong game logic
 * 
 * Note: Requires Jest or Vitest to be configured in package.json
 * Run: npm test or npm run test
 */

import {
  createInitialGameState,
  updateBall,
  movePlayerPaddle,
  resetBall,
  isGameOver,
  GAME_WIDTH,
  GAME_HEIGHT,
  PADDLE_HEIGHT,
  WINNING_SCORE,
  type GameState,
} from './game-logic'

describe('Dev Pong Game Logic', () => {
  describe('Game State Initialization', () => {
    test('should create initial game state with correct default values', () => {
      const state = createInitialGameState()
      
      expect(state.playerScore).toBe(0)
      expect(state.aiScore).toBe(0)
      expect(state.gameOver).toBe(false)
      expect(state.winner).toBe(null)
      expect(state.hitCount).toBe(0)
      expect(state.ballSpeed).toBeGreaterThan(0)
      expect(state.aiDifficulty).toBeGreaterThan(0)
      expect(state.aiDifficulty).toBeLessThan(1)
    })
    
    test('should position paddles and ball correctly', () => {
      const state = createInitialGameState()
      
      // Player paddle on left side
      expect(state.playerPaddle.x).toBeLessThan(GAME_WIDTH / 2)
      expect(state.playerPaddle.y).toBeGreaterThanOrEqual(0)
      
      // AI paddle on right side
      expect(state.aiPaddle.x).toBeGreaterThan(GAME_WIDTH / 2)
      expect(state.aiPaddle.y).toBeGreaterThanOrEqual(0)
      
      // Ball in center
      expect(state.ball.x).toBe(GAME_WIDTH / 2)
      expect(state.ball.y).toBe(GAME_HEIGHT / 2)
    })
  })
  
  describe('Ball Physics', () => {
    test('should move ball based on velocity', () => {
      const state = createInitialGameState()
      const initialX = state.ball.x
      const initialY = state.ball.y
      
      const newState = updateBall(state)
      
      // Ball should have moved
      expect(newState.ball.x).not.toBe(initialX)
      expect(newState.ball.y).not.toBe(initialY)
    })
    
    test('should reflect ball on wall collision', () => {
      const state = createInitialGameState()
      // Position ball at top wall with downward velocity
      state.ball.y = 0
      state.ball.velocity.vy = -5
      
      const newState = updateBall(state)
      
      // Velocity Y should reverse
      expect(newState.ball.velocity.vy).toBeGreaterThan(0)
    })
  })
  
  describe('Paddle Movement', () => {
    test('should move player paddle to target Y position', () => {
      const state = createInitialGameState()
      const targetY = 200
      
      const newState = movePlayerPaddle(state, targetY)
      
      expect(newState.playerPaddle.y).toBe(targetY)
    })
    
    test('should clamp paddle within game boundaries', () => {
      const state = createInitialGameState()
      
      // Try to move above game area
      const state1 = movePlayerPaddle(state, -100)
      expect(state1.playerPaddle.y).toBe(0)
      
      // Try to move below game area
      const state2 = movePlayerPaddle(state, GAME_HEIGHT + 100)
      expect(state2.playerPaddle.y).toBe(GAME_HEIGHT - PADDLE_HEIGHT)
    })
  })
  
  describe('Scoring System', () => {
    test('should award point when ball passes paddle', () => {
      const state = createInitialGameState()
      // Position ball past player paddle (left side)
      state.ball.x = -10
      state.ball.velocity.vx = -5
      
      const newState = updateBall(state)
      
      // AI should score
      expect(newState.aiScore).toBe(state.aiScore + 1)
    })
    
    test('should reset ball after scoring', () => {
      const state = createInitialGameState()
      state.ball.x = -10
      
      const newState = updateBall(state)
      
      // Ball should be back at center
      expect(newState.ball.x).toBe(GAME_WIDTH / 2)
      expect(newState.ball.y).toBe(GAME_HEIGHT / 2)
    })
  })
  
  describe('Win Condition', () => {
    test('should detect game over when player reaches winning score', () => {
      const state = createInitialGameState()
      state.playerScore = WINNING_SCORE - 1
      state.ball.x = GAME_WIDTH + 10 // Ball past AI paddle
      
      const newState = updateBall(state)
      
      expect(newState.gameOver).toBe(true)
      expect(newState.winner).toBe('player')
    })
    
    test('should detect game over when AI reaches winning score', () => {
      const state = createInitialGameState()
      state.aiScore = WINNING_SCORE - 1
      state.ball.x = -10 // Ball past player paddle
      
      const newState = updateBall(state)
      
      expect(newState.gameOver).toBe(true)
      expect(newState.winner).toBe('ai')
    })
    
    test('isGameOver should return correct status', () => {
      const activeState = createInitialGameState()
      expect(isGameOver(activeState)).toBe(false)
      
      const gameOverState = createInitialGameState()
      gameOverState.gameOver = true
      expect(isGameOver(gameOverState)).toBe(true)
    })
  })
})

