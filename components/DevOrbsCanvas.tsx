"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useThemeStore } from "@/lib/theme-store"
import type { ThemeId } from "@/lib/themes"
import { useMobileModeStore } from "@/lib/performance/mobile-mode"
import { useFPSGuardianStore } from "@/lib/performance/fps-guardian"
import { useParticleBudgetStore, allocateParticles, deallocateParticles } from "@/lib/performance/particle-budget"
import { useMultiTabStore, shouldPauseAnimations } from "@/lib/performance/multi-tab"
import { handleCanvasCrash, getRetryDelay, resetCrashState, isInFallback, forceReset } from "@/lib/performance/canvas-crash-resilience"
import Matter from "matter-js"
import {
  createPhysicsEngine,
  createBoundaries,
  createOrbBody,
  getPhysicsConfig,
  updatePhysics,
  calculateThrowForce,
  getBodyPosition,
  addBodyToWorld,
  isMobileDevice,
} from "@/lib/physics/orbs-engine"

const { Bodies, Body } = Matter

interface UserData {
  userId: number
  avatar: string | null
  username: string
  lastLogin: string
}

// Indiana Jones theme: Orb variant types
export type IndianaOrbVariant =
  | "sacred-usb"
  | "golden-keycap"
  | "tech-compass"
  | "cursed-mouse"
  | "debugger-idol"
  | "ancient-cpu"
  | "serpent-byte"
  | "broken-dependency"
  | "forgotten-commit"
  | "arc-codevenant"

export type StarWarsOrbVariant =
  | "blue-energy-blade-ring"
  | "red-void-blade"
  | "green-circuit-arc"
  | "astromech-pulse-orb"
  | "rebel-radiant-badge"
  | "imperial-core-ring"
  | "holocron-blue"
  | "holocron-red"
  | "starfighter-scope"
  | "hyperspace-tunnel-ring"

interface Orb {
  id: string
  userId: number
  avatar: string | null
  username: string
  body: Matter.Body
  image: HTMLImageElement | null
  imageLoaded: boolean
  meta?: {
    indyVariant?: IndianaOrbVariant
    starWarsVariant?: StarWarsOrbVariant
  }
}

interface StaticOrb {
  id: string
  userId: number
  avatar: string | null
  username: string
  x: number
  y: number
  image: HTMLImageElement | null
  imageLoaded: boolean
}

interface DevOrbsCanvasProps {
  users: UserData[]
  onShakeReady?: (handleShake: () => void) => void
  onScoreChange?: (score: number) => void
  onTest99Baskets?: () => void
}

const MAX_ORBS_DESKTOP = 10
const MAX_ORBS_MOBILE = 3 // Reduced for better mobile performance
const ORB_RADIUS_DESKTOP = 32 // 64px diameter (reduced from 96px)
const ORB_RADIUS_MOBILE = 24 // 48px diameter (reduced from 64px)
const SPAWN_INTERVAL_MS = 1000 // 1 second

// PT: Sistema de elementos festivos nas orbs | EN: Festive elements system for orbs | ES: Sistema de elementos festivos en orbs | FR: Système d'éléments festifs pour orbs | DE: Festliches Elementesystem für Orbs
type FestiveType = 'christmas' | 'newyear' | 'easter' | 'halloween' | 'carnival' | 'saojoao' | 'childrensday' | null

/**
 * PT: Detecta a região cultural baseada no timezone | EN: Detects cultural region based on timezone | ES: Detecta región cultural basada en zona horaria | FR: Détecte la région culturelle basée sur le fuseau horaire | DE: Erkennt kulturelle Region basierend auf Zeitzone
 */
function detectCulturalRegion(): 'latin-america' | 'north-america' | 'europe' | 'asia' | 'other' {
  if (typeof window === 'undefined') return 'other'
  
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    
    // América Latina (Brasil, México, Argentina, etc.)
    if (
      timezone.includes('America/Sao_Paulo') ||
      timezone.includes('America/Argentina') ||
      timezone.includes('America/Mexico') ||
      timezone.includes('America/Bogota') ||
      timezone.includes('America/Lima') ||
      timezone.includes('America/Santiago') ||
      timezone.includes('America/Caracas') ||
      timezone.includes('America/Montevideo') ||
      timezone.includes('America/La_Paz')
    ) {
      return 'latin-america'
    }
    
    // América do Norte (EUA, Canadá)
    if (
      timezone.includes('America/New_York') ||
      timezone.includes('America/Chicago') ||
      timezone.includes('America/Denver') ||
      timezone.includes('America/Los_Angeles') ||
      timezone.includes('America/Toronto') ||
      timezone.includes('America/Vancouver')
    ) {
      return 'north-america'
    }
    
    // Europa
    if (
      timezone.includes('Europe/') ||
      timezone.includes('Atlantic/') ||
      timezone.includes('Africa/Casablanca')
    ) {
      return 'europe'
    }
    
    // Ásia
    if (
      timezone.includes('Asia/') ||
      timezone.includes('Pacific/')
    ) {
      return 'asia'
    }
    
    return 'other'
  } catch {
    return 'other'
  }
}

/**
 * PT: Verifica se uma festividade é relevante para a região | EN: Checks if a holiday is relevant for the region | ES: Verifica si una festividad es relevante para la región | FR: Vérifie si une fête est pertinente pour la région | DE: Prüft, ob ein Feiertag für die Region relevant ist
 */
function isFestivityRelevant(festivity: FestiveType, region: ReturnType<typeof detectCulturalRegion>): boolean {
  if (!festivity) return false
  
  // Festividades universais (todas as regiões)
  if (festivity === 'christmas' || festivity === 'newyear' || festivity === 'easter') {
    return true
  }
  
  // Festividades específicas por região
  switch (region) {
    case 'latin-america':
      // Carnaval, São João e Dia das Crianças são comuns na América Latina
      return festivity === 'carnival' || festivity === 'saojoao' || festivity === 'childrensday'
    
    case 'north-america':
      // Halloween é muito popular nos EUA/Canadá
      return festivity === 'halloween'
    
    case 'europe':
      // Halloween também é comum na Europa, mas menos que nos EUA
      return festivity === 'halloween'
    
    case 'asia':
    case 'other':
      // Regiões onde essas festividades não são tradicionais
      return false
    
    default:
      return false
  }
}

/**
 * PT: Detecta qual festividade está ativa baseado na data atual e região cultural | EN: Detects which holiday is active based on current date and cultural region | ES: Detecta qué festividad está activa según la fecha actual y región cultural | FR: Détecte quelle fête est active selon la date actuelle et la région culturelle | DE: Erkennt, welcher Feiertag basierend auf dem aktuellen Datum und der kulturellen Region aktiv ist
 * @param forceFestivity - Força uma festividade específica para teste (opcional)
 */
function getActiveFestivity(forceFestivity?: FestiveType): FestiveType {
  // PT: Modo de teste - força festividade | EN: Test mode - force festivity | ES: Modo de prueba - fuerza festividad | FR: Mode test - force fête | DE: Testmodus - Feiertag erzwingen
  if (forceFestivity) return forceFestivity
  
  const now = new Date()
  const month = now.getMonth() + 1 // 1-12
  const day = now.getDate() // 1-31
  const region = detectCulturalRegion()
  
  // Natal: 1-25 de dezembro (universal)
  if (month === 12 && day >= 1 && day <= 25) {
    const festive: FestiveType = 'christmas'
    if (isFestivityRelevant(festive, region)) return festive
  }
  
  // Ano Novo: 31 dez - 2 jan (universal)
  if ((month === 12 && day === 31) || (month === 1 && day <= 2)) {
    const festive: FestiveType = 'newyear'
    if (isFestivityRelevant(festive, region)) return festive
  }
  
  // Páscoa: cálculo aproximado (domingo entre 22 mar - 25 abr) (universal)
  const easterDate = calculateEaster(now.getFullYear())
  const easterMonth = easterDate.getMonth() + 1
  const easterDay = easterDate.getDate()
  if (month === easterMonth && day >= easterDay - 2 && day <= easterDay + 2) {
    const festive: FestiveType = 'easter'
    if (isFestivityRelevant(festive, region)) return festive
  }
  
  // Halloween: 28-31 de outubro (principalmente América do Norte e Europa)
  if (month === 10 && day >= 28 && day <= 31) {
    const festive: FestiveType = 'halloween'
    if (isFestivityRelevant(festive, region)) return festive
  }
  
  // Carnaval: fevereiro (aproximado: 1-15 fev) - América Latina
  if (month === 2 && day >= 1 && day <= 15) {
    const festive: FestiveType = 'carnival'
    if (isFestivityRelevant(festive, region)) return festive
  }
  
  // São João: 20-24 de junho - América Latina (especialmente Brasil)
  if (month === 6 && day >= 20 && day <= 24) {
    const festive: FestiveType = 'saojoao'
    if (isFestivityRelevant(festive, region)) return festive
  }
  
  // Dia das Crianças: 10-14 de outubro - América Latina (Brasil)
  if (month === 10 && day >= 10 && day <= 14) {
    const festive: FestiveType = 'childrensday'
    if (isFestivityRelevant(festive, region)) return festive
  }
  
  return null
}

/**
 * PT: Calcula a data da Páscoa (algoritmo de Meeus/Jones/Butcher) | EN: Calculates Easter date (Meeus/Jones/Butcher algorithm) | ES: Calcula la fecha de Pascua (algoritmo de Meeus/Jones/Butcher) | FR: Calcule la date de Pâques (algorithme de Meeus/Jones/Butcher) | DE: Berechnet das Osterdatum (Meeus/Jones/Butcher-Algorithmus)
 */
function calculateEaster(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

/**
 * PT: Desenha elementos decorativos temáticos ao redor da orb | EN: Draws theme-specific decorative elements around orb | ES: Dibuja elementos decorativos temáticos alrededor de orb | FR: Dessine éléments décoratifs thématiques autour de orb | DE: Zeichnet themenspezifische dekorative Elemente um Orb
 */
/**
 * Pick a random Indiana Jones orb variant with equal probability
 */
function pickRandomVariant(): IndianaOrbVariant {
  const variants: IndianaOrbVariant[] = [
    "sacred-usb",
    "golden-keycap",
    "tech-compass",
    "cursed-mouse",
    "debugger-idol",
    "ancient-cpu",
    "serpent-byte",
    "broken-dependency",
    "forgotten-commit",
    "arc-codevenant",
  ]
  return variants[Math.floor(Math.random() * variants.length)]
}

/**
 * Pick a random Star Wars orb variant with equal probability (10% each)
 */
function pickRandomStarWarsVariant(): StarWarsOrbVariant {
  const variants: StarWarsOrbVariant[] = [
    "blue-energy-blade-ring",
    "red-void-blade",
    "green-circuit-arc",
    "astromech-pulse-orb",
    "rebel-radiant-badge",
    "imperial-core-ring",
    "holocron-blue",
    "holocron-red",
    "starfighter-scope",
    "hyperspace-tunnel-ring",
  ]
  return variants[Math.floor(Math.random() * variants.length)]
}

/**
 * Draw Indiana Jones theme orb ring with variant-specific design
 * User photo is drawn first, then ring is drawn around it with circular clipping
 */
function drawIndianaJonesOrbRing(
  ctx: CanvasRenderingContext2D,
  orb: Orb,
  variant: IndianaOrbVariant,
  colors: { primary: string; accent: string; text: string; bg?: string; bgSoft?: string; glow?: string; border?: string; highlight?: string },
  pos: { x: number; y: number },
  radius: number
) {
  if (!colors) return

  ctx.save()

  // Draw user photo first (existing orb rendering)
  if (orb.imageLoaded && orb.image) {
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, radius - 2, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(orb.image, pos.x - radius + 2, pos.y - radius + 2, (radius - 2) * 2, (radius - 2) * 2)
    ctx.restore()
    ctx.save()
  }

  // Ring radius (outside the photo)
  const ringRadius = radius * 1.3
  const ringWidth = radius * 0.15

  // Apply circular clipping to ensure ring doesn't cover photo
  ctx.beginPath()
  ctx.arc(pos.x, pos.y, ringRadius, 0, Math.PI * 2)
  ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
  ctx.clip("evenodd")

  // Render decorative ring based on variant type
  switch (variant) {
    case "sacred-usb": {
      // Stone ring with hex runes, golden USB cable contour
      ctx.strokeStyle = colors.bgSoft || "#8A6B45"
      ctx.fillStyle = colors.bgSoft || "#8A6B45"
      ctx.lineWidth = 2

      // Stone ring base
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, ringRadius, 0, Math.PI * 2)
      ctx.arc(pos.x, pos.y, ringRadius - ringWidth, 0, Math.PI * 2)
      ctx.fill("evenodd")

      // Hex runes around ring
      ctx.fillStyle = colors.primary || "#DAB466"
      ctx.font = `${radius * 0.2}px monospace`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      const hexRunes = ["0x", "FF", "DE", "AD", "BE", "EF"]
      hexRunes.forEach((rune, i) => {
        const angle = (i / hexRunes.length) * Math.PI * 2
        const x = pos.x + Math.cos(angle) * (ringRadius - ringWidth / 2)
        const y = pos.y + Math.sin(angle) * (ringRadius - ringWidth / 2)
        ctx.fillText(rune, x, y)
      })

      // Golden USB cable contour
      ctx.strokeStyle = colors.primary || "#DAB466"
      ctx.lineWidth = 3
      ctx.beginPath()
      // USB connector shape
      const usbWidth = radius * 0.4
      const usbHeight = radius * 0.2
      ctx.rect(pos.x - usbWidth / 2, pos.y - ringRadius - usbHeight, usbWidth, usbHeight)
      ctx.stroke()
      // Cable line
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y - ringRadius - usbHeight)
      ctx.lineTo(pos.x, pos.y - ringRadius - usbHeight * 2)
      ctx.stroke()
      break
    }

    case "golden-keycap": {
      // Golden Enter key shape with ASCII glyphs
      ctx.fillStyle = colors.primary || "#DAB466"
      ctx.strokeStyle = colors.glow || "#FFB95A"
      ctx.lineWidth = 2

      // Enter key shape (rectangular with notch)
      const keyWidth = radius * 0.6
      const keyHeight = radius * 0.3
      ctx.beginPath()
      ctx.rect(pos.x - keyWidth / 2, pos.y - ringRadius - keyHeight / 2, keyWidth, keyHeight)
      // Notch on right side
      ctx.moveTo(pos.x + keyWidth / 2, pos.y - ringRadius - keyHeight / 2)
      ctx.lineTo(pos.x + keyWidth / 2 + radius * 0.1, pos.y - ringRadius)
      ctx.lineTo(pos.x + keyWidth / 2, pos.y - ringRadius + keyHeight / 2)
      ctx.fill()
      ctx.stroke()

      // ASCII glyphs
      ctx.fillStyle = colors.text || "#FFF4D0"
      ctx.font = `bold ${radius * 0.25}px monospace`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("↵", pos.x, pos.y - ringRadius)

      // Golden ring around orb
      ctx.strokeStyle = colors.primary || "#DAB466"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, ringRadius, 0, Math.PI * 2)
      ctx.stroke()
      break
    }

    case "tech-compass": {
      // Circular compass with rotating pointer, "N,S,E,W → 0,1,X,F" symbols
      ctx.strokeStyle = colors.primary || "#DAB466"
      ctx.fillStyle = colors.bgSoft || "#8A6B45"
      ctx.lineWidth = 2

      // Compass circle
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, ringRadius, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // Inner circle
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, ringRadius - ringWidth, 0, Math.PI * 2)
      ctx.stroke()

      // Cardinal directions with dev symbols
      const directions = [
        { symbol: "0", label: "N", angle: -Math.PI / 2 },
        { symbol: "1", label: "S", angle: Math.PI / 2 },
        { symbol: "X", label: "E", angle: 0 },
        { symbol: "F", label: "W", angle: Math.PI },
      ]
      ctx.fillStyle = colors.text || "#FFF4D0"
      ctx.font = `${radius * 0.2}px monospace`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      directions.forEach((dir) => {
        const x = pos.x + Math.cos(dir.angle) * (ringRadius - ringWidth / 2)
        const y = pos.y + Math.sin(dir.angle) * (ringRadius - ringWidth / 2)
        ctx.fillText(dir.symbol, x, y)
        ctx.fillText(dir.label, x, y + radius * 0.15)
      })

      // Rotating pointer (always points "north" = up)
      ctx.strokeStyle = colors.accent || "#4AFF8A"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)
      ctx.lineTo(pos.x, pos.y - ringRadius + ringWidth)
      ctx.stroke()

      // Center dot
      ctx.fillStyle = colors.accent || "#4AFF8A"
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius * 0.1, 0, Math.PI * 2)
      ctx.fill()
      break
    }

    case "cursed-mouse": {
      // Worn scroll wheel ring with scratches, dust particles
      ctx.strokeStyle = colors.bgSoft || "#8A6B45"
      ctx.fillStyle = colors.bgSoft || "#8A6B45"
      ctx.lineWidth = 2

      // Worn ring base
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, ringRadius, 0, Math.PI * 2)
      ctx.arc(pos.x, pos.y, ringRadius - ringWidth, 0, Math.PI * 2)
      ctx.fill("evenodd")

      // Scroll wheel notches
      const notchCount = 12
      for (let i = 0; i < notchCount; i++) {
        const angle = (i / notchCount) * Math.PI * 2
        const x1 = pos.x + Math.cos(angle) * (ringRadius - ringWidth)
        const y1 = pos.y + Math.sin(angle) * (ringRadius - ringWidth)
        const x2 = pos.x + Math.cos(angle) * ringRadius
        const y2 = pos.y + Math.sin(angle) * ringRadius
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      // Scratches (random lines)
      ctx.strokeStyle = colors.border || "#4A3924"
      ctx.lineWidth = 1
      for (let i = 0; i < 5; i++) {
        const angle1 = Math.random() * Math.PI * 2
        const angle2 = Math.random() * Math.PI * 2
        const r1 = ringRadius - ringWidth + Math.random() * ringWidth
        const r2 = ringRadius - ringWidth + Math.random() * ringWidth
        ctx.beginPath()
        ctx.moveTo(pos.x + Math.cos(angle1) * r1, pos.y + Math.sin(angle1) * r1)
        ctx.lineTo(pos.x + Math.cos(angle2) * r2, pos.y + Math.sin(angle2) * r2)
        ctx.stroke()
      }

      // Dust particles
      ctx.fillStyle = colors.bgSoft || "#8A6B45"
      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2
        const r = ringRadius - ringWidth / 2 + (Math.random() - 0.5) * ringWidth
        const x = pos.x + Math.cos(angle) * r
        const y = pos.y + Math.sin(angle) * r
        ctx.beginPath()
        ctx.arc(x, y, radius * 0.05, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }

    case "debugger-idol": {
      // Golden idol shape with debug symbols (➤, ⏹)
      ctx.fillStyle = colors.primary || "#DAB466"
      ctx.strokeStyle = colors.glow || "#FFB95A"
      ctx.lineWidth = 2

      // Idol shape (simplified head/torso)
      const idolWidth = radius * 0.5
      const idolHeight = radius * 0.7
      ctx.beginPath()
      // Head (circle)
      ctx.arc(pos.x, pos.y - ringRadius - idolHeight / 2, radius * 0.2, 0, Math.PI * 2)
      // Body (rectangle)
      ctx.rect(pos.x - idolWidth / 2, pos.y - ringRadius - idolHeight / 2 + radius * 0.2, idolWidth, idolHeight - radius * 0.2)
      ctx.fill()
      ctx.stroke()

      // Debug symbols
      ctx.fillStyle = colors.text || "#FFF4D0"
      ctx.font = `${radius * 0.25}px sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("➤", pos.x - radius * 0.15, pos.y - ringRadius)
      ctx.fillText("⏹", pos.x + radius * 0.15, pos.y - ringRadius)

      // Golden ring
      ctx.strokeStyle = colors.primary || "#DAB466"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, ringRadius, 0, Math.PI * 2)
      ctx.stroke()
      break
    }

    case "ancient-cpu": {
      // Cracked chip with vegetation, burned circuit borders
      ctx.fillStyle = colors.bgSoft || "#8A6B45"
      ctx.strokeStyle = colors.border || "#4A3924"
      ctx.lineWidth = 2

      // Chip base (square with rounded corners)
      const chipSize = radius * 0.6
      const cornerRadius = radius * 0.1
      ctx.beginPath()
      // Manually draw rounded rectangle
      ctx.moveTo(pos.x - chipSize / 2 + cornerRadius, pos.y - ringRadius - chipSize / 2)
      ctx.lineTo(pos.x + chipSize / 2 - cornerRadius, pos.y - ringRadius - chipSize / 2)
      ctx.quadraticCurveTo(pos.x + chipSize / 2, pos.y - ringRadius - chipSize / 2, pos.x + chipSize / 2, pos.y - ringRadius - chipSize / 2 + cornerRadius)
      ctx.lineTo(pos.x + chipSize / 2, pos.y - ringRadius + chipSize / 2 - cornerRadius)
      ctx.quadraticCurveTo(pos.x + chipSize / 2, pos.y - ringRadius + chipSize / 2, pos.x + chipSize / 2 - cornerRadius, pos.y - ringRadius + chipSize / 2)
      ctx.lineTo(pos.x - chipSize / 2 + cornerRadius, pos.y - ringRadius + chipSize / 2)
      ctx.quadraticCurveTo(pos.x - chipSize / 2, pos.y - ringRadius + chipSize / 2, pos.x - chipSize / 2, pos.y - ringRadius + chipSize / 2 - cornerRadius)
      ctx.lineTo(pos.x - chipSize / 2, pos.y - ringRadius - chipSize / 2 + cornerRadius)
      ctx.quadraticCurveTo(pos.x - chipSize / 2, pos.y - ringRadius - chipSize / 2, pos.x - chipSize / 2 + cornerRadius, pos.y - ringRadius - chipSize / 2)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Cracks
      ctx.strokeStyle = colors.border || "#4A3924"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(pos.x - chipSize / 4, pos.y - ringRadius - chipSize / 2)
      ctx.lineTo(pos.x, pos.y - ringRadius)
      ctx.lineTo(pos.x + chipSize / 4, pos.y - ringRadius + chipSize / 4)
      ctx.stroke()

      // Vegetation (green pixels)
      ctx.fillStyle = colors.accent || "#4AFF8A"
      for (let i = 0; i < 6; i++) {
        const x = pos.x - chipSize / 2 + Math.random() * chipSize
        const y = pos.y - ringRadius - chipSize / 2 + Math.random() * chipSize
        ctx.fillRect(x, y, radius * 0.08, radius * 0.08)
      }

      // Burned circuit borders
      ctx.strokeStyle = colors.glow || "#FFB95A"
      ctx.lineWidth = 1
      ctx.beginPath()
      // Top border
      ctx.moveTo(pos.x - chipSize / 2, pos.y - ringRadius - chipSize / 2)
      ctx.lineTo(pos.x + chipSize / 2, pos.y - ringRadius - chipSize / 2)
      // Bottom border
      ctx.moveTo(pos.x - chipSize / 2, pos.y - ringRadius + chipSize / 2)
      ctx.lineTo(pos.x + chipSize / 2, pos.y - ringRadius + chipSize / 2)
      ctx.stroke()

      // Ring with circuit pattern
      ctx.strokeStyle = colors.primary || "#DAB466"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, ringRadius, 0, Math.PI * 2)
      ctx.stroke()
      break
    }

    case "serpent-byte": {
      // Pixel snake contouring ring, green glowing eyes
      ctx.strokeStyle = colors.accent || "#4AFF8A"
      ctx.fillStyle = colors.accent || "#4AFF8A"
      ctx.lineWidth = 2

      // Pixel snake body (segmented)
      const segments = 8
      const segmentSize = radius * 0.15
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2
        const x = pos.x + Math.cos(angle) * (ringRadius - ringWidth / 2)
        const y = pos.y + Math.sin(angle) * (ringRadius - ringWidth / 2)
        ctx.fillRect(x - segmentSize / 2, y - segmentSize / 2, segmentSize, segmentSize)
      }

      // Green glowing eyes
      ctx.fillStyle = colors.accent || "#4AFF8A"
      ctx.shadowBlur = 8
      ctx.shadowColor = colors.accent || "#4AFF8A"
      const eyeSize = radius * 0.12
      // Left eye
      ctx.beginPath()
      ctx.arc(pos.x - radius * 0.3, pos.y - radius * 0.3, eyeSize, 0, Math.PI * 2)
      ctx.fill()
      // Right eye
      ctx.beginPath()
      ctx.arc(pos.x + radius * 0.3, pos.y - radius * 0.3, eyeSize, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // Ring outline
      ctx.strokeStyle = colors.accent || "#4AFF8A"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, ringRadius, 0, Math.PI * 2)
      ctx.stroke()
      break
    }

    case "broken-dependency": {
      // Broken chains around ring, "{ peerMissing: true }" inscription
      ctx.strokeStyle = colors.border || "#4A3924"
      ctx.fillStyle = colors.bgSoft || "#8A6B45"
      ctx.lineWidth = 2

      // Broken chain links
      const linkCount = 6
      for (let i = 0; i < linkCount; i++) {
        const angle = (i / linkCount) * Math.PI * 2
        const x = pos.x + Math.cos(angle) * (ringRadius - ringWidth / 2)
        const y = pos.y + Math.sin(angle) * (ringRadius - ringWidth / 2)
        const linkSize = radius * 0.2

        // Broken link (incomplete circle)
        ctx.beginPath()
        ctx.arc(x, y, linkSize / 2, 0, Math.PI * 1.8)
        ctx.stroke()

        // Break in chain
        if (i % 2 === 0) {
          ctx.strokeStyle = colors.accent || "#4AFF8A"
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(x + linkSize / 2, y)
          ctx.lineTo(x + linkSize, y)
          ctx.stroke()
          ctx.strokeStyle = colors.border || "#4A3924"
          ctx.lineWidth = 2
        }
      }

      // Inscription
      ctx.fillStyle = colors.text || "#FFF4D0"
      ctx.font = `${radius * 0.15}px monospace`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("{ peerMissing: true }", pos.x, pos.y - ringRadius - radius * 0.3)

      // Ring
      ctx.strokeStyle = colors.primary || "#DAB466"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, ringRadius, 0, Math.PI * 2)
      ctx.stroke()
      break
    }

    case "forgotten-commit": {
      // Scroll/papyrus ring with "git log –forgotten" text, red seals
      ctx.fillStyle = colors.highlight || "#FFF4D0"
      ctx.strokeStyle = colors.bgSoft || "#8A6B45"
      ctx.lineWidth = 2

      // Scroll shape (curved rectangle)
      const scrollWidth = radius * 0.8
      const scrollHeight = radius * 0.25
      const scrollCornerRadius = radius * 0.05
      ctx.beginPath()
      // Manually draw rounded rectangle
      ctx.moveTo(pos.x - scrollWidth / 2 + scrollCornerRadius, pos.y - ringRadius - scrollHeight / 2)
      ctx.lineTo(pos.x + scrollWidth / 2 - scrollCornerRadius, pos.y - ringRadius - scrollHeight / 2)
      ctx.quadraticCurveTo(pos.x + scrollWidth / 2, pos.y - ringRadius - scrollHeight / 2, pos.x + scrollWidth / 2, pos.y - ringRadius - scrollHeight / 2 + scrollCornerRadius)
      ctx.lineTo(pos.x + scrollWidth / 2, pos.y - ringRadius + scrollHeight / 2 - scrollCornerRadius)
      ctx.quadraticCurveTo(pos.x + scrollWidth / 2, pos.y - ringRadius + scrollHeight / 2, pos.x + scrollWidth / 2 - scrollCornerRadius, pos.y - ringRadius + scrollHeight / 2)
      ctx.lineTo(pos.x - scrollWidth / 2 + scrollCornerRadius, pos.y - ringRadius + scrollHeight / 2)
      ctx.quadraticCurveTo(pos.x - scrollWidth / 2, pos.y - ringRadius + scrollHeight / 2, pos.x - scrollWidth / 2, pos.y - ringRadius + scrollHeight / 2 - scrollCornerRadius)
      ctx.lineTo(pos.x - scrollWidth / 2, pos.y - ringRadius - scrollHeight / 2 + scrollCornerRadius)
      ctx.quadraticCurveTo(pos.x - scrollWidth / 2, pos.y - ringRadius - scrollHeight / 2, pos.x - scrollWidth / 2 + scrollCornerRadius, pos.y - ringRadius - scrollHeight / 2)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Text
      ctx.fillStyle = colors.border || "#4A3924"
      ctx.font = `${radius * 0.12}px monospace`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("git log –forgotten", pos.x, pos.y - ringRadius)

      // Red seals
      ctx.fillStyle = "#8B0000"
      const sealSize = radius * 0.1
      // Left seal
      ctx.beginPath()
      ctx.arc(pos.x - scrollWidth / 2 + sealSize, pos.y - ringRadius, sealSize, 0, Math.PI * 2)
      ctx.fill()
      // Right seal
      ctx.beginPath()
      ctx.arc(pos.x + scrollWidth / 2 - sealSize, pos.y - ringRadius, sealSize, 0, Math.PI * 2)
      ctx.fill()

      // Ring
      ctx.strokeStyle = colors.primary || "#DAB466"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, ringRadius, 0, Math.PI * 2)
      ctx.stroke()
      break
    }

    case "arc-codevenant": {
      // Golden arc with ∞ symbols flowing, white light interior
      ctx.fillStyle = colors.primary || "#DAB466"
      ctx.strokeStyle = colors.glow || "#FFB95A"
      ctx.lineWidth = 3

      // Golden arc (top half of ring)
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, ringRadius, Math.PI, 0, false)
      ctx.lineWidth = ringWidth
      ctx.stroke()

      // ∞ symbols flowing
      ctx.fillStyle = colors.text || "#FFF4D0"
      ctx.font = `${radius * 0.2}px sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      const infinityCount = 4
      for (let i = 0; i < infinityCount; i++) {
        const angle = (i / infinityCount) * Math.PI - Math.PI / 2
        const x = pos.x + Math.cos(angle) * (ringRadius - ringWidth / 2)
        const y = pos.y + Math.sin(angle) * (ringRadius - ringWidth / 2)
        ctx.fillText("∞", x, y)
      }

      // White light interior (glow effect)
      ctx.fillStyle = colors.highlight || "#FFF4D0"
      ctx.globalAlpha = 0.3
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1

      // Ring outline
      ctx.strokeStyle = colors.primary || "#DAB466"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, ringRadius, 0, Math.PI * 2)
      ctx.stroke()
      break
    }
  }

  ctx.restore()
}

/**
 * Draw Star Wars theme orb ring with variant-specific design
 * User photo is drawn first, then ring is drawn around it with circular clipping
 * All designs are abstract and geometric (not direct IP copies)
 */
function drawStarWarsOrb(
  ctx: CanvasRenderingContext2D,
  orb: Orb,
  variant: StarWarsOrbVariant,
  colors: { primary: string; accent: string; text: string; bg?: string; bgSoft?: string; glow?: string; border?: string; highlight?: string },
  pos: { x: number; y: number },
  radius: number
) {
  if (!colors) return

  ctx.save()

  // Note: User photo is already drawn in renderOrb, so we only draw the decorative ring here
  // Ring radius (outside the photo)
  const ringRadius = radius * 1.3
  const ringWidth = radius * 0.15

  // Ensure we're drawing on top of everything
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1
  
  // Render decorative ring based on variant type
  switch (variant) {
    case "blue-energy-blade-ring": {
      // Thin blue vibrant energy ring with diagonal strokes
      ctx.strokeStyle = colors.primary || "#2F9BFF"
      ctx.lineWidth = 3 // Increased for visibility
      ctx.shadowBlur = 15 // Increased for visibility
      ctx.shadowColor = colors.primary || "#2F9BFF"
      ctx.globalAlpha = 1 // Ensure full opacity
      
      // Main ring
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, ringRadius, 0, Math.PI * 2)
      ctx.stroke()
      
      // Diagonal energy strokes
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        const x1 = pos.x + Math.cos(angle) * (ringRadius - ringWidth)
        const y1 = pos.y + Math.sin(angle) * (ringRadius - ringWidth)
        const x2 = pos.x + Math.cos(angle + 0.3) * ringRadius
        const y2 = pos.y + Math.sin(angle + 0.3) * ringRadius
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
      break
    }

    case "red-void-blade": {
      // Thick red ring with internal pulsing glow, unstable texture
      ctx.fillStyle = colors.accent || "#FF2B2B"
      ctx.strokeStyle = colors.accent || "#FF2B2B"
      ctx.lineWidth = 5 // Increased for visibility
      ctx.shadowBlur = 20 // Increased for visibility
      ctx.shadowColor = colors.accent || "#FF2B2B"
      ctx.globalAlpha = 1 // Ensure full opacity
      
      // Thick ring base
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, ringRadius, 0, Math.PI * 2)
      ctx.arc(pos.x, pos.y, ringRadius - ringWidth, 0, Math.PI * 2)
      ctx.fill("evenodd")
      
      // Internal glow (pulsing effect via opacity)
      ctx.globalAlpha = 0.6
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, ringRadius - ringWidth / 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
      
      // Unstable texture (cracks/glitch lines)
      ctx.strokeStyle = colors.bg || "#050508"
      ctx.lineWidth = 1
      for (let i = 0; i < 6; i++) {
        const angle = Math.random() * Math.PI * 2
        const r = ringRadius - ringWidth + Math.random() * ringWidth
        ctx.beginPath()
        ctx.moveTo(pos.x + Math.cos(angle) * r, pos.y + Math.sin(angle) * r)
        ctx.lineTo(pos.x + Math.cos(angle + 0.2) * (r + 3), pos.y + Math.sin(angle + 0.2) * (r + 3))
        ctx.stroke()
      }
      break
    }

    case "green-circuit-arc": {
      // Green semicircular circuit traces like active circuit
      ctx.strokeStyle = "#4AFF8A" // Green circuit color
      ctx.lineWidth = 3 // Increased for visibility
      ctx.shadowBlur = 15 // Increased for visibility
      ctx.shadowColor = "#4AFF8A"
      ctx.globalAlpha = 1 // Ensure full opacity
      
      // Semicircular arcs (circuit traces)
      for (let i = 0; i < 4; i++) {
        const startAngle = (i / 4) * Math.PI * 2
        const endAngle = startAngle + Math.PI
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, ringRadius - ringWidth / 2, startAngle, endAngle)
        ctx.stroke()
      }
      
      // Circuit nodes (small circles)
      ctx.fillStyle = "#4AFF8A"
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        const x = pos.x + Math.cos(angle) * (ringRadius - ringWidth / 2)
        const y = pos.y + Math.sin(angle) * (ringRadius - ringWidth / 2)
        ctx.beginPath()
        ctx.arc(x, y, radius * 0.08, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }

    case "astromech-pulse-orb": {
      // Concentric rings that rotate slowly
      ctx.strokeStyle = colors.primary || "#2F9BFF"
      ctx.lineWidth = 2
      ctx.shadowBlur = 8
      ctx.shadowColor = colors.primary || "#2F9BFF"
      
      // Multiple concentric rings
      for (let i = 0; i < 3; i++) {
        const r = ringRadius - ringWidth / 2 - (i * ringWidth / 3)
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2)
        ctx.stroke()
      }
      
      // Pulse dots around ring
      ctx.fillStyle = colors.glow || "#59E0FF"
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2
        const x = pos.x + Math.cos(angle) * (ringRadius - ringWidth / 2)
        const y = pos.y + Math.sin(angle) * (ringRadius - ringWidth / 2)
        ctx.beginPath()
        ctx.arc(x, y, radius * 0.1, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }

    case "rebel-radiant-badge": {
      // Abstract double-wing symbol + soft amber light
      ctx.fillStyle = colors.highlight || "#FFC23D"
      ctx.strokeStyle = colors.highlight || "#FFC23D"
      ctx.lineWidth = 2
      ctx.shadowBlur = 10
      ctx.shadowColor = colors.highlight || "#FFC23D"
      
      // Abstract wing symbol (geometric, not direct copy)
      const wingSize = radius * 0.4
      // Left wing
      ctx.beginPath()
      ctx.moveTo(pos.x - wingSize, pos.y - ringRadius)
      ctx.lineTo(pos.x - wingSize * 0.5, pos.y - ringRadius - wingSize * 0.3)
      ctx.lineTo(pos.x, pos.y - ringRadius)
      ctx.fill()
      // Right wing
      ctx.beginPath()
      ctx.moveTo(pos.x + wingSize, pos.y - ringRadius)
      ctx.lineTo(pos.x + wingSize * 0.5, pos.y - ringRadius - wingSize * 0.3)
      ctx.lineTo(pos.x, pos.y - ringRadius)
      ctx.fill()
      
      // Soft amber glow ring
      ctx.globalAlpha = 0.4
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, ringRadius, 0, Math.PI * 2)
      ctx.stroke()
      ctx.globalAlpha = 1
      break
    }

    case "imperial-core-ring": {
      // Geometric symmetrical ring, hard, with angular lines
      ctx.strokeStyle = colors.bgSoft || "#0C0F14"
      ctx.fillStyle = colors.bgSoft || "#0C0F14"
      ctx.lineWidth = 3
      
      // Hard geometric ring
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, ringRadius, 0, Math.PI * 2)
      ctx.arc(pos.x, pos.y, ringRadius - ringWidth, 0, Math.PI * 2)
      ctx.fill("evenodd")
      
      // Angular lines (symmetrical)
      ctx.strokeStyle = colors.text || "#D8F2FF"
      ctx.lineWidth = 2
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        const x1 = pos.x + Math.cos(angle) * (ringRadius - ringWidth)
        const y1 = pos.y + Math.sin(angle) * (ringRadius - ringWidth)
        const x2 = pos.x + Math.cos(angle) * ringRadius
        const y2 = pos.y + Math.sin(angle) * ringRadius
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
      break
    }

    case "holocron-blue": {
      // Blue geometric patterns, pulsating luminance
      ctx.fillStyle = colors.primary || "#2F9BFF"
      ctx.strokeStyle = colors.glow || "#59E0FF"
      ctx.lineWidth = 2
      ctx.shadowBlur = 10
      ctx.shadowColor = colors.primary || "#2F9BFF"
      
      // Geometric triangular pattern
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2
        const x1 = pos.x + Math.cos(angle) * (ringRadius - ringWidth / 2)
        const y1 = pos.y + Math.sin(angle) * (ringRadius - ringWidth / 2)
        const x2 = pos.x + Math.cos(angle + Math.PI / 3) * (ringRadius - ringWidth / 2)
        const y2 = pos.y + Math.sin(angle + Math.PI / 3) * (ringRadius - ringWidth / 2)
        ctx.beginPath()
        ctx.moveTo(pos.x, pos.y)
        ctx.lineTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.closePath()
        ctx.stroke()
      }
      
      // Pulsating center
      ctx.globalAlpha = 0.5
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius * 0.3, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
      break
    }

    case "holocron-red": {
      // Red version with triangulation
      ctx.fillStyle = colors.accent || "#FF2B2B"
      ctx.strokeStyle = colors.accent || "#FF2B2B"
      ctx.lineWidth = 2
      ctx.shadowBlur = 10
      ctx.shadowColor = colors.accent || "#FF2B2B"
      
      // Triangular pattern (red)
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2
        const x1 = pos.x + Math.cos(angle) * (ringRadius - ringWidth / 2)
        const y1 = pos.y + Math.sin(angle) * (ringRadius - ringWidth / 2)
        const x2 = pos.x + Math.cos(angle + Math.PI / 3) * (ringRadius - ringWidth / 2)
        const y2 = pos.y + Math.sin(angle + Math.PI / 3) * (ringRadius - ringWidth / 2)
        ctx.beginPath()
        ctx.moveTo(pos.x, pos.y)
        ctx.lineTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.closePath()
        ctx.fill()
      }
      break
    }

    case "starfighter-scope": {
      // x/y markers like targeting scope
      ctx.strokeStyle = colors.primary || "#2F9BFF"
      ctx.lineWidth = 2
      ctx.shadowBlur = 6
      ctx.shadowColor = colors.primary || "#2F9BFF"
      
      // Crosshair pattern
      // Horizontal line
      ctx.beginPath()
      ctx.moveTo(pos.x - ringRadius, pos.y)
      ctx.lineTo(pos.x + ringRadius, pos.y)
      ctx.stroke()
      // Vertical line
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y - ringRadius)
      ctx.lineTo(pos.x, pos.y + ringRadius)
      ctx.stroke()
      
      // Corner brackets (targeting markers)
      const bracketSize = radius * 0.2
      // Top-left
      ctx.beginPath()
      ctx.moveTo(pos.x - ringRadius, pos.y - ringRadius)
      ctx.lineTo(pos.x - ringRadius + bracketSize, pos.y - ringRadius)
      ctx.lineTo(pos.x - ringRadius, pos.y - ringRadius + bracketSize)
      ctx.stroke()
      // Top-right
      ctx.beginPath()
      ctx.moveTo(pos.x + ringRadius, pos.y - ringRadius)
      ctx.lineTo(pos.x + ringRadius - bracketSize, pos.y - ringRadius)
      ctx.lineTo(pos.x + ringRadius, pos.y - ringRadius + bracketSize)
      ctx.stroke()
      // Bottom-left
      ctx.beginPath()
      ctx.moveTo(pos.x - ringRadius, pos.y + ringRadius)
      ctx.lineTo(pos.x - ringRadius + bracketSize, pos.y + ringRadius)
      ctx.lineTo(pos.x - ringRadius, pos.y + ringRadius - bracketSize)
      ctx.stroke()
      // Bottom-right
      ctx.beginPath()
      ctx.moveTo(pos.x + ringRadius, pos.y + ringRadius)
      ctx.lineTo(pos.x + ringRadius - bracketSize, pos.y + ringRadius)
      ctx.lineTo(pos.x + ringRadius, pos.y + ringRadius - bracketSize)
      ctx.stroke()
      break
    }

    case "hyperspace-tunnel-ring": {
      // Radial streaks from center, warp-like
      ctx.strokeStyle = colors.glow || "#59E0FF"
      ctx.lineWidth = 2
      ctx.shadowBlur = 8
      ctx.shadowColor = colors.glow || "#59E0FF"
      
      // Radial streaks
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2
        const x1 = pos.x + Math.cos(angle) * radius
        const y1 = pos.y + Math.sin(angle) * radius
        const x2 = pos.x + Math.cos(angle) * ringRadius
        const y2 = pos.y + Math.sin(angle) * ringRadius
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
      
      // Outer ring
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, ringRadius, 0, Math.PI * 2)
      ctx.stroke()
      break
    }
    
    default: {
      // Fallback: draw a simple ring if variant is not recognized
      console.warn('[Star Wars Orb] Unknown variant:', variant)
      ctx.strokeStyle = colors.primary || "#2F9BFF"
      ctx.lineWidth = 3
      ctx.shadowBlur = 15
      ctx.shadowColor = colors.primary || "#2F9BFF"
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, ringRadius, 0, Math.PI * 2)
      ctx.stroke()
      break
    }
  }

  ctx.restore()
}

