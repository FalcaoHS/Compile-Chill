"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { getGame } from "@/lib/games"
import { ScoreDetailsModal } from "./ScoreDetailsModal"

interface ScoreCardProps {
  id: number
  gameId: string
  score: number
  duration: number | null
  moves: number | null
  createdAt: Date | string
  metadata?: any
  onShare?: (scoreId: number) => void
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
    month: "short",
    year: "numeric",
  })
}

// Generate mini oscillation graph using Canvas
function drawOscillationGraph(
  canvas: HTMLCanvasElement,
  score: number,
  theme: string
) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height
  const padding = 4

  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Generate oscillation data based on score
  const points = 20
  const data: number[] = []
  for (let i = 0; i < points; i++) {
    const x = (i / points) * Math.PI * 4
    const value = Math.sin(x) * (score / 1000) + Math.cos(x * 0.7) * (score / 2000)
    data.push(value)
  }

  // Normalize data to fit canvas
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const normalized = data.map((v) => ((v - min) / range) * (height - padding * 2) + padding)

  // Draw graph
  ctx.strokeStyle = "var(--color-primary)"
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i < normalized.length; i++) {
    const x = (i / (normalized.length - 1)) * (width - padding * 2) + padding
    const y = height - normalized[i]
    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.stroke()

  // Add glow effect based on theme
  if (theme === "neon" || theme === "cyber") {
    ctx.shadowBlur = 10
    ctx.shadowColor = "var(--color-primary)"
    ctx.stroke()
  }
}

export function ScoreCard({
  id,
  gameId,
  score,
  duration,
  moves,
  createdAt,
  metadata,
  onShare,
}: ScoreCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const game = getGame(gameId)

  // Draw oscillation graph
  useEffect(() => {
    if (canvasRef.current) {
      const theme = document.documentElement.getAttribute("data-theme") || "cyber"
      drawOscillationGraph(canvasRef.current, score, theme)
    }
  }, [score])

  const handleShare = () => {
    if (onShare) {
      onShare(id)
    } else {
      // Default share behavior - copy to clipboard or open share dialog
      const shareText = `Acabei de fazer ${score.toLocaleString()} pontos em ${game?.name || gameId}! 🎮`
      if (navigator.share) {
        navigator.share({
          title: `${game?.name || gameId} - Score`,
          text: shareText,
        })
      } else {
        navigator.clipboard.writeText(shareText)
      }
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.2 }}
        className="
          p-4 sm:p-6
          bg-page-secondary
          border-2 border-border
          rounded-lg
          hover:border-primary
          hover:shadow-glow-sm
          transition-all duration-200
        "
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Game Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              {game?.icon && (
                <span className="text-2xl">{game.icon}</span>
              )}
              <h3 className="text-lg font-bold text-text font-theme">
                {game?.name || gameId} — Score {score.toLocaleString()}
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-4">
              {duration !== null && (
                <span>Duração: {formatDuration(duration)}</span>
              )}
              {moves !== null && (
                <span>Movimentos: {moves}</span>
              )}
              <span>Data: {formatDate(createdAt)}</span>
            </div>

            {/* Mini Graph */}
            <div className="mb-4">
              <canvas
                ref={canvasRef}
                width={200}
                height={40}
                className="w-full max-w-[200px] h-10 rounded border border-border"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="
                  px-4 py-2
                  text-sm
                  bg-primary text-page
                  rounded-lg
                  font-medium
                  hover:bg-primary-hover
                  transition-colors
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                "
              >
                Compartilhar no X
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="
                  px-4 py-2
                  text-sm
                  border border-border text-text
                  rounded-lg
                  font-medium
                  hover:bg-page
                  transition-colors
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                "
              >
                Ver Detalhes
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Score Details Modal */}
      <ScoreDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        score={{
          id,
          gameId,
          score,
          duration,
          moves,
          createdAt,
          metadata,
        }}
      />
    </>
  )
}

