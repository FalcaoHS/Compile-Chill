/**
 * Game logic for Refactor Rush
 * 
 * Core game mechanics: grid-based puzzle, block movement, completion detection, score calculation
 */

import levelsData from './levels.json'

// Game constants
export const BASE_SCORE = 500
export const MOVE_PENALTY = 4
export const TIME_PENALTY = 2 // per second

// Block position
export interface BlockPosition {
  row: number
  col: number
}

// Block data structure
export interface Block {
  id: string
  type: string
  row: number
  col: number
}

// Level structure
export interface Level {
  level: number
  gridSize: number
  initialBlocks: Block[]
  targetBlocks: Block[]
  rules: string
}

// Move history entry
export interface MoveHistoryEntry {
  from: BlockPosition
  to: BlockPosition
  blockId: string
  swappedBlockId: string | null
}

// Grid type: 2D array of block IDs or null
export type Grid = (string | null)[][]

// Game state
export interface GameState {
  level: number
  gridSize: number
  grid: Grid
  targetGrid: Grid
  moves: number
  startTime: number
  duration: number
  completed: boolean
  gameOver: boolean
  moveHistory: MoveHistoryEntry[]
  correctPlacements: number
}

/**
 * Create empty grid of specified size
 */
export function createEmptyGrid(size: number): Grid {
  return Array(size).fill(null).map(() => Array(size).fill(null))
}

/**
 * Create grid from blocks array
 */
function createGridFromBlocks(blocks: Block[], gridSize: number): Grid {
  const grid = createEmptyGrid(gridSize)
  for (const block of blocks) {
    if (isValidGridPosition(block.row, block.col, gridSize)) {
      grid[block.row][block.col] = block.id
    }
  }
  return grid
}

/**
 * Validate grid position is within bounds
 */
export function isValidGridPosition(row: number, col: number, gridSize: number): boolean {
  return row >= 0 && row < gridSize && col >= 0 && col < gridSize
}

/**
 * Create initial game state
 */
export function createInitialGameState(level?: Level): GameState {
  const defaultLevel: Level = {
    level: 1,
    gridSize: 3,
    initialBlocks: [],
    targetBlocks: [],
    rules: '',
  }

  const gameLevel = level || defaultLevel
  const gridSize = gameLevel.gridSize || 3

  const grid = level
    ? createGridFromBlocks(level.initialBlocks, gridSize)
    : createEmptyGrid(gridSize)

  const targetGrid = level
    ? createGridFromBlocks(level.targetBlocks, gridSize)
    : createEmptyGrid(gridSize)

  // Calculate initial correct placements
  let correctPlacements = 0
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col] !== null && grid[row][col] === targetGrid[row][col]) {
        correctPlacements++
      }
    }
  }

  return {
    level: gameLevel.level,
    gridSize,
    grid,
    targetGrid,
    moves: 0,
    startTime: Date.now(),
    duration: 0,
    completed: false,
    gameOver: false,
    moveHistory: [],
    correctPlacements,
  }
}

/**
 * Move block from source to destination
 */
export function moveBlock(
  state: GameState,
  from: BlockPosition,
  to: BlockPosition
): GameState {
  // Validate positions
  if (!isValidGridPosition(from.row, from.col, state.gridSize)) {
    return state
  }
  if (!isValidGridPosition(to.row, to.col, state.gridSize)) {
    return state
  }

  // Check if source has a block
  const blockId = state.grid[from.row][from.col]
  if (blockId === null) {
    return state // No block to move
  }

  // Don't move if source and destination are the same
  if (from.row === to.row && from.col === to.col) {
    return state
  }

  // Create new grid
  const newGrid = state.grid.map(row => [...row])
  
  // Get swapped block ID (if any)
  const swappedBlockId = newGrid[to.row][to.col]

  // Move block
  newGrid[to.row][to.col] = blockId
  newGrid[from.row][from.col] = swappedBlockId

  // Calculate new correct placements
  let newCorrectPlacements = 0
  for (let row = 0; row < state.gridSize; row++) {
    for (let col = 0; col < state.gridSize; col++) {
      if (newGrid[row][col] !== null && newGrid[row][col] === state.targetGrid[row][col]) {
        newCorrectPlacements++
      }
    }
  }

  // Add to move history
  const moveHistoryEntry: MoveHistoryEntry = {
    from,
    to,
    blockId,
    swappedBlockId,
  }

  return {
    ...state,
    grid: newGrid,
    moves: state.moves + 1,
    moveHistory: [...state.moveHistory, moveHistoryEntry],
    correctPlacements: newCorrectPlacements,
  }
}

/**
 * Check if puzzle is completed
 */
export function checkCompletion(state: GameState): boolean {
  for (let row = 0; row < state.gridSize; row++) {
    for (let col = 0; col < state.gridSize; col++) {
      if (state.grid[row][col] !== state.targetGrid[row][col]) {
        return false
      }
    }
  }
  return true
}

/**
 * Undo last move
 */
