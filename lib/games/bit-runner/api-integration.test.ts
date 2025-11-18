/**
 * API Integration tests for Bit Runner
 * Tests score submission format and data structure
 */

import {
  createInitialGameState,
  getMatchDuration,
  type GameState,
} from './game-logic'

describe('Bit Runner API Integration', () => {
  describe('Score Submission Format', () => {
    test('should create valid score submission payload', () => {
      const gameState: GameState = {
        ...createInitialGameState(),
        distance: 1234,
        gameSpeed: 8,
        gameOver: true,
      }

      const duration = getMatchDuration(gameState)

      const payload = {
        gameId: 'bit-runner',
        score: Math.floor(gameState.distance),
        duration,
        moves: 0,
        metadata: {
          finalDistance: Math.floor(gameState.distance),
          gameSpeed: gameState.gameSpeed,
          obstaclesAvoided: gameState.obstacles.length,
          spawnPatterns: gameState.spawnPatterns,
        },
        gameState: {
          distance: gameState.distance,
          gameSpeed: gameState.gameSpeed,
          duration,
        },
      }

      // Verify payload structure
      expect(payload.gameId).toBe('bit-runner')
      expect(payload.score).toBe(1234)
      expect(typeof payload.duration).toBe('number')
      expect(payload.moves).toBe(0)
      expect(payload.metadata).toHaveProperty('finalDistance')
      expect(payload.metadata).toHaveProperty('gameSpeed')
      expect(payload.metadata).toHaveProperty('obstaclesAvoided')
      expect(payload.metadata).toHaveProperty('spawnPatterns')
      expect(payload.gameState).toHaveProperty('distance')
      expect(payload.gameState).toHaveProperty('gameSpeed')
      expect(payload.gameState).toHaveProperty('duration')
    })

    test('should floor decimal distances for score', () => {
      const gameState: GameState = {
        ...createInitialGameState(),
        distance: 1234.56789,
        gameOver: true,
      }

      const score = Math.floor(gameState.distance)

      expect(score).toBe(1234)
      expect(typeof score).toBe('number')
    })

    test('should calculate duration correctly', () => {
      const gameState: GameState = {
        ...createInitialGameState(),
        startTime: Date.now() - 5000, // 5 seconds ago
        gameOver: true,
      }

      const duration = getMatchDuration(gameState)

      expect(duration).toBeGreaterThanOrEqual(4900)
      expect(duration).toBeLessThanOrEqual(5100)
    })

    test('should include all required fields', () => {
      const gameState: GameState = {
        ...createInitialGameState(),
        distance: 1000,
        gameOver: true,
      }

      const requiredFields = [
        'gameId',
        'score',
        'duration',
        'moves',
        'metadata',
        'gameState',
      ]

      const payload: Record<string, any> = {
        gameId: 'bit-runner',
        score: Math.floor(gameState.distance),
        duration: getMatchDuration(gameState),
        moves: 0,
        metadata: {
          finalDistance: Math.floor(gameState.distance),
          gameSpeed: gameState.gameSpeed,
          obstaclesAvoided: gameState.obstacles.length,
          spawnPatterns: gameState.spawnPatterns,
        },
        gameState: {
          distance: gameState.distance,
          gameSpeed: gameState.gameSpeed,
          duration: getMatchDuration(gameState),
        },
      }

      requiredFields.forEach((field) => {
        expect(payload).toHaveProperty(field)
      })
    })
  })

  describe('Metadata Structure', () => {
    test('should include game-specific metadata', () => {
      const gameState: GameState = {
        ...createInitialGameState(),
        distance: 2000,
        gameSpeed: 10,
        gameOver: true,
      }

      const metadata = {
        finalDistance: Math.floor(gameState.distance),
        gameSpeed: gameState.gameSpeed,
        obstaclesAvoided: gameState.obstacles.length,
        spawnPatterns: gameState.spawnPatterns,
      }

      expect(metadata.finalDistance).toBe(2000)
      expect(metadata.gameSpeed).toBe(10)
      expect(typeof metadata.obstaclesAvoided).toBe('number')
      expect(Array.isArray(metadata.spawnPatterns)).toBe(true)
    })

    test('should include spawn patterns history', () => {
      const gameState: GameState = {
        ...createInitialGameState(),
        spawnPatterns: ['single', 'double', 'triple'],
        gameOver: true,
      }

      const metadata = {
        spawnPatterns: gameState.spawnPatterns,
      }

      expect(metadata.spawnPatterns).toHaveLength(3)
      expect(metadata.spawnPatterns).toContain('single')
      expect(metadata.spawnPatterns).toContain('double')
      expect(metadata.spawnPatterns).toContain('triple')
    })
  })
})

