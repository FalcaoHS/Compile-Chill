"use client"

import { useEffect, useRef, useState } from "react"
import { useThemeStore } from "@/lib/theme-store"
import type { GameState } from "@/lib/games/bit-runner/game-logic"
import { GAME_WIDTH, GAME_HEIGHT, GROUND_Y, CHARACTER_WIDTH, CHARACTER_HEIGHT, CHARACTER_RUNNING_Y, CHARACTER_DUCKING_HEIGHT } from "@/lib/games/bit-runner/game-logic"
import { OBSTACLE_DEFINITIONS, type ObstacleType } from "@/lib/games/bit-runner/obstacles"

interface BitRunnerCanvasProps {
  gameState: GameState
  onUpdate?: (deltaTime: number) => void
}

export function BitRunnerCanvas({ gameState, onUpdate }: BitRunnerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastFrameTimeRef = useRef<number>(0)
  const animationFrameRef = useRef<number>()
  const groundOffsetRef = useRef<number>(0)
  
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

  // Draw character (pixel art style)
  const drawCharacter = (ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return

    const { character } = gameState
    const x = character.x
    const y = character.y

    ctx.save()

    // Character base (silhouette with dev touches)
    ctx.fillStyle = colors.primary
    ctx.strokeStyle = colors.glow
    ctx.lineWidth = 1

    if (character.state === 'ducking') {
      // Ducking: compressed character
      ctx.fillRect(x, y, CHARACTER_WIDTH, CHARACTER_DUCKING_HEIGHT)
      // Glasses (dev touch)
      ctx.fillStyle = colors.accent
      ctx.fillRect(x + 2, y + 2, 4, 2)
      ctx.fillRect(x + 10, y + 2, 4, 2)
    } else if (character.state === 'jumping') {
      // Jumping: character in air
      ctx.fillRect(x, y, CHARACTER_WIDTH, CHARACTER_HEIGHT)
      // Glasses
      ctx.fillStyle = colors.accent
      ctx.fillRect(x + 2, y + 4, 4, 2)
      ctx.fillRect(x + 10, y + 4, 4, 2)
      // Backpack (dev touch)
      ctx.fillStyle = colors.accent
      ctx.fillRect(x + 12, y + 6, 3, 8)
    } else {
      // Running: animated character
      const frame = character.animationFrame
      
      // Body
      ctx.fillRect(x, y, CHARACTER_WIDTH, CHARACTER_HEIGHT)
      
      // Glasses (glowing)
      ctx.fillStyle = colors.accent
      ctx.shadowBlur = 4
      ctx.shadowColor = colors.glow
      ctx.fillRect(x + 2, y + 4, 4, 2)
      ctx.fillRect(x + 10, y + 4, 4, 2)
      ctx.shadowBlur = 0
      
      // Backpack with stickers (dev touch)
      ctx.fillStyle = colors.accent
      ctx.fillRect(x + 12, y + 6, 3, 8)
      // Sticker: </> or {
      ctx.fillStyle = colors.text
      ctx.font = '8px monospace'
      ctx.fillText('{', x + 13, y + 12)
      
      // Legs animation (running)
      ctx.fillStyle = colors.primary
      if (frame % 2 === 0) {
        // Left leg forward
        ctx.fillRect(x + 2, y + CHARACTER_HEIGHT - 4, 3, 4)
        ctx.fillRect(x + 11, y + CHARACTER_HEIGHT - 2, 3, 2)
      } else {
        // Right leg forward
        ctx.fillRect(x + 2, y + CHARACTER_HEIGHT - 2, 3, 2)
        ctx.fillRect(x + 11, y + CHARACTER_HEIGHT - 4, 3, 4)
      }
    }

    // Glow effect
    ctx.shadowBlur = 6
    ctx.shadowColor = colors.glow
    ctx.strokeRect(x, y, CHARACTER_WIDTH, character.state === 'ducking' ? CHARACTER_DUCKING_HEIGHT : CHARACTER_HEIGHT)
    ctx.shadowBlur = 0

    ctx.restore()
  }

  // Draw obstacle
  const drawObstacle = (ctx: CanvasRenderingContext2D, obstacle: typeof gameState.obstacles[0], colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return

    const { x, y, width, height, type } = obstacle
    const def = OBSTACLE_DEFINITIONS[type as ObstacleType]

    ctx.save()

    // Obstacle color based on type
    let obstacleColor = colors.primary
    if (type === 'bug') obstacleColor = '#ff4444' // Red for bugs
    else if (type === 'error') obstacleColor = '#ff6b6b' // Red for errors
    else if (type === 'warning') obstacleColor = '#ffd93d' // Yellow for warnings
    else if (type === 'stackoverflow') obstacleColor = '#ff8c42' // Orange for flame
    else if (type === 'node_modules') obstacleColor = colors.accent // Accent for large blocks

    ctx.fillStyle = obstacleColor
    ctx.strokeStyle = colors.glow
    ctx.lineWidth = 1

    // Draw obstacle (pixel art style)
    ctx.fillRect(x, y, width, height)

    // Add label if minimal (avoid excessive text)
    if (def.label && def.label.length <= 2) {
      ctx.fillStyle = colors.text
      ctx.font = '10px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(def.label, x + width / 2, y + height / 2 + 3)
    }

    // Glow effect
    ctx.shadowBlur = 4
    ctx.shadowColor = colors.glow
    ctx.strokeRect(x, y, width, height)
    ctx.shadowBlur = 0

    ctx.restore()
  }

  // Draw background (ground and sky)
  const drawBackground = (ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return

    ctx.save()

    // Sky
    ctx.fillStyle = colors.bg
    ctx.fillRect(0, 0, GAME_WIDTH, GROUND_Y)

    // Ground (scrolling)
    ctx.fillStyle = colors.bgSecondary
    ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y)

    // Ground pattern (pixel art style)
    ctx.strokeStyle = colors.border
    ctx.lineWidth = 1
    for (let i = 0; i < GAME_WIDTH; i += 20) {
      const x = (i + groundOffsetRef.current) % 20
      ctx.beginPath()
      ctx.moveTo(x, GROUND_Y)
      ctx.lineTo(x, GAME_HEIGHT)
      ctx.stroke()
    }

    // Scanlines effect (theme-aware)
    if (themeId === 'cyber' || themeId === 'terminal') {
      ctx.strokeStyle = `rgba(126, 249, 255, 0.06)`
      ctx.lineWidth = 1
      for (let y = 0; y < GAME_HEIGHT; y += 4) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(GAME_WIDTH, y)
        ctx.stroke()
      }
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

    // Draw obstacles
    gameState.obstacles.forEach(obstacle => {
      drawObstacle(ctx, obstacle, colors)
    })

    // Draw character
    drawCharacter(ctx, colors)

    // Draw distance/score (optional HUD overlay)
    if (!gameState.gameOver) {
      ctx.fillStyle = colors.text
      ctx.font = '14px monospace'
      ctx.textAlign = 'right'
      ctx.fillText(`Distance: ${Math.floor(gameState.distance)}m`, GAME_WIDTH - 10, 20)
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

    // Pixel-perfect rendering
    ctx.imageSmoothingEnabled = false

    let lastTime = performance.now()

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      // Update ground offset for scrolling
      groundOffsetRef.current += gameState.gameSpeed * (deltaTime / 16.67)
      if (groundOffsetRef.current >= 20) {
        groundOffsetRef.current = 0
      }

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

