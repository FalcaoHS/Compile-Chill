/**
 * Mobile Mode Initializer
 * 
 * Client component that initializes mobile mode detection on mount.
 * This ensures mobile mode is set up before any canvas components try to use it.
 */

"use client"

import { useEffect } from 'react'
import { useMobileModeStore } from '@/lib/performance/mobile-mode'

export function MobileModeInitializer() {
  const { init } = useMobileModeStore()

  useEffect(() => {
    // Initialize mobile mode detection on mount
    init()
  }, [init])

  // This component doesn't render anything
  return null
}

