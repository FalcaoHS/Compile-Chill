/**
 * EmoteManager
 * 
 * Manages spawn, update, and rendering of emotes.
 */

import { EmoteState, EmoteManagerConfig, ThemeColors, EmoteRarity } from './emote-types'
import type { ThemeId } from '@/lib/themes'
import { EmoteRenderer } from './EmoteRenderer'
import { LegendaryEffects } from './LegendaryEffects'
import { getEmoteById, getAllEmotes } from './emote-loader'

export class EmoteManager {
  private config: EmoteManagerConfig
  private emotes: EmoteState[] = []
  private renderer: EmoteRenderer
  private getThemeColors: () => ThemeColors | null

  constructor(
    config: EmoteManagerConfig,
    renderer: EmoteRenderer,
    getThemeColors: () => ThemeColors | null
  ) {
    this.config = config
    this.renderer = renderer
    this.getThemeColors = getThemeColors
  }

  /**
   * Spawn chat emote
   */
  spawnChat(text: string, x: number, y: number, theme: ThemeId, emoteId?: string): string {
    // Check max active emotes
    const activeCount = this.emotes.filter((e) => e.isActive).length
    if (activeCount >= this.config.maxActiveEmotes) {
      // Remove oldest emote
      const oldest = this.emotes.find((e) => e.isActive)
      if (oldest) {
        oldest.isActive = false
      }
    }

    const id = `emote-${Date.now()}-${Math.random()}`

    // Try to get emote data if ID provided
    let emoteData = null
    if (emoteId) {
      emoteData = getEmoteById(emoteId)
      if (!emoteData) {
        // Try to find by text/label as fallback
        const allEmotes = getAllEmotes()
        emoteData = allEmotes.find((e) => e.label === text || e.id === emoteId || e.id === text) || null
      }
    }
    
    const rarity = emoteData?.rarity as EmoteRarity | undefined
    const themeStyle = emoteData?.themeStyle

    const emote: EmoteState = {
      id,
      text,
      x,
      y,
      scale: rarity === 'legendary' ? 1 : 0.5, // Legendary starts at full scale (entrance handled by entranceScale)
      alpha: 1,
      life: this.config.chatDuration,
      maxLife: this.config.chatDuration,
      isActive: true,
      theme,
      glitchOffset: 0,
      // Animation state
      animationTime: 0,
      organicOffset: { x: 0, y: 0 },
      pulsePhase: 0,
      // Legendary properties
      rarity,
      themeStyle,
      entranceProgress: 0,
    }

    // Initialize legendary/unique effects
    if ((rarity === 'legendary' || rarity === 'unique') && themeStyle && this.getThemeColors()) {
      const colors = this.getThemeColors()!
      // Unique gets more particles (but not too many to avoid lag)
      const particleCount = rarity === 'unique' ? 15 : 12
      emote.particles = LegendaryEffects.createParticles(x, y, themeStyle, colors, particleCount)
      emote.aura = LegendaryEffects.createAura(themeStyle)
      emote.trail = [LegendaryEffects.createTrailPoint(x, y)]
      emote.mouseReactivity = 0
      emote.dropReactivity = 0
    }

    this.emotes.push(emote)
    return id
  }

  /**
   * Spawn multiplayer emote (above player)
   */
  spawnMultiplayer(
    text: string,
    playerX: number,
    playerY: number,
    theme: ThemeId
  ): string {
    // Check max active emotes
    const activeCount = this.emotes.filter((e) => e.isActive).length
    if (activeCount >= this.config.maxActiveEmotes) {
      // Remove oldest emote
      const oldest = this.emotes.find((e) => e.isActive)
      if (oldest) {
        oldest.isActive = false
      }
    }

    const id = `emote-${Date.now()}-${Math.random()}`

    const emote: EmoteState = {
      id,
      text,
      x: playerX,
      y: playerY - 40, // 40px above player
      scale: 1,
      alpha: 1,
      life: this.config.multiplayerDuration,
      maxLife: this.config.multiplayerDuration,
      isActive: true,
      theme,
      glitchOffset: 0,
      animationTime: 0,
      organicOffset: { x: 0, y: 0 },
      pulsePhase: 0,
    }

    this.emotes.push(emote)
    return id
  }

