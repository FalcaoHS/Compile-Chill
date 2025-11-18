/**
 * Dev Fifteen HEX Game Logic
 * 
 * 15-puzzle with hexadecimal memory addresses (0x01 to 0x0F)
 */

export type HexValue = '0x01' | '0x02' | '0x03' | '0x04' | '0x05' | '0x06' | '0x07' | '0x08' | '0x09' | '0x0A' | '0x0B' | '0x0C' | '0x0D' | '0x0E' | '0x0F' | null

export type Direction = 'up' | 'down' | 'left' | 'right'

export interface Position {
  row: number
  col: number
}

export interface GameState {
  board: (HexValue | null)[][]
  emptyPosition: Position
  moves: number
  startTime: number
  endTime: number | null
  moveHistory: Direction[]
  moveTimestamps: number[]
  isWon: boolean
  isAnimating: boolean
}

export const HEX_VALUES: HexValue[] = [
  '0x01', '0x02', '0x03', '0x04',
  '0x05', '0x06', '0x07', '0x08',
  '0x09', '0x0A', '0x0B', '0x0C',
  '0x0D', '0x0E', '0x0F'
]

const BOARD_SIZE = 4
const SOLVED_BOARD: (HexValue | null)[][] = [
  ['0x01', '0x02', '0x03', '0x04'],
  ['0x05', '0x06', '0x07', '0x08'],
  ['0x09', '0x0A', '0x0B', '0x0C'],
  ['0x0D', '0x0E', '0x0F', null],
]

/**
 * Check if puzzle is solvable
 * Uses inversion count algorithm
 */
function isSolvable(board: (HexValue | null)[][]): boolean {
  const flat = board.flat().filter((v): v is Exclude<HexValue, null> => v !== null)
  const emptyRow = board.findIndex(row => row.includes(null))
  
  let inversions = 0
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      const valI = parseInt(flat[i].replace('0x', ''), 16)
      const valJ = parseInt(flat[j].replace('0x', ''), 16)
      if (valI > valJ) inversions++
    }
  }
  
  // For 4x4: solvable if (inversions + emptyRow) is even
  return (inversions + emptyRow) % 2 === 0
}

/**
 * Shuffle board ensuring it's solvable
 */
function shuffleBoard(): (HexValue | null)[][] {
  let board: (HexValue | null)[][]
  let attempts = 0
  
  do {
    // Create flat array and shuffle
    const flat = [...HEX_VALUES, null]
    for (let i = flat.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[flat[i], flat[j]] = [flat[j], flat[i]]
    }
    
    // Convert back to 2D
    board = []
    for (let i = 0; i < BOARD_SIZE; i++) {
      board.push(flat.slice(i * BOARD_SIZE, (i + 1) * BOARD_SIZE))
    }
    
    attempts++
    if (attempts > 100) {
      // Fallback: use solved board and make random valid moves
      board = JSON.parse(JSON.stringify(SOLVED_BOARD))
      const emptyPos = { row: 3, col: 3 }
      for (let i = 0; i < 100; i++) {
        const directions: Direction[] = []
        if (emptyPos.row > 0) directions.push('up')
        if (emptyPos.row < 3) directions.push('down')
        if (emptyPos.col > 0) directions.push('left')
        if (emptyPos.col < 3) directions.push('right')
        const dir = directions[Math.floor(Math.random() * directions.length)]
        const newPos = getNewPosition(emptyPos, dir)
        if (newPos) {
          board[emptyPos.row][emptyPos.col] = board[newPos.row][newPos.col]
          board[newPos.row][newPos.col] = null
          emptyPos.row = newPos.row
          emptyPos.col = newPos.col
        }
      }
      break
    }
  } while (!isSolvable(board))
  
  return board
}

/**
 * Find empty position in board
 */
function findEmptyPosition(board: (HexValue | null)[][]): Position {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === null) {
        return { row, col }
      }
    }
  }
  return { row: 3, col: 3 } // Fallback
}

