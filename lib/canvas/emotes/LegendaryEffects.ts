/**
 * LegendaryEffects
 * 
 * Special effects system for legendary emotes
 * Includes particles, aura, trail, and reactive animations
 */

import {
  LegendaryParticle,
  LegendaryAura,
  LegendaryTrailPoint,
  LegendaryParticleType,
  ThemeColors,
  EmoteThemeStyle,
} from './emote-types'
import type { ThemeId } from '@/lib/themes'

export class LegendaryEffects {
  /**
   * Create particles for legendary emote
   */
  static createParticles(
    x: number,
    y: number,
    themeStyle: EmoteThemeStyle,
    colors: ThemeColors,
    count: number = 8
  ): LegendaryParticle[] {
    // Check particle budget before creating
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
    
    let particleCount = count
    
    if (allocateParticles && getAvailable) {
      const available = getAvailable('emotes_legendary')
      particleCount = Math.min(count, available)
      
      if (particleCount <= 0 || !allocateParticles('emotes_legendary', particleCount)) {
        // No budget available for legendary particles
        return []
      }
    }
    
    const particles: LegendaryParticle[] = []
    const particleType = this.getParticleTypeForTheme(themeStyle)

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount
      const speed = 0.3 + Math.random() * 0.2
      const life = 2000 + Math.random() * 1000 // 2-3 seconds

      particles.push({
        x: x + Math.cos(angle) * 30,
        y: y + Math.sin(angle) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: life,
        maxLife: life,
        size: this.getParticleSize(particleType),
        type: particleType,
        color: this.getParticleColor(particleType, colors),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
      })
    }

