"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface GameOverModalProps {
  isOpen: boolean
  score: number
  bestScore: number
  time: number
  moves: number
  level: number
  onPlayAgain: () => void
  onNextLevel?: () => void
  hasNextLevel?: boolean
}

export function GameOverModal({
  isOpen,
  score,
  bestScore,
  time,
  moves,
  level,
  onPlayAgain,
  onNextLevel,
  hasNextLevel,
}: GameOverModalProps) {
  const isNewBest = score === bestScore && score > 0

  // Format time as MM:SS
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onPlayAgain}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="
                w-full max-w-md
                bg-page-secondary
                border-2 border-border
                rounded-xl
                shadow-glow
                p-6 sm:p-8
              "
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-text font-theme">
                  Puzzle Complete!
                </h2>
                
                {isNewBest && (
                  <div className="text-primary text-lg sm:text-xl font-medium">
                    🎉 Novo recorde!
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-text-secondary mb-1">
                      Score Final
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-text font-theme">
                      {score.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-text-secondary mb-1">
                        Tempo
                      </div>
                      <div className="text-lg font-bold text-text font-theme">
                        {formatTime(time)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-text-secondary mb-1">
                        Movimentos
                      </div>
                      <div className="text-lg font-bold text-text font-theme">
                        {moves}
                      </div>
                    </div>
                  </div>
                  
                  {bestScore > 0 && (
                    <div>
                      <div className="text-sm text-text-secondary mb-1">
                        Melhor Score
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-primary font-theme">
                        {bestScore.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {hasNextLevel && onNextLevel && (
                    <button
                      onClick={onNextLevel}
                      className="
                        flex-1
                        px-6 py-3
                        bg-primary text-page
                        rounded-lg
                        font-medium
                        hover:bg-primary-hover
                        transition-colors
                        shadow-glow-sm
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                      "
                    >
                      Próximo Nível
                    </button>
                  )}
                  <button
                    onClick={onPlayAgain}
                    className="
                      flex-1
                      px-6 py-3
                      bg-primary text-page
                      rounded-lg
                      font-medium
                      hover:bg-primary-hover
                      transition-colors
                      shadow-glow-sm
                      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    "
                  >
                    Jogar Novamente
                  </button>
                  
                  <Link
                    href="/"
                    className="
                      flex-1
                      px-6 py-3
                      border-2 border-border text-text
                      rounded-lg
                      font-medium
                      hover:bg-page
                      transition-colors
                      text-center
                      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    "
                  >
                    Voltar ao Início
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