/**
 * Get new position after moving in direction
 */
function getNewPosition(pos: Position, direction: Direction): Position | null {
  const newPos = { ...pos }
  
  switch (direction) {
    case 'up':
      newPos.row--
      break
    case 'down':
      newPos.row++
      break
    case 'left':
      newPos.col--
      break
    case 'right':
      newPos.col++
      break
  }
  
  if (newPos.row < 0 || newPos.row >= BOARD_SIZE || newPos.col < 0 || newPos.col >= BOARD_SIZE) {
    return null
  }
  
  return newPos
}

/**
 * Check if position is adjacent to empty position
 */
function isAdjacent(pos: Position, emptyPos: Position): boolean {
  const rowDiff = Math.abs(pos.row - emptyPos.row)
  const colDiff = Math.abs(pos.col - emptyPos.col)
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
}

/**
 * Create initial game state
 */
export function createInitialGameState(): GameState {
  const board = shuffleBoard()
  const emptyPosition = findEmptyPosition(board)
  
  return {
    board,
    emptyPosition,
    moves: 0,
    startTime: Date.now(),
    endTime: null,
    moveHistory: [],
    moveTimestamps: [],
    isWon: false,
    isAnimating: false,
  }
}

/**
 * Check if puzzle is solved
 */
export function checkWin(board: (HexValue | null)[][]): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] !== SOLVED_BOARD[row][col]) {
        return false
      }
    }
  }
  return true
}

/**
 * Execute a move
 */
export function executeMove(
  state: GameState,
  direction: Direction
): GameState | null {
  if (state.isWon || state.isAnimating) {
    return null
  }
  
  const newEmptyPos = getNewPosition(state.emptyPosition, direction)
  if (!newEmptyPos) {
    return null
  }
  
  // Create new board
  const newBoard = state.board.map(row => [...row])
  
  // Swap empty with adjacent tile
  const tileValue = newBoard[newEmptyPos.row][newEmptyPos.col]
  newBoard[newEmptyPos.row][newEmptyPos.col] = null
  newBoard[state.emptyPosition.row][state.emptyPosition.col] = tileValue
  
  // Check if won
  const won = checkWin(newBoard)
  
  return {
    board: newBoard,
    emptyPosition: newEmptyPos,
    moves: state.moves + 1,
    startTime: state.startTime,
    endTime: won ? Date.now() : null,
    moveHistory: [...state.moveHistory, direction],
    moveTimestamps: [...state.moveTimestamps, Date.now()],
    isWon: won,
    isAnimating: true,
  }
}

/**
 * Move tile at position (click handler)
 */
export function moveTile(
  state: GameState,
  position: Position
): GameState | null {
  if (state.isWon || state.isAnimating) {
    return null
  }
  
  if (!isAdjacent(position, state.emptyPosition)) {
    return null
  }
  
  // Determine direction
  let direction: Direction | null = null
  if (position.row < state.emptyPosition.row) direction = 'up'
  else if (position.row > state.emptyPosition.row) direction = 'down'
  else if (position.col < state.emptyPosition.col) direction = 'left'
  else if (position.col > state.emptyPosition.col) direction = 'right'
  
  if (!direction) return null
  
  return executeMove(state, direction)
}

/**
 * Calculate score
 */
export function calculateScore(moves: number, duration: number): number {
  // score = 5000 - (moves * 7 + seconds * 3)
  const seconds = Math.floor(duration / 1000)
  return Math.max(0, 5000 - (moves * 7 + seconds * 3))
}

/**
 * Check if easter egg conditions are met
 */
export function checkEasterEgg(moves: number, duration: number): boolean {
  return moves < 60 && duration < 120000 // Less than 60 moves and 2 minutes
}

/**
 * Reset game
 */
export function resetGame(): GameState {
  return createInitialGameState()
}

