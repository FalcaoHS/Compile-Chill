"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { StackOverflowDodgeCanvas } from "@/components/games/stack-overflow-dodge/StackOverflowDodgeCanvas"
import { ScoreDisplay } from "@/components/games/stack-overflow-dodge/ScoreDisplay"
import { GameOverModal } from "@/components/games/stack-overflow-dodge/GameOverModal"
import {
  createInitialGameState,
  updateGameState,
  updatePlayerPosition,
  resetGame,
  loadBestScore,
  saveBestScore,
  getMatchDuration,
  type GameState,
} from "@/lib/games/stack-overflow-dodge/game-logic"

export default function StackOverflowDodgePage() {
  const { data: session } = useSession()
  const [gameState, setGameState] = useState(() => createInitialGameState())
  const [bestScore, setBestScore] = useState(0)
  const [scoreSaved, setScoreSaved] = useState(false)
  const [currentDirection, setCurrentDirection] = useState<'left' | 'right' | null>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const mouseXRef = useRef<number | null>(null)

  // Load best score on mount
  useEffect(() => {
    const best = loadBestScore()
    setBestScore(best)
    setGameState(prev => ({ ...prev, bestScore: best }))
  }, [])

  // Handle keyboard controls
  useEffect(() => {
    if (gameState.gameOver) return

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          event.preventDefault()
          setCurrentDirection('left')
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          event.preventDefault()
          setCurrentDirection('right')
          break
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A' ||
          event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        setCurrentDirection(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gameState.gameOver])

  // Handle mouse controls (optional horizontal tracking)
  useEffect(() => {
    if (gameState.gameOver) return

    const handleMouseMove = (event: MouseEvent) => {
      const canvas = canvasContainerRef.current?.querySelector('canvas')
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const canvasCenterX = rect.width / 2
      
      // Only track if mouse is over canvas
      if (mouseX >= 0 && mouseX <= rect.width) {
        mouseXRef.current = mouseX
      }
    }

    const handleMouseLeave = () => {
      mouseXRef.current = null
    }

    const container = canvasContainerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      container.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove)
        container.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [gameState.gameOver])

  // Handle touch controls (swipe left/right)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const handleTouchStart = (event: React.TouchEvent) => {
    if (gameState.gameOver) return
    setTouchStartX(event.touches[0].clientX)
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    if (gameState.gameOver || touchStartX === null) return

    const touchX = event.touches[0].clientX
    const diff = touchX - touchStartX

    if (Math.abs(diff) > 30) {
      // Swipe detected
      if (diff > 0) {
        // Swipe right
        setCurrentDirection('right')
      } else {
        // Swipe left
        setCurrentDirection('left')
      }
    }
  }

  const handleTouchEnd = () => {
    setTouchStartX(null)
    setCurrentDirection(null)
  }

  // Game update loop
  const handleGameUpdate = useCallback((deltaTime: number) => {
    if (gameState.gameOver) return

    setGameState(prevState => {
      // Handle mouse movement if active
      let direction = currentDirection
      if (mouseXRef.current !== null && !currentDirection) {
        const canvas = canvasContainerRef.current?.querySelector('canvas')
        if (canvas) {
          const rect = canvas.getBoundingClientRect()
          const canvasCenterX = rect.width / 2
          const playerX = (prevState.player.x / 800) * rect.width // Convert game X to canvas X
          
          if (mouseXRef.current < playerX - 10) {
            direction = 'left'
          } else if (mouseXRef.current > playerX + 10) {
            direction = 'right'
          }
        }
      }

      // Update game state with current direction
      const newState = updateGameState(prevState, direction, deltaTime)
      return newState
    })
  }, [gameState.gameOver, currentDirection])

  // Save score when game ends
  useEffect(() => {
    if (gameState.gameOver && !scoreSaved) {
      const finalScore = gameState.score

      // Save best score to localStorage
      saveBestScore(finalScore)
      const newBest = Math.max(bestScore, finalScore)
      setBestScore(newBest)

      // Mark as saved to prevent duplicate submissions
      setScoreSaved(true)

      // Submit score to API if user is authenticated
      if (session?.user && finalScore > 0) {
        const saveScore = async () => {
          try {
            const duration = getMatchDuration(gameState)

            await fetch('/api/scores', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include', // Include cookies for authentication
              body: JSON.stringify({
                gameId: 'stack-overflow-dodge',
                score: Math.floor(finalScore),
                duration,
                moves: 0, // Not applicable for dodge game
                metadata: {
                  finalScore: Math.floor(finalScore),
                  errorsAvoided: gameState.errorsAvoided,
                  powerUpsCollected: gameState.powerUpsCollected,
                  duration: gameState.duration,
                },
                gameState: {
                  score: gameState.score,
                  duration,
                },
              }),
            })
          } catch (error) {
            console.error('Failed to save score:', error)
          }
        }

        saveScore()
      }
    }
  }, [gameState.gameOver, gameState.score, gameState.errorsAvoided, gameState.powerUpsCollected, gameState.duration, scoreSaved, session, bestScore])

  // Handle play again
  const handlePlayAgain = () => {
    const newState = resetGame()
    newState.bestScore = bestScore
    setGameState(newState)
    setScoreSaved(false)
    setCurrentDirection(null)
    mouseXRef.current = null
  }

  return (
    <div className="h-screen flex flex-col bg-page overflow-hidden">
      {/* Header - Below global header */}
      <div className="flex-shrink-0 p-2 sm:p-4 border-b border-border bg-page-secondary mt-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-text hover:text-primary transition-colors text-sm sm:text-base"
          >
            ← Voltar
          </Link>
          <h1 className="text-lg sm:text-xl font-bold text-text font-theme">
            Stack Overflow Dodge
          </h1>
          <div className="w-16 sm:w-20" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Score Display */}
      <div className="flex-shrink-0 p-2 sm:p-3 border-b border-border bg-page-secondary">
        <ScoreDisplay
          score={gameState.score}
          bestScore={bestScore}
        />
      </div>

      {/* Game Canvas */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden min-h-0">
        <div
          ref={canvasContainerRef}
          className="w-full h-full max-w-4xl max-h-[600px] bg-page-secondary border border-border rounded-xl overflow-hidden flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <StackOverflowDodgeCanvas
            gameState={gameState}
            onUpdate={handleGameUpdate}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="flex-shrink-0 p-2 sm:p-3 border-t border-border bg-page-secondary">
        <div className="max-w-7xl mx-auto text-center text-xs sm:text-sm text-text-secondary">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <div>
              <strong>Teclado:</strong> ← → ou A/D para mover
            </div>
            <div>
              <strong>Touch:</strong> Swipe esquerda/direita
            </div>
            <div>
              <strong>Mouse:</strong> Mova o cursor horizontalmente
            </div>
          </div>
          <div className="mt-2">
            Desvie dos erros e colete power-ups!
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={gameState.gameOver}
        score={gameState.score}
        bestScore={bestScore}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  )
}