  /**
   * Update all emotes
   */
  update(
    deltaTime: number,
    playerPosition?: { x: number; y: number },
    mouseX?: number,
    mouseY?: number
  ): void {
    this.emotes.forEach((emote) => {
      if (!emote.isActive) return

      // Update animation time
      emote.animationTime = (emote.animationTime || 0) + deltaTime

      // Update lifetime
      emote.life -= deltaTime

      // Handle exit animation for legendary/unique
      if ((emote.rarity === 'legendary' || emote.rarity === 'unique') && emote.life < 300) {
        emote.exitProgress = 1 - emote.life / 300
        if (emote.life <= 0) {
          emote.isActive = false
          return
        }
      } else if (emote.life <= 0) {
        emote.isActive = false
        return
      }

      // Entrance animation for legendary/unique
      if ((emote.rarity === 'legendary' || emote.rarity === 'unique') && emote.entranceProgress !== undefined) {
        // Unique has longer, more dramatic entrance
        const entranceDuration = emote.rarity === 'unique' ? 700 : 500
        emote.entranceProgress = Math.min(1, emote.animationTime / entranceDuration)
        // Keep scale at 1 (entrance handled by entranceScale)
        emote.scale = 1
      } else {
        // Scale animation (non-legendary chat)
        if (emote.scale < 1) {
          emote.scale = Math.min(1, emote.scale + 0.05 * (deltaTime / 16.67))
        }
      }

      // Fade-out animation (non-legendary)
      if (emote.rarity !== 'legendary') {
        const fadeStart = emote.maxLife * 0.3
        if (emote.life < fadeStart) {
          emote.alpha = emote.life / fadeStart
        }
      }

      // Update glitch offset
      emote.glitchOffset = (Math.random() - 0.5) * 2

      // Update pulse phase
      emote.pulsePhase = (emote.pulsePhase || 0) + deltaTime * 0.01

      // Organic motion (legendary/unique)
      if (emote.rarity === 'legendary' || emote.rarity === 'unique') {
        const time = emote.animationTime * 0.001
        // Unique has more pronounced motion
        const motionScale = emote.rarity === 'unique' ? 3 : 2
        emote.organicOffset = {
          x: Math.sin(time * 0.5) * motionScale,
          y: Math.cos(time * 0.7) * motionScale,
        }
      }

      // Update mouse reactivity (legendary/unique)
      if ((emote.rarity === 'legendary' || emote.rarity === 'unique') && mouseX !== undefined && mouseY !== undefined) {
        const dx = mouseX - emote.x
        const dy = mouseY - emote.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        // Unique has larger reactivity range
        const maxDistance = emote.rarity === 'unique' ? 200 : 150
        emote.mouseReactivity = Math.max(0, 1 - distance / maxDistance)
      } else if (emote.rarity === 'legendary' || emote.rarity === 'unique') {
        // Decay reactivity
        emote.mouseReactivity = (emote.mouseReactivity || 0) * 0.95
      }

      // Decay drop reactivity
      if (emote.rarity === 'legendary' || emote.rarity === 'unique') {
        emote.dropReactivity = (emote.dropReactivity || 0) * 0.98
      }

      // Update legendary/unique effects
      if (emote.rarity === 'legendary' || emote.rarity === 'unique') {
        // Update particles
        if (emote.particles) {
          const centerX = emote.x + (emote.organicOffset?.x || 0)
          const centerY = emote.y + (emote.organicOffset?.y || 0)
          
          const initialParticleCount = emote.particles.length
          emote.particles = emote.particles.map(particle => {
            // Update position and velocity
            const newX = particle.x + particle.vx * deltaTime
            const newY = particle.y + particle.vy * deltaTime
            
            return {
              ...particle,
              x: newX,
              y: newY,
              vx: particle.vx * 0.99, // Slow decay
              vy: particle.vy * 0.99,
              rotation: particle.rotation + particle.rotationSpeed * deltaTime,
              life: particle.life - deltaTime,
            }
          }).filter(p => p.life > 0)
          
          // Deallocate dead particles from budget
          const deadParticleCount = initialParticleCount - emote.particles.length
          if (deadParticleCount > 0) {
            try {
              const { deallocateParticles } = require('@/lib/performance/particle-budget')
              deallocateParticles('emotes_legendary', deadParticleCount)
            } catch (e) {
              // Budget system not available, skip deallocation
            }
          }
          
          // Replenish particles if needed (unique needs more, but limit to avoid lag)
          const minParticles = emote.rarity === 'unique' ? 12 : 8
          const maxParticles = emote.rarity === 'unique' ? 15 : 12
          
          // Limit total particles to prevent lag
          if (emote.particles.length > maxParticles) {
            emote.particles = emote.particles.slice(0, maxParticles)
          }
          if (emote.particles.length < minParticles && this.getThemeColors()) {
            const colors = this.getThemeColors()!
            const newParticles = LegendaryEffects.createParticles(
              centerX,
              centerY,
              emote.themeStyle!,
              colors,
              minParticles - emote.particles.length
            )
            emote.particles.push(...newParticles)
          }
        }

        // Update aura
        if (emote.aura) {
          const reactivity = (emote.mouseReactivity || 0) + (emote.dropReactivity || 0)
          LegendaryEffects.updateAura(emote.aura, deltaTime, reactivity)
        }

        // Update trail
        if (emote.trail) {
          // Add new trail point periodically
          const centerX = emote.x + (emote.organicOffset?.x || 0)
          const centerY = emote.y + (emote.organicOffset?.y || 0)
          
          if (Math.floor(emote.animationTime / 50) !== Math.floor((emote.animationTime - deltaTime) / 50)) {
            emote.trail.push(LegendaryEffects.createTrailPoint(centerX, centerY))
            // Limit trail length (unique can have slightly more, but not too much)
            const maxTrailLength = emote.rarity === 'unique' ? 12 : 10
            if (emote.trail.length > maxTrailLength) {
              emote.trail.shift()
            }
          }
          emote.trail = LegendaryEffects.updateTrail(emote.trail, deltaTime)
        }
      }

      // Follow player (multiplayer)
      if (playerPosition && emote.y < playerPosition.y) {
        emote.x = playerPosition.x
        emote.y = playerPosition.y - 40
      }
    })

    // Remove inactive emotes
    this.emotes = this.emotes.filter((e) => e.isActive)
  }

  /**
   * Render all emotes
   */
  draw(ctx: CanvasRenderingContext2D, theme: ThemeId, mouseX?: number, mouseY?: number): void {
    const themeColors = this.getThemeColors()
    this.emotes.forEach((emote) => {
      this.renderer.draw(ctx, emote, themeColors, mouseX, mouseY)
    })
  }

  /**
   * Trigger drop reactivity for legendary emotes
   */
  triggerDropReactivity(): void {
    this.emotes.forEach((emote) => {
      if (emote.rarity === 'legendary') {
        emote.dropReactivity = Math.min(1, (emote.dropReactivity || 0) + 0.5)
      }
    })
  }

  /**
   * Remove specific emote
   */
  remove(id: string): void {
    this.emotes = this.emotes.filter((e) => e.id !== id)
  }

  /**
   * Clear all emotes
   */
  clear(): void {
    this.emotes = []
  }

  /**
   * Get number of active emotes
   */
  getActiveCount(): number {
    return this.emotes.filter((e) => e.isActive).length
  }
}

