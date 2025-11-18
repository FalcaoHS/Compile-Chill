"use client"

interface ScoreDisplayProps {
  score: number
  bestScore: number
}

export function ScoreDisplay({ score, bestScore }: ScoreDisplayProps) {
  return (
    <div className="flex gap-4 sm:gap-6 justify-center mb-6">
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
        <div className="text-xl sm:text-2xl font-bold text-text font-theme">
          {score.toLocaleString()}
        </div>
      </div>
      
      {bestScore > 0 && (
        <div className="
          px-4 py-3 sm:px-6 sm:py-4
          rounded-lg
          bg-page-secondary
          border border-border
          text-center
          min-w-[100px] sm:min-w-[120px]
        ">
          <div className="text-xs sm:text-sm text-text-secondary mb-1">
            Best
          </div>
          <div className="text-xl sm:text-2xl font-bold text-primary font-theme">
            {bestScore.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  )
}

