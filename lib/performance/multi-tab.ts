/**
 * Multi-Tab Protection System
 * 
 * Coordinates canvas animations and physics across multiple tabs to prevent
 * CPU overload. Only the active tab runs animations/physics.
 * 
 * Features:
 * - BroadcastChannel for cross-tab communication
 * - Ownership model (active tab = owner)
 * - Page Visibility API integration
 * - Atomic ownership transfer
 */

import { create } from 'zustand'

export type TabOwnershipState = 'owner' | 'paused' | 'requesting'

interface MultiTabStore {
  isOwner: boolean
  isVisible: boolean
  ownershipState: TabOwnershipState
  setOwner: (isOwner: boolean) => void
  setVisible: (isVisible: boolean) => void
  setOwnershipState: (state: TabOwnershipState) => void
  shouldPause: () => boolean
}

const CHANNEL_NAME = 'canvas_control'
const OWNERSHIP_TIMEOUT = 1000 // 1 second timeout for ownership requests

let channel: BroadcastChannel | null = null
let ownershipTimeout: NodeJS.Timeout | null = null
let isInitialized = false

export const useMultiTabStore = create<MultiTabStore>()((set, get) => ({
  isOwner: false,
  isVisible: typeof document !== 'undefined' ? !document.hidden : true,
  ownershipState: 'paused',
  
  setOwner: (isOwner: boolean) => {
    set({ isOwner, ownershipState: isOwner ? 'owner' : 'paused' })
  },
  
  setVisible: (isVisible: boolean) => {
    set({ isVisible })
    // If tab becomes visible and we're not owner, request ownership
    if (isVisible && !get().isOwner) {
      requestOwnership()
    }
    // If tab becomes hidden and we're owner, relinquish ownership
    else if (!isVisible && get().isOwner) {
      relinquishOwnership()
    }
  },
  
  setOwnershipState: (state: TabOwnershipState) => {
    set({ ownershipState: state, isOwner: state === 'owner' })
  },
  
  shouldPause: () => {
    const state = get()
    // Pause if we're not the owner OR if tab is not visible
    return !state.isOwner || !state.isVisible
  },
}))

/**
 * Initialize multi-tab protection system
 */
export function initMultiTabProtection(): void {
  if (isInitialized || typeof window === 'undefined') return
  
  // Create BroadcastChannel
  try {
    channel = new BroadcastChannel(CHANNEL_NAME)
    isInitialized = true
    
    // Listen for messages
    channel.onmessage = (event) => {
      handleChannelMessage(event.data)
    }
    
    // Initialize Page Visibility API
    initPageVisibility()
    
    // Request ownership if tab is visible
    if (!document.hidden) {
      requestOwnership()
    }
  } catch (error) {
    
  }
}

/**
 * Initialize Page Visibility API listener
 */
function initPageVisibility(): void {
  if (typeof document === 'undefined') return
  
  const handleVisibilityChange = () => {
    const isVisible = !document.hidden
    useMultiTabStore.getState().setVisible(isVisible)
  }
  
  document.addEventListener('visibilitychange', handleVisibilityChange)
  
  // Initial state
  handleVisibilityChange()
}

/**
 * Handle messages from BroadcastChannel
 */
function handleChannelMessage(data: any): void {
  const { type, tabId } = data
  
  switch (type) {
    case 'relinquish':
      // Owner is relinquishing, we can request ownership if visible
      if (useMultiTabStore.getState().isVisible) {
        requestOwnership()
      }
      break
      
    case 'ownership_granted':
      // We've been granted ownership
      if (data.tabId === getTabId()) {
        useMultiTabStore.getState().setOwnershipState('owner')
        if (ownershipTimeout) {
          clearTimeout(ownershipTimeout)
          ownershipTimeout = null
        }
      } else {
        // Another tab got ownership, we should pause
        useMultiTabStore.getState().setOwnershipState('paused')
      }
      break
      
    case 'request_ownership':
      // Another tab is requesting ownership
      if (useMultiTabStore.getState().isOwner && data.tabId !== getTabId()) {
        // We're the current owner, check if we should relinquish
        if (!useMultiTabStore.getState().isVisible) {
          // We're not visible, relinquish to the requesting tab
          relinquishOwnership()
          // Grant ownership to the requesting tab
          sendMessage({ type: 'ownership_granted', tabId: data.tabId })
        }
      }
      break
  }
}

/**
 * Request ownership of canvas control
 */
function requestOwnership(): void {
  if (!channel || !useMultiTabStore.getState().isVisible) return
  
  const currentState = useMultiTabStore.getState()
  
  // If we're already owner, no need to request
  if (currentState.isOwner) return
  
  // Set state to requesting
  useMultiTabStore.getState().setOwnershipState('requesting')
  
  // Send request
  sendMessage({ type: 'request_ownership', tabId: getTabId() })
  
  // Set timeout - if no response, assume ownership
  if (ownershipTimeout) {
    clearTimeout(ownershipTimeout)
  }
  
  ownershipTimeout = setTimeout(() => {
    // No response, assume we're the only tab or owner didn't respond
    useMultiTabStore.getState().setOwnershipState('owner')
    ownershipTimeout = null
  }, OWNERSHIP_TIMEOUT)
}

/**
 * Relinquish ownership of canvas control
 */
function relinquishOwnership(): void {
  if (!channel) return
  
  const currentState = useMultiTabStore.getState()
  
  if (!currentState.isOwner) return
  
  // Send relinquish message
  sendMessage({ type: 'relinquish', tabId: getTabId() })
  
  // Update state
  useMultiTabStore.getState().setOwnershipState('paused')
}

/**
 * Send message via BroadcastChannel
 */
function sendMessage(data: any): void {
  if (!channel) return
  
  try {
    channel.postMessage({
      ...data,
      timestamp: Date.now(),
    })
  } catch (error) {
    
  }
}

/**
 * Get unique tab ID
 */
function getTabId(): string {
  if (typeof window === 'undefined') return 'unknown'
  
  // Use sessionStorage to persist tab ID across page reloads
  let tabId = sessionStorage.getItem('tabId')
  if (!tabId) {
    tabId = `tab-${Date.now()}-${Math.random()}`
    sessionStorage.setItem('tabId', tabId)
  }
  return tabId
}

/**
 * Check if current tab should pause animations
 */
export function shouldPauseAnimations(): boolean {
  return useMultiTabStore.getState().shouldPause()
}

/**
 * Get current ownership state
 */
export function getOwnershipState(): TabOwnershipState {
  return useMultiTabStore.getState().ownershipState
}

/**
 * Check if current tab is owner
 */
export function isTabOwner(): boolean {
  return useMultiTabStore.getState().isOwner
}

/**
 * Cleanup multi-tab protection
 */
export function cleanupMultiTabProtection(): void {
  if (ownershipTimeout) {
    clearTimeout(ownershipTimeout)
    ownershipTimeout = null
  }
  
  if (channel) {
    channel.close()
    channel = null
  }
  
  isInitialized = false
}

