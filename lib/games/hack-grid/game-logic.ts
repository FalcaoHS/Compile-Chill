/**
 * Game logic for Hack Grid
 * 
 * Core game mechanics: node connections, grid-aligned paths, puzzle completion, score calculation
 */

import levelsData from './levels.json'

// Game constants
export const GRID_SIZE = 6 // 6×6 grid
export const MAX_TIME_FOR_SCORE = 300000 // 5 minutes max for time-based score
export const EFFICIENCY_BONUS_MULTIPLIER = 50 // Bonus multiplier for efficiency
export const DIFFICULTY_BASE_MULTIPLIER = 100 // Base multiplier for difficulty

// Node states
export type NodeState = 'idle' | 'active' | 'connected' | 'completed'

// Node structure
export interface Node {
  id: string
  row: number
  col: number
  type?: string
  state: NodeState
}

// Connection structure
export interface Connection {
  from: string // nodeId
  to: string // nodeId
  segments: number // number of grid segments in this connection
}

// Level structure (will be loaded from JSON)
export interface Level {
  level: number
  nodes: Array<{ id: string; row: number; col: number; type?: string }>
  requiredConnections: Array<{ from: string; to: string }>
  difficulty: number
}

// Game state
export interface GameState {
  currentLevel: number
  level: Level | null
  nodes: Node[]
  connections: Connection[]
  startTime: number
  duration: number
  moves: number
  segments: number
  completed: boolean
  gameOver: boolean
  selectedNodeId: string | null // For tap-to-tap selection
}

/**
 * Create initial game state
 */
export function createInitialGameState(level: Level | null = null): GameState {
  if (!level) {
    return {
      currentLevel: 1,
      level: null,
      nodes: [],
      connections: [],
      startTime: Date.now(),
      duration: 0,
      moves: 0,
      segments: 0,
      completed: false,
      gameOver: false,
      selectedNodeId: null,
    }
  }

  // Initialize nodes from level data
  const nodes: Node[] = level.nodes.map(node => ({
    id: node.id,
    row: node.row,
    col: node.col,
    type: node.type,
    state: 'idle',
  }))

  return {
    currentLevel: level.level,
    level,
    nodes,
    connections: [],
    startTime: Date.now(),
    duration: 0,
    moves: 0,
    segments: 0,
    completed: false,
    gameOver: false,
    selectedNodeId: null,
  }
}

/**
 * Validate node position is within grid bounds
 */
export function isValidNodePosition(row: number, col: number): boolean {
  return row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE
}

/**
 * Get the L-shaped path between two nodes (horizontal first, then vertical)
 * Returns array of {row, col} positions that the path passes through
 */
export function getPath(from: Node, to: Node): Array<{ row: number; col: number }> {
  const path: Array<{ row: number; col: number }> = []
  
  // Start from source node
  path.push({ row: from.row, col: from.col })
  
  // Move horizontally first (to align column)
  if (from.col !== to.col) {
    const colStep = to.col > from.col ? 1 : -1
    const endCol = to.col
    for (let col = from.col + colStep; col !== endCol; col += colStep) {
      // Safety check to prevent infinite loops
      if (path.length > GRID_SIZE * GRID_SIZE) {
        console.error('Infinite loop detected in getPath', { from, to })
        break
      }
      path.push({ row: from.row, col })
    }
  }
  
  // Then move vertically (to align row)
  if (from.row !== to.row) {
    const rowStep = to.row > from.row ? 1 : -1
    const endRow = to.row
    for (let row = from.row + rowStep; row !== endRow; row += rowStep) {
      // Safety check to prevent infinite loops
      if (path.length > GRID_SIZE * GRID_SIZE) {
        console.error('Infinite loop detected in getPath', { from, to })
        break
      }
      path.push({ row, col: to.col })
    }
  }
  
  // End at target node (only if different from start)
  if (from.row !== to.row || from.col !== to.col) {
    path.push({ row: to.row, col: to.col })
  }
  
  return path
}

/**
 * Calculate number of segments between two nodes (grid-aligned path)
 */
export function calculateSegments(from: Node, to: Node): number {
  const rowDiff = Math.abs(to.row - from.row)
  const colDiff = Math.abs(to.col - from.col)
  
  // For grid-aligned paths, segments = row difference + column difference
  return rowDiff + colDiff
}

/**
 * Check if connection is grid-aligned (can be connected via L-shaped path)
 * Any two nodes can be connected as long as they follow grid lines
 * (horizontal first, then vertical, or vice versa)
 */
export function isGridAligned(from: Node, to: Node): boolean {
  // Any two nodes can be connected via grid-aligned path (L-shaped)
  // This is always true as long as both nodes are within grid bounds
  // The actual path will be drawn as L-shaped in the canvas
  return isValidNodePosition(from.row, from.col) && isValidNodePosition(to.row, to.col)
}

