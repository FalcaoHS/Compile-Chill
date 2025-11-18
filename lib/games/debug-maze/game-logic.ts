/**
 * Game logic for Debug Maze
 * 
 * Core game mechanics: grid-based movement, collision detection, score calculation
 */

import mazesData from './mazes.json'

// Game constants
export const ANIMATION_DURATION = 200 // milliseconds for cell-to-cell hop
export const MAX_TIME_FOR_SCORE = 300000 // 5 minutes max for time-based score
export const MOVE_BONUS_MULTIPLIER = 10 // Bonus points per move saved

// Movement directions
export type Direction = 'up' | 'down' | 'left' | 'right'

// Grid position
export interface GridPosition {
  row: number
  col: number
}

// Maze structure
export interface Maze {
  level: number
  width: number
  height: number
  walls: number[][] // 2D array: 1 = wall, 0 = empty
  start: GridPosition
  patch: GridPosition
}

// Game state
export interface GameState {
  maze: Maze | null
  bugPosition: GridPosition
  patchPosition: GridPosition
  moves: number
  startTime: number
  duration: number
  level: number
  gameOver: boolean
  gameCompleted: boolean
  isAnimating: boolean
  animationStartTime: number
  animationFrom: GridPosition | null
  animationTo: GridPosition | null
  pathTaken: GridPosition[] // Optional: track path for pathLength
}

/**
 * Create initial game state
 */
export function createInitialGameState(maze: Maze | null = null): GameState {
  if (!maze) {
    return {
      maze: null,
      bugPosition: { row: 0, col: 0 },
      patchPosition: { row: 0, col: 0 },
      moves: 0,
      startTime: Date.now(),
      duration: 0,
      level: 1,
      gameOver: false,
      gameCompleted: false,
      isAnimating: false,
      animationStartTime: 0,
      animationFrom: null,
      animationTo: null,
      pathTaken: [],
    }
  }

  return {
    maze,
    bugPosition: { ...maze.start },
    patchPosition: { ...maze.patch },
    moves: 0,
    startTime: Date.now(),
    duration: 0,
    level: maze.level,
    gameOver: false,
    gameCompleted: false,
    isAnimating: false,
    animationStartTime: 0,
    animationFrom: null,
    animationTo: null,
    pathTaken: [maze.start],
  }
}

/**
 * Check if a cell is a wall
 */
export function isWall(maze: Maze, row: number, col: number): boolean {
  if (row < 0 || row >= maze.height || col < 0 || col >= maze.width) {
    return true // Out of bounds = wall
  }
  return maze.walls[row]?.[col] === 1
}

/**
 * Check if a move is valid (not a wall, within bounds)
 */
export function isValidMove(maze: Maze, row: number, col: number): boolean {
  return !isWall(maze, row, col)
}

/**
 * Calculate new position after movement
 */
export function calculateNewPosition(
  current: GridPosition,
  direction: Direction
): GridPosition {
  switch (direction) {
    case 'up':
      return { row: current.row - 1, col: current.col }
    case 'down':
      return { row: current.row + 1, col: current.col }
    case 'left':
      return { row: current.row, col: current.col - 1 }
    case 'right':
      return { row: current.row, col: current.col + 1 }
  }
}

/**
 * Move bug in a direction
 */
export function moveBug(state: GameState, direction: Direction): GameState {
  if (!state.maze || state.gameOver || state.gameCompleted || state.isAnimating) {
    return state
  }

  const newPosition = calculateNewPosition(state.bugPosition, direction)

  // Check if move is valid
  if (!isValidMove(state.maze, newPosition.row, newPosition.col)) {
    return state // Invalid move, don't update state
  }

  // Start animation
  const now = Date.now()
  return {
    ...state,
    bugPosition: newPosition,
    moves: state.moves + 1,
    isAnimating: true,
    animationStartTime: now,
    animationFrom: state.bugPosition,
    animationTo: newPosition,
    pathTaken: [...state.pathTaken, newPosition],
  }
}

/**
 * Update animation state
 */
