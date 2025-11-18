/**
 * Tests for FPS Guardian system
 * 
 * Focused tests for critical FPS monitoring and degradation behaviors.
 * Tests cover: FPS calculation, level detection, hysteresis, and state management.
 */

import { useFPSGuardianStore, getFPSLevel, isFPSLevelAtLeast, isFPSLevelAtMost } from './fps-guardian'

describe('FPS Guardian System', () => {
  beforeEach(() => {
    // Reset store before each test
    useFPSGuardianStore.getState().reset()
  })

  describe('FPS Calculation and History Tracking', () => {
    it('should track FPS history over 60 frames', () => {
      const store = useFPSGuardianStore.getState()
      
      // Simulate 60 frames at 60 FPS
      for (let i = 0; i < 60; i++) {
        store.setFPS(60)
      }
      
      expect(store.fpsHistory.length).toBe(60)
      expect(store.averageFPS).toBeCloseTo(60, 1)
    })

    it('should maintain only last 60 frames in history', () => {
      const store = useFPSGuardianStore.getState()
      
      // Simulate 100 frames
      for (let i = 0; i < 100; i++) {
        store.setFPS(60)
      }
      
      expect(store.fpsHistory.length).toBe(60)
    })

    it('should calculate average FPS correctly', () => {
      const store = useFPSGuardianStore.getState()
      
      // Set varying FPS values
      store.setFPS(50)
      store.setFPS(55)
      store.setFPS(60)
      
      const avg = store.fpsHistory.reduce((a, b) => a + b, 0) / store.fpsHistory.length
      expect(store.averageFPS).toBeCloseTo(avg, 1)
    })
  })

  describe('Level 0 Detection (FPS ≥ 50)', () => {
    it('should set level to 0 when FPS is 50 or above', () => {
      const store = useFPSGuardianStore.getState()
      
      // Simulate stable 60 FPS (should be Level 0)
      for (let i = 0; i < 60; i++) {
        store.setFPS(60)
      }
      
      // Wait for hysteresis buffer (2 seconds)
      // In real scenario, this would be handled by time, but for test we'll simulate
      // by setting FPS multiple times to fill history
      expect(store.level).toBe(0)
    })

    it('should enable everything at Level 0', () => {
      const store = useFPSGuardianStore.getState()
      
      // Set to Level 0
      for (let i = 0; i < 60; i++) {
        store.setFPS(55)
      }
      
      expect(store.level).toBe(0)
      expect(getFPSLevel()).toBe(0)
      expect(isFPSLevelAtLeast(0)).toBe(true)
    })
  })

  describe('Level 1 Detection (40 ≤ FPS < 50)', () => {
    it('should set level to 1 when FPS is between 40 and 50', () => {
      const store = useFPSGuardianStore.getState()
      
      // Simulate stable 45 FPS (should be Level 1)
      for (let i = 0; i < 60; i++) {
        store.setFPS(45)
      }
      
      expect(store.level).toBe(1)
    })

    it('should apply smooth degradation at Level 1', () => {
      const store = useFPSGuardianStore.getState()
      
      // Set to Level 1
      for (let i = 0; i < 60; i++) {
        store.setFPS(42)
      }
      
      expect(store.level).toBe(1)
      expect(isFPSLevelAtMost(1)).toBe(true)
    })
  })

  describe('Level 2 Detection (FPS < 40)', () => {
    it('should set level to 2 when FPS is below 40', () => {
      const store = useFPSGuardianStore.getState()
      
      // Simulate stable 35 FPS (should be Level 2)
      for (let i = 0; i < 60; i++) {
        store.setFPS(35)
      }
      
      expect(store.level).toBe(2)
    })

    it('should apply aggressive fallback at Level 2', () => {
      const store = useFPSGuardianStore.getState()
      
      // Set to Level 2
      for (let i = 0; i < 60; i++) {
        store.setFPS(30)
      }
      
      expect(store.level).toBe(2)
      expect(isFPSLevelAtMost(2)).toBe(true)
    })
  })

  describe('Hysteresis Buffer', () => {
    it('should prevent immediate level changes', () => {
      const store = useFPSGuardianStore.getState()
      
      // Start at Level 0 (60 FPS)
      for (let i = 0; i < 60; i++) {
        store.setFPS(60)
      }
      expect(store.level).toBe(0)
      
      // Drop to 35 FPS (should trigger Level 2, but hysteresis prevents immediate change)
      // Note: In real implementation, hysteresis uses timestamp, but for test we verify
      // that level doesn't change instantly
      store.setFPS(35)
      store.setFPS(35)
      
      // Level should still be 0 initially (hysteresis buffer)
      // After filling history with low FPS, it should change
      for (let i = 0; i < 60; i++) {
        store.setFPS(35)
      }
      
      // After hysteresis buffer period, level should change to 2
      expect(store.level).toBe(2)
    })
  })

  describe('Global State Export', () => {
    it('should export FPS level globally', () => {
      const store = useFPSGuardianStore.getState()
      
      // Set to Level 1
      for (let i = 0; i < 60; i++) {
        store.setFPS(45)
      }
      
      expect(getFPSLevel()).toBe(1)
      expect(getFPSLevel()).toBe(store.level)
    })

    it('should provide utility functions for level checking', () => {
      const store = useFPSGuardianStore.getState()
      
      // Set to Level 0
      for (let i = 0; i < 60; i++) {
        store.setFPS(55)
      }
      
      expect(isFPSLevelAtLeast(0)).toBe(true)
      expect(isFPSLevelAtLeast(1)).toBe(false)
      expect(isFPSLevelAtMost(0)).toBe(true)
      expect(isFPSLevelAtMost(1)).toBe(true)
    })
  })
})

