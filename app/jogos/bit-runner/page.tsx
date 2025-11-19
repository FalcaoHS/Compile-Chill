"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { BitRunnerCanvas } from "@/components/games/bit-runner/BitRunnerCanvas"
import { ScoreDisplay } from "@/components/games/bit-runner/ScoreDisplay"
import { GameOverModal } from "@/components/games/bit-runner/GameOverModal"
import {
  createInitialGameState,
  updateGameState,
  resetGame,
  loadBestScore,
  saveBestScore,
  getMatchDuration,
  type GameState,
} from "@/lib/games/bit-runner/game-logic"

export default function BitRunnerPage() {
  const { data: session } = useSession()
  const [gameState, setGameState] = useState(() => createInitialGameState())
  const [bestDistance, setBestDistance] = useState(0)
  const [scoreSaved, setScoreSaved] = useState(false)
  const [currentAction, setCurrentAction] = useState<'jump' | 'duck' | null>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  // Load best score on mount
  useEffect(() => {
    const best = loadBestScore()
    setBestDistance(best)
  }, [])

  // Handle keyboard controls
  useEffect(() => {
    if (gameState.gameOver) return

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case ' ':
        case 'ArrowUp':
          event.preventDefault()
          setCurrentAction('jump')
          break
        case 'ArrowDown':
          event.preventDefault()
          setCurrentAction('duck')
          break
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        setCurrentAction(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gameState.gameOver])

  // Handle touch controls
  const [touchStartY, setTouchStartY] = useState<number | null>(null)

  const handleTouchStart = (event: React.TouchEvent) => {
    if (gameState.gameOver) return
    setTouchStartY(event.touches[0].clientY)
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    if (gameState.gameOver || touchStartY === null) return

    const touchY = event.touches[0].clientY
    const diff = touchStartY - touchY

    if (Math.abs(diff) > 30) {
      // Swipe detected
      if (diff > 0) {
        // Swipe up - jump
        setCurrentAction('jump')
      } else {
        // Swipe down - duck
        setCurrentAction('duck')
      }
      setTouchStartY(null)
    }
  }

  const handleTouchEnd = () => {
    setTouchStartY(null)
    setCurrentAction(null)
  }

  // Game update loop
  const handleGameUpdate = useCallback((deltaTime: number) => {
    if (gameState.gameOver) return

    setGameState(prevState => {
      // Update game state with current action
      const newState = updateGameState(prevState, currentAction, deltaTime)
      return newState
    })
  }, [gameState.gameOver, currentAction])

  // Save score when game ends
  useEffect(() => {
    if (gameState.gameOver && !scoreSaved) {
      const finalDistance = gameState.distance

      // Save best score to localStorage
      saveBestScore(finalDistance)
      setBestDistance(Math.max(bestDistance, finalDistance))

      // Mark as saved to prevent duplicate submissions
      setScoreSaved(true)

      // Submit score to API if user is authenticated
      if (session?.user && finalDistance > 0) {
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
                gameId: 'bit-runner',
                score: Math.floor(finalDistance),
                duration,
                moves: 0, // Not applicable for endless runner
                metadata: {
                  finalDistance: Math.floor(finalDistance),
                  gameSpeed: gameState.gameSpeed,
                  obstaclesAvoided: gameState.obstacles.length,
                  spawnPatterns: gameState.spawnPatterns,
                },
                gameState: {
                  distance: gameState.distance,
                  gameSpeed: gameState.gameSpeed,
                  duration,
                },
              }),
            })
          } catch (error) {
            
          }
        }

        saveScore()
      }
    }
  }, [gameState.gameOver, gameState.distance, gameState.gameSpeed, gameState.obstacles.length, gameState.spawnPatterns, scoreSaved, session, bestDistance])

  // Handle play again
  const handlePlayAgain = () => {
    setGameState(resetGame())
    setScoreSaved(false)
    setCurrentAction(null)
  }

  return (
    <div className="min-h-screen bg-page pt-24">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
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
            <span>←</span>
            <span>Voltar</span>
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-text font-theme mb-2">
            Bit Runner
          </h1>
          <p className="text-text-secondary">
            Endless runner com obstáculos dev-themed
          </p>
        </div>

        {/* Score Display */}
        <ScoreDisplay
          distance={gameState.distance}
          bestDistance={bestDistance}
        />

        {/* Game Canvas */}
        <div
          ref={canvasContainerRef}
          className="mb-6"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <BitRunnerCanvas
            gameState={gameState}
            onUpdate={handleGameUpdate}
          />
        </div>

        {/* Controls Instructions */}
        <div className="
          bg-page-secondary
          border border-border
          rounded-lg
          p-4 sm:p-6
        ">
          <h3 className="text-lg font-semibold text-text mb-4">
            Controles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Keyboard */}
            <div>
              <h4 className="text-sm font-medium text-text-secondary mb-2">
                Teclado
              </h4>
              <div className="space-y-1 text-sm text-text">
                <div>↑ ou Espaço: Pular</div>
                <div>↓: Abaixar</div>
              </div>
            </div>

            {/* Touch */}
            <div>
              <h4 className="text-sm font-medium text-text-secondary mb-2">
                Touch
              </h4>
              <div className="space-y-1 text-sm text-text">
                <div>Swipe ↑: Pular</div>
                <div>Swipe ↓: Abaixar</div>
              </div>
            </div>

            {/* Objective */}
            <div>
              <h4 className="text-sm font-medium text-text-secondary mb-2">
                Objetivo
              </h4>
              <div className="text-sm text-text">
                Evite obstáculos e percorra a maior distância possível!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={gameState.gameOver}
        distance={gameState.distance}
        bestDistance={bestDistance}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  )
}

