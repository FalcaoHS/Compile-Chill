/**
 * Tests for Refactor Rush level system
 */

import {
  loadLevelByNumber,
  loadDefaultLevel,
  getTotalLevels,
  levelExists,
  getNextLevel,
  type Level,
} from './game-logic'

describe('Refactor Rush Level System', () => {
  describe('loadLevelByNumber', () => {
    it('should load level 1', () => {
      const level = loadLevelByNumber(1)
      expect(level).not.toBeNull()
      expect(level?.level).toBe(1)
      expect(level?.gridSize).toBe(3)
    })

    it('should load level 10', () => {
      const level = loadLevelByNumber(10)
      expect(level).not.toBeNull()
      expect(level?.level).toBe(10)
      expect(level?.gridSize).toBe(5)
    })

    it('should return null for invalid level number', () => {
      const level = loadLevelByNumber(99)
      expect(level).toBeNull()
    })
  })

  describe('loadDefaultLevel', () => {
    it('should load level 1 as default', () => {
      const level = loadDefaultLevel()
      expect(level).not.toBeNull()
      expect(level?.level).toBe(1)
    })
  })

  describe('getTotalLevels', () => {
    it('should return total number of levels', () => {
      const total = getTotalLevels()
      expect(total).toBe(10)
    })
  })

  describe('levelExists', () => {
    it('should return true for existing level', () => {
      expect(levelExists(1)).toBe(true)
      expect(levelExists(10)).toBe(true)
    })

    it('should return false for non-existent level', () => {
      expect(levelExists(99)).toBe(false)
    })
  })

  describe('getNextLevel', () => {
    it('should return next level number', () => {
      expect(getNextLevel(1)).toBe(2)
      expect(getNextLevel(9)).toBe(10)
    })

    it('should return null for last level', () => {
      expect(getNextLevel(10)).toBeNull()
    })
  })
})

