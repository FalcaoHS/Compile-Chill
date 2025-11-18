/**
 * Obstacle definitions and spawning system for Bit Runner
 * 
 * Dev-themed obstacles with pattern-based spawning and adaptive difficulty
 */

import { GAME_WIDTH, CHARACTER_WIDTH } from './game-logic'

// Use literal values to avoid circular dependency issues
// GAME_HEIGHT = 450, GROUND_Y = 400
const GROUND_Y = 400

// Obstacle types
export type ObstacleType = 
  | 'compiler'      // Low obstacle (must jump)
  | 'bug'           // High obstacle (must duck)
  | 'brackets'      // Medium obstacle (can jump or duck)
  | 'node_modules'  // Large block (must jump)
  | 'error'         // Suspended sign (must duck)
  | 'stackoverflow' // Flame effect (high)
  | 'warning'       // Yellow warning (medium)

// Obstacle definition
export interface ObstacleDefinition {
  type: ObstacleType
  width: number
  height: number
  y: number // Y position (ground-relative)
  color?: string // Theme color (optional, will use theme tokens)
  label?: string // Optional label (minimal text)
}

// Obstacle instance
export interface Obstacle {
  x: number
  y: number
  width: number
  height: number
  type: ObstacleType
}

// Obstacle type definitions
export const OBSTACLE_DEFINITIONS: Record<ObstacleType, Omit<ObstacleDefinition, 'type'>> = {
  compiler: {
    width: 30,
    height: 20,
    y: GROUND_Y - 20, // Low obstacle on ground
    label: 'compiler',
  },
  bug: {
    width: 25,
    height: 50,
    y: GROUND_Y - 50, // High obstacle
    label: '🐛',
  },
  brackets: {
    width: 35,
    height: 35,
    y: GROUND_Y - 35, // Medium obstacle
    label: '{}',
  },
  'node_modules': {
    width: 60,
    height: 40,
    y: GROUND_Y - 40, // Large block
    label: 'node_modules',
  },
  error: {
    width: 40,
    height: 45,
    y: GROUND_Y - 80, // Suspended/high
    label: 'ERROR',
  },
  stackoverflow: {
    width: 30,
    height: 60,
    y: GROUND_Y - 60, // High flame
    label: '🔥',
  },
  warning: {
    width: 35,
    height: 30,
    y: GROUND_Y - 30, // Medium
    label: '⚠️',
  },
}

/**
 * Create an obstacle instance
 */
export function createObstacle(
  type: ObstacleType,
  x: number
): Obstacle {
  const def = OBSTACLE_DEFINITIONS[type]
  return {
    x,
    y: def.y,
    width: def.width,
    height: def.height,
    type,
  }
}

// Spawn pattern definition
export interface SpawnPattern {
  id: string
  obstacles: Array<{
    type: ObstacleType
    offset: number // X offset from pattern start
  }>
  minSpacing: number // Minimum spacing before next pattern
  maxSpacing: number // Maximum spacing before next pattern
}

// Predefined spawn patterns (2-4 obstacles each)
export const SPAWN_PATTERNS: SpawnPattern[] = [
  // Simple single obstacles
  {
    id: 'single-compiler',
    obstacles: [{ type: 'compiler', offset: 0 }],
    minSpacing: 200,
    maxSpacing: 300,
  },
  {
    id: 'single-bug',
    obstacles: [{ type: 'bug', offset: 0 }],
    minSpacing: 200,
    maxSpacing: 300,
  },
  {
    id: 'single-brackets',
    obstacles: [{ type: 'brackets', offset: 0 }],
    minSpacing: 200,
    maxSpacing: 300,
  },
  
  // Pair combos
  {
    id: 'low-high',
    obstacles: [
      { type: 'compiler', offset: 0 },
      { type: 'bug', offset: 150 },
    ],
    minSpacing: 250,
    maxSpacing: 350,
  },
  {
    id: 'high-low',
    obstacles: [
      { type: 'bug', offset: 0 },
      { type: 'compiler', offset: 150 },
    ],
    minSpacing: 250,
    maxSpacing: 350,
  },
  {
    id: 'double-compiler',
    obstacles: [
      { type: 'compiler', offset: 0 },
      { type: 'compiler', offset: 120 },
    ],
    minSpacing: 250,
    maxSpacing: 350,
  },
  
  // Triple combos
  {
    id: 'triple-low',
    obstacles: [
      { type: 'compiler', offset: 0 },
      { type: 'compiler', offset: 100 },
      { type: 'compiler', offset: 200 },
    ],
    minSpacing: 300,
    maxSpacing: 400,
  },
  {
    id: 'mixed-combo',
    obstacles: [
      { type: 'compiler', offset: 0 },
      { type: 'brackets', offset: 120 },
      { type: 'bug', offset: 240 },
    ],
    minSpacing: 300,
    maxSpacing: 400,
  },
  
  // Complex patterns
  {
    id: 'node-modules-block',
    obstacles: [
      { type: 'node_modules', offset: 0 },
    ],
    minSpacing: 350,
    maxSpacing: 450,
  },
  {
    id: 'error-warning',
    obstacles: [
      { type: 'error', offset: 0 },
      { type: 'warning', offset: 150 },
    ],
    minSpacing: 300,
    maxSpacing: 400,
  },
  {
    id: 'stackoverflow-flame',
    obstacles: [
      { type: 'stackoverflow', offset: 0 },
    ],
    minSpacing: 300,
    maxSpacing: 400,
  },
]

