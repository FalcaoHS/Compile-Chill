/**
 * Tests for Bit Runner game logic
 */

import {
  createInitialGameState,
  updateCharacterState,
  updateGameState,
  checkCollision,
  resetGame,
  isGameOver,
  getMatchDuration,
  loadBestScore,
  saveBestScore,
  type Character,
  type Obstacle,
} from './game-logic'

describe('Bit Runner Game Logic', () => {
  describe('Game State Initialization', () => {
    test('should create initial game state with correct defaults', () => {
      const state = createInitialGameState()

      expect(state.character.state).toBe('running')
      expect(state.character.x).toBe(100)
      expect(state.character.y).toBeGreaterThan(0)
      expect(state.obstacles).toEqual([])
      expect(state.distance).toBe(0)
      expect(state.gameSpeed).toBeGreaterThan(0)
      expect(state.gameOver).toBe(false)
      expect(state.startTime).toBeGreaterThan(0)
    })

    test('should initialize character in running state', () => {
      const state = createInitialGameState()

      expect(state.character.state).toBe('running')
      expect(state.character.animationFrame).toBe(0)
    })
  })

  describe('Character Movement', () => {
    test('should transition to jumping state on jump action', () => {
      const state = createInitialGameState()
      const newState = updateCharacterState(state, 'jump')

      expect(newState.character.state).toBe('jumping')
      expect(newState.character.y).toBeLessThan(state.character.y)
    })

    test('should transition to ducking state on duck action', () => {
      const state = createInitialGameState()
      const newState = updateCharacterState(state, 'duck')

      expect(newState.character.state).toBe('ducking')
      expect(newState.character.y).toBeGreaterThan(state.character.y)
    })

    test('should not change state if already jumping', () => {
      const state = createInitialGameState()
      const jumpingState = updateCharacterState(state, 'jump')
      const doubleJumpState = updateCharacterState(jumpingState, 'jump')

      expect(doubleJumpState.character.state).toBe('jumping')
    })

    test('should not change state if already ducking', () => {
      const state = createInitialGameState()
      const duckingState = updateCharacterState(state, 'duck')
      const doubleDuckState = updateCharacterState(duckingState, 'duck')

      expect(doubleDuckState.character.state).toBe('ducking')
    })
  })

  describe('Collision Detection', () => {
    test('should detect collision when character overlaps obstacle', () => {
      const character: Character = {
        x: 100,
        y: 400,
        state: 'running',
        stateStartTime: Date.now(),
        animationFrame: 0,
      }

      const obstacle: Obstacle = {
        x: 110,
        y: 400,
        width: 30,
        height: 30,
        type: 'compiler',
      }

      expect(checkCollision(character, obstacle)).toBe(true)
    })

    test('should not detect collision when character is clear', () => {
      const character: Character = {
        x: 100,
        y: 400,
        state: 'running',
        stateStartTime: Date.now(),
        animationFrame: 0,
      }

      const obstacle: Obstacle = {
        x: 200,
        y: 400,
        width: 30,
        height: 30,
        type: 'compiler',
      }

      expect(checkCollision(character, obstacle)).toBe(false)
    })

    test('should detect collision during duck state', () => {
      const character: Character = {
        x: 100,
        y: 438, // Ducking position
        state: 'ducking',
        stateStartTime: Date.now(),
        animationFrame: 0,
      }

      const obstacle: Obstacle = {
        x: 110,
        y: 400,
        width: 30,
        height: 50, // High obstacle
        type: 'bug',
      }

      expect(checkCollision(character, obstacle)).toBe(true)
    })
  })

  describe('Distance Tracking', () => {
    test('should increment distance over time', () => {
      const state = createInitialGameState()
      const deltaTime = 16.67 // ~1 frame at 60 FPS

      const newState = updateGameState(state, null, deltaTime)

      expect(newState.distance).toBeGreaterThan(state.distance)
    })

    test('should stop distance tracking when game over', () => {
      const state = createInitialGameState()
      const obstacle: Obstacle = {
        x: 100,
        y: 400,
        width: 30,
        height: 30,
        type: 'compiler',
      }

      // Add obstacle that will collide
      const stateWithObstacle = {
        ...state,
        obstacles: [obstacle],
      }

      const newState = updateGameState(stateWithObstacle, null, 16.67)
      const finalState = updateGameState(newState, null, 16.67)

      expect(finalState.gameOver).toBe(true)
      expect(finalState.distance).toBe(newState.distance) // Distance should not increase
    })
  })

  describe('Game Over Detection', () => {
    test('should trigger game over on collision', () => {
      const state = createInitialGameState()
      const obstacle: Obstacle = {
        x: 100,
        y: 400,
        width: 30,
        height: 30,
        type: 'compiler',
      }

      const stateWithObstacle = {
        ...state,
        obstacles: [obstacle],
      }

      const newState = updateGameState(stateWithObstacle, null, 16.67)

      expect(newState.gameOver).toBe(true)
      expect(isGameOver(newState)).toBe(true)
    })

    test('should not trigger game over when no collision', () => {
      const state = createInitialGameState()
      const obstacle: Obstacle = {
        x: 200,
        y: 100, // Far from character
        width: 30,
        height: 30,
        type: 'compiler',
      }

      const stateWithObstacle = {
        ...state,
        obstacles: [obstacle],
      }

      const newState = updateGameState(stateWithObstacle, null, 16.67)

      expect(newState.gameOver).toBe(false)
    })
  })

  describe('Game State Management', () => {
    test('should reset game to initial state', () => {
      const state = createInitialGameState()
      const updatedState = updateGameState(state, 'jump', 1000)
      const resetState = resetGame()

      expect(resetState.character.state).toBe('running')
      expect(resetState.distance).toBe(0)
      expect(resetState.gameOver).toBe(false)
      expect(resetState.obstacles).toEqual([])
    })

    test('should calculate match duration correctly', () => {
      const state = createInitialGameState()
      const duration = getMatchDuration(state)

      expect(duration).toBeGreaterThanOrEqual(0)
    })
  })

  describe('LocalStorage Integration', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    test('should load best score from localStorage', () => {
      localStorage.setItem('bit-runner-best-score', '1000')
      const bestScore = loadBestScore()

      expect(bestScore).toBe(1000)
    })

    test('should return 0 if no best score exists', () => {
      const bestScore = loadBestScore()

      expect(bestScore).toBe(0)
    })

    test('should save best score to localStorage', () => {
      saveBestScore(1500)

      expect(localStorage.getItem('bit-runner-best-score')).toBe('1500')
    })

    test('should only save if new score is higher', () => {
      saveBestScore(1000)
      saveBestScore(500) // Lower score

      expect(localStorage.getItem('bit-runner-best-score')).toBe('1000')
    })
  })
})

