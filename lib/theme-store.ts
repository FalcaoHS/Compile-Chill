/**
 * Zustand store for theme management
 * 
 * Handles theme state, persistence, and CSS variable application
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { THEMES, type ThemeId, isValidTheme } from './themes'

interface ThemeStore {
  theme: ThemeId
  setTheme: (theme: ThemeId) => void
  init: () => void
  syncWithDatabase: (theme: ThemeId) => Promise<void>
}

// Debounce function for API calls
let syncTimeout: NodeJS.Timeout | null = null

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'cyber',
      
      setTheme: (themeId: ThemeId) => {
        if (!isValidTheme(themeId)) {
          console.warn(`Invalid theme: ${themeId}`)
          return
        }

        set({ theme: themeId })
        
        // Apply CSS variables to document root
        const theme = THEMES[themeId]
        Object.entries(theme.vars).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value)
        })
        
        // Set data-theme attribute
        document.documentElement.setAttribute('data-theme', themeId)
        
        // Note: Database sync is handled by ThemeSwitcher component
        // which has access to session via useSession hook
      },
      
      init: () => {
        // Initialize theme from store (persisted in localStorage)
        const currentTheme = get().theme
        const theme = THEMES[currentTheme]
        
        // Apply CSS variables
        Object.entries(theme.vars).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value)
        })
        
        // Set data-theme attribute
        document.documentElement.setAttribute('data-theme', currentTheme)
      },
      
      syncWithDatabase: async (themeId: ThemeId) => {
        // Debounce API calls
        if (syncTimeout) {
          clearTimeout(syncTimeout)
        }
        
        syncTimeout = setTimeout(async () => {
          try {
            const response = await fetch('/api/users/me/theme', {
              method: 'PATCH',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ theme: themeId }),
            })
            
            if (!response.ok) {
              console.error('Failed to sync theme with database')
            }
          } catch (error) {
            console.error('Error syncing theme:', error)
          }
        }, 500) // 500ms debounce
      },
    }),
    {
      name: 'theme-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
)

