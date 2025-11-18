/**
 * Game logic for Byte Match
 * 
 * Core game mechanics: card matching, grid setup, scoring
 */

export type CardType = 
  | 'git-icon'
  | 'node-modules'
  | 'package-json'
  | 'tsconfig-json'
  | 'coffeescript'
  | 'src-folder'
  | 'gitignore'
  | 'readme-md'

export type CardState = 'face-down' | 'face-up' | 'matched'

export interface Card {
  id: string // Unique ID for each card instance
  type: CardType
  state: CardState
  index: number // Position in grid (0-15)
}

export interface GameState {
  cards: Card[]
  flippedCards: number[] // Indices of currently flipped cards (max 2)
  moves: number
  startTime: number
  duration: number
  matches: CardType[] // Sequence of matched pairs for validation
  gameOver: boolean
  bestScore: number
  seed?: string // Optional seed for reproducible games
}

const GRID_SIZE = 4
const TOTAL_CARDS = GRID_SIZE * GRID_SIZE // 16 cards = 8 pairs

// Dev-themed card types (8 pairs)
const CARD_TYPES: CardType[] = [
  'git-icon',
  'node-modules',
  'package-json',
  'tsconfig-json',
  'coffeescript',
  'src-folder',
  'gitignore',
  'readme-md',
]

/**
 * Generate 8 dev-themed pairs (16 cards total)
 */
function generateCardPairs(): CardType[] {
  const pairs: CardType[] = []
  // Create 2 of each type
  for (const type of CARD_TYPES) {
    pairs.push(type, type)
  }
  return pairs
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[], seed?: string): T[] {
  const shuffled = [...array]
  
  // Simple seeded random if seed provided
  let seedValue = seed ? hashString(seed) : undefined
  const random = seedValue 
    ? () => {
        seedValue = (seedValue! * 9301 + 49297) % 233280
        return seedValue / 233280
      }
    : () => Math.random()
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  return shuffled
}

/**
 * Simple string hash for seed
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * Create initial game state with shuffled 4×4 grid
 */
export function createInitialGameState(bestScore: number = 0, seed?: string): GameState {
  const pairs = generateCardPairs()
  const shuffled = shuffleArray(pairs, seed)
  
  const cards: Card[] = shuffled.map((type, index) => ({
    id: `card-${index}-${type}`,
    type,
    state: 'face-down',
    index,
  }))
  
  return {
    cards,
    flippedCards: [],
    moves: 0,
    startTime: Date.now(),
    duration: 0,
    matches: [],
    gameOver: false,
    bestScore,
    seed,
  }
}

/**
 * Calculate score: max(1, 100 - moves)
 */
export function calculateScore(moves: number): number {
  return Math.max(1, 100 - moves)
}

/**
 * Check if two cards match
 */
export function doCardsMatch(card1: Card, card2: Card): boolean {
  return card1.type === card2.type && card1.id !== card2.id
}

/**
 * Flip a card (face-down → face-up)
 */
export function flipCard(state: GameState, cardIndex: number): GameState {
  // Prevent invalid operations
  if (state.gameOver) {
    return state
  }
  
  const card = state.cards[cardIndex]
  if (!card || card.state !== 'face-down') {
    return state // Can't flip already flipped or matched cards
  }
  
  // Prevent flipping more than two cards
  if (state.flippedCards.length >= 2) {
    return state
  }
  
  // Flip the card
  const newCards = state.cards.map((c, idx) =>
    idx === cardIndex ? { ...c, state: 'face-up' as CardState } : c
  )
  
  const newFlippedCards = [...state.flippedCards, cardIndex]
  
  return {
    ...state,
    cards: newCards,
    flippedCards: newFlippedCards,
  }
}

/**
 * Handle match: mark both cards as matched
 */
