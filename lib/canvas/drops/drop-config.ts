/**
 * Drop Configuration
 * 
 * Defines rarity tiers, shapes, and probability distributions
 */

import { DropRarity, DropShape, DropRarityConfig } from './types'

/**
 * Rarity configurations with probabilities
 */
export const DROP_RARITY_CONFIGS: Record<DropRarity, DropRarityConfig> = {
  common: {
    rarity: 'common',
    probability: 0.70,
    color: 'primary', // Will be resolved to theme color
    size: { min: 24, max: 32 },
    glow: 8,
    reward: {
      type: 'points',
      value: 1,
    },
    gravity: 0.5,
    bounce: 0.3,
  },
  uncommon: {
    rarity: 'uncommon',
    probability: 0.20,
    color: 'accent',
    size: { min: 32, max: 40 },
    glow: 12,
    reward: {
      type: 'points',
      value: 3,
    },
    gravity: 0.6,
    bounce: 0.35,
  },
  rare: {
    rarity: 'rare',
    probability: 0.08,
    color: ['primary', 'accent'], // Gradient
    size: { min: 40, max: 48 },
    glow: 16,
    reward: {
      type: 'points',
      value: 10,
    },
    gravity: 0.7,
    bounce: 0.4,
  },
  epic: {
    rarity: 'epic',
    probability: 0.02,
    color: ['primary', 'accent', 'text'], // Multi-color gradient
    size: { min: 48, max: 56 },
    glow: 24,
    reward: {
      type: 'points',
      value: 50,
    },
    gravity: 0.8,
    bounce: 0.5,
  },
}

/**
 * Available shapes
 */
export const DROP_SHAPES: DropShape[] = ['circle', 'square', 'triangle', 'hexagon']

/**
 * Get all rarity configurations
 */
export function getDropRarityConfigs(): Record<DropRarity, DropRarityConfig> {
  return DROP_RARITY_CONFIGS
}

/**
 * Select random rarity based on probability distribution
 */
export function getRandomRarity(): DropRarity {
  const rand = Math.random()
  let cumulative = 0

  for (const [rarity, config] of Object.entries(DROP_RARITY_CONFIGS)) {
    cumulative += config.probability
    if (rand <= cumulative) {
      return rarity as DropRarity
    }
  }

  return 'common' // Fallback
}

/**
 * Select random shape
 */
export function getRandomShape(): DropShape {
  return DROP_SHAPES[Math.floor(Math.random() * DROP_SHAPES.length)]
}

