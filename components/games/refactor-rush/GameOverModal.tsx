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
              className="
                w-full max-w-md
                bg-page-secondary
                border-2 border-border
                rounded-xl
                p-6 sm:p-8
                shadow-glow
              "
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-text mb-4 text-center">
                Puzzle Complete! 🎉
              </h2>

              {isNewBest && (
                <div className="text-center mb-4">
                  <span className="text-primary font-semibold">New Best Score!</span>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Final Score:</span>
                  <span className="text-text font-bold text-lg">{score.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Best Score:</span>
                  <span className="text-primary font-bold">{bestScore.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Time:</span>
                  <span className="text-text font-semibold">{formatTime(time)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Moves:</span>
                  <span className="text-text font-semibold">{moves}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Level:</span>
                  <span className="text-accent font-semibold">{level}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {hasNextLevel && onNextLevel && (
                  <button
                    onClick={onNextLevel}
                    className="
                      flex-1
                      px-4 py-3
                      bg-primary
                      text-white
                      rounded-lg
                      font-semibold
                      hover:bg-primary/90
                      transition-colors
                    "
                  >
                    Next Level
                  </button>
                )}
                <button
                  onClick={onPlayAgain}
                  className="
                    flex-1
                    px-4 py-3
                    bg-page
                    border-2 border-border
                    text-text
                    rounded-lg
                    font-semibold
                    hover:bg-page-secondary
                    transition-colors
                  "
                >
                  Play Again
                </button>
                <Link
                  href="/"
                  className="
                    flex-1
                    px-4 py-3
                    bg-page
                    border-2 border-border
                    text-text
                    rounded-lg
                    font-semibold
                    hover:bg-page-secondary
                    transition-colors
                    text-center
                  "
                >
                  Back to Home
                </Link>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

