/**
 * Types and interfaces for Drops System
 * 
 * Defines all types needed for procedural drop rendering
 */

/**
 * Drop rarity tier
 */
export type DropRarity = 'common' | 'uncommon' | 'rare' | 'epic'

/**
 * Geometric shape type for drops
 */
export type DropShape = 'circle' | 'square' | 'triangle' | 'hexagon'

/**
 * Reward type
 */
export type DropRewardType = 'points' | 'powerup' | 'special'

/**
 * Drop rarity configuration
 */
export interface DropRarityConfig {
  rarity: DropRarity
  probability: number // 0-1
  color: string | string[] // Color key(s) or gradient array
  size: { min: number; max: number } // Size in px
  glow: number // Glow intensity in px
  reward: {
    type: DropRewardType
    value: number
  }
  gravity: number // 0.5-0.8
  bounce: number // 0.3-0.5
}

/**
 * Drop state
 */
export interface DropState {
  id: string
  x: number
  y: number
  vx: number // Velocity X
  vy: number // Velocity Y
  shape: DropShape
  rarity: DropRarity
  size: number
  rotation: number
  spawnTime: number
  lifetime: number // Remaining time in ms
  isActive: boolean
  hasExploded: boolean
}

/**
 * Explosion particle
 */
export interface ExplosionParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  alpha: number
}

/**
 * DropManager configuration
 */
export interface DropManagerConfig {
  spawnInterval: { min: number; max: number } // ms
  maxActiveDrops: number
  timeout: number // ms
  canvasWidth: number
  canvasHeight: number
  floorY: number // Floor Y position
}

/**
 * Position 2D
 */
export interface Position {
  x: number
  y: number
}

/**
 * Reward granted callback
 */
export interface Reward {
  type: DropRewardType
  value: number
  timestamp: number
}

export type GrantRewardCallback = (reward: Reward) => void

