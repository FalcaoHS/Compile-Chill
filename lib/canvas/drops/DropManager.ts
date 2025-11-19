/**
 * DropManager
 * 
 * Manages spawn, update, and rendering of all drops.
 * Controls spawn frequency and maintains only 1 active drop at a time.
 */

import { Drop } from './Drop'
import {
  DropManagerConfig,
  DropRarity,
  DropShape,
  DropRarityConfig,
  GrantRewardCallback,
  DropRewardType,
} from './types'
import {
  getDropRarityConfigs,
  getRandomRarity,
  getRandomShape,
} from './drop-config'

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

export class DropManager {
  private config: DropManagerConfig
  private drops: Drop[] = []
  private nextSpawnTime: number = 0
  private grantReward: GrantRewardCallback
  private getThemeColors: () => ThemeColors | null

  constructor(
    config: DropManagerConfig,
    grantReward: GrantRewardCallback,
    getThemeColors: () => ThemeColors | null
  ) {
    this.config = config
    this.grantReward = grantReward
    this.getThemeColors = getThemeColors
    this.scheduleNextSpawn()
  }

  /**
   * Schedule next spawn
   */
  private scheduleNextSpawn(): void {
    const interval =
      this.config.spawnInterval.min +
      Math.random() * (this.config.spawnInterval.max - this.config.spawnInterval.min)

    this.nextSpawnTime = Date.now() + interval
  }

  /**
   * Spawn a new drop if possible
   */
  private spawnNext(): void {
    // Check if there's already an active drop
    const activeDrops = this.drops.filter((d) => d.isActive())
    if (activeDrops.length >= this.config.maxActiveDrops) {
      return
    }

    // Generate random X position (20% to 80% of canvas width)
    const x =
      this.config.canvasWidth * 0.2 +
      Math.random() * (this.config.canvasWidth * 0.6)

    // Spawn at top
    const y = 50

    // Choose rarity and shape
    const rarity = getRandomRarity()
    const shape = getRandomShape()
    const rarityConfigs = getDropRarityConfigs()
    const rarityConfig = rarityConfigs[rarity]

    // Get theme colors
    const themeColors = this.getThemeColors()
    if (!themeColors) {
      
      return
    }

    const colors = this.getColorsForRarity(rarity, rarityConfig, themeColors)

    // Create drop
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
   * Get colors for rarity based on theme
   */
  private getColorsForRarity(
    rarity: DropRarity,
    config: DropRarityConfig,
    themeColors: ThemeColors
  ): string[] {
    if (Array.isArray(config.color)) {
      return config.color.map((c) => this.resolveThemeColor(c, themeColors))
    }

    return [this.resolveThemeColor(config.color, themeColors)]
  }

  /**
   * Resolve theme color
   */
  private resolveThemeColor(colorKey: string, themeColors: ThemeColors): string {
    // If already a hex/rgb color, return directly
    if (colorKey.startsWith('#') || colorKey.startsWith('rgb')) {
      return colorKey
    }

    // Map keys to theme colors
    const colorMap: Record<string, string> = {
      primary: themeColors.primary || '#00f5ff',
      accent: themeColors.accent || '#ff00ff',
      text: themeColors.text || '#ffffff',
    }

    return colorMap[colorKey] || themeColors.primary || '#00f5ff'
  }

  /**
   * Update all drops
   */
  update(deltaTime: number): void {
    // Check if it's time to spawn
    if (Date.now() >= this.nextSpawnTime) {
      this.spawnNext()
    }

    // Update all drops
    this.drops.forEach((drop) => {
      drop.update(
        deltaTime,
        this.config.floorY,
        this.config.canvasWidth
      )
    })

    // Remove inactive drops
    this.drops = this.drops.filter((drop) => drop.isActive())
  }

  /**
   * Render all drops
   */
  draw(ctx: CanvasRenderingContext2D): void {
    const themeColors = this.getThemeColors()
    this.drops.forEach((drop) => {
      drop.draw(ctx, themeColors)
    })
  }

  /**
   * Handle click event
   */
  handleClick(x: number, y: number): boolean {
    // Check clicks from back to front (last drop first)
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const drop = this.drops[i]
      if (
        drop.onClick(x, y, (type, value) => {
          this.grantReward({ type: type as DropRewardType, value, timestamp: Date.now() })
        })
      ) {
        return true
      }
    }

    return false
  }

  /**
   * Clear all drops
   */
  clear(): void {
    this.drops = []
    this.scheduleNextSpawn()
  }

  /**
   * Get number of active drops
   */
  getActiveCount(): number {
    return this.drops.filter((d) => d.isActive()).length
  }
}

