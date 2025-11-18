"use client"

import { useEffect, useRef, useState } from "react"
import { useThemeStore } from "@/lib/theme-store"
import type { GameState } from "@/lib/games/dev-pong/game-logic"
import { GAME_WIDTH, GAME_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT, BALL_SIZE } from "@/lib/games/dev-pong/game-logic"

interface PongCanvasProps {
  gameState: GameState
  onUpdate?: (deltaTime: number) => void
}

// Particle for ball trail
interface Particle {
  x: number
  y: number
  life: number
  maxLife: number
  size: number
}

// Floating background element
interface FloatingElement {
  x: number
  y: number
  char: string
  opacity: number
  speed: number
}

export function PongCanvas({ gameState, onUpdate }: PongCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const floatingElementsRef = useRef<FloatingElement[]>([])
  const lastFrameTimeRef = useRef<number>(0)
  const animationFrameRef = useRef<number>()
  const [glitchFrame, setGlitchFrame] = useState(false)
  
  const { theme: themeId } = useThemeStore()
  
  // Initialize floating background elements
  useEffect(() => {
    const elements: FloatingElement[] = []
    const chars = ['{', '}', '<', '>', '/', '\\', '|', '-', '=', ';', ':', '(', ')']
    
    for (let i = 0; i < 20; i++) {
      elements.push({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * GAME_HEIGHT,
        char: chars[Math.floor(Math.random() * chars.length)],
        opacity: Math.random() * 0.1 + 0.05,
        speed: Math.random() * 0.2 + 0.1,
      })
    }
    
    floatingElementsRef.current = elements
  }, [])
  
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
    }
  }
  
  // Add particle to ball trail
  const addParticle = (x: number, y: number) => {
    particlesRef.current.push({
      x,
      y,
      life: 1,
      maxLife: 1,
      size: BALL_SIZE * 0.6,
    })
    
    // Limit particles
    if (particlesRef.current.length > 30) {
      particlesRef.current.shift()
    }
  }
  
  // Update particles
  const updateParticles = (deltaTime: number) => {
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.life -= deltaTime * 0.002
      return particle.life > 0
    })
  }
  
  // Update floating elements
  const updateFloatingElements = (deltaTime: number) => {
    floatingElementsRef.current.forEach(elem => {
      elem.y += elem.speed * deltaTime * 0.02
      if (elem.y > GAME_HEIGHT + 20) {
        elem.y = -20
        elem.x = Math.random() * GAME_WIDTH
      }
    })
  }
  
  // Render game
  const render = (ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return
    
    // Clear canvas
    ctx.fillStyle = colors.bg
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
    
    // Draw background elements
    drawBackground(ctx, colors)
    
    // Draw paddles
    drawPaddle(ctx, gameState.playerPaddle.x, gameState.playerPaddle.y, '[', colors)
    drawPaddle(ctx, gameState.aiPaddle.x, gameState.aiPaddle.y, ']', colors)
    
    // Draw particles
    drawParticles(ctx, colors)
    
    // Draw ball
    drawBall(ctx, gameState.ball.x, gameState.ball.y, colors)
    
    // Draw center line
    drawCenterLine(ctx, colors)
    
    // Apply glitch effect if active
    if (glitchFrame) {
      applyGlitchEffect(ctx, colors)
    }
  }
  
  // Draw background effects
  const drawBackground = (ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return
    
    // Floating code symbols
    ctx.font = '14px monospace'
    floatingElementsRef.current.forEach(elem => {
      ctx.fillStyle = `rgba(${hexToRgb(colors.text)}, ${elem.opacity})`
      ctx.fillText(elem.char, elem.x, elem.y)
    })
    
    // Scanlines (horizontal lines)
    if (themeId === 'cyber' || themeId === 'terminal') {
      ctx.strokeStyle = `rgba(${hexToRgb(colors.text)}, 0.03)`
      ctx.lineWidth = 1
      for (let y = 0; y < GAME_HEIGHT; y += 4) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(GAME_WIDTH, y)
        ctx.stroke()
      }
    }
  }
  
  // Draw center line
  const drawCenterLine = (ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return
    
    ctx.strokeStyle = `rgba(${hexToRgb(colors.text)}, 0.2)`
    ctx.lineWidth = 2
    ctx.setLineDash([10, 10])
    ctx.beginPath()
    ctx.moveTo(GAME_WIDTH / 2, 0)
    ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT)
    ctx.stroke()
    ctx.setLineDash([])
  }
  
  // Draw paddle with bracket style
  const drawPaddle = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    bracket: string,
    colors: ReturnType<typeof getThemeColors>
  ) => {
    if (!colors) return
    
    // Glow effect
    if (themeId === 'neon' || themeId === 'cyber') {
      ctx.shadowColor = colors.primary
      ctx.shadowBlur = 15
    }
    
    // Draw bracket character
    ctx.fillStyle = colors.primary
    ctx.font = `${PADDLE_HEIGHT}px monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(bracket, x + PADDLE_WIDTH / 2, y + PADDLE_HEIGHT / 2)
    
    // Reset shadow
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
  }
  
  // Draw ball with particle trail
  const drawBall = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    colors: ReturnType<typeof getThemeColors>
  ) => {
    if (!colors) return
    
    // Glow effect
    if (themeId === 'neon' || themeId === 'cyber') {
      ctx.shadowColor = colors.accent
      ctx.shadowBlur = 20
    }
    
    // Draw ball
    ctx.fillStyle = colors.accent
    ctx.beginPath()
    ctx.arc(x, y, BALL_SIZE / 2, 0, Math.PI * 2)
    ctx.fill()
    
    // Reset shadow
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
  }
  
  // Draw particle trail
  const drawParticles = (ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return
    
    particlesRef.current.forEach(particle => {
      const alpha = particle.life / particle.maxLife
      ctx.fillStyle = `rgba(${hexToRgb(colors.accent)}, ${alpha * 0.5})`
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2)
      ctx.fill()
    })
  }
  
  // Apply glitch effect
  const applyGlitchEffect = (ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return
    
    // Simple glitch: offset a section slightly
    const sliceHeight = 30
    const offset = Math.random() * 10 - 5
    const y = Math.random() * (GAME_HEIGHT - sliceHeight)
    
    ctx.drawImage(
      ctx.canvas,
      0, y, GAME_WIDTH, sliceHeight,
      offset, y, GAME_WIDTH, sliceHeight
    )
  }
  
  // Convert hex color to RGB values
  const hexToRgb = (hex: string): string => {
    hex = hex.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `${r}, ${g}, ${b}`
  }
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let lastTime = performance.now()
    
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime
      
      // Call update callback
      if (onUpdate && !gameState.gameOver) {
        onUpdate(deltaTime)
      }
      
      // Update effects
      updateParticles(deltaTime)
      updateFloatingElements(deltaTime)
      
      // Add particle behind ball
      if (!gameState.gameOver) {
        addParticle(gameState.ball.x, gameState.ball.y)
      }
      
      // Render
      const colors = getThemeColors()
      render(ctx, colors)
      
      // Continue loop
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animationFrameRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameState, onUpdate, themeId])
  
  // Trigger glitch effect on collision
  useEffect(() => {
    // Detect high-velocity collisions
    const speed = Math.sqrt(
      gameState.ball.velocity.vx ** 2 + gameState.ball.velocity.vy ** 2
    )
    
    if (speed > 8) {
      setGlitchFrame(true)
      setTimeout(() => setGlitchFrame(false), 50)
    }
  }, [gameState.ball.velocity])
  
  return (
    <div className="flex justify-center items-center">
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="
          border-2 border-border
          rounded-lg
          shadow-glow
          bg-page-secondary
          max-w-full
          h-auto
        "
        style={{
          imageRendering: themeId === 'pixel' ? 'pixelated' : 'auto',
        }}
      />
    </div>
  )
}

