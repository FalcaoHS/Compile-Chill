/**
 * EmoteBubble Component
 * 
 * Canvas React component for rendering emotes.
 * Prepared for future chat and multiplayer integration.
 */

"use client"

import { useEffect, useRef, useState } from 'react'
import { useEmotes } from '@/hooks/useEmotes'
import { useThemeStore } from '@/lib/theme-store'
import { useMobileModeStore } from '@/lib/performance/mobile-mode'
import { useFPSGuardianStore } from '@/lib/performance/fps-guardian'
import { useMultiTabStore } from '@/lib/performance/multi-tab'
import { handleCanvasCrash, getRetryDelay, resetCrashState } from '@/lib/performance/canvas-crash-resilience'
import { EMOTE_TEXT_MAP } from '@/lib/canvas/emotes/emote-types'

interface EmoteBubbleProps {
  className?: string
  enabled?: boolean
  onReady?: (spawnEmote: (type: string, x: number, y: number) => void) => void
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

export function EmoteBubble({
  className = '',
  enabled = true,
  onReady,
}: EmoteBubbleProps) {
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
  
  // FPS Guardian: Level 2 disables emotes
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

  // Hook for emotes (disabled in mobile lite mode and FPS Level 2)
  const { draw, spawnChat, spawnEmote } = useEmotes({
    canvasWidth: canvasSize.width,
    canvasHeight: canvasSize.height,
    enabled: enabled && !isLiteMode && !isFPSLevel2 && canvasSize.width > 0 && canvasSize.height > 0,
  })

  // Expose spawn function to parent
  useEffect(() => {
    if (onReady && canvasSize.width > 0 && canvasSize.height > 0 && spawnEmote) {
      onReady((typeOrId: string, x: number, y: number) => {
        // Always use spawnEmote (it handles both types and IDs)
        if (spawnEmote) {
          spawnEmote(typeOrId, x, y)
        }
      })
    }
  }, [onReady, spawnEmote, canvasSize])

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
        
        // Clear canvas (transparent - emotes render on top of other layers)
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Render emotes
        draw(ctx)

        animationFrameRef.current = requestAnimationFrame(render)
      } catch (error) {
        
        if (handleCanvasCrash(error as Error, 'EmoteBubble')) {
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
  }, [canvasSize, draw, isLiteMode, isFPSLevel2, fpsLevel, shouldPause])

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
        pointerEvents: 'none', // Emotes don't capture pointer events
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 20, // Above DropsCanvas (z-index 10) and DevOrbsCanvas
      }}
    />
  )
}

