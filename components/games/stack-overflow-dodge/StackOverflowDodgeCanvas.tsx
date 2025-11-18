"use client"

import { useEffect, useRef } from "react"
import { useThemeStore } from "@/lib/theme-store"
import type { GameState, ErrorType, PowerUpType } from "@/lib/games/stack-overflow-dodge/game-logic"
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_Y,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  ERROR_WIDTH,
  ERROR_HEIGHT,
  POWER_UP_WIDTH,
  POWER_UP_HEIGHT,
} from "@/lib/games/stack-overflow-dodge/game-logic"

interface StackOverflowDodgeCanvasProps {
  gameState: GameState
  onUpdate?: (deltaTime: number) => void
}

export function StackOverflowDodgeCanvas({ gameState, onUpdate }: StackOverflowDodgeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastFrameTimeRef = useRef<number>(0)
  const animationFrameRef = useRef<number>()
  const particleRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; life: number }>>([])

  const { theme: themeId } = useThemeStore()

  // Get theme colors from CSS variables
  const getThemeColors = () => {
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

  // Draw player (pixel character at bottom)
  const drawPlayer = (ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return

    const { player } = gameState
    const x = player.x - PLAYER_WIDTH / 2
    const y = player.y - PLAYER_HEIGHT

    ctx.save()

    // Player base (pixel character)
    ctx.fillStyle = colors.primary
    ctx.strokeStyle = colors.glow
    ctx.lineWidth = 1

    // Character body (simple pixel square with dev touches)
    ctx.fillRect(x, y, PLAYER_WIDTH, PLAYER_HEIGHT)

    // Glasses (dev touch)
    ctx.fillStyle = colors.accent
    ctx.shadowBlur = 4
    ctx.shadowColor = colors.glow
    ctx.fillRect(x + 2, y + 4, 4, 2)
    ctx.fillRect(x + 14, y + 4, 4, 2)
    ctx.shadowBlur = 0

    // Glow effect
    ctx.shadowBlur = 6
    ctx.shadowColor = colors.glow
    ctx.strokeRect(x, y, PLAYER_WIDTH, PLAYER_HEIGHT)
    ctx.shadowBlur = 0

    // Invincibility effect (flashing)
    if (gameState.invincibilityTimer !== null) {
      const flash = Math.floor(Date.now() / 100) % 2
      if (flash === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.fillRect(x, y, PLAYER_WIDTH, PLAYER_HEIGHT)
      }
    }

    ctx.restore()
  }

  // Draw error (falling error message)
  const drawError = (ctx: CanvasRenderingContext2D, error: typeof gameState.errors[0], colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return

    const x = error.x - ERROR_WIDTH / 2
    const y = error.y

    ctx.save()

    // Error color based on theme
    let errorColor = colors.primary
    if (themeId === 'cyber') errorColor = '#7ef9ff' // Cyan
    else if (themeId === 'pixel') errorColor = '#ff6b9d' // Pink
    else if (themeId === 'neon') errorColor = '#a855f7' // Purple
    else if (themeId === 'terminal') errorColor = '#ff4444' // Red
    else if (themeId === 'blueprint') errorColor = '#3b82f6' // Blue

    // Error box (pixel art style)
    ctx.fillStyle = errorColor
    ctx.strokeStyle = colors.glow
    ctx.lineWidth = 2

    // Draw error box
    ctx.fillRect(x, y, ERROR_WIDTH, ERROR_HEIGHT)

    // Neon border
    ctx.shadowBlur = 4
    ctx.shadowColor = colors.glow
    ctx.strokeRect(x, y, ERROR_WIDTH, ERROR_HEIGHT)
    ctx.shadowBlur = 0

    // Error text (short, readable)
    ctx.fillStyle = colors.text
    ctx.font = '10px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Terminal theme: ASCII errors
    if (themeId === 'terminal') {
      ctx.fillText('X', error.x, y + ERROR_HEIGHT / 2)
      ctx.fillText('!!!', error.x, y + ERROR_HEIGHT / 2 + 10)
    } else {
      // Short error text (truncate if too long)
      const errorText = error.type.length > 12 ? error.type.substring(0, 10) + '...' : error.type
      ctx.fillText(errorText, error.x, y + ERROR_HEIGHT / 2)
    }

    ctx.restore()
  }

  // Draw power-up
  const drawPowerUp = (ctx: CanvasRenderingContext2D, powerUp: typeof gameState.powerUps[0], colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return

    const x = powerUp.x - POWER_UP_WIDTH / 2
    const y = powerUp.y

    ctx.save()

    // Power-up color
    let powerUpColor = colors.accent
    if (powerUp.type === 'resolveu') {
      powerUpColor = '#10b981' // Green
    } else if (powerUp.type === 'copiou-do-stackoverflow') {
      powerUpColor = '#3b82f6' // Blue
    }

    // Power-up shape (distinct from errors)
    ctx.fillStyle = powerUpColor
    ctx.strokeStyle = colors.glow
    ctx.lineWidth = 2

    // Draw power-up (diamond shape for distinction)
    ctx.beginPath()
    ctx.moveTo(powerUp.x, y)
    ctx.lineTo(powerUp.x + POWER_UP_WIDTH / 2, y + POWER_UP_HEIGHT / 2)
    ctx.lineTo(powerUp.x, y + POWER_UP_HEIGHT)
    ctx.lineTo(powerUp.x - POWER_UP_WIDTH / 2, y + POWER_UP_HEIGHT / 2)
    ctx.closePath()
    ctx.fill()

    // Glow effect
    ctx.shadowBlur = 6
    ctx.shadowColor = powerUpColor
    ctx.stroke()
    ctx.shadowBlur = 0

    // Power-up label
    ctx.fillStyle = colors.text
    ctx.font = '8px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    if (powerUp.type === 'resolveu') {
      ctx.fillText('!', powerUp.x, y + POWER_UP_HEIGHT / 2)
    } else {
      ctx.fillText('SO', powerUp.x, y + POWER_UP_HEIGHT / 2)
    }

    ctx.restore()
  }

  // Draw particles (small falling particles)
  const drawParticles = (ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return

    ctx.save()

    // Update and draw particles
    particleRef.current = particleRef.current
      .map(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life -= 1

        if (particle.life > 0 && particle.y < GAME_HEIGHT) {
          ctx.fillStyle = colors.glow
          ctx.fillRect(particle.x, particle.y, 2, 2)
        }

        return particle
      })
      .filter(particle => particle.life > 0 && particle.y < GAME_HEIGHT)

    // Spawn new particles occasionally
    if (Math.random() < 0.1 && !gameState.gameOver) {
      particleRef.current.push({
        x: Math.random() * GAME_WIDTH,
        y: -5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: Math.random() * 2 + 1,
        life: 100,
      })
    }

    ctx.restore()
  }

  // Draw background
  const drawBackground = (ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return

    ctx.save()

    // Background
    ctx.fillStyle = colors.bg
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

    // Ground line at bottom
    ctx.strokeStyle = colors.border
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, PLAYER_Y)
    ctx.lineTo(GAME_WIDTH, PLAYER_Y)
    ctx.stroke()

    // Theme-specific effects
    if (themeId === 'cyber' || themeId === 'terminal') {
      // Scanlines
      ctx.strokeStyle = `rgba(126, 249, 255, 0.06)`
      ctx.lineWidth = 1
      for (let y = 0; y < GAME_HEIGHT; y += 4) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(GAME_WIDTH, y)
        ctx.stroke()
      }
    }

    // Chaos mode visual indicator
    if (gameState.chaosMode) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.1)'
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
    }

    ctx.restore()
  }

  // Main render function
  const render = (ctx: CanvasRenderingContext2D) => {
    const colors = getThemeColors()
    if (!colors) return

    // Clear canvas
    ctx.fillStyle = colors.bg
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

    // Draw background
    drawBackground(ctx, colors)

    // Draw particles
    drawParticles(ctx, colors)

    // Draw errors
    gameState.errors.forEach(error => {
      drawError(ctx, error, colors)
    })

    // Draw power-ups
    gameState.powerUps.forEach(powerUp => {
      drawPowerUp(ctx, powerUp, colors)
    })

    // Draw player
    drawPlayer(ctx, colors)

    // Draw slowdown effect (blue glitch/wind)
    if (gameState.slowdownTimer !== null) {
      ctx.save()
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
      ctx.restore()
    }
  }

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = GAME_WIDTH
    canvas.height = GAME_HEIGHT

    // Pixel-perfect rendering for pixel theme
    if (themeId === 'pixel') {
      ctx.imageSmoothingEnabled = false
    }

    let lastTime = performance.now()

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      // Render
      render(ctx)

      // Call onUpdate callback
      if (onUpdate) {
        onUpdate(deltaTime)
      }

      // Continue loop
      if (!gameState.gameOver) {
        animationFrameRef.current = requestAnimationFrame(gameLoop)
      }
    }

    // Start loop
    animationFrameRef.current = requestAnimationFrame(gameLoop)

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameState, onUpdate, themeId])

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (!container) return

      const containerWidth = container.clientWidth
      const scale = Math.min(containerWidth / GAME_WIDTH, 1)

      canvas.style.width = `${GAME_WIDTH * scale}px`
      canvas.style.height = `${GAME_HEIGHT * scale}px`
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="
        border border-border
        rounded-lg
        shadow-glow
        bg-page-secondary
        max-w-full
        h-auto
        block
        mx-auto
      "
      style={{
        imageRendering: themeId === 'pixel' ? 'pixelated' : 'auto',
      }}
    />
  )
}

