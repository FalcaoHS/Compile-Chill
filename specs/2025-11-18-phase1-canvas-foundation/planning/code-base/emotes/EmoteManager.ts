/**
 * EmoteManager
 * 
 * Gerencia spawn, update e renderização de emotes.
 */

import { EmoteState, EmoteManagerConfig, ThemeId } from '../interfaces'
import { EmoteRenderer } from './EmoteRenderer'

export class EmoteManager {
  private config: EmoteManagerConfig
  private emotes: EmoteState[] = []
  private renderer: EmoteRenderer

  constructor(config: EmoteManagerConfig, renderer: EmoteRenderer) {
    this.config = config
    this.renderer = renderer
  }

  /**
   * Spawna emote no chat
   */
  spawnChat(text: string, x: number, y: number, theme: ThemeId): string {
    const id = `emote-${Date.now()}-${Math.random()}`
    
    const emote: EmoteState = {
      id,
      text,
      x,
      y,
      scale: 0.5, // Começa pequeno
      alpha: 1,
      life: this.config.chatDuration,
      maxLife: this.config.chatDuration,
      isActive: true,
      theme,
      glitchOffset: 0,
    }

    this.emotes.push(emote)
    return id
  }

  /**
   * Spawna emote no multiplayer (acima do jogador)
   */
  spawnMultiplayer(
    text: string,
    playerX: number,
    playerY: number,
    theme: ThemeId
  ): string {
    const id = `emote-${Date.now()}-${Math.random()}`
    
    const emote: EmoteState = {
      id,
      text,
      x: playerX,
      y: playerY - 40, // 40px acima do jogador
      scale: 1,
      alpha: 1,
      life: this.config.multiplayerDuration,
      maxLife: this.config.multiplayerDuration,
      isActive: true,
      theme,
      glitchOffset: 0,
    }

    this.emotes.push(emote)
    return id
  }

  /**
   * Atualiza todos os emotes
   */
  update(deltaTime: number, playerPosition?: { x: number; y: number }): void {
    this.emotes.forEach(emote => {
      if (!emote.isActive) return

      // Atualizar lifetime
      emote.life -= deltaTime

      if (emote.life <= 0) {
        emote.isActive = false
        return
      }

      // Animação de escala (chat)
      if (emote.scale < 1) {
        emote.scale = Math.min(1, emote.scale + 0.05 * (deltaTime / 16.67))
      }

      // Animação de fade-out
      const fadeStart = emote.maxLife * 0.3 // Começa a desaparecer nos últimos 30%
      if (emote.life < fadeStart) {
        emote.alpha = emote.life / fadeStart
      }

      // Atualizar glitch offset
      emote.glitchOffset = (Math.random() - 0.5) * 2

      // Seguir jogador (multiplayer)
      if (playerPosition && emote.y < playerPosition.y) {
        emote.x = playerPosition.x
        emote.y = playerPosition.y - 40
      }
    })

    // Remover emotes inativos
    this.emotes = this.emotes.filter(e => e.isActive)
  }

  /**
   * Renderiza todos os emotes
   */
  draw(ctx: CanvasRenderingContext2D, theme: ThemeId): void {
    this.emotes.forEach(emote => {
      this.renderer.draw(ctx, emote, theme)
    })
  }

  /**
   * Remove emote específico
   */
  remove(id: string): void {
    this.emotes = this.emotes.filter(e => e.id !== id)
  }

  /**
   * Limpa todos os emotes
   */
  clear(): void {
    this.emotes = []
  }

  /**
   * Obtém número de emotes ativos
   */
  getActiveCount(): number {
    return this.emotes.filter(e => e.isActive).length
  }
}

