/**
 * Emote Loader
 * 
 * Utility to load emote data from JSON and get emote info by ID
 */

// @ts-ignore - JSON import
import emoteData from './emotes-data.json'

export interface EmoteData {
  id: string
  label: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'unique'
  category: string
  description: string
  themeStyle: 'pixel' | 'neon' | 'hacker' | 'mono' | 'glitch'
  ownerXId?: string // For unique emotes - only this X user can use
}

/**
 * Get all emotes
 */
export function getAllEmotes(): EmoteData[] {
  return emoteData as EmoteData[]
}

/**
 * Get emote by ID
 */
export function getEmoteById(id: string): EmoteData | null {
  const data = emoteData as EmoteData[]
  if (!data || data.length === 0) return null
  
  const result = data.find((e) => e.id === id) || null
  if (!result) {
    // Try case-insensitive search as fallback
    return data.find((e) => e.id.toLowerCase() === id.toLowerCase()) || null
  }
  return result
}

/**
 * Get emotes by rarity
 */
export function getEmotesByRarity(rarity: EmoteData['rarity']): EmoteData[] {
  return (emoteData as EmoteData[]).filter((e) => e.rarity === rarity)
}

/**
 * Get emotes by category
 */
export function getEmotesByCategory(category: string): EmoteData[] {
  return (emoteData as EmoteData[]).filter((e) => e.category === category)
}