export function updateAnimation(state: GameState): GameState {
  if (!state.isAnimating) {
    return state
  }

  const now = Date.now()
  const elapsed = now - state.animationStartTime

  if (elapsed >= ANIMATION_DURATION) {
    // Animation complete
    return {
      ...state,
      isAnimating: false,
      animationFrom: null,
      animationTo: null,
    }
  }

  return state
}

/**
 * Check if bug reached patch
 */
export function checkPatchReach(state: GameState): GameState {
  if (!state.maze || state.gameCompleted) {
    return state
  }

  const reached =
    state.bugPosition.row === state.patchPosition.row &&
    state.bugPosition.col === state.patchPosition.col

  if (reached) {
    const now = Date.now()
    return {
      ...state,
      gameCompleted: true,
      gameOver: true,
      duration: now - state.startTime,
    }
  }

  return state
}

/**
 * Update game state (call each frame)
 */
export function updateGameState(state: GameState): GameState {
  if (!state.maze || state.gameOver) {
    return state
  }

  // Update animation
  let updatedState = updateAnimation(state)

  // Update duration
  if (!updatedState.gameCompleted) {
    updatedState = {
      ...updatedState,
      duration: Date.now() - updatedState.startTime,
    }
  }

  // Check if patch reached
  updatedState = checkPatchReach(updatedState)

  return updatedState
}

/**
 * Calculate score based on time and moves
 */
export function calculateScore(state: GameState): number {
  if (!state.maze || !state.gameCompleted) {
    return 0
  }

  // Time-based score: max(1, (tempoMax - tempoUsado))
  const timeScore = Math.max(
    1,
    MAX_TIME_FOR_SCORE - state.duration
  )

  // Move bonus: fewer moves = higher bonus
  // Estimate optimal moves (simple heuristic: Manhattan distance * 1.5)
  const optimalMoves =
    Math.abs(state.maze.start.row - state.maze.patch.row) +
    Math.abs(state.maze.start.col - state.maze.patch.col)
  const moveBonus = Math.max(
    0,
    (optimalMoves * 1.5 - state.moves) * MOVE_BONUS_MULTIPLIER
  )

  return Math.floor(timeScore + moveBonus)
}

/**
 * Get score data for API submission
 */
export function getScoreData(state: GameState): {
  score: number
  duration: number
  moves: number
  pathLength: number
  level: number
} {
  return {
    score: calculateScore(state),
    duration: state.duration,
    moves: state.moves,
    pathLength: state.pathTaken.length,
    level: state.level,
  }
}

/**
 * Reset game to initial state (restart level)
 */
export function resetGame(state: GameState, maze: Maze): GameState {
  return createInitialGameState(maze)
}

/**
 * Load maze by level number
 */
export function loadMazeByLevel(level: number): Maze | null {
  const mazes = mazesData as Maze[]
  const maze = mazes.find(m => m.level === level)
  return maze || null
}

/**
 * Load default maze (level 1)
 */
export function loadDefaultMaze(): Maze | null {
  return loadMazeByLevel(1)
}

/**
 * Get total number of available mazes
 */
export function getTotalMazes(): number {
  return (mazesData as Maze[]).length
}

/**
 * Check if level exists
 */
export function levelExists(level: number): boolean {
  return loadMazeByLevel(level) !== null
}

/**
 * Validate maze structure
 */
export function validateMaze(maze: Maze): boolean {
  // Check dimensions
  if (maze.width <= 0 || maze.height <= 0) {
    return false
  }

  // Check walls array matches dimensions
  if (maze.walls.length !== maze.height) {
    return false
  }

  for (let row = 0; row < maze.height; row++) {
    if (maze.walls[row].length !== maze.width) {
      return false
    }
  }

  // Check start position
  if (
    maze.start.row < 0 ||
    maze.start.row >= maze.height ||
    maze.start.col < 0 ||
    maze.start.col >= maze.width
  ) {
    return false
  }

  // Check patch position
  if (
    maze.patch.row < 0 ||
    maze.patch.row >= maze.height ||
    maze.patch.col < 0 ||
    maze.patch.col >= maze.width
  ) {
    return false
  }

  // Check start and patch are not walls
  if (isWall(maze, maze.start.row, maze.start.col)) {
    return false
  }

  if (isWall(maze, maze.patch.row, maze.patch.col)) {
    return false
  }

  return true
}

