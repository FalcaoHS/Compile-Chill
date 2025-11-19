/**
 * Game logic for Packet Switch
 * 
 * Core game mechanics: packet routing, node selection, packet movement, score calculation
 */

import levelsData from './levels.json'

// Game constants
export const PACKET_SPEED = 0.02 // Progress increment per frame (0-1)
export const BASE_SCORE_PER_PACKET = 50 // Base score per packet delivered
export const MAX_TIME_SECONDS = 120 // 2 minutes max for time bonus
export const TIME_BONUS_POINTS = 100 // Maximum time bonus points

// Node types
export type NodeType = 'source' | 'destination' | 'router'

// Node states
export type NodeState = 'idle' | 'active'

// Node structure
export interface Node {
  id: string
  x: number // X position in canvas coordinates
  y: number // Y position in canvas coordinates
  type: NodeType
  state: NodeState
}

// Link structure
export interface Link {
  from: string // nodeId
  to: string // nodeId
}

// Packet structure
export interface Packet {
  id: string
  sourceNodeId: string
  destinationNodeId: string
  currentNodeId: string // Current node where packet is
  targetNodeId: string | null // Target node packet is moving towards
  progress: number // Progress along link (0-1)
  hops: number // Number of nodes visited
}

// Level structure (loaded from JSON)
export interface Level {
  level: number
  nodes: Array<{ id: string; x: number; y: number; type: NodeType }>
  links: Array<{ from: string; to: string }>
  sourceNodeId: string
  destinationNodeId: string
  packetsToSend: number
  difficulty: number
}

// Game state
export interface GameState {
  currentLevel: number
  level: Level | null
  nodes: Node[]
  links: Link[]
  activePackets: Packet[]
  completedPackets: number
  startTime: number
  duration: number
  moves: number
  averageHops: number
  completed: boolean
  gameOver: boolean
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
      links: [],
      activePackets: [],
      completedPackets: 0,
      startTime: Date.now(),
      duration: 0,
      moves: 0,
      averageHops: 0,
      completed: false,
      gameOver: false,
    }
  }

  // Initialize nodes from level data
  const nodes: Node[] = level.nodes.map(node => ({
    id: node.id,
    x: node.x,
    y: node.y,
    type: node.type,
    state: 'idle',
  }))

  // Initialize links from level data
  const links: Link[] = level.links.map(link => ({
    from: link.from,
    to: link.to,
  }))

  // Spawn initial packets at source node
  const activePackets: Packet[] = []
  for (let i = 0; i < level.packetsToSend; i++) {
    activePackets.push({
      id: `packet-${i}`,
      sourceNodeId: level.sourceNodeId,
      destinationNodeId: level.destinationNodeId,
      currentNodeId: level.sourceNodeId,
      targetNodeId: null,
      progress: 0,
      hops: 0,
    })
  }

  return {
    currentLevel: level.level,
    level,
    nodes,
    links,
    activePackets,
    completedPackets: 0,
    startTime: Date.now(),
    duration: 0,
    moves: 0,
    averageHops: 0,
    completed: false,
    gameOver: false,
  }
}

/**
 * Validate node position is within viewport bounds
 */
export function isValidNodePosition(x: number, y: number, canvasWidth: number, canvasHeight: number): boolean {
  return x >= 0 && x <= canvasWidth && y >= 0 && y <= canvasHeight
}

/**
 * Check if link exists between two nodes
 */
export function linkExists(fromNodeId: string, toNodeId: string, links: Link[]): boolean {
  return links.some(link => 
    (link.from === fromNodeId && link.to === toNodeId) ||
    (link.from === toNodeId && link.to === fromNodeId) // Bidirectional
  )
}

/**
 * Get node by ID
 */
export function getNodeById(nodeId: string, nodes: Node[]): Node | undefined {
  return nodes.find(node => node.id === nodeId)
}

/**
 * Route packet to target node
 */
export function routePacketToNode(
  packetId: string,
  targetNodeId: string,
  gameState: GameState
): GameState {
  const packet = gameState.activePackets.find(p => p.id === packetId)
  if (!packet) {
    return gameState
  }

  // Check if link exists between current node and target node
  if (!linkExists(packet.currentNodeId, targetNodeId, gameState.links)) {
    return gameState // Invalid route
  }

  // Update packet target
  const updatedPackets = gameState.activePackets.map(p => {
    if (p.id === packetId) {
      return {
        ...p,
        targetNodeId,
        progress: 0, // Reset progress for new link
      }
    }
    return p
  })

  // Update node states - reset all to idle, then set target to active
  const updatedNodes = gameState.nodes.map(node => {
    if (node.id === targetNodeId) {
      return { ...node, state: 'active' as NodeState }
    }
    // Reset other nodes to idle (except source/destination which stay as is)
    if (node.type === 'router') {
      return { ...node, state: 'idle' as NodeState }
    }
    return node
  })

  return {
    ...gameState,
    activePackets: updatedPackets,
    nodes: updatedNodes,
    moves: gameState.moves + 1,
  }
}

/**
 * Update packet positions (called each frame)
 */
