"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { GameBoard } from "@/components/games/terminal-2048/GameBoard"
import { ScoreDisplay } from "@/components/games/terminal-2048/ScoreDisplay"
import { GameOverModal } from "@/components/games/terminal-2048/GameOverModal"
import {
  createInitialGameState,
  executeMove,
  resetGame,
  loadBestScore,
  type Direction,
} from "@/lib/games/terminal-2048/game-logic"

export default function Terminal2048Page() {
  const { data: session } = useSession()
  // Initialize with bestScore = 0 to avoid hydration mismatch
  // Load actual bestScore from localStorage in useEffect (client-side only)
  const [gameState, setGameState] = useState(() => {
    return createInitialGameState(0)
  })
  const [isMoving, setIsMoving] = useState(false)
  const [scoreSaved, setScoreSaved] = useState(false)

  // Load bestScore from localStorage on client-side only
  useEffect(() => {
    const bestScore = loadBestScore()
    if (bestScore > 0) {
      setGameState(prevState => ({
        ...prevState,
        bestScore,
      }))
    }
  }, []) // Run only once on mount

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isMoving || gameState.gameOver) {
        return
      }

      let direction: Direction | null = null

      switch (event.key) {
        case 'ArrowUp':
          direction = 'up'
          break
        case 'ArrowDown':
          direction = 'down'
          break
        case 'ArrowLeft':
          direction = 'left'
          break
        case 'ArrowRight':
          direction = 'right'
          break
        default:
          return
      }

      if (direction) {
        event.preventDefault()
        handleMove(direction)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, isMoving])

  // Handle touch controls
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || isMoving || gameState.gameOver) {
      return
    }

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y
    const minSwipeDistance = 30

    let direction: Direction | null = null

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        direction = deltaX > 0 ? 'right' : 'left'
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        direction = deltaY > 0 ? 'down' : 'up'
      }
    }

    if (direction) {
      handleMove(direction)
    }

    setTouchStart(null)
  }

  const handleMove = useCallback((direction: Direction) => {
    if (isMoving || gameState.gameOver) {
      return
    }

    setIsMoving(true)
    
    // Small delay for visual feedback
    setTimeout(() => {
      setGameState(prevState => executeMove(prevState, direction))
      setIsMoving(false)
    }, 50)
  }, [gameState, isMoving])

  // Save score to API when game ends
  useEffect(() => {
    if (gameState.gameOver && !scoreSaved && session?.user && gameState.score > 0) {
      setScoreSaved(true)
      
      const saveScore = async () => {
        try {
          const duration = Math.floor((Date.now() - gameState.startTime) / 1000) // in seconds
          
          const response = await fetch('/api/scores', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for authentication
            body: JSON.stringify({
              gameId: 'terminal-2048',
              score: gameState.score,
              duration,
              moves: gameState.moveCount,
              metadata: {
                bestTile: Math.max(...gameState.board.flat().filter(Boolean) as number[]),
                moveHistory: gameState.moveHistory.slice(-10), // last 10 moves
              },
              gameState: {
                board: gameState.board,
                moveHistory: gameState.moveHistory,
                startTime: gameState.startTime,
                endTime: Date.now(),
              },
            }),
          })
          
          if (!response.ok) {
            const error = await response.json()
            console.error('Failed to save score:', error)
          } else {
            console.log('Score saved successfully!')
          }
        } catch (error) {
          console.error('Error saving score:', error)
        }
      }
      
      saveScore()
    }
  }, [gameState.gameOver, gameState.score, gameState.startTime, gameState.moveCount, gameState.board, gameState.moveHistory, session, scoreSaved])

  const handlePlayAgain = () => {
    const bestScore = loadBestScore()
    setGameState(resetGame(bestScore))
    setScoreSaved(false) // Reset flag for new game
  }

  return (
    <main className="min-h-screen bg-page pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="
              inline-flex items-center gap-2
              text-text-secondary hover:text-text
              transition-colors
              mb-4
            "
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text font-theme mb-2">
            Terminal 2048
          </h1>
          <p className="text-text-secondary">
            Combine tiles com o mesmo valor para alcançar tiles maiores!
          </p>
        </div>

        {/* Score Display */}
        <ScoreDisplay score={gameState.score} bestScore={gameState.bestScore} />

        {/* Game Board */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="mb-8"
        >
          <GameBoard board={gameState.board} />
        </div>

        {/* Instructions */}
        <div className="
          max-w-md mx-auto
          p-4 sm:p-6
          bg-page-secondary
          border border-border
          rounded-lg
          text-center
        ">
          <h3 className="text-lg font-semibold text-text mb-3 font-theme">
            Como Jogar
          </h3>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>Use as <strong className="text-text">setas do teclado</strong> ou <strong className="text-text">deslize</strong> para mover os tiles.</p>
            <p>Tiles com o mesmo valor se combinam quando colidem.</p>
            <p>Alcance o maior valor possível!</p>
          </div>
        </div>

        {/* Game Over Modal */}
        <GameOverModal
          isOpen={gameState.gameOver}
          score={gameState.score}
          bestScore={gameState.bestScore}
          onPlayAgain={handlePlayAgain}
        />
      </div>
    </main>
  )
}

