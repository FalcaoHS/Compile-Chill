/**
 * HackerPanel Component
 * 
 * Painel estilo terminal hacker com logs reais e fake.
 * Canvas para fundo animado + HTML para logs.
 */

"use client"

import { useEffect, useRef } from 'react'
import { useThemeStore } from '@/lib/theme-store'
import { useHackerPanel } from '@/hooks/useHackerPanel'
import { HackerCanvas } from './HackerCanvas'

interface HackerPanelProps {
  className?: string
  maxLogs?: number
  logInterval?: { min: number; max: number }
  autoScroll?: boolean
  enabled?: boolean
}

export function HackerPanel({
  className = '',
  maxLogs = 50,
  logInterval = { min: 1000, max: 3000 },
  autoScroll = true,
  enabled = true,
}: HackerPanelProps) {
  const { theme: themeId } = useThemeStore()
  const { state, getLogColor, autoScroll: shouldAutoScroll } = useHackerPanel({
    maxLogs,
    logInterval,
    autoScroll,
    enabled,
  })
  const logContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Auto-scroll to latest entry
  useEffect(() => {
    if (shouldAutoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [state.logs, shouldAutoScroll])

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
        className="relative z-10 h-full overflow-y-auto overflow-x-hidden"
        style={{
          maxHeight: '400px',
          padding: '1rem',
          fontFamily: 'var(--font)',
          fontSize: '14px',
          lineHeight: '1.6',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--color-primary) transparent',
        }}
      >
        {state.logs.map((log) => (
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

        {/* Blinking cursor */}
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

