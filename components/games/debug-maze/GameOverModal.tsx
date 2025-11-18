"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { calculateScore } from "@/lib/games/debug-maze/game-logic"
import type { GameState } from "@/lib/games/debug-maze/game-logic"

interface GameOverModalProps {
  isOpen: boolean
  gameState: GameState
  onPlayAgain: () => void
  onNextLevel?: () => void
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function GameOverModal({
  isOpen,
  gameState,
  onPlayAgain,
  onNextLevel,
}: GameOverModalProps) {
  const score = calculateScore(gameState)
  const hasNextLevel = gameState.level < 8 // Assuming max 8 levels for now

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
                p-4 sm:p-6
              "
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-text font-theme">
                  {gameState.gameCompleted ? 'Nível Completo!' : 'Game Over'}
                </h2>
                
                {gameState.gameCompleted && (
                  <div className="text-primary text-base sm:text-lg font-medium">
                    🎉 Parabéns!
                  </div>
                )}
                
                <div className="space-y-3">
                  <div>
                    <div className="text-xs sm:text-sm text-text-secondary mb-1">
                      Score
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-primary font-theme">
                      {score}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-text-secondary mb-1">
                        Movimentos
                      </div>
                      <div className="text-lg font-bold text-text font-theme">
                        {gameState.moves}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-text-secondary mb-1">
                        Tempo
                      </div>
                      <div className="text-lg font-bold text-text font-theme">
                        {formatTime(gameState.duration)}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-text-secondary mb-1">
                      Nível
                    </div>
                    <div className="text-lg font-bold text-text font-theme">
                      {gameState.level}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  {gameState.gameCompleted && hasNextLevel && onNextLevel && (
                    <button
                      onClick={onNextLevel}
                      className="
                        flex-1
                        px-4 py-2 sm:px-6 sm:py-3
                        bg-accent text-page
                        rounded-lg
                        font-medium
                        hover:bg-accent-hover
                        transition-colors
                        shadow-glow-sm
                        focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
                      "
                    >
                      Próximo Nível
                    </button>
                  )}
                  
                  <button
                    onClick={onPlayAgain}
                    className="
                      flex-1
                      px-4 py-2 sm:px-6 sm:py-3
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
                      px-4 py-2 sm:px-6 sm:py-3
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

