"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useThemeStore } from "@/lib/theme-store"
import { HexTile } from "./HexTile"
import { getBoardStyles, getParticleConfig } from "@/lib/games/dev-fifteen-hex/theme-styles"
import type { GameState, Position } from "@/lib/games/dev-fifteen-hex/game-logic"
import { ParticleEffect } from "./ParticleEffect"

interface HexPuzzleProps {
  gameState: GameState
  onTileClick: (position: Position) => void
  onMoveComplete: () => void
}

export function HexPuzzle({ gameState, onTileClick, onMoveComplete }: HexPuzzleProps) {
  const { theme } = useThemeStore()
  const boardStyles = getBoardStyles(theme)
  const [particleConfig, setParticleConfig] = useState<{ x: number; y: number; config: ReturnType<typeof getParticleConfig> } | null>(null)
  
  // Handle animation completion
  useEffect(() => {
    if (gameState.isAnimating) {
      const timer = setTimeout(() => {
        onMoveComplete()
      }, 120) // Match animation duration
      return () => clearTimeout(timer)
    }
  }, [gameState.isAnimating, onMoveComplete])
  
  // Calculate responsive tile size
  const [tileSize, setTileSize] = useState(80)
  
  useEffect(() => {
    const calculateSize = () => {
      const headerHeight = 64
      const statsHeight = 80
      const padding = 32
      const gap = 16
      const totalGaps = gap * 3 // 3 gaps between 4 rows
      
      const availableHeight = window.innerHeight - headerHeight - statsHeight - padding * 2
      const availableWidth = window.innerWidth - padding * 2
      
      const maxHeight = Math.floor((availableHeight - totalGaps) / 4)
      const maxWidth = Math.floor((availableWidth - gap * 3) / 4)
      
      const size = Math.min(maxHeight, maxWidth, 120)
      setTileSize(Math.max(60, size))
    }
    
    calculateSize()
    window.addEventListener('resize', calculateSize)
    return () => window.removeEventListener('resize', calculateSize)
  }, [])
  
  const handleTileClick = (row: number, col: number) => {
    if (gameState.isAnimating || gameState.isWon) return
    
    // Trigger particles on move
    const rect = document.querySelector(`[data-row="${row}"][data-col="${col}"]`)?.getBoundingClientRect()
    if (rect) {
      const config = getParticleConfig(theme, false)
      setParticleConfig({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        config,
      })
    }
    
    onTileClick({ row, col })
  }
  
  return (
    <div className="w-full flex items-center justify-center p-4">
      <div
        className="
          grid grid-cols-4 gap-2 sm:gap-3 md:gap-4
          p-2 sm:p-4
          rounded-lg
          border-2
        "
        style={{
          backgroundColor: boardStyles.backgroundColor,
          borderColor: boardStyles.borderColor,
          gap: boardStyles.gap,
          width: `${tileSize * 4 + parseInt(boardStyles.gap) * 3}px`,
          height: `${tileSize * 4 + parseInt(boardStyles.gap) * 3}px`,
        }}
      >
        {gameState.board.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const isEmpty = value === null
            const isAnimating = gameState.isAnimating && 
              (rowIndex === gameState.emptyPosition.row && colIndex === gameState.emptyPosition.col)
            
            return (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                data-row={rowIndex}
                data-col={colIndex}
                style={{
                  width: `${tileSize}px`,
                  height: `${tileSize}px`,
                }}
                layout
                transition={{
                  duration: 0.12,
                  ease: "easeOut",
                }}
              >
                <HexTile
                  value={value}
                  position={{ row: rowIndex, col: colIndex }}
                  isEmpty={isEmpty}
                  isAnimating={isAnimating}
                  onClick={() => handleTileClick(rowIndex, colIndex)}
                />
              </motion.div>
            )
          })
        )}
      </div>
      
      {particleConfig && (
        <ParticleEffect
          x={particleConfig.x}
          y={particleConfig.y}
          config={particleConfig.config}
          onComplete={() => setParticleConfig(null)}
        />
      )}
    </div>
  )
}

