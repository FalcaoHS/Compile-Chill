/**
 * Tests for Indiana Jones theme registration
 * 
 * Tests critical theme registration behaviors:
 * - ThemeId type includes "indiana-jones"
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

describe('Indiana Jones Theme Registration', () => {
  describe('ThemeId type', () => {
    it('should include "indiana-jones" as valid theme ID', () => {
      const themeId: ThemeId = 'indiana-jones'
      expect(isValidTheme(themeId)).toBe(true)
    })

    it('should be included in getAllThemeIds()', () => {
      const themeIds = getAllThemeIds()
      expect(themeIds).toContain('indiana-jones')
    })
  })

  describe('Theme entry in THEMES object', () => {
    it('should have theme entry with correct name', () => {
      const theme = THEMES['indiana-jones']
      expect(theme).toBeDefined()
      expect(theme.name).toBe('Indiana Jones - Dev Edition')
    })

    it('should have all required CSS variables defined', () => {
      const theme = THEMES['indiana-jones']
      const vars = theme.vars

      // Core color variables
      expect(vars['--color-bg']).toBe('#C2A878') // Sand
      expect(vars['--color-bg-secondary']).toBe('#8A6B45') // Stone
      expect(vars['--color-primary']).toBe('#DAB466') // Gold
      expect(vars['--color-primary-hover']).toBeDefined()
      expect(vars['--color-accent']).toBe('#4AFF8A') // Snake Green
      expect(vars['--color-accent-hover']).toBeDefined()
      expect(vars['--color-text']).toBe('#FFF4D0') // Divine Light
      expect(vars['--color-glow']).toBe('#FFB95A') // Amber
      expect(vars['--color-border']).toBe('#4A3924') // Shadow

      // Typography
      expect(vars['--font']).toBeDefined()
      expect(vars['--font-size-base']).toBeDefined()

      // Canvas/Game variables
      expect(vars['--orb-fill']).toBeDefined()
      expect(vars['--orb-stroke']).toBeDefined()
      expect(vars['--particle-color-1']).toBeDefined()
      expect(vars['--particle-color-2']).toBeDefined()
      expect(vars['--particle-color-3']).toBeDefined()
    })
  })

  describe('getTheme() function', () => {
    it('should retrieve theme by ID', () => {
      const theme = getTheme('indiana-jones')
      expect(theme).toBeDefined()
      expect(theme.name).toBe('Indiana Jones - Dev Edition')
      expect(theme.vars).toBeDefined()
    })

    it('should return same theme object as THEMES entry', () => {
      const theme1 = getTheme('indiana-jones')
      const theme2 = THEMES['indiana-jones']
      expect(theme1).toBe(theme2)
    })
  })

  describe('isValidTheme() function', () => {
    it('should return true for "indiana-jones"', () => {
      expect(isValidTheme('indiana-jones')).toBe(true)
    })

    it('should return false for invalid theme IDs', () => {
      expect(isValidTheme('invalid-theme')).toBe(false)
      expect(isValidTheme('')).toBe(false)
    })
  })
})

