/**
 * Theme-aware styles for Dev Fifteen HEX
 */

import type { ThemeId } from '@/lib/themes'

export interface HexTileStyles {
  backgroundColor: string
  borderColor: string
  textColor: string
  glowColor?: string
  shadow?: string
  fontFamily: string
}

export interface ParticleConfig {
  color: string
  shape: 'bit' | 'line' | 'glow' | 'char' | 'square'
  size: number
  count: number
}

/**
 * Get tile styles based on theme
 */
export function getTileStyles(theme: ThemeId, isActive: boolean = false): HexTileStyles {
  const baseStyles = {
    cyber: {
      backgroundColor: isActive ? '#0a0a0a' : '#000000',
      borderColor: isActive ? '#00ff00' : '#00ff0080',
      textColor: '#00ff00',
      glowColor: '#00ff00',
      shadow: isActive ? '0 0 10px #00ff00' : 'none',
      fontFamily: 'ui-monospace, "Cascadia Code", "JetBrains Mono", monospace',
    },
    blueprint: {
      backgroundColor: '#1a1a2e',
      borderColor: '#ffffff',
      textColor: '#ffffff',
      glowColor: '#4a9eff',
      shadow: '0 0 5px rgba(74, 158, 255, 0.3)',
      fontFamily: 'ui-monospace, monospace',
    },
    neon: {
      backgroundColor: 'rgba(0, 255, 255, 0.1)',
      borderColor: isActive ? '#00ffff' : '#ff00ff',
      textColor: '#ffffff',
      glowColor: isActive ? '#00ffff' : '#ff00ff',
      shadow: isActive ? '0 0 15px #00ffff' : '0 0 10px #ff00ff',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    },
    'terminal-minimal': {
      backgroundColor: '#000000',
      borderColor: '#00ff00',
      textColor: '#00ff00',
      glowColor: undefined,
      shadow: 'none',
      fontFamily: 'ui-monospace, "Courier New", monospace',
    },
    'pixel-lab': {
      backgroundColor: '#1a1a1a',
      borderColor: '#888888',
      textColor: '#ffffff',
      glowColor: undefined,
      shadow: 'none',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
    },
  }
  
  const themeKey = theme === 'pixel' ? 'pixel-lab' : theme === 'terminal' ? 'terminal-minimal' : theme
  return baseStyles[themeKey as keyof typeof baseStyles] || baseStyles.cyber
}

/**
 * Get particle config for theme
 */
export function getParticleConfig(theme: ThemeId, isCompletion: boolean = false): ParticleConfig {
  const baseConfigs = {
    cyber: {
      color: '#00ff00',
      shape: 'bit' as const,
      size: 4,
      count: isCompletion ? 35 : 3,
    },
    blueprint: {
      color: '#4a9eff',
      shape: 'line' as const,
      size: 3,
      count: isCompletion ? 30 : 3,
    },
    neon: {
      color: '#00ffff',
      shape: 'glow' as const,
      size: 6,
      count: isCompletion ? 40 : 3,
    },
    'terminal-minimal': {
      color: '#00ff00',
      shape: 'char' as const,
      size: 12,
      count: isCompletion ? 25 : 3,
    },
    'pixel-lab': {
      color: '#ffffff',
      shape: 'square' as const,
      size: 4,
      count: isCompletion ? 30 : 3,
    },
  }
  
  const themeKey = theme === 'pixel' ? 'pixel-lab' : theme === 'terminal' ? 'terminal-minimal' : theme
  return baseConfigs[themeKey as keyof typeof baseConfigs] || baseConfigs.cyber
}

/**
 * Get board container styles
 */
export function getBoardStyles(theme: ThemeId): {
  backgroundColor: string
  borderColor: string
  gap: string
} {
  const styles = {
    cyber: {
      backgroundColor: '#000000',
      borderColor: '#00ff0080',
      gap: '4px',
    },
    blueprint: {
      backgroundColor: '#0f0f1e',
      borderColor: '#ffffff40',
      gap: '2px',
    },
    neon: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderColor: '#00ffff40',
      gap: '6px',
    },
    'terminal-minimal': {
      backgroundColor: '#000000',
      borderColor: '#00ff00',
      gap: '2px',
    },
    'pixel-lab': {
      backgroundColor: '#0a0a0a',
      borderColor: '#444444',
      gap: '4px',
    },
  }
  
  const themeKey = theme === 'pixel' ? 'pixel-lab' : theme === 'terminal' ? 'terminal-minimal' : theme
  return styles[themeKey as keyof typeof styles] || styles.cyber
}

