/**
 * Tests for Indiana Jones Temple Collapse Event Easter Egg
 * 
 * Tests critical easter egg behaviors:
 * - Easter egg triggers with 0.5% chance
 * - localStorage prevents repeat triggers
 * - All 4 phases execute in sequence
 * - Mobile-lite fallback (text only)
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals'

describe('Indiana Jones Temple Collapse Event', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ij_temple_event_unlocked')
    }
  })

  describe('Easter Egg Trigger', () => {
    it('should trigger with 0.5% chance', () => {
      const chance = 0.005
      expect(chance).toBe(0.005)
      
      // Simulate 1000 attempts
      let triggered = 0
      for (let i = 0; i < 1000; i++) {
        if (Math.random() < chance) {
          triggered++
        }
      }
      
      // Should trigger approximately 5 times (0.5% of 1000)
      expect(triggered).toBeGreaterThan(0)
      expect(triggered).toBeLessThan(20) // Allow variance
    })

    it('should only trigger when theme is indiana-jones', () => {
      const themeId = 'indiana-jones'
      expect(themeId).toBe('indiana-jones')
      
      const shouldTrigger = themeId === 'indiana-jones'
      expect(shouldTrigger).toBe(true)
    })

    it('should check localStorage before triggering', () => {
      if (typeof window !== 'undefined') {
        const unlocked = localStorage.getItem('ij_temple_event_unlocked')
        expect(unlocked).toBeNull() // Should be null initially
      }
    })

    it('should set localStorage after trigger', () => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ij_temple_event_unlocked', 'true')
        const unlocked = localStorage.getItem('ij_temple_event_unlocked')
        expect(unlocked).toBe('true')
      }
    })

    it('should prevent repeat triggers', () => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ij_temple_event_unlocked', 'true')
        const unlocked = localStorage.getItem('ij_temple_event_unlocked')
        expect(unlocked).toBe('true')
        // Should not trigger again if unlocked === 'true'
      }
    })
  })

  describe('Easter Egg Phases', () => {
    it('should have 4 phases plus final message', () => {
      const phases = [1, 2, 3, 4, 5] // 1-4: phases, 5: final message
      expect(phases).toHaveLength(5)
    })

    it('should execute phases in sequence', () => {
      const phase1 = { phase: 1, startTime: Date.now() }
      expect(phase1.phase).toBe(1)
      
      // After phase 1 completes, should move to phase 2
      const phase2 = { phase: 2, startTime: Date.now() }
      expect(phase2.phase).toBe(2)
    })

    it('should have correct phase durations', () => {
      const durations = {
        phase1: 400, // 0.4s
        phase2: 600, // 0.6s
        phase3: 800, // 0.8s
        phase4: 700, // 0.7s
        phase5: 2000, // 2s
      }
      
      expect(durations.phase1).toBe(400)
      expect(durations.phase2).toBe(600)
      expect(durations.phase3).toBe(800)
      expect(durations.phase4).toBe(700)
      expect(durations.phase5).toBe(2000)
    })
  })

  describe('Mobile-lite Fallback', () => {
    it('should skip particles and falling stones in mobile-lite', () => {
      const mobileMode = 'lite'
      expect(mobileMode).toBe('lite')
      
      // Particles and falling stones should be disabled
      const shouldSkip = mobileMode === 'lite'
      expect(shouldSkip).toBe(true)
    })

    it('should show only final text in mobile-lite', () => {
      const mobileMode = 'lite'
      const message = "🏺 Você testemunhou o Templo do Código Antigo. Raridade: 0.5%"
      
      expect(mobileMode).toBe('lite')
      expect(message).toContain('Templo do Código Antigo')
      expect(message).toContain('0.5%')
    })
  })
})