export function handleMatch(state: GameState, cardIndex1: number, cardIndex2: number): GameState {
  const card1 = state.cards[cardIndex1]
  const card2 = state.cards[cardIndex2]
  
  if (!doCardsMatch(card1, card2)) {
    return state
  }
  
  // Mark both cards as matched
  const newCards = state.cards.map((c, idx) =>
    idx === cardIndex1 || idx === cardIndex2
      ? { ...c, state: 'matched' as CardState }
      : c
  )
  
  // Add to matches sequence
  const newMatches = [...state.matches, card1.type]
  
  // Check if game is complete
  const allMatched = newCards.every(card => card.state === 'matched')
  const gameOver = allMatched
  const duration = gameOver ? Date.now() - state.startTime : state.duration
  
  // Calculate score if game over
  const score = gameOver ? calculateScore(state.moves) : 0
  const newBestScore = gameOver ? Math.max(state.bestScore, score) : state.bestScore
  
  // Save best score to localStorage
  if (gameOver && newBestScore > state.bestScore) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('byte-match-best-score', newBestScore.toString())
    }
  }
  
  return {
    ...state,
    cards: newCards,
    flippedCards: [],
    matches: newMatches,
    gameOver,
    duration,
    bestScore: newBestScore,
  }
}

/**
 * Handle non-match: flip both cards back after delay
 */
export function handleNonMatch(state: GameState): GameState {
  if (state.flippedCards.length !== 2) {
    return state
  }
  
  const [cardIndex1, cardIndex2] = state.flippedCards
  
  // Flip both cards back to face-down
  const newCards = state.cards.map((c, idx) =>
    idx === cardIndex1 || idx === cardIndex2
      ? { ...c, state: 'face-down' as CardState }
      : c
  )
  
  // Increment moves count
  const newMoves = state.moves + 1
  
  return {
    ...state,
    cards: newCards,
    flippedCards: [],
    moves: newMoves,
  }
}

/**
 * Check if all pairs are matched
 */
export function isGameComplete(cards: Card[]): boolean {
  return cards.every(card => card.state === 'matched')
}

/**
 * Process card flip: handle match or non-match logic
 */
export function processCardFlip(state: GameState, cardIndex: number): GameState {
  // First, flip the card
  let newState = flipCard(state, cardIndex)
  
  // If we now have 2 flipped cards, check for match
  if (newState.flippedCards.length === 2) {
    const [idx1, idx2] = newState.flippedCards
    const card1 = newState.cards[idx1]
    const card2 = newState.cards[idx2]
    
    if (doCardsMatch(card1, card2)) {
      // Match found - mark as matched (moves not incremented for matches)
      newState = handleMatch(newState, idx1, idx2)
    }
    // If no match, moves will be incremented when cards are flipped back (in handleNonMatch)
  }
  
  return newState
}

/**
 * Reset game
 */
export function resetGame(bestScore: number, seed?: string): GameState {
  return createInitialGameState(bestScore, seed)
}

/**
 * Load best score from localStorage
 */
export function loadBestScore(): number {
  if (typeof window === 'undefined') {
    return 0
  }
  
  const stored = localStorage.getItem('byte-match-best-score')
  return stored ? parseInt(stored, 10) : 0
}

/**
 * Get card display info (for UI)
 */
export function getCardDisplayInfo(type: CardType): { label: string; emoji: string } {
  const displayMap: Record<CardType, { label: string; emoji: string }> = {
    'git-icon': { label: 'Git', emoji: '🔀' },
    'node-modules': { label: 'node_modules', emoji: '📦' },
    'package-json': { label: 'package.json', emoji: '📄' },
    'tsconfig-json': { label: 'tsconfig.json', emoji: '⚙️' },
    'coffeescript': { label: 'CoffeeScript', emoji: '☕' },
    'src-folder': { label: '/src', emoji: '📁' },
    'gitignore': { label: '.gitignore', emoji: '🚫' },
    'readme-md': { label: 'README.md', emoji: '📖' },
  }
  
  return displayMap[type] || { label: '?', emoji: '❓' }
}