/**
 * Check if connection already exists
 */
export function connectionExists(
  connections: Connection[],
  fromId: string,
  toId: string
): boolean {
  return connections.some(
    conn =>
      (conn.from === fromId && conn.to === toId) ||
      (conn.from === toId && conn.to === fromId) // Bidirectional check
  )
}

/**
 * Check if path collides with other nodes (excluding start and end)
 */
function pathCollidesWithNodes(
  path: Array<{ row: number; col: number }>,
  nodes: Node[],
  fromId: string,
  toId: string
): boolean {
  // Check each position in the path (excluding start and end)
  for (let i = 1; i < path.length - 1; i++) {
    const pos = path[i]
    // Check if any node (other than start/end) is at this position
    if (nodes.some(node => 
      node.id !== fromId && 
      node.id !== toId && 
      node.row === pos.row && 
      node.col === pos.col
    )) {
      return true
    }
  }
  return false
}

/**
 * Check if path collides with existing connections
 */
function pathCollidesWithConnections(
  path: Array<{ row: number; col: number }>,
  connections: Connection[],
  nodes: Node[],
  fromId: string,
  toId: string
): boolean {
  // Get all positions occupied by existing connections
  const occupiedPositions = new Set<string>()
  
  for (const conn of connections) {
    const fromNode = nodes.find(n => n.id === conn.from)
    const toNode = nodes.find(n => n.id === conn.to)
    if (!fromNode || !toNode) continue
    
    const connPath = getPath(fromNode, toNode)
    // Mark all positions in this connection (excluding endpoints)
    for (let i = 1; i < connPath.length - 1; i++) {
      const pos = connPath[i]
      occupiedPositions.add(`${pos.row},${pos.col}`)
    }
  }
  
  // Check if our path uses any occupied position (excluding endpoints)
  for (let i = 1; i < path.length - 1; i++) {
    const pos = path[i]
    if (occupiedPositions.has(`${pos.row},${pos.col}`)) {
      return true
    }
  }
  
  return false
}

/**
 * Validate connection between two nodes
 */
export function validateConnection(
  nodes: Node[],
  connections: Connection[],
  fromId: string,
  toId: string
): { valid: boolean; reason?: string } {
  // Find nodes
  const fromNode = nodes.find(n => n.id === fromId)
  const toNode = nodes.find(n => n.id === toId)

  if (!fromNode || !toNode) {
    return { valid: false, reason: 'One or both nodes not found' }
  }

  // Check if nodes are the same
  if (fromId === toId) {
    return { valid: false, reason: 'Cannot connect node to itself' }
  }

  // Check if connection is grid-aligned
  if (!isGridAligned(fromNode, toNode)) {
    return { valid: false, reason: 'Connection must be grid-aligned (horizontal or vertical)' }
  }

  // Check if connection already exists
  if (connectionExists(connections, fromId, toId)) {
    return { valid: false, reason: 'Connection already exists' }
  }

  // Check if nodes are in valid positions
  if (!isValidNodePosition(fromNode.row, fromNode.col) || !isValidNodePosition(toNode.row, toNode.col)) {
    return { valid: false, reason: 'Node positions are out of bounds' }
  }

  // Allow all connections - no blocking
  // The game is about connecting required pairs, not preventing connections
  return { valid: true }
}

/**
 * Add connection between two nodes
 */
export function addConnection(
  state: GameState,
  fromId: string,
  toId: string
): GameState {
  // Validate connection
  const validation = validateConnection(state.nodes, state.connections, fromId, toId)
  if (!validation.valid) {
    return state // Return unchanged state if invalid
  }

  // Find nodes
  const fromNode = state.nodes.find(n => n.id === fromId)!
  const toNode = state.nodes.find(n => n.id === toId)!

  // Calculate segments
  const segments = calculateSegments(fromNode, toNode)

  // Create new connection
  const newConnection: Connection = {
    from: fromId,
    to: toId,
    segments,
  }

  // Add connection first to check completion status
  const updatedConnections = [...state.connections, newConnection]

  // Update nodes state and check if required pairs are completed
  const requiredPairs = getRequiredPairs(state.level)
  const updatedNodes = state.nodes.map(node => {
    if (node.id === fromId || node.id === toId) {
      // Check if this connection completes a required pair
      const isRequired = state.level?.requiredConnections.some(
        reqConn =>
          (reqConn.from === fromId && reqConn.to === toId) ||
          (reqConn.from === toId && reqConn.to === fromId)
      )
      
      if (isRequired) {
        // Check if all required pairs for this node are now completed
        const requiredForNode = requiredPairs.get(node.id) || []
        const allPairsCompleted = requiredForNode.every(targetId => {
          return isRequiredPairCompleted(
            { from: node.id, to: targetId },
            updatedConnections
          )
        })
        
        return {
          ...node,
          state: allPairsCompleted ? ('completed' as NodeState) : ('connected' as NodeState)
        }
      }
      
      return { ...node, state: 'connected' as NodeState }
    }
    return node
  })

  // Create updated state
  const updatedState = {
    ...state,
    nodes: updatedNodes,
    connections: updatedConnections,
    moves: state.moves + 1,
    segments: state.segments + segments,
    selectedNodeId: null, // Clear selection after connection
  }

  // Check completion immediately after adding connection
  const completed = checkCompletion(updatedState)

  return {
    ...updatedState,
    completed,
    gameOver: completed || updatedState.gameOver,
  }
}

