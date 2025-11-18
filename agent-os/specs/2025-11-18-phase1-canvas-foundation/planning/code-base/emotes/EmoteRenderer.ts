/**
 * EmoteRenderer
 * 
 * Renderiza emotes procedurais no canvas sem imagens externas.
 * Suporta efeitos: glow, glitch, pixelation, scanlines.
 */

import { EmoteState, EmoteRenderConfig, ThemeId } from '../interfaces'
import { getThemeColors } from '../theme-utils'

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
   * Renderiza emote no canvas
   */
  draw(
    ctx: CanvasRenderingContext2D,
    emote: EmoteState,
    themeId: ThemeId
  ): void {
    if (!emote.isActive) return

    ctx.save()

    // Obter cores do tema
    const themeColors = getThemeColors(themeId)

    // Aplicar escala e alpha
    ctx.globalAlpha = emote.alpha
    ctx.translate(emote.x, emote.y)
    ctx.scale(emote.scale, emote.scale)

    // Configurar fonte
    const fontSize = this.config.fontSize * emote.scale
    ctx.font = `${fontSize}px ${this.config.fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Renderizar baseado no tema
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
   * Renderização padrão com glow
   */
  private drawDefault(
    ctx: CanvasRenderingContext2D,
    text: string,
    colors: any
  ): void {
    // Glow
    ctx.shadowBlur = this.config.glowIntensity
    ctx.shadowColor = colors.primary
    ctx.fillStyle = colors.primary
    ctx.fillText(text, 0, 0)

    // Glitch se habilitado
    if (this.config.glitchEnabled) {
      this.drawGlitch(ctx, text, colors)
    }

    // Scanlines se habilitado
    if (this.config.scanlinesEnabled) {
      this.drawScanlines(ctx, colors)
    }
  }

  /**
   * Renderização neon com múltiplas camadas
   */
  private drawNeon(
    ctx: CanvasRenderingContext2D,
    text: string,
    colors: any
  ): void {
    // Camada 1: Glow externo (mais difuso)
    ctx.shadowBlur = this.config.glowIntensity * 2
    ctx.shadowColor = colors.primary
    ctx.fillStyle = colors.primary
    ctx.fillText(text, 0, 0)

    // Camada 2: Glow médio
    ctx.shadowBlur = this.config.glowIntensity
    ctx.shadowColor = colors.accent
    ctx.fillStyle = colors.accent
    ctx.fillText(text, 0, 0)

    // Camada 3: Texto sólido
    ctx.shadowBlur = 0
    ctx.fillStyle = colors.text
    ctx.fillText(text, 0, 0)

    // Glitch
    if (this.config.glitchEnabled) {
      this.drawGlitch(ctx, text, colors)
    }
  }

  /**
   * Renderização pixel art
   */
  private drawPixel(
    ctx: CanvasRenderingContext2D,
    text: string,
    colors: any
  ): void {
    // Desabilitar suavização
    ctx.imageSmoothingEnabled = false

    // Escalar para pixelation
    const pixelSize = 4
    ctx.scale(1 / pixelSize, 1 / pixelSize)
    ctx.translate(0, 0)

    // Renderizar texto maior
    const fontSize = this.config.fontSize * pixelSize
    ctx.font = `${fontSize}px ${this.config.fontFamily}`
    ctx.fillStyle = colors.primary
    ctx.shadowBlur = 4
    ctx.shadowColor = colors.primary
    ctx.fillText(text, 0, 0)

    // Reabilitar suavização
    ctx.imageSmoothingEnabled = true
  }

  /**
   * Renderização terminal minimal
   */
  private drawTerminal(
    ctx: CanvasRenderingContext2D,
    text: string,
    colors: any
  ): void {
    // Texto simples com glow sutil
    ctx.shadowBlur = 4
    ctx.shadowColor = colors.primary
    ctx.fillStyle = colors.text
    ctx.fillText(text, 0, 0)
  }

  /**
   * Efeito glitch (duplicação com offset)
   */
  private drawGlitch(
    ctx: CanvasRenderingContext2D,
    text: string,
    colors: any
  ): void {
    ctx.save()

    // Offset aleatório
    const offsetX = (Math.random() - 0.5) * 2
    const offsetY = (Math.random() - 0.5) * 2

    // Duplicar com offset e cor alternativa
    ctx.globalAlpha = 0.5
    ctx.fillStyle = colors.accent
    ctx.shadowBlur = 0
    ctx.fillText(text, offsetX, offsetY)

    ctx.restore()
  }

  /**
   * Scanlines horizontais
   */
  private drawScanlines(
    ctx: CanvasRenderingContext2D,
    colors: any
  ): void {
    ctx.save()

    const spacing = 4
    const lineWidth = 1
    const alpha = 0.1

    ctx.strokeStyle = colors.primary
    ctx.globalAlpha = alpha
    ctx.lineWidth = lineWidth

    const bounds = ctx.measureText('M') // Aproximação da altura
    const height = bounds.actualBoundingBoxAscent + bounds.actualBoundingBoxDescent

    for (let y = -height / 2; y < height / 2; y += spacing) {
      ctx.beginPath()
      ctx.moveTo(-50, y)
      ctx.lineTo(50, y)
      ctx.stroke()
    }

    ctx.restore()
  }

  /**
   * Atualiza configuração
   */
  updateConfig(config: Partial<EmoteRenderConfig>): void {
    this.config = { ...this.config, ...config }
  }
}

