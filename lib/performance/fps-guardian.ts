/**
 * FPS Guardian Store
 * 
 * Global state management for FPS monitoring and performance degradation.
 * Implements three-tier system with hysteresis to prevent thrashing:
 * - Level 0 (FPS ≥ 50): Everything enabled
 * - Level 1 (40 ≤ FPS < 50): Smooth degradation
 * - Level 2 (FPS < 40): Aggressive fallback
 */

import { create } from 'zustand'
import { logFPSLow } from './light-logging'

export type FPSLevel = 0 | 1 | 2

interface FPSGuardianStore {
  level: FPSLevel
  currentFPS: number
  averageFPS: number
  fpsHistory: number[]
  setFPS: (fps: number) => void
  calculateLevel: () => FPSLevel
  reset: () => void
}

// Thresholds for FPS levels
const LEVEL_0_THRESHOLD = 50 // FPS ≥ 50: everything enabled
const LEVEL_1_THRESHOLD = 40 // 40 ≤ FPS < 50: smooth degradation
// FPS < 40: Level 2 (aggressive fallback)

// Hysteresis buffer: only change level if average is below/above threshold for 2 seconds
const HYSTERESIS_BUFFER_MS = 2000 // 2 seconds
const FPS_HISTORY_SIZE = 60 // Track last 60 frames
const TARGET_FPS = 60

// Track level change timestamps for hysteresis
let levelChangeTimestamp: number | null = null
let pendingLevel: FPSLevel | null = null

/**
 * Calculate FPS level based on average FPS
 * 
 * @param averageFPS - Average FPS over last 60 frames
 * @returns FPS level (0, 1, or 2)
 */
function calculateFPSLevel(averageFPS: number): FPSLevel {
  if (averageFPS >= LEVEL_0_THRESHOLD) {
    return 0
  } else if (averageFPS >= LEVEL_1_THRESHOLD) {
    return 1
  } else {
    return 2
  }
}

export const useFPSGuardianStore = create<FPSGuardianStore>()((set, get) => ({
  level: 0,
  currentFPS: TARGET_FPS,
  averageFPS: TARGET_FPS,
  fpsHistory: [],
  
  setFPS: (fps: number) => {
    const state = get()
    const newHistory = [...state.fpsHistory, fps]
    
    // Keep only last 60 frames
    if (newHistory.length > FPS_HISTORY_SIZE) {
      newHistory.shift()
    }
    
    // Calculate average
    const average = newHistory.length > 0
      ? newHistory.reduce((a, b) => a + b, 0) / newHistory.length
      : TARGET_FPS
    
    // Calculate new level
    const newLevel = calculateFPSLevel(average)
    
    // Apply hysteresis: only change level if average is below/above threshold for 2 seconds
    const now = Date.now()
    const currentLevel = state.level
    
    if (newLevel !== currentLevel) {
      // Level change detected
      if (pendingLevel === null || pendingLevel !== newLevel) {
        // New pending level - start timer
        pendingLevel = newLevel
        levelChangeTimestamp = now
      } else if (levelChangeTimestamp && (now - levelChangeTimestamp) >= HYSTERESIS_BUFFER_MS) {
        // Pending level has been stable for 2 seconds - apply change
        set({ 
          level: newLevel,
          currentFPS: fps,
          averageFPS: average,
          fpsHistory: newHistory
        })
        // Log FPS low event when transitioning to Level 1 or 2
        if (newLevel > 0 && currentLevel === 0) {
          logFPSLow(newLevel, average)
        }
        pendingLevel = null
        levelChangeTimestamp = null
      } else {
        // Still waiting for hysteresis buffer - update FPS but keep current level
        set({
          currentFPS: fps,
          averageFPS: average,
          fpsHistory: newHistory
        })
      }
    } else {
      // No level change - clear pending
      pendingLevel = null
      levelChangeTimestamp = null
      set({
        currentFPS: fps,
        averageFPS: average,
        fpsHistory: newHistory
      })
    }
  },
  
  calculateLevel: () => {
    const state = get()
    return calculateFPSLevel(state.averageFPS)
  },
  
  reset: () => {
    set({
      level: 0,
      currentFPS: TARGET_FPS,
      averageFPS: TARGET_FPS,
      fpsHistory: []
    })
    pendingLevel = null
    levelChangeTimestamp = null
  }
}))

/**
 * Get current FPS level
 * 
 * @returns Current FPS level (0, 1, or 2)
 */
export function getFPSLevel(): FPSLevel {
  return useFPSGuardianStore.getState().level
}

/**
 * Check if FPS level is at a specific level or higher
 * 
 * @param level - Level to check
 * @returns true if current level is >= specified level
 */
export function isFPSLevelAtLeast(level: FPSLevel): boolean {
  const currentLevel = getFPSLevel()
  return currentLevel <= level // Lower number = better performance
}

/**
 * Check if FPS level is at a specific level or lower
 * 
 * @param level - Level to check
 * @returns true if current level is <= specified level
 */
export function isFPSLevelAtMost(level: FPSLevel): boolean {
  const currentLevel = getFPSLevel()
  return currentLevel >= level // Higher number = worse performance
}

