/**
 * Tests for Star Wars (Galactic Force) theme registration
 * 
 * Tests critical theme registration behaviors:
 * - ThemeId type includes "star-wars"
 * - Theme entry exists in THEMES object
 * - All CSS variables are defined correctly
 * - Theme can be retrieved via getTheme()
 */

import { describe, it, expect } from '@jest/globals'
import { 
  type ThemeId, 
  THEMES, 
  getTheme, 
  getAllThemeIds, 
  isValidTheme 
} from '../../lib/themes'

describe('Star Wars Theme Registration', () => {
  describe('ThemeId type', () => {
    it('should include "star-wars" as valid theme ID', () => {
      const themeId: ThemeId = 'star-wars'
      expect(isValidTheme(themeId)).toBe(true)
    })

    it('should be included in getAllThemeIds()', () => {
      const themeIds = getAllThemeIds()
      expect(themeIds).toContain('star-wars')
    })
  })

  describe('Theme entry in THEMES object', () => {
    it('should have theme entry with correct name', () => {
      const theme = THEMES['star-wars']
      expect(theme).toBeDefined()
      expect(theme.name).toBe('Galactic Force (Star-Inspired)')
    })

    it('should have all required CSS variables defined', () => {
      const theme = THEMES['star-wars']
      const vars = theme.vars

      // Core color variables
      expect(vars['--color-bg']).toBe('#050508') // Space Black
      expect(vars['--color-bg-secondary']).toBe('#0C0F14') // BG Soft
      expect(vars['--color-primary']).toBe('#2F9BFF') // Blue Energy
      expect(vars['--color-primary-hover']).toBeDefined()
      expect(vars['--color-accent']).toBe('#FF2B2B') // Red Energy
      expect(vars['--color-accent-hover']).toBeDefined()
      expect(vars['--color-text']).toBe('#D8F2FF') // Holographic White
      expect(vars['--color-glow']).toBe('#59E0FF') // Cyan Glow
      expect(vars['--color-highlight']).toBe('#FFC23D') // Force Amber
      expect(vars['--color-border']).toBeDefined()

      // Typography
      expect(vars['--font']).toBeDefined()
      expect(vars['--font-size-base']).toBeDefined()

      // Canvas/Game variables
      expect(vars['--orb-fill']).toBeDefined()
      expect(vars['--orb-stroke']).toBeDefined()
      expect(vars['--particle-color-1']).toBeDefined()
      expect(vars['--particle-color-2']).toBeDefined()
      expect(vars['--particle-color-3']).toBeDefined()

      // Shadow variables
      expect(vars['--shadow-lg']).toBeDefined()
      expect(vars['--shadow-sm']).toBeDefined()
    })
  })

  describe('getTheme() function', () => {
    it('should retrieve theme by ID', () => {
      const theme = getTheme('star-wars')
      expect(theme).toBeDefined()
      expect(theme.name).toBe('Galactic Force (Star-Inspired)')
      expect(theme.vars).toBeDefined()
    })

    it('should return same theme object as THEMES entry', () => {
      const theme1 = getTheme('star-wars')
      const theme2 = THEMES['star-wars']
      expect(theme1).toBe(theme2)
    })
  })

  describe('isValidTheme() function', () => {
    it('should return true for "star-wars"', () => {
      expect(isValidTheme('star-wars')).toBe(true)
    })

    it('should return false for invalid theme IDs', () => {
      expect(isValidTheme('invalid-theme')).toBe(false)
      expect(isValidTheme('')).toBe(false)
    })
  })
})

