/**
 * Particle effects system for Refactor Rush
 * 
 * Light-weight particle effects triggered on valid actions
 */

import type { BlockType } from "./block-types"

export type ParticleType = 'placement' | 'completion'

export interface ParticleConfig {
  type: ParticleType
  theme: string
  position: { x: number; y: number }
  blockType?: BlockType
}

/**
 * Get particle style configuration based on theme
 */
export function getParticleConfig(config: ParticleConfig) {
  const { type, theme, position, blockType } = config

  const themeConfigs: Record<string, {
    placement: { color: string; shape: string; size: number }
    completion: { color: string; shape: string; size: number; duration: number }
  }> = {
    'cyber-hacker': {
      placement: {
        color: '#10b981', // green-500
        shape: 'square',
        size: 4,
      },
      completion: {
        color: '#10b981',
        shape: 'square',
        size: 8,
        duration: 2000,
      },
    },
    'pixel-lab': {
      placement: {
        color: '#60a5fa', // blue-400
        shape: 'square',
        size: 6,
      },
      completion: {
        color: '#60a5fa',
        shape: 'square',
        size: 12,
        duration: 2000,
      },
    },
    'neon-future': {
      placement: {
        color: '#a78bfa', // purple-400
        shape: 'glow',
        size: 3,
      },
      completion: {
        color: '#a78bfa',
        shape: 'glow',
        size: 6,
        duration: 2500,
      },
    },
    'blueprint-dev': {
      placement: {
        color: '#3b82f6', // blue-500
        shape: 'line',
        size: 2,
      },
      completion: {
        color: '#3b82f6',
        shape: 'line',
        size: 4,
        duration: 2000,
      },
    },
    'terminal-minimal': {
      placement: {
        color: '#6b7280', // gray-500
        shape: 'char',
        size: 12,
      },
      completion: {
        color: '#6b7280',
        shape: 'char',
        size: 16,
        duration: 2000,
      },
    },
  }

  const themeConfig = themeConfigs[theme] || themeConfigs['cyber-hacker']
  const particleConfig = type === 'placement' ? themeConfig.placement : themeConfig.completion

  return {
    ...particleConfig,
    position,
    blockType,
  }
}

/**
 * Generate ASCII characters for terminal theme
 */
export function getTerminalParticleChar(): string {
  const chars = ['+', '#', ':', '*', '=', '-']
  return chars[Math.floor(Math.random() * chars.length)]
}

/**
 * Create particle animation variants for Framer Motion
 */
export function getParticleVariants(config: ParticleConfig) {
  const particleConfig = getParticleConfig(config)
  const { position, size } = particleConfig

  // Random direction for particles
  const angle = Math.random() * Math.PI * 2
  const distance = 30 + Math.random() * 40
  const x = Math.cos(angle) * distance
  const y = Math.sin(angle) * distance

  return {
    initial: {
      x: position.x,
      y: position.y,
      opacity: 1,
      scale: 1,
    },
    animate: {
      x: position.x + x,
      y: position.y + y,
      opacity: 0,
      scale: 0,
    },
    exit: {
      opacity: 0,
      scale: 0,
    },
  }
}

