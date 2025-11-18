/**
 * Tests for Refactor Rush block types
 */

import {
  getBlockType,
  getBlockLabel,
  getBlockIcon,
  getBlockTextContent,
  getBlockStylingClasses,
  isValidBlockType,
  getAllBlockTypes,
  type BlockType,
} from './block-types'

describe('Refactor Rush Block Types', () => {
  describe('getBlockType', () => {
    it('should return block type definition', () => {
      const blockType = getBlockType('import')
      expect(blockType.id).toBe('import')
      expect(blockType.label).toBe('Import')
      expect(blockType.icon).toBe('📦')
    })
  })

  describe('getBlockLabel', () => {
    it('should return block label', () => {
      expect(getBlockLabel('import')).toBe('Import')
      expect(getBlockLabel('function')).toBe('Function')
    })
  })

  describe('getBlockIcon', () => {
    it('should return block icon', () => {
      expect(getBlockIcon('import')).toBe('📦')
      expect(getBlockIcon('const')).toBe('🔒')
    })
  })

  describe('getBlockTextContent', () => {
    it('should return block text content', () => {
      expect(getBlockTextContent('import')).toBe('import {...}')
      expect(getBlockTextContent('function')).toBe('function method()')
    })
  })

  describe('getBlockStylingClasses', () => {
    it('should return theme-aware styling classes', () => {
      const classes = getBlockStylingClasses('import', 'cyber-hacker')
      expect(classes).toContain('border-green-500')
      expect(classes).toContain('text-green-400')
    })

    it('should use default theme if theme not found', () => {
      const classes = getBlockStylingClasses('import', 'unknown-theme')
      expect(classes).toContain('border-blue-300')
    })
  })

  describe('isValidBlockType', () => {
    it('should return true for valid block types', () => {
      expect(isValidBlockType('import')).toBe(true)
      expect(isValidBlockType('function')).toBe(true)
    })

    it('should return false for invalid block types', () => {
      expect(isValidBlockType('invalid')).toBe(false)
      expect(isValidBlockType('')).toBe(false)
    })
  })

  describe('getAllBlockTypes', () => {
    it('should return all block types', () => {
      const types = getAllBlockTypes()
      expect(types).toHaveLength(6)
      expect(types).toContain('import')
      expect(types).toContain('const')
      expect(types).toContain('function')
      expect(types).toContain('class')
      expect(types).toContain('comment')
      expect(types).toContain('return')
    })
  })
})

