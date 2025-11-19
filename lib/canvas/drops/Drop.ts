/**
 * Drop Class
 * 
 * Represents a procedural drop object that falls with simple physics.
 * Rendered 100% on canvas without external images.
 */

import {
  DropState,
  DropRarity,
  DropShape,
  ExplosionParticle,
  Position,
  DropRarityConfig,
} from './types'

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

export class Drop {
  private state: DropState
  private rarityConfig: DropRarityConfig
  private explosionParticles: ExplosionParticle[] = []
  private colors: string[]

  constructor(
    id: string,
    x: number,
    y: number,
    shape: DropShape,
    rarity: DropRarity,
    rarityConfig: DropRarityConfig,
    colors: string[]
  ) {
    this.rarityConfig = rarityConfig
    this.colors = colors

    // Calculate size based on rarity
    const size =
      rarityConfig.size.min +
      Math.random() * (rarityConfig.size.max - rarityConfig.size.min)

    this.state = {
      id,
      x,
      y,
      vx: 0,
      vy: 0,
      shape,
      rarity,
      size,
      rotation: Math.random() * Math.PI * 2,
      spawnTime: Date.now(),
      lifetime: 12000, // 12 seconds
      isActive: true,
      hasExploded: false,
    }
  }

  /**
   * Update drop physics
   */
  update(deltaTime: number, floorY: number, canvasWidth: number): void {
    if (!this.state.isActive || this.state.hasExploded) {
      // Still update explosion particles even if drop is inactive
      this.updateExplosionParticles(deltaTime)
      return
    }

    // Apply gravity (normalized for 60fps)
    const normalizedDelta = deltaTime / 16.67
    this.state.vy += this.rarityConfig.gravity * normalizedDelta

    // Update position
    this.state.x += this.state.vx * normalizedDelta
    this.state.y += this.state.vy * normalizedDelta

    // Rotation
    this.state.rotation += 0.02 * normalizedDelta

    // Floor collision
    if (this.state.y + this.state.size >= floorY) {
      this.state.y = floorY - this.state.size

      // Bounce
      if (Math.abs(this.state.vy) > 0.1) {
        this.state.vy *= -this.rarityConfig.bounce
        this.state.vx *= 0.8 // Horizontal friction
      } else {
        this.state.vy = 0
      }
    }

    // Wall collisions
    if (this.state.x - this.state.size < 0) {
      this.state.x = this.state.size
      this.state.vx *= -0.5
    } else if (this.state.x + this.state.size > canvasWidth) {
      this.state.x = canvasWidth - this.state.size
      this.state.vx *= -0.5
    }

    // Update lifetime
    this.state.lifetime -= deltaTime
    if (this.state.lifetime <= 0) {
      this.state.isActive = false
    }

    // Update explosion particles
    this.updateExplosionParticles(deltaTime)
  }

  /**
   * Update explosion particles
   */
  private updateExplosionParticles(deltaTime: number): void {
    const normalizedDelta = deltaTime / 16.67
    let deadParticleCount = 0
    this.explosionParticles = this.explosionParticles.filter((particle) => {
      particle.x += particle.vx * normalizedDelta
      particle.y += particle.vy * normalizedDelta
      particle.vy += 0.15 * normalizedDelta // Gravity
      particle.life -= deltaTime
      particle.alpha = particle.life / particle.maxLife

      if (particle.life <= 0) {
        deadParticleCount++
        return false
      }
      return true
    })
    
    // Deallocate dead particles from budget
    if (deadParticleCount > 0) {
      try {
        const { deallocateParticles } = require('@/lib/performance/particle-budget')
        deallocateParticles('drops', deadParticleCount)
      } catch (e) {
        // Budget system not available, skip deallocation
      }
    }
  }

  /**
   * Render drop on canvas
   */
  draw(ctx: CanvasRenderingContext2D, themeColors: ThemeColors | null): void {
    if (!themeColors) return

    ctx.save()

    // If exploded, render only particles
    if (this.state.hasExploded) {
      this.drawExplosion(ctx)
      ctx.restore()
      return
    }

    if (!this.state.isActive) {
      ctx.restore()
      return
    }

    // Apply transformations
    ctx.translate(this.state.x, this.state.y)
    ctx.rotate(this.state.rotation)

    // Configure glow
    const glowColor = Array.isArray(this.colors) ? this.colors[0] : this.colors
    ctx.shadowBlur = this.rarityConfig.glow
    ctx.shadowColor = glowColor

    // Draw shape based on type
    switch (this.state.shape) {
      case 'circle':
        this.drawCircle(ctx)
        break
      case 'square':
        this.drawSquare(ctx)
        break
      case 'triangle':
        this.drawTriangle(ctx)
        break
      case 'hexagon':
        this.drawHexagon(ctx)
        break
    }

    ctx.restore()
  }

  /**
   * Draw circle
   */
  private drawCircle(ctx: CanvasRenderingContext2D): void {
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.state.size)

