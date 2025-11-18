"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useRef } from "react"
import { getGame } from "@/lib/games"

interface ScoreDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  score: {
    id: number
    gameId: string
    score: number
    duration: number | null
    moves: number | null
    createdAt: Date | string
    metadata?: any
  }
}

function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (remainingSeconds === 0) {
    return `${minutes}min`
  }
  return `${minutes}min ${remainingSeconds}s`
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function ScoreDetailsModal({
  isOpen,
  onClose,
  score,
}: ScoreDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const game = getGame(score.gameId)

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      // Focus trap
      if (modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusableElements.length > 0) {
          ;(focusableElements[0] as HTMLElement).focus()
        }
      }
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

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
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="
                w-full max-w-2xl
                bg-page-secondary
                border-2 border-border
                rounded-xl
                shadow-glow
                p-6 sm:p-8
                max-h-[90vh] overflow-y-auto
              "
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="score-details-title"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2
                      id="score-details-title"
                      className="text-2xl sm:text-3xl font-bold text-text font-theme"
                    >
                      {game?.name || score.gameId}
                    </h2>
                    <p className="text-text-secondary mt-1">
                      Detalhes da Partida
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="
                      w-8 h-8
                      flex items-center justify-center
                      rounded-lg
                      text-text-secondary
                      hover:bg-page
                      hover:text-text
                      transition-colors
                      focus:outline-none focus:ring-2 focus:ring-primary
                    "
                    aria-label="Fechar"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Score Display */}
                <div className="
                  p-6
                  bg-page
                  border border-border
                  rounded-lg
                  text-center
                ">
                  <div className="text-sm text-text-secondary mb-2">
                    Score Final
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold text-primary font-theme">
                    {score.score.toLocaleString()}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {score.duration !== null && (
                    <div className="p-4 bg-page border border-border rounded-lg">
                      <div className="text-xs text-text-secondary mb-1">
                        Duração
                      </div>
                      <div className="text-lg font-semibold text-text">
                        {formatDuration(score.duration)}
                      </div>
                    </div>
                  )}
                  
                  {score.moves !== null && (
                    <div className="p-4 bg-page border border-border rounded-lg">
                      <div className="text-xs text-text-secondary mb-1">
                        Movimentos
                      </div>
                      <div className="text-lg font-semibold text-text">
                        {score.moves}
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-page border border-border rounded-lg">
                    <div className="text-xs text-text-secondary mb-1">
                      Data
                    </div>
                    <div className="text-lg font-semibold text-text">
                      {formatDate(score.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Metadata (if available) */}
                {score.metadata && (
                  <div className="p-4 bg-page border border-border rounded-lg">
                    <div className="text-xs text-text-secondary mb-2">
                      Informações Adicionais
                    </div>
                    <pre className="text-xs text-text-secondary overflow-x-auto">
                      {JSON.stringify(score.metadata, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Close Button */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={onClose}
                    className="
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
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

