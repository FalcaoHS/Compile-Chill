/**
 * Utility functions for theme integration with games
 * 
 * Provides helpers for applying themes to canvas elements
 * and game components.
 */

import { THEMES, type ThemeId } from './themes'

/**
 * Apply theme colors to a canvas element
 * 
 * @param canvas - Canvas element to apply theme to
 * @param themeId - Theme ID to apply
 */
export function applyThemeToCanvas(canvas: HTMLCanvasElement, themeId: ThemeId): void {
  const theme = THEMES[themeId]
  
  // Set canvas background color
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = theme.vars['--color-bg']
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  
  // Set data-theme attribute for CSS styling
  canvas.setAttribute('data-theme', themeId)
}

/**
 * Get theme color value
 * 
 * @param themeId - Theme ID
 * @param colorVar - CSS variable name (e.g., '--color-primary')
 * @returns Color value or null if not found
 */
export function getThemeColor(themeId: ThemeId, colorVar: string): string | null {
  const theme = THEMES[themeId]
  return theme.vars[colorVar] || null
}

/**
 * Hook-like utility to get current theme from data-theme attribute
 * 
 * @param element - Element to check (defaults to document.documentElement)
 * @returns Theme ID or null
 */
export function getDataTheme(element: HTMLElement = document.documentElement): ThemeId | null {
  const themeAttr = element.getAttribute('data-theme')
  if (themeAttr && (themeAttr === 'cyber' || themeAttr === 'pixel' || themeAttr === 'neon' || themeAttr === 'terminal' || themeAttr === 'blueprint')) {
    return themeAttr as ThemeId
  }
  return null
}

/**
 * CSS classes for theme-aware game styling
 * 
 * Usage in game components:
 * - className="game-container theme-bg theme-text"
 * - className="game-button theme-primary theme-glow"
 */
export const themeClasses = {
  bg: 'bg-page',
  bgSecondary: 'bg-page-secondary',
  text: 'text-text',
  textSecondary: 'text-text-secondary',
  primary: 'bg-primary text-page',
  accent: 'bg-accent text-page',
  border: 'border border-border',
  glow: 'shadow-glow',
  glowSm: 'shadow-glow-sm',
  glowLg: 'shadow-glow-lg',
} as const