function drawThemeDecorations(
  ctx: CanvasRenderingContext2D,
  themeId: string,
  pos: { x: number; y: number },
  radius: number,
  colors: { primary: string; accent: string; text: string }
) {
  ctx.save()
  const outerRadius = radius * 1.3 // Posição externa, não tapa a foto
  
  switch (themeId) {
    case 'analista-jr': {
      // Badge "JR" - símbolo de iniciante
      const badgeSize = radius * 0.3
      ctx.fillStyle = colors.accent
      ctx.strokeStyle = colors.primary
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(pos.x + radius * 0.7, pos.y - radius * 0.7, badgeSize, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      // Texto "JR"
      ctx.fillStyle = colors.text
      ctx.font = `bold ${badgeSize * 0.6}px sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("JR", pos.x + radius * 0.7, pos.y - radius * 0.7)
      break
    }
    
    case 'analista-sr': {
      // Coroa - símbolo de sênior
      const crownSize = radius * 0.25
      const crownX = pos.x + radius * 0.7
      const crownY = pos.y - radius * 0.7
      ctx.fillStyle = colors.primary
      ctx.beginPath()
      // Base da coroa
      ctx.rect(crownX - crownSize, crownY, crownSize * 2, crownSize * 0.4)
      // Pontas da coroa (3 pontas)
      for (let i = 0; i < 3; i++) {
        const x = crownX - crownSize + (crownSize * i)
        ctx.moveTo(x, crownY)
        ctx.lineTo(x + crownSize * 0.5, crownY - crownSize * 0.6)
        ctx.lineTo(x + crownSize, crownY)
      }
      ctx.fill()
      break
    }
    
    case 'lofi-code': {
      // Ondas sonoras - símbolo de música lofi
      const waveCount = 3
      const waveSpacing = radius * 0.15
      ctx.strokeStyle = colors.accent
      ctx.lineWidth = 2
      for (let i = 0; i < waveCount; i++) {
        const waveX = pos.x + radius * 0.8
        const waveY = pos.y - radius * 0.5 + (i * waveSpacing)
        const waveHeight = radius * 0.1 + (i * radius * 0.05)
        ctx.beginPath()
        ctx.moveTo(waveX, waveY)
        ctx.quadraticCurveTo(waveX + waveHeight, waveY - waveHeight, waveX + waveHeight * 2, waveY)
        ctx.quadraticCurveTo(waveX + waveHeight * 3, waveY + waveHeight, waveX + waveHeight * 4, waveY)
        ctx.stroke()
      }
      break
    }
    
    case 'cyber': {
      // Código binário (0s e 1s) - símbolo hacker
      ctx.fillStyle = colors.primary
      ctx.font = `${radius * 0.15}px monospace`
      ctx.textAlign = "left"
      ctx.textBaseline = "top"
      const binary = ['0', '1', '0', '1', '1', '0']
      binary.forEach((bit, i) => {
        const angle = (i / binary.length) * Math.PI * 2
        const x = pos.x + Math.cos(angle) * outerRadius
        const y = pos.y + Math.sin(angle) * outerRadius
        ctx.fillText(bit, x, y)
      })
      break
    }
    
    case 'pixel': {
      // Pixels/blocos 8-bit ao redor
      const pixelSize = radius * 0.15
      ctx.fillStyle = colors.primary
      const pixelPositions = [
        { x: pos.x + radius * 0.8, y: pos.y - radius * 0.6 },
        { x: pos.x + radius * 0.8, y: pos.y },
        { x: pos.x + radius * 0.8, y: pos.y + radius * 0.6 },
        { x: pos.x - radius * 0.8, y: pos.y - radius * 0.6 },
        { x: pos.x - radius * 0.8, y: pos.y + radius * 0.6 },
      ]
      pixelPositions.forEach(p => {
        ctx.fillRect(p.x, p.y, pixelSize, pixelSize)
      })
      break
    }
    
    case 'neon': {
      // Linhas neon futuristas
      ctx.strokeStyle = colors.primary
      ctx.lineWidth = 2
      ctx.shadowBlur = 8
      ctx.shadowColor = colors.primary
      const lineCount = 4
      for (let i = 0; i < lineCount; i++) {
        const angle = (i / lineCount) * Math.PI * 2
        const startX = pos.x + Math.cos(angle) * radius
        const startY = pos.y + Math.sin(angle) * radius
        const endX = pos.x + Math.cos(angle) * outerRadius
        const endY = pos.y + Math.sin(angle) * outerRadius
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }
      ctx.shadowBlur = 0
      break
    }
    
    case 'terminal': {
      // Caracteres ASCII/símbolos de terminal
      ctx.fillStyle = colors.text
      ctx.font = `${radius * 0.2}px monospace`
      ctx.textAlign = "center"
      const symbols = ['>', '$', '#', '%']
      symbols.forEach((sym, i) => {
        const angle = (i / symbols.length) * Math.PI * 2
        const x = pos.x + Math.cos(angle) * outerRadius
        const y = pos.y + Math.sin(angle) * outerRadius
        ctx.fillText(sym, x, y)
      })
      break
    }
    
    case 'blueprint': {
      // Linhas de construção/régua
      ctx.strokeStyle = colors.primary
      ctx.lineWidth = 1.5
      // Linha horizontal
      ctx.beginPath()
      ctx.moveTo(pos.x - radius * 0.6, pos.y + radius * 0.9)
      ctx.lineTo(pos.x + radius * 0.6, pos.y + radius * 0.9)
      ctx.stroke()
      // Marcações de régua
      for (let i = -2; i <= 2; i++) {
        const markX = pos.x + (i * radius * 0.2)
        ctx.beginPath()
        ctx.moveTo(markX, pos.y + radius * 0.9)
        ctx.lineTo(markX, pos.y + radius * 0.9 + radius * 0.1)
        ctx.stroke()
      }
      break
    }
    
    case 'bruno-csharp': {
      // Símbolo C# (hashtag estilizado)
      const hashSize = radius * 0.3
      const hashX = pos.x + radius * 0.7
      const hashY = pos.y - radius * 0.7
      ctx.strokeStyle = colors.accent
      ctx.lineWidth = 2.5
      // Linhas horizontais
      ctx.beginPath()
      ctx.moveTo(hashX - hashSize, hashY - hashSize * 0.3)
      ctx.lineTo(hashX + hashSize, hashY - hashSize * 0.3)
      ctx.moveTo(hashX - hashSize, hashY + hashSize * 0.3)
      ctx.lineTo(hashX + hashSize, hashY + hashSize * 0.3)
      // Linhas verticais
      ctx.moveTo(hashX - hashSize * 0.3, hashY - hashSize)
      ctx.lineTo(hashX - hashSize * 0.3, hashY + hashSize)
      ctx.moveTo(hashX + hashSize * 0.3, hashY - hashSize)
      ctx.lineTo(hashX + hashSize * 0.3, hashY + hashSize)
      ctx.stroke()
      break
    }
    
    case 'chaves': {
      // Detalhe do chapéu do Chaves (listras)
      const stripeCount = 3
      const stripeWidth = radius * 0.4
      const stripeHeight = radius * 0.15
      ctx.fillStyle = colors.primary
      for (let i = 0; i < stripeCount; i++) {
        ctx.fillRect(
          pos.x + radius * 0.6,
          pos.y - radius * 0.8 + (i * stripeHeight * 1.2),
          stripeWidth,
          stripeHeight
        )
      }
      break
    }
    
    case 'pomemin': {
      // Raios elétricos ao redor (estilo Pikachu)
      const lightningCount = 4
      ctx.strokeStyle = colors.primary
      ctx.lineWidth = 2.5
      ctx.shadowBlur = 6
      ctx.shadowColor = colors.primary
      for (let i = 0; i < lightningCount; i++) {
        const angle = (i / lightningCount) * Math.PI * 2
        const startX = pos.x + Math.cos(angle) * radius
        const startY = pos.y + Math.sin(angle) * radius
        const midX = pos.x + Math.cos(angle) * outerRadius * 0.9
        const midY = pos.y + Math.sin(angle) * outerRadius * 0.9
        const endX = pos.x + Math.cos(angle) * outerRadius
        const endY = pos.y + Math.sin(angle) * outerRadius
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(midX + Math.cos(angle + 0.3) * radius * 0.1, midY + Math.sin(angle + 0.3) * radius * 0.1)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }
      ctx.shadowBlur = 0
      break
    }
    
    case 'dracula': {
      // Morcegos voando ao redor (símbolo vampiro)
      const batCount = 3
      ctx.fillStyle = '#1a0a0a' // Preto
      ctx.strokeStyle = colors.accent // Roxo
      ctx.lineWidth = 1.5
      for (let i = 0; i < batCount; i++) {
        const angle = (i / batCount) * Math.PI * 2
        const batX = pos.x + Math.cos(angle) * outerRadius
        const batY = pos.y + Math.sin(angle) * outerRadius
        const batSize = radius * 0.12
        
        // Desenha morcego (silhueta simples)
        ctx.beginPath()
        // Corpo
        ctx.ellipse(batX, batY, batSize * 0.3, batSize * 0.5, 0, 0, Math.PI * 2)
        // Asa esquerda
        ctx.moveTo(batX - batSize * 0.3, batY)
        ctx.lineTo(batX - batSize, batY - batSize * 0.6)
        ctx.lineTo(batX - batSize * 0.6, batY - batSize * 0.3)
        ctx.closePath()
        // Asa direita
        ctx.moveTo(batX + batSize * 0.3, batY)
        ctx.lineTo(batX + batSize, batY - batSize * 0.6)
        ctx.lineTo(batX + batSize * 0.6, batY - batSize * 0.3)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
      }
      break
    }
  }
  
  ctx.restore()
}

/**
 * PT: Desenha elementos festivos na orb | EN: Draws festive elements on orb | ES: Dibuja elementos festivos en orb | FR: Dessine éléments festifs sur orb | DE: Zeichnet festliche Elemente auf Orb
 */
function drawFestiveElement(
  ctx: CanvasRenderingContext2D,
  festiveType: FestiveType,
  pos: { x: number; y: number },
  radius: number,
  colors: { primary: string; accent: string; text: string }
) {
  if (!festiveType) return
  
  ctx.save()
  
  switch (festiveType) {
    case 'christmas': {
      // PT: Gorro de Natal (vermelho com pompom branco) | EN: Christmas hat (red with white pom-pom) | ES: Gorro de Navidad (rojo con pompón blanco) | FR: Bonnet de Noël (rouge avec pompon blanc) | DE: Weihnachtsmütze (rot mit weißem Pompon)
      const hatHeight = radius * 0.8
      const hatWidth = radius * 1.2
      
      // Corpo do gorro (triângulo vermelho)
      ctx.fillStyle = '#dc2626' // Vermelho
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y - radius - hatHeight)
      ctx.lineTo(pos.x - hatWidth / 2, pos.y - radius)
      ctx.lineTo(pos.x + hatWidth / 2, pos.y - radius)
      ctx.closePath()
      ctx.fill()
      
      // Borda branca
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Pompom branco
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(pos.x, pos.y - radius - hatHeight - 3, radius * 0.25, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    
    case 'newyear': {
      // PT: Chapéu de festa (cone com confete) | EN: Party hat (cone with confetti) | ES: Sombrero de fiesta (cono con confeti) | FR: Chapeau de fête (cône avec confettis) | DE: Partymütze (Kegel mit Konfetti)
      const hatHeight = radius * 0.7
      const hatWidth = radius * 1.1
      
      // Chapéu colorido
      ctx.fillStyle = colors.accent
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y - radius - hatHeight)
      ctx.lineTo(pos.x - hatWidth / 2, pos.y - radius)
      ctx.lineTo(pos.x + hatWidth / 2, pos.y - radius)
      ctx.closePath()
      ctx.fill()
      
      // Confete (pequenos círculos coloridos)
      const confettiColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = confettiColors[i]
        ctx.beginPath()
        ctx.arc(
          pos.x + (Math.random() - 0.5) * radius * 1.5,
          pos.y - radius - hatHeight - 5 + Math.random() * 10,
          radius * 0.1,
          0,
          Math.PI * 2
        )
        ctx.fill()
      }
      break
    }
    
    case 'easter': {
      // PT: Orelhas de coelho (rosa) | EN: Bunny ears (pink) | ES: Orejas de conejo (rosa) | FR: Oreilles de lapin (rose) | DE: Hasenohren (rosa)
      const earSize = radius * 0.5
      const earOffset = radius * 0.4
      
      // Orelha esquerda
      ctx.fillStyle = '#ffb6c1' // Rosa claro
      ctx.beginPath()
      ctx.ellipse(pos.x - earOffset, pos.y - radius - earSize * 0.3, earSize * 0.4, earSize * 0.7, -0.3, 0, Math.PI * 2)
      ctx.fill()
      
      // Orelha direita
      ctx.beginPath()
      ctx.ellipse(pos.x + earOffset, pos.y - radius - earSize * 0.3, earSize * 0.4, earSize * 0.7, 0.3, 0, Math.PI * 2)
      ctx.fill()
      
      // Interior rosa escuro
      ctx.fillStyle = '#ff69b4'
      ctx.beginPath()
      ctx.ellipse(pos.x - earOffset, pos.y - radius - earSize * 0.3, earSize * 0.2, earSize * 0.4, -0.3, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(pos.x + earOffset, pos.y - radius - earSize * 0.3, earSize * 0.2, earSize * 0.4, 0.3, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    
    case 'halloween': {
      // PT: Morcego minimalista (🦇) | EN: Minimalist bat (🦇) | ES: Murciélago minimalista (🦇) | FR: Chauve-souris minimaliste (🦇) | DE: Minimalistische Fledermaus (🦇)
      const batSize = radius * 1.2
      const wingSpan = batSize * 1.4
      
      ctx.fillStyle = '#1a1a1a' // Preto
      
      // Corpo do morcego (cabeça + corpo)
      ctx.beginPath()
      ctx.arc(pos.x, pos.y - radius - batSize * 0.3, batSize * 0.25, 0, Math.PI * 2)
      ctx.fill()
      
      // Corpo alongado
      ctx.beginPath()
      ctx.ellipse(pos.x, pos.y - radius - batSize * 0.1, batSize * 0.15, batSize * 0.3, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // Asa esquerda (arco superior)
      ctx.beginPath()
      ctx.arc(
        pos.x - wingSpan * 0.3,
        pos.y - radius - batSize * 0.2,
        wingSpan * 0.4,
        Math.PI * 0.3,
        Math.PI * 0.9,
        false
      )
      ctx.lineTo(pos.x - batSize * 0.2, pos.y - radius)
      ctx.closePath()
      ctx.fill()
      
      // Asa direita (arco superior)
      ctx.beginPath()
      ctx.arc(
        pos.x + wingSpan * 0.3,
        pos.y - radius - batSize * 0.2,
        wingSpan * 0.4,
        Math.PI * 0.1,
        Math.PI * 0.7,
        false
      )
      ctx.lineTo(pos.x + batSize * 0.2, pos.y - radius)
      ctx.closePath()
      ctx.fill()
      
      // Orelhas pequenas
      ctx.beginPath()
      ctx.arc(pos.x - batSize * 0.15, pos.y - radius - batSize * 0.45, batSize * 0.08, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(pos.x + batSize * 0.15, pos.y - radius - batSize * 0.45, batSize * 0.08, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    
    case 'carnival': {
      // PT: Máscara de carnaval (colorida) | EN: Carnival mask (colorful) | ES: Máscara de carnaval (colorida) | FR: Masque de carnaval (coloré) | DE: Karnevalsmaske (bunt)
      const maskWidth = radius * 1.4
      const maskHeight = radius * 0.6
      
      // Máscara base
      ctx.fillStyle = colors.accent
      ctx.beginPath()
      ctx.ellipse(pos.x, pos.y - radius * 0.3, maskWidth / 2, maskHeight / 2, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // Decoração (penas/plumas)
      const featherColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00']
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = featherColors[i]
        ctx.beginPath()
        ctx.arc(
          pos.x + (Math.cos(i * Math.PI / 2) * maskWidth * 0.4),
          pos.y - radius * 0.8 + (Math.sin(i * Math.PI / 2) * maskHeight * 0.3),
          radius * 0.15,
          0,
          Math.PI * 2
        )
        ctx.fill()
      }
      break
    }
    
    case 'saojoao': {
      // PT: Chapéu de festa junina (colorido) | EN: June festival hat (colorful) | ES: Sombrero de fiesta junina (colorido) | FR: Chapeau de fête de juin (coloré) | DE: Juni-Festmütze (bunt)
      const hatHeight = radius * 0.6
      const hatWidth = radius * 1.0
      
      // Chapéu (triângulo)
      ctx.fillStyle = '#ff6b35' // Laranja
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y - radius - hatHeight)
      ctx.lineTo(pos.x - hatWidth / 2, pos.y - radius)
      ctx.lineTo(pos.x + hatWidth / 2, pos.y - radius)
      ctx.closePath()
      ctx.fill()
      
      // Bandeirinhas decorativas
      const flagColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00']
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = flagColors[i]
        ctx.fillRect(
          pos.x - hatWidth / 2 + (i * hatWidth / 4),
          pos.y - radius - hatHeight * 0.5,
          hatWidth / 4,
          hatHeight * 0.3
        )
      }
      break
    }
    
    case 'childrensday': {
      // PT: Ursinho/Plushie (🧸) estilizado | EN: Stylized teddy bear/plushie (🧸) | ES: Osito/Peluche estilizado (🧸) | FR: Ours en peluche stylisé (🧸) | DE: Stilisiertes Teddybär/Plüschtier (🧸)
      const bearSize = radius * 0.9
      const headSize = bearSize * 0.5
      const earSize = headSize * 0.4
      
      // Corpo do ursinho (corpo principal)
      ctx.fillStyle = '#8B4513' // Marrom
      ctx.beginPath()
      ctx.ellipse(pos.x, pos.y - radius - bearSize * 0.2, bearSize * 0.35, bearSize * 0.45, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // Cabeça
      ctx.beginPath()
      ctx.arc(pos.x, pos.y - radius - bearSize * 0.7, headSize * 0.5, 0, Math.PI * 2)
      ctx.fill()
      
      // Orelha esquerda
      ctx.beginPath()
      ctx.arc(pos.x - headSize * 0.35, pos.y - radius - bearSize * 0.75, earSize * 0.5, 0, Math.PI * 2)
      ctx.fill()
      // Interior da orelha (mais claro)
      ctx.fillStyle = '#A0522D'
      ctx.beginPath()
      ctx.arc(pos.x - headSize * 0.35, pos.y - radius - bearSize * 0.75, earSize * 0.3, 0, Math.PI * 2)
      ctx.fill()
      
      // Orelha direita
      ctx.fillStyle = '#8B4513'
      ctx.beginPath()
      ctx.arc(pos.x + headSize * 0.35, pos.y - radius - bearSize * 0.75, earSize * 0.5, 0, Math.PI * 2)
      ctx.fill()
      // Interior da orelha (mais claro)
      ctx.fillStyle = '#A0522D'
      ctx.beginPath()
      ctx.arc(pos.x + headSize * 0.35, pos.y - radius - bearSize * 0.75, earSize * 0.3, 0, Math.PI * 2)
      ctx.fill()
      
      // Olhos
      ctx.fillStyle = '#000000'
      ctx.beginPath()
      ctx.arc(pos.x - headSize * 0.15, pos.y - radius - bearSize * 0.7, headSize * 0.08, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(pos.x + headSize * 0.15, pos.y - radius - bearSize * 0.7, headSize * 0.08, 0, Math.PI * 2)
      ctx.fill()
      
      // Nariz (triângulo pequeno)
      ctx.fillStyle = '#FF69B4' // Rosa
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y - radius - bearSize * 0.6)
      ctx.lineTo(pos.x - headSize * 0.08, pos.y - radius - bearSize * 0.55)
      ctx.lineTo(pos.x + headSize * 0.08, pos.y - radius - bearSize * 0.55)
      ctx.closePath()
      ctx.fill()
      
      // Boca (curva simples)
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(pos.x, pos.y - radius - bearSize * 0.55, headSize * 0.1, 0, Math.PI)
      ctx.stroke()
      
      // Braços (pequenos círculos nas laterais)
      ctx.fillStyle = '#8B4513'
      ctx.beginPath()
      ctx.arc(pos.x - bearSize * 0.4, pos.y - radius - bearSize * 0.1, bearSize * 0.15, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(pos.x + bearSize * 0.4, pos.y - radius - bearSize * 0.1, bearSize * 0.15, 0, Math.PI * 2)
      ctx.fill()
      break
    }
  }
  
  ctx.restore()
}

/**
 * DevOrbsCanvas Component
 * 
 * Renders physics-based Dev Orbs on canvas with Matter.js integration.
 * Canvas fits viewport height minus header height (no scroll).
 */
export function DevOrbsCanvas({ users, onShakeReady, onScoreChange, onTest99Baskets }: DevOrbsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const worldRef = useRef<Matter.World | null>(null)
  const orbsRef = useRef<Orb[]>([])
  const staticOrbsRef = useRef<StaticOrb[]>([])
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map())
  const animationFrameRef = useRef<number>()
  const lastFrameTimeRef = useRef<number>(0)
  const fpsRef = useRef<number>(60)
  const fpsHistoryRef = useRef<number[]>([])
  const lastOrbsCountRef = useRef<number>(0)
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null)
  const spawnIndexRef = useRef<number>(0)
  
  // Drag state
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const isDraggingRef = useRef<boolean>(false)
  const draggedOrbRef = useRef<Orb | null>(null)
  
  // Score state
  const scoreRef = useRef<number>(0)
  const bestScoreRef = useRef<number>(
    typeof window !== "undefined" 
      ? (() => {
          const saved = localStorage.getItem("dev-orbs-best-score")
    return saved ? parseInt(saved, 10) : 0
        })()
      : 0
  )
  const sensorBodyRef = useRef<Matter.Body | null>(null)
  const scoredOrbsRef = useRef<Set<string>>(new Set())
  
  // Rim support colliders (left and right physical supports)
  const leftSupportBodyRef = useRef<Matter.Body | null>(null)
  const rightSupportBodyRef = useRef<Matter.Body | null>(null)
  
  // Animation refs for score effects
  const rimGlowRef = useRef<number>(8) // Default shadowBlur (elegant, less spread)
  const rimAlphaRef = useRef<number>(1) // Default alpha
  const backboardFlashRef = useRef<number>(0) // Flash intensity (0-1)
  const scoreboardShakeRef = useRef<number>(0) // Shake offset
  const digitScaleRef = useRef<number>(1) // Scale for digit pulse animation
  const digitGlowRef = useRef<number>(10) // Glow for digits (10 default, 20 on score)
  
  // Shake animation refs
  const rimShakeRef = useRef<number>(0) // Rim shake offset
  const backboardShakeRef = useRef<number>(0) // Backboard shake offset
  const isShakingRef = useRef<boolean>(false) // Shake state
  
  // Shake visual effect state (theme-specific)
  interface ShakeEffect {
    startTime: number
    duration: number
    themeId: ThemeId
  }
  const shakeEffectRef = useRef<ShakeEffect | null>(null)
  
  // Chaves theme: El Chavo character animation (appears from barrel)
  interface ChavesShakeEffect {
    startTime: number
    duration: number
    cryingSoundPlayed?: boolean
  }
  const chavesShakeEffectRef = useRef<ChavesShakeEffect | null>(null)
  
  // Chaves theme: Crying particles
  interface CryingParticle {
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
  }
  const chavesCryingParticlesRef = useRef<CryingParticle[]>([])
  
  // Star Wars theme: Proton beam easter egg
  interface ProtonBeam {
    x: number
    y: number
    targetX: number
    targetY: number
    progress: number
    side: 'left' | 'right'
    index: number
  }
  interface StarWarsEasterEgg {
    startTime: number
    beams: ProtonBeam[]
    explosionPhase: 'traveling' | 'exploding' | 'done'
    explosionProgress: number
  }
  const starWarsEasterEggRef = useRef<StarWarsEasterEgg | null>(null)
  
  // Star Wars theme: Neon Assault easter egg
  interface NeonBeam {
    x: number
    y: number
    targetX: number
    targetY: number
    vx: number
    vy: number
    group: 1 | 2 | 3
    index: number
    active: boolean
  }
  interface ShipFragment {
    x: number
    y: number
    vx: number
    vy: number
    rotation: number
    rotationSpeed: number
    life: number
    maxLife: number
  }
  interface ExplosionParticle {
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
  }
  type NeonAssaultState = 'idle' | 'firing_group_1' | 'firing_group_2' | 'firing_group_3' | 'impact' | 'explosion' | 'done'
  interface NeonAssaultEasterEgg {
    state: NeonAssaultState
    startTime: number
    beams: NeonBeam[]
    shipShake: number
    shipAlpha: number
    fragments: ShipFragment[]
    explosionParticles: ExplosionParticle[]
    explosionRadius: number
  }
  const neonAssaultEasterEggRef = useRef<NeonAssaultEasterEgg | null>(null)
  const neonAssaultTriggeredRef = useRef<boolean>(false) // Track if already triggered this session
  
  // Fireworks particles
  interface FireworkParticle {
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
    color: string
    size: number
  }
  const fireworksRef = useRef<FireworkParticle[]>([])
  const createFireworksRef = useRef<((x: number, y: number, colors: ReturnType<typeof getThemeColors>) => void) | null>(null)
  
  // Indiana Jones theme: Visual effects state
  interface DustParticle {
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
    size: number
  }
  const dustParticlesRef = useRef<DustParticle[]>([])
  
  // Starfield for Star Wars theme
  const starfieldRef = useRef<Array<{ x: number; y: number; speed: number; size: number; opacity: number }>>([])
  
  interface DivineLightEffect {
    startTime: number
    duration: number
    x: number
    y: number
  }
  const divineLightRef = useRef<DivineLightEffect | null>(null)
  
  // Star Wars theme effects
  interface SaberFlashEffect {
    startTime: number
    duration: number
    x: number
    y: number
    color: 'blue' | 'red'
  }
  const saberFlashRef = useRef<SaberFlashEffect | null>(null)
  
  interface DarkShockEffect {
    startTime: number
    duration: number
    x: number
    y: number
  }
  const darkShockRef = useRef<DarkShockEffect | null>(null)
  
  interface HyperspaceBurstEffect {
    startTime: number
    duration: number
  }
  const hyperspaceBurstRef = useRef<HyperspaceBurstEffect | null>(null)
  
  interface AstromechPingEffect {
    startTime: number
    duration: number
    x: number
    y: number
  }
  const astromechPingRef = useRef<AstromechPingEffect | null>(null)
  
  // Track floor collisions per orb for hyperspace burst
  const orbFloorCollisionsRef = useRef<Map<string, number>>(new Map())
  
  const templeShakeRef = useRef<{ active: boolean; startTime: number; duration: number; intensity: number }>({
    active: false,
    startTime: 0,
    duration: 300, // 300ms
    intensity: 2, // ±2px
  })
  
  // Indiana Jones theme: Temple Collapse Event Easter Egg state
  interface TempleCollapsePhase {
    phase: 1 | 2 | 3 | 4 | 5 // 1-4: phases, 5: final message
    startTime: number
  }
  const templeCollapseRef = useRef<TempleCollapsePhase | null>(null)
  
  interface FallingStone {
    x: number
    y: number
    vy: number
    size: number
    life: number
  }
  const fallingStonesRef = useRef<FallingStone[]>([])
  
  // Portal system state
  interface PortalParticle {
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
    color: string
    size: number
    isGlitch?: boolean
  }
  
  interface Portal {
    x: number
    y: number
    width: number
    height: number
    color: string
    type: 'orange' | 'blue'
  }
  
  interface WarpEffect {
    x: number
    y: number
    startTime: number
    duration: number
  }
  
  const portalOrangeRef = useRef<Portal>({ x: 0, y: 0, width: 120, height: 40, color: '#ff7a00', type: 'orange' })
  const portalBlueRef = useRef<Portal>({ x: 0, y: 0, width: 80, height: 35, color: '#24b0ff', type: 'blue' })
  const portalParticlesRef = useRef<PortalParticle[]>([])
  const warpEffectsRef = useRef<WarpEffect[]>([])
  const portalDragStateRef = useRef<{ isDragging: boolean; portal: 'orange' | 'blue' | null; startX: number; startY: number; startPortalX: number; startPortalY: number }>({ isDragging: false, portal: null, startX: 0, startY: 0, startPortalX: 0, startPortalY: 0 })
  const orbTeleportCooldownRef = useRef<Map<string, number>>(new Map())
  const hoopBendProgressRef = useRef<number>(0)
  const glitchTextRef = useRef<{ visible: boolean; time: number }>({ visible: false, time: 0 })
  const audioContextRef = useRef<AudioContext | null>(null)
  
  const { theme: themeId } = useThemeStore()
  const { mode: mobileMode, init: initMobileMode } = useMobileModeStore()
  const { level: fpsLevel, setFPS } = useFPSGuardianStore()
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return true
    const saved = localStorage.getItem("dev-orbs-visible")
    return saved !== null ? saved === "true" : true
  })
  
  // PT: Estado para controlar efeitos festivos | EN: State to control festive effects | ES: Estado para controlar efectos festivos | FR: État pour contrôler les effets festifs | DE: Zustand zur Steuerung festlicher Effekte
  const [festiveEffectsEnabled, setFestiveEffectsEnabled] = useState(() => {
    if (typeof window === "undefined") return true
    const saved = localStorage.getItem("dev-orbs-festive-effects")
    return saved !== null ? saved === "true" : true
  })
  
  // PT: Forçar festividade para teste | EN: Force festivity for testing | ES: Forzar festividad para prueba | FR: Forcer fête pour test | DE: Feiertag zum Testen erzwingen
  const [forceFestivity, setForceFestivity] = useState<FestiveType | null>(null) // null = usar data real
  
  // PT: Estado para animação de confetes | EN: State for confetti animation | ES: Estado para animación de confeti | FR: État pour animation de confettis | DE: Zustand für Konfetti-Animation
  const [showConfetti, setShowConfetti] = useState(false)
  
  // Initialize mobile mode on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      initMobileMode()
    }
  }, [initMobileMode])
  
  // Force dynamic mode for all devices - no more static mode
  const isLiteMode = false // Always use physics-based orbs, never static
  
  // FPS level states
  const isFPSLevel0 = fpsLevel === 0 // FPS ≥ 50: everything enabled
  const isFPSLevel1 = fpsLevel === 1 // 40 ≤ FPS < 50: smooth degradation
  const isFPSLevel2 = fpsLevel === 2 // FPS < 40: aggressive fallback
  
  // Multi-tab protection: check if we should pause
  const shouldPause = useMultiTabStore((state) => state.shouldPause())

  // Track previous canvas size for portal resize
  const prevCanvasSizeRef = useRef({ width: 0, height: 0 })
  
  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setIsMounted(true)
    const size = calculateCanvasSize()
        if (size.width > 0 && size.height > 0) {
      setCanvasSize(size)
      // Initialize portals (direct initialization, not using callback to avoid dependency issues)
      if (themeId === "portal") {
        const headerHeight = 96
        const wallThickness = 50
        
        // Orange portal on floor - positioned slightly above floor to swallow resting orbs
        portalOrangeRef.current.x = size.width * 0.2
        portalOrangeRef.current.y = size.height - 45 // Slightly above floor to swallow resting orbs
        
        // Blue portal on ceiling - positioned very close to header
        portalBlueRef.current.x = size.width / 2
        portalBlueRef.current.y = headerHeight + 5 // Very close to header, almost touching
      }
      
      // Trigger Neon Assault easter egg (0.3% chance, only once per session, only on star-wars theme)
      if (themeId === "star-wars" && !neonAssaultTriggeredRef.current) {
        const { mode: currentMobileMode } = useMobileModeStore.getState()
        if (currentMobileMode !== 'lite' && Math.random() < 0.003) {
          neonAssaultTriggeredRef.current = true
          // Delay trigger slightly to ensure canvas is ready
          setTimeout(() => {
            triggerNeonAssault()
          }, 500)
        }
      }
    } else {
      // Retry after a short delay
      setTimeout(() => {
        const retrySize = calculateCanvasSize()
                if (retrySize.width > 0 && retrySize.height > 0) {
          setCanvasSize(retrySize)
          // Initialize portals (direct initialization)
          if (themeId === "portal") {
            const headerHeight = 96
            
            // Orange portal on floor - positioned slightly above floor to swallow resting orbs
            portalOrangeRef.current.x = retrySize.width * 0.2
            portalOrangeRef.current.y = retrySize.height - 45 // Slightly above floor to swallow resting orbs
            
            // Blue portal on ceiling - positioned close to header
            portalBlueRef.current.x = retrySize.width / 2
            portalBlueRef.current.y = headerHeight + 5 // Very close to header, almost touching
          }
        }
      }, 100)
    }
  }, [themeId])
  
  // Update portals on canvas resize
  useEffect(() => {
    if (canvasSize.width > 0 && canvasSize.height > 0 && themeId === "portal") {
      if (prevCanvasSizeRef.current.width > 0 && prevCanvasSizeRef.current.height > 0) {
        // Update portals proportionally
        const scaleX = canvasSize.width / prevCanvasSizeRef.current.width
        const scaleY = canvasSize.height / prevCanvasSizeRef.current.height
        portalOrangeRef.current.x *= scaleX
        portalOrangeRef.current.y *= scaleY
        portalBlueRef.current.x *= scaleX
        portalBlueRef.current.y *= scaleY
      } else {
        // First time, just initialize
        const headerHeight = 96
        
        // Orange portal on floor - positioned slightly above floor to swallow resting orbs
        portalOrangeRef.current.x = canvasSize.width * 0.2
        portalOrangeRef.current.y = canvasSize.height - 45 // Slightly above floor to swallow resting orbs
        
        // Blue portal on ceiling - positioned close to header
        portalBlueRef.current.x = canvasSize.width / 2
        portalBlueRef.current.y = headerHeight + 5 // Very close to header, almost touching
      }
      prevCanvasSizeRef.current = { width: canvasSize.width, height: canvasSize.height }
    }
  }, [canvasSize.width, canvasSize.height, themeId])

  // Get theme colors from CSS variables
  const getThemeColors = () => {
    if (typeof window === "undefined") return null

    const root = document.documentElement
    const computedStyle = getComputedStyle(root)

    return {
      primary: computedStyle.getPropertyValue("--color-primary").trim(),
      accent: computedStyle.getPropertyValue("--color-accent").trim(),
      text: computedStyle.getPropertyValue("--color-text").trim(),
      glow: computedStyle.getPropertyValue("--color-glow").trim(),
      bg: computedStyle.getPropertyValue("--color-bg").trim(),
      bgSecondary: computedStyle.getPropertyValue("--color-bg-secondary").trim(),
      border: computedStyle.getPropertyValue("--color-border").trim(),
    }
  }

  // Calculate canvas dimensions (viewport height - header height)
  const calculateCanvasSize = () => {
    if (typeof window === "undefined") return { width: 0, height: 0 }

    const headerHeight = 96 // Approximate header height (pt-24 = 96px)
    const width = window.innerWidth
    const height = window.innerHeight - headerHeight

    return { width, height }
  }

  // Load avatar image via proxy to bypass Twitter CORS restrictions
  const loadAvatarImage = useCallback((userId: number, orbId: string): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      // Use proxy endpoint to avoid CORS issues with Twitter images
      const proxyUrl = `/api/avatars/${userId}`
      
      // Check cache by userId
      const cacheKey = `avatar-${userId}`
      if (imagesRef.current.has(cacheKey)) {
        resolve(imagesRef.current.get(cacheKey)!)
        return
      }

      const img = new Image()
      img.crossOrigin = "anonymous" // Now safe because it's our domain
      
      img.onload = () => {
        imagesRef.current.set(cacheKey, img)
        resolve(img)
      }
      
      img.onerror = (error) => {
        console.warn(`[DevOrbs] Failed to load avatar for user ${userId}:`, error)
        resolve(null)
      }
      
      img.src = proxyUrl
    })
  }, [])

  // Generate static orbs for mobile lite mode (5-7 orbs in random positions)
  const generateStaticOrbs = useCallback((canvasWidth: number, canvasHeight: number, users: UserData[]): StaticOrb[] => {
    const orbCount = 5 + Math.floor(Math.random() * 3) // 5-7 orbs
    const isMobile = isMobileDevice()
    const radius = isMobile ? ORB_RADIUS_MOBILE : ORB_RADIUS_DESKTOP
    const headerHeight = 96
    const floorHeight = canvasHeight * 0.2
    const floorY = canvasHeight - floorHeight
    const backboardY = headerHeight + 20
    const backboardHeight = 140
    const backboardBottom = backboardY + backboardHeight
    
    // Safe area: avoid header, backboard, and floor
    const safeTop = backboardBottom + 20
    const safeBottom = floorY - radius - 10
    const safeLeft = radius
    const safeRight = canvasWidth - radius
    
    const staticOrbs: StaticOrb[] = []
    const usedUsers = new Set<number>()
    
    for (let i = 0; i < orbCount && i < users.length; i++) {
      // Pick a random user (avoid duplicates if possible)
      let user: UserData
      let attempts = 0
      do {
        const randomIndex = Math.floor(Math.random() * users.length)
        user = users[randomIndex]
        attempts++
      } while (usedUsers.has(user.userId) && attempts < users.length)
      
      usedUsers.add(user.userId)
      
      // Random position in safe area
      const x = safeLeft + Math.random() * (safeRight - safeLeft)
      const y = safeTop + Math.random() * (safeBottom - safeTop)
      
      staticOrbs.push({
        id: `static-orb-${user.userId}-${i}`,
        userId: user.userId,
        avatar: user.avatar,
        username: user.username,
        x,
        y,
        image: null,
        imageLoaded: false,
      })
    }
    
    // Load images for static orbs (will be handled after drawStaticCanvas is defined)
    staticOrbs.forEach((orb) => {
      if (orb.userId) {
        loadAvatarImage(orb.userId, orb.id).then((img) => {
          orb.image = img
          orb.imageLoaded = true
          // Force redraw of static canvas when image loads
          if (isLiteMode && canvasRef.current) {
            drawStaticCanvas()
          }
        })
      } else {
        orb.imageLoaded = true
      }
    })
    
    return staticOrbs
  }, [loadAvatarImage])

  // Spawn a single orb
  const spawnOrb = useCallback((user: UserData, index: number) => {
    const isMobile = isMobileDevice()
    const maxOrbs = isMobile ? MAX_ORBS_MOBILE : MAX_ORBS_DESKTOP
    
    if (!engineRef.current || !worldRef.current || orbsRef.current.length >= maxOrbs) {
      return
    }

    const size = calculateCanvasSize()
    if (size.width === 0 || size.height === 0) return

    const radius = isMobile ? ORB_RADIUS_MOBILE : ORB_RADIUS_DESKTOP
    const config = getPhysicsConfig()

    // Random horizontal position at top
    const x = radius + Math.random() * (size.width - radius * 2)
    const y = radius + 20 // Spawn slightly below top

    // Create physics body
    const body = createOrbBody(x, y, radius, config)
    
    // Create orb object with unique ID (timestamp + random to ensure uniqueness)
    const orb: Orb = {
      id: `orb-${user.userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.userId,
      avatar: user.avatar,
      username: user.username,
      body,
      image: null,
      imageLoaded: false,
      meta: {}, // Always initialize meta as empty object
    }

    // Assign Indiana Jones variant if theme is active
    if (themeId === "indiana-jones") {
      if (!orb.meta) orb.meta = {}
      orb.meta.indyVariant = pickRandomVariant()
    }

    // Assign Star Wars variant if theme is active
    if (themeId === "star-wars") {
      if (!orb.meta) orb.meta = {}
      orb.meta.starWarsVariant = pickRandomStarWarsVariant()
    }

    // Load avatar image via proxy
    if (user.userId) {
      loadAvatarImage(user.userId, orb.id).then((img) => {
        if (img) {
          orb.image = img
          orb.imageLoaded = true
          // The animation loop will automatically pick up the loaded image on next frame
          // No need to force redraw - the continuous render loop handles it
        } else {
          orb.imageLoaded = true // Mark as loaded even if image failed
        }
      }).catch((error) => {
        console.warn(`[DevOrbs] Error loading avatar for user ${user.userId}:`, error)
        orb.imageLoaded = true // Mark as loaded to prevent infinite retries
      })
    } else {
      orb.imageLoaded = true // No avatar to load
    }

    // Add to physics world
    addBodyToWorld(worldRef.current, body)
    orbsRef.current.push(orb)
  }, [loadAvatarImage, themeId])

  // Start sequential spawn
  const startSpawnSequence = useCallback(() => {
    // Don't restart if already spawning
    if (spawnTimerRef.current) {
      return
    }

    // Only reset spawn index if we're starting fresh (no orbs exist)
    if (orbsRef.current.length === 0) {
      spawnIndexRef.current = 0
    }

    const spawnNext = () => {
      const isMobile = isMobileDevice()
      const maxOrbs = isMobile ? MAX_ORBS_MOBILE : MAX_ORBS_DESKTOP
      
      // Stop if we've spawned all users or reached max orbs
      if (spawnIndexRef.current >= users.length || orbsRef.current.length >= maxOrbs) {
        if (spawnTimerRef.current) {
          clearInterval(spawnTimerRef.current)
          spawnTimerRef.current = null
        }
        return
      }

      const user = users[spawnIndexRef.current]
      spawnOrb(user, spawnIndexRef.current)
      spawnIndexRef.current++
    }

    // Spawn first orb immediately (if we haven't spawned all yet)
    const isMobile = isMobileDevice()
    const maxOrbs = isMobile ? MAX_ORBS_MOBILE : MAX_ORBS_DESKTOP
    if (spawnIndexRef.current < users.length && orbsRef.current.length < maxOrbs) {
      spawnNext()
    }

    // Spawn remaining orbs at interval
    spawnTimerRef.current = setInterval(spawnNext, SPAWN_INTERVAL_MS)
  }, [users, spawnOrb])

  // Handle window resize
  useEffect(() => {
    if (!isMounted) return

    const handleResize = () => {
      const size = calculateCanvasSize()
      setCanvasSize(size)
    }

    handleResize() // Initial calculation
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isMounted])

  // Listen for test 99 baskets event
  useEffect(() => {
    const handleTest99 = () => {
      if (onTest99Baskets) {
        onTest99Baskets()
      } else {
        // Force score to 98, then increment to 99 to trigger easter egg
        const prevScore = scoreRef.current
        scoreRef.current = 98
        // Trigger increment to 99
        if (onScoreChange) {
          onScoreChange(99)
        }
      }
    }

    window.addEventListener('trigger99Baskets', handleTest99)
    return () => window.removeEventListener('trigger99Baskets', handleTest99)
  }, [onTest99Baskets, onScoreChange])

  // Initialize physics engine (runs once after mount)
  useEffect(() => {
    if (!isMounted) return

    const size = calculateCanvasSize()
    if (size.width === 0 || size.height === 0) return

    // Set initial canvas size
    setCanvasSize(size)

    // Indiana Jones theme: Check for easter egg trigger on canvas load
    triggerIndianaJonesEasterEgg()

    // Skip physics engine initialization in mobile lite mode
    if (isLiteMode) {
            return
    }

    
    // Get physics config based on device
    const config = getPhysicsConfig()

    // Create physics engine
    const engine = createPhysicsEngine(config)
    engineRef.current = engine
    worldRef.current = engine.world

    
    // Create boundaries
    const boundaries = createBoundaries(size.width, size.height)
    boundaries.forEach((boundary) => {
      Matter.World.add(engine.world, boundary)
    })

    // Create rim support colliders and sensor
    // Position matches the rim position (dentro do backboard)
    const headerHeight = 96
    const backboardY = headerHeight + 20
    const backboardHeight = 140 // Increased by 50% then +30% then +20% (60 * 1.5 * 1.3 * 1.2 = 140.4 ≈ 140)
    const backboardBottom = backboardY + backboardHeight
    const rimCenterY = backboardBottom - 15 // Aro fica 15px dentro do backboard
    const rimCenterX = size.width / 2
    const rimRadius = 60
    
    // Support collider dimensions
    const supportWidth = 10
    const supportHeight = 25
    const supportOffsetX = supportWidth / 2 // Offset to center the support
    
    // Left support collider (left side of rim)
    const leftSupportX = rimCenterX - rimRadius + supportOffsetX
    const leftSupportY = rimCenterY
    const leftSupport = Bodies.rectangle(
      leftSupportX,
      leftSupportY,
      supportWidth,
      supportHeight,
      {
        isStatic: true,
        isSensor: false, // Physical collision
        restitution: 0.2,
        friction: 0.5,
        render: { visible: false }, // Invisible (visual is drawn separately)
        label: 'rim-left-support',
      }
    )
    Matter.World.add(engine.world, leftSupport)
    leftSupportBodyRef.current = leftSupport
    
    // Right support collider (right side of rim)
    const rightSupportX = rimCenterX + rimRadius - supportOffsetX
    const rightSupportY = rimCenterY
    const rightSupport = Bodies.rectangle(
      rightSupportX,
      rightSupportY,
      supportWidth,
      supportHeight,
      {
        isStatic: true,
        isSensor: false, // Physical collision
        restitution: 0.2,
        friction: 0.5,
        render: { visible: false }, // Invisible (visual is drawn separately)
        label: 'rim-right-support',
      }
    )
    Matter.World.add(engine.world, rightSupport)
    rightSupportBodyRef.current = rightSupport
    
    // Sensor for basket detection (inside the rim arc)
    const sensorWidth = 70
    const sensorHeight = 10
    const sensorX = rimCenterX - sensorWidth / 2
    const sensorY = rimCenterY + 5 // Sensor fica logo abaixo do centro do aro

    const sensor = Bodies.rectangle(
      sensorX + sensorWidth / 2,
      sensorY + sensorHeight / 2,
      sensorWidth,
      sensorHeight,
      {
        isStatic: true,
        isSensor: true, // Sensor doesn't create physical collisions
        render: { visible: false }, // Invisible
        label: 'basket-sensor',
      }
    )
    
    Matter.World.add(engine.world, sensor)
    sensorBodyRef.current = sensor

    // Setup collision detection for scoring and portal teleportation
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair
        const sensor = sensorBodyRef.current
        
        if (!sensor) return

        // Portal teleportation is now handled in the render loop for continuous checking

            // Star Wars theme: Check for rim hit (dark shock effect)
        if (themeId === "star-wars") {
          const { mode: mobileMode } = useMobileModeStore.getState()
          if (mobileMode !== 'lite') {
            // Check if collision involves rim supports and an orb
            const rimBody = leftSupportBodyRef.current || rightSupportBodyRef.current
            if (rimBody && (bodyA === rimBody || bodyB === rimBody)) {
              const orbBody = bodyA === rimBody ? bodyB : bodyA
              const orb = orbsRef.current.find((o) => o.body === orbBody)
              if (orb) {
                const rimPos = getBodyPosition(rimBody)
                triggerDarkShock(rimPos.x, rimPos.y)
              }
            }
          }
        }
        
        // Star Wars theme: Check for orb-to-orb collision (astromech ping on any orb collision)
        if (themeId === "star-wars") {
          const { mode: mobileMode } = useMobileModeStore.getState()
          if (mobileMode !== 'lite') {
            // Check if collision involves two orbs (orb-to-orb collision)
            const orbA = orbsRef.current.find((o) => o.body === bodyA)
            const orbB = orbsRef.current.find((o) => o.body === bodyB)
            
            if (orbA && orbB) {
              // Two orbs collided - trigger astromech ping at collision point
              const posA = getBodyPosition(bodyA)
              const posB = getBodyPosition(bodyB)
              const collisionX = (posA.x + posB.x) / 2
              const collisionY = (posA.y + posB.y) / 2
              triggerAstromechPing(collisionX, collisionY)
            }
          }
        }
        
        // Star Wars theme: Check for floor collision (hyperspace burst after 3 collisions)
        if (themeId === "star-wars") {
          const { mode: mobileMode } = useMobileModeStore.getState()
          if (mobileMode !== 'lite') {
            // Check if collision involves an orb and a static body (likely boundary/ground)
            const orb = orbsRef.current.find((o) => o.body === bodyA || o.body === bodyB)
            if (orb) {
              // Check if it's a floor collision (body is static and at bottom)
              const staticBody = (bodyA.label?.includes('boundary') || bodyB.label?.includes('boundary')) 
                ? (bodyA.label?.includes('boundary') ? bodyA : bodyB)
                : null
              if (staticBody) {
                const currentCount = orbFloorCollisionsRef.current.get(orb.id) || 0
                const newCount = currentCount + 1
                orbFloorCollisionsRef.current.set(orb.id, newCount)
                
                // Trigger hyperspace burst after 3 collisions
                if (newCount >= 3) {
                  triggerHyperspaceBurst()
                  orbFloorCollisionsRef.current.set(orb.id, 0) // Reset counter
                }
              }
            }
          }
        }

        // Indiana Jones theme: Check for ground collision (dust puff effect)
        if (themeId === "indiana-jones") {
          const { mode: mobileMode } = useMobileModeStore.getState()
          if (mobileMode !== 'lite') {
            // Check if collision involves an orb and a static body (likely boundary/ground)
            const orb = orbsRef.current.find((o) => o.body === bodyA || o.body === bodyB)
            if (orb) {
              const orbBody = orb.body === bodyA ? bodyA : bodyB
              const otherBody = orb.body === bodyA ? bodyB : bodyA
              
              // Check if other body is static (boundary/ground) and orb is near bottom
              if (otherBody.isStatic) {
                const orbPos = getBodyPosition(orbBody)
                const floorY = canvasSize.height - 25 // Floor is at height - wallThickness/2
                
                // Check if orb is near ground (within 20px of floor)
                if (orbPos.y >= floorY - 20 && orbPos.y <= floorY + 20) {
                  const colors = getThemeColors()
                  if (colors) {
                    createDustPuff(orbPos.x, floorY, colors)
                  }
                }
              }
            }
          }
        }

        // Check if collision involves sensor and an orb
        if ((bodyA === sensor || bodyB === sensor)) {
          const orbBody = bodyA === sensor ? bodyB : bodyA
          
          // Find the orb
          const orb = orbsRef.current.find((o) => o.body === orbBody)
          if (orb) {
            // CRITICAL: Only score if orb is moving downward (coming from above)
            // This prevents scoring when orb bounces UP through the sensor
            // In Matter.js: positive Y velocity = downward movement, negative = upward
            const velocity = orbBody.velocity
            // Only score if velocity.y is positive (downward movement)
            // Allow even slow falls to score, as long as it's moving down
            if (velocity.y <= 0) {
              // Orb is moving upward (negative) or stationary (0) - don't score
              return
            }
            
            // Allow multiple scores from the same orb - just needs to come from above
            
            // Get orb position for fireworks
            const orbPos = getBodyPosition(orbBody)
            const colors = getThemeColors()
            if (colors && createFireworksRef.current) {
              // Create fireworks at orb position
              createFireworksRef.current(orbPos.x, orbPos.y, colors)
            }
            
            // Increment score
            const prevScore = scoreRef.current
            scoreRef.current += 1
            
            // Indiana Jones theme: Visual effects on basket made
            if (themeId === "indiana-jones") {
              // Divine light effect
              const basketX = canvasSize.width / 2
              const basketY = headerHeight + 20 + 70 // Approximate basket position
              triggerDivineLight(basketX, basketY)
              
              // Temple shake every 5 baskets
              if (scoreRef.current % 5 === 0) {
                triggerTempleShake()
              }
            }
            
            // Star Wars theme: Visual effects on basket made
            if (themeId === "star-wars") {
              const basketX = canvasSize.width / 2
              const basketY = headerHeight + 20 + 70 // Approximate basket position
              // Saber flash (color depends on orb variant)
              triggerSaberFlash(basketX, basketY, orb.meta?.starWarsVariant)
              // Astromech ping
              triggerAstromechPing(basketX, basketY)
            }
            
            // Check for 99 baskets easter egg
            if (prevScore < 99 && scoreRef.current === 99) {
              if (typeof window !== "undefined") {
                const eggUnlocked = localStorage.getItem('compilechill_egg_99_v1')
                if (!eggUnlocked) {
                  // Trigger easter egg
                  if (onScoreChange) {
                    onScoreChange(99)
                  }
                }
              }
            }
            
            // Update best score
            if (scoreRef.current > bestScoreRef.current) {
              bestScoreRef.current = scoreRef.current
              // Save to localStorage
              if (typeof window !== "undefined") {
                localStorage.setItem("dev-orbs-best-score", bestScoreRef.current.toString())
              }
            }
            
            // Notify score change
            if (onScoreChange) {
              onScoreChange(scoreRef.current)
            }
            
            // Trigger visual effects on score
            // Rim pulse glow (300ms) - increase from 8 to 16
            rimGlowRef.current = 16
            setTimeout(() => {
              rimGlowRef.current = 8
            }, 300)
            
            // Rim alpha pulse (200ms)
            rimAlphaRef.current = 1.2
            setTimeout(() => {
              rimAlphaRef.current = 1
            }, 200)
            
            // Backboard flash (200ms)
            backboardFlashRef.current = 1
            setTimeout(() => {
              backboardFlashRef.current = 0
            }, 200)
            
            // Digit pulse animation (150ms) - scale 1.0 → 1.05 → 1.0
            digitScaleRef.current = 1.05
            setTimeout(() => {
              digitScaleRef.current = 1.0
            }, 150)

            // Digit glow pulse (150ms) - shadowBlur 10 → 20 → 10
            digitGlowRef.current = 20
            setTimeout(() => {
              digitGlowRef.current = 10
            }, 150)
          }
        }
      })
    })

    // Cleanup only on unmount
    return () => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current)
      }
      Matter.Events.off(engine, 'collisionStart')
            if (engineRef.current) {
        Matter.Engine.clear(engineRef.current)
        engineRef.current = null
        worldRef.current = null
      }
      orbsRef.current = []
      leftSupportBodyRef.current = null
      rightSupportBodyRef.current = null
      sensorBodyRef.current = null
    }
  }, [isMounted])

  // Start spawn when users are available (only once when users first load)
  const hasSpawnedRef = useRef(false)
  
  useEffect(() => {
    // Skip spawn in mobile lite mode
    if (isLiteMode) {
      return
    }
    
    // Spawn ONCE when users are loaded and engine is ready
    // Never re-spawn after that, even if users change
    if (users.length > 0 && engineRef.current && !hasSpawnedRef.current) {
      hasSpawnedRef.current = true
      startSpawnSequence()
    }

    return () => {
      // Cleanup on unmount only - don't clear interval if we're just re-rendering
      // Only clear if component is actually unmounting
      // We'll handle interval cleanup separately to avoid clearing it on re-renders
    }
  }, [users.length, engineRef.current, isLiteMode]) // React when users are loaded (removed startSpawnSequence to avoid re-creating on every render)
  
  // Separate cleanup effect that only runs on unmount
  useEffect(() => {
    return () => {
      // This cleanup only runs on unmount
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current)
        spawnTimerRef.current = null
      }
    }
  }, []) // Empty deps = only cleanup on unmount

  // Handle shake function - throws all orbs upward with strong force
  const handleShake = useCallback(() => {
    if (!engineRef.current || !worldRef.current || isShakingRef.current) return
    
    // For Chaves theme, also check if animation is already running
    if (themeId === 'chaves' && chavesShakeEffectRef.current) {
      return // Wait for animation to finish
    }
    
    isShakingRef.current = true
    
    // Trigger theme-specific visual effect
    // Chaves theme: Easter egg only activates by clicking barrel, not shake button
    if (themeId !== 'chaves') {
      // Other themes: Standard center screen effect
      shakeEffectRef.current = {
        startTime: Date.now(),
        duration: 800, // Match shake duration
        themeId: themeId,
      }
    }
    
    // Apply strong upward impulses to all orbs (jogar todas pro alto)
    orbsRef.current.forEach((orb) => {
      // Random horizontal component (left/right spread) - DOUBLED
      const horizontalSpread = (Math.random() - 0.5) * 16 // -8 to +8 (dobrado)
      // Strong upward force (accentuated) - DOUBLED
      const upwardForce = 30 + Math.random() * 20 // 30-50 (dobrado, muito forte para cima)
      
      // Apply strong impulse upward with some horizontal spread
      Body.applyForce(orb.body, orb.body.position, {
        x: horizontalSpread * 0.001,
        y: -upwardForce * 0.001, // Negative Y = upward
      })
      
      // Also apply velocity directly for immediate effect
      const currentVel = orb.body.velocity
      Body.setVelocity(orb.body, {
        x: currentVel.x + horizontalSpread * 0.3,
        y: currentVel.y - upwardForce * 0.4, // Strong upward velocity
      })
      
      // Temporarily increase bounce significantly
      orb.body.restitution = Math.min(orb.body.restitution * 1.8, 0.95)
    })
    
    // Theme-specific shake intensity
    const { mode: mobileMode } = useMobileModeStore.getState()
    if (mobileMode !== 'lite') {
      let rimShakeIntensity = 3
      let backboardShakeIntensity = 2
      
      // Adjust intensity based on theme
      switch (themeId) {
        case 'chaves':
          rimShakeIntensity = 4
          backboardShakeIntensity = 3
          break
        case 'pomemin':
          rimShakeIntensity = 5
          backboardShakeIntensity = 4
          break
        case 'dracula':
          rimShakeIntensity = 4
          backboardShakeIntensity = 3
          break
        case 'portal':
          rimShakeIntensity = 6
          backboardShakeIntensity = 5
          break
        case 'indiana-jones':
          rimShakeIntensity = 4
          backboardShakeIntensity = 3
          break
        case 'star-wars':
          rimShakeIntensity = 5
          backboardShakeIntensity = 4
          break
      }
      
      // Vibrate rim
      rimShakeRef.current = rimShakeIntensity
      setTimeout(() => {
        rimShakeRef.current = 0
      }, 100)
      
      // Shake backboard
      backboardShakeRef.current = backboardShakeIntensity
      setTimeout(() => {
        backboardShakeRef.current = 0
      }, 100)
    }
    
    // Reset after 0.8s (or longer for Chaves theme)
    const resetDelay = themeId === 'chaves' ? 2000 : 800
    setTimeout(() => {
      // Restore original restitution
      orbsRef.current.forEach((orb) => {
        const config = getPhysicsConfig()
        orb.body.restitution = config.restitution
      })
      isShakingRef.current = false
      if (themeId !== 'chaves') {
        shakeEffectRef.current = null
      }
    }, resetDelay)
    
    // Clean up Chaves effect separately
    if (themeId === 'chaves') {
      setTimeout(() => {
        chavesShakeEffectRef.current = null
      }, 2000)
    }
  }, [themeId])

  // Expose handleShake to parent component
  useEffect(() => {
    if (onShakeReady && handleShake) {
      onShakeReady(handleShake)
    }
  }, [onShakeReady, handleShake])

  // Update canvas dimensions and boundaries on resize
  useEffect(() => {
    if (!isMounted || !engineRef.current || !worldRef.current) return

    if (canvasRef.current) {
      canvasRef.current.width = canvasSize.width
      canvasRef.current.height = canvasSize.height
    }

    // Recreate boundaries and sensor if engine exists
    if (engineRef.current && worldRef.current) {
      // Remove old boundaries (but keep supports and sensor for now - they're removed explicitly below)
      const bodies = Matter.Composite.allBodies(engineRef.current.world)
      bodies.forEach((body) => {
        // Remove static bodies that are boundaries (not sensor, not supports, not orbs)
        // Boundaries don't have labels, supports and sensor have labels
        if (body.isStatic && !body.label && body.circleRadius === undefined) {
          Matter.World.remove(engineRef.current!.world, body)
        }
      })
      
      // Remove old rim supports and sensor
      if (leftSupportBodyRef.current) {
        Matter.World.remove(engineRef.current.world, leftSupportBodyRef.current)
        leftSupportBodyRef.current = null
      }
      if (rightSupportBodyRef.current) {
        Matter.World.remove(engineRef.current.world, rightSupportBodyRef.current)
        rightSupportBodyRef.current = null
      }
      if (sensorBodyRef.current) {
        Matter.World.remove(engineRef.current.world, sensorBodyRef.current)
        sensorBodyRef.current = null
      }

      // Add new boundaries
      const boundaries = createBoundaries(canvasSize.width, canvasSize.height)
      boundaries.forEach((boundary) => {
        Matter.World.add(engineRef.current!.world, boundary)
      })

      // Recreate rim support colliders and sensor
      // Position matches the rim position (dentro do backboard)
      const headerHeight = 96
      const backboardY = headerHeight + 20
      const backboardHeight = 140 // Increased by 50% then +30% then +20% (60 * 1.5 * 1.3 * 1.2 = 140.4 ≈ 140)
      const backboardBottom = backboardY + backboardHeight
      const rimCenterY = backboardBottom - 15 // Aro fica 15px dentro do backboard
      const rimCenterX = canvasSize.width / 2
      const rimRadius = 60
      
      // Support collider dimensions
      const supportWidth = 10
      const supportHeight = 25
      const supportOffsetX = supportWidth / 2 // Offset to center the support
      
      // Left support collider (left side of rim)
      const leftSupportX = rimCenterX - rimRadius + supportOffsetX
      const leftSupportY = rimCenterY
      const leftSupport = Bodies.rectangle(
        leftSupportX,
        leftSupportY,
        supportWidth,
        supportHeight,
          {
            isStatic: true,
          isSensor: false, // Physical collision
          restitution: 0.2,
          friction: 0.5,
          render: { visible: false }, // Invisible (visual is drawn separately)
          label: 'rim-left-support',
        }
      )
      Matter.World.add(engineRef.current.world, leftSupport)
      leftSupportBodyRef.current = leftSupport
      
      // Right support collider (right side of rim)
      const rightSupportX = rimCenterX + rimRadius - supportOffsetX
      const rightSupportY = rimCenterY
      const rightSupport = Bodies.rectangle(
        rightSupportX,
        rightSupportY,
        supportWidth,
        supportHeight,
        {
            isStatic: true,
          isSensor: false, // Physical collision
          restitution: 0.2,
          friction: 0.5,
          render: { visible: false }, // Invisible (visual is drawn separately)
          label: 'rim-right-support',
        }
      )
      Matter.World.add(engineRef.current.world, rightSupport)
      rightSupportBodyRef.current = rightSupport
      
      // Sensor for basket detection (inside the rim arc)
      const sensorWidth = 70
      const sensorHeight = 10
      const sensorX = rimCenterX - sensorWidth / 2
      const sensorY = rimCenterY + 5 // Sensor fica logo abaixo do centro do aro

         const sensor = Bodies.rectangle(
        sensorX + sensorWidth / 2,
        sensorY + sensorHeight / 2,
           sensorWidth,
           sensorHeight,
           {
             isStatic: true,
             isSensor: true,
             render: { visible: false },
          label: 'basket-sensor',
           }
         )
      
      Matter.World.add(engineRef.current.world, sensor)
        sensorBodyRef.current = sensor
    }
  }, [canvasSize, isMounted])

  // Get mouse/touch position relative to canvas
  const getPointerPosition = (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    if (!canvasRef.current) return null

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    
    // Calculate scale factor (canvas may be scaled for display)
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    let clientX: number
    let clientY: number
    
    if (e instanceof MouseEvent) {
      clientX = e.clientX
      clientY = e.clientY
    } else if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      // Handle touch end events
      clientX = e.changedTouches[0].clientX
      clientY = e.changedTouches[0].clientY
    } else {
      return null
    }
    
    // Convert to canvas coordinates
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }

  // Setup pointer event listeners - define handlers directly in useEffect
  // Wait for canvas to be ready and mounted
  useEffect(() => {
    if (!isMounted) return
    
    const canvas = canvasRef.current
    if (!canvas || canvasSize.width === 0 || canvasSize.height === 0) {
      // Retry after a short delay if canvas isn't ready
      const timeout = setTimeout(() => {
        const retryCanvas = canvasRef.current
        if (retryCanvas && canvasSize.width > 0 && canvasSize.height > 0) {
          // Canvas is ready, set up listeners - will be handled by next effect run
        }
      }, 100)
      return () => clearTimeout(timeout)
    }
    
    // Helper to get pointer position
    const getPointerPos = (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
      if (!canvasRef.current) return null
      const canvasEl = canvasRef.current
      const rect = canvasEl.getBoundingClientRect()
      const scaleX = canvasEl.width / rect.width
      const scaleY = canvasEl.height / rect.height
      
      let clientX: number
      let clientY: number
      
      if (e instanceof MouseEvent) {
        clientX = e.clientX
        clientY = e.clientY
      } else if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX
        clientY = e.changedTouches[0].clientY
      } else {
        return null
      }
      
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      }
    }

    // Handle pointer down (start drag)
    // Check if click is on Chaves barrel (easter egg)
    // The barrel is drawn on the floor in the bottom right corner
    const checkChavesBarrelClick = (pos: { x: number; y: number }): boolean => {
      if (themeId !== 'chaves') return false
      
      // Barrel position matches drawFloor function
      const barrelSize = Math.min(canvasSize.width * 0.15, canvasSize.height * 0.15) // 15% do menor lado
      const barrelX = canvasSize.width - barrelSize - 20 // Canto direito, com margem
      const barrelY = canvasSize.height - barrelSize - 10 // Próximo ao chão, com margem
      
      // Barrel dimensions (matches drawFloor)
      const barrelWidth = barrelSize * 0.8
      const barrelHeight = barrelSize
      
      // Check if click is within barrel bounds (with some tolerance for easier clicking)
      const tolerance = 10 // Extra pixels for easier clicking
      return pos.x >= barrelX - tolerance && 
             pos.x <= barrelX + barrelWidth + tolerance &&
             pos.y >= barrelY - tolerance && 
             pos.y <= barrelY + barrelHeight + tolerance
    }
    
    const checkStarWarsTriangleClick = (pos: { x: number; y: number }): boolean => {
      if (themeId !== 'star-wars') return false
      if (starWarsEasterEggRef.current) return false // Already active
      
      // Triangle position matches drawThemeDecorativeObject (Mini Starfighter)
      const objectSize = Math.min(canvasSize.width * 0.15, canvasSize.height * 0.15)
      const starfighterX = canvasSize.width * 0.1
      const starfighterY = canvasSize.height * 0.15
      const starfighterSize = objectSize * 0.4
      
      // Triangle bounds (approximate)
      const triangleLeft = starfighterX - starfighterSize * 0.3
      const triangleRight = starfighterX + starfighterSize * 0.3
      const triangleTop = starfighterY
      const triangleBottom = starfighterY + starfighterSize * 0.5
      
      // Check if click is within triangle bounds (with tolerance)
      const tolerance = 15
      return pos.x >= triangleLeft - tolerance && 
             pos.x <= triangleRight + tolerance &&
             pos.y >= triangleTop - tolerance && 
             pos.y <= triangleBottom + tolerance
    }
    
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement
      if (target !== canvas) return

      const pos = getPointerPos(e)
      if (!pos || !worldRef.current) return
      
      // Check for Star Wars triangle click (easter egg)
      if (checkStarWarsTriangleClick(pos)) {
        // Trigger proton beam easter egg
        const centerX = canvasSize.width / 2
        const centerY = canvasSize.height / 2
        
        // Create 3 beams from left side and 3 from right side
        const beams: ProtonBeam[] = []
        const beamSpacing = 40 // Vertical spacing between beams
        
        // Left side beams (coming from left, going to center)
        for (let i = 0; i < 3; i++) {
          const startY = centerY - beamSpacing + (i * beamSpacing)
          beams.push({
            x: 0,
            y: startY,
            targetX: centerX,
            targetY: centerY - beamSpacing + (i * beamSpacing),
            progress: 0,
            side: 'left',
            index: i
          })
        }
        
        // Right side beams (coming from right, going to center)
        for (let i = 0; i < 3; i++) {
          const startY = centerY - beamSpacing + (i * beamSpacing)
          beams.push({
            x: canvasSize.width,
            y: startY,
            targetX: centerX,
            targetY: centerY - beamSpacing + (i * beamSpacing),
            progress: 0,
            side: 'right',
            index: i
          })
        }
        
        starWarsEasterEggRef.current = {
          startTime: Date.now(),
          beams,
          explosionPhase: 'traveling',
          explosionProgress: 0
        }
        
        // Play "Piu Piu Piu" sound (Atari style)
        playStarWarsProtonBeamSound()
        
        e.preventDefault()
        e.stopPropagation()
        return
      }
      
      // Check for Chaves barrel click (easter egg)
      if (checkChavesBarrelClick(pos)) {
        // Only activate if animation is not already running
        if (!chavesShakeEffectRef.current) {
          chavesShakeEffectRef.current = {
            startTime: Date.now(),
            duration: 2000, // 2 seconds for full animation
          }
          // Play sound when character appears
          playChavesAppearSound()
        }
        e.preventDefault()
        e.stopPropagation()
        return
      }

      // Check for portal dragging (only when theme is "portal")
      if (themeId === "portal" && mobileMode !== 'lite') {
        // Check orange portal (draggable freely on floor)
        if (isPointInPortal(pos.x, pos.y, portalOrangeRef.current)) {
          portalDragStateRef.current = {
            isDragging: true,
            portal: 'orange',
            startX: pos.x,
            startY: pos.y,
            startPortalX: portalOrangeRef.current.x,
            startPortalY: portalOrangeRef.current.y,
          }
          if (canvas) canvas.style.cursor = 'grabbing'
          e.preventDefault()
          e.stopPropagation()
          return
        }
        
        // Check blue portal (draggable horizontally only)
        if (isPointInPortal(pos.x, pos.y, portalBlueRef.current)) {
          portalDragStateRef.current = {
            isDragging: true,
            portal: 'blue',
            startX: pos.x,
            startY: pos.y,
            startPortalX: portalBlueRef.current.x,
            startPortalY: portalBlueRef.current.y,
          }
          if (canvas) canvas.style.cursor = 'grabbing'
          e.preventDefault()
          e.stopPropagation()
          return
        }
      }

      // Find orb at pointer position (check from back to front for top orb)
      for (let i = orbsRef.current.length - 1; i >= 0; i--) {
        const orb = orbsRef.current[i]
        const orbPos = getBodyPosition(orb.body)
        const isMobile = isMobileDevice()
        const radius = isMobile ? ORB_RADIUS_MOBILE : ORB_RADIUS_DESKTOP
        
        // Simple distance check (add some tolerance for easier clicking)
        const dx = pos.x - orbPos.x
        const dy = pos.y - orbPos.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
          // Add 5px tolerance for easier clicking
          if (distance <= radius + 5) {
            // Stop the orb's current motion
            Body.setVelocity(orb.body, { x: 0, y: 0 })
            Body.setAngularVelocity(orb.body, 0)
            
            // Make body static temporarily so it can be dragged
            // Also disable collisions temporarily to prevent interference during drag
            Body.setStatic(orb.body, true)
            // Store original collision filter to restore later
            if (!orb.body.collisionFilter) {
              orb.body.collisionFilter = { category: 0x0001, mask: 0xFFFFFFFF }
            }
            // Disable collisions during drag
            orb.body.collisionFilter.category = 0x0000
            orb.body.collisionFilter.mask = 0x0000
            
            isDraggingRef.current = true
            draggedOrbRef.current = orb
            dragStartRef.current = pos

            // Set position immediately
            Body.setPosition(orb.body, pos)
            
            e.preventDefault()
            e.stopPropagation()
            return
          }
      }
    }

    // Helper function to release orb when dragged outside canvas
    const releaseOrbOutsideCanvas = (e: MouseEvent | TouchEvent) => {
      if (!draggedOrbRef.current) return
      
      const orb = draggedOrbRef.current
      
      // Restore body to dynamic
      Body.setStatic(orb.body, false)
      if (orb.body.collisionFilter) {
        orb.body.collisionFilter.category = 0x0001
        orb.body.collisionFilter.mask = 0xFFFFFFFF
      }
      
      // Apply gentle velocity to bring orb back into view
      const currentPos = getBodyPosition(orb.body)
      const centerX = canvasSize.width / 2
      const centerY = canvasSize.height / 2
      const dx = centerX - currentPos.x
      const dy = centerY - currentPos.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance > 0) {
        // Normalize and apply gentle pull back
        const pullStrength = 0.5
        Body.setVelocity(orb.body, {
          x: (dx / distance) * pullStrength,
          y: (dy / distance) * pullStrength,
        })
      }
      
      // Reset drag state
      isDraggingRef.current = false
      draggedOrbRef.current = null
      dragStartRef.current = null
      
      e.preventDefault()
      e.stopPropagation()
    }

    // Handle pointer move (update drag)
    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      // Handle portal dragging
      if (portalDragStateRef.current.isDragging && themeId === "portal" && mobileMode !== 'lite') {
        const pos = getPointerPos(e)
        if (!pos) return
        
        const dragState = portalDragStateRef.current
        const dx = pos.x - dragState.startX
        const dy = pos.y - dragState.startY
        
        if (dragState.portal === 'orange') {
          // Orange portal: free drag on floor - allow positioning slightly above floor to swallow orbs
          const wallThickness = 50
          const floorLevel = canvasSize.height - 45 // Slightly above floor to swallow resting orbs
          const newX = dragState.startPortalX + dx
          const newY = dragState.startPortalY + dy
          
          // Keep within canvas bounds horizontally
          portalOrangeRef.current.x = Math.max(portalOrangeRef.current.width / 2, Math.min(canvasSize.width - portalOrangeRef.current.width / 2, newX))
          // Allow Y to be slightly above floor level to swallow resting orbs
          const minY = canvasSize.height - 150 // Allow some movement up
          const maxY = floorLevel // Slightly above floor to swallow resting orbs
          portalOrangeRef.current.y = Math.max(minY, Math.min(maxY, newY))
        } else if (dragState.portal === 'blue') {
          // Blue portal: horizontal drag only (stays on ceiling)
          const newX = dragState.startPortalX + dx
          // Snap to 6px grid to avoid micro vibrations
          const snappedX = Math.round(newX / 6) * 6
          
          // Keep within canvas bounds
          portalBlueRef.current.x = Math.max(portalBlueRef.current.width / 2, Math.min(canvasSize.width - portalBlueRef.current.width / 2, snappedX))
          // Y stays on ceiling (very close to header)
          const headerHeight = 96
          portalBlueRef.current.y = headerHeight + 5 // Very close to header
        }
        
        e.preventDefault()
        e.stopPropagation()
        return
      }
      
      // Check if hovering over portal (for cursor change)
      if (themeId === "portal" && mobileMode !== 'lite' && !portalDragStateRef.current.isDragging && !isDraggingRef.current) {
        const pos = getPointerPos(e)
        if (pos) {
          if (isPointInPortal(pos.x, pos.y, portalOrangeRef.current) || isPointInPortal(pos.x, pos.y, portalBlueRef.current)) {
            if (canvas) canvas.style.cursor = 'grab'
          } else {
            if (canvas) canvas.style.cursor = 'default'
          }
        }
      }
      
      if (!isDraggingRef.current || !draggedOrbRef.current) return

      const pos = getPointerPos(e)
      
      // If pointer is outside canvas or position is invalid, release the orb
      if (!pos) {
        releaseOrbOutsideCanvas(e)
        return
      }

      // Clamp position within canvas bounds to prevent dragging outside
      const isMobile = isMobileDevice()
      const radius = isMobile ? ORB_RADIUS_MOBILE : ORB_RADIUS_DESKTOP
      const margin = radius + 10 // Extra margin to keep orb fully visible
      
      // Check if position is outside canvas bounds
      const isOutsideCanvas = pos.x < 0 || pos.x > canvasSize.width || 
                              pos.y < 0 || pos.y > canvasSize.height
      
      if (isOutsideCanvas) {
        releaseOrbOutsideCanvas(e)
        return
      }
      
      const clampedPos = {
        x: Math.max(margin, Math.min(canvasSize.width - margin, pos.x)),
        y: Math.max(margin, Math.min(canvasSize.height - margin, pos.y)),
      }

      // Update the body position directly for immediate response
      // Keep body static during drag to prevent physics interference
      Body.setPosition(draggedOrbRef.current.body, clampedPos)
      
      e.preventDefault()
      e.stopPropagation()
    }

    // Handle pointer up (end drag, throw)
    const onPointerUp = (e: MouseEvent | TouchEvent) => {
      // Handle portal drag end
      if (portalDragStateRef.current.isDragging) {
        portalDragStateRef.current = { isDragging: false, portal: null, startX: 0, startY: 0, startPortalX: 0, startPortalY: 0 }
        if (canvas) canvas.style.cursor = 'default'
        e.preventDefault()
        e.stopPropagation()
        return
      }
      
      if (!isDraggingRef.current || !draggedOrbRef.current) {
        return
      }

      const pos = getPointerPos(e)
      const orb = draggedOrbRef.current
      
      // Restore body to dynamic and collision category
      Body.setStatic(orb.body, false)
      // Restore collision filter
      if (orb.body.collisionFilter) {
        orb.body.collisionFilter.category = 0x0001 // Restore orb collision category
        orb.body.collisionFilter.mask = 0xFFFFFFFF // Restore collision mask
      }
      
      // Check if orb is outside canvas bounds
      const currentPos = getBodyPosition(orb.body)
      const isMobile = isMobileDevice()
      const radius = isMobile ? ORB_RADIUS_MOBILE : ORB_RADIUS_DESKTOP
      const margin = radius + 5
      
      const isOutsideCanvas = currentPos.x < -margin || currentPos.x > canvasSize.width + margin || 
                              currentPos.y < -margin || currentPos.y > canvasSize.height + margin
      
      // If orb is outside canvas or position is invalid, bring it back
      if (isOutsideCanvas || !pos) {
        // First, clamp position to canvas bounds to ensure orb is visible
        const clampedX = Math.max(margin, Math.min(canvasSize.width - margin, currentPos.x))
        const clampedY = Math.max(margin, Math.min(canvasSize.height - margin, currentPos.y))
        Body.setPosition(orb.body, { x: clampedX, y: clampedY })
        
        // Apply gentle velocity to bring orb back into center view
        const centerX = canvasSize.width / 2
        const centerY = canvasSize.height / 2
        const dx = centerX - clampedX
        const dy = centerY - clampedY
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance > 0) {
          // Normalize and apply gentle pull back
          const pullStrength = 1.0 // Slightly stronger when released outside
          Body.setVelocity(orb.body, {
            x: (dx / distance) * pullStrength,
            y: (dy / distance) * pullStrength,
          })
        } else {
          // Fallback: gentle downward velocity
          Body.setVelocity(orb.body, {
            x: 0,
            y: 2,
          })
        }
      } else {
        // Normal throw calculation when inside canvas
        if (dragStartRef.current) {
          const force = calculateThrowForce(dragStartRef.current, pos)
          
          // Check if there was actual movement (not just clicked and released)
          const dx = pos.x - dragStartRef.current.x
          const dy = pos.y - dragStartRef.current.y
          const movementDistance = Math.sqrt(dx * dx + dy * dy)
          
          // Only apply throw force if there was significant movement (more than 5px)
          if (movementDistance > 5) {
            // Cap maximum throw velocity to prevent orbs from flying off screen
            const MAX_VELOCITY = 25 // Maximum velocity in any direction
            const magnitude = Math.sqrt(force.x * force.x + force.y * force.y)
            
            let finalForce = force
            if (magnitude > MAX_VELOCITY) {
              // Scale down to max velocity while preserving direction
              const scale = MAX_VELOCITY / magnitude
              finalForce = {
                x: force.x * scale,
                y: force.y * scale,
              }
            }
            
            // Apply throw force
            Body.setVelocity(orb.body, {
              x: finalForce.x,
              y: finalForce.y,
            })
          } else {
            // No movement detected - just let it fall naturally (no velocity applied)
            // Gravity will handle the fall
            Body.setVelocity(orb.body, {
              x: 0,
              y: 0, // No initial velocity, let gravity do its work
            })
          }
        } else {
          // If no drag start position, just let it fall naturally
          Body.setVelocity(orb.body, {
            x: 0,
            y: 0, // No initial velocity, let gravity do its work
          })
        }
      }

      // Reset drag state
      isDraggingRef.current = false
      draggedOrbRef.current = null
      dragStartRef.current = null
      
      e.preventDefault()
      e.stopPropagation()
    }

    // Canvas-specific events
    canvas.addEventListener("mousedown", onPointerDown)
    canvas.addEventListener("mousemove", onPointerMove)
    canvas.addEventListener("touchstart", onPointerDown, { passive: false })
    canvas.addEventListener("touchmove", onPointerMove, { passive: false })

    // Global events for mouseup/touchend (to handle drag even if mouse leaves canvas)
    window.addEventListener("mouseup", onPointerUp)
    window.addEventListener("touchend", onPointerUp)
    window.addEventListener("touchcancel", onPointerUp)

    return () => {
      canvas.removeEventListener("mousedown", onPointerDown)
      canvas.removeEventListener("mousemove", onPointerMove)
      canvas.removeEventListener("touchstart", onPointerDown)
      canvas.removeEventListener("touchmove", onPointerMove)
      window.removeEventListener("mouseup", onPointerUp)
      window.removeEventListener("touchend", onPointerUp)
      window.removeEventListener("touchcancel", onPointerUp)
    }
  }, [isMounted, canvasSize.width, canvasSize.height]) // Re-run when canvas is ready

  // Draw a single LED segment
  const drawSegment = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, angle: number, neonColor: string, isActive: boolean = true) => {
    ctx.save()
    
    // Translate and rotate to position
    ctx.translate(x, y)
    ctx.rotate(angle)
    
    const radius = 3 // cap radius
    const w = width
    const h = height
    const xPos = -w / 2
    const yPos = -h / 2
    
    // Draw stroke for depth (dark stroke behind)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.moveTo(xPos + radius, yPos)
    ctx.lineTo(xPos + w - radius, yPos)
    ctx.arc(xPos + w - radius, yPos + radius, radius, -Math.PI / 2, 0)
    ctx.lineTo(xPos + w, yPos + h - radius)
    ctx.arc(xPos + w - radius, yPos + h - radius, radius, 0, Math.PI / 2)
    ctx.lineTo(xPos + radius, yPos + h)
    ctx.arc(xPos + radius, yPos + h - radius, radius, Math.PI / 2, Math.PI)
    ctx.lineTo(xPos, yPos + radius)
    ctx.arc(xPos + radius, yPos + radius, radius, Math.PI, -Math.PI / 2)
    ctx.closePath()
    ctx.stroke()
    
    // Draw segment with rounded corners and glow
    if (isActive) {
      ctx.fillStyle = neonColor
      // FPS Guardian Level 1: Reduce glow intensity by 50%
      const baseDigitGlow = digitGlowRef.current // Dynamic glow (10 default, 20 on score)
      ctx.shadowBlur = isFPSLevel1 ? baseDigitGlow * 0.5 : baseDigitGlow
      ctx.shadowColor = neonColor
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)' // Unlit segments
      ctx.shadowBlur = 0
    }
    
    ctx.beginPath()
    ctx.moveTo(xPos + radius, yPos)
    ctx.lineTo(xPos + w - radius, yPos)
    ctx.arc(xPos + w - radius, yPos + radius, radius, -Math.PI / 2, 0)
    ctx.lineTo(xPos + w, yPos + h - radius)
    ctx.arc(xPos + w - radius, yPos + h - radius, radius, 0, Math.PI / 2)
    ctx.lineTo(xPos + radius, yPos + h)
    ctx.arc(xPos + radius, yPos + h - radius, radius, Math.PI / 2, Math.PI)
    ctx.lineTo(xPos, yPos + radius)
    ctx.arc(xPos + radius, yPos + radius, radius, Math.PI, -Math.PI / 2)
    ctx.closePath()
    ctx.fill()
    
    ctx.restore()
  }, [])

  // Draw a digit using 7-segment display (exact dimensions: 60px height, 35px width)
  const drawDigit = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, value: number, neonColor: string, scale: number = 1) => {
    ctx.save()

    // Apply scale for pulse animation
    const centerX = x + 35 / 2
    const centerY = y + 60 / 2
    ctx.translate(centerX, centerY)
    ctx.scale(scale, scale)
    ctx.translate(-centerX, -centerY)
    
    // Exact dimensions
    const digitWidth = 35
    const digitHeight = 60
    const segThickness = 6 // Segment thickness
    const spacing = 3 // Internal spacing
    
    // Calculate positions for 7-segment layout
    //   A
    // F   B
    //   G
    // E   C
    //   D
    
    const centerXLocal = x + digitWidth / 2
    const segLength = digitWidth - segThickness * 2 // Length of horizontal segments
    const segHeight = (digitHeight - segThickness * 3) / 2 // Height of vertical segments
    
    // Define segments positions
    const segments: { [key: string]: { x: number; y: number; width: number; height: number; angle: number } } = {
      A: { x: centerXLocal, y: y + segThickness / 2, width: segLength, height: segThickness, angle: 0 }, // Top
      B: { x: x + digitWidth - segThickness / 2, y: y + segThickness + segHeight / 2, width: segHeight, height: segThickness, angle: Math.PI / 2 }, // Top-right
      C: { x: x + digitWidth - segThickness / 2, y: y + segThickness * 2 + segHeight + segHeight / 2, width: segHeight, height: segThickness, angle: Math.PI / 2 }, // Bottom-right
      D: { x: centerXLocal, y: y + digitHeight - segThickness / 2, width: segLength, height: segThickness, angle: 0 }, // Bottom
      E: { x: x + segThickness / 2, y: y + segThickness * 2 + segHeight + segHeight / 2, width: segHeight, height: segThickness, angle: Math.PI / 2 }, // Bottom-left
      F: { x: x + segThickness / 2, y: y + segThickness + segHeight / 2, width: segHeight, height: segThickness, angle: Math.PI / 2 }, // Top-left
      G: { x: centerXLocal, y: y + segThickness + segHeight + segThickness / 2, width: segLength, height: segThickness, angle: 0 }, // Middle
    }
    
    // Define which segments are active for each digit
    const digitSegments: { [key: number]: string[] } = {
      0: ['A', 'B', 'C', 'D', 'E', 'F'],
      1: ['B', 'C'],
      2: ['A', 'B', 'G', 'E', 'D'],
      3: ['A', 'B', 'G', 'C', 'D'],
      4: ['F', 'G', 'B', 'C'],
      5: ['A', 'F', 'G', 'C', 'D'],
      6: ['A', 'F', 'G', 'C', 'D', 'E'],
      7: ['A', 'B', 'C'],
      8: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      9: ['A', 'B', 'C', 'D', 'F', 'G'],
    }
    
    // Draw all segments (active and inactive)
    const allSegments = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    const activeSegments = digitSegments[value] || []
    
    allSegments.forEach((segName) => {
      const seg = segments[segName]
      if (seg) {
        const isActive = activeSegments.includes(segName)
        drawSegment(ctx, seg.x, seg.y, seg.width, seg.height, seg.angle, neonColor, isActive)
      }
    })
    
      ctx.restore()
  }, [drawSegment, isFPSLevel1])

  // Draw backboard with integrated LED scoreboard
  const drawBackboard = useCallback((ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    // FPS Guardian Level 2: Skip backboard rendering
    if (isFPSLevel2) return
    if (!colors) return

    const headerHeight = 96
    // Apply shake offset to backboard (shake backboard)
    const shakeOffsetX = backboardShakeRef.current > 0 ? (Math.random() - 0.5) * backboardShakeRef.current : 0
    const shakeOffsetY = backboardShakeRef.current > 0 ? (Math.random() - 0.5) * backboardShakeRef.current : 0
    const x = canvasSize.width / 2 - 150 + shakeOffsetX // Width stays the same
    const y = headerHeight + 20 + shakeOffsetY
    const width = 300 // Width stays the same
    const height = 140 // Increased by 50% then +30% then +20% (60 * 1.5 * 1.3 * 1.2 = 140.4 ≈ 140) - only height increased
    const cornerRadius = 4

    ctx.save()

    // Apply flash effect if active
    const flashIntensity = backboardFlashRef.current
    ctx.globalAlpha = 0.85 + (flashIntensity * 0.15) // Flash increases alpha, base 0.85

    // Draw external shadow (soft glow around backboard)
    // FPS Guardian Level 1: Reduce glow intensity by 50%
    const baseShadowBlur = 18
    ctx.shadowBlur = isFPSLevel1 ? baseShadowBlur * 0.5 : baseShadowBlur
    // Convert hex color to rgba for shadow (22 = ~13% opacity in hex - subtle)
    const shadowColor = colors.accent.startsWith('#') 
      ? colors.accent + '22' 
      : colors.accent.replace(')', ', 0.13)').replace('rgb', 'rgba')
    ctx.shadowColor = shadowColor
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    // Draw internal shadow first (for depth)
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
    const baseInternalBlur = 20
    ctx.shadowBlur = isFPSLevel1 ? baseInternalBlur * 0.5 : baseInternalBlur
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 6
    
    // Draw backboard rectangle with rounded corners
    ctx.fillStyle = '#0b1116'
    ctx.beginPath()
    // Top-left corner
    ctx.moveTo(x + cornerRadius, y)
    // Top edge
    ctx.lineTo(x + width - cornerRadius, y)
    // Top-right corner
    ctx.arc(x + width - cornerRadius, y + cornerRadius, cornerRadius, -Math.PI / 2, 0)
    // Right edge
    ctx.lineTo(x + width, y + height - cornerRadius)
    // Bottom-right corner
    ctx.arc(x + width - cornerRadius, y + height - cornerRadius, cornerRadius, 0, Math.PI / 2)
    // Bottom edge
    ctx.lineTo(x + cornerRadius, y + height)
    // Bottom-left corner
    ctx.arc(x + cornerRadius, y + height - cornerRadius, cornerRadius, Math.PI / 2, Math.PI)
    // Left edge
    ctx.lineTo(x, y + cornerRadius)
    // Top-left corner
    ctx.arc(x + cornerRadius, y + cornerRadius, cornerRadius, Math.PI, -Math.PI / 2)
    ctx.closePath()
    ctx.fill()

    // Reset shadow for borders (neon borders drawn after)
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    // Draw top border (lighter - holographic highlight)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)'
      ctx.lineWidth = 1
        ctx.beginPath()
    ctx.moveTo(x + cornerRadius, y)
    ctx.lineTo(x + width - cornerRadius, y)
    ctx.stroke()

    // Draw bottom border (darker)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x + cornerRadius, y + height)
    ctx.lineTo(x + width - cornerRadius, y + height)
    ctx.stroke()

    // Draw scanlines (horizontal lines inside - thinner and more subtle)
    ctx.strokeStyle = colors.border
    ctx.globalAlpha = 0.12 // Opacity 0.12
    ctx.lineWidth = 1 // Height 1px
    const scanlineSpacing = 6 // Spacing 6px
    const startY = y + scanlineSpacing
    
    for (let scanlineY = startY; scanlineY < y + height; scanlineY += scanlineSpacing) {
      ctx.beginPath()
      ctx.moveTo(x + 10, scanlineY)
      ctx.lineTo(x + width - 10, scanlineY)
        ctx.stroke()
      }

    ctx.globalAlpha = 1

    // Draw two modules side by side inside backboard
    const margin = 10 // Backboard margin
    const moduleGap = 12 // Gap between modules
    const modulePadding = 12 // Internal padding of each module
    const innerWidth = width - margin * 2 // 300 - 20 = 280
    const moduleWidth = (innerWidth - moduleGap) / 2 // Each module width
    const moduleY = y + margin // Align with top of backboard
    
    // Title settings
    const titleHeight = 12
    const titleGap = 8 // Gap between title and digits
    const titleY = y + margin + 14 // Fixed title Y position
    
    // Calculate available height for digits
    const availableHeight = height - margin * 2 - titleHeight - titleGap
    const digitHeight = 60
    const digitY = y + margin + titleHeight + titleGap + (availableHeight - digitHeight) / 2 // Center vertically

    // Left module: HI-SCORE
    const leftModuleX = x + margin
    
    // Draw title (centered in module)
    // Use primary color for titles to match theme better
    ctx.fillStyle = colors.primary || colors.accent
    ctx.font = '600 11px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText('HI-SCORE', leftModuleX + moduleWidth / 2, titleY)

    // Draw 2 LED digits for HI-SCORE (best score)
    // Use primary color for LED digits to match theme better
    const digitWidth = 35
    const digitGap = 6 // Space between digits
    const leftDigitsStartX = leftModuleX + modulePadding + (moduleWidth - modulePadding * 2 - (digitWidth * 2 + digitGap)) / 2 // Center the 2 digits
    const bestStr = bestScoreRef.current.toString().padStart(2, '0').slice(-2) // Last 2 digits
    const ledColor = colors.primary || colors.accent // Use primary color for LED digits
    for (let i = 0; i < 2; i++) {
      const digitX = leftDigitsStartX + i * (digitWidth + digitGap)
      const digitValue = parseInt(bestStr[i] || '0')
      drawDigit(ctx, digitX, digitY, digitValue, ledColor, digitScaleRef.current)
    }

    // Right module: SCORE
    const rightModuleX = x + margin + moduleWidth + moduleGap
    
    // Draw title (centered in module)
    ctx.textAlign = 'center'
    ctx.fillText('SCORE', rightModuleX + moduleWidth / 2, titleY)

    // Draw 2 LED digits for SCORE (current score)
    const rightDigitsStartX = rightModuleX + modulePadding + (moduleWidth - modulePadding * 2 - (digitWidth * 2 + digitGap)) / 2 // Center the 2 digits
    const scoreStr = scoreRef.current.toString().padStart(2, '0').slice(-2) // Last 2 digits
    for (let i = 0; i < 2; i++) {
      const digitX = rightDigitsStartX + i * (digitWidth + digitGap)
      const digitValue = parseInt(scoreStr[i] || '0')
      drawDigit(ctx, digitX, digitY, digitValue, ledColor, digitScaleRef.current)
    }

    ctx.restore()
  }, [canvasSize.width, drawDigit, isFPSLevel1, isFPSLevel2])

  // Draw floor (stylized court floor)
  const drawFloor = useCallback((ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return

    const floorHeight = canvasSize.height * 0.2 // 20% of canvas height
    const floorY = canvasSize.height - floorHeight
    const floorX = 0
    const floorWidth = canvasSize.width

    ctx.save()

    // Draw floor gradient (transparent at top to neon at bottom)
    const gradient = ctx.createLinearGradient(floorX, floorY, floorX, canvasSize.height)

    // Convert hex to rgba for gradient stops
    const primaryColor = colors.primary
    let primaryRgba = primaryColor
    if (primaryColor.startsWith('#')) {
      // Convert hex to rgba
      const r = parseInt(primaryColor.slice(1, 3), 16)
      const g = parseInt(primaryColor.slice(3, 5), 16)
      const b = parseInt(primaryColor.slice(5, 7), 16)
      primaryRgba = `rgba(${r}, ${g}, ${b}, 0.15)` // 15% opacity
    } else if (primaryColor.startsWith('rgb')) {
      primaryRgba = primaryColor.replace('rgb', 'rgba').replace(')', ', 0.15)')
    } else {
      primaryRgba = primaryColor
    }
    
    gradient.addColorStop(0, 'transparent')
    gradient.addColorStop(1, primaryRgba)
    
    ctx.fillStyle = gradient
    ctx.fillRect(floorX, floorY, floorWidth, floorHeight)

    // Draw neon top border line (2-3px) with glow - baseline of court
    ctx.strokeStyle = colors.primary
    ctx.lineWidth = 2.5
    ctx.shadowBlur = 8
    ctx.shadowColor = colors.primary
    ctx.beginPath()
    ctx.moveTo(floorX, floorY)
    ctx.lineTo(floorX + floorWidth, floorY)
    ctx.stroke()

    // Reset shadow
    ctx.shadowBlur = 0
    
    // Draw barrel in corner for Chaves theme
    if (themeId === "chaves") {
      const barrelSize = Math.min(canvasSize.width * 0.15, canvasSize.height * 0.15) // 15% do menor lado
      const barrelX = canvasSize.width - barrelSize - 20 // Canto direito, com margem
      const barrelY = canvasSize.height - barrelSize - 10 // Próximo ao chão, com margem
      
      ctx.save()
      
      // Corpo do barril (cilindro visto de lado)
      const barrelWidth = barrelSize * 0.8
      const barrelHeight = barrelSize
      
      // Desenha o barril como um retângulo arredondado com faixas
      ctx.fillStyle = '#8B4513' // Marrom madeira
      const borderRadius = barrelHeight * 0.2
      
      // Desenha retângulo arredondado manualmente (compatibilidade)
      ctx.beginPath()
      ctx.moveTo(barrelX + borderRadius, barrelY)
      ctx.lineTo(barrelX + barrelWidth - borderRadius, barrelY)
      ctx.quadraticCurveTo(barrelX + barrelWidth, barrelY, barrelX + barrelWidth, barrelY + borderRadius)
      ctx.lineTo(barrelX + barrelWidth, barrelY + barrelHeight - borderRadius)
      ctx.quadraticCurveTo(barrelX + barrelWidth, barrelY + barrelHeight, barrelX + barrelWidth - borderRadius, barrelY + barrelHeight)
      ctx.lineTo(barrelX + borderRadius, barrelY + barrelHeight)
      ctx.quadraticCurveTo(barrelX, barrelY + barrelHeight, barrelX, barrelY + barrelHeight - borderRadius)
      ctx.lineTo(barrelX, barrelY + borderRadius)
      ctx.quadraticCurveTo(barrelX, barrelY, barrelX + borderRadius, barrelY)
      ctx.closePath()
      ctx.fill()
      
      // Faixas metálicas do barril (3 faixas)
      ctx.strokeStyle = '#654321' // Marrom escuro
      ctx.lineWidth = 3
      for (let i = 1; i <= 3; i++) {
        const y = barrelY + (barrelHeight / 4) * i
        ctx.beginPath()
        ctx.moveTo(barrelX, y)
        ctx.lineTo(barrelX + barrelWidth, y)
        ctx.stroke()
      }
      
      // Borda do barril
      ctx.strokeStyle = '#5C4033' // Marrom muito escuro
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(barrelX + borderRadius, barrelY)
      ctx.lineTo(barrelX + barrelWidth - borderRadius, barrelY)
      ctx.quadraticCurveTo(barrelX + barrelWidth, barrelY, barrelX + barrelWidth, barrelY + borderRadius)
      ctx.lineTo(barrelX + barrelWidth, barrelY + barrelHeight - borderRadius)
      ctx.quadraticCurveTo(barrelX + barrelWidth, barrelY + barrelHeight, barrelX + barrelWidth - borderRadius, barrelY + barrelHeight)
      ctx.lineTo(barrelX + borderRadius, barrelY + barrelHeight)
      ctx.quadraticCurveTo(barrelX, barrelY + barrelHeight, barrelX, barrelY + barrelHeight - borderRadius)
      ctx.lineTo(barrelX, barrelY + borderRadius)
      ctx.quadraticCurveTo(barrelX, barrelY, barrelX + borderRadius, barrelY)
      ctx.closePath()
      ctx.stroke()
      
      // Sombra do barril
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.beginPath()
      ctx.ellipse(barrelX + barrelWidth / 2, barrelY + barrelHeight + 5, barrelWidth * 0.6, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }
    
    // Draw castle in corner for Dracula theme
    if (themeId === "dracula") {
      const castleSize = Math.min(canvasSize.width * 0.2, canvasSize.height * 0.2) // 20% do menor lado
      const castleX = 20 // Canto esquerdo, com margem
      const castleY = canvasSize.height - castleSize - 10 // Próximo ao chão, com margem
      
      ctx.save()
      
      // Torre principal do castelo
      const towerWidth = castleSize * 0.4
      const towerHeight = castleSize * 0.9
      const towerX = castleX
      const towerY = castleY + (castleSize - towerHeight)
      
      // Corpo da torre
      ctx.fillStyle = '#2d1b3d' // Roxo escuro
      ctx.strokeStyle = '#1a0a0a' // Preto
      ctx.lineWidth = 2
      ctx.fillRect(towerX, towerY, towerWidth, towerHeight)
      ctx.strokeRect(towerX, towerY, towerWidth, towerHeight)
      
      // Topo da torre (merlões/guelras)
      const merlonHeight = towerWidth * 0.15
      const merlonWidth = towerWidth / 4
      ctx.fillStyle = '#4b0082' // Roxo mais claro
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(towerX + i * merlonWidth, towerY, merlonWidth, merlonHeight)
      }
      
      // Janela da torre (com cruz)
      const windowSize = towerWidth * 0.3
      const windowX = towerX + (towerWidth - windowSize) / 2
      const windowY = towerY + towerHeight * 0.4
      ctx.fillStyle = '#8b0000' // Vermelho escuro (luz)
      ctx.fillRect(windowX, windowY, windowSize, windowSize)
      ctx.strokeStyle = '#1a0a0a'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(windowX + windowSize / 2, windowY)
      ctx.lineTo(windowX + windowSize / 2, windowY + windowSize)
      ctx.moveTo(windowX, windowY + windowSize / 2)
      ctx.lineTo(windowX + windowSize, windowY + windowSize / 2)
      ctx.stroke()
      
      // Torre menor (lateral)
      const smallTowerWidth = castleSize * 0.25
      const smallTowerHeight = castleSize * 0.6
      const smallTowerX = castleX + towerWidth + 5
      const smallTowerY = castleY + (castleSize - smallTowerHeight)
      
      ctx.fillStyle = '#2d1b3d'
      ctx.fillRect(smallTowerX, smallTowerY, smallTowerWidth, smallTowerHeight)
      ctx.strokeRect(smallTowerX, smallTowerY, smallTowerWidth, smallTowerHeight)
      
      // Topo da torre menor
      ctx.fillStyle = '#4b0082'
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(smallTowerX + i * (smallTowerWidth / 3), smallTowerY, smallTowerWidth / 3, merlonHeight)
      }
      
      // Sombra do castelo
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
      ctx.beginPath()
      ctx.ellipse(castleX + castleSize / 2, castleY + castleSize + 5, castleSize * 0.7, 10, 0, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }
    
    ctx.restore()
  }, [canvasSize.width, canvasSize.height, isFPSLevel1, isFPSLevel2, themeId])

  // Draw backboard side supports (two vertical neon poles behind backboard)
  const drawBackboardSideSupports = useCallback((ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return

    const headerHeight = 96
    const backboardY = headerHeight + 20
    const backboardHeight = 140
    const backboardBottom = backboardY + backboardHeight
    const backboardX = canvasSize.width / 2 - 150
    const backboardWidth = 300
    const backboardCenterX = backboardX + backboardWidth / 2 // Center of backboard
    
    const floorHeight = canvasSize.height * 0.2
    const floorY = canvasSize.height - floorHeight
    
    // Calculate spacing: 35% of backboard width between the two supports
    const spacing = backboardWidth * 0.35
    const leftSupportX = backboardCenterX - spacing / 2
    const rightSupportX = backboardCenterX + spacing / 2
    
    // Both supports start at backboard base and go down to floor line
    const supportStartY = backboardBottom
    const supportEndY = floorY

    ctx.save()
    
    // Set neon styling with glow
    ctx.strokeStyle = colors.primary
    ctx.lineWidth = 3.5 // Between 3-4px
    ctx.shadowBlur = 12 // Between 10-14
    // Convert shadow color with opacity 0.7
    let shadowColorRgba = colors.primary
    if (colors.primary.startsWith('#')) {
      const r = parseInt(colors.primary.slice(1, 3), 16)
      const g = parseInt(colors.primary.slice(3, 5), 16)
      const b = parseInt(colors.primary.slice(5, 7), 16)
      shadowColorRgba = `rgba(${r}, ${g}, ${b}, 0.7)`
    } else if (colors.primary.startsWith('rgb')) {
      shadowColorRgba = colors.primary.replace('rgb', 'rgba').replace(')', ', 0.7)')
    }
    ctx.shadowColor = shadowColorRgba
    
    // Draw left vertical support pole
    ctx.beginPath()
    ctx.moveTo(leftSupportX, supportStartY)
    ctx.lineTo(leftSupportX, supportEndY)
    ctx.stroke()

    // Draw right vertical support pole
    ctx.beginPath()
    ctx.moveTo(rightSupportX, supportStartY)
    ctx.lineTo(rightSupportX, supportEndY)
    ctx.stroke()

    ctx.restore()
  }, [canvasSize.width, canvasSize.height, isFPSLevel1, isFPSLevel2])

  // Draw minimalist basketball court (neon Tron style)
  const drawCourt = useCallback((ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return

    const floorHeight = canvasSize.height * 0.2
    const floorY = canvasSize.height - floorHeight
    const centerX = canvasSize.width / 2
    
    // Free throw arc (half circle inverted downward) - top of arc touches floor line
    const arcY = floorY // Arc top touches the floor line
    const arcRadius = canvasSize.width * 0.08 // 8% of canvas width (between 7-9%)

    ctx.save()
    
    // Set opacity and neon styling
    ctx.globalAlpha = 0.8
    ctx.strokeStyle = colors.primary
    ctx.lineWidth = 3
    ctx.shadowBlur = 12 // Between 10-14
    // Convert shadow color with opacity 0.7
    let shadowColorRgba = colors.primary
    if (colors.primary.startsWith('#')) {
      const r = parseInt(colors.primary.slice(1, 3), 16)
      const g = parseInt(colors.primary.slice(3, 5), 16)
      const b = parseInt(colors.primary.slice(5, 7), 16)
      shadowColorRgba = `rgba(${r}, ${g}, ${b}, 0.7)`
    } else if (colors.primary.startsWith('rgb')) {
      shadowColorRgba = colors.primary.replace('rgb', 'rgba').replace(')', ', 0.7)')
    }
    ctx.shadowColor = shadowColorRgba
    
    // Draw inverted arc (half circle pointing downward) - from left to right, bottom half
    ctx.beginPath()
    ctx.arc(centerX, arcY, arcRadius, 0, Math.PI, false) // 0 to Math.PI = bottom half circle (inverted)
    ctx.stroke()

    ctx.restore()
  }, [canvasSize.width, canvasSize.height, isFPSLevel1])

  // Create fireworks effect at position
  const createFireworks = useCallback((x: number, y: number, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return
    
    // Firework limits: 6 desktop, 2 mobile, 3 at FPS Level 1
    const isMobile = useMobileModeStore.getState().isMobile
    const baseMaxFireworks = isMobile ? 2 : 6
    const maxFireworks = isFPSLevel1 ? 3 : baseMaxFireworks
    if (fireworksRef.current.length > maxFireworks * 30) {
      // Remove oldest fireworks (fade out gradually)
      const oldestCount = Math.floor(fireworksRef.current.length * 0.3)
      const removedParticles = fireworksRef.current.slice(0, oldestCount)
      fireworksRef.current = fireworksRef.current.slice(oldestCount)
      // Deallocate removed particles
      deallocateParticles('fireworks', removedParticles.length)
    }
    
    // FPS Guardian Level 1: Reduce particle count by half
    const baseParticleCount = 30
    const particleCount = isFPSLevel1 ? Math.floor(baseParticleCount / 2) : baseParticleCount
    
    // Check particle budget before creating
    if (!allocateParticles('fireworks', particleCount)) {
      // Budget exceeded, reduce particle count
      const available = useParticleBudgetStore.getState().getAvailable('fireworks')
      if (available <= 0) {
        return // No budget available
      }
      const adjustedCount = Math.min(particleCount, available)
      if (!allocateParticles('fireworks', adjustedCount)) {
        return // Still can't allocate
      }
    }
    
    const particles: FireworkParticle[] = []
    
    // Create particles in all directions
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5
      const speed = 2 + Math.random() * 4
      // Particle TTL: 1200-2000ms (1.2-2s) for better performance
      const lifeMs = 1200 + Math.random() * 800 // 1200-2000ms
      const life = Math.floor(lifeMs / 16.67) // Convert to frames (assuming 60fps)
      
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        color: colors.primary,
        size: 2 + Math.random() * 3, // 2-5px
      })
    }
    
    fireworksRef.current.push(...particles)
  }, [isFPSLevel1])
  
  // Store createFireworks in ref for access in collision handler
  useEffect(() => {
    createFireworksRef.current = createFireworks
  }, [createFireworks])

  // Indiana Jones theme: Create dust puff effect
  const createDustPuff = useCallback((x: number, y: number, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return
    
    const { mode: mobileMode } = useMobileModeStore.getState()
    if (mobileMode === 'lite') return // Disabled in mobile-lite mode
    
    // Spawn 8-12 particles
    const particleCount = 8 + Math.floor(Math.random() * 5) // 8-12 particles
    // Get bgSoft from CSS variables (Indiana Jones theme specific)
    const root = typeof window !== 'undefined' ? document.documentElement : null
    const dustColor = root ? getComputedStyle(root).getPropertyValue('--color-bg-secondary').trim() || '#8A6B45' : '#8A6B45'
    
    // Check particle budget (use 'theme' type for dust particles)
    if (!allocateParticles('theme', particleCount)) {
      const available = useParticleBudgetStore.getState().getAvailable('theme')
      if (available <= 0) return
      const adjustedCount = Math.min(particleCount, available)
      if (!allocateParticles('theme', adjustedCount)) return
    }
    
    const particles: DustParticle[] = []
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.3
      const speed = 0.5 + Math.random() * 1.5
      const lifeMs = 800 + Math.random() * 400 // 800-1200ms
      const life = Math.floor(lifeMs / 16.67)
      
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: -Math.abs(Math.sin(angle) * speed) - 0.5, // Rise upward
        life,
        maxLife: life,
        size: 2 + Math.random() * 2, // 2-4px
      })
    }
    
    dustParticlesRef.current.push(...particles)
  }, [])

  // Indiana Jones theme: Trigger divine light effect
  const triggerDivineLight = useCallback((basketX: number, basketY: number) => {
    const { mode: mobileMode } = useMobileModeStore.getState()
    if (mobileMode === 'lite') return // Disabled in mobile-lite mode
    
    divineLightRef.current = {
      startTime: Date.now(),
      duration: 600, // 600ms
      x: basketX,
      y: basketY,
    }
  }, [])

  // Indiana Jones theme: Trigger temple shake effect
  const triggerTempleShake = useCallback(() => {
    const { mode: mobileMode, isMobile } = useMobileModeStore.getState()
    if (mobileMode === 'lite') return // Disabled in mobile-lite mode
    
    const intensity = mobileMode === 'full' && isMobile ? 1 : 2 // ±1px mobile-full, ±2px desktop
    templeShakeRef.current = {
      active: true,
      startTime: Date.now(),
      duration: 300, // 300ms
      intensity,
    }
    
    // Auto-disable after duration
    setTimeout(() => {
      templeShakeRef.current.active = false
    }, 300)
  }, [])

  // Star Wars theme: Trigger saber flash effect (on basket made)
  const triggerSaberFlash = useCallback((basketX: number, basketY: number, orbVariant?: StarWarsOrbVariant) => {
    const { mode: mobileMode } = useMobileModeStore.getState()
    if (mobileMode === 'lite') return // Disabled in mobile-lite mode
    
    // Determine color based on variant (blue for most, red for red variants)
    const isRedVariant = orbVariant === 'red-void-blade' || orbVariant === 'holocron-red'
    const color = isRedVariant ? 'red' : 'blue'
    
    saberFlashRef.current = {
      startTime: Date.now(),
      duration: 250, // 200-300ms average
      x: basketX,
      y: basketY,
      color,
    }
  }, [])

  // Star Wars theme: Trigger dark shock effect (on rim hit)
  const triggerDarkShock = useCallback((rimX: number, rimY: number) => {
    const { mode: mobileMode } = useMobileModeStore.getState()
    if (mobileMode === 'lite') return // Disabled in mobile-lite mode
    
    darkShockRef.current = {
      startTime: Date.now(),
      duration: 150, // Quick effect
      x: rimX,
      y: rimY,
    }
    
    // Micro shake on rim
    rimShakeRef.current = 2 // Small shake
    setTimeout(() => {
      rimShakeRef.current = 0
    }, 150)
  }, [])

  // Star Wars theme: Trigger hyperspace burst (after 3 floor collisions)
  const triggerHyperspaceBurst = useCallback(() => {
    const { mode: mobileMode } = useMobileModeStore.getState()
    if (mobileMode === 'lite') return // Disabled in mobile-lite mode
    
    hyperspaceBurstRef.current = {
      startTime: Date.now(),
      duration: 200, // Quick, disappear in 200ms
    }
  }, [])

  // Star Wars theme: Trigger astromech ping effect
  const triggerAstromechPing = useCallback((x: number, y: number) => {
    const { mode: mobileMode } = useMobileModeStore.getState()
    if (mobileMode === 'lite') return // Disabled in mobile-lite mode
    
    astromechPingRef.current = {
      startTime: Date.now(),
      duration: 400, // Pulse duration
      x,
      y,
    }
  }, [])

  // Indiana Jones theme: Trigger Temple Collapse Event Easter Egg
  const triggerIndianaJonesEasterEgg = useCallback(() => {
    if (themeId !== "indiana-jones") return
    
    // Check if already unlocked
    if (typeof window !== "undefined") {
      const unlocked = localStorage.getItem("ij_temple_event_unlocked")
      if (unlocked === "true") return
    }
    
    // 0.5% chance
    if (Math.random() > 0.005) return
    
    // Trigger easter egg
    templeCollapseRef.current = {
      phase: 1,
      startTime: Date.now(),
    }
    
    // Mark as unlocked
    if (typeof window !== "undefined") {
      localStorage.setItem("ij_temple_event_unlocked", "true")
    }
  }, [themeId])

  // Indiana Jones theme: Render Temple Collapse Event
  const renderTempleCollapse = useCallback((ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!templeCollapseRef.current || !colors) return
    
    const { mode: mobileMode } = useMobileModeStore.getState()
    const effect = templeCollapseRef.current
    const elapsed = Date.now() - effect.startTime
    
    ctx.save()
    
    if (effect.phase === 1) {
      // Phase 1: Initial Tremor (0.4s)
      const phaseDuration = 400
      const progress = Math.min(elapsed / phaseDuration, 1)
      
      if (progress >= 1) {
        effect.phase = 2
        effect.startTime = Date.now()
      } else {
        // Darken canvas 20%
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)
        
        // Shake ±2px
        const shakeX = (Math.random() - 0.5) * 2
        const shakeY = (Math.random() - 0.5) * 2
        ctx.translate(shakeX, shakeY)
        
        // Spawn dust particles (reuse createDustPuff)
        if (Math.random() < 0.1) { // Spawn occasionally
          createDustPuff(canvasSize.width / 2, canvasSize.height * 0.9, colors)
        }
      }
    } else if (effect.phase === 2) {
      // Phase 2: Illuminated Cracks (0.6s)
      const phaseDuration = 600
      const progress = Math.min(elapsed / phaseDuration, 1)
      
      if (progress >= 1) {
        effect.phase = 3
        effect.startTime = Date.now()
        // Spawn falling stones
        if (mobileMode !== 'lite') {
          const stoneCount = 3 + Math.floor(Math.random() * 3) // 3-5 stones
          fallingStonesRef.current = []
          for (let i = 0; i < stoneCount; i++) {
            fallingStonesRef.current.push({
              x: canvasSize.width * 0.2 + (i * canvasSize.width * 0.2),
              y: 0,
              vy: 2 + Math.random() * 2,
              size: 15 + Math.random() * 10,
              life: 1,
            })
          }
        }
      } else {
        // Crack pattern overlay
        const amberColor = "#FFB95A"
        const pulse = Math.sin(progress * Math.PI * 4) * 0.5 + 0.5
        ctx.strokeStyle = amberColor
        ctx.lineWidth = 2
        ctx.globalAlpha = 0.3 + pulse * 0.4
        ctx.shadowBlur = 8
        ctx.shadowColor = amberColor
        
        // Draw crack lines
        for (let i = 0; i < 8; i++) {
          const x1 = Math.random() * canvasSize.width
          const y1 = Math.random() * canvasSize.height * 0.5
          const x2 = x1 + (Math.random() - 0.5) * 100
          const y2 = y1 + 50 + Math.random() * 50
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
      }
    } else if (effect.phase === 3) {
      // Phase 3: Falling Stones (0.8s)
      const phaseDuration = 800
      const progress = Math.min(elapsed / phaseDuration, 1)
      
      if (progress >= 1) {
        effect.phase = 4
        effect.startTime = Date.now()
        fallingStonesRef.current = []
      } else if (mobileMode !== 'lite') {
        // Update and render falling stones
        fallingStonesRef.current = fallingStonesRef.current.filter((stone) => {
          stone.y += stone.vy
          
          // Check ground impact
          const groundY = canvasSize.height * 0.9
          if (stone.y >= groundY) {
            stone.life -= 0.05
            if (stone.life <= 0) return false
          }
          
          // Get bgSoft from CSS variables
          const root = typeof window !== 'undefined' ? document.documentElement : null
          const bgSoft = root ? getComputedStyle(root).getPropertyValue('--color-bg-secondary').trim() || '#8A6B45' : '#8A6B45'
          
          // Draw stone
          ctx.fillStyle = bgSoft
          ctx.globalAlpha = stone.life
          ctx.beginPath()
          ctx.arc(stone.x, stone.y, stone.size, 0, Math.PI * 2)
          ctx.fill()
          
          // Shadow on impact
          if (stone.y >= groundY) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
            ctx.beginPath()
            ctx.ellipse(stone.x, groundY, stone.size, stone.size * 0.3, 0, 0, Math.PI * 2)
            ctx.fill()
          }
          
          return true
        })
      }
    } else if (effect.phase === 4) {
      // Phase 4: Divine Glow (0.7s)
      const phaseDuration = 700
      const progress = Math.min(elapsed / phaseDuration, 1)
      
      if (progress >= 1) {
        effect.phase = 5
        effect.startTime = Date.now()
      } else {
        // Golden beam descending
        const basketX = canvasSize.width / 2
        const headerHeight = 96
        const basketY = headerHeight + 20 + 70
        const beamHeight = progress * canvasSize.height * 0.5
        
        // Get highlight color from CSS variables
        const root = typeof window !== 'undefined' ? document.documentElement : null
        const highlightColor = root ? getComputedStyle(root).getPropertyValue('--color-text').trim() || '#FFF4D0' : '#FFF4D0'
        
        ctx.fillStyle = highlightColor
        ctx.globalAlpha = 0.4 * (1 - progress)
        ctx.fillRect(basketX - 20, basketY - beamHeight, 40, beamHeight)
        
        // "CODE OF ANCIENTS" text
        ctx.fillStyle = colors.primary || '#DAB466'
        ctx.font = "bold 24px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.shadowBlur = 12
        ctx.shadowColor = colors.primary || '#DAB466'
        ctx.globalAlpha = 1 - progress
        ctx.fillText("CODE OF ANCIENTS", basketX, basketY - beamHeight / 2)
      }
    } else if (effect.phase === 5) {
      // Phase 5: Final Message (2s)
      const phaseDuration = 2000
      const progress = Math.min(elapsed / phaseDuration, 1)
      
      if (progress >= 1) {
        templeCollapseRef.current = null
      } else {
        // Final message overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)
        
        ctx.fillStyle = colors.text || '#FFF4D0'
        ctx.font = "20px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.globalAlpha = 0.85
        ctx.fillText(
          "🏺 Você testemunhou o Templo do Código Antigo. Raridade: 0.5%",
          canvasSize.width / 2,
          canvasSize.height / 2
        )
      }
    }
    
    ctx.restore()
  }, [canvasSize, createDustPuff, themeId])

  // Render fireworks particles
  const renderFireworks = useCallback((ctx: CanvasRenderingContext2D) => {
    if (fireworksRef.current.length === 0) return
    
    // FPS Guardian Level 2: Skip fireworks rendering
    if (isFPSLevel2) return
    
    ctx.save()
    
    // FPS Guardian Level 1: Reduce particles by half (skip every other particle)
    const particlesToRender = isFPSLevel1 
      ? fireworksRef.current.filter((_, index) => index % 2 === 0)
      : fireworksRef.current
    
    // Update and render each particle
    let deadParticleCount = 0
    fireworksRef.current = fireworksRef.current.filter((particle) => {
      // Update position
      particle.x += particle.vx
      particle.y += particle.vy
      
      // Apply gravity
      particle.vy += 0.15
      
      // Update life
      particle.life -= 1
      
      if (particle.life <= 0) {
        deadParticleCount++
        return false // Remove dead particles
      }
      
      // Calculate alpha based on remaining life
      let alpha = particle.life / particle.maxLife
      
      // FPS Guardian Level 1: Decrease neon opacity by 50%
      if (isFPSLevel1) {
        alpha *= 0.5
      }
      
      // Draw particle with glow
      ctx.globalAlpha = alpha
      ctx.fillStyle = particle.color
      
      // FPS Guardian Level 1: Reduce glow intensity by 50%
      const baseGlow = 8
      ctx.shadowBlur = isFPSLevel1 ? baseGlow * 0.5 : baseGlow
      ctx.shadowColor = particle.color
      
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
      
      return true // Keep alive particles
    })
    
    // Deallocate dead particles from budget
    if (deadParticleCount > 0) {
      deallocateParticles('fireworks', deadParticleCount)
    }
    
    ctx.restore()
  }, [isFPSLevel1, isFPSLevel2])

  // Indiana Jones theme: Render dust particles
  const renderDustParticles = useCallback((ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors || dustParticlesRef.current.length === 0) return
    
    const { mode: mobileMode } = useMobileModeStore.getState()
    if (mobileMode === 'lite') return
    
    if (isFPSLevel2) return
    
    ctx.save()
    
    // Get bgSoft from CSS variables
    const root = typeof window !== 'undefined' ? document.documentElement : null
    const dustColor = root ? getComputedStyle(root).getPropertyValue('--color-bg-secondary').trim() || '#8A6B45' : '#8A6B45'
    let deadParticleCount = 0
    
    dustParticlesRef.current = dustParticlesRef.current.filter((particle) => {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.vy += 0.05 // Light gravity
      particle.life -= 1
      
      if (particle.life <= 0) {
        deadParticleCount++
        return false
      }
      
      const alpha = particle.life / particle.maxLife
      ctx.globalAlpha = alpha * 0.6
      ctx.fillStyle = dustColor
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
      
      return true
    })
    
    if (deadParticleCount > 0) {
      deallocateParticles('theme', deadParticleCount)
    }
    
    ctx.restore()
  }, [isFPSLevel2])

  // Indiana Jones theme: Render divine light effect
  const renderDivineLight = useCallback((ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!divineLightRef.current || !colors) return
    
    const { mode: mobileMode } = useMobileModeStore.getState()
    if (mobileMode === 'lite') return
    
    const effect = divineLightRef.current
    const elapsed = Date.now() - effect.startTime
    const progress = Math.min(elapsed / effect.duration, 1)
    
    if (progress >= 1) {
      divineLightRef.current = null
      return
    }
    
    ctx.save()
    
    // Golden triangular overlay (fade in/out)
    const alpha = progress < 0.5 ? progress * 2 : (1 - progress) * 2
    ctx.globalAlpha = alpha * 0.4
    
    // Get highlight color from CSS variables
    const root = typeof window !== 'undefined' ? document.documentElement : null
    const highlightColor = root ? getComputedStyle(root).getPropertyValue('--color-text').trim() || '#FFF4D0' : '#FFF4D0'
    ctx.fillStyle = highlightColor
    
    // Triangle pointing down (over basket)
    const triangleSize = 80
    ctx.beginPath()
    ctx.moveTo(effect.x, effect.y - triangleSize)
    ctx.lineTo(effect.x - triangleSize, effect.y + triangleSize)
    ctx.lineTo(effect.x + triangleSize, effect.y + triangleSize)
    ctx.closePath()
    ctx.fill()
    
    ctx.restore()
  }, [])

  // Star Wars theme: Render saber flash effect
  const renderSaberFlash = useCallback((ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!saberFlashRef.current || !colors) return
    
    const { mode: mobileMode } = useMobileModeStore.getState()
    if (mobileMode === 'lite') return
    
    const effect = saberFlashRef.current
    const elapsed = Date.now() - effect.startTime
    const progress = Math.min(elapsed / effect.duration, 1)
    
    if (progress >= 1) {
      saberFlashRef.current = null
      return
    }
    
    ctx.save()
    
    // Diagonal flash (fade in/out) - make it more visible
    const alpha = progress < 0.5 ? progress * 2 : (1 - progress) * 2
    ctx.globalAlpha = alpha * 0.9 // Increased from 0.7
    
    const flashColor = effect.color === 'red' ? colors.accent || '#FF2B2B' : colors.primary || '#2F9BFF'
    ctx.strokeStyle = flashColor
    ctx.lineWidth = 6 // Increased from 4
    ctx.shadowBlur = 20 // Increased from 12
    ctx.shadowColor = flashColor
    
    // Diagonal line (top-left to bottom-right)
    const flashLength = 100
    ctx.beginPath()
    ctx.moveTo(effect.x - flashLength / 2, effect.y - flashLength / 2)
    ctx.lineTo(effect.x + flashLength / 2, effect.y + flashLength / 2)
    ctx.stroke()
    
    ctx.restore()
  }, [])

  // Star Wars theme: Render dark shock effect
  const renderDarkShock = useCallback((ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!darkShockRef.current || !colors) return
    
    const { mode: mobileMode } = useMobileModeStore.getState()
    if (mobileMode === 'lite') return
    
    const effect = darkShockRef.current
    const elapsed = Date.now() - effect.startTime
    const progress = Math.min(elapsed / effect.duration, 1)
    
    if (progress >= 1) {
      darkShockRef.current = null
      return
    }
    
    ctx.save()
    
    // Red spark particles - make them more visible
    const sparkColor = colors.accent || '#FF2B2B'
    ctx.fillStyle = sparkColor
    ctx.shadowBlur = 10 // Add glow to sparks
    ctx.shadowColor = sparkColor
    ctx.globalAlpha = (1 - progress) * 1.0 // Increased from 0.8
    
    // Small sparks around rim - make them bigger and more visible
    for (let i = 0; i < 8; i++) { // Increased from 6
      const angle = (i / 8) * Math.PI * 2
      const distance = 20 + progress * 15 // Increased distance
      const x = effect.x + Math.cos(angle) * distance
      const y = effect.y + Math.sin(angle) * distance
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2) // Increased from 2
      ctx.fill()
    }
    
    ctx.restore()
  }, [])

  // Star Wars theme: Render hyperspace burst effect
  const renderHyperspaceBurst = useCallback((ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!hyperspaceBurstRef.current || !colors) return
    
    const { mode: mobileMode } = useMobileModeStore.getState()
    if (mobileMode === 'lite') return
    
    const effect = hyperspaceBurstRef.current
    const elapsed = Date.now() - effect.startTime
    const progress = Math.min(elapsed / effect.duration, 1)
    
    if (progress >= 1) {
      hyperspaceBurstRef.current = null
      return
    }
    
    ctx.save()
    
    // Radial streaks in background - make them more visible
    const streakColor = colors.glow || '#59E0FF'
    ctx.strokeStyle = streakColor
    ctx.lineWidth = 3 // Increased from 2
    ctx.shadowBlur = 15 // Increased from 8
    ctx.shadowColor = streakColor
    ctx.globalAlpha = (1 - progress) * 0.8 // Increased from 0.6
    
    const centerX = canvasSize.width / 2
    const centerY = canvasSize.height / 2
    
    // Radial streaks from center
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const length = 200 + progress * 100
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + Math.cos(angle) * length, centerY + Math.sin(angle) * length)
      ctx.stroke()
    }
    
    ctx.restore()
  }, [])

  // Star Wars theme: Render astromech ping effect
  const renderAstromechPing = useCallback((ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!astromechPingRef.current || !colors) return
    
    const { mode: mobileMode } = useMobileModeStore.getState()
    if (mobileMode === 'lite') return
    
    const effect = astromechPingRef.current
    const elapsed = Date.now() - effect.startTime
    const progress = Math.min(elapsed / effect.duration, 1)
    
    if (progress >= 1) {
      astromechPingRef.current = null
      return
    }
    
    ctx.save()
    
    // Circular pulse (internal → external) - make it more visible
    const pingColor = colors.primary || '#2F9BFF'
    ctx.strokeStyle = pingColor
    ctx.lineWidth = 4 // Increased from 2
    ctx.shadowBlur = 20 // Increased from 6
    ctx.shadowColor = pingColor
    ctx.globalAlpha = (1 - progress) * 0.9 // Increased from 0.5
    
    const maxRadius = 60 // Increased from 50
    const radius = progress * maxRadius
    ctx.beginPath()
    ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2)
    ctx.stroke()
    
    // Add inner circle for more visibility
    ctx.globalAlpha = (1 - progress) * 0.6
    ctx.beginPath()
    ctx.arc(effect.x, effect.y, radius * 0.6, 0, Math.PI * 2)
    ctx.stroke()
    
    ctx.restore()
  }, [])

  // Render theme-specific shake visual effects
  const renderShakeEffect = useCallback((ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!shakeEffectRef.current || !colors) return
    
    const { mode: mobileMode } = useMobileModeStore.getState()
    if (mobileMode === 'lite') return
    
    const effect = shakeEffectRef.current
    const elapsed = Date.now() - effect.startTime
    const progress = Math.min(elapsed / effect.duration, 1)
    
    if (progress >= 1) {
      shakeEffectRef.current = null
      return
    }
    
    ctx.save()
    
    // Fade out effect
    const alpha = 1 - progress
    ctx.globalAlpha = alpha * 0.6
    
    const centerX = canvasSize.width / 2
    const centerY = canvasSize.height / 2
    
    switch (effect.themeId) {
      case 'chaves': {
        // Chaves theme: No center screen effect (character animation is shown near shake button)
        // Just skip rendering here
        break
      }
      
      case 'pomemin': {
        // Colorful sparkles
        const colors_pomemin = ['#FFD700', '#FF1493', '#8A2BE2']
        for (let i = 0; i < 20; i++) {
          const angle = (i / 20) * Math.PI * 2
          const distance = 100 + progress * 150
          const x = centerX + Math.cos(angle) * distance
          const y = centerY + Math.sin(angle) * distance
          const color = colors_pomemin[i % colors_pomemin.length]
          
          ctx.fillStyle = color
          ctx.shadowBlur = 15
          ctx.shadowColor = color
          ctx.beginPath()
          ctx.arc(x, y, 4 + Math.random() * 4, 0, Math.PI * 2)
          ctx.fill()
        }
        break
      }
      
      case 'dracula': {
        // Red/purple energy waves
        const waveColor1 = '#8B0000'
        const waveColor2 = '#4B0082'
        ctx.strokeStyle = waveColor1
        ctx.lineWidth = 3
        ctx.shadowBlur = 25
        ctx.shadowColor = waveColor1
        
        // Concentric circles
        for (let i = 0; i < 5; i++) {
          const radius = 50 + (i * 30) + progress * 100
          ctx.beginPath()
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
          ctx.stroke()
          
          if (i % 2 === 1) {
            ctx.strokeStyle = waveColor2
            ctx.shadowColor = waveColor2
          } else {
            ctx.strokeStyle = waveColor1
            ctx.shadowColor = waveColor1
          }
        }
        break
      }
      
      case 'portal': {
        // Orange/blue portal rings
        const orangeColor = '#ff7a00'
        const blueColor = '#24b0ff'
        ctx.lineWidth = 4
        ctx.shadowBlur = 20
        
        // Alternating rings
        for (let i = 0; i < 6; i++) {
          const radius = 40 + (i * 25) + progress * 120
          const color = i % 2 === 0 ? orangeColor : blueColor
          ctx.strokeStyle = color
          ctx.shadowColor = color
          ctx.beginPath()
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
          ctx.stroke()
        }
        break
      }
      
      case 'indiana-jones': {
        // Golden sand/dust explosion
        const goldColor = '#DAB466'
        ctx.fillStyle = goldColor
        ctx.shadowBlur = 30
        ctx.shadowColor = goldColor
        
        // Particle burst
        for (let i = 0; i < 30; i++) {
          const angle = (i / 30) * Math.PI * 2
          const distance = 80 + progress * 200
          const x = centerX + Math.cos(angle) * distance
          const y = centerY + Math.sin(angle) * distance
          const size = 3 + Math.random() * 4
          
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        }
        break
      }
      
      case 'star-wars': {
        // Blue energy burst with hyperspace streaks
        const blueColor = '#2F9BFF'
        const cyanColor = '#59E0FF'
        ctx.strokeStyle = blueColor
        ctx.lineWidth = 3
        ctx.shadowBlur = 25
        ctx.shadowColor = blueColor
        
        // Hyperspace streaks
        for (let i = 0; i < 16; i++) {
          const angle = (i / 16) * Math.PI * 2
          const length = 200 + progress * 300
          ctx.beginPath()
          ctx.moveTo(centerX, centerY)
          ctx.lineTo(centerX + Math.cos(angle) * length, centerY + Math.sin(angle) * length)
          ctx.stroke()
          
          // Alternate colors
          if (i % 2 === 0) {
            ctx.strokeStyle = blueColor
            ctx.shadowColor = blueColor
          } else {
            ctx.strokeStyle = cyanColor
            ctx.shadowColor = cyanColor
          }
        }
        
        // Central energy core
        ctx.fillStyle = cyanColor
        ctx.shadowBlur = 40
        ctx.shadowColor = cyanColor
        ctx.beginPath()
        ctx.arc(centerX, centerY, 30 + progress * 50, 0, Math.PI * 2)
        ctx.fill()
        break
      }
      
      default: {
        // Default: simple flash
        ctx.fillStyle = colors.accent
        ctx.shadowBlur = 30
        ctx.shadowColor = colors.accent
        ctx.beginPath()
        ctx.arc(centerX, centerY, 100 + progress * 150, 0, Math.PI * 2)
        ctx.fill()
        break
      }
    }
    
    ctx.restore()
  }, [canvasSize])

  // Draw rim (basket hoop)
  const drawRim = useCallback((ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    // FPS Guardian Level 2: Skip rim rendering
    if (isFPSLevel2) return
    if (!colors) return

    const headerHeight = 96
    const backboardY = headerHeight + 20
    const backboardHeight = 140 // Increased by 50% then +30% then +20% (60 * 1.5 * 1.3 * 1.2 = 140.4 ≈ 140)
    const backboardBottom = backboardY + backboardHeight
    
    // Aro dentro do backboard (subido um pouco)
    // Apply shake offset (vibrate rim)
    const shakeOffset = rimShakeRef.current > 0 ? (Math.random() - 0.5) * rimShakeRef.current : 0
    const centerX = canvasSize.width / 2 + shakeOffset
    const centerY = backboardBottom - 15 // Aro fica 15px dentro do backboard
    const radius = 60
    const arcSpacing = 3 // Espaçamento vertical entre arcos

    ctx.save()
    
    // Apply hoop bend animation (portal theme)
    if (themeId === "portal" && hoopBendProgressRef.current > 0) {
      ctx.translate(centerX, centerY)
      ctx.scale(1, hoopBendProgressRef.current)
      ctx.translate(-centerX, -centerY)
    }

    // Apply pulse alpha effect
    // FPS Guardian Level 1: Decrease neon opacity by 50%
    let alpha = rimAlphaRef.current
    if (isFPSLevel1) {
      alpha *= 0.5
    }
    ctx.globalAlpha = alpha

    // Layer 1: Main neon arc (thick)
    // Use primary color to match theme better
    const rimColor = colors.primary || colors.accent
    ctx.strokeStyle = rimColor
    ctx.lineWidth = 6
    // FPS Guardian Level 1: Reduce glow intensity by 50%
    const baseGlow = rimGlowRef.current // Dynamic glow (8 default, 16 on score)
    ctx.shadowBlur = isFPSLevel1 ? baseGlow * 0.5 : baseGlow
    ctx.shadowOffsetY = 4 // Vertical offset for depth
    ctx.shadowColor = rimColor // Use primary color to match theme
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI)
    ctx.stroke()

    // Layer 2: Secondary neon arc (thin, 3px below)
    ctx.strokeStyle = rimColor
    ctx.lineWidth = 2
    // FPS Guardian Level 1: Reduce glow intensity by 50%
    const innerGlow = rimGlowRef.current * 0.5 // Half glow for inner arc
    ctx.shadowBlur = isFPSLevel1 ? innerGlow * 0.5 : innerGlow
    ctx.shadowOffsetY = 2 // Smaller offset
    ctx.beginPath()
    ctx.arc(centerX, centerY + arcSpacing, radius - 8, 0, Math.PI)
    ctx.stroke()

    // Layer 3: Internal shadow arc (very thin, dark, 3px below layer 2) - creates depth
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
    ctx.lineWidth = 2
    ctx.shadowBlur = 0 // No glow for shadow
    ctx.shadowOffsetY = 0
    ctx.beginPath()
    ctx.arc(centerX, centerY + (arcSpacing * 2), radius - 8, 0, Math.PI)
    ctx.stroke()

    ctx.globalAlpha = 1
    ctx.restore()
  }, [canvasSize.width, isFPSLevel1, isFPSLevel2])

  // Initialize portals position (proportional to canvas)
  const initializePortals = useCallback((canvasWidth: number, canvasHeight: number) => {
    const headerHeight = 96
    
    // Orange portal on floor - positioned slightly above floor to swallow resting orbs
    portalOrangeRef.current.x = canvasWidth * 0.2
    portalOrangeRef.current.y = canvasHeight - 45 // Slightly above floor to swallow resting orbs
    
    // Blue portal on ceiling - positioned very close to header
    portalBlueRef.current.x = canvasWidth / 2
    portalBlueRef.current.y = headerHeight + 5 // Very close to header, almost touching
  }, [])

  // Update portal positions on resize (proportional)
  const updatePortalsOnResize = useCallback((oldWidth: number, oldHeight: number, newWidth: number, newHeight: number) => {
    if (oldWidth === 0 || oldHeight === 0) return
    
    const scaleX = newWidth / oldWidth
    const scaleY = newHeight / oldHeight
    
    // Update orange portal
    portalOrangeRef.current.x *= scaleX
    portalOrangeRef.current.y *= scaleY
    
    // Update blue portal
    portalBlueRef.current.x *= scaleX
    portalBlueRef.current.y *= scaleY
  }, [])

  // Create Chaves appear sound (when character rises from barrel)
  const playChavesAppearSound = useCallback(() => {
    if (typeof window === 'undefined' || (!window.AudioContext && !(window as any).webkitAudioContext)) return
    
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }
      
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }
      
      // Short "pop" sound when appearing
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(300, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1)
      
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.1)
    } catch (error) {
      // Silently fail if audio context is not available
    }
  }, [])
  
  // Create Chaves crying sound ("Piiii... Pipipipipipi")
  const playChavesCryingSound = useCallback(() => {
    if (typeof window === 'undefined' || (!window.AudioContext && !(window as any).webkitAudioContext)) return
    
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }
      
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }
      
      const startTime = ctx.currentTime
      
      // "Piiii..." - long descending tone
      const longOsc = ctx.createOscillator()
      const longGain = ctx.createGain()
      longOsc.connect(longGain)
      longGain.connect(ctx.destination)
      
      longOsc.type = 'sine'
      longOsc.frequency.setValueAtTime(400, startTime)
      longOsc.frequency.exponentialRampToValueAtTime(250, startTime + 0.3)
      
      longGain.gain.setValueAtTime(0.12, startTime)
      longGain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.3)
      
      longOsc.start(startTime)
      longOsc.stop(startTime + 0.3)
      
      // "Pipipipipipi" - rapid short tones
      for (let i = 0; i < 6; i++) {
        const delay = 0.3 + (i * 0.08)
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        osc.type = 'sine'
        osc.frequency.setValueAtTime(350 - (i * 10), startTime + delay)
        
        gain.gain.setValueAtTime(0.1, startTime + delay)
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + delay + 0.05)
        
        osc.start(startTime + delay)
        osc.stop(startTime + delay + 0.05)
      }
    } catch (error) {
      // Silently fail if audio context is not available
    }
  }, [])
  
  // Create Star Wars proton beam sound ("Piu Piu Piu" - Atari style)
  const playStarWarsProtonBeamSound = useCallback(() => {
    if (typeof window === 'undefined' || (!window.AudioContext && !(window as any).webkitAudioContext)) return
    
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }
      
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }
      
      const startTime = ctx.currentTime
      
      // "Piu Piu Piu" - 3 short beeps (Atari style, square wave)
      for (let i = 0; i < 3; i++) {
        const delay = i * 0.15
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        osc.type = 'square' // Atari style
        osc.frequency.setValueAtTime(800 - (i * 50), startTime + delay) // Descending pitch
        
        gain.gain.setValueAtTime(0.15, startTime + delay)
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + delay + 0.1)
        
        osc.start(startTime + delay)
        osc.stop(startTime + delay + 0.1)
      }
    } catch (error) {
      // Silently fail if audio context is not available
    }
  }, [])
  
  // Create Star Wars explosion sound ("BOOM" - Atari style)
  const playStarWarsExplosionSound = useCallback(() => {
    if (typeof window === 'undefined' || (!window.AudioContext && !(window as any).webkitAudioContext)) return
    
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }
      
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }
      
      const startTime = ctx.currentTime
      
      // "BOOM" - Low frequency explosion (Atari style, noise + low tone)
      // Low rumble
      const lowOsc = ctx.createOscillator()
      const lowGain = ctx.createGain()
      lowOsc.connect(lowGain)
      lowGain.connect(ctx.destination)
      
      lowOsc.type = 'sawtooth' // Atari style
      lowOsc.frequency.setValueAtTime(60, startTime)
      lowOsc.frequency.exponentialRampToValueAtTime(30, startTime + 0.3)
      
      lowGain.gain.setValueAtTime(0.2, startTime)
      lowGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)
      
      lowOsc.start(startTime)
      lowOsc.stop(startTime + 0.3)
      
      // High frequency crack
      const highOsc = ctx.createOscillator()
      const highGain = ctx.createGain()
      highOsc.connect(highGain)
      highGain.connect(ctx.destination)
      
      highOsc.type = 'square'
      highOsc.frequency.setValueAtTime(2000, startTime)
      highOsc.frequency.exponentialRampToValueAtTime(500, startTime + 0.15)
      
      highGain.gain.setValueAtTime(0.15, startTime)
      highGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15)
      
      highOsc.start(startTime)
      highOsc.stop(startTime + 0.15)
    } catch (error) {
      // Silently fail if audio context is not available
    }
  }, [])
  
  // Render Star Wars proton beam easter egg
  const renderStarWarsEasterEgg = useCallback((ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!starWarsEasterEggRef.current || !colors) return
    
    const { mode: mobileMode } = useMobileModeStore.getState()
    if (mobileMode === 'lite') return
    
    const effect = starWarsEasterEggRef.current
    const elapsed = Date.now() - effect.startTime
    
    ctx.save()
    
    const centerX = canvasSize.width / 2
    const centerY = canvasSize.height / 2
    
    if (effect.explosionPhase === 'traveling') {
      // Phase 1: Beams traveling to center
      const travelDuration = 800 // 0.8s to reach center
      const progress = Math.min(elapsed / travelDuration, 1)
      
      if (progress >= 1) {
        // All beams reached center, trigger explosion
        effect.explosionPhase = 'exploding'
        effect.explosionProgress = 0
        effect.startTime = Date.now()
        playStarWarsExplosionSound()
      } else {
        // Draw traveling beams
        const blueColor = '#2F9BFF'
        const redColor = '#FF2B2B'
        
        effect.beams.forEach((beam) => {
          const currentX = beam.x + (beam.targetX - beam.x) * progress
          const currentY = beam.y + (beam.targetY - beam.y) * progress
          
          // Beam color: blue for left, red for right
          const beamColor = beam.side === 'left' ? blueColor : redColor
          
          ctx.strokeStyle = beamColor
          ctx.lineWidth = 4
          ctx.shadowBlur = 15
          ctx.shadowColor = beamColor
          ctx.globalAlpha = 0.9
          
          // Draw beam line
          ctx.beginPath()
          ctx.moveTo(beam.x, beam.y)
          ctx.lineTo(currentX, currentY)
          ctx.stroke()
          
          // Draw beam head (glowing circle)
          ctx.fillStyle = beamColor
          ctx.shadowBlur = 20
          ctx.beginPath()
          ctx.arc(currentX, currentY, 6, 0, Math.PI * 2)
          ctx.fill()
        })
      }
    } else if (effect.explosionPhase === 'exploding') {
      // Phase 2: Explosion at center
      const explosionDuration = 1000 // 1s explosion
      const progress = Math.min(elapsed / explosionDuration, 1)
      effect.explosionProgress = progress
      
      if (progress >= 1) {
        effect.explosionPhase = 'done'
        // Clean up after a short delay
        setTimeout(() => {
          starWarsEasterEggRef.current = null
        }, 200)
      } else {
        // Draw explosion
        const explosionRadius = 50 + progress * 200
        const alpha = 1 - progress
        
        // Outer explosion ring (orange/red)
        ctx.fillStyle = `rgba(255, 100, 0, ${alpha * 0.6})`
        ctx.shadowBlur = 30
        ctx.shadowColor = '#FF2B2B'
        ctx.beginPath()
        ctx.arc(centerX, centerY, explosionRadius, 0, Math.PI * 2)
        ctx.fill()
        
        // Inner explosion core (white/yellow)
        ctx.fillStyle = `rgba(255, 255, 200, ${alpha * 0.8})`
        ctx.shadowBlur = 40
        ctx.shadowColor = '#FFC23D'
        ctx.beginPath()
        ctx.arc(centerX, centerY, explosionRadius * 0.5, 0, Math.PI * 2)
        ctx.fill()
        
        // Explosion particles (sparks)
        for (let i = 0; i < 20; i++) {
          const angle = (i / 20) * Math.PI * 2
          const distance = explosionRadius * 0.8
          const sparkX = centerX + Math.cos(angle) * distance
          const sparkY = centerY + Math.sin(angle) * distance
          
          ctx.fillStyle = `rgba(255, ${200 + Math.random() * 55}, 0, ${alpha})`
          ctx.beginPath()
          ctx.arc(sparkX, sparkY, 3 + Math.random() * 3, 0, Math.PI * 2)
          ctx.fill()
        }
        
        // Distant ship explosion (small silhouette in background)
        const shipX = canvasSize.width * 0.85
        const shipY = canvasSize.height * 0.2
        const shipSize = Math.min(canvasSize.width * 0.15, canvasSize.height * 0.15) * 1.2
        
        // Ship silhouette with explosion effect
        ctx.fillStyle = `rgba(255, 100, 0, ${alpha * 0.4})`
        ctx.shadowBlur = 20
        ctx.shadowColor = '#FF2B2B'
        ctx.fillRect(shipX - shipSize / 2, shipY, shipSize, shipSize * 0.3)
        
        // Explosion flash on ship
        if (progress < 0.3) {
          const flashAlpha = (0.3 - progress) / 0.3
          ctx.fillStyle = `rgba(255, 255, 200, ${flashAlpha * 0.6})`
          ctx.beginPath()
          ctx.arc(shipX, shipY + shipSize * 0.15, shipSize * 0.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
    
    ctx.restore()
  }, [canvasSize])
  
  // Trigger Neon Assault easter egg
  const triggerNeonAssault = useCallback(() => {
    if (themeId !== 'star-wars') return
    const { mode: currentMobileMode } = useMobileModeStore.getState()
    if (currentMobileMode === 'lite') return
    
    const centerX = canvasSize.width / 2
    const centerY = canvasSize.height / 2
    
    // Create beams from bottom corners
    const beams: NeonBeam[] = []
    const beamSpeed = 600 + Math.random() * 300 // 600-900 px/s
    
    // Group 1: 2 beams from bottom-left corner
    for (let i = 0; i < 2; i++) {
      const startX = 20 + i * 30
      const startY = canvasSize.height - 20
      const dx = centerX - startX
      const dy = centerY - startY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const vx = (dx / distance) * beamSpeed / 60 // Convert to px/frame (assuming 60fps)
      const vy = (dy / distance) * beamSpeed / 60
      
      beams.push({
        x: startX,
        y: startY,
        targetX: centerX,
        targetY: centerY,
        vx,
        vy,
        group: 1,
        index: i,
        active: false // Will be activated with delay
      })
    }
    
    // Group 2: 2 beams from bottom-center
    for (let i = 0; i < 2; i++) {
      const startX = centerX - 30 + i * 60
      const startY = canvasSize.height - 20
      const dx = centerX - startX
      const dy = centerY - startY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const vx = (dx / distance) * beamSpeed / 60
      const vy = (dy / distance) * beamSpeed / 60
      
      beams.push({
        x: startX,
        y: startY,
        targetX: centerX,
        targetY: centerY,
        vx,
        vy,
        group: 2,
        index: i,
        active: false
      })
    }
    
    // Group 3: 2 beams from bottom-right corner
    for (let i = 0; i < 2; i++) {
      const startX = canvasSize.width - 20 - i * 30
      const startY = canvasSize.height - 20
      const dx = centerX - startX
      const dy = centerY - startY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const vx = (dx / distance) * beamSpeed / 60
      const vy = (dy / distance) * beamSpeed / 60
      
      beams.push({
        x: startX,
        y: startY,
        targetX: centerX,
        targetY: centerY,
        vx,
        vy,
        group: 3,
        index: i,
        active: false
      })
    }
    
    neonAssaultEasterEggRef.current = {
      state: 'idle',
      startTime: Date.now(),
      beams,
      shipShake: 0,
      shipAlpha: 0.9, // Ship appears immediately
      fragments: [],
      explosionParticles: [],
      explosionRadius: 0
    }
    
    // Start firing group 1 immediately
    setTimeout(() => {
      if (neonAssaultEasterEggRef.current) {
        neonAssaultEasterEggRef.current.state = 'firing_group_1'
        neonAssaultEasterEggRef.current.beams.filter(b => b.group === 1).forEach(b => b.active = true)
      }
    }, 0)
    
    // Start firing group 2 after 150ms
    setTimeout(() => {
      if (neonAssaultEasterEggRef.current) {
        neonAssaultEasterEggRef.current.state = 'firing_group_2'
        neonAssaultEasterEggRef.current.beams.filter(b => b.group === 2).forEach(b => b.active = true)
      }
    }, 150)
    
    // Start firing group 3 after 300ms
    setTimeout(() => {
      if (neonAssaultEasterEggRef.current) {
        neonAssaultEasterEggRef.current.state = 'firing_group_3'
        neonAssaultEasterEggRef.current.beams.filter(b => b.group === 3).forEach(b => b.active = true)
      }
    }, 300)
  }, [themeId, canvasSize])
  
  // Render Neon Assault easter egg (simplified for performance)
  const renderNeonAssault = useCallback((ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!neonAssaultEasterEggRef.current || !colors) return
    
    const { mode: mobileMode } = useMobileModeStore.getState()
    if (mobileMode === 'lite') return
    
    const effect = neonAssaultEasterEggRef.current
    const elapsed = Date.now() - effect.startTime
    
    ctx.save()
    
    const centerX = canvasSize.width / 2
    const centerY = canvasSize.height / 2
    const beamColor = '#4BFF66'
    const shipColor = '#D0EFFF'
    
    // Draw ship (simple circle)
    if (effect.state !== 'done' && effect.shipAlpha > 0) {
      const shipX = centerX + (Math.random() - 0.5) * effect.shipShake
      const shipY = centerY + (Math.random() - 0.5) * effect.shipShake
      
      ctx.globalAlpha = effect.shipAlpha
      ctx.fillStyle = shipColor
      ctx.shadowBlur = 8 // Reduced from 15
      ctx.shadowColor = shipColor
      
      ctx.beginPath()
      ctx.arc(shipX, shipY, 25, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Update and draw beams (simplified)
    if (effect.state === 'firing_group_1' || effect.state === 'firing_group_2' || effect.state === 'firing_group_3') {
      effect.beams.forEach((beam) => {
        if (!beam.active) return
        
        beam.x += beam.vx
        beam.y += beam.vy
        
        // Simple diagonal line
        ctx.strokeStyle = beamColor
        ctx.lineWidth = 3 // Reduced from 4
        ctx.shadowBlur = 10 // Reduced from 20
        ctx.shadowColor = beamColor
        ctx.globalAlpha = 0.9
        
        const angle = Math.atan2(beam.vy, beam.vx)
        const beamLength = 60 // Reduced from 90
        const startX = beam.x - Math.cos(angle) * beamLength / 2
        const startY = beam.y - Math.sin(angle) * beamLength / 2
        const endX = beam.x + Math.cos(angle) * beamLength / 2
        const endY = beam.y + Math.sin(angle) * beamLength / 2
        
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      })
      
      // Check collision (only for group 3)
      if (effect.state === 'firing_group_3') {
        const group3Beams = effect.beams.filter(b => b.active && b.group === 3)
        const allReached = group3Beams.every(b => {
          const dx = b.x - b.targetX
          const dy = b.y - b.targetY
          return Math.sqrt(dx * dx + dy * dy) <= 10 // Increased tolerance
        })
        
        if (allReached && group3Beams.length > 0) {
          effect.state = 'impact'
          effect.startTime = Date.now()
          effect.shipShake = 2 // Reduced from 3
          
          // Simplified particles (fewer)
          const particleCount = 8 // Reduced from 12-18
          effect.explosionParticles = []
          for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2
            const speed = 2 + Math.random() * 2 // Reduced
            effect.explosionParticles.push({
              x: centerX,
              y: centerY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: 0,
              maxLife: 20 // Reduced from 30-50
            })
          }
          
          // Fewer fragments
          effect.fragments = []
          for (let i = 0; i < 4; i++) { // Reduced from 8
            const angle = (i / 4) * Math.PI * 2
            const speed = 1.5 + Math.random() * 1.5 // Reduced
            effect.fragments.push({
              x: centerX,
              y: centerY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              rotation: Math.random() * Math.PI * 2,
              rotationSpeed: (Math.random() - 0.5) * 0.1, // Reduced
              life: 1,
              maxLife: 30 // Reduced from 50
            })
          }
        }
      }
    }
    
    // Impact phase
    if (effect.state === 'impact') {
      const impactDuration = 150
      const progress = Math.min(elapsed / impactDuration, 1)
      
      if (progress >= 1) {
        effect.state = 'explosion'
        effect.startTime = Date.now()
        effect.explosionRadius = 0
      } else {
        effect.shipAlpha = 0.9 * (1 - progress)
      }
    }
    
    // Explosion phase (simplified)
    if (effect.state === 'explosion') {
      const explosionDuration = 200
      const progress = Math.min(elapsed / explosionDuration, 1)
      
      if (progress >= 1) {
        effect.state = 'done'
        effect.shipAlpha = 0
        setTimeout(() => {
          neonAssaultEasterEggRef.current = null
        }, 100)
      } else {
        const maxRadius = 80 // Reduced from 100
        effect.explosionRadius = maxRadius * 1.2 * (1 - progress) // Reduced scale from 1.4
        
        ctx.fillStyle = beamColor
        ctx.shadowBlur = 20 // Reduced from 40
        ctx.shadowColor = beamColor
        ctx.globalAlpha = 0.6 * (1 - progress) // Reduced from 0.8
        ctx.beginPath()
        ctx.arc(centerX, centerY, effect.explosionRadius, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    // Simplified particles (no shadow blur per particle)
    effect.explosionParticles = effect.explosionParticles.filter((particle) => {
      particle.life++
      particle.x += particle.vx
      particle.y += particle.vy
      
      if (particle.life < particle.maxLife) {
        const alpha = 1 - (particle.life / particle.maxLife)
        ctx.fillStyle = beamColor
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2) // Smaller, no shadow
        ctx.fill()
        return true
      }
      return false
    })
    
    // Simplified fragments (no rotation, simpler shape)
    effect.fragments = effect.fragments.filter((fragment) => {
      fragment.life -= 0.03 // Faster fade
      fragment.x += fragment.vx
      fragment.y += fragment.vy
      
      if (fragment.life > 0) {
        ctx.fillStyle = shipColor
        ctx.globalAlpha = fragment.life
        ctx.beginPath()
        ctx.arc(fragment.x, fragment.y, 4, 0, Math.PI * 2) // Simple circle, no rotation
        ctx.fill()
        return true
      }
      return false
    })
    
    ctx.restore()
  }, [canvasSize, themeId])
  
  // Render Chaves character animation (appears from barrel near shake button)
  // Defined here after sound functions to avoid initialization order issues
  const renderChavesShakeAnimation = useCallback((ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!chavesShakeEffectRef.current || !colors) return
    
    const { mode: mobileMode } = useMobileModeStore.getState()
    if (mobileMode === 'lite') return
    
    const effect = chavesShakeEffectRef.current
    const elapsed = Date.now() - effect.startTime
    const progress = Math.min(elapsed / effect.duration, 1)
    
    if (progress >= 1) {
      chavesShakeEffectRef.current = null
      chavesCryingParticlesRef.current = [] // Clear particles
      return
    }
    
    ctx.save()
    
    // Position matches the barrel drawn on floor in drawFloor function
    const barrelSize = Math.min(canvasSize.width * 0.15, canvasSize.height * 0.15) // 15% do menor lado
    const barrelX = canvasSize.width - barrelSize - 20 // Canto direito, com margem
    const barrelY = canvasSize.height - barrelSize - 10 // Próximo ao chão, com margem
    const barrelWidth = barrelSize * 0.8
    const barrelHeight = barrelSize
    
    // Head appears from center top of barrel
    const barrelCenterX = barrelX + barrelWidth / 2
    const barrelTopY = barrelY
    
    // Animation phases:
    // 0.0 - 0.3: Appearing (rising from barrel)
    // 0.3 - 0.7: Looking around (head turns left and right)
    // 0.7 - 1.0: Disappearing (descending into barrel)
    
    let headY = barrelTopY
    let headRotation = 0
    let headVisible = true
    
    if (progress < 0.3) {
      // Phase 1: Appearing (0% to 30%) - head rises from barrel
      const phaseProgress = progress / 0.3
      const maxHeadHeight = 25 // Reduced height to keep close to barrel (immersion)
      headY = barrelTopY - (phaseProgress * maxHeadHeight) // Start at barrel top, rise up
      headRotation = 0
    } else if (progress < 0.7) {
      // Phase 2: Looking around and crying (30% to 70%)
      const phaseProgress = (progress - 0.3) / 0.4
      headY = barrelTopY - 25 // Stay at risen position (close to barrel)
      // Head turns left (-15deg) then right (+15deg) then back to center
      const cycle = Math.sin(phaseProgress * Math.PI * 2) // -1 to 1
      headRotation = cycle * 0.26 // ~15 degrees in radians
      
      // Spawn crying particles from eyes
      // Calculate eye positions considering head rotation
      if (Math.random() < 0.3) { // 30% chance per frame
        const eyeOffsetX = 6
        const eyeOffsetY = -2
        
        // Calculate rotated eye positions
        const cos = Math.cos(headRotation)
        const sin = Math.sin(headRotation)
        
        // Left eye (relative to head center)
        const leftEyeRelX = -eyeOffsetX
        const leftEyeRelY = eyeOffsetY
        const leftEyeX = barrelCenterX + (leftEyeRelX * cos - leftEyeRelY * sin)
        const leftEyeY = headY + (leftEyeRelX * sin + leftEyeRelY * cos)
        
        // Right eye (relative to head center)
        const rightEyeRelX = eyeOffsetX
        const rightEyeRelY = eyeOffsetY
        const rightEyeX = barrelCenterX + (rightEyeRelX * cos - rightEyeRelY * sin)
        const rightEyeY = headY + (rightEyeRelX * sin + rightEyeRelY * cos)
        
        // Left eye particle
        chavesCryingParticlesRef.current.push({
          x: leftEyeX,
          y: leftEyeY,
          vx: (Math.random() - 0.5) * 2,
          vy: 1 + Math.random() * 2,
          life: 0,
          maxLife: 30 + Math.random() * 20,
        })
        
        // Right eye particle
        chavesCryingParticlesRef.current.push({
          x: rightEyeX,
          y: rightEyeY,
          vx: (Math.random() - 0.5) * 2,
          vy: 1 + Math.random() * 2,
          life: 0,
          maxLife: 30 + Math.random() * 20,
        })
      }
      
      // Play crying sound once at the start of this phase
      if (phaseProgress < 0.05 && !effect.cryingSoundPlayed) {
        playChavesCryingSound()
        effect.cryingSoundPlayed = true
      }
    } else {
      // Phase 3: Disappearing (70% to 100%) - head descends into barrel
      const phaseProgress = (progress - 0.7) / 0.3
      const maxHeadHeight = 25
      headY = barrelTopY - (maxHeadHeight * (1 - phaseProgress)) // Descend from risen position to barrel top
      headRotation = 0
    }
    
    // Update and render crying particles
    chavesCryingParticlesRef.current = chavesCryingParticlesRef.current.filter(particle => {
      particle.life++
      particle.x += particle.vx
      particle.y += particle.vy
      particle.vy += 0.1 // Gravity
      
      return particle.life < particle.maxLife
    })
    
    // Draw crying particles (teardrops)
    ctx.fillStyle = '#87CEEB' // Sky blue (tear color)
    chavesCryingParticlesRef.current.forEach(particle => {
      const alpha = 1 - (particle.life / particle.maxLife)
      ctx.globalAlpha = alpha * 0.8
      ctx.beginPath()
      ctx.ellipse(particle.x, particle.y, 2, 4, 0, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.globalAlpha = 1
    
    // Don't draw barrel here - it's already drawn in drawFloor function
    // Just draw the character head appearing from the existing barrel
    
    // Draw character head (only if visible)
    if (headVisible) {
      ctx.save()
      ctx.translate(barrelCenterX, headY)
      ctx.rotate(headRotation)
      
      // Head (circle with freckles)
      ctx.fillStyle = '#FFDBAC' // Skin color
      ctx.beginPath()
      ctx.arc(0, 0, 18, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#8B4513'
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Freckles (pintas no rosto)
      ctx.fillStyle = '#8B4513'
      const freckles = [
        { x: -8, y: 2 }, { x: -5, y: 4 }, { x: -3, y: 1 },
        { x: 3, y: 2 }, { x: 6, y: 4 }, { x: 8, y: 1 },
        { x: -4, y: -1 }, { x: 4, y: -1 }
      ]
      freckles.forEach(freckle => {
        ctx.beginPath()
        ctx.arc(freckle.x, freckle.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      })
      
      // Hat (Chaves characteristic hat with checkered pattern and ear flaps)
      // Hat base (larger circle) - green checkered
      ctx.fillStyle = '#4A7C59' // Green base (like in the image)
      ctx.beginPath()
      ctx.arc(0, -12, 20, 0, Math.PI * 2)
      ctx.fill()
      
      // Checkered pattern (quadriculado verde e escuro) on hat
      const checkSize = 3.5 // Size of each square in the pattern
      ctx.fillStyle = '#2D4A35' // Dark green for checkered squares
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 6; col++) {
          // Alternate pattern (checkerboard)
          if ((row + col) % 2 === 0) {
            const x = -20 + (col * checkSize)
            const y = -24 + (row * checkSize)
            ctx.fillRect(x, y, checkSize, checkSize)
          }
        }
      }
      
      // Hat top (slightly smaller circle)
      ctx.fillStyle = '#4A7C59'
      ctx.beginPath()
      ctx.arc(0, -18, 15, 0, Math.PI * 2)
      ctx.fill()
      
      // Checkered pattern on hat top
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 5; col++) {
          if ((row + col) % 2 === 0) {
            const x = -15 + (col * checkSize)
            const y = -22 + (row * checkSize)
            ctx.fillRect(x, y, checkSize, checkSize)
          }
        }
      }
      
      // Ear flaps (orelhas do gorro) - pulled down like in the image
      ctx.fillStyle = '#4A7C59' // Same green as hat
      // Left ear flap
      ctx.beginPath()
      ctx.ellipse(-18, 2, 8, 12, -0.3, 0, Math.PI * 2)
      ctx.fill()
      // Right ear flap
      ctx.beginPath()
      ctx.ellipse(18, 2, 8, 12, 0.3, 0, Math.PI * 2)
      ctx.fill()
      
      // Checkered pattern on ear flaps
      ctx.fillStyle = '#2D4A35'
      // Left ear flap pattern
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 2; col++) {
          if ((row + col) % 2 === 0) {
            const x = -20 + (col * 3)
            const y = -2 + (row * 3)
            ctx.fillRect(x, y, 2.5, 2.5)
          }
        }
      }
      // Right ear flap pattern
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 2; col++) {
          if ((row + col) % 2 === 0) {
            const x = 18 + (col * 3)
            const y = -2 + (row * 3)
            ctx.fillRect(x, y, 2.5, 2.5)
          }
        }
      }
      
      // Hat rim (bottom edge)
      ctx.strokeStyle = '#2D4A35' // Dark green
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(0, -12, 20, 0, Math.PI * 2)
      ctx.stroke()
      
      // Eyes (simple dots)
      ctx.fillStyle = '#000000'
      ctx.beginPath()
      ctx.arc(-6, -2, 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(6, -2, 2, 0, Math.PI * 2)
      ctx.fill()
      
      // Mouth (simple smile)
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(0, 4, 6, 0, Math.PI)
      ctx.stroke()
      
      ctx.restore()
    }
    
    ctx.restore()
  }, [canvasSize.width, canvasSize.height, playChavesCryingSound])

  // Create procedural teleport sound
  const playTeleportSound = useCallback((isGlitch: boolean = false) => {
    if (typeof window === 'undefined' || (!window.AudioContext && !(window as any).webkitAudioContext)) return
    
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }
      
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }
      
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      if (isGlitch) {
        // Glitch sound: distorted + bitcrusher effect
        oscillator.type = 'sawtooth'
        oscillator.frequency.setValueAtTime(200, ctx.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.15)
        
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
        
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.15)
      } else {
        // Normal teleport sound: triangle wave, descending pitch
        oscillator.type = 'triangle'
        oscillator.frequency.setValueAtTime(400, ctx.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.18)
        
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18)
        
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.18)
      }
    } catch (error) {
      // Silently fail if audio context is not available
      console.warn('[Portal] Audio context not available:', error)
    }
  }, [])

  // Create portal particles
  const createPortalParticles = useCallback((x: number, y: number, type: 'orange' | 'blue' | 'warp' | 'glitch', count: number = 10) => {
    const particles: PortalParticle[] = []
    const isMobile = mobileMode === 'lite'
    const maxParticles = isFPSLevel2 ? 0 : (isFPSLevel1 ? Math.floor(count / 2) : count)
    
    if (isMobile || maxParticles === 0) return particles
    
    for (let i = 0; i < maxParticles; i++) {
      if (type === 'warp') {
        // Warp particles: curved, blue to white
        const angle = (Math.PI * 2 * i) / maxParticles
        const speed = 2 + Math.random() * 3
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 150 + Math.random() * 50,
          color: `hsl(${200 + Math.random() * 20}, 100%, ${60 + Math.random() * 40}%)`,
          size: 2 + Math.random() * 3,
        })
      } else if (type === 'glitch') {
        // Glitch particles: green, square, random offset
        particles.push({
          x: x + (Math.random() - 0.5) * 40,
          y: y + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 0,
          maxLife: 200 + Math.random() * 100,
          color: `hsl(${100 + Math.random() * 20}, 100%, ${40 + Math.random() * 30}%)`,
          size: 3 + Math.random() * 4,
          isGlitch: true,
        })
      } else if (type === 'orange') {
        // Orange portal (floor): particles going up
        particles.push({
          x: x + (Math.random() - 0.5) * portalOrangeRef.current.width,
          y: y + (Math.random() - 0.5) * portalOrangeRef.current.height,
          vx: (Math.random() - 0.5) * 1,
          vy: -2 - Math.random() * 2,
          life: 0,
          maxLife: 300 + Math.random() * 200,
          color: `hsla(${25 + Math.random() * 10}, 100%, ${45 + Math.random() * 15}%, ${0.6 + Math.random() * 0.4})`,
          size: 2 + Math.random() * 3,
        })
      } else if (type === 'blue') {
        // Blue portal (ceiling): particles going down (normal gravity)
        particles.push({
          x: x + (Math.random() - 0.5) * portalBlueRef.current.width,
          y: y + (Math.random() - 0.5) * portalBlueRef.current.height,
          vx: (Math.random() - 0.5) * 1,
          vy: 2 + Math.random() * 2,
          life: 0,
          maxLife: 300 + Math.random() * 200,
          color: `hsla(${195 + Math.random() * 10}, 100%, ${50 + Math.random() * 20}%, ${0.6 + Math.random() * 0.4})`,
          size: 2 + Math.random() * 3,
        })
      }
    }
    
    portalParticlesRef.current.push(...particles)
  }, [mobileMode, isFPSLevel1, isFPSLevel2])

  // Create temporal particles (when orb disappears)
  const createTemporalParticles = useCallback((x: number, y: number, count: number = 10) => {
    if (mobileMode === 'lite' || isFPSLevel2) return
    
    const particles: PortalParticle[] = []
    const maxCount = isFPSLevel1 ? Math.floor(count / 2) : count
    
    for (let i = 0; i < maxCount; i++) {
      const angle = (Math.PI * 2 * i) / maxCount + Math.random() * 0.5
      const speed = 1 + Math.random() * 2
      const curve = Math.sin(angle) * 0.5
      
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed + curve,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 200 + Math.random() * 100,
        color: `hsla(${25 + Math.random() * 10}, 100%, ${45 + Math.random() * 15}%, ${0.7 + Math.random() * 0.3})`,
        size: 2 + Math.random() * 3,
      })
    }
    
    portalParticlesRef.current.push(...particles)
  }, [mobileMode, isFPSLevel1, isFPSLevel2])

  // Update particles
  const updatePortalParticles = useCallback((deltaTime: number) => {
    if (mobileMode === 'lite' || isFPSLevel2) {
      portalParticlesRef.current = []
      return
    }
    
    portalParticlesRef.current = portalParticlesRef.current.filter((particle) => {
      particle.life += deltaTime
      particle.x += particle.vx
      particle.y += particle.vy
      
      // Apply curve for temporal particles
      if (particle.life < particle.maxLife * 0.5) {
        particle.vx += Math.sin(particle.life * 0.1) * 0.1
      }
      
      return particle.life < particle.maxLife
    })
  }, [mobileMode, isFPSLevel2])

  // Update warp effects
  const updateWarpEffects = useCallback((currentTime: number) => {
    if (mobileMode === 'lite' || isFPSLevel2) {
      warpEffectsRef.current = []
      return
    }
    
    warpEffectsRef.current = warpEffectsRef.current.filter((effect) => {
      return currentTime - effect.startTime < effect.duration
    })
  }, [mobileMode, isFPSLevel2])

  // Draw portal
  const drawPortal = useCallback((ctx: CanvasRenderingContext2D, portal: Portal, animationTime: number) => {
    if (mobileMode === 'lite') return
    
    ctx.save()
    
    const centerX = portal.x
    const centerY = portal.y
    const radiusX = portal.width / 2
    const radiusY = portal.height / 2
    
    // Glow effect
    const glowIntensity = isFPSLevel1 ? 0.5 : 1
    ctx.shadowBlur = 20 * glowIntensity
    ctx.shadowColor = portal.color
    
    // Draw portal oval
    ctx.beginPath()
    ctx.ellipse(centerX, centerY, radiusX, radiusY, portal.type === 'blue' ? Math.PI / 12 : 0, 0, Math.PI * 2)
    
    // Gradient fill
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(radiusX, radiusY))
    gradient.addColorStop(0, portal.color)
    gradient.addColorStop(0.5, portal.color + '80')
    gradient.addColorStop(1, portal.color + '00')
    ctx.fillStyle = gradient
    ctx.fill()
    
    // Border
    ctx.strokeStyle = portal.color
    ctx.lineWidth = 3
    ctx.stroke()
    
    // Inner glow ring
    ctx.beginPath()
    ctx.ellipse(centerX, centerY, radiusX * 0.7, radiusY * 0.7, portal.type === 'blue' ? Math.PI / 12 : 0, 0, Math.PI * 2)
    ctx.strokeStyle = portal.color + 'CC'
    ctx.lineWidth = 1
    ctx.stroke()
    
    ctx.restore()
  }, [mobileMode, isFPSLevel1])

  // Draw portal particles
  const drawPortalParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    if (mobileMode === 'lite' || isFPSLevel2) return
    
    ctx.save()
    
    portalParticlesRef.current.forEach((particle) => {
      const alpha = 1 - (particle.life / particle.maxLife)
      
      if (particle.isGlitch) {
        // Glitch particles: square
        ctx.fillStyle = particle.color
        ctx.globalAlpha = alpha * (0.5 + Math.random() * 0.5) // Irregular opacity
        ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size)
      } else {
        // Normal particles: circle
        ctx.fillStyle = particle.color
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      }
    })
    
    ctx.restore()
  }, [mobileMode, isFPSLevel2])

  // Draw warp effect
  const drawWarpEffect = useCallback((ctx: CanvasRenderingContext2D, effect: WarpEffect, currentTime: number) => {
    if (mobileMode === 'lite' || isFPSLevel2) return
    
    const elapsed = currentTime - effect.startTime
    const progress = Math.min(elapsed / effect.duration, 1)
    const alpha = 1 - progress
    
    ctx.save()
    ctx.globalAlpha = alpha
    
    // Draw 3-5 concentric arcs
    const arcCount = 3 + Math.floor(Math.random() * 3)
    for (let i = 0; i < arcCount; i++) {
      const radius = 20 + i * 15
      const arcProgress = progress * (1 + i * 0.2)
      
      ctx.beginPath()
      ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2 * arcProgress)
      
      // Color transition: blue to white
      const hue = 200 - (progress * 60)
      const lightness = 50 + (progress * 50)
      ctx.strokeStyle = `hsla(${hue}, 100%, ${lightness}%, ${alpha * 0.8})`
      ctx.lineWidth = 2
      ctx.stroke()
    }
    
    ctx.restore()
  }, [mobileMode, isFPSLevel2])

  // Draw glitch text
  const drawGlitchText = useCallback((ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    if (!glitchTextRef.current.visible || mobileMode === 'lite') return
    
    const elapsed = Date.now() - glitchTextRef.current.time
    if (elapsed > 2000) {
      glitchTextRef.current.visible = false
      return
    }
    
    ctx.save()
    ctx.globalAlpha = 0.7 + Math.sin(elapsed / 100) * 0.3 // Pulsing
    ctx.fillStyle = '#00ff00'
    ctx.font = 'bold 16px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('PORTAL MAL CONFIGURADO', canvasWidth / 2, canvasHeight * 0.1)
    ctx.restore()
  }, [mobileMode])

  // Check if point is inside portal
  const isPointInPortal = useCallback((x: number, y: number, portal: Portal): boolean => {
    const dx = (x - portal.x) / (portal.width / 2)
    const dy = (y - portal.y) / (portal.height / 2)
    const rotation = portal.type === 'blue' ? Math.PI / 12 : 0
    const cos = Math.cos(-rotation)
    const sin = Math.sin(-rotation)
    const rotatedX = dx * cos - dy * sin
    const rotatedY = dx * sin + dy * cos
    return (rotatedX * rotatedX + rotatedY * rotatedY) <= 1
  }, [])

  // Handle portal teleportation (bidirectional)
  const handlePortalTeleport = useCallback((orb: Orb, portalType: 'orange' | 'blue', isGlitch: boolean = false) => {
    if (!engineRef.current || !worldRef.current) return
    
    const orbBody = orb.body
    const now = Date.now()
    
    // Check cooldown
    const lastTeleport = orbTeleportCooldownRef.current.get(orb.id) || 0
    if (now - lastTeleport < 400) return // 400ms cooldown
    
    orbTeleportCooldownRef.current.set(orb.id, now)
    
    // Play sound
    playTeleportSound(isGlitch)
    
    if (isGlitch) {
      // Glitch mode: orb appears above canvas
      const glitchY = -150
      Matter.Body.setPosition(orbBody, { x: portalOrangeRef.current.x, y: glitchY })
      Matter.Body.setVelocity(orbBody, { x: 0, y: 0 })
      
      // Create glitch particles
      createPortalParticles(portalOrangeRef.current.x, portalOrangeRef.current.y, 'glitch', 8)
      
      // Show glitch text
      glitchTextRef.current.visible = true
      glitchTextRef.current.time = now
    } else {
      // Bidirectional teleport
      const sourcePortal = portalType === 'orange' ? portalOrangeRef.current : portalBlueRef.current
      const targetPortal = portalType === 'orange' ? portalBlueRef.current : portalOrangeRef.current
      
      // Create temporal particles at source portal
      const sourcePos = getBodyPosition(orbBody)
      createTemporalParticles(sourcePos.x, sourcePos.y, 8 + Math.floor(Math.random() * 5))
      
      // Move orb to target portal
      Matter.Body.setPosition(orbBody, { x: targetPortal.x, y: targetPortal.y })
      
      // Maintain velocity but adjust direction based on portal
      const currentVel = orbBody.velocity
      if (portalType === 'orange') {
        // Entered orange (floor) → exit blue (ceiling): boost upward
        Matter.Body.setVelocity(orbBody, { x: currentVel.x, y: Math.min(currentVel.y, -3) })
      } else {
        // Entered blue (ceiling) → exit orange (floor): boost downward
        Matter.Body.setVelocity(orbBody, { x: currentVel.x, y: Math.max(currentVel.y, 3) })
      }
      
      // Create warp effect at target portal
      warpEffectsRef.current.push({
        x: targetPortal.x,
        y: targetPortal.y,
        startTime: now,
        duration: 120,
      })
      
      // Create warp particles
      createPortalParticles(targetPortal.x, targetPortal.y, 'warp', 3 + Math.floor(Math.random() * 3))
      
      // Trigger hoop bend animation (only if exiting to floor)
      if (portalType === 'blue') {
        hoopBendProgressRef.current = 1
        const startTime = now
        const duration = 180
        
        const animateHoop = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          // Cubic bezier easing: (0.22, 1.5, 0.36, 1)
          const t = progress
          const bezier = (t: number) => {
            const t2 = t * t
            const t3 = t2 * t
            return 3 * t2 - 2 * t3 + (1.5 - 0.22) * (3 * t2 - 2 * t3) * (1 - t)
          }
          const eased = bezier(t)
          
          // Scale: 0.7 → 1.1 (overshoot) → 1.0
          if (progress < 0.6) {
            hoopBendProgressRef.current = 0.7 + (eased * 0.4) // 0.7 → 1.1
          } else {
            const overshootProgress = (progress - 0.6) / 0.4
            hoopBendProgressRef.current = 1.1 - (overshootProgress * 0.1) // 1.1 → 1.0
          }
          
          if (progress < 1) {
            requestAnimationFrame(animateHoop)
          } else {
            hoopBendProgressRef.current = 0
          }
        }
        animateHoop()
      }
    }
  }, [playTeleportSound, createPortalParticles, createTemporalParticles, getBodyPosition])

  // Draw theme-specific decorative objects
  const drawThemeDecorativeObject = useCallback((
    ctx: CanvasRenderingContext2D,
    themeId: ThemeId,
    colors: ReturnType<typeof getThemeColors>,
    canvasWidth: number,
    canvasHeight: number,
    animationTime: number
  ) => {
    if (!colors) return

    // Performance optimization: Check mobile mode and FPS Guardian
    const { mode: mobileMode, isMobile } = useMobileModeStore.getState()
    if (mobileMode === 'lite') return // Skip completely in lite mode

    // FPS Guardian Level 2: Skip decorative objects
    if (isFPSLevel2) return

    ctx.save()

    // Calculate object size (5-15% of canvas width)
    const objectSize = canvasWidth * 0.10 // 10% of canvas width

    // Determine rendering mode: simplified for mobile-full, full for desktop
    const isSimplifiedMode = mobileMode === 'full' && isMobile
    const isFullMode = mobileMode === 'full' && !isMobile

    // Animation phase for pulsing/rotating effects
    // FPS Guardian Level 1: Reduce animation speed by 50%
    const animationSpeed = isFPSLevel1 ? 0.001 : 0.002
    const pulsePhase = Math.sin(animationTime * animationSpeed) * 0.5 + 0.5 // 0 to 1
    const rotationSpeed = isFPSLevel1 ? 0.0005 : 0.001
    const rotationAngle = (animationTime * rotationSpeed) % (Math.PI * 2) // Continuous rotation

    switch (themeId) {
      case 'cyber': {
        // 3️⃣ Matrix – Green Rain: Coluna de Código Caindo
        // Forma: bloco vertical 3px + caracteres individuais
        // Cores: verde neon, preto puro
        // Animação: queda contínua estilo digital rain
        // Posição: lateral direita
        const x = canvasWidth * 0.95 // Right side
        const y = canvasHeight * 0.2 // Top area
        const width = 3
        const height = canvasHeight * 0.3

        ctx.fillStyle = '#00ff41' // Matrix green neon
        ctx.globalAlpha = 0.6 + pulsePhase * 0.4

        // Draw vertical column (3px block)
        ctx.fillRect(x, y, width, height)

        // Draw falling characters (digital rain effect)
        // Simplified mode: fewer characters, desktop: full animation
        if (!isSimplifiedMode) {
          ctx.fillStyle = '#00ff41' // Green neon
          ctx.globalAlpha = 0.8
          const charCount = isFPSLevel1 ? 4 : 8 // Reduce in FPS Level 1
          const fallSpeed = isFPSLevel1 ? 0.03 : 0.05
          for (let i = 0; i < charCount; i++) {
            const charY = y + ((animationTime * fallSpeed + i * 20) % height)
            ctx.fillRect(x - 2, charY, 7, 2)
          }
        }
        break
      }

      case 'neon': {
        // 5️⃣ Tron Grid: Torre de Energia do Grid
        // Forma: cilindro azul neon com linhas vetoriais
        // Cores: azul-ciano, preto neon
        // Animação: pulsos verticais subindo
        // Posição: lateral esquerda
        const x = canvasWidth * 0.05 // Left side
        const y = canvasHeight * 0.3
        const radius = objectSize * 0.3
        const height = canvasHeight * 0.4

        // Draw cylinder base with vector lines
        ctx.strokeStyle = '#00ffff' // Tron cyan-blue
        ctx.lineWidth = 3
        ctx.shadowBlur = 12
        ctx.shadowColor = '#00ffff'
        ctx.globalAlpha = 0.7 + pulsePhase * 0.3

        // Vertical lines (vector style)
        for (let i = 0; i < 4; i++) {
          const lineX = x + (i * radius * 0.6)
          ctx.beginPath()
          ctx.moveTo(lineX, y)
          ctx.lineTo(lineX, y + height)
          ctx.stroke()
        }

        // Pulse effect (vertical energy pulse going up) - skip in simplified mode
        if (!isSimplifiedMode) {
          const pulseY = y + (pulsePhase * height)
          ctx.fillStyle = '#00ffff'
          ctx.globalAlpha = isFPSLevel1 ? 0.2 : 0.4
          ctx.fillRect(x - radius, pulseY - 5, radius * 2, 10)
        }
        break
      }

      case 'pomemin': {
        // 1️⃣ Zelda – Sheikah Slate: Pedra Sheikah Minimalista
        // Forma: retângulo arredondado + olho Sheikah geométrico
        // Cores: azul Sheikah, cinza pedra
        // Animação: brilho pulsante no símbolo
        // Posição: canto superior esquerdo
        const x = canvasWidth * 0.05 // Top left
        const y = canvasHeight * 0.1
        const width = objectSize * 0.8
        const height = objectSize * 0.6

        // Draw rounded rectangle (slate) - cinza pedra
        ctx.fillStyle = '#6b7280' // Gray stone color
        ctx.globalAlpha = 0.8
        const cornerRadius = 8
        ctx.beginPath()
        ctx.roundRect(x, y, width, height, cornerRadius)
        ctx.fill()

        // Draw geometric eye symbol (Sheikah eye) - azul Sheikah
        ctx.strokeStyle = '#4a9eff' // Sheikah blue
        ctx.lineWidth = 3
        // FPS Guardian Level 1: Reduce glow intensity
        const baseGlow = isFPSLevel1 ? 4 : 8
        ctx.shadowBlur = baseGlow + (isSimplifiedMode ? 0 : pulsePhase * baseGlow)
        ctx.shadowColor = '#4a9eff' // Sheikah blue glow
        ctx.globalAlpha = 0.9

        const centerX = x + width / 2
        const centerY = y + height / 2
        const eyeSize = Math.min(width, height) * 0.4

        // Draw eye shape (simplified triangle with circle)
        ctx.beginPath()
        ctx.arc(centerX, centerY, eyeSize * 0.3, 0, Math.PI * 2)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(centerX, centerY - eyeSize)
        ctx.lineTo(centerX - eyeSize * 0.6, centerY + eyeSize * 0.3)
        ctx.lineTo(centerX + eyeSize * 0.6, centerY + eyeSize * 0.3)
        ctx.closePath()
        ctx.stroke()
        break
      }

      case 'terminal': {
        // 6️⃣ Portal – Aperture Science: Mini Portal Generator
        // Forma: dois arcos semicirculares (azul e laranja)
        // Cores: #42C6FF, #FF7A00
        // Animação: rotação alternada
        // Posição: canto inferior direito
        const x = canvasWidth * 0.95 // Bottom right
        const y = canvasHeight * 0.8
        const radius = objectSize * 0.4
        const centerX = x
        const centerY = y

        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(rotationAngle)
        ctx.translate(-centerX, -centerY)

        // Blue arc (semicircle)
        ctx.strokeStyle = '#42C6FF' // Portal blue (exact color from raw idea)
        ctx.lineWidth = 4
        ctx.shadowBlur = 10
        ctx.shadowColor = '#42C6FF'
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI)
        ctx.stroke()

        // Orange arc (semicircle, rotated 180 degrees)
        ctx.strokeStyle = '#FF7A00' // Portal orange (exact color from raw idea)
        ctx.shadowColor = '#FF7A00'
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, Math.PI, Math.PI * 2)
        ctx.stroke()

        ctx.restore()
        break
      }

      case 'dracula': {
        // 4️⃣ Star Wars – Dark Side: Núcleo Sith Instável
        // Forma: esfera negra com rachaduras vermelhas
        // Cores: preto absoluto, vermelho queimado
        // Animação: rachaduras pulsando como sabre instável
        // Posição: canto superior direito
        // Note: There's also a castle in drawFloor (kept as existing), this is the new object from raw idea
        const x = canvasWidth * 0.95 // Top right
        const y = canvasHeight * 0.1
        const radius = objectSize * 0.3

        // Draw black sphere (preto absoluto)
        ctx.fillStyle = '#000000' // Absolute black
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()

        // Draw red cracks (vermelho queimado, pulsing like unstable saber)
        ctx.strokeStyle = '#cc0000' // Burnt red
        ctx.lineWidth = 2
        ctx.shadowBlur = 6 + (isSimplifiedMode ? 0 : pulsePhase * 6)
        ctx.shadowColor = '#cc0000' // Burnt red glow
        ctx.globalAlpha = 0.7 + (isSimplifiedMode ? 0 : pulsePhase * 0.3)

        // Draw crack lines (pulsing)
        const crackCount = isFPSLevel1 ? 3 : 4
        for (let i = 0; i < crackCount; i++) {
          const angle = (i * Math.PI * 2) / 4
          const startX = x + Math.cos(angle) * radius * 0.3
          const startY = y + Math.sin(angle) * radius * 0.3
          const endX = x + Math.cos(angle) * radius * 0.9
          const endY = y + Math.sin(angle) * radius * 0.9

          ctx.beginPath()
          ctx.moveTo(startX, startY)
          ctx.lineTo(endX, endY)
          ctx.stroke()
        }
        break
      }

      case 'pixel': {
        // 2️⃣ Minecraft – Redstone: Totem de Redstone Ativado
        // Forma: blocos quadrados empilhados + linha vermelha central
        // Cores: marrom terra, vermelho pulsante
        // Animação: pulsar ON/OFF como circuito powered
        // Posição: canto inferior esquerdo
        const x = canvasWidth * 0.05 // Bottom left
        const y = canvasHeight * 0.85
        const blockSize = objectSize * 0.25
        const blockCount = 4

        // Draw stacked blocks (pixelated style) - marrom terra
        for (let i = 0; i < blockCount; i++) {
          const blockY = y - (i * blockSize)
          // Brown earth color
          ctx.fillStyle = '#8B4513' // Brown earth
          ctx.fillRect(x, blockY, blockSize, blockSize)
          
          // Block border
          ctx.strokeStyle = '#654321' // Dark brown
          ctx.lineWidth = 1
          ctx.strokeRect(x, blockY, blockSize, blockSize)
        }

        // Draw central red line (vermelho pulsante, ON/OFF like powered circuit)
        const centerX = x + blockSize / 2
        const lineY = y - (blockCount * blockSize)
        
        // Pulsing effect: ON/OFF based on pulsePhase
        const isPowered = pulsePhase > 0.5
        if (isPowered || !isSimplifiedMode) {
          ctx.strokeStyle = '#ff0000' // Red pulsating
          ctx.lineWidth = 3
          ctx.shadowBlur = isPowered ? 8 : 4
          ctx.shadowColor = '#ff0000'
          ctx.globalAlpha = isPowered ? 0.9 : 0.5
          
          ctx.beginPath()
          ctx.moveTo(centerX, y)
          ctx.lineTo(centerX, lineY)
          ctx.stroke()
        }
        break
      }

      case 'blueprint': {
        // 7️⃣ Avengers – Stark Tech: Arc Reactor Pad
        // Forma: círculo triplo com anéis concêntricos
        // Cores: arc blue, branco holográfico
        // Animação: rotação suave dos anéis
        // Posição: canto da quadra, centralizado lateralmente
        const x = canvasWidth * 0.5 // Center horizontally
        const y = canvasHeight * 0.9 // Bottom center

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(rotationAngle)
        ctx.translate(-x, -y)

        // Draw concentric rings (triple circle)
        const ringCount = 3
        for (let i = 0; i < ringCount; i++) {
          const ringRadius = objectSize * 0.2 + (i * objectSize * 0.1)
          ctx.strokeStyle = '#00a8ff' // Arc blue
          ctx.lineWidth = 2
          ctx.shadowBlur = 8
          ctx.shadowColor = '#00a8ff' // Arc blue glow
          ctx.globalAlpha = 0.8 - (i * 0.2)

          ctx.beginPath()
          ctx.arc(x, y, ringRadius, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Center core (holographic white)
        ctx.fillStyle = '#ffffff' // White holographic
        ctx.globalAlpha = 0.9
        ctx.shadowBlur = 10
        ctx.shadowColor = '#00a8ff' // Blue glow on white
        ctx.beginPath()
        ctx.arc(x, y, objectSize * 0.15, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
        break
      }

      case 'indiana-jones': {
        // Indiana Jones theme: Multiple decorative objects (5 total)
        // Render all objects in layer order: background → midground
        
        // 1. indianaPillars (background layer) - Two vertical pillars with ancient circuits
        const pillarX1 = canvasWidth * 0.15
        const pillarX2 = canvasWidth * 0.85
        const pillarY = canvasHeight * 0.3
        const pillarWidth = objectSize * 0.15
        const pillarHeight = canvasHeight * 0.4
        
        // Get bgSoft from CSS variables
        const root = typeof window !== 'undefined' ? document.documentElement : null
        const bgSoft = root ? getComputedStyle(root).getPropertyValue('--color-bg-secondary').trim() || '#8A6B45' : '#8A6B45'
        
        // Left pillar
        ctx.fillStyle = bgSoft
        ctx.fillRect(pillarX1, pillarY, pillarWidth, pillarHeight)
        // Cracks with ancient circuits (blue glowing)
        ctx.strokeStyle = '#4AFF8A' // Snake green (circuit color)
        ctx.lineWidth = 2
        ctx.shadowBlur = 4
        ctx.shadowColor = '#4AFF8A'
        ctx.globalAlpha = 0.6
        for (let i = 0; i < 3; i++) {
          const crackY = pillarY + (i * pillarHeight / 3)
          ctx.beginPath()
          ctx.moveTo(pillarX1, crackY)
          ctx.lineTo(pillarX1 + pillarWidth, crackY + 10)
          ctx.stroke()
        }
        
        // Right pillar
        ctx.fillStyle = bgSoft
        ctx.fillRect(pillarX2, pillarY, pillarWidth, pillarHeight)
        // Cracks with ancient circuits
        for (let i = 0; i < 3; i++) {
          const crackY = pillarY + (i * pillarHeight / 3)
          ctx.beginPath()
          ctx.moveTo(pillarX2, crackY)
          ctx.lineTo(pillarX2 + pillarWidth, crackY + 10)
          ctx.stroke()
        }
        ctx.globalAlpha = 1
        ctx.shadowBlur = 0
        
        // 2. indianaBoulder (midground layer) - Large rock with "DEPLOY" text
        const boulderX = canvasWidth * 0.1
        const boulderY = canvasHeight * 0.75
        const boulderSize = objectSize * 0.8
        
        // Apply temple shake offset
        let shakeOffset = 0
        if (templeShakeRef.current.active) {
          const elapsed = Date.now() - templeShakeRef.current.startTime
          const progress = Math.min(elapsed / templeShakeRef.current.duration, 1)
          const intensity = templeShakeRef.current.intensity
          shakeOffset = (Math.random() - 0.5) * intensity * (1 - progress) // Fade out
        }
        
        ctx.save()
        ctx.translate(shakeOffset, 0) // Apply shake when templeShake is active
        
        // Boulder shape (irregular circle)
        ctx.fillStyle = bgSoft
        ctx.beginPath()
        ctx.arc(boulderX, boulderY, boulderSize * 0.5, 0, Math.PI * 2)
        ctx.fill()
        // Add some irregularity
        ctx.beginPath()
        ctx.arc(boulderX + boulderSize * 0.2, boulderY - boulderSize * 0.1, boulderSize * 0.3, 0, Math.PI * 2)
        ctx.fill()
        
        // "DEPLOY" text
        ctx.fillStyle = colors.primary || '#DAB466'
        ctx.font = `bold ${boulderSize * 0.2}px sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('DEPLOY', boulderX, boulderY)
        
        ctx.restore()
        
        // 3. indianaGitTotem (midground layer) - Pillar with T-shape, light glow
        const totemX = canvasWidth * 0.5
        const totemY = canvasHeight * 0.7
        const totemWidth = objectSize * 0.2
        const totemHeight = objectSize * 0.6
        
        // Pillar base
        ctx.fillStyle = bgSoft
        ctx.fillRect(totemX - totemWidth / 2, totemY, totemWidth, totemHeight)
        
        // T-shape top (Git logo inspired)
        ctx.fillRect(totemX - totemWidth, totemY, totemWidth * 3, totemWidth)
        
        // Get glow color from CSS variables
        const glowColor = root ? getComputedStyle(root).getPropertyValue('--color-glow').trim() || '#FFB95A' : '#FFB95A'
        
        // Light glow
        ctx.strokeStyle = glowColor
        ctx.lineWidth = 2
        ctx.shadowBlur = 8
        ctx.shadowColor = glowColor
        ctx.globalAlpha = 0.5 + pulsePhase * 0.3
        ctx.strokeRect(totemX - totemWidth / 2, totemY, totemWidth, totemHeight)
        ctx.strokeRect(totemX - totemWidth, totemY, totemWidth * 3, totemWidth)
        ctx.globalAlpha = 1
        ctx.shadowBlur = 0
        
        // 4. indianaChest (midground layer) - Semi-open chest with red pulsing light
        const chestX = canvasWidth * 0.9
        const chestY = canvasHeight * 0.8
        const chestWidth = objectSize * 0.6
        const chestHeight = objectSize * 0.4
        
        // Get border color from CSS variables
        const borderColor = root ? getComputedStyle(root).getPropertyValue('--color-border').trim() || '#4A3924' : '#4A3924'
        
        // Chest base
        ctx.fillStyle = borderColor
        ctx.fillRect(chestX - chestWidth / 2, chestY, chestWidth, chestHeight)
        
        // Chest lid (semi-open)
        ctx.fillRect(chestX - chestWidth / 2, chestY - chestHeight * 0.3, chestWidth, chestHeight * 0.2)
        
        // Red pulsing light inside
        const lightIntensity = pulsePhase
        ctx.fillStyle = `rgba(255, 0, 0, ${0.3 + lightIntensity * 0.4})`
        ctx.fillRect(chestX - chestWidth / 4, chestY + chestHeight * 0.2, chestWidth / 2, chestHeight * 0.4)
        
        // 5. indianaSnakes (midground layer) - Pixel snake sprites, 4-frame animation, disabled in mobile-lite
        const { mode: currentMobileMode } = useMobileModeStore.getState()
        if (currentMobileMode !== 'lite') {
          const snakeX = canvasWidth * 0.3
          const snakeY = canvasHeight * 0.6
          const snakeSize = objectSize * 0.3
          
          // 4-frame animation (slow loop)
          const frameDuration = 2000 // 2 seconds per frame
          const frameIndex = Math.floor((animationTime % (frameDuration * 4)) / frameDuration)
          
          ctx.globalAlpha = 0.4 // Low opacity for subtle effect
          ctx.fillStyle = colors.accent || '#4AFF8A'
          
          // Draw pixel snake (simplified, 4-frame animation)
          const pixelSize = snakeSize / 4
          for (let i = 0; i < 4; i++) {
            const offsetX = (frameIndex * pixelSize * 0.2) % (pixelSize * 2)
            const x = snakeX + (i * pixelSize) + offsetX
            const y = snakeY + (i % 2) * pixelSize
            ctx.fillRect(x, y, pixelSize, pixelSize)
          }
          ctx.globalAlpha = 1
        }
        
        break
      }

      case 'star-wars': {
        // Star Wars theme: Multiple decorative objects (6 total)
        // All objects are abstract and geometric (not direct IP copies)
        // Get additional colors from CSS variables
        const root = typeof window !== 'undefined' ? document.documentElement : null
        const bgSoft = root ? getComputedStyle(root).getPropertyValue('--color-bg-secondary').trim() || '#0C0F14' : '#0C0F14'
        const primary = colors.primary || '#2F9BFF'
        const accent = colors.accent || '#FF2B2B'
        const glow = colors.glow || '#59E0FF'
        const highlight = root ? getComputedStyle(root).getPropertyValue('--color-highlight').trim() || '#FFC23D' : '#FFC23D'
        const text = colors.text || '#D8F2FF'
        
        // 1. Galactic Cockpit HUD (foreground layer) - Lines and markers simulating ship panel
        ctx.strokeStyle = primary
        ctx.fillStyle = primary
        ctx.lineWidth = 1
        ctx.globalAlpha = 0.3
        ctx.shadowBlur = 4
        ctx.shadowColor = primary
        
        // HUD lines (top area)
        const hudY = canvasHeight * 0.1
        for (let i = 0; i < 5; i++) {
          const x = canvasWidth * (0.1 + i * 0.2)
          ctx.beginPath()
          ctx.moveTo(x, hudY)
          ctx.lineTo(x + 20, hudY + 10)
          ctx.stroke()
        }
        
        // HUD markers (targeting circles)
        for (let i = 0; i < 3; i++) {
          const x = canvasWidth * (0.2 + i * 0.3)
          ctx.beginPath()
          ctx.arc(x, hudY + 15, 8, 0, Math.PI * 2)
          ctx.stroke()
        }
        
        // Hex numbers (blinking)
        if (!isSimplifiedMode) {
          ctx.fillStyle = primary
          ctx.font = '10px monospace'
          ctx.textAlign = 'left'
          ctx.globalAlpha = 0.5 + pulsePhase * 0.3
          ctx.fillText('0x' + Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase(), canvasWidth * 0.15, hudY + 30)
          ctx.globalAlpha = 0.3
        }
        ctx.globalAlpha = 1
        ctx.shadowBlur = 0
        
        // 2. Mini Starfighter (midground layer) - Geometric triangles abstract (not X-Wing/TIE)
        const starfighterX = canvasWidth * 0.1
        const starfighterY = canvasHeight * 0.15
        const starfighterSize = objectSize * 0.4
        
        // Subtle movement (2px up/down) if not mobile-lite
        let starfighterOffsetY = 0
        const { mode: currentMobileMode } = useMobileModeStore.getState()
        if (!isSimplifiedMode && currentMobileMode !== 'lite') {
          starfighterOffsetY = Math.sin(animationTime * 0.002) * 2
        }
        
        ctx.fillStyle = primary
        ctx.globalAlpha = 0.6
        // Geometric triangle shape (abstract, not direct copy)
        ctx.beginPath()
        ctx.moveTo(starfighterX, starfighterY + starfighterOffsetY)
        ctx.lineTo(starfighterX - starfighterSize * 0.3, starfighterY + starfighterOffsetY + starfighterSize * 0.5)
        ctx.lineTo(starfighterX + starfighterSize * 0.3, starfighterY + starfighterOffsetY + starfighterSize * 0.5)
        ctx.closePath()
        ctx.fill()
        ctx.globalAlpha = 1
        
        // 3. Battle Cruiser Silhouette (background layer) - Elongated rectangles + minimal lights
        const cruiserX = canvasWidth * 0.85
        const cruiserY = canvasHeight * 0.2
        const cruiserWidth = objectSize * 1.2
        const cruiserHeight = objectSize * 0.3
        
        ctx.fillStyle = bgSoft
        ctx.globalAlpha = 0.15 // Low opacity, just presence
        ctx.fillRect(cruiserX - cruiserWidth / 2, cruiserY, cruiserWidth, cruiserHeight)
        
        // Minimal red lights
        ctx.fillStyle = accent
        ctx.globalAlpha = 0.3
        for (let i = 0; i < 3; i++) {
          const lightX = cruiserX - cruiserWidth / 2 + (i + 1) * (cruiserWidth / 4)
          ctx.beginPath()
          ctx.arc(lightX, cruiserY + cruiserHeight / 2, 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
        
        // 4. Crossed Energy Blades (foreground layer) - Two light beams crossing (blue + red), abstract "energy" not sabers
        const bladeCenterX = canvasWidth * 0.5
        const bladeCenterY = canvasHeight * 0.15
        const bladeLength = objectSize * 0.8
        const bladeWidth = 3
        
        // Light vibration effect if not mobile-lite
        let bladeVibration = 0
        if (!isSimplifiedMode && currentMobileMode !== 'lite') {
          bladeVibration = (Math.random() - 0.5) * 1
        }
        
        // Blue energy blade (diagonal from top-left to bottom-right)
        ctx.strokeStyle = primary
        ctx.lineWidth = bladeWidth
        ctx.shadowBlur = 8
        ctx.shadowColor = primary
        ctx.globalAlpha = 0.7
        ctx.beginPath()
        ctx.moveTo(bladeCenterX - bladeLength / 2 + bladeVibration, bladeCenterY - bladeLength / 2 + bladeVibration)
        ctx.lineTo(bladeCenterX + bladeLength / 2 + bladeVibration, bladeCenterY + bladeLength / 2 + bladeVibration)
        ctx.stroke()
        
        // Red energy blade (diagonal from top-right to bottom-left)
        ctx.strokeStyle = accent
        ctx.shadowColor = accent
        ctx.beginPath()
        ctx.moveTo(bladeCenterX + bladeLength / 2 - bladeVibration, bladeCenterY - bladeLength / 2 - bladeVibration)
        ctx.lineTo(bladeCenterX - bladeLength / 2 - bladeVibration, bladeCenterY + bladeLength / 2 - bladeVibration)
        ctx.stroke()
        ctx.globalAlpha = 1
        ctx.shadowBlur = 0
        
        // 5. Rebel Console Abstract (midground layer) - Sci-fi panels with squares and bars
        const consoleX = canvasWidth * 0.9
        const consoleY = canvasHeight * 0.85
        const consoleWidth = objectSize * 0.6
        const consoleHeight = objectSize * 0.4
        
        // Console base
        ctx.fillStyle = bgSoft
        ctx.globalAlpha = 0.7
        ctx.fillRect(consoleX - consoleWidth / 2, consoleY, consoleWidth, consoleHeight)
        
        // Animated bars (holographic screen)
        if (!isSimplifiedMode) {
          ctx.fillStyle = glow
          ctx.globalAlpha = 0.5 + pulsePhase * 0.3
          for (let i = 0; i < 4; i++) {
            const barHeight = (0.3 + Math.random() * 0.4) * consoleHeight
            const barX = consoleX - consoleWidth / 2 + (i + 1) * (consoleWidth / 5)
            ctx.fillRect(barX, consoleY + consoleHeight - barHeight, 3, barHeight)
          }
        }
        ctx.globalAlpha = 1
        
        // 6. Animated Starfield (background layer) - Stars with 2 speeds (parallax), random spawn, disabled in mobile-lite
        if (currentMobileMode !== 'lite') {
          // Initialize starfield if empty
          if (starfieldRef.current.length === 0) {
            // Spawn initial stars
            const starCount = isFPSLevel1 ? 20 : (isSimplifiedMode ? 30 : 50)
            for (let i = 0; i < starCount; i++) {
              starfieldRef.current.push({
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,
                speed: Math.random() < 0.5 ? 0.5 : 1.5, // Two speeds for parallax
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.5 + 0.3,
              })
            }
          }
          
          // Update and draw stars (simplified - no flash effect to avoid performance issues)
          ctx.fillStyle = text
          const stars = starfieldRef.current
          for (let i = stars.length - 1; i >= 0; i--) {
            const star = stars[i]
            star.y += star.speed
            
            // Remove stars that go off screen
            if (star.y > canvasHeight) {
              star.y = 0
              star.x = Math.random() * canvasWidth
            }
            
            // Simple star drawing (no flash, no shadow)
            ctx.globalAlpha = star.opacity
            ctx.beginPath()
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
            ctx.fill()
          }
          ctx.globalAlpha = 1
        }
        
        break
      }

      // Note: Chaves barrel is already drawn in drawFloor function, so we skip it here
      case 'chaves':
      case 'analista-jr':
      case 'analista-sr':
      case 'lofi-code':
      case 'bruno-csharp':
        // These themes don't have decorative objects in the original raw idea (7 objects only)
        // or already have objects drawn elsewhere (chaves barrel in drawFloor)
        break

      default:
        // No decorative object for this theme
        break
    }

    ctx.restore()
  }, [canvasSize.width, canvasSize.height, isFPSLevel1, isFPSLevel2])

  // Render static orb (for mobile lite mode - no physics)
  const renderStaticOrb = useCallback((ctx: CanvasRenderingContext2D, orb: StaticOrb, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return

    const pos = { x: orb.x, y: orb.y }
    const isMobile = isMobileDevice()
    const radius = isMobile ? ORB_RADIUS_MOBILE : ORB_RADIUS_DESKTOP

    ctx.save()

    // Theme-specific orb styling
    let borderColor = colors.accent
    let borderWidth = 2
    let glowIntensity = 4

    if (themeId === "cyber") {
      borderColor = "#00ff00" // Green for cyber
      glowIntensity = 6
    } else if (themeId === "pixel") {
      borderColor = colors.primary
      borderWidth = 3
      glowIntensity = 2
    } else if (themeId === "neon") {
      borderColor = colors.accent
      glowIntensity = 8
    } else if (themeId === "terminal") {
      borderColor = colors.text
      borderWidth = 1
      glowIntensity = 2
    } else if (themeId === "chaves") {
      borderColor = colors.accent // Vermelho para Chaves
      borderWidth = 3
      glowIntensity = 5
    } else if (themeId === "pomemin") {
      borderColor = colors.accent // Vermelho para Pomemin
      borderWidth = 3
      glowIntensity = 6
    } else if (themeId === "dracula") {
      borderColor = colors.accent // Roxo para Dracula
      borderWidth = 3
      glowIntensity = 7
    }

    // PT: Pomemin theme: desenha orbs com orelhinhas e rabinho (estilo Pokémon) | EN: Pomemin theme: draws orbs with ears and tail (Pokémon style) | ES: Tema Pomemin: dibuja orbs con orejitas y colita (estilo Pokémon) | FR: Thème Pomemin: dessine orbs avec oreilles et queue (style Pokémon) | DE: Pomemin-Theme: zeichnet Orbs mit Ohren und Schwanz (Pokémon-Stil)
    if (themeId === "pomemin") {
      // Draw orb with ears and tail (Pokémon style)
      const earSize = radius * 0.4 // Tamanho das orelhinhas (40% do raio)
      const earOffset = radius * 0.3 // Distância das orelhinhas do centro
      const tailSize = radius * 0.5 // Tamanho do rabinho (50% do raio)
      const tailOffset = radius * 0.4 // Distância do rabinho do centro
      
      ctx.beginPath()
      
      // Draw main circle
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
      
      // Draw left ear (triângulo)
      ctx.moveTo(pos.x - earOffset, pos.y - radius)
      ctx.lineTo(pos.x - earOffset - earSize, pos.y - radius - earSize * 1.2)
      ctx.lineTo(pos.x - earOffset + earSize * 0.3, pos.y - radius - earSize * 0.5)
      ctx.closePath()
      
      // Draw right ear (triângulo)
      ctx.moveTo(pos.x + earOffset, pos.y - radius)
      ctx.lineTo(pos.x + earOffset + earSize, pos.y - radius - earSize * 1.2)
      ctx.lineTo(pos.x + earOffset - earSize * 0.3, pos.y - radius - earSize * 0.5)
      ctx.closePath()
      
      // Draw tail/rabinho (triângulo na parte inferior)
      ctx.moveTo(pos.x, pos.y + radius)
      ctx.lineTo(pos.x - tailOffset, pos.y + radius + tailSize * 0.8)
      ctx.lineTo(pos.x + tailOffset, pos.y + radius + tailSize * 0.8)
      ctx.closePath()
      
      // Draw avatar if loaded (clipped to circle) - verificar se imageLoaded está true E image existe
      if (orb.imageLoaded && orb.image && orb.image.complete && orb.image.naturalWidth > 0) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, radius - borderWidth, 0, Math.PI * 2)
        ctx.clip()
        ctx.drawImage(orb.image, pos.x - radius + borderWidth, pos.y - radius + borderWidth, (radius - borderWidth) * 2, (radius - borderWidth) * 2)
        ctx.restore()
      } else {
        // Fallback: draw colored circle
        ctx.fillStyle = colors.primary
        ctx.fill()
      }
      
      // Fill ears and tail with same color
      ctx.fillStyle = colors.primary
      ctx.fill()
      
      // Draw border with glow (circle + ears + tail)
      ctx.strokeStyle = borderColor
      ctx.lineWidth = borderWidth
      ctx.shadowBlur = 14
      ctx.shadowColor = colors.accent
      
      // Redraw path for border
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
      ctx.moveTo(pos.x - earOffset, pos.y - radius)
      ctx.lineTo(pos.x - earOffset - earSize, pos.y - radius - earSize * 1.2)
      ctx.lineTo(pos.x - earOffset + earSize * 0.3, pos.y - radius - earSize * 0.5)
      ctx.closePath()
      ctx.moveTo(pos.x + earOffset, pos.y - radius)
      ctx.lineTo(pos.x + earOffset + earSize, pos.y - radius - earSize * 1.2)
      ctx.lineTo(pos.x + earOffset - earSize * 0.3, pos.y - radius - earSize * 0.5)
      ctx.closePath()
      // Tail border
      ctx.moveTo(pos.x, pos.y + radius)
      ctx.lineTo(pos.x - tailOffset, pos.y + radius + tailSize * 0.8)
      ctx.lineTo(pos.x + tailOffset, pos.y + radius + tailSize * 0.8)
      ctx.closePath()
      ctx.stroke()
      ctx.shadowBlur = 0
    } else if (themeId === "chaves") {
      // PT: Chaves theme: desenha orbs quadradas | EN: Chaves theme: draws square orbs | ES: Tema Chaves: dibuja orbs cuadradas | FR: Thème Chaves: dessine orbs carrées | DE: Chaves-Theme: zeichnet quadratische Orbs
      // Draw square orb (Chaves theme)
      const size = radius * 2
      ctx.beginPath()
      ctx.rect(pos.x - radius, pos.y - radius, size, size)
      
      // Draw avatar if loaded (clipped to square)
      if (orb.imageLoaded && orb.image) {
        ctx.save()
        ctx.beginPath()
        ctx.rect(pos.x - radius + borderWidth, pos.y - radius + borderWidth, size - borderWidth * 2, size - borderWidth * 2)
        ctx.clip()
        ctx.drawImage(orb.image, pos.x - radius + borderWidth, pos.y - radius + borderWidth, size - borderWidth * 2, size - borderWidth * 2)
        ctx.restore()
      } else {
        // Fallback: draw colored square
        ctx.fillStyle = colors.primary
        ctx.fill()
      }

      // Draw suspenders (tiras laranja) - NA FRENTE da foto
      // Partem do topo direito do quadrado
      const suspenderWidth = radius * 0.08
      const suspenderColor = '#FF8C00' // Laranja
      ctx.strokeStyle = suspenderColor
      ctx.lineWidth = suspenderWidth
      ctx.lineCap = 'round'
      
      // Tira de cima: do topo direito até a quina debaixo da esquerda
      ctx.beginPath()
      ctx.moveTo(pos.x + radius, pos.y - radius) // Topo direito do quadrado
      ctx.lineTo(pos.x - radius, pos.y + radius) // Quina debaixo da esquerda
      ctx.stroke()
      
      // Tira debaixo: do topo direito até mais ou menos a parte do meio do quadrado embaixo
      ctx.beginPath()
      ctx.moveTo(pos.x + radius, pos.y - radius) // Topo direito do quadrado
      ctx.lineTo(pos.x - radius * 0.3, pos.y + radius) // Parte do meio embaixo (mais à direita)
      ctx.stroke()

      // Draw hat/gorro (chapéu xadrez com abas) - sobrepondo parcialmente no topo
      const hatHeight = radius * 0.35
      const hatWidth = radius * 1.6
      const hatY = pos.y - radius * 0.85
      
      // Corpo do gorro (xadrez)
      ctx.save()
      ctx.fillStyle = '#8B4513' // Marrom base
      ctx.fillRect(pos.x - hatWidth / 2, hatY, hatWidth, hatHeight)
      
      // Padrão xadrez (verde, marrom, branco)
      const squareSize = hatWidth / 4
      const colors_hat = ['#228B22', '#8B4513', '#FFFFFF'] // Verde, marrom, branco
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 2; j++) {
          ctx.fillStyle = colors_hat[(i + j) % 3]
          ctx.fillRect(
            pos.x - hatWidth / 2 + i * squareSize,
            hatY + j * (hatHeight / 2),
            squareSize,
            hatHeight / 2
          )
        }
      }
      
      // Abas laterais do gorro
      const earFlapSize = radius * 0.25
      // Aba esquerda
      ctx.fillStyle = '#8B4513'
      ctx.beginPath()
      ctx.arc(pos.x - hatWidth / 2 - earFlapSize * 0.3, hatY + hatHeight / 2, earFlapSize, 0, Math.PI * 2)
      ctx.fill()
      // Padrão xadrez na aba esquerda
      ctx.fillStyle = '#228B22'
      ctx.fillRect(pos.x - hatWidth / 2 - earFlapSize * 0.5, hatY + hatHeight / 3, earFlapSize * 0.6, hatHeight / 3)
      
      // Aba direita
      ctx.fillStyle = '#8B4513'
      ctx.beginPath()
      ctx.arc(pos.x + hatWidth / 2 + earFlapSize * 0.3, hatY + hatHeight / 2, earFlapSize, 0, Math.PI * 2)
      ctx.fill()
      // Padrão xadrez na aba direita
      ctx.fillStyle = '#228B22'
      ctx.fillRect(pos.x + hatWidth / 2 - earFlapSize * 0.1, hatY + hatHeight / 3, earFlapSize * 0.6, hatHeight / 3)
      
      ctx.restore()

      // Draw border with glow
      ctx.strokeStyle = borderColor
      ctx.lineWidth = borderWidth
      ctx.shadowBlur = 12
      ctx.shadowColor = colors.accent
      ctx.stroke()
      ctx.shadowBlur = 0
    } else if (themeId === "pixel") {
      // PT: Pixel theme: desenha orb em estilo pixelado/8-bit | EN: Pixel theme: draws orb in pixelated/8-bit style | ES: Tema Pixel: dibuja orb en estilo pixelado/8-bit | FR: Thème Pixel: dessine orb en style pixelisé/8-bit | DE: Pixel-Theme: zeichnet Orb im pixelierten/8-bit-Stil
      // Draw pixelated orb (8-bit style)
      const pixelSize = Math.max(4, Math.floor(radius / 8)) // Tamanho do pixel (mínimo 4px)
      const pixelRadius = Math.floor(radius / pixelSize) * pixelSize // Raio ajustado para múltiplos de pixelSize
      
      // Desenha a orb como uma grade de pixels
      ctx.imageSmoothingEnabled = false // Desabilita suavização para efeito pixelado
      
      // Desenha avatar se carregado (pixelado)
      if (orb.imageLoaded && orb.image && orb.image.complete && orb.image.naturalWidth > 0) {
        ctx.save()
        // Cria um canvas temporário para pixelizar a imagem
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        if (tempCtx) {
          const size = (radius - borderWidth) * 2
          const pixelatedSize = Math.floor(size / pixelSize)
          tempCanvas.width = pixelatedSize
          tempCanvas.height = pixelatedSize
          tempCtx.imageSmoothingEnabled = false
          tempCtx.drawImage(orb.image, 0, 0, pixelatedSize, pixelatedSize)
          
          // Desenha a imagem pixelizada no canvas principal
          ctx.beginPath()
          ctx.arc(pos.x, pos.y, radius - borderWidth, 0, Math.PI * 2)
          ctx.clip()
          ctx.imageSmoothingEnabled = false
          ctx.drawImage(tempCanvas, pos.x - radius + borderWidth, pos.y - radius + borderWidth, size, size)
        }
        ctx.restore()
      } else {
        // Fallback: desenha círculo pixelado
        for (let y = -pixelRadius; y <= pixelRadius; y += pixelSize) {
          for (let x = -pixelRadius; x <= pixelRadius; x += pixelSize) {
            const distance = Math.sqrt(x * x + y * y)
            if (distance <= pixelRadius) {
              ctx.fillStyle = colors.primary
              ctx.fillRect(pos.x + x - pixelSize / 2, pos.y + y - pixelSize / 2, pixelSize, pixelSize)
            }
          }
        }
      }
      
      // Borda pixelada
      ctx.strokeStyle = borderColor
      ctx.lineWidth = borderWidth
      ctx.shadowBlur = 0 // Sem glow para estilo pixelado
      // Desenha borda como pixels
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 16) {
        const x = pos.x + Math.cos(angle) * pixelRadius
        const y = pos.y + Math.sin(angle) * pixelRadius
        ctx.fillStyle = borderColor
        ctx.fillRect(Math.floor(x / pixelSize) * pixelSize, Math.floor(y / pixelSize) * pixelSize, pixelSize, pixelSize)
      }
      
      ctx.imageSmoothingEnabled = true // Reabilita suavização
    } else if (themeId === "dracula") {
      // PT: Dracula theme: desenha orb com capa e dentes de vampiro | EN: Dracula theme: draws orb with vampire cape and fangs | ES: Tema Dracula: dibuja orb con capa y colmillos de vampiro | FR: Thème Dracula: dessine orb avec cape et crocs de vampire | DE: Dracula-Theme: zeichnet Orb mit Vampir-Umhang und Reißzähnen
      // Draw orb with cape and fangs (Dracula style)
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
      
      // Draw avatar if loaded
      if (orb.imageLoaded && orb.image) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, radius - borderWidth, 0, Math.PI * 2)
        ctx.clip()
        ctx.drawImage(orb.image, pos.x - radius + borderWidth, pos.y - radius + borderWidth, (radius - borderWidth) * 2, (radius - borderWidth) * 2)
        ctx.restore()
      } else {
        // Fallback: draw colored circle
        ctx.fillStyle = colors.primary
        ctx.fill()
      }

      // Draw cape (capa de vampiro) - sobrepondo parcialmente nas laterais
      const capeWidth = radius * 1.4
      const capeHeight = radius * 1.2
      const capeY = pos.y - radius * 0.3
      
      ctx.save()
      ctx.fillStyle = '#1a0a0a' // Preto profundo
      ctx.strokeStyle = colors.accent // Roxo
      ctx.lineWidth = 2
      
      // Capa esquerda
      ctx.beginPath()
      ctx.moveTo(pos.x - radius * 0.8, pos.y - radius * 0.5)
      ctx.lineTo(pos.x - capeWidth / 2, capeY)
      ctx.lineTo(pos.x - capeWidth / 2, capeY + capeHeight)
      ctx.lineTo(pos.x - radius * 0.6, pos.y + radius * 0.3)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      
      // Capa direita
      ctx.beginPath()
      ctx.moveTo(pos.x + radius * 0.8, pos.y - radius * 0.5)
      ctx.lineTo(pos.x + capeWidth / 2, capeY)
      ctx.lineTo(pos.x + capeWidth / 2, capeY + capeHeight)
      ctx.lineTo(pos.x + radius * 0.6, pos.y + radius * 0.3)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      
      // Gola alta (collar)
      ctx.fillStyle = '#2d1b3d' // Roxo escuro
      ctx.beginPath()
      ctx.arc(pos.x, pos.y - radius * 0.4, radius * 0.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      
      // Dentes (presas) - NA FRENTE da foto
      const fangSize = radius * 0.15
      ctx.fillStyle = '#ffffff' // Branco
      ctx.strokeStyle = '#8b0000' // Vermelho escuro
      ctx.lineWidth = 1.5
      
      // Dente esquerdo
      ctx.beginPath()
      ctx.moveTo(pos.x - radius * 0.2, pos.y - radius * 0.1)
      ctx.lineTo(pos.x - radius * 0.3, pos.y - radius * 0.3)
      ctx.lineTo(pos.x - radius * 0.15, pos.y - radius * 0.2)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      
      // Dente direito
      ctx.beginPath()
      ctx.moveTo(pos.x + radius * 0.2, pos.y - radius * 0.1)
      ctx.lineTo(pos.x + radius * 0.3, pos.y - radius * 0.3)
      ctx.lineTo(pos.x + radius * 0.15, pos.y - radius * 0.2)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      
      ctx.restore()

      // Draw border with glow
      ctx.strokeStyle = borderColor
      ctx.lineWidth = borderWidth
      ctx.shadowBlur = 12
      ctx.shadowColor = colors.accent
      ctx.stroke()
      ctx.shadowBlur = 0
    } else {
      // Draw orb circle (other themes)
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
      
      // Draw avatar if loaded
      if (orb.imageLoaded && orb.image) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, radius - borderWidth, 0, Math.PI * 2)
        ctx.clip()
        ctx.drawImage(orb.image, pos.x - radius + borderWidth, pos.y - radius + borderWidth, (radius - borderWidth) * 2, (radius - borderWidth) * 2)
        ctx.restore()
      } else {
        // Fallback: draw colored circle
        ctx.fillStyle = colors.primary
        ctx.fill()
      }

      // Draw border with reduced glow (consistent with rim)
      ctx.strokeStyle = borderColor
      ctx.lineWidth = borderWidth
      ctx.shadowBlur = 12 // Reduced glow for orbs
      ctx.shadowColor = colors.accent // Use same neon color as rim for consistency
      ctx.stroke()
      ctx.shadowBlur = 0

      // Terminal theme: ASCII representation
      if (themeId === "terminal" && !orb.image) {
        ctx.fillStyle = colors.text
        ctx.font = `${radius}px monospace`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("()", pos.x, pos.y)
      }
    }

    // PT: Desenha elementos decorativos temáticos ao redor da orb (não tapa a foto) | EN: Draws theme-specific decorative elements around orb (doesn't cover photo) | ES: Dibuja elementos decorativos temáticos alrededor de orb (no tapa la foto) | FR: Dessine éléments décoratifs thématiques autour de orb (ne couvre pas la photo) | DE: Zeichnet themenspezifische dekorative Elemente um Orb (deckt Foto nicht ab)
    drawThemeDecorations(ctx, themeId, pos, radius, colors)

    // PT: Desenha elementos festivos se houver festividade ativa e efeitos estiverem habilitados | EN: Draws festive elements if there's an active holiday and effects are enabled | ES: Dibuja elementos festivos si hay festividad activa y efectos están habilitados | FR: Dessine éléments festifs s'il y a une fête active et effets activés | DE: Zeichnet festliche Elemente, wenn ein Feiertag aktiv ist und Effekte aktiviert sind
    if (festiveEffectsEnabled) {
      const festiveType = getActiveFestivity(forceFestivity)
      if (festiveType) {
        drawFestiveElement(ctx, festiveType, pos, radius, colors)
      }
    }

    ctx.restore()
  }, [themeId, festiveEffectsEnabled, forceFestivity])

  // Draw static canvas for mobile lite mode (no animation loop)
  // Must be defined after all draw functions (drawFloor, drawCourt, etc.) and renderStaticOrb
  const drawStaticCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !isLiteMode) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvasSize.width
    canvas.height = canvasSize.height

    const colors = getThemeColors()
    if (!colors) return

    // Background gradient
    const headerHeight = 96
    const backboardY = headerHeight + 20
    const backboardHeight = 140
    const backboardBottom = backboardY + backboardHeight
    const rimCenterY = backboardBottom - 15
    const gradientCenterX = canvas.width / 2
    const gradientCenterY = rimCenterY
    
    const gradient = ctx.createRadialGradient(
      gradientCenterX, gradientCenterY, 0,
      gradientCenterX, gradientCenterY, Math.max(canvas.width, canvas.height)
    )
    
    gradient.addColorStop(0, colors.bg)
    gradient.addColorStop(1, colors.bgSecondary)
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw static basket and court
    drawFloor(ctx, colors)
    drawCourt(ctx, colors)
    drawBackboardSideSupports(ctx, colors)
    drawBackboard(ctx, colors)
    drawRim(ctx, colors)
    
    // Regenerate static orbs if not generated, canvas size changed, or users changed
    const currentUsersKey = users.map(u => u.userId).join(',')
    const needsRegeneration = 
      staticOrbsRef.current.length === 0 ||
      (staticOrbsRef.current[0] && (staticOrbsRef.current[0].x > canvas.width || staticOrbsRef.current[0].y > canvas.height)) ||
      (staticOrbsRef.current[0] && staticOrbsRef.current[0].userId !== users[0]?.userId) // Users changed
    
    if (needsRegeneration) {
      staticOrbsRef.current = generateStaticOrbs(canvas.width, canvas.height, users)
    }
    
    // Draw static orbs
    staticOrbsRef.current.forEach((orb) => {
      renderStaticOrb(ctx, orb, colors)
    })
  }, [canvasSize, themeId, isLiteMode, users, drawFloor, drawCourt, drawBackboardSideSupports, drawBackboard, drawRim, generateStaticOrbs, renderStaticOrb, getThemeColors])

  // Render orb with theme-specific styling
  const renderOrb = useCallback((ctx: CanvasRenderingContext2D, orb: Orb, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return

    const pos = getBodyPosition(orb.body)
    const isMobile = isMobileDevice()
    const radius = isMobile ? ORB_RADIUS_MOBILE : ORB_RADIUS_DESKTOP

    ctx.save()

    // Theme-specific orb styling
    let borderColor = colors.accent
    let borderWidth = 2
    let glowIntensity = 4

    if (themeId === "cyber") {
      borderColor = "#00ff00" // Green for cyber
      glowIntensity = 6
    } else if (themeId === "pixel") {
      borderColor = colors.primary
      borderWidth = 3
      glowIntensity = 2
    } else if (themeId === "neon") {
      borderColor = colors.accent
      glowIntensity = 8
    } else if (themeId === "terminal") {
      borderColor = colors.text
      borderWidth = 1
      glowIntensity = 2
    } else if (themeId === "chaves") {
      borderColor = colors.accent // Vermelho para Chaves
      borderWidth = 3
      glowIntensity = 5
    } else if (themeId === "pomemin") {
      borderColor = colors.accent // Vermelho para Pomemin
      borderWidth = 3
      glowIntensity = 6
    } else if (themeId === "dracula") {
      borderColor = colors.accent // Roxo para Dracula
      borderWidth = 3
      glowIntensity = 7
    } else if (themeId === "indiana-jones") {
      borderColor = colors.primary || "#DAB466" // Gold for Indiana Jones
      borderWidth = 2
      glowIntensity = 5
    }

    // PT: Pomemin theme: desenha orbs com orelhinhas (estilo Pokémon) | EN: Pomemin theme: draws orbs with ears (Pokémon style) | ES: Tema Pomemin: dibuja orbs con orejitas (estilo Pokémon) | FR: Thème Pomemin: dessine orbs avec oreilles (style Pokémon) | DE: Pomemin-Theme: zeichnet Orbs mit Ohren (Pokémon-Stil)
    if (themeId === "pomemin") {
      // Draw orb with ears (Pokémon style)
      const earSize = radius * 0.4 // Tamanho das orelhinhas (40% do raio)
      const earOffset = radius * 0.3 // Distância das orelhinhas do centro
      
      ctx.beginPath()
      
      // Draw main circle
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
      
      // Draw left ear (triângulo)
      ctx.moveTo(pos.x - earOffset, pos.y - radius)
      ctx.lineTo(pos.x - earOffset - earSize, pos.y - radius - earSize * 1.2)
      ctx.lineTo(pos.x - earOffset + earSize * 0.3, pos.y - radius - earSize * 0.5)
      ctx.closePath()
      
      // Draw right ear (triângulo)
      ctx.moveTo(pos.x + earOffset, pos.y - radius)
      ctx.lineTo(pos.x + earOffset + earSize, pos.y - radius - earSize * 1.2)
      ctx.lineTo(pos.x + earOffset - earSize * 0.3, pos.y - radius - earSize * 0.5)
      ctx.closePath()
      
      // Draw avatar if loaded (clipped to circle)
      if (orb.imageLoaded && orb.image) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, radius - borderWidth, 0, Math.PI * 2)
        ctx.clip()
        ctx.drawImage(orb.image, pos.x - radius + borderWidth, pos.y - radius + borderWidth, (radius - borderWidth) * 2, (radius - borderWidth) * 2)
        ctx.restore()
      } else {
        // Fallback: draw colored circle
        ctx.fillStyle = colors.primary
        ctx.fill()
      }
      
      // Fill ears with same color
      ctx.fillStyle = colors.primary
      ctx.fill()
      
      // Draw border with glow (circle + ears)
      ctx.strokeStyle = borderColor
      ctx.lineWidth = borderWidth
      ctx.shadowBlur = 14
      ctx.shadowColor = colors.accent
      
      // Redraw path for border
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
      ctx.moveTo(pos.x - earOffset, pos.y - radius)
      ctx.lineTo(pos.x - earOffset - earSize, pos.y - radius - earSize * 1.2)
      ctx.lineTo(pos.x - earOffset + earSize * 0.3, pos.y - radius - earSize * 0.5)
      ctx.closePath()
      ctx.moveTo(pos.x + earOffset, pos.y - radius)
      ctx.lineTo(pos.x + earOffset + earSize, pos.y - radius - earSize * 1.2)
      ctx.lineTo(pos.x + earOffset - earSize * 0.3, pos.y - radius - earSize * 0.5)
      ctx.closePath()
      ctx.stroke()
      ctx.shadowBlur = 0
    } else if (themeId === "chaves") {
      // PT: Chaves theme: desenha orbs quadradas | EN: Chaves theme: draws square orbs | ES: Tema Chaves: dibuja orbs cuadradas | FR: Thème Chaves: dessine orbs carrées | DE: Chaves-Theme: zeichnet quadratische Orbs
      // Draw square orb (Chaves theme)
      const size = radius * 2
      ctx.beginPath()
      ctx.rect(pos.x - radius, pos.y - radius, size, size)
      
      // Draw avatar if loaded (clipped to square)
      if (orb.imageLoaded && orb.image) {
        ctx.save()
        ctx.beginPath()
        ctx.rect(pos.x - radius + borderWidth, pos.y - radius + borderWidth, size - borderWidth * 2, size - borderWidth * 2)
        ctx.clip()
        ctx.drawImage(orb.image, pos.x - radius + borderWidth, pos.y - radius + borderWidth, size - borderWidth * 2, size - borderWidth * 2)
        ctx.restore()
      } else {
        // Fallback: draw colored square
        ctx.fillStyle = colors.primary
        ctx.fill()
      }

      // Draw suspenders (tiras laranja) - NA FRENTE da foto
      // Partem do topo direito do quadrado
      const suspenderWidth = radius * 0.08
      const suspenderColor = '#FF8C00' // Laranja
      ctx.strokeStyle = suspenderColor
      ctx.lineWidth = suspenderWidth
      ctx.lineCap = 'round'
      
      // Tira de cima: do topo direito até a quina debaixo da esquerda
      ctx.beginPath()
      ctx.moveTo(pos.x + radius, pos.y - radius) // Topo direito do quadrado
      ctx.lineTo(pos.x - radius, pos.y + radius) // Quina debaixo da esquerda
      ctx.stroke()
      
      // Tira debaixo: do topo direito até mais ou menos a parte do meio do quadrado embaixo
      ctx.beginPath()
      ctx.moveTo(pos.x + radius, pos.y - radius) // Topo direito do quadrado
      ctx.lineTo(pos.x - radius * 0.3, pos.y + radius) // Parte do meio embaixo (mais à direita)
      ctx.stroke()

      // Draw hat/gorro (chapéu xadrez com abas) - sobrepondo parcialmente no topo
      const hatHeight = radius * 0.35
      const hatWidth = radius * 1.6
      const hatY = pos.y - radius * 0.85
      
      // Corpo do gorro (xadrez)
      ctx.save()
      ctx.fillStyle = '#8B4513' // Marrom base
      ctx.fillRect(pos.x - hatWidth / 2, hatY, hatWidth, hatHeight)
      
      // Padrão xadrez (verde, marrom, branco)
      const squareSize = hatWidth / 4
      const colors_hat = ['#228B22', '#8B4513', '#FFFFFF'] // Verde, marrom, branco
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 2; j++) {
          ctx.fillStyle = colors_hat[(i + j) % 3]
          ctx.fillRect(
            pos.x - hatWidth / 2 + i * squareSize,
            hatY + j * (hatHeight / 2),
            squareSize,
            hatHeight / 2
          )
        }
      }
      
      // Abas laterais do gorro
      const earFlapSize = radius * 0.25
      // Aba esquerda
      ctx.fillStyle = '#8B4513'
      ctx.beginPath()
      ctx.arc(pos.x - hatWidth / 2 - earFlapSize * 0.3, hatY + hatHeight / 2, earFlapSize, 0, Math.PI * 2)
      ctx.fill()
      // Padrão xadrez na aba esquerda
      ctx.fillStyle = '#228B22'
      ctx.fillRect(pos.x - hatWidth / 2 - earFlapSize * 0.5, hatY + hatHeight / 3, earFlapSize * 0.6, hatHeight / 3)
      
      // Aba direita
      ctx.fillStyle = '#8B4513'
      ctx.beginPath()
      ctx.arc(pos.x + hatWidth / 2 + earFlapSize * 0.3, hatY + hatHeight / 2, earFlapSize, 0, Math.PI * 2)
      ctx.fill()
      // Padrão xadrez na aba direita
      ctx.fillStyle = '#228B22'
      ctx.fillRect(pos.x + hatWidth / 2 - earFlapSize * 0.1, hatY + hatHeight / 3, earFlapSize * 0.6, hatHeight / 3)
      
      ctx.restore()

      // Draw border with glow
      ctx.strokeStyle = borderColor
      ctx.lineWidth = borderWidth
      ctx.shadowBlur = 12
      ctx.shadowColor = colors.accent
      ctx.stroke()
      ctx.shadowBlur = 0
    } else if (themeId === "pixel") {
      // PT: Pixel theme: desenha orb em estilo pixelado/8-bit | EN: Pixel theme: draws orb in pixelated/8-bit style | ES: Tema Pixel: dibuja orb en estilo pixelado/8-bit | FR: Thème Pixel: dessine orb en style pixelisé/8-bit | DE: Pixel-Theme: zeichnet Orb im pixelierten/8-bit-Stil
      // Draw pixelated orb (8-bit style)
      const pixelSize = Math.max(4, Math.floor(radius / 8)) // Tamanho do pixel (mínimo 4px)
      const pixelRadius = Math.floor(radius / pixelSize) * pixelSize // Raio ajustado para múltiplos de pixelSize
      
      // Desenha a orb como uma grade de pixels
      ctx.imageSmoothingEnabled = false // Desabilita suavização para efeito pixelado
      
      // Desenha avatar se carregado (pixelado)
      if (orb.imageLoaded && orb.image && orb.image.complete && orb.image.naturalWidth > 0) {
        ctx.save()
        // Cria um canvas temporário para pixelizar a imagem
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        if (tempCtx) {
          const size = (radius - borderWidth) * 2
          const pixelatedSize = Math.floor(size / pixelSize)
          tempCanvas.width = pixelatedSize
          tempCanvas.height = pixelatedSize
          tempCtx.imageSmoothingEnabled = false
          tempCtx.drawImage(orb.image, 0, 0, pixelatedSize, pixelatedSize)
          
          // Desenha a imagem pixelizada no canvas principal
          ctx.beginPath()
          ctx.arc(pos.x, pos.y, radius - borderWidth, 0, Math.PI * 2)
          ctx.clip()
          ctx.imageSmoothingEnabled = false
          ctx.drawImage(tempCanvas, pos.x - radius + borderWidth, pos.y - radius + borderWidth, size, size)
        }
        ctx.restore()
      } else {
        // Fallback: desenha círculo pixelado
        for (let y = -pixelRadius; y <= pixelRadius; y += pixelSize) {
          for (let x = -pixelRadius; x <= pixelRadius; x += pixelSize) {
            const distance = Math.sqrt(x * x + y * y)
            if (distance <= pixelRadius) {
              ctx.fillStyle = colors.primary
              ctx.fillRect(pos.x + x - pixelSize / 2, pos.y + y - pixelSize / 2, pixelSize, pixelSize)
            }
          }
        }
      }
      
      // Borda pixelada
      ctx.strokeStyle = borderColor
      ctx.lineWidth = borderWidth
      ctx.shadowBlur = 0 // Sem glow para estilo pixelado
      // Desenha borda como pixels
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 16) {
        const x = pos.x + Math.cos(angle) * pixelRadius
        const y = pos.y + Math.sin(angle) * pixelRadius
        ctx.fillStyle = borderColor
        ctx.fillRect(Math.floor(x / pixelSize) * pixelSize, Math.floor(y / pixelSize) * pixelSize, pixelSize, pixelSize)
      }
      
      ctx.imageSmoothingEnabled = true // Reabilita suavização
    } else if (themeId === "dracula") {
      // PT: Dracula theme: desenha orb com capa e dentes de vampiro | EN: Dracula theme: draws orb with vampire cape and fangs | ES: Tema Dracula: dibuja orb con capa y colmillos de vampiro | FR: Thème Dracula: dessine orb avec cape et crocs de vampire | DE: Dracula-Theme: zeichnet Orb mit Vampir-Umhang und Reißzähnen
      // Draw orb with cape and fangs (Dracula style)
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
      
      // Draw avatar if loaded
      if (orb.imageLoaded && orb.image) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, radius - borderWidth, 0, Math.PI * 2)
        ctx.clip()
        ctx.drawImage(orb.image, pos.x - radius + borderWidth, pos.y - radius + borderWidth, (radius - borderWidth) * 2, (radius - borderWidth) * 2)
        ctx.restore()
      } else {
        // Fallback: draw colored circle
        ctx.fillStyle = colors.primary
        ctx.fill()
      }

      // Draw cape (capa de vampiro) - sobrepondo parcialmente nas laterais
      const capeWidth = radius * 1.4
      const capeHeight = radius * 1.2
      const capeY = pos.y - radius * 0.3
      
      ctx.save()
      ctx.fillStyle = '#1a0a0a' // Preto profundo
      ctx.strokeStyle = colors.accent // Roxo
      ctx.lineWidth = 2
      
      // Capa esquerda
      ctx.beginPath()
      ctx.moveTo(pos.x - radius * 0.8, pos.y - radius * 0.5)
      ctx.lineTo(pos.x - capeWidth / 2, capeY)
      ctx.lineTo(pos.x - capeWidth / 2, capeY + capeHeight)
      ctx.lineTo(pos.x - radius * 0.6, pos.y + radius * 0.3)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      
      // Capa direita
      ctx.beginPath()
      ctx.moveTo(pos.x + radius * 0.8, pos.y - radius * 0.5)
      ctx.lineTo(pos.x + capeWidth / 2, capeY)
      ctx.lineTo(pos.x + capeWidth / 2, capeY + capeHeight)
      ctx.lineTo(pos.x + radius * 0.6, pos.y + radius * 0.3)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      
      // Gola alta (collar)
      ctx.fillStyle = '#2d1b3d' // Roxo escuro
      ctx.beginPath()
      ctx.arc(pos.x, pos.y - radius * 0.4, radius * 0.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      
      // Dentes (presas) - NA FRENTE da foto
      const fangSize = radius * 0.15
      ctx.fillStyle = '#ffffff' // Branco
      ctx.strokeStyle = '#8b0000' // Vermelho escuro
      ctx.lineWidth = 1.5
      
      // Dente esquerdo
      ctx.beginPath()
      ctx.moveTo(pos.x - radius * 0.2, pos.y - radius * 0.1)
      ctx.lineTo(pos.x - radius * 0.3, pos.y - radius * 0.3)
      ctx.lineTo(pos.x - radius * 0.15, pos.y - radius * 0.2)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      
      // Dente direito
      ctx.beginPath()
      ctx.moveTo(pos.x + radius * 0.2, pos.y - radius * 0.1)
      ctx.lineTo(pos.x + radius * 0.3, pos.y - radius * 0.3)
      ctx.lineTo(pos.x + radius * 0.15, pos.y - radius * 0.2)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      
      ctx.restore()

      // Draw border with glow
      ctx.strokeStyle = borderColor
      ctx.lineWidth = borderWidth
      ctx.shadowBlur = 12
      ctx.shadowColor = colors.accent
      ctx.stroke()
      ctx.shadowBlur = 0
    } else {
      // Draw orb circle (other themes)
      // Skip default border for Star Wars and Indiana Jones themes (they have custom rings)
      const skipDefaultBorder = themeId === "star-wars" || themeId === "indiana-jones"
      
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
      
      // Draw avatar if loaded
      if (orb.imageLoaded && orb.image) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, radius - (skipDefaultBorder ? 0 : borderWidth), 0, Math.PI * 2)
        ctx.clip()
        ctx.drawImage(orb.image, pos.x - radius + (skipDefaultBorder ? 0 : borderWidth), pos.y - radius + (skipDefaultBorder ? 0 : borderWidth), (radius - (skipDefaultBorder ? 0 : borderWidth)) * 2, (radius - (skipDefaultBorder ? 0 : borderWidth)) * 2)
        ctx.restore()
      } else {
        // Fallback: draw colored circle
        ctx.fillStyle = colors.primary
        ctx.fill()
      }

      // Draw border with reduced glow (consistent with rim) - skip for Star Wars and Indiana Jones
      if (!skipDefaultBorder) {
        ctx.strokeStyle = borderColor
        ctx.lineWidth = borderWidth
        ctx.shadowBlur = 12 // Reduced glow for orbs
        ctx.shadowColor = colors.accent // Use same neon color as rim for consistency
        ctx.stroke()
        ctx.shadowBlur = 0
      }

      // Terminal theme: ASCII representation
      if (themeId === "terminal" && !orb.image) {
        ctx.fillStyle = colors.text
        ctx.font = `${radius}px monospace`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("()", pos.x, pos.y)
      }
    }

    // PT: Desenha elementos decorativos temáticos ao redor da orb (não tapa a foto) | EN: Draws theme-specific decorative elements around orb (doesn't cover photo) | ES: Dibuja elementos decorativos temáticos alrededor de orb (no tapa la foto) | FR: Dessine éléments décoratifs thématiques autour de orb (ne couvre pas la photo) | DE: Zeichnet themenspezifische dekorative Elemente um Orb (deckt Foto nicht ab)
    drawThemeDecorations(ctx, themeId, pos, radius, colors)

    // PT: Indiana Jones theme: desenha anel temático com variação específica | EN: Indiana Jones theme: draws thematic ring with specific variation | ES: Tema Indiana Jones: dibuja anillo temático con variación específica | FR: Thème Indiana Jones: dessine anneau thématique avec variation spécifique | DE: Indiana Jones-Theme: zeichnet thematischen Ring mit spezifischer Variation
    if (themeId === "indiana-jones" && orb.meta?.indyVariant) {
      drawIndianaJonesOrbRing(ctx, orb, orb.meta.indyVariant, colors, pos, radius)
    }

    // PT: Star Wars theme: desenha anel temático com variação específica | EN: Star Wars theme: draws thematic ring with specific variation | ES: Tema Star Wars: dibuja anillo temático con variación específica | FR: Thème Star Wars: dessine anneau thématique avec variation spécifique | DE: Star Wars-Theme: zeichnet thematischen Ring mit spezifischer Variation
    if (themeId === "star-wars" && orb.meta?.starWarsVariant) {
      // Ensure we draw the Star Wars ring AFTER everything else, on top
      ctx.save()
      drawStarWarsOrb(ctx, orb, orb.meta.starWarsVariant, colors, pos, radius)
      ctx.restore()
    }

    // PT: Desenha elementos festivos se houver festividade ativa e efeitos estiverem habilitados | EN: Draws festive elements if there's an active holiday and effects are enabled | ES: Dibuja elementos festivos si hay festividad activa y efectos están habilitados | FR: Dessine éléments festifs s'il y a une fête active et effets activés | DE: Zeichnet festliche Elemente, wenn ein Feiertag aktiv ist und Effekte aktiviert sind
    if (festiveEffectsEnabled) {
      const festiveType = getActiveFestivity(forceFestivity)
      if (festiveType) {
        drawFestiveElement(ctx, festiveType, pos, radius, colors)
      }
    }

    ctx.restore()
  }, [themeId, festiveEffectsEnabled, forceFestivity])

  // Render loop
  useEffect(() => {
    if (!canvasRef.current) return
    
    // Mobile lite mode: draw static canvas once (no animation loop)
    if (isLiteMode) {
      drawStaticCanvas()
      return
    }
    
    // Desktop: ensure engine is initialized before rendering
    // If engine is not initialized, wait for the physics init effect to run
    if (!engineRef.current) {
      // Engine not ready yet, skip this render cycle
      // The physics init effect will initialize it
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvasSize.width
    canvas.height = canvasSize.height

    let animationFrameId: number

    const render = (currentTime: number) => {
      if (!engineRef.current || !ctx) return
      
      // Multi-tab protection: pause if we're not the owner
      if (shouldPause) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      // Canvas crash resilience: wrap entire render in try/catch
      try {
        // Reset crash state on successful render
        if (currentTime - lastFrameTimeRef.current > 100) {
          resetCrashState()
        }

        // Show error message if in fallback mode
        if (isInFallback()) {
          const colors = getThemeColors()
          if (colors && ctx) {
            ctx.fillStyle = colors.bg
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = colors.text
            ctx.font = '16px monospace'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText('Visual temporariamente indisponível, reiniciando…', canvas.width / 2, canvas.height / 2)
          }
          animationFrameId = requestAnimationFrame(render)
          return
        }

        // Calculate FPS
      const deltaTime = currentTime - lastFrameTimeRef.current
      if (deltaTime > 0) {
        const fps = 1000 / deltaTime
        fpsRef.current = fps

        // Track FPS history (last 60 frames)
        fpsHistoryRef.current.push(fps)
        if (fpsHistoryRef.current.length > 60) {
          fpsHistoryRef.current.shift()
        }
        
        // Update FPS Guardian store (handles level calculation with hysteresis)
        setFPS(fps)
      }
      lastFrameTimeRef.current = currentTime

      // FPS Guardian: Check FPS level and apply degradation
      // Level 2 (FPS < 40): Aggressive fallback - render static only
      if (isFPSLevel2) {
        // Fallback: render static background only with radial gradient
        const colors = getThemeColors()
        if (colors) {
          const headerHeight = 96
          const backboardY = headerHeight + 20
          const backboardHeight = 140
          const backboardBottom = backboardY + backboardHeight
          const rimCenterY = backboardBottom - 15
          const gradientCenterX = canvas.width / 2
          const gradientCenterY = rimCenterY
          
          const gradient = ctx.createRadialGradient(
            gradientCenterX, gradientCenterY, 0,
            gradientCenterX, gradientCenterY, Math.max(canvas.width, canvas.height)
          )
          
          gradient.addColorStop(0, colors.bg)
          gradient.addColorStop(1, colors.bgSecondary)
          
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        animationFrameId = requestAnimationFrame(render)
        return
      }

      // Update physics (only if not in lite mode and not Level 2)
      if (engineRef.current && !isFPSLevel2) {
        try {
          updatePhysics(engineRef.current)
        } catch (error) {
                    // Handle physics crash
          if (handleCanvasCrash(error as Error, 'DevOrbsCanvas-physics')) {
            // Retry after delay
            setTimeout(() => {
              animationFrameId = requestAnimationFrame(render)
            }, getRetryDelay())
            return
          } else {
            // Fallback mode - stop physics
            return
          }
        }
      }

      // Debug: log orbs count changes (to see when/why they "disappear")
      const currentOrbsCount = orbsRef.current.length
      if (currentOrbsCount !== lastOrbsCountRef.current) {
                lastOrbsCountRef.current = currentOrbsCount
      }

      // Clear canvas with radial gradient
      const colors = getThemeColors()
      if (colors) {
        // Create radial gradient (centered behind the rim)
        const headerHeight = 96
        const backboardY = headerHeight + 20
        const backboardHeight = 140 // Increased by 50% then +30% then +20% (60 * 1.5 * 1.3 * 1.2 = 140.4 ≈ 140)
        const backboardBottom = backboardY + backboardHeight
        const rimCenterY = backboardBottom - 15 // Match rim position (dentro do backboard)
        const gradientCenterX = canvas.width / 2
        const gradientCenterY = rimCenterY
        
        const gradient = ctx.createRadialGradient(
          gradientCenterX, gradientCenterY, 0, // Center point (behind rim)
          gradientCenterX, gradientCenterY, Math.max(canvas.width, canvas.height) // Outer radius
        )
        
        // Gradient from theme background color (center) to darker edges
        gradient.addColorStop(0, colors.bg) // Theme background at center
        gradient.addColorStop(1, colors.bgSecondary) // Darker theme bg at edges
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }

      // Collision detection is now handled by Matter.js Events
      // No need to manually check collisions here

      // Only render visuals if visible (but physics keeps running)
      if (isVisible) {
        if (colors) {
          // Draw floor (before everything so it's behind)
          drawFloor(ctx, colors)
          
          // Draw minimalist basketball court (neon Tron style)
          drawCourt(ctx, colors)
          
          // Draw backboard side supports (behind backboard and rim)
          drawBackboardSideSupports(ctx, colors)
          
          // Draw basket elements (backboard with integrated LED scoreboard, rim)
          drawBackboard(ctx, colors) // Scoreboard is now inside backboard
          drawRim(ctx, colors)
          
          // Draw theme decorative objects (after background, before orbs)
          drawThemeDecorativeObject(ctx, themeId, colors, canvas.width, canvas.height, currentTime)
          
          // Portal system (only when theme is "portal")
          if (themeId === "portal" && mobileMode !== 'lite') {
            // Check for orbs entering portals (continuous check, bidirectional)
            orbsRef.current.forEach((orb) => {
              const orbPos = getBodyPosition(orb.body)
              
              // Check if orb is entering orange portal (floor)
              if (isPointInPortal(orbPos.x, orbPos.y, portalOrangeRef.current)) {
                // 2% chance of glitch mode
                const isGlitch = Math.random() < 0.02
                handlePortalTeleport(orb, 'orange', isGlitch)
              }
              // Check if orb is entering blue portal (ceiling)
              else if (isPointInPortal(orbPos.x, orbPos.y, portalBlueRef.current)) {
                // 2% chance of glitch mode
                const isGlitch = Math.random() < 0.02
                handlePortalTeleport(orb, 'blue', isGlitch)
              }
            })
            
            // Update portal particles
            updatePortalParticles(deltaTime)
            
            // Update warp effects
            updateWarpEffects(currentTime)
            
            // Generate portal particles (continuous)
            const orangeParticleCount = portalParticlesRef.current.filter(p => !p.isGlitch && p.color.includes('25')).length
            const blueParticleCount = portalParticlesRef.current.filter(p => !p.isGlitch && p.color.includes('195')).length
            const maxParticles = mobileMode === 'full' ? 6 : (isFPSLevel1 ? 5 : 10)
            
            if (orangeParticleCount < maxParticles) {
              createPortalParticles(portalOrangeRef.current.x, portalOrangeRef.current.y, 'orange', 1)
            }
            if (blueParticleCount < maxParticles) {
              createPortalParticles(portalBlueRef.current.x, portalBlueRef.current.y, 'blue', 1)
            }
            
            // Draw portals
            drawPortal(ctx, portalOrangeRef.current, currentTime)
            drawPortal(ctx, portalBlueRef.current, currentTime)
            
            // Draw portal particles
            drawPortalParticles(ctx)
            
            // Draw warp effects (only if not mobile-full or FPS level 2)
            if (mobileMode !== 'full' && !isFPSLevel2) {
              warpEffectsRef.current.forEach((effect) => {
                drawWarpEffect(ctx, effect, currentTime)
              })
            }
            
            // Draw glitch text (only if not mobile-full or FPS level 2)
            if (mobileMode !== 'full' && !isFPSLevel2) {
              drawGlitchText(ctx, canvas.width, canvas.height)
            }
          }
          
          // Render orbs
          orbsRef.current.forEach((orb) => {
            renderOrb(ctx, orb, colors)
            
            // Draw orb reflection on floor (optional aesthetic)
            const pos = getBodyPosition(orb.body)
            const isMobile = isMobileDevice()
            const radius = isMobile ? ORB_RADIUS_MOBILE : ORB_RADIUS_DESKTOP
            const floorHeight = canvasSize.height * 0.2
            const floorY = canvasSize.height - floorHeight
            
            // Only draw reflection if orb is above floor
            if (pos.y < floorY) {
              ctx.save()
              
              // Set clipping to floor area only
              ctx.beginPath()
              ctx.rect(0, floorY, canvasSize.width, floorHeight)
              ctx.clip()
              
              // Calculate reflection position (mirrored across floor line, 10px below)
              const distanceFromFloor = floorY - pos.y
              const reflectionY = floorY + distanceFromFloor + 10
              
              // Draw inverted orb (reflection) with blur
              ctx.globalAlpha = 0.08 // 8% opacity
              ctx.filter = 'blur(6px)' // 6px blur
              
              // PT: Pomemin theme: desenha reflexo com orelhinhas e rabinho | EN: Pomemin theme: draws reflection with ears and tail | ES: Tema Pomemin: dibuja reflejo con orejitas y colita | FR: Thème Pomemin: dessine réflexion avec oreilles et queue | DE: Pomemin-Theme: zeichnet Reflexion mit Ohren und Schwanz
              if (themeId === "pomemin") {
                // Draw orb with ears and tail reflection (Pokémon style) - inverted vertically
                ctx.save()
                ctx.translate(pos.x, reflectionY)
                ctx.scale(1, -1) // Invert vertically
                ctx.translate(-pos.x, -reflectionY)
                
                const earSize = radius * 0.4
                const earOffset = radius * 0.3
                const tailSize = radius * 0.5
                const tailOffset = radius * 0.4
                
                ctx.beginPath()
                ctx.arc(pos.x, reflectionY, radius, 0, Math.PI * 2)
                ctx.moveTo(pos.x - earOffset, reflectionY - radius)
                ctx.lineTo(pos.x - earOffset - earSize, reflectionY - radius - earSize * 1.2)
                ctx.lineTo(pos.x - earOffset + earSize * 0.3, reflectionY - radius - earSize * 0.5)
                ctx.closePath()
                ctx.moveTo(pos.x + earOffset, reflectionY - radius)
                ctx.lineTo(pos.x + earOffset + earSize, reflectionY - radius - earSize * 1.2)
                ctx.lineTo(pos.x + earOffset - earSize * 0.3, reflectionY - radius - earSize * 0.5)
                ctx.closePath()
                // Tail reflection
                ctx.moveTo(pos.x, reflectionY + radius)
                ctx.lineTo(pos.x - tailOffset, reflectionY + radius + tailSize * 0.8)
                ctx.lineTo(pos.x + tailOffset, reflectionY + radius + tailSize * 0.8)
                ctx.closePath()
                
                // Draw avatar if loaded (clipped to circle)
                if (orb.imageLoaded && orb.image && orb.image.complete && orb.image.naturalWidth > 0) {
                  ctx.save()
                  ctx.beginPath()
                  ctx.arc(pos.x, reflectionY, radius - 2, 0, Math.PI * 2)
                  ctx.clip()
                  ctx.drawImage(orb.image, pos.x - radius + 2, reflectionY - radius + 2, (radius - 2) * 2, (radius - 2) * 2)
                  ctx.restore()
                } else {
                  ctx.fillStyle = colors.primary
                  ctx.fill()
                }
                ctx.restore()
              } else if (themeId === "chaves") {
                // PT: Chaves theme: desenha reflexo quadrado | EN: Chaves theme: draws square reflection | ES: Tema Chaves: dibuja reflejo cuadrado | FR: Thème Chaves: dessine réflexion carrée | DE: Chaves-Theme: zeichnet quadratische Reflexion
                // Draw square reflection (Chaves theme) - inverted vertically
                ctx.save()
                ctx.translate(pos.x, reflectionY)
                ctx.scale(1, -1) // Invert vertically
                ctx.translate(-pos.x, -reflectionY)
                
                const size = radius * 2
                ctx.beginPath()
                ctx.rect(pos.x - radius, reflectionY - radius, size, size)
                
                // Draw avatar if loaded (clipped to square)
                if (orb.imageLoaded && orb.image) {
                  ctx.save()
                  ctx.beginPath()
                  ctx.rect(pos.x - radius + 2, reflectionY - radius + 2, size - 4, size - 4)
                  ctx.clip()
                  ctx.drawImage(orb.image, pos.x - radius + 2, reflectionY - radius + 2, size - 4, size - 4)
                  ctx.restore()
                } else {
                  ctx.fillStyle = colors.primary
                  ctx.fill()
                }
                ctx.restore()
              } else if (themeId === "dracula") {
                // PT: Dracula theme: desenha reflexo com capa e dentes | EN: Dracula theme: draws reflection with cape and fangs | ES: Tema Dracula: dibuja reflejo con capa y colmillos | FR: Thème Dracula: dessine réflexion avec cape et crocs | DE: Dracula-Theme: zeichnet Reflexion mit Umhang und Reißzähnen
                // Draw Dracula reflection - inverted vertically
                ctx.save()
                ctx.translate(pos.x, reflectionY)
                ctx.scale(1, -1) // Invert vertically
                ctx.translate(-pos.x, -reflectionY)
                
                ctx.beginPath()
                ctx.arc(pos.x, reflectionY, radius, 0, Math.PI * 2)
                
                // Draw avatar if loaded
                if (orb.imageLoaded && orb.image) {
                  ctx.save()
                  ctx.beginPath()
                  ctx.arc(pos.x, reflectionY, radius - 2, 0, Math.PI * 2)
                  ctx.clip()
                  ctx.drawImage(orb.image, pos.x - radius + 2, reflectionY - radius + 2, (radius - 2) * 2, (radius - 2) * 2)
                  ctx.restore()
                } else {
                  ctx.fillStyle = colors.primary
                  ctx.fill()
                }
                
                // Draw cape reflection
                const capeWidth = radius * 1.4
                const capeHeight = radius * 1.2
                const capeY = reflectionY - radius * 0.3
                
                ctx.fillStyle = '#1a0a0a'
                ctx.strokeStyle = colors.accent
                ctx.lineWidth = 2
                
                // Capa esquerda
                ctx.beginPath()
                ctx.moveTo(pos.x - radius * 0.8, reflectionY - radius * 0.5)
                ctx.lineTo(pos.x - capeWidth / 2, capeY)
                ctx.lineTo(pos.x - capeWidth / 2, capeY + capeHeight)
                ctx.lineTo(pos.x - radius * 0.6, reflectionY + radius * 0.3)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
                
                // Capa direita
                ctx.beginPath()
                ctx.moveTo(pos.x + radius * 0.8, reflectionY - radius * 0.5)
                ctx.lineTo(pos.x + capeWidth / 2, capeY)
                ctx.lineTo(pos.x + capeWidth / 2, capeY + capeHeight)
                ctx.lineTo(pos.x + radius * 0.6, reflectionY + radius * 0.3)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
                
                // Gola alta
                ctx.fillStyle = '#2d1b3d'
                ctx.beginPath()
                ctx.arc(pos.x, reflectionY - radius * 0.4, radius * 0.5, 0, Math.PI * 2)
                ctx.fill()
                ctx.stroke()
                
                // Dentes
                const fangSize = radius * 0.15
                ctx.fillStyle = '#ffffff'
                ctx.strokeStyle = '#8b0000'
                ctx.lineWidth = 1.5
                
                // Dente esquerdo
                ctx.beginPath()
                ctx.moveTo(pos.x - radius * 0.2, reflectionY - radius * 0.1)
                ctx.lineTo(pos.x - radius * 0.3, reflectionY - radius * 0.3)
                ctx.lineTo(pos.x - radius * 0.15, reflectionY - radius * 0.2)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
                
                // Dente direito
                ctx.beginPath()
                ctx.moveTo(pos.x + radius * 0.2, reflectionY - radius * 0.1)
                ctx.lineTo(pos.x + radius * 0.3, reflectionY - radius * 0.3)
                ctx.lineTo(pos.x + radius * 0.15, reflectionY - radius * 0.2)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
                
                ctx.restore()
              } else {
                // Draw orb circle (reflection) - inverted vertically
                ctx.save()
                ctx.translate(pos.x, reflectionY)
                ctx.scale(1, -1) // Invert vertically
                ctx.translate(-pos.x, -reflectionY)
                
                ctx.beginPath()
                ctx.arc(pos.x, reflectionY, radius, 0, Math.PI * 2)
                
                // Draw avatar if loaded
                if (orb.imageLoaded && orb.image) {
                  ctx.save()
                  ctx.beginPath()
                  ctx.arc(pos.x, reflectionY, radius - 2, 0, Math.PI * 2)
                  ctx.clip()
                  ctx.drawImage(orb.image, pos.x - radius + 2, reflectionY - radius + 2, (radius - 2) * 2, (radius - 2) * 2)
                  ctx.restore()
                } else {
                  ctx.fillStyle = colors.primary
                  ctx.fill()
                }
                ctx.restore()
              }
              
              ctx.restore()
              ctx.restore()
            }
          })
          
          // Render fireworks (on top of everything)
          renderFireworks(ctx)
          
          // Indiana Jones theme: Render visual effects
          if (themeId === "indiana-jones") {
            const colors = getThemeColors()
            if (colors) {
              renderDustParticles(ctx, colors)
              renderDivineLight(ctx, colors)
              renderTempleCollapse(ctx, colors)
            }
          }
          
          // Star Wars theme: Render visual effects
          if (themeId === "star-wars") {
            const colors = getThemeColors()
            if (colors) {
              renderSaberFlash(ctx, colors)
              renderDarkShock(ctx, colors)
              renderHyperspaceBurst(ctx, colors)
              renderAstromechPing(ctx, colors)
            }
          }
          
          // Render theme-specific shake visual effects (all themes)
          if (colors) {
            // Chaves theme: Special character animation near shake button
            if (themeId === 'chaves') {
              renderChavesShakeAnimation(ctx, colors)
            } else {
              // Other themes: Standard center screen effect
              renderShakeEffect(ctx, colors)
            }
            
            // Render Star Wars easter eggs
            if (themeId === 'star-wars') {
              renderStarWarsEasterEgg(ctx, colors)
              renderNeonAssault(ctx, colors)
            }
          }
        }
      }

        animationFrameId = requestAnimationFrame(render)
      } catch (error) {
                // Handle canvas crash
        if (handleCanvasCrash(error as Error, 'DevOrbsCanvas-render')) {
          // Retry after delay
          setTimeout(() => {
            animationFrameId = requestAnimationFrame(render)
          }, getRetryDelay())
        } else {
          // Fallback mode - render static background only
          const colors = getThemeColors()
          if (colors && ctx) {
            ctx.fillStyle = colors.bg
            ctx.fillRect(0, 0, canvas.width, canvas.height)
          }
        }
        return
      }
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [canvasSize, themeId, renderOrb, isVisible, drawBackboard, drawRim, drawBackboardSideSupports, drawFloor, drawCourt, renderFireworks, createFireworks, isLiteMode, isFPSLevel1, isFPSLevel2, fpsLevel, shouldPause])

  // Apply theme to canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    canvas.setAttribute("data-theme", themeId)
    
    // Redraw static canvas if in lite mode when theme changes
    if (isLiteMode) {
      drawStaticCanvas()
    }
  }, [themeId, isLiteMode, drawStaticCanvas])

  // Redraw static canvas when canvas size changes (e.g., screen rotation)
  // Only for mobile lite mode
  useEffect(() => {
    if (isLiteMode && canvasSize.width > 0 && canvasSize.height > 0) {
      // Clear static orbs to regenerate with new positions
      staticOrbsRef.current = []
      drawStaticCanvas()
    }
  }, [canvasSize.width, canvasSize.height, isLiteMode, drawStaticCanvas])

  // Save visibility preference to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dev-orbs-visible", isVisible.toString())
    }
  }, [isVisible])

  // Toggle visibility
  const toggleVisibility = useCallback(() => {
    setIsVisible((prev) => !prev)
  }, [])
  
  // PT: Desabilita efeitos festivos e lança confetes | EN: Disables festive effects and launches confetti | ES: Desactiva efectos festivos y lanza confeti | FR: Désactive effets festifs et lance confettis | DE: Deaktiviert festliche Effekte und wirft Konfetti
  const disableFestiveEffects = useCallback(() => {
    setFestiveEffectsEnabled(false)
    setShowConfetti(true)
    setIsVisible(false) // Esconde o canvas
    
    // Salva preferência
    if (typeof window !== "undefined") {
      localStorage.setItem("dev-orbs-festive-effects", "false")
    }
    
    // Remove confetes após 3 segundos
    setTimeout(() => {
      setShowConfetti(false)
    }, 3000)
  }, [])
  
  // PT: Verifica se há festividade ativa | EN: Checks if there's an active holiday | ES: Verifica si hay festividad activa | FR: Vérifie s'il y a une fête active | DE: Prüft, ob ein Feiertag aktiv ist
  const activeFestivity = getActiveFestivity(forceFestivity)
  const showFestiveButton = activeFestivity !== null && festiveEffectsEnabled
  
  // PT: Função para testar cada festividade | EN: Function to test each festivity | ES: Función para probar cada festividad | FR: Fonction pour tester chaque fête | DE: Funktion zum Testen jedes Feiertags
  const testFestivity = useCallback((festivity: FestiveType) => {
    setForceFestivity(festivity)
    setFestiveEffectsEnabled(true)
    setIsVisible(true)
    if (typeof window !== "undefined") {
      localStorage.setItem("dev-orbs-festive-effects", "true")
    }
  }, [])
  
  // PT: Lista de festividades para teste | EN: List of festivities for testing | ES: Lista de festividades para prueba | FR: Liste des fêtes pour test | DE: Liste der Feiertage zum Testen
  const testFestivities: Array<{ type: FestiveType; name: string; emoji: string }> = [
    { type: 'christmas', name: 'Natal', emoji: '🎄' },
    { type: 'newyear', name: 'Ano Novo', emoji: '🎉' },
    { type: 'easter', name: 'Páscoa', emoji: '🐰' },
    { type: 'halloween', name: 'Halloween', emoji: '🎃' },
    { type: 'carnival', name: 'Carnaval', emoji: '🎭' },
    { type: 'saojoao', name: 'São João', emoji: '🔥' },
    { type: 'childrensday', name: 'Dia das Crianças', emoji: '🎈' },
  ]

  if (!isMounted || canvasSize.width === 0 || canvasSize.height === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-text-secondary">Carregando canvas...</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden relative">
      {/* Toggle Button - Discreet, top right corner */}
      <button
        onClick={toggleVisibility}
        className="
          absolute top-2 right-2 z-10
          px-2 py-1
          text-xs
          text-text-secondary hover:text-text
          bg-page-secondary/80 hover:bg-page-secondary
          border border-border/50
          rounded
          opacity-60 hover:opacity-100
          transition-all
          backdrop-blur-sm
        "
        title={isVisible ? "Esconder orbs" : "Mostrar orbs"}
        aria-label={isVisible ? "Esconder orbs" : "Mostrar orbs"}
      >
        {isVisible ? "👁️" : "👁️‍🗨️"}
      </button>

      {/* PT: Botão para desativar efeitos festivos (só aparece quando há festividade) | EN: Button to disable festive effects (only appears when there's a holiday) | ES: Botón para desactivar efectos festivos (solo aparece cuando hay festividad) | FR: Bouton pour désactiver effets festifs (apparaît seulement s'il y a une fête) | DE: Schaltfläche zum Deaktivieren festlicher Effekte (erscheint nur bei Feiertagen) */}
      {showFestiveButton && (
        <button
          onClick={disableFestiveEffects}
          className="
            absolute top-2 left-2 z-20
            px-3 py-2
            text-sm font-medium
            text-white
            bg-gradient-to-r from-red-500 to-pink-500
            hover:from-red-600 hover:to-pink-600
            border border-red-400/50
            rounded-lg
            shadow-lg
            transition-all
            backdrop-blur-sm
            animate-pulse
          "
          title="Desativar efeitos festivos"
          aria-label="Desativar efeitos festivos"
        >
          🎄 Desativar Festivo
        </button>
      )}

      {/* PT: Botões de teste para cada efeito festivo (ocultos) | EN: Test buttons for each festive effect (hidden) | ES: Botones de prueba para cada efecto festivo (ocultos) | FR: Boutons de test pour chaque effet festif (cachés) | DE: Test-Schaltflächen für jeden festlichen Effekt (versteckt) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex flex-wrap gap-2 justify-center max-w-[90vw] hidden">
        {testFestivities.map((festivity) => (
          <button
            key={festivity.type}
            onClick={() => testFestivity(festivity.type)}
            className={`
              px-3 py-2
              text-xs font-medium
              rounded-lg
              shadow-lg
              transition-all
              backdrop-blur-sm
              border
              ${forceFestivity === festivity.type 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400/50 animate-pulse' 
                : 'bg-page-secondary/80 hover:bg-page-secondary text-text-secondary hover:text-text border-border/50'
              }
            `}
            title={`Testar ${festivity.name}`}
            aria-label={`Testar ${festivity.name}`}
          >
            {festivity.emoji} {festivity.name}
          </button>
        ))}
        <button
          onClick={() => {
            setForceFestivity(null)
            setFestiveEffectsEnabled(true)
            setIsVisible(true)
          }}
          className={`
            px-3 py-2
            text-xs font-medium
            rounded-lg
            shadow-lg
            transition-all
            backdrop-blur-sm
            border
            ${forceFestivity === null 
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400/50' 
              : 'bg-page-secondary/80 hover:bg-page-secondary text-text-secondary hover:text-text border-border/50'
            }
          `}
          title="Voltar ao normal (data real)"
          aria-label="Voltar ao normal"
        >
          🔄 Normal
        </button>
      </div>

      {/* PT: Overlay de confetes | EN: Confetti overlay | ES: Overlay de confeti | FR: Overlay de confettis | DE: Konfetti-Overlay */}
      {showConfetti && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => {
            const delay = Math.random() * 0.5
            const duration = 2 + Math.random() * 1
            const left = Math.random() * 100
            const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800']
            const color = colors[Math.floor(Math.random() * colors.length)]
            
            return (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${left}%`,
                  top: '-10px',
                  backgroundColor: color,
                  animation: `confetti-fall ${duration}s ease-in ${delay}s forwards`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            )
          })}
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="w-full h-full"
        style={{
          display: "block",
          imageRendering: themeId === "pixel" ? "pixelated" : "auto",
          touchAction: "none", // Prevent default touch behavior
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />
      
    </div>
  )
}
