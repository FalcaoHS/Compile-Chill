/**
 * Particle Budget System Tests
 * 
 * Tests for global particle budget allocation, priority system, and graceful degradation.
 */

import { useParticleBudgetStore, ParticleType } from './particle-budget'
import { act } from 'react-dom/test-utils'

describe('ParticleBudgetStore', () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useParticleBudgetStore.getState().reset()
    })
  })

  it('should initialize with default budget allocation', () => {
    const state = useParticleBudgetStore.getState()
    expect(state.budget.fireworks).toBe(100)
    expect(state.budget.drops).toBe(50)
    expect(state.budget.emotes).toBe(50)
    expect(state.budget.emotes_legendary).toBe(50)
    expect(state.budget.theme).toBe(50)
    expect(state.budget.ui_critical).toBe(0)
    expect(state.getTotalUsage()).toBe(0)
  })

  it('should allocate particles within budget', () => {
    const allocate = useParticleBudgetStore.getState().allocate
    act(() => {
      const result = allocate('fireworks', 30)
      expect(result).toBe(true)
    })
    
    const state = useParticleBudgetStore.getState()
    expect(state.usage.fireworks).toBe(30)
    expect(state.getAvailable('fireworks')).toBe(70)
    expect(state.getTotalUsage()).toBe(30)
  })

  it('should not allocate particles beyond budget', () => {
    const allocate = useParticleBudgetStore.getState().allocate
    act(() => {
      // Try to allocate more than available
      const result = allocate('fireworks', 150)
      expect(result).toBe(false)
    })
    
    const state = useParticleBudgetStore.getState()
    expect(state.usage.fireworks).toBe(0)
    expect(state.getTotalUsage()).toBe(0)
  })

  it('should deallocate particles correctly', () => {
    const allocate = useParticleBudgetStore.getState().allocate
    const deallocate = useParticleBudgetStore.getState().deallocate
    
    act(() => {
      allocate('fireworks', 50)
      deallocate('fireworks', 20)
    })
    
    const state = useParticleBudgetStore.getState()
    expect(state.usage.fireworks).toBe(30)
    expect(state.getAvailable('fireworks')).toBe(70)
    expect(state.getTotalUsage()).toBe(30)
  })

  it('should respect priority order (UI critical > legendary emotes > fireworks > drops > theme)', () => {
    const allocate = useParticleBudgetStore.getState().allocate
    
    act(() => {
      // Fill up budget with lower priority particles
      allocate('theme', 50)
      allocate('drops', 50)
      allocate('fireworks', 100)
      allocate('emotes', 50)
    })
    
    // Total usage should be 250 (max)
    let state = useParticleBudgetStore.getState()
    expect(state.getTotalUsage()).toBe(250)
    
    // UI critical should be able to allocate (frees from lower priority)
    act(() => {
      const result = allocate('ui_critical', 30)
      expect(result).toBe(true)
    })
    
    state = useParticleBudgetStore.getState()
    expect(state.usage.ui_critical).toBe(30)
    // Should free from theme (lowest priority)
    expect(state.usage.theme).toBeLessThan(50)
  })

  it('should implement graceful degradation when budget exceeded', () => {
    const allocate = useParticleBudgetStore.getState().allocate
    
    act(() => {
      // Fill up budget
      allocate('theme', 50)
      allocate('drops', 50)
      allocate('fireworks', 100)
      allocate('emotes', 50)
    })
    
    // Try to allocate more fireworks (should free from lower priority)
    act(() => {
      const result = allocate('fireworks', 20)
      // Should succeed by freeing from theme/drops
      expect(result).toBe(true)
    })
    
    const state = useParticleBudgetStore.getState()
    expect(state.usage.fireworks).toBe(120) // Exceeds budget, but freed from others
    expect(state.getTotalUsage()).toBe(250) // Still at max
  })

  it('should calculate available particles correctly', () => {
    const allocate = useParticleBudgetStore.getState().allocate
    const getAvailable = useParticleBudgetStore.getState().getAvailable
    
    act(() => {
      allocate('drops', 30)
    })
    
    const available = getAvailable('drops')
    expect(available).toBe(20) // 50 - 30 = 20
  })

  it('should track total usage across all particle types', () => {
    const allocate = useParticleBudgetStore.getState().allocate
    
    act(() => {
      allocate('fireworks', 50)
      allocate('drops', 30)
      allocate('emotes', 20)
      allocate('emotes_legendary', 10)
      allocate('theme', 15)
    })
    
    const state = useParticleBudgetStore.getState()
    expect(state.getTotalUsage()).toBe(125) // 50 + 30 + 20 + 10 + 15
  })

  it('should reset all usage to zero', () => {
    const allocate = useParticleBudgetStore.getState().allocate
    const reset = useParticleBudgetStore.getState().reset
    
    act(() => {
      allocate('fireworks', 50)
      allocate('drops', 30)
      reset()
    })
    
    const state = useParticleBudgetStore.getState()
    expect(state.getTotalUsage()).toBe(0)
    expect(state.usage.fireworks).toBe(0)
    expect(state.usage.drops).toBe(0)
  })
})

