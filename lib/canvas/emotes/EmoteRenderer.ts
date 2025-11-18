/**
 * EmoteRenderer
 * 
 * Renders procedural emotes on canvas without external images.
 * Supports effects: glow, glitch, pixelation, scanlines.
 * Special rendering for legendary emotes with particles, aura, trail, and reactive animations.
 */

import { EmoteState, EmoteRenderConfig, ThemeColors } from './emote-types'
import { LegendaryEffects } from './LegendaryEffects'

export class EmoteRenderer {
  private config: EmoteRenderConfig

  constructor(config?: Partial<EmoteRenderConfig>) {
    this.config = {
      fontSize: 20,
      fontFamily: "'JetBrains Mono', monospace",
      glowIntensity: 12,
      glitchEnabled: true,
      pixelationEnabled: false,
      scanlinesEnabled: false,
      ...config,
    }
  }

  /**
   * Render emote on canvas
   */
  draw(
    ctx: CanvasRenderingContext2D,
    emote: EmoteState,
    themeColors: ThemeColors | null,
    mouseX?: number,
    mouseY?: number
  ): void {
    if (!emote.isActive || !themeColors) return

    // Check rarity and render accordingly
    const isUnique = emote.rarity === 'unique'
    const isLegendary = emote.rarity === 'legendary'
    const isEpic = emote.rarity === 'epic'

    if (isUnique) {
      this.drawUnique(ctx, emote, themeColors, mouseX, mouseY)
    } else if (isLegendary) {
      this.drawLegendary(ctx, emote, themeColors, mouseX, mouseY)
    } else if (isEpic) {
      this.drawEpic(ctx, emote, themeColors)
    } else {
      this.drawNormal(ctx, emote, themeColors)
    }
  }

