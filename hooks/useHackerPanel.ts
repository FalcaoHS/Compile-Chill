/**
 * useHackerPanel Hook
 * 
 * React hook for managing Hacker Panel state, API data fetching, and log management.
 */

import { useEffect, useRef, useState, useCallback } from 'react'

export type LogType = 'info' | 'warn' | 'error' | 'debug' | 'status' | 'game'

export interface LogEntry {
  id: string
  type: LogType
  message: string
  timestamp: number
  isReal: boolean
  alpha: number
}

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

interface UseHackerPanelOptions {
  maxLogs?: number
  logInterval?: { min: number; max: number }
  autoScroll?: boolean
  enabled?: boolean
}

interface RecentLogin {
  username: string
  timestamp: string
}

/**
 * Fetch real data from API endpoints
 */
async function fetchHackerPanelData(): Promise<{
  onlineUsers: number
  activeGames: number
  recentLogins: RecentLogin[]
}> {
  try {
    const [onlineRes, activeGamesRes, recentLoginsRes] = await Promise.all([
      fetch('/api/stats/online').catch(() => null),
      fetch('/api/stats/active-games').catch(() => null),
      fetch('/api/stats/recent-logins').catch(() => null),
    ])

    const onlineData = onlineRes?.ok ? await onlineRes.json() : { count: 0 }
    const activeGamesData = activeGamesRes?.ok ? await activeGamesRes.json() : { count: 0 }
    const recentLoginsData = recentLoginsRes?.ok ? await recentLoginsRes.json() : { logins: [] }

    return {
      onlineUsers: onlineData.count || 0,
      activeGames: activeGamesData.count || 0,
      recentLogins: recentLoginsData.logins || [],
    }
  } catch (error) {
    console.error('Error fetching hacker panel data:', error)
    return {
      onlineUsers: 0,
      activeGames: 0,
      recentLogins: [],
    }
  }
}

export function useHackerPanel({
  maxLogs = 50,
  logInterval = { min: 1000, max: 3000 },
  autoScroll = true,
  enabled = true,
}: UseHackerPanelOptions = {}) {
  const [state, setState] = useState<HackerPanelState>({
    logs: [],
    onlineUsers: 0,
    activeGames: 0,
    lastLogin: null,
    lastScore: null,
    lastUpdate: Date.now(),
  })

  const nextLogTimeRef = useRef<number>(0)
  const logGeneratorRef = useRef<typeof import('@/lib/canvas/hacker-panel/log-generator').generateFakeLog | null>(null)

  // Lazy load log generator
  useEffect(() => {
    if (enabled && !logGeneratorRef.current) {
      import('@/lib/canvas/hacker-panel/log-generator').then((module) => {
        logGeneratorRef.current = module.generateFakeLog
      })
    }
  }, [enabled])

  // Fetch real data periodically
  useEffect(() => {
    if (!enabled) return

    const fetchData = async () => {
      const data = await fetchHackerPanelData()
      
      setState((prev) => {
        const lastLogin = data.recentLogins.length > 0
          ? {
              username: data.recentLogins[0].username,
              timestamp: new Date(data.recentLogins[0].timestamp).getTime(),
            }
          : prev.lastLogin

        return {
          ...prev,
          onlineUsers: data.onlineUsers,
          activeGames: data.activeGames,
          lastLogin,
          lastUpdate: Date.now(),
        }
      })
    }

    fetchData()
    const interval = setInterval(fetchData, 10000) // Update every 10s

    return () => clearInterval(interval)
  }, [enabled])

  // Add logs (real + fake)
  useEffect(() => {
    if (!enabled || !logGeneratorRef.current) return

    const addLog = () => {
      const now = Date.now()

      // Check if it's time to add a log
      if (now < nextLogTimeRef.current) return

      // Choose log type (70% fake, 30% real)
      const isReal = Math.random() < 0.3

      setState((prev) => {
        let log: LogEntry

        if (isReal) {
          // Real log based on API data
          const logType = Math.random() < 0.5 ? 'status' : 'game'
          let message = ''

          if (logType === 'status') {
            message = `[STATUS] Users online: ${prev.onlineUsers}`
          } else {
            message = `[GAME] Active games: ${prev.activeGames}`
          }

          // Sometimes show login info
          if (prev.lastLogin && Math.random() < 0.3) {
            const timeAgo = Math.floor((now - prev.lastLogin.timestamp) / 1000 / 60)
            message = `[AUTH] User ${prev.lastLogin.username} logged in ${timeAgo}m ago`
          }

          log = {
            id: `log-${now}-${Math.random()}`,
            type: logType === 'status' ? 'status' : 'game',
            message,
            timestamp: now,
            isReal: true,
            alpha: 1,
          }
        } else {
          // Fake log
          if (logGeneratorRef.current) {
            const fakeLog = logGeneratorRef.current()
            log = {
              id: `log-${now}-${Math.random()}`,
              type: fakeLog.type,
              message: fakeLog.message,
              timestamp: now,
              isReal: false,
              alpha: 1,
            }
          } else {
            return prev // No generator available, skip
          }
        }

        const newLogs = [...prev.logs, log]

        // Limit number of logs
        if (newLogs.length > maxLogs) {
          newLogs.shift()
        }

        // Schedule next log
        const interval =
          logInterval.min + Math.random() * (logInterval.max - logInterval.min)
        nextLogTimeRef.current = now + interval

        return {
          ...prev,
          logs: newLogs,
        }
      })
    }

    // Add first log immediately
    addLog()

    // Schedule next logs
    const interval = setInterval(addLog, 100)

    return () => clearInterval(interval)
  }, [enabled, maxLogs, logInterval])

  // Fade-out old logs
  useEffect(() => {
    if (!enabled) return

    const fadeOutInterval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        logs: prev.logs
          .map((log) => {
            const age = Date.now() - log.timestamp
            const fadeOutTime = 30000 // 30s

            if (age > fadeOutTime) {
              const fadeProgress = (age - fadeOutTime) / 5000 // 5s to fade
              return {
                ...log,
                alpha: Math.max(0, 1 - fadeProgress),
              }
            }

            return log
          })
          .filter((log) => log.alpha > 0),
      }))
    }, 1000)

    return () => clearInterval(fadeOutInterval)
  }, [enabled])

  // Get log color based on type
  const getLogColor = useCallback((type: LogType): string => {
    if (typeof window === 'undefined') return '#7ef9ff'

    const root = document.documentElement
    const computedStyle = getComputedStyle(root)

    switch (type) {
      case 'info':
      case 'status':
        return computedStyle.getPropertyValue('--color-primary').trim() || '#7ef9ff'
      case 'warn':
        return computedStyle.getPropertyValue('--color-accent').trim() || '#7dd3fc'
      case 'error':
        return '#ff4444'
      case 'debug':
      case 'game':
        return computedStyle.getPropertyValue('--color-muted').trim() || '#94a3b8'
      default:
        return computedStyle.getPropertyValue('--color-text').trim() || '#e2e8f0'
    }
  }, [])

  return {
    state,
    getLogColor,
    autoScroll,
  }
}

