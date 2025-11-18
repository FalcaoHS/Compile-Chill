/**
 * Canvas Restart Button
 * 
 * Button to manually restart canvas after crashes.
 */

"use client"

import { forceReset, isInFallback, getCrashState } from '@/lib/performance/canvas-crash-resilience'
import { useState, useEffect } from 'react'
import { showToast } from './Toast'

export function CanvasRestartButton() {
  const [showButton, setShowButton] = useState(false)
  const [crashState, setCrashState] = useState(getCrashState())

  useEffect(() => {
    // Check crash state periodically
    const interval = setInterval(() => {
      const state = getCrashState()
      setCrashState(state)
      setShowButton(state.isInFallback || state.crashCount > 0)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleRestart = () => {
    forceReset()
    setShowButton(false)
    showToast('Canvas reiniciado com sucesso!', 'success')
    // Force page reload to fully reset canvas
    window.location.reload()
  }

  if (!showButton) return null

  return (
    <button
      onClick={handleRestart}
      className="fixed bottom-4 left-4 z-50 px-4 py-2 bg-page-secondary text-text border border-border rounded hover:bg-page-secondary/80 hover:border-primary transition-colors text-sm font-theme flex items-center gap-2 shadow-lg"
      style={{ pointerEvents: 'auto' }}
      aria-label="Reiniciar visual"
    >
      <span className="text-primary">[</span>
      <span>Reiniciar Visual</span>
      <span className="text-primary">]</span>
    </button>
  )
}

