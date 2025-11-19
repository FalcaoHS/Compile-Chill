/**
 * useEmotes Hook
 * 
 * React hook for managing emotes system
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useThemeStore } from '@/lib/theme-store'
import { EmoteManager } from '@/lib/canvas/emotes/EmoteManager'
import { EmoteRenderer } from '@/lib/canvas/emotes/EmoteRenderer'
import {
  EmoteManagerConfig,
  ThemeColors,
  EmoteType,
} from '@/lib/canvas/emotes/emote-types'
import { EMOTE_TEXT_MAP } from '@/lib/canvas/emotes/emote-types'
import { getEmoteById } from '@/lib/canvas/emotes/emote-loader'

/**
 * Get theme colors from CSS variables (matches DevOrbsCanvas pattern)
 */
function getCurrentThemeColors(): ThemeColors | null {
  if (typeof window === 'undefined') return null

  const root = document.documentElement
  const computedStyle = getComputedStyle(root)

  return {
    primary: computedStyle.getPropertyValue('--color-primary').trim(),
    accent: computedStyle.getPropertyValue('--color-accent').trim(),
    text: computedStyle.getPropertyValue('--color-text').trim(),
    glow: computedStyle.getPropertyValue('--color-glow').trim(),
    bg: computedStyle.getPropertyValue('--color-bg').trim(),
    bgSecondary: computedStyle.getPropertyValue('--color-bg-secondary').trim(),
    border: computedStyle.getPropertyValue('--color-border').trim(),
  }
}

interface UseEmotesOptions {
  canvasWidth: number
  canvasHeight: number
  enabled?: boolean
}

export function useEmotes({
  canvasWidth,
  canvasHeight,
  enabled = true,
}: UseEmotesOptions) {
  const { theme: themeId } = useThemeStore()
  const managerRef = useRef<EmoteManager | null>(null)
  const rendererRef = useRef<EmoteRenderer | null>(null)
  const animationFrameRef = useRef<number>()
  const lastFrameTimeRef = useRef<number>(Date.now())

  // Initialize manager and renderer
  useEffect(() => {
    if (!enabled || canvasWidth === 0 || canvasHeight === 0) return

    const config: EmoteManagerConfig = {
      chatDuration: 1500, // 1.5s
      multiplayerDuration: 1200, // 1.2s
      maxActiveEmotes: 10,
      canvasWidth,
      canvasHeight,
    }

    const renderer = new EmoteRenderer({
      fontSize: 20,
      fontFamily: "'JetBrains Mono', monospace",
      glowIntensity: 12,
      glitchEnabled: true,
      pixelationEnabled: false,
      scanlinesEnabled: false,
    })

    const getThemeColors = () => getCurrentThemeColors()

    const manager = new EmoteManager(config, renderer, getThemeColors)

    rendererRef.current = renderer
    managerRef.current = manager

    return () => {
      if (managerRef.current) {
        managerRef.current.clear()
        managerRef.current = null
      }
      rendererRef.current = null
    }
  }, [canvasWidth, canvasHeight, enabled])

  // Track mouse position for reactivity
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!enabled) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [enabled])

  // Animation loop
  useEffect(() => {
    if (!enabled || !managerRef.current) return

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTimeRef.current
      lastFrameTimeRef.current = currentTime

      if (managerRef.current) {
        managerRef.current.update(
          deltaTime,
          undefined,
          mousePos?.x,
          mousePos?.y
        )
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [enabled, mousePos])

  // Render emotes
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (managerRef.current) {
        managerRef.current.draw(ctx, themeId, mousePos?.x, mousePos?.y)
      }
    },
    [themeId, mousePos]
  )

  // Trigger drop reactivity
  const triggerDropReactivity = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.triggerDropReactivity()
    }
  }, [])

  // Spawn chat emote
  const spawnChat = useCallback(
    (text: string, x: number, y: number, emoteId?: string): string | null => {
      if (managerRef.current) {
        return managerRef.current.spawnChat(text, x, y, themeId, emoteId)
      }
      return null
    },
    [themeId]
  )

  // Get user's X ID for permission checking
  const { data: session } = useSession()
  const [userXId, setUserXId] = useState<string | null>(null)

  // Fetch user's X ID or username
  useEffect(() => {
    if (session?.user) {
      fetch('/api/users/me')
        .then(res => res.json())
        .then(data => {
          // Prefer xUsername (slug), fallback to xId (numeric)
          if (data.user?.xUsername) {
            setUserXId(data.user.xUsername)
          } else if (data.user?.xId) {
            setUserXId(data.user.xId)
          } else if (data.user?.handle) {
            // Legacy fallback
            setUserXId(data.user.handle)
          }
        })
        .catch(() => {
          // Silent fail - user just won't be able to use unique emotes
        })
    } else {
      setUserXId(null)
    }
  }, [session])

  // Spawn emote by type or ID
  const spawnEmote = useCallback(
    (typeOrId: EmoteType | string, x: number, y: number): string | null => {
      if (!managerRef.current) return null
      
      // Always try to get from emote data first (for IDs from JSON)
      const emoteData = getEmoteById(typeOrId as string)
      if (emoteData) {
        // Check permission for unique emotes
        // Can match by xId (numeric) or xUsername (slug)
        if (emoteData.rarity === 'unique' && emoteData.ownerXId) {
          // Try to get username from API if we only have xId
          if (userXId && userXId !== emoteData.ownerXId) {
            // Check if userXId is numeric (xId) and we need to compare with username
            // For now, we'll do exact match - if it doesn't match, deny
            // TODO: Could fetch username from API if needed
            const isNumeric = /^\d+$/.test(userXId)
            const ownerIsNumeric = /^\d+$/.test(emoteData.ownerXId)
            
            // If both are numeric (IDs) or both are usernames, do exact match
            if ((isNumeric && ownerIsNumeric) || (!isNumeric && !ownerIsNumeric)) {
              if (userXId !== emoteData.ownerXId) {
                
                return null
              }
            }
            // If one is ID and other is username, we'd need to fetch username from API
            // For now, deny if not exact match
            else if (userXId !== emoteData.ownerXId) {
              
              return null
            }
          } else if (!userXId) {
            
            return null
          }
        }
        return managerRef.current.spawnChat(emoteData.label, x, y, themeId, emoteData.id)
      }
      
      // Check if it's a known emote type
      if (typeOrId in EMOTE_TEXT_MAP) {
        const text = EMOTE_TEXT_MAP[typeOrId as EmoteType]
        return spawnChat(text, x, y)
      }
      
      // If not found, try to spawn with the string as text BUT pass the ID as emoteId
      // This allows EmoteManager to try to find it by ID in spawnChat
      return managerRef.current.spawnChat(typeOrId as string, x, y, themeId, typeOrId as string)
    },
    [spawnChat, themeId, userXId]
  )

  // Spawn multiplayer emote
  const spawnMultiplayer = useCallback(
    (text: string, playerX: number, playerY: number): string | null => {
      if (managerRef.current) {
        return managerRef.current.spawnMultiplayer(text, playerX, playerY, themeId)
      }
      return null
    },
    [themeId]
  )

  // Get active count
  const getActiveCount = useCallback(() => {
    return managerRef.current?.getActiveCount() || 0
  }, [])

  return {
    draw,
    spawnChat,
    spawnEmote,
    spawnMultiplayer,
    getActiveCount,
    triggerDropReactivity,
  }
}

