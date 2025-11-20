/**
 * DropManager
 * 
 * Gerencia spawn, update e renderização de todos os drops.
 * Controla frequência de spawn e mantém apenas 1 drop ativo por vez.
 */

import { Drop } from './Drop'
import { DropManagerConfig, DropRarity, DropShape, DropRarityConfig, GrantRewardCallback } from '../interfaces'
import { getDropRarityConfigs, getRandomRarity, getRandomShape } from './drop-config'

export class DropManager {
  private config: DropManagerConfig
  private drops: Drop[] = []
  private nextSpawnTime: number = 0
  private spawnTimer: number = 0
  private grantReward: GrantRewardCallback
  private getThemeColors: () => any

  constructor(
    config: DropManagerConfig,
    grantReward: GrantRewardCallback,
    getThemeColors: () => any
  ) {
    this.config = config
    this.grantReward = grantReward
    this.getThemeColors = getThemeColors
    this.scheduleNextSpawn()
  }

  /**
   * Agenda próximo spawn
   */
  private scheduleNextSpawn(): void {
    const interval = 
      this.config.spawnInterval.min + 
      Math.random() * (this.config.spawnInterval.max - this.config.spawnInterval.min)
    
    this.nextSpawnTime = Date.now() + interval
  }

  /**
   * Spawna um novo drop se possível
   */
  private spawnNext(): void {
    // Verificar se já existe drop ativo
    const activeDrops = this.drops.filter(d => d.isActive())
    if (activeDrops.length >= this.config.maxActiveDrops) {
      return
    }

    // Gerar posição X aleatória
    const x = this.config.canvasWidth * 0.2 + 
              Math.random() * (this.config.canvasWidth * 0.6)

    // Spawn no topo
    const y = 50

    // Escolher raridade e forma
    const rarity = getRandomRarity()
    const shape = getRandomShape()
    const rarityConfigs = getDropRarityConfigs()
    const rarityConfig = rarityConfigs[rarity]

    // Obter cores do tema
    const themeColors = this.getThemeColors()
    const colors = this.getColorsForRarity(rarity, rarityConfig, themeColors)

    // Criar drop
    const drop = new Drop(
      `drop-${Date.now()}-${Math.random()}`,
      x,
      y,
      shape,
      rarity,
      rarityConfig,
      colors
    )

    this.drops.push(drop)
    this.scheduleNextSpawn()
  }

  /**
   * Obtém cores para raridade baseado no tema
   */
  private getColorsForRarity(
    rarity: DropRarity,
    config: DropRarityConfig,
    themeColors: any
  ): string[] {
    if (Array.isArray(config.color)) {
      return config.color.map(c => this.resolveThemeColor(c, themeColors))
    }

    return [this.resolveThemeColor(config.color, themeColors)]
  }

  /**
   * Resolve cor do tema
   */
  private resolveThemeColor(colorKey: string, themeColors: any): string {
    // Se já é uma cor hex/rgb, retornar direto
    if (colorKey.startsWith('#') || colorKey.startsWith('rgb')) {
      return colorKey
    }

    // Mapear chaves para cores do tema
    const colorMap: Record<string, string> = {
      primary: themeColors.primary || '#00f5ff',
      accent: themeColors.accent || '#ff00ff',
      text: themeColors.text || '#ffffff',
    }

    return colorMap[colorKey] || themeColors.primary || '#00f5ff'
  }

  /**
   * Atualiza todos os drops
   */
  update(deltaTime: number): void {
    // Verificar se é hora de spawnar
    if (Date.now() >= this.nextSpawnTime) {
      this.spawnNext()
    }

    // Atualizar todos os drops
    this.drops.forEach(drop => {
      drop.update(deltaTime, this.config.floorY, this.config.canvasWidth)
    })

    // Remover drops inativos
    this.drops = this.drops.filter(drop => drop.isActive())
  }

  /**
   * Renderiza todos os drops
   */
  draw(ctx: CanvasRenderingContext2D): void {
    const themeColors = this.getThemeColors()
    this.drops.forEach(drop => {
      drop.draw(ctx, themeColors)
    })
  }

  /**
   * Handler de clique
   */
  handleClick(x: number, y: number): boolean {
    // Verificar cliques de trás para frente (último drop primeiro)
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const drop = this.drops[i]
      if (drop.onClick(x, y, (type, value) => {
        this.grantReward({ type, value, timestamp: Date.now() })
      })) {
        return true
      }
    }

    return false
  }

  /**
   * Limpa todos os drops
   */
  clear(): void {
    this.drops = []
    this.scheduleNextSpawn()
  }

  /**
   * Obtém número de drops ativos
   */
  getActiveCount(): number {
    return this.drops.filter(d => d.isActive()).length
  }
}