export function undoLastMove(state: GameState): GameState {
  if (state.moveHistory.length === 0) {
    return state // No moves to undo
  }

  const lastMove = state.moveHistory[state.moveHistory.length - 1]
  const newMoveHistory = state.moveHistory.slice(0, -1)

  // Create new grid
  const newGrid = state.grid.map(row => [...row])

  // Restore previous positions
  newGrid[lastMove.from.row][lastMove.from.col] = lastMove.blockId
  newGrid[lastMove.to.row][lastMove.to.col] = lastMove.swappedBlockId

  // Recalculate correct placements
  let newCorrectPlacements = 0
  for (let row = 0; row < state.gridSize; row++) {
    for (let col = 0; col < state.gridSize; col++) {
      if (newGrid[row][col] !== null && newGrid[row][col] === state.targetGrid[row][col]) {
        newCorrectPlacements++
      }
    }
  }

  return {
    ...state,
    grid: newGrid,
    moves: Math.max(0, state.moves - 1),
    moveHistory: newMoveHistory,
    correctPlacements: newCorrectPlacements,
  }
}

/**
 * Update game state (duration, completion status)
 */
export function updateGameState(state: GameState): GameState {
  const currentTime = Date.now()
  const duration = currentTime - state.startTime

  // Check completion
  const completed = checkCompletion(state)
  const gameOver = completed

  return {
    ...state,
    duration,
    completed,
    gameOver,
  }
}

/**
 * Calculate score based on moves, time, and difficulty
 */
export function calculateScore(state: GameState): {
  score: number
  moves: number
  duration: number
  gridSize: number
  correctPlacements: number
  levelId: number
} {
  const durationInSeconds = Math.floor(state.duration / 1000)
  
  // Formula: score = max(1, 500 - moves*4 - duration*2)
  const score = Math.max(1, BASE_SCORE - state.moves * MOVE_PENALTY - durationInSeconds * TIME_PENALTY)

  return {
    score,
    moves: state.moves,
    duration: state.duration,
    gridSize: state.gridSize,
    correctPlacements: state.correctPlacements,
    levelId: state.level,
  }
}

/**
 * Get score data for API submission
 */
export function getScoreData(state: GameState) {
  return calculateScore(state)
}

/**
 * Load best score from localStorage
 */
export function loadBestScore(level: number): number {
  if (typeof window === 'undefined') return 0
  const key = `refactor-rush-best-score-level-${level}`
  const stored = localStorage.getItem(key)
  return stored ? parseInt(stored, 10) : 0
}

/**
 * Save best score to localStorage
 */
export function saveBestScore(level: number, score: number): void {
  if (typeof window === 'undefined') return
  const key = `refactor-rush-best-score-level-${level}`
  const currentBest = loadBestScore(level)
  if (score > currentBest) {
    localStorage.setItem(key, score.toString())
  }
}

/**
 * Reset game to initial state
 */
export function resetGame(level?: Level): GameState {
  return createInitialGameState(level)
}

/**
 * Load level by level number
 */
export function loadLevelByNumber(levelNumber: number): Level | null {
  const level = levelsData.find(l => l.level === levelNumber)
  if (!level) return null

  // Validate level structure
  if (!validateLevel(level)) {
    console.error(`Invalid level structure for level ${levelNumber}`)
    return null
  }

  return level as Level
}

/**
 * Load default level (level 1)
 */
export function loadDefaultLevel(): Level | null {
  return loadLevelByNumber(1)
}

/**
 * Get total number of levels
 */
export function getTotalLevels(): number {
  return levelsData.length
}

/**
 * Check if level exists
 */
export function levelExists(levelNumber: number): boolean {
  return levelsData.some(l => l.level === levelNumber)
}

/**
 * Get next level number
 */
export function getNextLevel(currentLevel: number): number | null {
  const nextLevel = currentLevel + 1
  return levelExists(nextLevel) ? nextLevel : null
}

/**
 * Validate level structure
 */
function validateLevel(level: any): boolean {
  if (!level || typeof level !== 'object') return false
  if (typeof level.level !== 'number' || level.level < 1) return false
  if (typeof level.gridSize !== 'number' || ![3, 4, 5].includes(level.gridSize)) return false
  if (!Array.isArray(level.initialBlocks)) return false
  if (!Array.isArray(level.targetBlocks)) return false
  if (typeof level.rules !== 'string') return false

  // Validate grid size matches positions
  for (const block of level.initialBlocks) {
    if (!isValidGridPosition(block.row, block.col, level.gridSize)) {
      return false
    }
  }

  for (const block of level.targetBlocks) {
    if (!isValidGridPosition(block.row, block.col, level.gridSize)) {
      return false
    }
  }

  // Validate target blocks match initial blocks (same IDs and types)
  if (level.initialBlocks.length !== level.targetBlocks.length) {
    return false
  }

  const initialIds = new Set(level.initialBlocks.map((b: Block) => b.id))
  const targetIds = new Set(level.targetBlocks.map((b: Block) => b.id))

  if (initialIds.size !== targetIds.size) {
    return false
  }

  for (const id of initialIds) {
    if (!targetIds.has(id)) {
      return false
    }
  }

  return true
}