    return particles
  }

  /**
   * Update particles
   */
  static updateParticles(
    particles: LegendaryParticle[],
    deltaTime: number
  ): LegendaryParticle[] {
    return particles
      .map((particle) => {
        // Update position
        particle.x += particle.vx * deltaTime
        particle.y += particle.vy * deltaTime

        // Update rotation
        particle.rotation += particle.rotationSpeed * deltaTime

        // Update life
        particle.life -= deltaTime

        // Apply slow deceleration
        particle.vx *= 0.98
        particle.vy *= 0.98

        return particle
      })
      .filter((p) => p.life > 0)
  }

  /**
   * Render particles
   */
  static renderParticles(
    ctx: CanvasRenderingContext2D,
    particles: LegendaryParticle[]
  ): void {
    particles.forEach((particle) => {
      const alpha = particle.life / particle.maxLife
      ctx.save()

      ctx.globalAlpha = Math.min(1, alpha * 1.2) // More visible
      ctx.translate(particle.x, particle.y)
      ctx.rotate(particle.rotation)

      ctx.fillStyle = particle.color
      ctx.shadowBlur = 15 // More glow
      ctx.shadowColor = particle.color

      switch (particle.type) {
        case 'neon_triangle':
          this.drawTriangle(ctx, particle.size)
          break
        case 'hacker_bit':
          this.drawBit(ctx, particle.size)
          break
        case 'pixel_square':
          this.drawPixelSquare(ctx, particle.size)
          break
        case 'glitch_fragment':
          this.drawGlitchFragment(ctx, particle.size)
          break
        case 'terminal_spark':
          this.drawTerminalSpark(ctx, particle.size)
          break
      }

      ctx.restore()
    })
  }

  /**
   * Create aura for legendary emote
   */
  static createAura(themeStyle: EmoteThemeStyle): LegendaryAura {
    const ringCount = themeStyle === 'neon' ? 3 : themeStyle === 'hacker' ? 2 : 2

    return {
      pulsePhase: 0,
      rings: Array.from({ length: ringCount }, (_, i) => ({
        radius: 20 + i * 15,
        alpha: 0.3 - i * 0.1,
        speed: 0.5 + i * 0.2,
      })),
      glowIntensity: 1,
    }
  }

  /**
   * Update aura
   */
  static updateAura(aura: LegendaryAura, deltaTime: number, reactivity: number = 0): void {
    aura.pulsePhase += deltaTime * 0.003
    aura.glowIntensity = 1 + Math.sin(aura.pulsePhase) * 0.3 + reactivity * 0.5

    aura.rings.forEach((ring, i) => {
      ring.radius = 20 + i * 15 + Math.sin(aura.pulsePhase * ring.speed) * 5
      ring.alpha = (0.3 - i * 0.1) * (1 + reactivity * 0.5)
    })
  }

  /**
   * Render aura
   */
  static renderAura(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    aura: LegendaryAura,
    themeStyle: EmoteThemeStyle,
    colors: ThemeColors
  ): void {
    ctx.save()
    ctx.translate(x, y)

    switch (themeStyle) {
      case 'neon':
        this.renderNeonAura(ctx, aura, colors)
        break
      case 'pixel':
        this.renderPixelAura(ctx, aura, colors)
        break
      case 'hacker':
        this.renderHackerAura(ctx, aura, colors)
        break
      case 'glitch':
        this.renderGlitchAura(ctx, aura, colors)
        break
      default:
        this.renderNeonAura(ctx, aura, colors)
    }

    ctx.restore()
  }

  /**
   * Create trail
   */
  static createTrailPoint(x: number, y: number): LegendaryTrailPoint {
    return {
      x,
      y,
      life: 500,
      maxLife: 500,
      alpha: 1,
    }
  }

  /**
   * Update trail
   */
  static updateTrail(
    trail: LegendaryTrailPoint[],
    deltaTime: number
  ): LegendaryTrailPoint[] {
    return trail
      .map((point) => {
        point.life -= deltaTime
        point.alpha = point.life / point.maxLife
        return point
      })
      .filter((p) => p.life > 0)
  }

  /**
   * Render trail
   */
  static renderTrail(
    ctx: CanvasRenderingContext2D,
    trail: LegendaryTrailPoint[],
    themeStyle: EmoteThemeStyle,
    colors: ThemeColors
  ): void {
    if (trail.length < 2) return

    ctx.save()

    const trailColor = this.getTrailColor(themeStyle, colors)

    for (let i = 0; i < trail.length - 1; i++) {
      const current = trail[i]
      const next = trail[i + 1]

      ctx.globalAlpha = current.alpha * 0.5
      ctx.strokeStyle = trailColor
      ctx.lineWidth = 2
      ctx.shadowBlur = 8
      ctx.shadowColor = trailColor

      ctx.beginPath()
      ctx.moveTo(current.x, current.y)
      ctx.lineTo(next.x, next.y)
      ctx.stroke()
    }

    ctx.restore()
  }

  // Private helper methods

  private static getParticleTypeForTheme(themeStyle: EmoteThemeStyle): LegendaryParticleType {
    switch (themeStyle) {
      case 'neon':
        return 'neon_triangle'
      case 'hacker':
        return 'hacker_bit'
      case 'pixel':
        return 'pixel_square'
      case 'glitch':
        return 'glitch_fragment'
      default:
        return 'terminal_spark'
    }
  }

  private static getParticleSize(type: LegendaryParticleType): number {
    switch (type) {
      case 'neon_triangle':
        return 4
      case 'hacker_bit':
        return 3
      case 'pixel_square':
        return 4
      case 'glitch_fragment':
        return 5
      case 'terminal_spark':
        return 2
    }
  }

  private static getParticleColor(type: LegendaryParticleType, colors: ThemeColors): string {
    switch (type) {
      case 'neon_triangle':
        return colors.accent
      case 'hacker_bit':
        return '#00ff00'
      case 'pixel_square':
        return colors.primary
      case 'glitch_fragment':
        return colors.accent
      case 'terminal_spark':
        return colors.text
    }
  }

  private static drawTriangle(ctx: CanvasRenderingContext2D, size: number): void {
    ctx.beginPath()
    ctx.moveTo(0, -size)
    ctx.lineTo(-size * 0.866, size * 0.5)
    ctx.lineTo(size * 0.866, size * 0.5)
    ctx.closePath()
    ctx.fill()
  }

  private static drawBit(ctx: CanvasRenderingContext2D, size: number): void {
    ctx.fillRect(-size / 2, -size / 2, size, size)
  }

  private static drawPixelSquare(ctx: CanvasRenderingContext2D, size: number): void {
    ctx.imageSmoothingEnabled = false
    ctx.fillRect(-size / 2, -size / 2, size, size)
    ctx.imageSmoothingEnabled = true
  }

  private static drawGlitchFragment(ctx: CanvasRenderingContext2D, size: number): void {
    ctx.beginPath()
    ctx.moveTo(-size / 2, -size / 2)
    ctx.lineTo(size / 2, -size / 2)
    ctx.lineTo(0, size / 2)
    ctx.closePath()
    ctx.fill()
  }

  private static drawTerminalSpark(ctx: CanvasRenderingContext2D, size: number): void {
    ctx.beginPath()
    ctx.arc(0, 0, size, 0, Math.PI * 2)
    ctx.fill()
  }

  private static renderNeonAura(
    ctx: CanvasRenderingContext2D,
    aura: LegendaryAura,
    colors: ThemeColors
  ): void {
    aura.rings.forEach((ring) => {
      ctx.globalAlpha = Math.min(1, ring.alpha * 2) // Make more visible
      ctx.strokeStyle = colors.primary
      ctx.lineWidth = 3 // Thicker lines
      ctx.shadowBlur = 30 * aura.glowIntensity // More glow
      ctx.shadowColor = colors.primary

      ctx.beginPath()
      ctx.arc(0, 0, ring.radius, 0, Math.PI * 2)
      ctx.stroke()
    })
  }

  private static renderPixelAura(
    ctx: CanvasRenderingContext2D,
    aura: LegendaryAura,
    colors: ThemeColors
  ): void {
    ctx.imageSmoothingEnabled = false

    aura.rings.forEach((ring) => {
      ctx.globalAlpha = ring.alpha
      ctx.strokeStyle = colors.primary
      ctx.lineWidth = 2

      // Pixelated ring
      const segments = 16
      for (let i = 0; i < segments; i++) {
        const angle1 = (Math.PI * 2 * i) / segments
        const angle2 = (Math.PI * 2 * (i + 1)) / segments
        const x1 = Math.cos(angle1) * ring.radius
        const y1 = Math.sin(angle1) * ring.radius
        const x2 = Math.cos(angle2) * ring.radius
        const y2 = Math.sin(angle2) * ring.radius

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
    })

    ctx.imageSmoothingEnabled = true
  }

  private static renderHackerAura(
    ctx: CanvasRenderingContext2D,
    aura: LegendaryAura,
    colors: ThemeColors
  ): void {
    // Matrix rain effect around
    ctx.globalAlpha = 0.3
    ctx.fillStyle = '#00ff00'
    ctx.font = '8px monospace'

    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8
      const distance = aura.rings[0].radius + 10
      const x = Math.cos(angle) * distance
      const y = Math.sin(angle) * distance

      const chars = ['0', '1', '█', '▓']
      const char = chars[Math.floor(Math.random() * chars.length)]
      ctx.fillText(char, x - 4, y + 4)
    }

    // Scanlines
    ctx.strokeStyle = '#00ff00'
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.1

    for (let y = -aura.rings[0].radius; y < aura.rings[0].radius; y += 4) {
      ctx.beginPath()
      ctx.moveTo(-aura.rings[0].radius, y)
      ctx.lineTo(aura.rings[0].radius, y)
      ctx.stroke()
    }
  }

  private static renderGlitchAura(
    ctx: CanvasRenderingContext2D,
    aura: LegendaryAura,
    colors: ThemeColors
  ): void {
    // Glitch distortion rings
    aura.rings.forEach((ring, i) => {
      ctx.globalAlpha = ring.alpha
      ctx.strokeStyle = i % 2 === 0 ? colors.primary : colors.accent
      ctx.lineWidth = 1

      const offset = Math.sin(aura.pulsePhase * 2) * 2
      ctx.beginPath()
      ctx.arc(offset, 0, ring.radius, 0, Math.PI * 2)
      ctx.stroke()

      // Duplicate with offset
      ctx.globalAlpha = ring.alpha * 0.5
      ctx.beginPath()
      ctx.arc(-offset, 0, ring.radius, 0, Math.PI * 2)
      ctx.stroke()
    })
  }

  private static getTrailColor(themeStyle: EmoteThemeStyle, colors: ThemeColors): string {
    switch (themeStyle) {
      case 'neon':
        return colors.primary
      case 'hacker':
        return '#00ff00'
      case 'pixel':
        return colors.primary
      case 'glitch':
        return colors.accent
      default:
        return colors.text
    }
  }
}