/**
 * Get obstacle definition
 */
export function getObstacleDefinition(type: ObstacleType): Omit<ObstacleDefinition, 'type'> {
  return OBSTACLE_DEFINITIONS[type]
}

/**
 * Calculate adaptive spacing based on player performance
 */
export function calculateAdaptiveSpacing(
  baseMinSpacing: number,
  baseMaxSpacing: number,
  playerPerformance: {
    earlyFailure: boolean // Failed within first 10 seconds
    currentDistance: number
    averageSpacing: number
  },
  timeSinceLastFailure: number // Seconds since last failure
): { minSpacing: number; maxSpacing: number } {
  let minSpacing = baseMinSpacing
  let maxSpacing = baseMaxSpacing

  // If player failed early, increase spacing for 15-20 seconds
  if (playerPerformance.earlyFailure && timeSinceLastFailure < 20) {
    const adjustment = 1.5 // 50% more spacing
    minSpacing *= adjustment
    maxSpacing *= adjustment
  }

  // If player is doing well, gradually tighten spacing
  if (playerPerformance.currentDistance > 500 && !playerPerformance.earlyFailure) {
    const tightness = Math.min(0.8, 1 - (playerPerformance.currentDistance / 5000)) // Up to 20% tighter
    minSpacing *= tightness
    maxSpacing *= tightness
  }

  return {
    minSpacing: Math.max(150, minSpacing), // Never less than 150
    maxSpacing: Math.max(200, maxSpacing), // Never less than 200
  }
}

/**
 * Select a spawn pattern based on difficulty and randomization
 */
export function selectSpawnPattern(
  distance: number,
  randomVariation: number = 0.25 // 25% variation
): SpawnPattern {
  // Simple patterns early, complex patterns later
  const simplePatterns = SPAWN_PATTERNS.slice(0, 6) // First 6 are simple
  const complexPatterns = SPAWN_PATTERNS.slice(6) // Rest are complex

  // Use simple patterns for first 1000 distance, then mix
  const useSimple = distance < 1000 || Math.random() < 0.4

  const availablePatterns = useSimple ? simplePatterns : SPAWN_PATTERNS
  const pattern = availablePatterns[Math.floor(Math.random() * availablePatterns.length)]

  // Apply random variation to spacing
  if (randomVariation > 0) {
    const variation = 1 + (Math.random() * 2 - 1) * randomVariation // -25% to +25%
    return {
      ...pattern,
      minSpacing: Math.floor(pattern.minSpacing * variation),
      maxSpacing: Math.floor(pattern.maxSpacing * variation),
    }
  }

  return pattern
}

/**
 * Spawn obstacles from a pattern
 */
export function spawnPatternObstacles(
  pattern: SpawnPattern,
  startX: number
): Obstacle[] {
  return pattern.obstacles.map(obs => 
    createObstacle(obs.type, startX + obs.offset)
  )
}

/**
 * Calculate next spawn position
 */
export function calculateNextSpawnX(
  lastSpawnX: number,
  pattern: SpawnPattern,
  adaptiveSpacing?: { minSpacing: number; maxSpacing: number }
): number {
  const spacing = adaptiveSpacing || {
    minSpacing: pattern.minSpacing,
    maxSpacing: pattern.maxSpacing,
  }

  const spacingRange = spacing.maxSpacing - spacing.minSpacing
  const randomSpacing = spacing.minSpacing + Math.random() * spacingRange

  // Find the rightmost obstacle in the pattern
  const patternWidth = Math.max(...pattern.obstacles.map(o => o.offset + OBSTACLE_DEFINITIONS[o.type].width))

  return lastSpawnX + patternWidth + randomSpacing
}

