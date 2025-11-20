/**
 * TypeScript Interfaces para Fase 1 - Canvas Foundation
 * 
 * Todas as interfaces e tipos necessários para os 4 sistemas:
 * - Drops
 * - Emotes
 * - Hacker Panel
 * - Integração com Tema
 */

import { ThemeId } from '@/lib/themes'

// ============================================================================
// DROPS SYSTEM
// ============================================================================

/**
 * Raridade de um drop
 */
export type DropRarity = 'common' | 'uncommon' | 'rare' | 'epic'

/**
 * Tipo de forma geométrica do drop
 */
export type DropShape = 'circle' | 'square' | 'triangle' | 'hexagon'

/**
 * Tipo de recompensa do drop
 */
export type DropRewardType = 'points' | 'powerup' | 'special'

/**
 * Configuração de raridade
 */
export interface DropRarityConfig {
  rarity: DropRarity
  probability: number // 0-1
  color: string | string[] // Cor ou gradiente
  size: { min: number; max: number } // Tamanho em px
  glow: number // Intensidade do glow em px
  reward: {
    type: DropRewardType
    value: number
  }
  gravity: number // 0.5-0.8
  bounce: number // 0.3-0.5
}

/**
 * Estado de um drop
 */
export interface DropState {
  id: string
  x: number
  y: number
  vx: number // Velocidade X
  vy: number // Velocidade Y
  shape: DropShape
  rarity: DropRarity
  size: number
  rotation: number
  spawnTime: number
  lifetime: number // Tempo restante em ms
  isActive: boolean
  hasExploded: boolean
}

/**
 * Partícula de explosão
 */
export interface ExplosionParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  alpha: number
}

/**
 * Configuração do DropManager
 */
export interface DropManagerConfig {
  spawnInterval: { min: number; max: number } // ms
  maxActiveDrops: number
  timeout: number // ms
  canvasWidth: number
  canvasHeight: number
  floorY: number // Posição Y do chão
}

// ============================================================================
// EMOTES SYSTEM
// ============================================================================

/**
 * Tipo de emote
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
 * Estado de um emote
 */
export interface EmoteState {
  id: string
  text: string
  x: number
  y: number
  scale: number // 0-1 para animação
  alpha: number // 0-1 para fade
  life: number // Tempo restante em ms
  maxLife: number
  isActive: boolean
  theme: ThemeId
  glitchOffset: number // Offset para efeito glitch
}

/**
 * Configuração de renderização de emote
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
 * Configuração do EmoteManager
 */
export interface EmoteManagerConfig {
  chatDuration: number // ms
  multiplayerDuration: number // ms
  maxActiveEmotes: number
}

// ============================================================================
// HACKER PANEL SYSTEM
// ============================================================================

/**
 * Tipo de log
 */
export type LogType = 'info' | 'warn' | 'error' | 'debug' | 'status' | 'game' | 'auth' | 'score'

/**
 * Log entry
 */
export interface LogEntry {
  id: string
  type: LogType
  message: string
  timestamp: number
  isReal: boolean // true = log real, false = log fake
  alpha: number // Para fade-out
}

/**
 * Estado do Hacker Panel
 */
export interface HackerPanelState {
  logs: LogEntry[]
  onlineUsers: number
  activeGames: number
  lastLogin: {
    username: string
    timestamp: number
  } | null
  lastScore: {
    game: string
    score: number
    username: string
  } | null
  lastUpdate: number
}

/**
 * Configuração do Hacker Panel
 */
export interface HackerPanelConfig {
  maxLogs: number
  logInterval: { min: number; max: number } // ms
  fadeOutTime: number // ms
  autoScroll: boolean
  canvasEnabled: boolean
}

// ============================================================================
// THEME INTEGRATION
// ============================================================================

/**
 * Cores do tema para canvas
 */
export interface ThemeColors {
  primary: string
  accent: string
  text: string
  bg: string
  bgSecondary: string
  glow: string
  border: string
}

/**
 * Configuração de efeitos por tema
 */
export interface ThemeEffects {
  glowIntensity: number
  pixelation: boolean
  scanlines: boolean
  glitch: boolean
  neonBloom: number
}

// ============================================================================
// CANVAS ANIMATION
// ============================================================================

/**
 * Configuração de animação canvas
 */
export interface CanvasAnimationConfig {
  fps: number
  doubleBuffering: boolean
  culling: boolean
  mobileOptimization: boolean
}

/**
 * Estado de animação
 */
export interface AnimationState {
  isRunning: boolean
  lastFrameTime: number
  fps: number
  frameCount: number
}

// ============================================================================
// REWARDS SYSTEM
// ============================================================================

/**
 * Recompensa concedida
 */
export interface Reward {
  type: DropRewardType
  value: number
  timestamp: number
}

/**
 * Callback para conceder recompensa
 */
export type GrantRewardCallback = (reward: Reward) => void

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Posição 2D
 */
export interface Position {
  x: number
  y: number
}

/**
 * Velocidade 2D
 */
export interface Velocity {
  x: number
  y: number
}

/**
 * Dimensões
 */
export interface Dimensions {
  width: number
  height: number
}

/**
 * Retângulo
 */
export interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

