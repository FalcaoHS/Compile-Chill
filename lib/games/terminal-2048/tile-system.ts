/**
 * Tile system for Terminal 2048
 * 
 * Maps tile values to dev-themed labels and icons
 */

export interface TileInfo {
  value: number
  label: string
  icon: string
  color: string
}

export const TILE_PROGRESSION: TileInfo[] = [
  { value: 2, label: '.txt', icon: '📄', color: 'text-muted' },
  { value: 4, label: '.js', icon: '📜', color: 'text-primary' },
  { value: 8, label: '.ts', icon: '📘', color: 'text-accent' },
  { value: 16, label: '.py', icon: '🐍', color: 'text-primary' },
  { value: 32, label: '.json', icon: '📋', color: 'text-accent' },
  { value: 64, label: '.md', icon: '📝', color: 'text-muted' },
  { value: 128, label: 'folder', icon: '📁', color: 'text-primary' },
  { value: 256, label: 'package.json', icon: '📦', color: 'text-accent' },
  { value: 512, label: 'node_modules', icon: '📚', color: 'text-primary' },
  { value: 1024, label: 'src/', icon: '💻', color: 'text-accent' },
  { value: 2048, label: 'dist/', icon: '🚀', color: 'text-primary' },
  { value: 4096, label: 'build/', icon: '🏗️', color: 'text-accent' },
  { value: 8192, label: 'deploy/', icon: '🌐', color: 'text-primary' },
  { value: 16384, label: 'production', icon: '⭐', color: 'text-accent' },
  { value: 32768, label: 'master', icon: '👑', color: 'text-primary' },
]

/**
 * Get tile info from value
 */
export function getTileInfo(value: number): TileInfo {
  const tile = TILE_PROGRESSION.find(t => t.value === value)
  if (tile) {
    return tile
  }
  
  // For values beyond progression, use highest tier
  const highest = TILE_PROGRESSION[TILE_PROGRESSION.length - 1]
  return {
    ...highest,
    label: `${highest.label}+`,
    value,
  }
}

/**
 * Get tile label from value
 */
export function getTileLabel(value: number): string {
  return getTileInfo(value).label
}

/**
 * Get tile icon from value
 */
export function getTileIcon(value: number): string {
  return getTileInfo(value).icon
}

/**
 * Check if value is a power of 2 (valid tile value)
 */
export function isValidTileValue(value: number): boolean {
  return value > 0 && (value & (value - 1)) === 0
}

