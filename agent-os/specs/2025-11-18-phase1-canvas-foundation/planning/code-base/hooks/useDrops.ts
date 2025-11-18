/**
 * useDrops Hook
 * 
 * Hook React para gerenciar sistema de drops.
 */

import { useEffect, useRef, useCallback } from 'react'
import { useThemeStore } from '@/lib/theme-store'
import { DropManager } from '../drops/DropManager'
import { DropManagerConfig, GrantRewardCallback } from '../interfaces'
import { getCurrentThemeColors } from '../theme-utils'

interface UseDropsOptions {
  canvasWidth: number
  canvasHeight: number
  floorY: number
  onReward?: GrantRewardCallback
  enabled?: boolean
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

  // Inicializar manager
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

  // Loop de animação
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

  // Renderizar drops
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (managerRef.current) {
        managerRef.current.draw(ctx)
      }
    },
    []
  )

  // Handler de clique
  const handleClick = useCallback(
    (x: number, y: number): boolean => {
      if (managerRef.current) {
        return managerRef.current.handleClick(x, y)
      }
      return false
    },
    []
  )

  // Obter número de drops ativos
  const getActiveCount = useCallback(() => {
    return managerRef.current?.getActiveCount() || 0
  }, [])

  return {
    draw,
    handleClick,
    getActiveCount,
  }
}

