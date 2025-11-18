/**
 * DropsCanvas Component
 * 
 * Canvas React para renderizar drops.
 * Integra com física da Home (DevOrbs).
 */

"use client"

import { useEffect, useRef, useState } from 'react'
import { useDrops } from '../hooks/useDrops'
import type { Reward } from '@/lib/canvas/drops/types'

interface DropsCanvasProps {
  className?: string
  onReward?: (type: string, value: number) => void
  enabled?: boolean
}

export function DropsCanvas({
  className = '',
  onReward,
  enabled = true,
}: DropsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const animationFrameRef = useRef<number>()

  // Calcular tamanho do canvas
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement
        if (container) {
          setCanvasSize({
            width: container.clientWidth,
            height: container.clientHeight,
          })
        }
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Calcular posição do chão (mesmo que DevOrbs)
  const floorY = canvasSize.height * 0.8 // 80% da altura

  // Hook de drops
  const { draw, handleClick } = useDrops({
    canvasWidth: canvasSize.width,
    canvasHeight: canvasSize.height,
    floorY,
    onReward: onReward
      ? (reward: Reward) => onReward(reward.type, reward.value)
      : undefined,
    enabled: enabled && canvasSize.width > 0 && canvasSize.height > 0,
  })

  // Handler de clique
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      handleClick(x, y)
    }

    canvas.addEventListener('click', onClick)

    return () => {
      canvas.removeEventListener('click', onClick)
    }
  }, [handleClick])

  // Loop de renderização
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || canvasSize.width === 0 || canvasSize.height === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvasSize.width
    canvas.height = canvasSize.height

    const render = () => {
      // Limpar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Renderizar drops
      draw(ctx)

      animationFrameRef.current = requestAnimationFrame(render)
    }

    animationFrameRef.current = requestAnimationFrame(render)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [canvasSize, draw])

  if (canvasSize.width === 0 || canvasSize.height === 0) {
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
        pointerEvents: enabled ? 'auto' : 'none',
      }}
    />
  )
}

