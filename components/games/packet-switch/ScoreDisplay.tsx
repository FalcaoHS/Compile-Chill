"use client"

interface ScoreDisplayProps {
  score: number
  bestScore: number
  time: number
  moves: number
  packetsDelivered: number
}

export function ScoreDisplay({ score, bestScore, time, moves, packetsDelivered }: ScoreDisplayProps) {
  // Format time as MM:SS
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
      <div className="
        px-3 py-2 sm:px-4 sm:py-3
        rounded-lg
        bg-page-secondary
        border border-border
        text-center
        min-w-[80px] sm:min-w-[100px]
      ">
        <div className="text-xs text-text-secondary mb-1">
          Score
        </div>
        <div className="text-lg sm:text-xl font-bold text-text font-theme">
          {score.toLocaleString()}
        </div>
      </div>
      
      {bestScore > 0 && (
        <div className="
          px-3 py-2 sm:px-4 sm:py-3
          rounded-lg
          bg-page-secondary
          border border-border
          text-center
          min-w-[80px] sm:min-w-[100px]
        ">
          <div className="text-xs text-text-secondary mb-1">
            Best
          </div>
          <div className="text-lg sm:text-xl font-bold text-primary font-theme">
            {bestScore.toLocaleString()}
          </div>
        </div>
      )}

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
          {formatTime(time)}
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
          Moves
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
          Pacotes
        </div>
        <div className="text-lg sm:text-xl font-bold text-text font-theme">
          {packetsDelivered}
        </div>
      </div>
    </div>
  )
}

