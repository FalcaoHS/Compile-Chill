/**
 * Game logic for Terminal 2048
 * 
 * Core game mechanics: board operations, moves, merging
 */

export type Board = (number | null)[][]
export type Direction = 'up' | 'down' | 'left' | 'right'

export interface GameState {
  board: Board
  score: number
  bestScore: number
  gameOver: boolean
  moveCount: number
  startTime: number
  moveHistory: Direction[]
}

const BOARD_SIZE = 4

/**
 * Create empty board
 */
export function createEmptyBoard(): Board {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
}

/**
 * Initialize new game state
 */
export function createInitialGameState(bestScore: number = 0): GameState {
  const board = createEmptyBoard()
  addRandomTile(board)
  addRandomTile(board)
  
  return {
    board,
    score: 0,
    bestScore,
    gameOver: false,
    moveCount: 0,
    startTime: Date.now(),
    moveHistory: [],
  }
}

/**
 * Add random tile (2 or 4) to empty cell
 */
export function addRandomTile(board: Board): boolean {
  const emptyCells: [number, number][] = []
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === null) {
        emptyCells.push([row, col])
      }
    }
  }
  
  if (emptyCells.length === 0) {
    return false
  }
  
  const randomIndex = Math.floor(Math.random() * emptyCells.length)
  const [row, col] = emptyCells[randomIndex]
  const value = Math.random() < 0.9 ? 2 : 4 // 90% chance of 2, 10% chance of 4
  
  board[row][col] = value
  return true
}

/**
 * Rotate board 90 degrees clockwise
 */
function rotateBoard(board: Board): Board {
  const rotated: Board = createEmptyBoard()
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      rotated[col][BOARD_SIZE - 1 - row] = board[row][col]
    }
  }
  return rotated
}

/**
 * Move tiles left (merge and slide)
 */
function moveLeft(board: Board): { board: Board; scoreIncrease: number } {
  const newBoard: Board = createEmptyBoard()
  let scoreIncrease = 0
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    const line = board[row].filter(cell => cell !== null) as number[]
    const merged: number[] = []
    let i = 0
    
    while (i < line.length) {
      if (i < line.length - 1 && line[i] === line[i + 1]) {
        // Merge tiles
        const mergedValue = line[i] * 2
        merged.push(mergedValue)
        scoreIncrease += mergedValue
        i += 2
      } else {
        merged.push(line[i])
        i += 1
      }
    }
    
    // Fill new board row
    for (let col = 0; col < merged.length && col < BOARD_SIZE; col++) {
      newBoard[row][col] = merged[col]
    }
  }
  
  return { board: newBoard, scoreIncrease }
}

/**
 * Move board in given direction
 */
export function moveBoard(board: Board, direction: Direction): { board: Board; scoreIncrease: number; moved: boolean } {
  let workingBoard = board.map(row => [...row])
  let rotations = 0
  
  // Rotate board to make all moves equivalent to moving left
  switch (direction) {
    case 'right':
      rotations = 2
      break
    case 'up':
      rotations = 3
      break
    case 'down':
      rotations = 1
      break
    case 'left':
      rotations = 0
      break
  }
  
  // Rotate to left orientation
  for (let i = 0; i < rotations; i++) {
    workingBoard = rotateBoard(workingBoard)
  }
  
  // Check if move is possible (board will change)
  const boardBefore = JSON.stringify(workingBoard)
  const { board: movedBoard, scoreIncrease } = moveLeft(workingBoard)
  const boardAfter = JSON.stringify(movedBoard)
  const moved = boardBefore !== boardAfter
  
  // Rotate back
  let resultBoard = movedBoard
  for (let i = 0; i < (4 - rotations) % 4; i++) {
    resultBoard = rotateBoard(resultBoard)
  }
  
  return {
    board: resultBoard,
    scoreIncrease,
    moved,
  }
}

/**
 * Check if board is full
 */
export function isBoardFull(board: Board): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === null) {
        return false
      }
    }
  }
  return true
}

/**
 * Check if any moves are possible
 */
export function canMove(board: Board): boolean {
  // Check for empty cells
  if (!isBoardFull(board)) {
    return true
  }
  
  // Check for possible merges
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const current = board[row][col]
      
      // Check right neighbor
      if (col < BOARD_SIZE - 1 && board[row][col + 1] === current) {
        return true
      }
      
      // Check bottom neighbor
      if (row < BOARD_SIZE - 1 && board[row + 1][col] === current) {
        return true
      }
    }
  }
  
  return false
}

/**
 * Check if game is over
 */
export function isGameOver(board: Board): boolean {
  return isBoardFull(board) && !canMove(board)
}

/**
 * Execute a move and update game state
 */
export function executeMove(state: GameState, direction: Direction): GameState {
  if (state.gameOver) {
    return state
  }
  
  const { board, scoreIncrease, moved } = moveBoard(state.board, direction)
  
  if (!moved) {
    return state // No change, return same state
  }
  
  // Add new tile
  const newBoard = board.map(row => [...row])
  addRandomTile(newBoard)
  
  // Update score
  const newScore = state.score + scoreIncrease
  const newBestScore = Math.max(state.bestScore, newScore)
  
  // Save best score to localStorage
  if (newBestScore > state.bestScore) {
    localStorage.setItem('terminal-2048-best-score', newBestScore.toString())
  }
  
  // Check game over
  const gameOver = isGameOver(newBoard)
  
  return {
    board: newBoard,
    score: newScore,
    bestScore: newBestScore,
    gameOver,
    moveCount: state.moveCount + 1,
    startTime: state.startTime,
    moveHistory: [...state.moveHistory, direction],
  }
}

/**
 * Reset game
 */
export function resetGame(bestScore: number): GameState {
  return createInitialGameState(bestScore)
}

/**
 * Load best score from localStorage
 */
export function loadBestScore(): number {
  if (typeof window === 'undefined') {
    return 0
  }
  
  const stored = localStorage.getItem('terminal-2048-best-score')
  return stored ? parseInt(stored, 10) : 0
}