export function updatePacketPositions(gameState: GameState): GameState {
  const updatedPackets = gameState.activePackets.map(packet => {
    // If packet has a target, move towards it
    if (packet.targetNodeId) {
      const newProgress = Math.min(1, packet.progress + PACKET_SPEED)
      
      // If packet reached target node
      if (newProgress >= 1) {
        const newHops = packet.hops + 1
        
        // Check if reached destination
        if (packet.targetNodeId === packet.destinationNodeId) {
          // Packet completed - will be removed from activePackets
          return {
            ...packet,
            currentNodeId: packet.targetNodeId,
            targetNodeId: null,
            progress: 1,
            hops: newHops,
          }
        }
        
        // Move to next node
        return {
          ...packet,
          currentNodeId: packet.targetNodeId,
          targetNodeId: null,
          progress: 0,
          hops: newHops,
        }
      }
      
      // Still moving
      return {
        ...packet,
        progress: newProgress,
      }
    }
    
    return packet
  })

  // Remove completed packets and count them
  const completedPackets = updatedPackets.filter(p => 
    p.currentNodeId === p.destinationNodeId && p.progress >= 1
  )
  
  const stillActivePackets = updatedPackets.filter(p => 
    !(p.currentNodeId === p.destinationNodeId && p.progress >= 1)
  )

  // Reset node states when packets move
  const resetNodes = gameState.nodes.map(node => {
    // Keep source and destination nodes as is
    if (node.type === 'source' || node.type === 'destination') {
      return node
    }
    // Reset router nodes to idle
    return { ...node, state: 'idle' as NodeState }
  })

  // Calculate average hops for completed packets
  const totalHops = completedPackets.reduce((sum, p) => sum + p.hops, 0)
  const newCompletedCount = gameState.completedPackets + completedPackets.length
  const averageHops = newCompletedCount > 0 
    ? (gameState.averageHops * gameState.completedPackets + totalHops) / newCompletedCount
    : 0

  // Update duration
  const duration = Date.now() - gameState.startTime

  return {
    ...gameState,
    nodes: resetNodes,
    activePackets: stillActivePackets,
    completedPackets: newCompletedCount,
    averageHops,
    duration,
  }
}

/**
 * Check if game is completed (all packets reached destinations)
 */
export function checkCompletion(gameState: GameState): GameState {
  if (gameState.level && gameState.activePackets.length === 0 && 
      gameState.completedPackets >= gameState.level.packetsToSend) {
    return {
      ...gameState,
      completed: true,
      gameOver: true,
      duration: Date.now() - gameState.startTime,
    }
  }
  return gameState
}

/**
 * Calculate score
 * 
 * NEW FORMULA (2025-11-19): Fixed broken scoring (was returning 0)
 * - Base score per packet: 50 points
 * - Efficiency bonus for fewer hops
 * - Time bonus (minor component)
 * 
 * Example: 1 packet, difficulty=1, 2 hops, 5 seconds
 * - baseScorePerPacket = 50
 * - hopEfficiency = 1 / 2 = 0.5
 * - timeBonus = 100 * (115/120) = 96
 * - score = 50 * 1 * 1 * 0.5 + 96 = 121 (fixed from 0!)
 */
export function calculateScore(gameState: GameState): number {
  if (!gameState.level || gameState.completedPackets === 0) {
    return 0
  }

  const packetsDelivered = gameState.completedPackets
  const difficulty = gameState.level.difficulty
  const averageHops = gameState.averageHops || 1 // Avoid division by zero

  // Base score per packet delivered
  const baseScorePerPacket = BASE_SCORE_PER_PACKET

  // Difficulty multiplier
  const difficultyMultiplier = difficulty

  // Efficiency bonus (fewer hops = better)
  // Theoretical minimum is 1 hop, use 0.5 as floor to avoid zero scores
  const minPossibleHops = 1
  const hopEfficiency = Math.max(0.5, minPossibleHops / averageHops)

  // Time bonus (faster is better, but minor component)
  const durationSeconds = gameState.duration / 1000
  const timeRatio = Math.max(0, Math.min(1, (MAX_TIME_SECONDS - durationSeconds) / MAX_TIME_SECONDS))
  const timeBonus = TIME_BONUS_POINTS * timeRatio

  // Total score
  const score = (baseScorePerPacket * packetsDelivered * difficultyMultiplier * hopEfficiency) + timeBonus

  return Math.max(0, Math.floor(score)) // Ensure non-negative integer
}

/**
 * Get score data for API submission
 */
export function getScoreData(gameState: GameState) {
  return {
    score: calculateScore(gameState),
    packetsDelivered: gameState.completedPackets,
    averageHops: gameState.averageHops,
    duration: gameState.duration,
    moves: gameState.moves,
    levelId: gameState.currentLevel,
  }
}

/**
 * Load level by level number
 */
export function loadLevelByNumber(levelNumber: number): Level | null {
  const levels = levelsData as Level[]
  const level = levels.find(l => l.level === levelNumber)
  return level || null
}

/**
 * Load default level (level 1)
 */
export function loadDefaultLevel(): Level | null {
  return loadLevelByNumber(1)
}

/**
 * Get next level number
 */
export function getNextLevel(currentLevel: number): number | null {
  const levels = levelsData as Level[]
  const nextLevel = levels.find(l => l.level === currentLevel + 1)
  return nextLevel ? nextLevel.level : null
}

/**
 * Reset game to initial state
 */
export function resetGame(level: Level | null = null): GameState {
  return createInitialGameState(level)
}

