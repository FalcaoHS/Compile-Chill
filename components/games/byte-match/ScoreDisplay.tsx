"use client"

interface ScoreDisplayProps {
  moves: number
  duration: number
  score: number
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${remainingSeconds}s`
}

export function ScoreDisplay({ moves, duration, score }: ScoreDisplayProps) {
  return (
    <div className="flex gap-4 sm:gap-6 justify-center mb-6 flex-wrap">
      {/* Moves */}
      <div className="
        px-4 py-3 sm:px-6 sm:py-4
        rounded-lg
        bg-page-secondary
        border border-border
        text-center
        min-w-[100px] sm:min-w-[120px]
      ">
        <div className="text-xs sm:text-sm text-text-secondary mb-1">
          Moves
        </div>
        <div className="text-xl sm:text-2xl font-bold text-text font-theme">
          {moves}
        </div>
      </div>
      
      {/* Timer */}
      <div className="
        px-4 py-3 sm:px-6 sm:py-4
        rounded-lg
        bg-page-secondary
        border border-border
        text-center
        min-w-[100px] sm:min-w-[120px]
      ">
        <div className="text-xs sm:text-sm text-text-secondary mb-1">
          Tempo
        </div>
        <div className="text-xl sm:text-2xl font-bold text-accent font-theme">
          {formatTime(duration)}
        </div>
      </div>
      
      {/* Score */}
      <div className="
        px-4 py-3 sm:px-6 sm:py-4
        rounded-lg
        bg-page-secondary
        border border-border
        text-center
        min-w-[100px] sm:min-w-[120px]
      ">
        <div className="text-xs sm:text-sm text-text-secondary mb-1">
          Score
        </div>
        <div className="text-xl sm:text-2xl font-bold text-primary font-theme">
          {score}
        </div>
      </div>
    </div>
  )
}

