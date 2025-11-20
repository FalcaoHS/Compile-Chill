"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useThemeStore } from "@/lib/theme-store"
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

interface Orb {
  id: string
  userId: number
  avatar: string | null
  username: string
  body: Matter.Body
  image: HTMLImageElement | null
  imageLoaded: boolean
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

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setIsMounted(true)
    const size = calculateCanvasSize()
        if (size.width > 0 && size.height > 0) {
      setCanvasSize(size)
    } else {
      // Retry after a short delay
      setTimeout(() => {
        const retrySize = calculateCanvasSize()
                if (retrySize.width > 0 && retrySize.height > 0) {
          setCanvasSize(retrySize)
        }
      }, 100)
    }
  }, [])

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
    
    // Create orb object
    const orb: Orb = {
      id: `orb-${user.userId}-${index}`,
      userId: user.userId,
      avatar: user.avatar,
      username: user.username,
      body,
      image: null,
      imageLoaded: false,
    }

    // Load avatar image via proxy
    if (user.userId) {
      loadAvatarImage(user.userId, orb.id).then((img) => {
        orb.image = img
        orb.imageLoaded = true
      })
    } else {
      orb.imageLoaded = true // No avatar to load
    }

    // Add to physics world
    addBodyToWorld(worldRef.current, body)
    orbsRef.current.push(orb)
  }, [loadAvatarImage])

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

    // Setup collision detection for scoring
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair
        const sensor = sensorBodyRef.current
        
        if (!sensor) return

        // Check if collision involves sensor and an orb
        if ((bodyA === sensor || bodyB === sensor)) {
          const orbBody = bodyA === sensor ? bodyB : bodyA
          
          // Find the orb
          const orb = orbsRef.current.find((o) => o.body === orbBody)
          if (orb && !scoredOrbsRef.current.has(orb.id)) {
            // CRITICAL: Only score if orb is moving downward with sufficient velocity
            // This prevents scoring when orb bounces UP through the sensor or is barely moving
            const velocity = orbBody.velocity
            const MIN_DOWNWARD_VELOCITY = 2 // Minimum downward velocity to register as "falling into basket"
            if (velocity.y < MIN_DOWNWARD_VELOCITY) {
              // Orb is moving upward, stationary, or falling too slowly - don't score
              return
            }
            
            // Mark as scored to prevent double scoring
            scoredOrbsRef.current.add(orb.id)
            
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
    
    isShakingRef.current = true
    
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
    
    // Vibrate rim slightly
    rimShakeRef.current = 3
    setTimeout(() => {
      rimShakeRef.current = 0
    }, 100)
    
    // Shake backboard slightly
    backboardShakeRef.current = 2
    setTimeout(() => {
      backboardShakeRef.current = 0
    }, 100)
    
    // Reset after 0.8s
    setTimeout(() => {
      // Restore original restitution
      orbsRef.current.forEach((orb) => {
        const config = getPhysicsConfig()
        orb.body.restitution = config.restitution
      })
      isShakingRef.current = false
    }, 800)
  }, [])

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
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement
      if (target !== canvas) return

      const pos = getPointerPos(e)
      if (!pos || !worldRef.current) return

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
          // If no drag movement detected, apply gentle downward velocity
          // This prevents orbs from being "stuck" when released without movement
          Body.setVelocity(orb.body, {
            x: 0,
            y: 2, // Gentle downward push
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
    ctx.fillStyle = colors.accent // Use neon color (slightly less saturated would be ideal, but using accent for now)
    ctx.font = '600 11px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText('HI-SCORE', leftModuleX + moduleWidth / 2, titleY)

    // Draw 2 LED digits for HI-SCORE (best score)
    const digitWidth = 35
    const digitGap = 6 // Space between digits
    const leftDigitsStartX = leftModuleX + modulePadding + (moduleWidth - modulePadding * 2 - (digitWidth * 2 + digitGap)) / 2 // Center the 2 digits
    const bestStr = bestScoreRef.current.toString().padStart(2, '0').slice(-2) // Last 2 digits
    for (let i = 0; i < 2; i++) {
      const digitX = leftDigitsStartX + i * (digitWidth + digitGap)
      const digitValue = parseInt(bestStr[i] || '0')
      drawDigit(ctx, digitX, digitY, digitValue, colors.accent, digitScaleRef.current)
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
      drawDigit(ctx, digitX, digitY, digitValue, colors.accent, digitScaleRef.current)
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
    ctx.restore()
  }, [canvasSize.width, canvasSize.height, isFPSLevel1, isFPSLevel2])

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

    // Apply pulse alpha effect
    // FPS Guardian Level 1: Decrease neon opacity by 50%
    let alpha = rimAlphaRef.current
    if (isFPSLevel1) {
      alpha *= 0.5
    }
    ctx.globalAlpha = alpha

    // Layer 1: Main neon arc (thick)
    ctx.strokeStyle = colors.accent
    ctx.lineWidth = 6
    // FPS Guardian Level 1: Reduce glow intensity by 50%
    const baseGlow = rimGlowRef.current // Dynamic glow (8 default, 16 on score)
    ctx.shadowBlur = isFPSLevel1 ? baseGlow * 0.5 : baseGlow
    ctx.shadowOffsetY = 4 // Vertical offset for depth
    ctx.shadowColor = colors.accent // Use neon color directly
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI)
    ctx.stroke()

    // Layer 2: Secondary neon arc (thin, 3px below)
    ctx.strokeStyle = colors.accent
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
              
              // PT: Pomemin theme: desenha reflexo com orelhinhas | EN: Pomemin theme: draws reflection with ears | ES: Tema Pomemin: dibuja reflejo con orejitas | FR: Thème Pomemin: dessine réflexion avec oreilles | DE: Pomemin-Theme: zeichnet Reflexion mit Ohren
              if (themeId === "pomemin") {
                // Draw orb with ears reflection (Pokémon style) - inverted vertically
                ctx.save()
                ctx.translate(pos.x, reflectionY)
                ctx.scale(1, -1) // Invert vertically
                ctx.translate(-pos.x, -reflectionY)
                
                const earSize = radius * 0.4
                const earOffset = radius * 0.3
                
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
                
                // Draw avatar if loaded (clipped to circle)
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
