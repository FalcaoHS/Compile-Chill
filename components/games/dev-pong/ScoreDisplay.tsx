"use client"

interface ScoreDisplayProps {
  playerScore: number
  aiScore: number
}

export function ScoreDisplay({ playerScore, aiScore }: ScoreDisplayProps) {
  return (
    <div className="flex gap-4 sm:gap-8 justify-center mb-6">
      {/* Player Score */}
      <div className="
        px-4 py-3 sm:px-6 sm:py-4
        rounded-lg
        bg-page-secondary
        border border-border
        text-center
        min-w-[100px] sm:min-w-[120px]
      ">
        <div className="text-xs sm:text-sm text-text-secondary mb-1">
          Você
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-primary font-theme">
          {playerScore}
        </div>
      </div>
      
      {/* Separator */}
      <div className="flex items-center">
        <div className="text-2xl sm:text-3xl font-bold text-text-secondary font-theme">
          —
        </div>
      </div>
      
      {/* AI Score */}
      <div className="
        px-4 py-3 sm:px-6 sm:py-4
        rounded-lg
        bg-page-secondary
        border border-border
        text-center
        min-w-[100px] sm:min-w-[120px]
      ">
        <div className="text-xs sm:text-sm text-text-secondary mb-1">
          IA
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-accent font-theme">
          {aiScore}
        </div>
      </div>
    </div>
  )
}

