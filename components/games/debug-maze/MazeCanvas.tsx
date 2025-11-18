"use client"

import { useEffect, useRef } from "react"
import { useThemeStore } from "@/lib/theme-store"
import type { GameState } from "@/lib/games/debug-maze/game-logic"
import { ANIMATION_DURATION } from "@/lib/games/debug-maze/game-logic"

interface MazeCanvasProps {
  gameState: GameState
  onUpdate?: (deltaTime: number) => void
}

// Canvas dimensions
const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

export function MazeCanvas({ gameState, onUpdate }: MazeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const patchPulseRef = useRef<number>(0)

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

  // Calculate cell size based on maze dimensions
  const getCellSize = (mazeWidth: number, mazeHeight: number): number => {
    const padding = 40
    const availableWidth = CANVAS_WIDTH - padding * 2
    const availableHeight = CANVAS_HEIGHT - padding * 2
    
    const cellSizeX = availableWidth / mazeWidth
    const cellSizeY = availableHeight / mazeHeight
    
    return Math.floor(Math.min(cellSizeX, cellSizeY))
  }

  // Draw maze walls and floor
  const drawMaze = (
    ctx: CanvasRenderingContext2D,
    colors: ReturnType<typeof getThemeColors>
  ) => {
    if (!colors || !gameState.maze) return

    const { maze } = gameState
    const cellSize = getCellSize(maze.width, maze.height)
    const offsetX = (CANVAS_WIDTH - maze.width * cellSize) / 2
    const offsetY = (CANVAS_HEIGHT - maze.height * cellSize) / 2

    // Draw floor (empty cells)
    ctx.fillStyle = colors.bgSecondary
    ctx.fillRect(offsetX, offsetY, maze.width * cellSize, maze.height * cellSize)

    // Draw walls
    ctx.fillStyle = colors.border
    ctx.strokeStyle = colors.border
    ctx.lineWidth = 1

    for (let row = 0; row < maze.height; row++) {
      for (let col = 0; col < maze.width; col++) {
        if (maze.walls[row][col] === 1) {
          const x = offsetX + col * cellSize
          const y = offsetY + row * cellSize
          
          // Fill wall cell
          ctx.fillRect(x, y, cellSize, cellSize)
          
          // Add pixel texture (simple pattern)
          ctx.fillStyle = colors.bgSecondary
          ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2)
          ctx.fillStyle = colors.border
        }
      }
    }
  }

  // Draw bug (player character) - pixel art style
  const drawBug = (
    ctx: CanvasRenderingContext2D,
    colors: ReturnType<typeof getThemeColors>
  ) => {
    if (!colors || !gameState.maze) return

    const { maze, bugPosition, isAnimating, animationFrom, animationTo } = gameState
    const cellSize = getCellSize(maze.width, maze.height)
    const offsetX = (CANVAS_WIDTH - maze.width * cellSize) / 2
    const offsetY = (CANVAS_HEIGHT - maze.height * cellSize) / 2

    // Calculate position (with animation interpolation)
    let x = offsetX + bugPosition.col * cellSize + cellSize / 2
    let y = offsetY + bugPosition.row * cellSize + cellSize / 2

    if (isAnimating && animationFrom && animationTo) {
      const now = Date.now()
      const elapsed = now - gameState.animationStartTime
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1)
      
      // Ease-out animation
      const eased = 1 - Math.pow(1 - progress, 3)
      
      const fromX = offsetX + animationFrom.col * cellSize + cellSize / 2
      const fromY = offsetY + animationFrom.row * cellSize + cellSize / 2
      const toX = offsetX + animationTo.col * cellSize + cellSize / 2
      const toY = offsetY + animationTo.row * cellSize + cellSize / 2
      
      x = fromX + (toX - fromX) * eased
      y = fromY + (toY - fromY) * eased
      
      // Add hop effect (slight vertical offset)
      const hopHeight = Math.sin(progress * Math.PI) * (cellSize * 0.2)
      y -= hopHeight
    }

    // Bug sprite (12-16px pixel art)
    const bugSize = Math.min(cellSize * 0.6, 16)
    const bugX = x - bugSize / 2
    const bugY = y - bugSize / 2

    ctx.save()

    // Bug body (rounded square)
    ctx.fillStyle = colors.primary
    ctx.strokeStyle = colors.glow
    ctx.lineWidth = 1
    
    // Body
    ctx.fillRect(bugX, bugY, bugSize, bugSize)
    
    // Eyes (pixel art blinking)
    const blinkFrame = Math.floor(Date.now() / 500) % 4
    if (blinkFrame < 3) {
      ctx.fillStyle = colors.accent
      ctx.fillRect(bugX + bugSize * 0.2, bugY + bugSize * 0.3, bugSize * 0.15, bugSize * 0.15)
      ctx.fillRect(bugX + bugSize * 0.65, bugY + bugSize * 0.3, bugSize * 0.15, bugSize * 0.15)
    }
    
    // Antennae (dev touch)
    ctx.strokeStyle = colors.primary
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(bugX + bugSize * 0.3, bugY)
    ctx.lineTo(bugX + bugSize * 0.3, bugY - bugSize * 0.3)
    ctx.moveTo(bugX + bugSize * 0.7, bugY)
    ctx.lineTo(bugX + bugSize * 0.7, bugY - bugSize * 0.3)
    ctx.stroke()
    
    // Glow effect
    ctx.shadowBlur = 4
    ctx.shadowColor = colors.glow
    ctx.strokeRect(bugX, bugY, bugSize, bugSize)
    ctx.shadowBlur = 0

    ctx.restore()
  }

  // Draw patch (goal) - pixel art with pulsing animation
  const drawPatch = (
    ctx: CanvasRenderingContext2D,
    colors: ReturnType<typeof getThemeColors>
  ) => {
    if (!colors || !gameState.maze) return

    const { maze, patchPosition } = gameState
    const cellSize = getCellSize(maze.width, maze.height)
    const offsetX = (CANVAS_WIDTH - maze.width * cellSize) / 2
    const offsetY = (CANVAS_HEIGHT - maze.height * cellSize) / 2

    const x = offsetX + patchPosition.col * cellSize + cellSize / 2
    const y = offsetY + patchPosition.row * cellSize + cellSize / 2

    // Pulsing animation
    const pulse = (Math.sin(patchPulseRef.current) + 1) / 2 // 0 to 1
    const patchSize = Math.min(cellSize * 0.5, 14) * (0.8 + pulse * 0.2)
    const patchX = x - patchSize / 2
    const patchY = y - patchSize / 2

    ctx.save()

    // Patch icon (8-bit patch symbol)
    ctx.fillStyle = colors.accent
    ctx.strokeStyle = colors.glow
    ctx.lineWidth = 2
    
    // Draw patch shape (rounded square with corner cut)
    ctx.beginPath()
    ctx.moveTo(patchX + patchSize * 0.2, patchY)
    ctx.lineTo(patchX + patchSize * 0.8, patchY)
    ctx.lineTo(patchX + patchSize, patchY + patchSize * 0.2)
    ctx.lineTo(patchX + patchSize, patchY + patchSize * 0.8)
    ctx.lineTo(patchX + patchSize * 0.8, patchY + patchSize)
    ctx.lineTo(patchX + patchSize * 0.2, patchY + patchSize)
    ctx.lineTo(patchX, patchY + patchSize * 0.8)
    ctx.lineTo(patchX, patchY + patchSize * 0.2)
    ctx.closePath()
    ctx.fill()
    
    // Inner symbol (checkmark or patch icon)
    ctx.fillStyle = colors.bg
    ctx.font = `${patchSize * 0.6}px monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('✓', x, y)
    
    // Glow effect
    ctx.shadowBlur = 8 + pulse * 4
    ctx.shadowColor = colors.glow
    ctx.stroke()
    ctx.shadowBlur = 0

    ctx.restore()
  }

  // Main render function
  const render = (ctx: CanvasRenderingContext2D) => {
    const colors = getThemeColors()
    if (!colors) return

    // Clear canvas
    ctx.fillStyle = colors.bg
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    if (!gameState.maze) {
      // No maze loaded
      ctx.fillStyle = colors.text
      ctx.font = '24px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Loading maze...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
      return
    }

    // Draw maze
    drawMaze(ctx, colors)

    // Draw patch (goal) - behind bug
    drawPatch(ctx, colors)

    // Draw bug (player)
    drawBug(ctx, colors)
  }

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT

    // Pixel-perfect rendering
    ctx.imageSmoothingEnabled = false

    let lastTime = performance.now()

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      // Update patch pulse animation
      patchPulseRef.current += deltaTime * 0.003

      // Render
      render(ctx)

      // Call onUpdate callback
      if (onUpdate) {
        onUpdate(deltaTime)
      }

      // Continue loop
      animationFrameRef.current = requestAnimationFrame(gameLoop)
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
      const containerHeight = container.clientHeight
      const scale = Math.min(
        containerWidth / CANVAS_WIDTH,
        containerHeight / CANVAS_HEIGHT,
        1
      )
      
      canvas.style.width = `${CANVAS_WIDTH * scale}px`
      canvas.style.height = `${CANVAS_HEIGHT * scale}px`
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
      className="w-full h-full"
      style={{
        display: 'block',
        imageRendering: 'pixelated',
      }}
    />
  )
}

