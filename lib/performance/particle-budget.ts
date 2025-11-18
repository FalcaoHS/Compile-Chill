/**
 * Global Particle Budget System
 * 
 * Manages global particle budget (250 total) across all systems:
 * - Fireworks: 100 particles
 * - Drops: 50 particles
 * - Emotes: 50 particles
 * - Theme: 50 particles
 * 
 * Priority order (high to low):
 * 1. UI critical (score effects) - never reduced
 * 2. Legendary emotes - high priority, reduce only if necessary
 * 3. Fireworks - medium priority
 * 4. Drops - lower priority
 * 5. Theme particles - lowest priority, reduce first
 */

import { create } from 'zustand'

export type ParticleType = 'fireworks' | 'drops' | 'emotes' | 'emotes_legendary' | 'theme' | 'ui_critical'

interface ParticleBudget {
  fireworks: number
  drops: number
  emotes: number
  emotes_legendary: number
  theme: number
  ui_critical: number
}

interface ParticleUsage {
  fireworks: number
  drops: number
  emotes: number
  emotes_legendary: number
  theme: number
  ui_critical: number
}

interface ParticleBudgetStore {
  budget: ParticleBudget
  usage: ParticleUsage
  setUsage: (type: ParticleType, count: number) => void
  canAllocate: (type: ParticleType, count: number) => boolean
  allocate: (type: ParticleType, count: number) => boolean
  deallocate: (type: ParticleType, count: number) => void
  getAvailable: (type: ParticleType) => number
  getTotalUsage: () => number
  reset: () => void
}

// Total particle budget
const MAX_PARTICLES = 250

// Default budget allocation
const DEFAULT_BUDGET: ParticleBudget = {
  fireworks: 100,
  drops: 50,
  emotes: 50,
  emotes_legendary: 50, // Shared with emotes, but higher priority
  theme: 50,
  ui_critical: 0, // Dynamic, takes from available budget
}

// Priority order (higher number = lower priority, gets reduced first)
const PRIORITY: Record<ParticleType, number> = {
  ui_critical: 1,        // Highest priority - never reduced
  emotes_legendary: 2,   // High priority - reduce only if necessary
  fireworks: 3,          // Medium priority
  drops: 4,              // Lower priority
  emotes: 5,             // Lower priority (regular emotes)
  theme: 6,              // Lowest priority - reduce first
}

export const useParticleBudgetStore = create<ParticleBudgetStore>()((set, get) => ({
  budget: { ...DEFAULT_BUDGET },
  usage: {
    fireworks: 0,
    drops: 0,
    emotes: 0,
    emotes_legendary: 0,
    theme: 0,
    ui_critical: 0,
  },
  
  setUsage: (type: ParticleType, count: number) => {
    const state = get()
    set({
      usage: {
        ...state.usage,
        [type]: Math.max(0, count),
      }
    })
  },
  
  canAllocate: (type: ParticleType, count: number): boolean => {
    const state = get()
    const available = state.budget[type] - state.usage[type]
    
    // UI critical and legendary emotes can always allocate (they have priority)
    if (type === 'ui_critical' || type === 'emotes_legendary') {
      // Check if we can free up space from lower priority types
      const totalUsage = get().getTotalUsage()
      const availableFromOthers = MAX_PARTICLES - totalUsage
      return availableFromOthers >= count
    }
    
    // For other types, check available budget
    return available >= count
  },
  
  allocate: (type: ParticleType, count: number): boolean => {
    const state = get()
    
    // Check if we can allocate
    if (!state.canAllocate(type, count)) {
      // Try graceful degradation for lower priority types
      if (type !== 'ui_critical' && type !== 'emotes_legendary') {
        // Reduce lower priority particles to make room
        const freed = freeBudgetInternal(count, type, state)
        if (freed < count) {
          return false // Couldn't free enough space
        }
      } else {
        // For high priority, try to free from lower priority types
        const freed = freeBudgetInternal(count, type, state)
        if (freed < count) {
          return false // Couldn't free enough space
        }
      }
    }
    
    // Allocate particles
    const currentUsage = state.usage[type]
    set({
      usage: {
        ...state.usage,
        [type]: currentUsage + count,
      }
    })
    
    return true
  },
  
  deallocate: (type: ParticleType, count: number) => {
    const state = get()
    const currentUsage = state.usage[type]
    set({
      usage: {
        ...state.usage,
        [type]: Math.max(0, currentUsage - count),
      }
    })
  },
  
  getAvailable: (type: ParticleType): number => {
    const state = get()
    const budget = state.budget[type]
    const usage = state.usage[type]
    return Math.max(0, budget - usage)
  },
  
  getTotalUsage: (): number => {
    const state = get()
    return (
      state.usage.fireworks +
      state.usage.drops +
      state.usage.emotes +
      state.usage.emotes_legendary +
      state.usage.theme +
      state.usage.ui_critical
    )
  },
  
  reset: () => {
    set({
      budget: { ...DEFAULT_BUDGET },
      usage: {
        fireworks: 0,
        drops: 0,
        emotes: 0,
        emotes_legendary: 0,
        theme: 0,
        ui_critical: 0,
      }
    })
  },
}))

/**
 * Helper function to free budget from lower priority types
 */
function freeBudgetInternal(
  needed: number,
  requestingType: ParticleType,
  state: ParticleBudgetStore
): number {
  const requestingPriority = PRIORITY[requestingType]
  let freed = 0
  
  // Free from types with lower priority (higher priority number)
  const typesToReduce: ParticleType[] = ['theme', 'drops', 'emotes', 'fireworks']
  
  for (const type of typesToReduce) {
    if (freed >= needed) break
    if (PRIORITY[type] > requestingPriority && state.usage[type] > 0) {
      const toFree = Math.min(state.usage[type], needed - freed)
      state.deallocate(type, toFree)
      freed += toFree
    }
  }
  
  return freed
}

/**
 * Get current particle budget state
 */
export function getParticleBudget() {
  return useParticleBudgetStore.getState()
}

/**
 * Check if particles can be allocated for a type
 */
export function canAllocateParticles(type: ParticleType, count: number): boolean {
  return useParticleBudgetStore.getState().canAllocate(type, count)
}

/**
 * Allocate particles (returns true if successful)
 */
export function allocateParticles(type: ParticleType, count: number): boolean {
  return useParticleBudgetStore.getState().allocate(type, count)
}

/**
 * Deallocate particles
 */
export function deallocateParticles(type: ParticleType, count: number): void {
  useParticleBudgetStore.getState().deallocate(type, count)
}

/**
 * Get available particles for a type
 */
export function getAvailableParticles(type: ParticleType): number {
  return useParticleBudgetStore.getState().getAvailable(type)
}

/**
 * Get total particle usage
 */
export function getTotalParticleUsage(): number {
  return useParticleBudgetStore.getState().getTotalUsage()
}

