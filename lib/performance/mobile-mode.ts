/**
 * Mobile Mode Store
 * 
 * Global state management for mobile safety mode (Lite Mode).
 * Automatically activates when mobile device is detected or window width < 768px.
 * Disables heavy effects (physics, DevOrbs, drops, fireworks) while keeping UI elements active.
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type MobileMode = 'lite' | 'full'

interface MobileModeStore {
  mode: MobileMode
  isMobile: boolean
  setMode: (mode: MobileMode) => void
  setIsMobile: (isMobile: boolean) => void
  init: () => void
}

/**
 * Detect if device is mobile
 * 
 * @returns true if mobile device detected
 */
function detectMobileDevice(): boolean {
  if (typeof window === "undefined") return false
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768
}

/**
 * Get mobile mode based on device detection
 * 
 * @returns 'lite' if mobile, 'full' otherwise
 */
function getMobileMode(): MobileMode {
  return detectMobileDevice() ? 'lite' : 'full'
}

export const useMobileModeStore = create<MobileModeStore>()(
  persist(
    (set, get) => ({
      mode: 'full',
      isMobile: false,
      
      setMode: (mode: MobileMode) => {
        set({ mode })
      },
      
      setIsMobile: (isMobile: boolean) => {
        set({ isMobile, mode: isMobile ? 'lite' : 'full' })
      },
      
      init: () => {
        // Initialize mobile mode on mount
        const isMobile = detectMobileDevice()
        const mode = getMobileMode()
        set({ isMobile, mode })
        
        // Listen for window resize to update mode (only add listener once)
        if (typeof window !== "undefined" && !(window as any).__mobileModeResizeListener) {
          let resizeTimeout: NodeJS.Timeout | null = null
          
          const handleResize = () => {
            // Debounce resize events (100ms)
            if (resizeTimeout) {
              clearTimeout(resizeTimeout)
            }
            
            resizeTimeout = setTimeout(() => {
              const newIsMobile = detectMobileDevice()
              const newMode = getMobileMode()
              set({ isMobile: newIsMobile, mode: newMode })
              resizeTimeout = null
            }, 100)
          }
          
          window.addEventListener('resize', handleResize)
          // Mark that listener is added
          ;(window as any).__mobileModeResizeListener = handleResize
        }
      },
    }),
    {
      name: 'mobile-mode-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist isMobile flag, mode is calculated
      partialize: (state) => ({ isMobile: state.isMobile }),
    }
  )
)

/**
 * Get current mobile mode
 * 
 * @returns Current mobile mode ('lite' | 'full')
 */
export function getMobileModeState(): MobileMode {
  if (typeof window === "undefined") return 'full'
  return useMobileModeStore.getState().mode
}

/**
 * Check if mobile mode is active
 * 
 * @returns true if mobile mode (lite) is active
 */
export function isMobileModeActive(): boolean {
  return getMobileModeState() === 'lite'
}

