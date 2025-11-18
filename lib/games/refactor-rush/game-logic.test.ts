/**
 * Tests for Refactor Rush game logic
 */

import {
  createInitialGameState,
  createEmptyGrid,
  isValidGridPosition,
  moveBlock,
  checkCompletion,
  calculateScore,
  undoLastMove,
  updateGameState,
  type GameState,
  type BlockPosition,
} from './game-logic'

// Test level data
const testLevel = {
  level: 1,
  gridSize: 3,
  initialBlocks: [
    { id: 'block1', type: 'import', row: 0, col: 0 },
    { id: 'block2', type: 'const', row: 0, col: 1 },
    { id: 'block3', type: 'function', row: 0, col: 2 },
  ],
  targetBlocks: [
    { id: 'block1', type: 'import', row: 0, col: 0 },
    { id: 'block2', type: 'const', row: 0, col: 1 },
    { id: 'block3', type: 'function', row: 0, col: 2 },
  ],
  rules: 'Organize blocks in order: imports, constants, functions',
}

describe('Refactor Rush Game Logic', () => {
  describe('createInitialGameState', () => {
    it('should create initial state with level data', () => {
      const state = createInitialGameState(testLevel)
      expect(state.level).toBe(1)
      expect(state.gridSize).toBe(3)
      expect(state.moves).toBe(0)
      expect(state.completed).toBe(false)
      expect(state.gameOver).toBe(false)
      expect(state.grid[0][0]).toBe('block1')
      expect(state.targetGrid[0][0]).toBe('block1')
    })

    it('should create initial state without level data', () => {
      const state = createInitialGameState()
      expect(state.level).toBe(1)
      expect(state.gridSize).toBe(3)
      expect(state.grid).toEqual(createEmptyGrid(3))
    })
  })

  describe('createEmptyGrid', () => {
    it('should create empty grid of specified size', () => {
      const grid = createEmptyGrid(3)
      expect(grid).toHaveLength(3)
      expect(grid[0]).toHaveLength(3)
      expect(grid[0][0]).toBeNull()
    })

    it('should create empty grid of size 4', () => {
      const grid = createEmptyGrid(4)
      expect(grid).toHaveLength(4)
      expect(grid[0]).toHaveLength(4)
    })
  })

  describe('isValidGridPosition', () => {
    it('should validate positions within grid bounds', () => {
      expect(isValidGridPosition(0, 0, 3)).toBe(true)
      expect(isValidGridPosition(2, 2, 3)).toBe(true)
      expect(isValidGridPosition(4, 4, 5)).toBe(true)
    })

    it('should reject positions outside grid bounds', () => {
      expect(isValidGridPosition(-1, 0, 3)).toBe(false)
      expect(isValidGridPosition(0, -1, 3)).toBe(false)
      expect(isValidGridPosition(3, 0, 3)).toBe(false)
      expect(isValidGridPosition(0, 3, 3)).toBe(false)
    })
  })

  describe('moveBlock', () => {
    it('should move block from source to destination', () => {
      const state = createInitialGameState(testLevel)
      const newState = moveBlock(state, { row: 0, col: 0 }, { row: 1, col: 1 })
      expect(newState.grid[0][0]).toBeNull()
      expect(newState.grid[1][1]).toBe('block1')
      expect(newState.moves).toBe(1)
    })

    it('should swap blocks when destination is occupied', () => {
      const state = createInitialGameState(testLevel)
      const newState = moveBlock(state, { row: 0, col: 0 }, { row: 0, col: 1 })
      expect(newState.grid[0][0]).toBe('block2')
      expect(newState.grid[0][1]).toBe('block1')
      expect(newState.moves).toBe(1)
    })

    it('should not move block to invalid position', () => {
      const state = createInitialGameState(testLevel)
      const newState = moveBlock(state, { row: 0, col: 0 }, { row: 5, col: 5 })
      expect(newState.grid[0][0]).toBe('block1')
      expect(newState.moves).toBe(0)
    })

    it('should track move history for undo', () => {
      const state = createInitialGameState(testLevel)
      const newState = moveBlock(state, { row: 0, col: 0 }, { row: 1, col: 1 })
      expect(newState.moveHistory).toHaveLength(1)
      expect(newState.moveHistory[0].from).toEqual({ row: 0, col: 0 })
      expect(newState.moveHistory[0].to).toEqual({ row: 1, col: 1 })
    })
  })

  describe('checkCompletion', () => {
    it('should detect completion when grid matches target', () => {
      const state = createInitialGameState(testLevel)
      // Grid already matches target in test level
      expect(checkCompletion(state)).toBe(true)
    })

    it('should not detect completion when grid does not match target', () => {
      const state = createInitialGameState(testLevel)
      const movedState = moveBlock(state, { row: 0, col: 0 }, { row: 1, col: 1 })
      expect(checkCompletion(movedState)).toBe(false)
    })
  })

  describe('calculateScore', () => {
    it('should calculate score based on moves and duration', () => {
      const state = createInitialGameState(testLevel)
      const movedState = moveBlock(state, { row: 0, col: 0 }, { row: 1, col: 1 })
      const updatedState = updateGameState(movedState)
      const scoreData = calculateScore(updatedState)
      expect(scoreData.score).toBeGreaterThan(0)
      expect(scoreData.moves).toBe(1)
      expect(scoreData.gridSize).toBe(3)
      expect(scoreData.levelId).toBe(1)
    })

    it('should calculate lower score with more moves', () => {
      const state = createInitialGameState(testLevel)
      let currentState = state
      // Make 2 moves
      currentState = moveBlock(currentState, { row: 0, col: 0 }, { row: 1, col: 1 })
      currentState = moveBlock(currentState, { row: 1, col: 1 }, { row: 0, col: 0 })
      const updatedState = updateGameState(currentState)
      const scoreData = calculateScore(updatedState)
      expect(scoreData.score).toBeLessThan(500) // Base score is 500
    })
  })

  describe('undoLastMove', () => {
    it('should undo last move and restore previous grid state', () => {
      const state = createInitialGameState(testLevel)
      const movedState = moveBlock(state, { row: 0, col: 0 }, { row: 1, col: 1 })
      const undoneState = undoLastMove(movedState)
      expect(undoneState.grid[0][0]).toBe('block1')
      expect(undoneState.grid[1][1]).toBeNull()
      expect(undoneState.moves).toBe(0)
    })

    it('should not undo when no moves available', () => {
      const state = createInitialGameState(testLevel)
      const undoneState = undoLastMove(state)
      expect(undoneState).toEqual(state)
    })
  })
})

