/**
 * Crypto Miner Storage
 * 
 * Handles localStorage persistence for game state
 */

import { GameState, createInitialState } from './game-logic'

const STORAGE_KEY = 'crypto-miner-save'
const STORAGE_VERSION = 1

interface StoredData {
  version: number
  state: GameState
}

/**
 * Save game state to localStorage
 */
export function saveGameState(state: GameState): boolean {
  try {
    const data: StoredData = {
      version: STORAGE_VERSION,
      state: {
        ...state,
        lastSaveTime: Date.now()
      }
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Failed to save game state:', error)
    return false
  }
}

/**
 * Load game state from localStorage
 */
export function loadGameState(): GameState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    
    if (!stored) {
      return null
    }
    
    const data: StoredData = JSON.parse(stored)
    
    // Version check for future migrations
    if (data.version !== STORAGE_VERSION) {
      console.warn('Storage version mismatch, resetting game state')
      return null
    }
    
    return data.state
  } catch (error) {
    console.error('Failed to load game state:', error)
    return null
  }
}

/**
 * Clear saved game state
 */
export function clearGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear game state:', error)
  }
}

/**
 * Check if saved game exists
 */
export function hasSavedGame(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null
  } catch {
    return false
  }
}

