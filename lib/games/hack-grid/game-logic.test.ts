/**
 * Tests for Hack Grid game logic
 */

import {
  createInitialGameState,
  isValidNodePosition,
  calculateSegments,
  isGridAligned,
  connectionExists,
  validateConnection,
  addConnection,
  removeConnection,
  selectNode,
  checkCompletion,
  updateGameState,
  calculateScore,
  resetGame,
  getScoreData,
  type Level,
  type Node,
} from './game-logic'

// Test level data
const testLevel: Level = {
  level: 1,
  nodes: [
    { id: 'node1', row: 0, col: 0 },
    { id: 'node2', row: 0, col: 2 },
    { id: 'node3', row: 2, col: 2 },
  ],
  requiredConnections: [
    { from: 'node1', to: 'node2' },
    { from: 'node2', to: 'node3' },
  ],
  difficulty: 1,
}

describe('Hack Grid Game Logic', () => {
  describe('createInitialGameState', () => {
    it('should create initial state with level data', () => {
      const state = createInitialGameState(testLevel)
      expect(state.currentLevel).toBe(1)
      expect(state.level).toBe(testLevel)
      expect(state.nodes).toHaveLength(3)
      expect(state.connections).toHaveLength(0)
      expect(state.moves).toBe(0)
      expect(state.segments).toBe(0)
      expect(state.completed).toBe(false)
    })

    it('should create initial state without level data', () => {
      const state = createInitialGameState()
      expect(state.currentLevel).toBe(1)
      expect(state.level).toBeNull()
      expect(state.nodes).toHaveLength(0)
    })
  })

  describe('isValidNodePosition', () => {
    it('should validate positions within grid bounds', () => {
      expect(isValidNodePosition(0, 0)).toBe(true)
      expect(isValidNodePosition(5, 5)).toBe(true)
      expect(isValidNodePosition(3, 3)).toBe(true)
    })

    it('should reject positions outside grid bounds', () => {
      expect(isValidNodePosition(-1, 0)).toBe(false)
      expect(isValidNodePosition(0, -1)).toBe(false)
      expect(isValidNodePosition(6, 0)).toBe(false)
      expect(isValidNodePosition(0, 6)).toBe(false)
    })
  })

  describe('calculateSegments', () => {
    it('should calculate segments for horizontal connection', () => {
      const from: Node = { id: '1', row: 0, col: 0, state: 'idle' }
      const to: Node = { id: '2', row: 0, col: 3, state: 'idle' }
      expect(calculateSegments(from, to)).toBe(3)
    })

    it('should calculate segments for vertical connection', () => {
      const from: Node = { id: '1', row: 0, col: 0, state: 'idle' }
      const to: Node = { id: '2', row: 3, col: 0, state: 'idle' }
      expect(calculateSegments(from, to)).toBe(3)
    })

    it('should calculate segments for L-shaped path', () => {
      const from: Node = { id: '1', row: 0, col: 0, state: 'idle' }
      const to: Node = { id: '2', row: 2, col: 2, state: 'idle' }
      expect(calculateSegments(from, to)).toBe(4) // 2 rows + 2 cols
    })
  })

  describe('isGridAligned', () => {
    it('should return true for horizontal alignment', () => {
      const from: Node = { id: '1', row: 0, col: 0, state: 'idle' }
      const to: Node = { id: '2', row: 0, col: 3, state: 'idle' }
      expect(isGridAligned(from, to)).toBe(true)
    })

    it('should return true for vertical alignment', () => {
      const from: Node = { id: '1', row: 0, col: 0, state: 'idle' }
      const to: Node = { id: '2', row: 3, col: 0, state: 'idle' }
      expect(isGridAligned(from, to)).toBe(true)
    })

    it('should return false for diagonal alignment', () => {
      const from: Node = { id: '1', row: 0, col: 0, state: 'idle' }
      const to: Node = { id: '2', row: 2, col: 2, state: 'idle' }
      expect(isGridAligned(from, to)).toBe(false)
    })
  })

  describe('validateConnection', () => {
    it('should validate a valid horizontal connection', () => {
      const state = createInitialGameState(testLevel)
      const result = validateConnection(state.nodes, state.connections, 'node1', 'node2')
      expect(result.valid).toBe(true)
    })

    it('should reject connection to same node', () => {
      const state = createInitialGameState(testLevel)
      const result = validateConnection(state.nodes, state.connections, 'node1', 'node1')
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('itself')
    })

    it('should reject non-grid-aligned connection', () => {
      const state = createInitialGameState(testLevel)
      const result = validateConnection(state.nodes, state.connections, 'node1', 'node3')
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('grid-aligned')
    })

    it('should reject duplicate connection', () => {
      const state = createInitialGameState(testLevel)
      const stateWithConnection = addConnection(state, 'node1', 'node2')
      const result = validateConnection(
        stateWithConnection.nodes,
        stateWithConnection.connections,
        'node1',
        'node2'
      )
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('already exists')
    })
  })

  describe('addConnection', () => {
    it('should add a valid connection', () => {
      const state = createInitialGameState(testLevel)
      const newState = addConnection(state, 'node1', 'node2')
      expect(newState.connections).toHaveLength(1)
      expect(newState.moves).toBe(1)
      expect(newState.segments).toBe(2) // 0,0 to 0,2 = 2 segments
    })

    it('should not add invalid connection', () => {
      const state = createInitialGameState(testLevel)
      const newState = addConnection(state, 'node1', 'node3') // Not grid-aligned
      expect(newState.connections).toHaveLength(0)
      expect(newState.moves).toBe(0)
    })

    it('should update node states when connection is added', () => {
      const state = createInitialGameState(testLevel)
      const newState = addConnection(state, 'node1', 'node2')
      const node1 = newState.nodes.find(n => n.id === 'node1')
      const node2 = newState.nodes.find(n => n.id === 'node2')
      expect(node1?.state).toBe('connected')
      expect(node2?.state).toBe('connected')
    })
  })

  describe('checkCompletion', () => {
    it('should detect completion when all required connections are made', () => {
      const state = createInitialGameState(testLevel)
      const state1 = addConnection(state, 'node1', 'node2')
      const state2 = addConnection(state1, 'node2', 'node3')
      expect(checkCompletion(state2)).toBe(true)
    })

    it('should not detect completion when connections are missing', () => {
      const state = createInitialGameState(testLevel)
      const state1 = addConnection(state, 'node1', 'node2')
      expect(checkCompletion(state1)).toBe(false)
    })
  })

  describe('calculateScore', () => {
    it('should calculate score with time, efficiency, and difficulty', () => {
      const state = createInitialGameState(testLevel)
      const state1 = addConnection(state, 'node1', 'node2')
      const state2 = addConnection(state1, 'node2', 'node3')
      const completedState = updateGameState(state2)
      const score = calculateScore(completedState)
      expect(score.score).toBeGreaterThan(0)
      expect(score.timeBonus).toBeGreaterThan(0)
      expect(score.efficiencyBonus).toBeGreaterThanOrEqual(0)
      expect(score.difficultyMultiplier).toBe(100) // level 1 * 100
    })
  })
})