/**
 * Remove connection between two nodes (undo)
 */
export function removeConnection(
  state: GameState,
  fromId: string,
  toId: string
): GameState {
  // Find connection
  const connectionIndex = state.connections.findIndex(
    conn =>
      (conn.from === fromId && conn.to === toId) ||
      (conn.from === toId && conn.to === fromId)
  )

  if (connectionIndex === -1) {
    return state // Connection not found
  }

  const connection = state.connections[connectionIndex]

  // Remove connection
  const updatedConnections = state.connections.filter((_, index) => index !== connectionIndex)

  // Update nodes state (check if they're still connected to other nodes)
  const updatedNodes: Node[] = state.nodes.map(node => {
    if (node.id === fromId || node.id === toId) {
      // Check if node is still connected to any other node
      const stillConnected = updatedConnections.some(
        conn => conn.from === node.id || conn.to === node.id
      )
      return {
        ...node,
        state: (stillConnected ? 'connected' : 'idle') as NodeState,
      }
    }
    return node
  })

  // Update segments count
  const updatedSegments = Math.max(0, state.segments - connection.segments)

  return {
    ...state,
    nodes: updatedNodes,
    connections: updatedConnections,
    moves: Math.max(0, state.moves - 1),
    segments: updatedSegments,
  }
}

/**
 * Select node (for tap-to-tap selection)
 */
export function selectNode(state: GameState, nodeId: string): GameState {
  const node = state.nodes.find(n => n.id === nodeId)
  if (!node) {
    return state
  }

  // If no node is selected, select this one
  if (!state.selectedNodeId) {
    return {
      ...state,
      selectedNodeId: nodeId,
      nodes: state.nodes.map(n =>
        n.id === nodeId ? { ...n, state: 'active' } : n
      ),
    }
  }

  // If same node is selected, deselect it
  if (state.selectedNodeId === nodeId) {
    return {
      ...state,
      selectedNodeId: null,
      nodes: state.nodes.map(n =>
        n.id === nodeId ? { ...n, state: 'idle' } : n
      ),
    }
  }

  // If different node is selected, create connection
  const newState = addConnection(state, state.selectedNodeId, nodeId)
  return newState
}

/**
 * Check if a required connection pair is completed
 */
export function isRequiredPairCompleted(
  requiredConn: { from: string; to: string },
  connections: Connection[]
): boolean {
  return connections.some(
    conn =>
      (conn.from === requiredConn.from && conn.to === requiredConn.to) ||
      (conn.from === requiredConn.to && conn.to === requiredConn.from)
  )
}

/**
 * Get all required node pairs for a level
 * Returns a map of nodeId -> array of nodeIds it must connect to
 */
export function getRequiredPairs(level: Level | null): Map<string, string[]> {
  const pairs = new Map<string, string[]>()
  
  if (!level) return pairs
  
  level.requiredConnections.forEach(conn => {
    // Add bidirectional mapping
    const fromList = pairs.get(conn.from) || []
    if (!fromList.includes(conn.to)) {
      fromList.push(conn.to)
      pairs.set(conn.from, fromList)
    }
    
    const toList = pairs.get(conn.to) || []
    if (!toList.includes(conn.from)) {
      toList.push(conn.from)
      pairs.set(conn.to, toList)
    }
  })
  
  return pairs
}

/**
 * Check if puzzle is completed
 * 
 * Rules:
 * - Puzzle is completed ONLY when ALL required pairs are connected
 * - Loops and extra connections do NOT count
 * - All required connections must be present and valid
 */
export function checkCompletion(state: GameState): boolean {
  if (!state.level) {
    return false
  }

  // If already completed, don't check again
  if (state.completed) {
    return true
  }

  const requiredConnections = state.level.requiredConnections
  const madeConnections = state.connections

  // Check if ALL required connections are present
  // This is the ONLY condition for completion
  const allRequiredPresent = requiredConnections.every(reqConn => {
    return isRequiredPairCompleted(reqConn, madeConnections)
  })

  return allRequiredPresent
}

