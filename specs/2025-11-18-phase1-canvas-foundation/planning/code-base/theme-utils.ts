/**
 * Theme Utilities
 * 
 * Utilitários para trabalhar com temas no canvas.
 */

import { ThemeId, ThemeColors } from './interfaces'
import { getTheme } from '@/lib/themes'

/**
 * Obtém cores do tema para uso no canvas
 */
export function getThemeColors(themeId: ThemeId): ThemeColors {
  const theme = getTheme(themeId)
  const vars = theme.vars

  return {
    primary: vars['--color-primary'] || '#00f5ff',
    accent: vars['--color-accent'] || '#ff00ff',
    text: vars['--color-text'] || '#ffffff',
    bg: vars['--color-bg'] || '#0a0e27',
    bgSecondary: vars['--color-bg-secondary'] || '#0f1629',
    glow: vars['--color-glow'] || 'rgba(0, 245, 255, 0.6)',
    border: vars['--color-border'] || 'rgba(0, 245, 255, 0.4)',
  }
}

/**
 * Obtém cores do tema atual (do DOM)
 */
export function getCurrentThemeColors(): ThemeColors {
  if (typeof window === 'undefined') {
    return getThemeColors('neon') // Fallback
  }

  const root = document.documentElement
  const computedStyle = getComputedStyle(root)

  return {
    primary: computedStyle.getPropertyValue('--color-primary').trim(),
    accent: computedStyle.getPropertyValue('--color-accent').trim(),
    text: computedStyle.getPropertyValue('--color-text').trim(),
    bg: computedStyle.getPropertyValue('--color-bg').trim(),
    bgSecondary: computedStyle.getPropertyValue('--color-bg-secondary').trim(),
    glow: computedStyle.getPropertyValue('--color-glow').trim(),
    border: computedStyle.getPropertyValue('--color-border').trim(),
  }
}

