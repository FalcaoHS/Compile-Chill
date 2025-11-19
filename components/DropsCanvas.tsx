/**
 * DropsCanvas Component
 * 
 * Canvas React component for rendering drops.
 * Integrates with Home physics (DevOrbs).
 */

"use client"

import { useEffect, useRef, useState } from 'react'
import { useDrops } from '@/hooks/useDrops'
import { useThemeStore } from '@/lib/theme-store'
import { useMobileModeStore } from '@/lib/performance/mobile-mode'
import { useFPSGuardianStore } from '@/lib/performance/fps-guardian'
import { useMultiTabStore } from '@/lib/performance/multi-tab'
import { handleCanvasCrash, getRetryDelay, resetCrashState } from '@/lib/performance/canvas-crash-resilience'
import { GrantRewardCallback } from '@/lib/canvas/drops/types'

interface DropsCanvasProps {
  className?: string
  onReward?: (type: string, value: number) => void
  enabled?: boolean
}

/**
 * Calculate canvas dimensions (viewport height - header height)
 * Matches DevOrbsCanvas calculation
 */
function calculateCanvasSize() {
  if (typeof window === 'undefined') return { width: 0, height: 0 }

  const headerHeight = 96 // Approximate header height (pt-24 = 96px)
  const width = window.innerWidth
  const height = window.innerHeight - headerHeight

  return { width, height }
}

export function DropsCanvas({
  className = '',
  onReward,
  enabled = true,
}: DropsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme: themeId } = useThemeStore()
  const { mode: mobileMode, init: initMobileMode } = useMobileModeStore()
  const { level: fpsLevel } = useFPSGuardianStore()
  const shouldPause = useMultiTabStore((state) => state.shouldPause())
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const animationFrameRef = useRef<number>()
  
  // Initialize mobile mode on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      initMobileMode()
    }
  }, [initMobileMode])
  
  // Check if mobile mode (lite) is active
  const isLiteMode = mobileMode === 'lite'
  
  // FPS Guardian: Level 2 disables drops
  const isFPSLevel2 = fpsLevel === 2

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setIsMounted(true)
    const size = calculateCanvasSize()
    if (size.width > 0 && size.height > 0) {
      setCanvasSize(size)
    } else {
      // Retry after a short delay
      setTimeout(() => {
        const retrySize = calculateCanvasSize()
        if (retrySize.width > 0 && retrySize.height > 0) {
          setCanvasSize(retrySize)
        }
      }, 100)
    }
  }, [])

  // Handle window resize
  useEffect(() => {
    if (!isMounted) return

    const handleResize = () => {
      const size = calculateCanvasSize()
      setCanvasSize(size)
    }

    handleResize() // Initial calculation
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMounted])

  // Calculate floor Y position (matches DevOrbsCanvas floor calculation)
  const floorY = canvasSize.height * 0.8 // 80% of canvas height

  // Hook for drops (disabled in mobile lite mode and FPS Level 2)
  const { draw, handleClick, getActiveCount } = useDrops({
    canvasWidth: canvasSize.width,
    canvasHeight: canvasSize.height,
    floorY,
    onReward: onReward
      ? (reward) => onReward(reward.type, reward.value)
      : undefined,
    enabled: enabled && !isLiteMode && !isFPSLevel2 && canvasSize.width > 0 && canvasSize.height > 0,
  })

  // Track active drops count to control pointer events
  const [hasActiveDrop, setHasActiveDrop] = useState(false)

  // Handle click event (only when there's an active drop)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !hasActiveDrop) return

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY

      const clicked = handleClick(x, y)
      
      // If a drop was clicked, prevent event from propagating to DevOrbsCanvas
      if (clicked) {
        e.stopPropagation()
      }
    }

    canvas.addEventListener('click', onClick)

    return () => {
      canvas.removeEventListener('click', onClick)
    }
  }, [handleClick, hasActiveDrop])

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || canvasSize.width === 0 || canvasSize.height === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvasSize.width
    canvas.height = canvasSize.height

    const render = () => {
      // Multi-tab protection: pause if we're not the owner
      if (shouldPause) {
        animationFrameRef.current = requestAnimationFrame(render)
        return
      }
      
      try {
        // Reset crash state on successful render
        resetCrashState()
        
        // In mobile lite mode or FPS Level 2, render static background only
        if (isLiteMode || isFPSLevel2) {
          // Clear canvas with theme background
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          animationFrameRef.current = requestAnimationFrame(render)
          return
        }
        
        // Check for active drops and update pointer events state
        const count = getActiveCount()
        setHasActiveDrop(count > 0)

        // Clear canvas (transparent - drops render on top of DevOrbs)
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Render drops
        draw(ctx)

        animationFrameRef.current = requestAnimationFrame(render)
      } catch (error) {
        
        if (handleCanvasCrash(error as Error, 'DropsCanvas')) {
          setTimeout(() => {
            animationFrameRef.current = requestAnimationFrame(render)
          }, getRetryDelay())
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(render)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [canvasSize, draw, getActiveCount, isLiteMode, isFPSLevel2, fpsLevel, shouldPause])

  // Apply theme to canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    canvas.setAttribute('data-theme', themeId)
  }, [themeId])

  if (!isMounted || canvasSize.width === 0 || canvasSize.height === 0) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        // Only capture pointer events when there's an active drop to click
        // Otherwise, let events pass through to DevOrbsCanvas for drag & drop
        pointerEvents: enabled && hasActiveDrop ? 'auto' : 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10, // Above DevOrbsCanvas (z-index 1 or default)
      }}
    />
  )
}