  /**
   * Render normal emote (common/rare)
   */
  private drawNormal(
    ctx: CanvasRenderingContext2D,
    emote: EmoteState,
    themeColors: ThemeColors
  ): void {
    ctx.save()

    // Apply scale and alpha
    ctx.globalAlpha = emote.alpha
    ctx.translate(emote.x, emote.y)
    ctx.scale(emote.scale, emote.scale)

    // Configure font
    const fontSize = this.config.fontSize * emote.scale
    ctx.font = `${fontSize}px ${this.config.fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Render based on theme
    const themeId = emote.theme
    switch (themeId) {
      case 'pixel':
        this.drawPixel(ctx, emote.text, themeColors)
        break
      case 'cyber':
      case 'neon':
        this.drawNeon(ctx, emote.text, themeColors)
        break
      case 'terminal':
        this.drawTerminal(ctx, emote.text, themeColors)
        break
      default:
        this.drawDefault(ctx, emote.text, themeColors)
    }

    ctx.restore()
  }

  /**
   * Render epic emote with enhanced effects
   */
  private drawEpic(
    ctx: CanvasRenderingContext2D,
    emote: EmoteState,
    themeColors: ThemeColors
  ): void {
    ctx.save()

    // Apply scale and alpha
    ctx.globalAlpha = emote.alpha
    ctx.translate(emote.x, emote.y)
    ctx.scale(emote.scale, emote.scale)

    // Epic pulse animation
    const pulsePhase = emote.pulsePhase || 0
    const pulse = 1 + Math.sin(pulsePhase) * 0.1 // 10% pulse

    // Draw epic aura (subtle ring)
    ctx.save()
    ctx.globalAlpha = 0.4 * emote.alpha
    ctx.strokeStyle = themeColors.accent
    ctx.lineWidth = 2
    ctx.shadowBlur = 15
    ctx.shadowColor = themeColors.accent
    const auraRadius = 35 * pulse
    ctx.beginPath()
    ctx.arc(0, 0, auraRadius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()

    // Draw simple particles around epic emote
    ctx.save()
    ctx.globalAlpha = 0.6 * emote.alpha
    const particleCount = 6
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + pulsePhase
      const radius = 25 + Math.sin(pulsePhase * 2 + i) * 5
      const px = Math.cos(angle) * radius
      const py = Math.sin(angle) * radius
      
      ctx.fillStyle = themeColors.primary
      ctx.shadowBlur = 8
      ctx.shadowColor = themeColors.primary
      ctx.beginPath()
      ctx.arc(px, py, 2, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()

    // Configure font with pulse
    const fontSize = this.config.fontSize * emote.scale * pulse
    ctx.font = `${fontSize}px ${this.config.fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Enhanced glow for epic
    const glowIntensity = this.config.glowIntensity * 2.5

    // Render based on theme with epic enhancements
    const themeId = emote.theme
    switch (themeId) {
      case 'pixel':
        this.drawEpicPixel(ctx, emote.text, themeColors, glowIntensity)
        break
      case 'cyber':
      case 'neon':
        this.drawEpicNeon(ctx, emote.text, themeColors, glowIntensity)
        break
      case 'terminal':
        this.drawEpicTerminal(ctx, emote.text, themeColors, glowIntensity)
        break
      default:
        this.drawEpicDefault(ctx, emote.text, themeColors, glowIntensity)
    }

    ctx.restore()
  }

  /**
   * Render unique emote (Product Owner) - ALL effects combined and enhanced
   */
  private drawUnique(
    ctx: CanvasRenderingContext2D,
    emote: EmoteState,
    themeColors: ThemeColors,
    mouseX?: number,
    mouseY?: number
  ): void {
    if (!emote.themeStyle) return

    const themeStyle = emote.themeStyle
    const reactivity = (emote.mouseReactivity || 0) + (emote.dropReactivity || 0)
    const baseX = emote.x + (emote.organicOffset?.x || 0)
    const baseY = emote.y + (emote.organicOffset?.y || 0)

    // Calculate entrance/exit animation (same as legendary but more dramatic)
    const entranceProgress = emote.entranceProgress !== undefined ? emote.entranceProgress : 1
    let entranceScale = 1
    if (entranceProgress < 1) {
      const eased = this.easeOutBack(entranceProgress)
      // Start at 40% scale for more dramatic entrance
      entranceScale = 0.4 + eased * 0.6
    }
    
    const exitAlpha = emote.exitProgress !== undefined
      ? Math.max(0.1, 1 - emote.exitProgress)
      : emote.alpha

    // UNIQUE: Enhanced trail (single layer but more visible)
    if (emote.trail && emote.trail.length > 1) {
      ctx.save()
      ctx.globalAlpha = exitAlpha * 0.9
      LegendaryEffects.renderTrail(ctx, emote.trail, themeStyle, themeColors)
      ctx.restore()
    }

    // UNIQUE: Enhanced particles (single render, but more visible)
    if (emote.particles && emote.particles.length > 0) {
      ctx.save()
      ctx.globalAlpha = exitAlpha * 1.0
      LegendaryEffects.renderParticles(ctx, emote.particles)
      ctx.restore()
    }

    // Main transform context
    ctx.save()
    ctx.globalAlpha = Math.max(0.3, exitAlpha)
    ctx.translate(baseX, baseY)
    const finalScale = Math.max(0.5, emote.scale * entranceScale)
    ctx.scale(finalScale, finalScale)

    // UNIQUE: Enhanced aura (single layer but more intense)
    if (emote.aura) {
      const pulsePhase = emote.pulsePhase || 0
      const pulse = 1 + Math.sin(pulsePhase * 2) * 0.2
      
      ctx.save()
      ctx.globalAlpha = 0.8 * exitAlpha * pulse
      LegendaryEffects.renderAura(ctx, 0, 0, emote.aura, themeStyle, themeColors)
      ctx.restore()
    }

    // UNIQUE: Crown badge (enhanced)
    this.drawUniqueBadge(ctx, themeStyle, themeColors, reactivity, emote.pulsePhase || 0)

    // UNIQUE: Enhanced text with multiple effects
    const reactiveSize = 1 + reactivity * 0.3 // More reactive than legendary
    const fontSize = this.config.fontSize * reactiveSize
    ctx.font = `${fontSize}px ${this.config.fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Render text with unique styling (all theme styles combined)
    this.drawUniqueText(ctx, emote.text, themeStyle, themeColors, reactivity, emote.pulsePhase || 0)

    ctx.restore()
  }

  /**
   * Render legendary emote with all special effects
   */
  private drawLegendary(
    ctx: CanvasRenderingContext2D,
    emote: EmoteState,
    themeColors: ThemeColors,
    mouseX?: number,
    mouseY?: number
  ): void {
    if (!emote.themeStyle) return

    const themeStyle = emote.themeStyle
    const reactivity = (emote.mouseReactivity || 0) + (emote.dropReactivity || 0)
    const baseX = emote.x + (emote.organicOffset?.x || 0)
    const baseY = emote.y + (emote.organicOffset?.y || 0)

    // Calculate entrance/exit animation
    // Ensure entrance scale never goes below 0.5 to keep text visible
    const entranceProgress = emote.entranceProgress !== undefined ? emote.entranceProgress : 1
    let entranceScale = 1
    if (entranceProgress < 1) {
      const eased = this.easeOutBack(entranceProgress)
      // Start at 50% scale, animate to 100% (never invisible)
      entranceScale = 0.5 + eased * 0.5
    }
    
    const exitAlpha = emote.exitProgress !== undefined
      ? Math.max(0.1, 1 - emote.exitProgress) // Never fully invisible
      : emote.alpha

    // Render trail first (in world coordinates, before transform)
    if (emote.trail && emote.trail.length > 1) {
      ctx.save()
      ctx.globalAlpha = exitAlpha * 0.6
      LegendaryEffects.renderTrail(ctx, emote.trail, themeStyle, themeColors)
      ctx.restore()
    }

    // Render particles (in world coordinates, before transform)
    if (emote.particles && emote.particles.length > 0) {
      ctx.save()
      ctx.globalAlpha = exitAlpha * 0.8
      LegendaryEffects.renderParticles(ctx, emote.particles)
      ctx.restore()
    }

    // Main transform context for emote
    ctx.save()
    // Ensure minimum visibility
    ctx.globalAlpha = Math.max(0.3, exitAlpha)
    ctx.translate(baseX, baseY)
    // Ensure minimum scale to keep text visible
    const finalScale = Math.max(0.5, emote.scale * entranceScale)
    ctx.scale(finalScale, finalScale)

    // Render aura (around emote center) - BEFORE text
    if (emote.aura) {
      ctx.save()
      ctx.globalAlpha = 0.7 * exitAlpha
      LegendaryEffects.renderAura(ctx, 0, 0, emote.aura, themeStyle, themeColors)
      ctx.restore()
    }

    // Render badge/crown
    this.drawLegendaryBadge(ctx, themeStyle, themeColors, reactivity)

    // Configure font with reactive size
    const reactiveSize = 1 + reactivity * 0.2
    const fontSize = this.config.fontSize * reactiveSize
    ctx.font = `${fontSize}px ${this.config.fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Render text with legendary styling
    this.drawLegendaryText(ctx, emote.text, themeStyle, themeColors, reactivity, emote.pulsePhase || 0)

    ctx.restore()
  }

  /**
   * Default rendering with glow
   */
  private drawDefault(
    ctx: CanvasRenderingContext2D,
    text: string,
    colors: ThemeColors
  ): void {
    // Glow
    ctx.shadowBlur = this.config.glowIntensity
    ctx.shadowColor = colors.primary
    ctx.fillStyle = colors.primary
    ctx.fillText(text, 0, 0)

    // Glitch if enabled
    if (this.config.glitchEnabled) {
      this.drawGlitch(ctx, text, colors)
    }

    // Scanlines if enabled
    if (this.config.scanlinesEnabled) {
      this.drawScanlines(ctx, colors)
    }
  }

  /**
   * Neon rendering with multiple layers
   */
  private drawNeon(
    ctx: CanvasRenderingContext2D,
    text: string,
    colors: ThemeColors
  ): void {
    // Layer 1: External glow (more diffuse)
    ctx.shadowBlur = this.config.glowIntensity * 2
    ctx.shadowColor = colors.primary
    ctx.fillStyle = colors.primary
    ctx.fillText(text, 0, 0)

    // Layer 2: Medium glow
    ctx.shadowBlur = this.config.glowIntensity
    ctx.shadowColor = colors.accent
    ctx.fillStyle = colors.accent
    ctx.fillText(text, 0, 0)

    // Layer 3: Solid text
    ctx.shadowBlur = 0
    ctx.fillStyle = colors.text
    ctx.fillText(text, 0, 0)

    // Glitch
    if (this.config.glitchEnabled) {
      this.drawGlitch(ctx, text, colors)
    }
  }

  /**
   * Pixel art rendering
   */
  private drawPixel(
    ctx: CanvasRenderingContext2D,
    text: string,
    colors: ThemeColors
  ): void {
    ctx.save()

    // Disable smoothing
    ctx.imageSmoothingEnabled = false

    // Scale for pixelation
    const pixelSize = 4
    ctx.scale(1 / pixelSize, 1 / pixelSize)
    ctx.translate(0, 0)

    // Render larger text
    const fontSize = this.config.fontSize * pixelSize
    ctx.font = `${fontSize}px ${this.config.fontFamily}`
    ctx.fillStyle = colors.primary
    ctx.shadowBlur = 4
    ctx.shadowColor = colors.primary
    ctx.fillText(text, 0, 0)

    // Re-enable smoothing
    ctx.imageSmoothingEnabled = true

    ctx.restore()
  }

  /**
   * Terminal minimal rendering
   */
  private drawTerminal(
    ctx: CanvasRenderingContext2D,
    text: string,
    colors: ThemeColors
  ): void {
    // Simple text with subtle glow
    ctx.shadowBlur = 4
    ctx.shadowColor = colors.primary
    ctx.fillStyle = colors.text
    ctx.fillText(text, 0, 0)
  }

  /**
   * Glitch effect (duplication with offset)
   */
  private drawGlitch(
    ctx: CanvasRenderingContext2D,
    text: string,
    colors: ThemeColors
  ): void {
    ctx.save()

    // Random offset
    const offsetX = (Math.random() - 0.5) * 2
    const offsetY = (Math.random() - 0.5) * 2

    // Duplicate with offset and alternate color
    ctx.globalAlpha = 0.5
    ctx.fillStyle = colors.accent
    ctx.shadowBlur = 0
    ctx.fillText(text, offsetX, offsetY)

    ctx.restore()
  }

  /**
   * Horizontal scanlines
   */
  private drawScanlines(
    ctx: CanvasRenderingContext2D,
    colors: ThemeColors
  ): void {
    ctx.save()

    const spacing = 4
    const lineWidth = 1
    const alpha = 0.1

    ctx.strokeStyle = colors.primary
    ctx.globalAlpha = alpha
    ctx.lineWidth = lineWidth

    // Approximate text height
    const bounds = ctx.measureText('M')
    const height =
      bounds.actualBoundingBoxAscent + bounds.actualBoundingBoxDescent

    for (let y = -height / 2; y < height / 2; y += spacing) {
      ctx.beginPath()
      ctx.moveTo(-50, y)
      ctx.lineTo(50, y)
      ctx.stroke()
    }

    ctx.restore()
  }

  /**
   * Draw legendary text with theme-specific styling
   */
  private drawLegendaryText(
    ctx: CanvasRenderingContext2D,
    text: string,
    themeStyle: string,
    colors: ThemeColors,
    reactivity: number,
    pulsePhase: number
  ): void {
    const glowIntensity = this.config.glowIntensity * (1.5 + reactivity * 0.5 + Math.sin(pulsePhase) * 0.3)

    switch (themeStyle) {
      case 'neon':
        // Multiple neon layers with pulsing
        ctx.shadowBlur = glowIntensity * 3
        ctx.shadowColor = colors.primary
        ctx.fillStyle = colors.primary
        ctx.fillText(text, 0, 0)

        ctx.shadowBlur = glowIntensity * 2
        ctx.shadowColor = colors.accent
        ctx.fillStyle = colors.accent
        ctx.fillText(text, 0, 0)

        ctx.shadowBlur = glowIntensity
        ctx.fillStyle = colors.text
        ctx.fillText(text, 0, 0)
        break

      case 'pixel':
        ctx.imageSmoothingEnabled = false
        const pixelSize = 4
        ctx.scale(1 / pixelSize, 1 / pixelSize)
        const fontSize = this.config.fontSize * pixelSize
        ctx.font = `${fontSize}px ${this.config.fontFamily}`
        ctx.fillStyle = colors.primary
        ctx.shadowBlur = 8
        ctx.shadowColor = colors.primary
        ctx.fillText(text, 0, 0)
        ctx.imageSmoothingEnabled = true
        break

      case 'hacker':
        // Matrix-style with glitch
        ctx.shadowBlur = glowIntensity
        ctx.shadowColor = '#00ff00'
        ctx.fillStyle = '#00ff00'
        ctx.fillText(text, 0, 0)

        // Glitch duplicate
        ctx.globalAlpha = 0.5
        ctx.fillStyle = colors.accent
        ctx.fillText(text, Math.sin(pulsePhase) * 2, Math.cos(pulsePhase) * 2)
        ctx.globalAlpha = 1
        break

      case 'glitch':
        // Multiple glitch layers
        ctx.shadowBlur = glowIntensity
        ctx.shadowColor = colors.primary
        ctx.fillStyle = colors.primary
        ctx.fillText(text, 0, 0)

        ctx.globalAlpha = 0.6
        ctx.fillStyle = colors.accent
        ctx.fillText(text, Math.sin(pulsePhase * 2) * 3, Math.cos(pulsePhase * 2) * 3)

        ctx.globalAlpha = 0.3
        ctx.fillStyle = colors.text
        ctx.fillText(text, -Math.sin(pulsePhase * 2) * 3, -Math.cos(pulsePhase * 2) * 3)
        ctx.globalAlpha = 1
        break

      default:
        // Enhanced default
        ctx.shadowBlur = glowIntensity * 2
        ctx.shadowColor = colors.primary
        ctx.fillStyle = colors.primary
        ctx.fillText(text, 0, 0)
    }
  }

  /**
   * Draw legendary badge/crown
   */
  private drawLegendaryBadge(
    ctx: CanvasRenderingContext2D,
    themeStyle: string,
    colors: ThemeColors,
    reactivity: number
  ): void {
    ctx.save()
    ctx.translate(0, -this.config.fontSize * 0.8)

    const badgeSize = 12 + reactivity * 4
    const pulse = Math.sin(Date.now() * 0.005) * 0.2 + 1

    switch (themeStyle) {
      case 'pixel':
        // Pixel crown
        ctx.imageSmoothingEnabled = false
        ctx.fillStyle = colors.primary
        ctx.fillRect(-badgeSize / 2, -badgeSize / 2, badgeSize, badgeSize)
        // Crown points
        for (let i = 0; i < 3; i++) {
          const x = -badgeSize / 2 + (badgeSize / 2) * i
          ctx.fillRect(x, -badgeSize / 2 - 4, 4, 4)
        }
        ctx.imageSmoothingEnabled = true
        break

      case 'neon':
        // Neon crown
        ctx.strokeStyle = colors.primary
        ctx.lineWidth = 2
        ctx.shadowBlur = 10 * pulse
        ctx.shadowColor = colors.primary
        ctx.beginPath()
        ctx.moveTo(-badgeSize / 2, badgeSize / 2)
        ctx.lineTo(0, -badgeSize / 2)
        ctx.lineTo(badgeSize / 2, badgeSize / 2)
        ctx.stroke()
        break

      case 'hacker':
        // Hacker badge
        ctx.strokeStyle = '#00ff00'
        ctx.lineWidth = 1
        ctx.strokeRect(-badgeSize / 2, -badgeSize / 2, badgeSize, badgeSize)
        ctx.fillStyle = '#00ff00'
        ctx.font = '8px monospace'
        ctx.fillText('★', -4, 4)
        break

      case 'glitch':
        // Glitch badge
        ctx.globalAlpha = 0.8
        ctx.fillStyle = colors.accent
        ctx.fillRect(-badgeSize / 2, -badgeSize / 2, badgeSize, badgeSize)
        ctx.globalAlpha = 0.5
        ctx.fillStyle = colors.primary
        ctx.fillRect(-badgeSize / 2 + 2, -badgeSize / 2 + 2, badgeSize - 4, badgeSize - 4)
        ctx.globalAlpha = 1
        break

      default:
        // Golden aura
        ctx.strokeStyle = colors.primary
        ctx.lineWidth = 2
        ctx.shadowBlur = 8
        ctx.shadowColor = colors.primary
        ctx.beginPath()
        ctx.arc(0, 0, badgeSize / 2, 0, Math.PI * 2)
        ctx.stroke()
    }

    ctx.restore()
  }

  /**
   * Draw unique badge (Product Owner crown - enhanced)
   */
  private drawUniqueBadge(
    ctx: CanvasRenderingContext2D,
    themeStyle: string,
    colors: ThemeColors,
    reactivity: number,
    pulsePhase: number
  ): void {
    const pulse = 1 + Math.sin(pulsePhase * 2) * 0.2
    const badgeSize = (20 + reactivity * 5) * pulse
    
    ctx.save()
    ctx.translate(0, -this.config.fontSize * 0.8)
    
    // Multiple glow layers
    ctx.shadowBlur = 20
    ctx.shadowColor = colors.accent
    ctx.strokeStyle = colors.accent
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(0, 0, badgeSize / 2, 0, Math.PI * 2)
    ctx.stroke()
    
    // Inner golden ring
    ctx.shadowBlur = 15
    ctx.shadowColor = '#ffd700'
    ctx.strokeStyle = '#ffd700'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(0, 0, badgeSize / 2 - 3, 0, Math.PI * 2)
    ctx.stroke()
    
    // Crown shape
    ctx.fillStyle = '#ffd700'
    ctx.shadowBlur = 10
    ctx.shadowColor = '#ffd700'
    ctx.beginPath()
    ctx.moveTo(-badgeSize / 3, badgeSize / 4)
    ctx.lineTo(0, -badgeSize / 4)
    ctx.lineTo(badgeSize / 3, badgeSize / 4)
    ctx.lineTo(-badgeSize / 3, badgeSize / 4)
    ctx.fill()
    
    // Star in center
    ctx.fillStyle = colors.primary
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2
      const x = Math.cos(angle) * 3
      const y = Math.sin(angle) * 3
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fill()
    
    ctx.restore()
  }

  /**
   * Draw unique text with all effects combined
   */
  private drawUniqueText(
    ctx: CanvasRenderingContext2D,
    text: string,
    themeStyle: string,
    colors: ThemeColors,
    reactivity: number,
    pulsePhase: number
  ): void {
    const pulse = 1 + Math.sin(pulsePhase * 2) * 0.1
    const glowIntensity = this.config.glowIntensity * 3 * pulse * (1 + reactivity * 0.3)

    // UNIQUE: Enhanced text with fewer layers (optimized)
    // Outer glow layer
    ctx.shadowBlur = glowIntensity * 3
    ctx.shadowColor = colors.accent
    ctx.fillStyle = colors.accent
    ctx.fillText(text, 0, 0)

    // Primary layer
    ctx.shadowBlur = glowIntensity * 2
    ctx.shadowColor = colors.primary
    ctx.fillStyle = colors.primary
    ctx.fillText(text, 0, 0)

    // Single glitch duplicate (reduced from 2)
    ctx.globalAlpha = 0.5
    ctx.fillStyle = '#00ff00'
    ctx.fillText(text, Math.sin(pulsePhase * 2) * 3, Math.cos(pulsePhase * 2) * 3)
    ctx.globalAlpha = 1

    // Final text layer
    ctx.shadowBlur = glowIntensity
    ctx.fillStyle = colors.text
    ctx.fillText(text, 0, 0)
  }

  /**
   * Epic rendering methods with enhanced effects
   */
  private drawEpicDefault(
    ctx: CanvasRenderingContext2D,
    text: string,
    colors: ThemeColors,
    glowIntensity: number
  ): void {
    // Triple layer glow for epic
    ctx.shadowBlur = glowIntensity * 2
    ctx.shadowColor = colors.accent
    ctx.fillStyle = colors.accent
    ctx.fillText(text, 0, 0)

    ctx.shadowBlur = glowIntensity * 1.5
    ctx.shadowColor = colors.primary
    ctx.fillStyle = colors.primary
    ctx.fillText(text, 0, 0)

    ctx.shadowBlur = glowIntensity
    ctx.fillStyle = colors.text
    ctx.fillText(text, 0, 0)
  }

  private drawEpicNeon(
    ctx: CanvasRenderingContext2D,
    text: string,
    colors: ThemeColors,
    glowIntensity: number
  ): void {
    // Enhanced neon with accent color
    ctx.shadowBlur = glowIntensity * 3
    ctx.shadowColor = colors.accent
    ctx.fillStyle = colors.accent
    ctx.fillText(text, 0, 0)

    ctx.shadowBlur = glowIntensity * 2
    ctx.shadowColor = colors.primary
    ctx.fillStyle = colors.primary
    ctx.fillText(text, 0, 0)

    ctx.shadowBlur = glowIntensity
    ctx.fillStyle = colors.text
    ctx.fillText(text, 0, 0)
  }

  private drawEpicPixel(
    ctx: CanvasRenderingContext2D,
    text: string,
    colors: ThemeColors,
    glowIntensity: number
  ): void {
    ctx.imageSmoothingEnabled = false
    const pixelSize = 4
    ctx.scale(1 / pixelSize, 1 / pixelSize)
    const fontSize = this.config.fontSize * pixelSize
    ctx.font = `${fontSize}px ${this.config.fontFamily}`
    
    // Epic pixel glow
    ctx.shadowBlur = 12
    ctx.shadowColor = colors.accent
    ctx.fillStyle = colors.accent
    ctx.fillText(text, 0, 0)
    
    ctx.shadowBlur = 8
    ctx.fillStyle = colors.primary
    ctx.fillText(text, 0, 0)
    
    ctx.imageSmoothingEnabled = true
  }

  private drawEpicTerminal(
    ctx: CanvasRenderingContext2D,
    text: string,
    colors: ThemeColors,
    glowIntensity: number
  ): void {
    // Terminal with epic green glow
    ctx.shadowBlur = glowIntensity * 2
    ctx.shadowColor = '#00ff00'
    ctx.fillStyle = '#00ff00'
    ctx.fillText(text, 0, 0)

    ctx.shadowBlur = glowIntensity
    ctx.fillStyle = colors.text
    ctx.fillText(text, 0, 0)
  }

  /**
   * Easing function: ease-out-back (with slight overshoot)
   */
  private easeOutBack(t: number): number {
    if (t <= 0) return 0
    if (t >= 1) return 1
    
    const c1 = 1.70158
    const c3 = c1 + 1
    const result = 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
    // Clamp to prevent excessive overshoot
    return Math.max(0, Math.min(1.1, result))
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<EmoteRenderConfig>): void {
    this.config = { ...this.config, ...config }
  }
}

