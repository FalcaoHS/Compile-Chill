"use client"

interface ScoreDisplayProps {
  score: number
  bestScore: number
  time: number
  moves: number
  level?: number
}

export function ScoreDisplay({ score, bestScore, time, moves, level }: ScoreDisplayProps) {
  // Format time as MM:SS
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex gap-2 sm:gap-4 justify-center flex-wrap">
      <div 
        className="
          px-3 py-2 sm:px-4 sm:py-3
          rounded-lg
          bg-page-secondary
          border border-border
          text-center
          min-w-[80px] sm:min-w-[100px]
          cursor-help
        "
        title="Pontuação baseada em movimentos e tempo. Menos movimentos e menos tempo = maior pontuação!"
      >
        <div className="text-xs text-text-secondary mb-1">
          Score
        </div>
        <div className="text-lg sm:text-xl font-bold text-text font-theme">
          {score.toLocaleString()}
        </div>
      </div>
      
      {bestScore > 0 && (
        <div 
          className="
            px-3 py-2 sm:px-4 sm:py-3
            rounded-lg
            bg-page-secondary
            border border-border
            text-center
            min-w-[80px] sm:min-w-[100px]
            cursor-help
          "
          title="Melhor pontuação alcançada neste nível"
        >
          <div className="text-xs text-text-secondary mb-1">
            Best
          </div>
          <div className="text-lg sm:text-xl font-bold text-primary font-theme">
            {bestScore.toLocaleString()}
          </div>
        </div>
      )}

      <div 
        className="
          px-3 py-2 sm:px-4 sm:py-3
          rounded-lg
          bg-page-secondary
          border border-border
          text-center
          min-w-[80px] sm:min-w-[100px]
          cursor-help
        "
        title="Tempo decorrido desde o início do nível"
      >
        <div className="text-xs text-text-secondary mb-1">
          Time
        </div>
        <div className="text-lg sm:text-xl font-bold text-text font-theme">
          {formatTime(time)}
        </div>
      </div>

      <div 
        className="
          px-3 py-2 sm:px-4 sm:py-3
          rounded-lg
          bg-page-secondary
          border border-border
          text-center
          min-w-[80px] sm:min-w-[100px]
          cursor-help
        "
        title="Número de movimentos realizados. Menos movimentos = maior pontuação!"
      >
        <div className="text-xs text-text-secondary mb-1">
          Moves
        </div>
        <div className="text-lg sm:text-xl font-bold text-text font-theme">
          {moves}
        </div>
      </div>

      {level && (
        <div 
          className="
            px-3 py-2 sm:px-4 sm:py-3
            rounded-lg
            bg-page-secondary
            border border-border
            text-center
            min-w-[80px] sm:min-w-[100px]
            cursor-help
          "
          title={`Nível ${level} de ${10} níveis disponíveis`}
        >
          <div className="text-xs text-text-secondary mb-1">
            Level
          </div>
          <div className="text-lg sm:text-xl font-bold text-accent font-theme">
            {level}
          </div>
        </div>
      )}
    </div>
  )
}

