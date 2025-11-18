/**
 * HackerPanel Component
 * 
 * Painel estilo terminal hacker com logs reais e fake.
 * Canvas para fundo animado + HTML para logs.
 */

"use client"

import { useEffect, useRef, useState } from 'react'
import { useThemeStore } from '@/lib/theme-store'
import { HackerPanelState, LogEntry, LogType } from '../interfaces'
import { HackerCanvas } from './HackerCanvas'
import { generateFakeLog } from './log-generator'

interface HackerPanelProps {
  className?: string
  maxLogs?: number
  logInterval?: { min: number; max: number }
  autoScroll?: boolean
}

export function HackerPanel({
  className = '',
  maxLogs = 50,
  logInterval = { min: 1000, max: 3000 },
  autoScroll = true,
}: HackerPanelProps) {
  const { theme: themeId } = useThemeStore()
  const [state, setState] = useState<HackerPanelState>({
    logs: [],
    onlineUsers: 0,
    activeGames: 0,
    lastLogin: null,
    lastScore: null,
    lastUpdate: Date.now(),
  })
  const logContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nextLogTimeRef = useRef<number>(0)

  // Buscar dados reais
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar usuários online
        const usersRes = await fetch('/api/users/online')
        const usersData = await usersRes.json()

        // Buscar jogos ativos
        const gamesRes = await fetch('/api/games/active')
        const gamesData = await gamesRes.json()

        setState(prev => ({
          ...prev,
          onlineUsers: usersData.count || 0,
          activeGames: gamesData.count || 0,
          lastUpdate: Date.now(),
        }))
      } catch (error) {
        console.error('Error fetching hacker panel data:', error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 10000) // Atualizar a cada 10s

    return () => clearInterval(interval)
  }, [])

  // Adicionar logs
  useEffect(() => {
    const addLog = () => {
      const now = Date.now()

      // Verificar se é hora de adicionar log
      if (now < nextLogTimeRef.current) return

      // Escolher tipo de log (70% fake, 30% real)
      const isReal = Math.random() < 0.3

      let log: LogEntry

      if (isReal) {
        // Log real
        const logType = Math.random() < 0.5 ? 'status' : 'game'
        let message = ''

        if (logType === 'status') {
          message = `[STATUS] Users online: ${state.onlineUsers}`
        } else {
          message = `[GAME] Active games: ${state.activeGames}`
        }

        log = {
          id: `log-${Date.now()}-${Math.random()}`,
          type: logType,
          message,
          timestamp: now,
          isReal: true,
          alpha: 1,
        }
      } else {
        // Log fake
        log = {
          id: `log-${Date.now()}-${Math.random()}`,
          type: generateFakeLog().type,
          message: generateFakeLog().message,
          timestamp: now,
          isReal: false,
          alpha: 1,
        }
      }

      setState(prev => {
        const newLogs = [...prev.logs, log]

        // Limitar número de logs
        if (newLogs.length > maxLogs) {
          newLogs.shift()
        }

        return {
          ...prev,
          logs: newLogs,
        }
      })

      // Agendar próximo log
      const interval =
        logInterval.min + Math.random() * (logInterval.max - logInterval.min)
      nextLogTimeRef.current = now + interval
    }

    // Adicionar primeiro log imediatamente
    addLog()

    // Agendar próximos logs
    const interval = setInterval(addLog, 100)

    return () => clearInterval(interval)
  }, [state.onlineUsers, state.activeGames, maxLogs, logInterval])

  // Fade-out de logs antigos
  useEffect(() => {
    const fadeOutInterval = setInterval(() => {
      setState(prev => ({
        ...prev,
        logs: prev.logs.map(log => {
          const age = Date.now() - log.timestamp
          const fadeOutTime = 30000 // 30s

          if (age > fadeOutTime) {
            const fadeProgress = (age - fadeOutTime) / 5000 // 5s para desaparecer
            return {
              ...log,
              alpha: Math.max(0, 1 - fadeProgress),
            }
          }

          return log
        }).filter(log => log.alpha > 0),
      }))
    }, 1000)

    return () => clearInterval(fadeOutInterval)
  }, [])

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [state.logs, autoScroll])

  // Obter cor do log baseado no tipo
  const getLogColor = (type: LogType): string => {
    const root = document.documentElement
    const computedStyle = getComputedStyle(root)

    switch (type) {
      case 'info':
        return computedStyle.getPropertyValue('--color-primary').trim()
      case 'warn':
        return computedStyle.getPropertyValue('--color-accent').trim()
      case 'error':
        return '#ff4444'
      case 'debug':
        return computedStyle.getPropertyValue('--color-muted').trim()
      default:
        return computedStyle.getPropertyValue('--color-text').trim()
    }
  }

  return (
    <div
      className={`relative ${className}`}
      style={{
        fontFamily: 'var(--font)',
        fontSize: 'var(--font-size-base)',
      }}
    >
      {/* Canvas Background */}
      <HackerCanvas
        ref={canvasRef}
        theme={themeId}
        className="absolute inset-0"
      />

      {/* Log Container */}
      <div
        ref={logContainerRef}
        className="relative z-10 h-full overflow-hidden"
        style={{
          maxHeight: '400px',
          padding: '1rem',
          fontFamily: 'var(--font)',
          fontSize: '14px',
          lineHeight: '1.6',
        }}
      >
        {state.logs.map(log => (
          <div
            key={log.id}
            className="mb-1"
            style={{
              color: getLogColor(log.type),
              opacity: log.alpha,
              transition: 'opacity 0.3s ease',
            }}
          >
            <span className="opacity-60">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>{' '}
            {log.message}
          </div>
        ))}

        {/* Cursor piscando */}
        <span
          className="inline-block ml-1"
          style={{
            animation: 'blink 1s infinite',
            color: getLogColor('info'),
          }}
        >
          |
        </span>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

