/**
 * HackerCanvas
 * 
 * Canvas para fundo animado do Hacker Panel.
 * Renderiza scanlines, glitch e borda neon.
 */

"use client"

import { useEffect, useRef, forwardRef } from 'react'
import { ThemeId } from '../interfaces'
import { getThemeColors } from '../theme-utils'

interface HackerCanvasProps {
  theme: ThemeId
  className?: string
}

export const HackerCanvas = forwardRef<HTMLCanvasElement, HackerCanvasProps>(
  ({ theme, className }, ref) => {
    const animationFrameRef = useRef<number>()
    const scanlineOffsetRef = useRef<number>(0)
    const glitchOffsetRef = useRef<number>(0)

    useEffect(() => {
      const canvas = typeof ref === 'object' && ref?.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Obter dimensões do container
      const updateSize = () => {
        const container = canvas.parentElement
        if (container) {
          canvas.width = container.clientWidth
          canvas.height = container.clientHeight
        }
      }

      updateSize()
      window.addEventListener('resize', updateSize)

      const themeColors = getThemeColors(theme)

      const render = () => {
        if (!ctx) return

        const width = canvas.width
        const height = canvas.height

        // Limpar canvas
        ctx.clearRect(0, 0, width, height)

        // Fundo gradiente
        const gradient = ctx.createLinearGradient(0, 0, 0, height)
        gradient.addColorStop(0, themeColors.bg)
        gradient.addColorStop(1, themeColors.bgSecondary)
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)

        // Scanlines
        ctx.strokeStyle = themeColors.primary
        ctx.globalAlpha = 0.06
        ctx.lineWidth = 1

        const scanlineSpacing = 4
        scanlineOffsetRef.current += 0.5

        for (
          let y = (scanlineOffsetRef.current % scanlineSpacing) - scanlineSpacing;
          y < height;
          y += scanlineSpacing
        ) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(width, y)
          ctx.stroke()
        }

        ctx.globalAlpha = 1

        // Glitch effect (duplicação com offset)
        glitchOffsetRef.current = (glitchOffsetRef.current + 1) % 60

        if (glitchOffsetRef.current < 3) {
          ctx.save()
          ctx.globalAlpha = 0.3
          ctx.fillStyle = themeColors.accent
          ctx.fillRect(0, 0, width, height)
          ctx.restore()
        }

        // Borda neon
        ctx.strokeStyle = themeColors.primary
        ctx.lineWidth = 2
        ctx.shadowBlur = 8
        ctx.shadowColor = themeColors.primary
        ctx.strokeRect(1, 1, width - 2, height - 2)

        ctx.shadowBlur = 0

        animationFrameRef.current = requestAnimationFrame(render)
      }

      render()

      return () => {
        window.removeEventListener('resize', updateSize)
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }, [theme, ref])

    return (
      <canvas
        ref={ref}
        className={className}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    )
  }
)

HackerCanvas.displayName = 'HackerCanvas'

