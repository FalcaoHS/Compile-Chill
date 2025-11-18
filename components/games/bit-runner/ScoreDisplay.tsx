"use client"

interface ScoreDisplayProps {
  distance: number
  bestDistance: number
}

export function ScoreDisplay({ distance, bestDistance }: ScoreDisplayProps) {
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
          Distance
        </div>
        <div className="text-xl sm:text-2xl font-bold text-text font-theme">
          {Math.floor(distance)}m
        </div>
      </div>
      
      {bestDistance > 0 && (
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
            {Math.floor(bestDistance)}m
          </div>
        </div>
      )}
    </div>
  )
}

