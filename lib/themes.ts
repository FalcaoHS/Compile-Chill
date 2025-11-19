/**
 * Theme configuration for Compile & Chill
 * 
 * Defines 6 unique visual themes with comprehensive design tokens.
 * Each theme includes colors, typography, and effect variables.
 */

export type ThemeId = 'cyber' | 'pixel' | 'neon' | 'terminal' | 'blueprint' | 'bruno-csharp'

export interface Theme {
  name: string
  vars: Record<string, string>
}

export const THEMES: Record<ThemeId, Theme> = {
  cyber: {
    name: 'Cyber Hacker',
    vars: {
      // Colors
      '--color-bg': '#070912',
      '--color-bg-secondary': '#0a0f1a',
      '--color-primary': '#7ef9ff',
      '--color-primary-hover': '#5dd5e0',
      '--color-accent': '#7dd3fc',
      '--color-accent-hover': '#60b8d4',
      '--color-muted': '#94a3b8',
      '--color-text': '#e2e8f0',
      '--color-text-secondary': '#cbd5e1',
      '--color-glow': 'rgba(126, 249, 255, 0.45)',
      '--color-border': 'rgba(126, 249, 255, 0.2)',
      
      // Typography
      '--font': "'Roboto Mono', 'Courier New', monospace",
      '--font-size-base': '16px',
      
      // Effects
      '--scanline-opacity': '0.06',
      '--noise-opacity': '0.03',
      '--glow-intensity': '1',
      '--cursor-blink': 'blink',
    },
  },
  pixel: {
    name: 'Pixel Lab',
    vars: {
      // Colors
      '--color-bg': '#1a1a2e',
      '--color-bg-secondary': '#16213e',
      '--color-primary': '#ff6b9d',
      '--color-primary-hover': '#ff4d7f',
      '--color-accent': '#c44569',
      '--color-accent-hover': '#a8325a',
      '--color-muted': '#8b7fa8',
      '--color-text': '#f4f4f4',
      '--color-text-secondary': '#d4d4d4',
      '--color-glow': 'rgba(255, 107, 157, 0.4)',
      '--color-border': 'rgba(255, 107, 157, 0.3)',
      
      // Typography
      '--font': "'Press Start 2P', 'Courier New', monospace",
      '--font-size-base': '14px',
      
      // Effects
      '--pixel-size': '4px',
      '--glitch-intensity': '0.5',
      '--glow-intensity': '0.8',
    },
  },
  neon: {
    name: 'Neon Future',
    vars: {
      // Colors
      '--color-bg': '#0a0e27',
      '--color-bg-secondary': '#0f1629',
      '--color-primary': '#00f5ff',
      '--color-primary-hover': '#00d4e0',
      '--color-accent': '#ff00ff',
      '--color-accent-hover': '#e000e0',
      '--color-muted': '#6b7aa0',
      '--color-text': '#ffffff',
      '--color-text-secondary': '#e0e0e0',
      '--color-glow': 'rgba(0, 245, 255, 0.6)',
      '--color-border': 'rgba(0, 245, 255, 0.4)',
      
      // Typography
      '--font': "'Orbitron', 'Arial', sans-serif",
      '--font-size-base': '16px',
      
      // Effects
      '--neon-bloom-intensity': '1.2',
      '--glow-intensity': '1.5',
      '--glass-opacity': '0.1',
    },
  },
  terminal: {
    name: 'Terminal Minimal',
    vars: {
      // Colors
      '--color-bg': '#1e1e1e',
      '--color-bg-secondary': '#252525',
      '--color-primary': '#4ec9b0',
      '--color-primary-hover': '#3ab89f',
      '--color-accent': '#569cd6',
      '--color-accent-hover': '#4a8bc0',
      '--color-muted': '#858585',
      '--color-text': '#d4d4d4',
      '--color-text-secondary': '#b4b4b4',
      '--color-glow': 'rgba(78, 201, 176, 0.3)',
      '--color-border': 'rgba(78, 201, 176, 0.2)',
      
      // Typography
      '--font': "'Fira Code', 'Consolas', monospace",
      '--font-size-base': '15px',
      
      // Effects
      '--cursor-blink': 'blink',
      '--minimal-opacity': '0.8',
    },
  },
  blueprint: {
    name: 'Blueprint Dev',
    vars: {
      // Colors
      '--color-bg': '#1a2332',
      '--color-bg-secondary': '#223344',
      '--color-primary': '#4a9eff',
      '--color-primary-hover': '#3a8eef',
      '--color-accent': '#5bb3ff',
      '--color-accent-hover': '#4ba3ef',
      '--color-muted': '#7a8a9a',
      '--color-text': '#e8f0f8',
      '--color-text-secondary': '#d0d8e0',
      '--color-glow': 'rgba(74, 158, 255, 0.4)',
      '--color-border': 'rgba(74, 158, 255, 0.3)',
      
      // Typography
      '--font': "'Inter', 'Segoe UI', sans-serif",
      '--font-size-base': '16px',
      
      // Effects
      '--grid-opacity': '0.1',
      '--line-opacity': '0.3',
      '--glow-intensity': '0.9',
    },
  },
  'bruno-csharp': {
    name: 'Bruno C# de Burro',
    vars: {
      // Colors - Paleta melancólica metálica inspirada em robô paranóide
      '--color-bg': '#1A1E24',
      '--color-bg-secondary': '#2C3440',
      '--color-primary': '#C8D5E0',
      '--color-primary-hover': '#D8E5F0',
      '--color-accent': '#00FF88',
      '--color-accent-hover': '#00DD77',
      '--color-secondary': '#4A5A6A',
      '--color-highlight': '#88FFB8',
      '--color-muted': '#6A7A8A',
      '--color-text': '#C8D5E0',
      '--color-text-secondary': '#9AA5B0',
      '--color-glow': 'rgba(0, 255, 170, 0.4)',
      '--color-border': 'rgba(0, 255, 136, 0.2)',
      '--color-error': '#FF6B6B',
      
      // Typography - Monoespaçada para estética retrofuturista
      '--font': "'Space Mono', 'Courier New', monospace",
      '--font-size-base': '16px',
      
      // Effects - Glow verde néon suave e animações lentas
      '--glow-sm': '0 0 4px rgba(0, 255, 170, 0.4)',
      '--glow-md': '0 0 8px rgba(0, 255, 170, 0.4)',
      '--glow-lg': '0 0 16px rgba(0, 255, 170, 0.6)',
      '--glow-xl': '0 0 24px rgba(0, 255, 170, 0.8)',
      '--glow-intensity': '0.6',
      '--anim-duration': '1200ms',
      '--anim-easing': 'cubic-bezier(0.4, 0, 0.2, 1)',
      '--border-radius': '4px',
      '--pulse-speed': '3000ms',
      '--drift-speed': '5000ms',
      '--scanline-opacity': '0.02',
      '--noise-opacity': '0.01',
      
      // Canvas/Game specific
      '--orb-fill': '#C8D5E0',
      '--orb-stroke': '#00FF88',
      '--orb-glow': 'rgba(0, 255, 170, 0.4)',
      '--basket-fill': '#4A5A6A',
      '--basket-stroke': '#00FF88',
      '--particle-color-1': '#00FFAA',
      '--particle-color-2': '#C8D5E0',
      '--particle-color-3': '#88FFB8',
      '--firework-color-1': '#00FF88',
      '--firework-color-2': '#C8D5E0',
      '--firework-color-3': '#88FFB8',
    },
  },
}

/**
 * Get theme by ID
 */
export function getTheme(themeId: ThemeId): Theme {
  return THEMES[themeId]
}

/**
 * Get all theme IDs
 */
export function getAllThemeIds(): ThemeId[] {
  return Object.keys(THEMES) as ThemeId[]
}

/**
 * Check if theme ID is valid
 */
export function isValidTheme(themeId: string): themeId is ThemeId {
  return themeId in THEMES
}