/**
 * Update game state (call this on each frame/tick)
 */
export function updateGameState(state: GameState): GameState {
  // Update duration
  const duration = Date.now() - state.startTime

  // Only check completion if not already completed
  const completed = state.completed ? true : checkCompletion(state)

  // If completed and not already game over, mark as game over
  const gameOver = completed || state.gameOver

  return {
    ...state,
    duration,
    completed,
    gameOver,
  }
}

/**
 * Calculate score based on time, efficiency, and difficulty
 */
export function calculateScore(state: GameState): {
  score: number
  timeBonus: number
  efficiencyBonus: number
  difficultyMultiplier: number
} {
  if (!state.level) {
    return { score: 0, timeBonus: 0, efficiencyBonus: 0, difficultyMultiplier: 0 }
  }

  // Time bonus: max(1, (maxTime - duration))
  const timeBonus = Math.max(1, MAX_TIME_FOR_SCORE - state.duration)

  // Calculate required segments (minimum segments needed for all required connections)
  const requiredSegments = state.level.requiredConnections.reduce((total, reqConn) => {
    const fromNode = state.nodes.find(n => n.id === reqConn.from)
    const toNode = state.nodes.find(n => n.id === reqConn.to)
    if (fromNode && toNode) {
      return total + calculateSegments(fromNode, toNode)
    }
    return total
  }, 0)

  // Efficiency bonus: (requiredSegments / actualSegments) * multiplier
  // Higher efficiency = fewer wasted segments
  const efficiencyRatio = requiredSegments > 0 && state.segments > 0
    ? requiredSegments / state.segments
    : 0
  const efficiencyBonus = efficiencyRatio * EFFICIENCY_BONUS_MULTIPLIER

  // Difficulty multiplier: level * baseMultiplier
  const difficultyMultiplier = state.level.difficulty * DIFFICULTY_BASE_MULTIPLIER

  // Total score
  const score = Math.floor(timeBonus + efficiencyBonus + difficultyMultiplier)

  return {
    score,
    timeBonus: Math.floor(timeBonus),
    efficiencyBonus: Math.floor(efficiencyBonus),
    difficultyMultiplier: Math.floor(difficultyMultiplier),
  }
}

/**
 * Reset game to initial state
 */
export function resetGame(state: GameState, level: Level | null = null): GameState {
  const levelToUse = level || state.level
  return createInitialGameState(levelToUse)
}

/**
 * Get score data for API submission
 */
export function getScoreData(state: GameState): {
  score: number
  duration: number
  moves: number
  level: number
  metadata: { segments: number }
} {
  const scoreCalc = calculateScore(state)
  return {
    score: scoreCalc.score,
    duration: state.duration,
    moves: state.moves,
    level: state.currentLevel,
    metadata: {
      segments: state.segments,
    },
  }
}

/**
 * Load level by level number
 */
export function loadLevelByNumber(level: number): Level | null {
  const levels = levelsData as Level[]
  const foundLevel = levels.find(l => l.level === level)
  return foundLevel || null
}

/**
 * Load default level (level 1)
 */
export function loadDefaultLevel(): Level | null {
  return loadLevelByNumber(1)
}

/**
 * Get total number of available levels
 */
export function getTotalLevels(): number {
  return (levelsData as Level[]).length
}

/**
 * Check if level exists
 */
export function levelExists(level: number): boolean {
  return loadLevelByNumber(level) !== null
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
export function validateLevel(level: Level): { valid: boolean; reason?: string } {
  // Check level number
  if (level.level < 1) {
    return { valid: false, reason: 'Level number must be >= 1' }
  }

  // Check nodes array
  if (!level.nodes || level.nodes.length === 0) {
    return { valid: false, reason: 'Level must have at least one node' }
  }

  // Check all node positions are within grid
  for (const node of level.nodes) {
    if (!isValidNodePosition(node.row, node.col)) {
      return { valid: false, reason: `Node ${node.id} position is out of bounds` }
    }
  }

  // Check required connections
  if (!level.requiredConnections || level.requiredConnections.length === 0) {
    return { valid: false, reason: 'Level must have at least one required connection' }
  }

  // Check all required connections reference existing node IDs
  const nodeIds = new Set(level.nodes.map(n => n.id))
  for (const reqConn of level.requiredConnections) {
    if (!nodeIds.has(reqConn.from)) {
      return { valid: false, reason: `Required connection references non-existent node: ${reqConn.from}` }
    }
    if (!nodeIds.has(reqConn.to)) {
      return { valid: false, reason: `Required connection references non-existent node: ${reqConn.to}` }
    }
  }

  // Check difficulty
  if (level.difficulty < 1) {
    return { valid: false, reason: 'Difficulty must be >= 1' }
  }

  return { valid: true }
}