    if (Array.isArray(this.colors)) {
      this.colors.forEach((color, i) => {
        gradient.addColorStop(i / (this.colors.length - 1), color)
      })
    } else {
      gradient.addColorStop(0, this.colors)
      gradient.addColorStop(1, this.adjustColorBrightness(this.colors, -0.3))
    }

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(0, 0, this.state.size, 0, Math.PI * 2)
    ctx.fill()
  }

  /**
   * Draw square
   */
  private drawSquare(ctx: CanvasRenderingContext2D): void {
    const size = this.state.size
    const cornerRadius = size * 0.15

    const gradient = ctx.createLinearGradient(-size, -size, size, size)

    if (Array.isArray(this.colors)) {
      this.colors.forEach((color, i) => {
        gradient.addColorStop(i / (this.colors.length - 1), color)
      })
    } else {
      gradient.addColorStop(0, this.colors)
      gradient.addColorStop(1, this.adjustColorBrightness(this.colors, -0.3))
    }

    ctx.fillStyle = gradient
    ctx.beginPath()
    this.roundRect(ctx, -size, -size, size * 2, size * 2, cornerRadius)
    ctx.fill()
  }

  /**
   * Draw triangle
   */
  private drawTriangle(ctx: CanvasRenderingContext2D): void {
    const size = this.state.size
    const height = size * 1.732 // sqrt(3) for equilateral triangle

    const gradient = ctx.createLinearGradient(0, -height / 2, 0, height / 2)

    if (Array.isArray(this.colors)) {
      this.colors.forEach((color, i) => {
        gradient.addColorStop(i / (this.colors.length - 1), color)
      })
    } else {
      gradient.addColorStop(0, this.colors)
      gradient.addColorStop(1, this.adjustColorBrightness(this.colors, -0.3))
    }

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(0, -height / 2)
    ctx.lineTo(-size, height / 2)
    ctx.lineTo(size, height / 2)
    ctx.closePath()
    ctx.fill()
  }

  /**
   * Draw hexagon
   */
  private drawHexagon(ctx: CanvasRenderingContext2D): void {
    const size = this.state.size
    const sides = 6
    const angle = (Math.PI * 2) / sides

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size)

    if (Array.isArray(this.colors)) {
      this.colors.forEach((color, i) => {
        gradient.addColorStop(i / (this.colors.length - 1), color)
      })
    } else {
      gradient.addColorStop(0, this.colors)
      gradient.addColorStop(1, this.adjustColorBrightness(this.colors, -0.3))
    }

    ctx.fillStyle = gradient
    ctx.beginPath()

    for (let i = 0; i < sides; i++) {
      const x = Math.cos(angle * i) * size
      const y = Math.sin(angle * i) * size
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.closePath()
    ctx.fill()
  }

  /**
   * Draw explosion particles
   */
  private drawExplosion(ctx: CanvasRenderingContext2D): void {
    this.explosionParticles.forEach((particle) => {
      ctx.save()
      ctx.globalAlpha = particle.alpha
      ctx.fillStyle = particle.color
      ctx.shadowBlur = 8
      ctx.shadowColor = particle.color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
  }

  /**
   * Handle click event
   */
  onClick(
    x: number,
    y: number,
    grantReward: (type: string, value: number) => void
  ): boolean {
    if (!this.state.isActive || this.state.hasExploded) return false

    // Check if click is inside drop
    const dx = x - this.state.x
    const dy = y - this.state.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= this.state.size) {
      // Create explosion
      this.createExplosion()

      // Grant reward
      grantReward(this.rarityConfig.reward.type, this.rarityConfig.reward.value)

      return true
    }

    return false
  }

  /**
   * Create explosion particle system
   */
  private createExplosion(): void {
    this.state.hasExploded = true
    this.state.isActive = false

    // Check particle budget before creating explosion
    // Dynamic import to avoid circular dependencies
    let allocateParticles: ((type: string, count: number) => boolean) | null = null
    let getAvailable: ((type: string) => number) | null = null
    
    try {
      const budgetModule = require('@/lib/performance/particle-budget')
      allocateParticles = budgetModule.allocateParticles
      getAvailable = budgetModule.getAvailableParticles
    } catch (e) {
      // Budget system not available, skip budget check
      
    }
    
    const baseParticleCount = 20 + Math.random() * 10 // 20-30 particles
    let particleCount = baseParticleCount
    
    if (allocateParticles && getAvailable) {
      const available = getAvailable('drops')
      particleCount = Math.min(baseParticleCount, available)
      
      if (particleCount <= 0 || !allocateParticles('drops', particleCount)) {
        // No budget available for explosion particles
        return
      }
    }
    
    const baseColor = Array.isArray(this.colors) ? this.colors[0] : this.colors

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5
      const speed = 2 + Math.random() * 4
      const life = 40 + Math.random() * 20 // 40-60 frames

      this.explosionParticles.push({
        x: this.state.x,
        y: this.state.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        size: 2 + Math.random() * 3,
        color: baseColor,
        alpha: 1,
      })
    }
  }

  /**
   * Utility: rounded rectangle path
   */
  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
  }

  /**
   * Utility: adjust color brightness
   */
  private adjustColorBrightness(color: string, factor: number): string {
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16)
      const g = parseInt(color.slice(3, 5), 16)
      const b = parseInt(color.slice(5, 7), 16)

      const newR = Math.max(0, Math.min(255, r + factor * 255))
      const newG = Math.max(0, Math.min(255, g + factor * 255))
      const newB = Math.max(0, Math.min(255, b + factor * 255))

      return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`
    }

    return color
  }

  // Getters
  getState(): DropState {
    return { ...this.state }
  }

  getPosition(): Position {
    return { x: this.state.x, y: this.state.y }
  }

  isActive(): boolean {
    return this.state.isActive || this.explosionParticles.length > 0
  }
}

