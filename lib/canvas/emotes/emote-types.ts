/**
 * Types and interfaces for Emotes System
 * 
 * Defines all types needed for procedural emote rendering
 */

import { ThemeId } from '@/lib/themes'

/**
 * Emote type identifiers
 */
export type EmoteType =
  | 'rage'
  | 'segfault'
  | '404'
  | 'rmrf'
  | 'compile'
  | 'deploy'
  | 'merge_conflict'
  | 'stack_overflow'
  | 'custom'

/**
 * Emote text mapping
 */
export const EMOTE_TEXT_MAP: Record<EmoteType, string> = {
  rage: '</rage>',
  segfault: ':segfault:',
  '404': '404_face_not_found',
  rmrf: 'rm -rf lol',
  compile: ':compile:',
  deploy: ':deploy:',
  merge_conflict: ':merge_conflict:',
  stack_overflow: ':stack_overflow:',
  custom: '',
}

/**
 * Emote rarity
 */
export type EmoteRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'unique'

/**
 * Emote theme style
 */
export type EmoteThemeStyle = 'pixel' | 'neon' | 'hacker' | 'mono' | 'glitch'

/**
 * Legendary particle type
 */
export type LegendaryParticleType = 'neon_triangle' | 'hacker_bit' | 'pixel_square' | 'glitch_fragment' | 'terminal_spark'

/**
 * Legendary particle
 */
export interface LegendaryParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  type: LegendaryParticleType
  color: string
  rotation: number
  rotationSpeed: number
}

/**
 * Legendary aura state
 */
export interface LegendaryAura {
  pulsePhase: number
  rings: Array<{
    radius: number
    alpha: number
    speed: number
  }>
  glowIntensity: number
}

/**
 * Legendary trail point
 */
export interface LegendaryTrailPoint {
  x: number
  y: number
  life: number
  maxLife: number
  alpha: number
}

/**
 * Emote state
 */
export interface EmoteState {
  id: string
  text: string
  x: number
  y: number
  scale: number // 0-1 for animation
  alpha: number // 0-1 for fade
  life: number // Remaining time in ms
  maxLife: number
  isActive: boolean
  theme: ThemeId
  glitchOffset: number // Offset for glitch effect
  // Legendary-specific properties
  rarity?: EmoteRarity
  themeStyle?: EmoteThemeStyle
  // Animation state
  animationTime: number // Time since spawn in ms
  organicOffset: { x: number; y: number } // Organic motion offset
  pulsePhase: number // For pulsing animations
  // Legendary effects
  particles?: LegendaryParticle[]
  aura?: LegendaryAura
  trail?: LegendaryTrailPoint[]
  entranceProgress?: number // 0-1 for entrance animation
  exitProgress?: number // 0-1 for exit animation
  // Reactive animation
  mouseReactivity?: number // 0-1, increases when mouse is near
  dropReactivity?: number // 0-1, increases when drop spawns
}

/**
 * Emote render configuration
 */
export interface EmoteRenderConfig {
  fontSize: number
  fontFamily: string
  glowIntensity: number
  glitchEnabled: boolean
  pixelationEnabled: boolean
  scanlinesEnabled: boolean
}

/**
 * Emote manager configuration
 */
export interface EmoteManagerConfig {
  chatDuration: number // ms
  multiplayerDuration: number // ms
  maxActiveEmotes: number
  canvasWidth: number
  canvasHeight: number
}

/**
 * Theme colors interface (matches DevOrbsCanvas pattern)
 */
export interface ThemeColors {
  primary: string
  accent: string
  text: string
  glow: string
  bg: string
  bgSecondary: string
  border: string
}

