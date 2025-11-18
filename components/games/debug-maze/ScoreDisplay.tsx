"use client"

interface ScoreDisplayProps {
  moves: number
  duration: number
  level: number
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function ScoreDisplay({ moves, duration, level }: ScoreDisplayProps) {
  return (
    <div className="flex gap-2 sm:gap-4 justify-center mb-4">
      <div className="
        px-3 py-2 sm:px-4 sm:py-3
        rounded-lg
        bg-page-secondary
        border border-border
        text-center
        min-w-[80px] sm:min-w-[100px]
      ">
        <div className="text-xs text-text-secondary mb-1">
          Movimentos
        </div>
        <div className="text-lg sm:text-xl font-bold text-text font-theme">
          {moves}
        </div>
      </div>
      
      <div className="
        px-3 py-2 sm:px-4 sm:py-3
        rounded-lg
        bg-page-secondary
        border border-border
        text-center
        min-w-[80px] sm:min-w-[100px]
      ">
        <div className="text-xs text-text-secondary mb-1">
          Tempo
        </div>
        <div className="text-lg sm:text-xl font-bold text-text font-theme">
          {formatTime(duration)}
        </div>
      </div>
      
      <div className="
        px-3 py-2 sm:px-4 sm:py-3
        rounded-lg
        bg-page-secondary
        border border-border
        text-center
        min-w-[80px] sm:min-w-[100px]
      ">
        <div className="text-xs text-text-secondary mb-1">
          Nível
        </div>
        <div className="text-lg sm:text-xl font-bold text-primary font-theme">
          {level}
        </div>
      </div>
    </div>
  )
}

