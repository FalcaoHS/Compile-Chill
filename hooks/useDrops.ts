/**
 * useDrops Hook
 * 
 * React hook for managing drops system
 */

import { useEffect, useRef, useCallback } from 'react'
import { useThemeStore } from '@/lib/theme-store'
import { DropManager } from '@/lib/canvas/drops/DropManager'
import {
  DropManagerConfig,
  GrantRewardCallback,
} from '@/lib/canvas/drops/types'

/**
 * Theme colors interface (matches DevOrbsCanvas pattern)
 */
interface ThemeColors {
  primary: string
  accent: string
  text: string
  glow: string
  bg: string
  bgSecondary: string
  border: string
}

interface UseDropsOptions {
  canvasWidth: number
  canvasHeight: number
  floorY: number
  onReward?: GrantRewardCallback
  enabled?: boolean
}

/**
 * Get theme colors from CSS variables (matches DevOrbsCanvas pattern)
 */
function getCurrentThemeColors(): ThemeColors | null {
  if (typeof window === 'undefined') return null

  const root = document.documentElement
  const computedStyle = getComputedStyle(root)

  return {
    primary: computedStyle.getPropertyValue('--color-primary').trim(),
    accent: computedStyle.getPropertyValue('--color-accent').trim(),
    text: computedStyle.getPropertyValue('--color-text').trim(),
    glow: computedStyle.getPropertyValue('--color-glow').trim(),
    bg: computedStyle.getPropertyValue('--color-bg').trim(),
    bgSecondary: computedStyle.getPropertyValue('--color-bg-secondary').trim(),
    border: computedStyle.getPropertyValue('--color-border').trim(),
  }
}

export function useDrops({
  canvasWidth,
  canvasHeight,
  floorY,
  onReward,
  enabled = true,
}: UseDropsOptions) {
  const { theme: themeId } = useThemeStore()
  const managerRef = useRef<DropManager | null>(null)
  const animationFrameRef = useRef<number>()
  const lastFrameTimeRef = useRef<number>(Date.now())

  // Initialize manager
  useEffect(() => {
    if (!enabled || canvasWidth === 0 || canvasHeight === 0) return

    const config: DropManagerConfig = {
      spawnInterval: { min: 40000, max: 90000 }, // 40-90s
      maxActiveDrops: 1,
      timeout: 12000, // 12s
      canvasWidth,
      canvasHeight,
      floorY,
    }

    const grantReward: GrantRewardCallback = (reward) => {
      if (onReward) {
        onReward(reward)
      }
    }

    const getThemeColors = () => getCurrentThemeColors()

    managerRef.current = new DropManager(config, grantReward, getThemeColors)

    return () => {
      if (managerRef.current) {
        managerRef.current.clear()
        managerRef.current = null
      }
    }
  }, [canvasWidth, canvasHeight, floorY, enabled, onReward])

  // Animation loop
  useEffect(() => {
    if (!enabled || !managerRef.current) return

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTimeRef.current
      lastFrameTimeRef.current = currentTime

      if (managerRef.current) {
        managerRef.current.update(deltaTime)
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [enabled])

  // Render drops
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (managerRef.current) {
        managerRef.current.draw(ctx)
      }
    },
    []
  )

  // Handle click
  const handleClick = useCallback(
    (x: number, y: number): boolean => {
      if (managerRef.current) {
        return managerRef.current.handleClick(x, y)
      }
      return false
    },
    []
  )

  // Get active count
  const getActiveCount = useCallback(() => {
    return managerRef.current?.getActiveCount() || 0
  }, [])

  return {
    draw,
    handleClick,
    getActiveCount,
  }
}

