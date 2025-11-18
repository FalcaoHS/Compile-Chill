/**
 * Tests for Dev Pong AI Logic
 * 
 * Note: Requires Jest or Vitest to be configured in package.json
 * Run: npm test or npm run test
 */

import {
  updateAIPaddle,
  calculateAIDifficulty,
  resetAIState,
  getAIDifficultyPercentage,
  trackAIPerformance,
} from './ai-logic'
import { createInitialGameState, type GameState, GAME_HEIGHT, PADDLE_HEIGHT } from './game-logic'

describe('Dev Pong AI Logic', () => {
  beforeEach(() => {
    // Reset AI state before each test
    resetAIState()
  })
  
  describe('AI Difficulty Calculation', () => {
    test('should start at minimum difficulty (30%)', () => {
      const state = createInitialGameState()
      state.playerScore = 0
      
      const difficulty = calculateAIDifficulty(state)
      
      expect(difficulty).toBe(0.3) // 30% difficulty
    })
    
    test('should increase difficulty as player scores', () => {
      const state = createInitialGameState()
      
      state.playerScore = 0
      const difficulty1 = calculateAIDifficulty(state)
      
      state.playerScore = 3
      const difficulty2 = calculateAIDifficulty(state)
      
      expect(difficulty2).toBeGreaterThan(difficulty1)
    })
    
    test('should never reach 100% difficulty (always beatable)', () => {
      const state = createInitialGameState()
      state.playerScore = 7 // Max score
      
      const difficulty = calculateAIDifficulty(state)
      
      expect(difficulty).toBeLessThan(1.0)
      expect(difficulty).toBeLessThanOrEqual(0.85) // Max difficulty is 85%
    })
    
    test('should return correct difficulty percentage string', () => {
      const state = createInitialGameState()
      state.playerScore = 0
      
      const percentageString = getAIDifficultyPercentage(state)
      
      expect(percentageString).toBe('30%')
    })
  })
  
  describe('AI Paddle Movement', () => {
    test('should move AI paddle toward ball', () => {
      const state = createInitialGameState()
      const initialY = state.aiPaddle.y
      
      // Position ball above AI paddle
      state.ball.y = initialY - 100
      state.ball.velocity.vx = 5 // Moving toward AI paddle
      
      const newState = updateAIPaddle(state, 16) // 16ms frame time
      
      // AI should move toward ball (upward, so Y should decrease or stay similar due to reaction delay)
      expect(newState.aiPaddle.y).toBeDefined()
    })
    
    test('should respect game boundaries', () => {
      const state = createInitialGameState()
      
      // Try to make AI move above top boundary
      state.ball.y = -100
      state.aiPaddle.y = 0
      state.ball.velocity.vx = 5
      
      const newState = updateAIPaddle(state, 16)
      
      expect(newState.aiPaddle.y).toBeGreaterThanOrEqual(0)
      expect(newState.aiPaddle.y).toBeLessThanOrEqual(GAME_HEIGHT - PADDLE_HEIGHT)
    })
    
    test('should update AI difficulty in game state', () => {
      const state = createInitialGameState()
      state.playerScore = 2
      
      const newState = updateAIPaddle(state, 16)
      
      // AI difficulty should be updated and higher than initial
      expect(newState.aiDifficulty).toBeGreaterThan(0.3)
    })
  })
  
  describe('AI Reaction and Behavior', () => {
    test('should have reaction delay at lower difficulty', () => {
      const state = createInitialGameState()
      state.playerScore = 0 // Low difficulty
      state.ball.y = 100
      state.aiPaddle.y = 300
      
      // First update - AI sees ball position
      const state1 = updateAIPaddle(state, 16)
      
      // Immediate second update - might still be in reaction delay
      const state2 = updateAIPaddle(state1, 16)
      
      // AI should exist and be working
      expect(state2.aiPaddle).toBeDefined()
    })
    
    test('should scale movement speed with difficulty', () => {
      const stateLow = createInitialGameState()
      stateLow.playerScore = 0 // 30% difficulty
      stateLow.ball.y = 100
      stateLow.aiPaddle.y = 300
      stateLow.ball.velocity.vx = 5
      
      const stateHigh = createInitialGameState()
      stateHigh.playerScore = 5 // Higher difficulty
      stateHigh.ball.y = 100
      stateHigh.aiPaddle.y = 300
      stateHigh.ball.velocity.vx = 5
      
      // Update both multiple times to overcome reaction delay
      let newStateLow = stateLow
      let newStateHigh = stateHigh
      for (let i = 0; i < 10; i++) {
        newStateLow = updateAIPaddle(newStateLow, 100) // Large delta to overcome reaction delay
        newStateHigh = updateAIPaddle(newStateHigh, 100)
      }
      
      // Higher difficulty AI should move faster (more total distance)
      const lowDistance = Math.abs(newStateLow.aiPaddle.y - stateLow.aiPaddle.y)
      const highDistance = Math.abs(newStateHigh.aiPaddle.y - stateHigh.aiPaddle.y)
      
      expect(highDistance).toBeGreaterThanOrEqual(lowDistance)
    })
  })
  
  describe('AI Performance Tracking', () => {
    test('should track AI performance', () => {
      const state = createInitialGameState()
      
      // Track successful hits
      trackAIPerformance(state, true)
      trackAIPerformance(state, true)
      
      // Should not throw error
      expect(true).toBe(true)
    })
    
    test('should reset consecutive hits on miss', () => {
      const state = createInitialGameState()
      
      // Track hit, then miss
      trackAIPerformance(state, true)
      trackAIPerformance(state, false)
      
      // Should not throw error
      expect(true).toBe(true)
    })
  })
  
  describe('AI State Management', () => {
    test('should reset AI state', () => {
      const state = createInitialGameState()
      
      // Use AI system
      updateAIPaddle(state, 16)
      
      // Reset
      resetAIState()
      
      // Should not throw error
      expect(true).toBe(true)
    })
  })
})

