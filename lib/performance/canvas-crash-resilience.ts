/**
 * Canvas Crash Resilience System
 * 
 * Handles canvas errors gracefully with retry logic and static fallback.
 */

export interface CanvasCrashState {
  crashCount: number
  lastCrashTime: number
  isInFallback: boolean
  errorMessage: string | null
}

const MAX_RETRIES = 3
const BACKOFF_DELAYS = [1000, 2000, 4000] // 1s, 2s, 4s

let crashState: CanvasCrashState = {
  crashCount: 0,
  lastCrashTime: 0,
  isInFallback: false,
  errorMessage: null,
}

/**
 * Handle canvas crash
 */
export function handleCanvasCrash(error: Error, componentName: string): boolean {
  const now = Date.now()
  crashState.crashCount++
  crashState.lastCrashTime = now
  crashState.errorMessage = error.message

  // Log crash event
  logCanvasCrash(error, componentName)

  // Check if we should enter fallback mode
  if (crashState.crashCount >= MAX_RETRIES) {
    crashState.isInFallback = true
    return false // Don't retry, use fallback
  }

  return true // Retry
}

/**
 * Get retry delay based on crash count
 */
export function getRetryDelay(): number {
  const index = Math.min(crashState.crashCount - 1, BACKOFF_DELAYS.length - 1)
  return BACKOFF_DELAYS[index] || 1000
}

/**
 * Reset crash state (after successful render)
 */
export function resetCrashState(): void {
  crashState = {
    crashCount: 0,
    lastCrashTime: 0,
    isInFallback: false,
    errorMessage: null,
  }
}

/**
 * Get current crash state
 */
export function getCrashState(): CanvasCrashState {
  return { ...crashState }
}

/**
 * Force reset (for manual restart button)
 */
export function forceReset(): void {
  resetCrashState()
}

/**
 * Check if in fallback mode
 */
export function isInFallback(): boolean {
  return crashState.isInFallback
}

/**
 * Log canvas crash event
 */
function logCanvasCrash(error: Error, componentName: string): void {
  const { logCanvasCrash: logCrash } = require('./light-logging')
  logCrash(componentName, error, crashState.crashCount)
}

