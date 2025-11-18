"use client"

import { useThemeStore } from "@/lib/theme-store"

interface ScoreDisplayProps {
  moves: number
  duration: number
  score: number
}

export function ScoreDisplay({ moves, duration, score }: ScoreDisplayProps) {
  const { theme } = useThemeStore()
  
  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }
  
  return (
    <div className="w-full flex items-center justify-center gap-4 sm:gap-6 md:gap-8 py-4">
      <div className="text-center">
        <div className="text-xs sm:text-sm text-text-secondary mb-1">
          Movimentos
        </div>
        <div className="text-lg sm:text-xl md:text-2xl font-bold text-text font-theme">
          {moves}
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-xs sm:text-sm text-text-secondary mb-1">
          Tempo
        </div>
        <div className="text-lg sm:text-xl md:text-2xl font-bold text-text font-theme">
          {formatTime(duration)}
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-xs sm:text-sm text-text-secondary mb-1">
          Score
        </div>
        <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary font-theme">
          {score.toLocaleString()}
        </div>
      </div>
    </div>
  )
}

