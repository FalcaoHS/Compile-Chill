"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { PongCanvas } from "@/components/games/dev-pong/PongCanvas"
import { ScoreDisplay } from "@/components/games/dev-pong/ScoreDisplay"
import { GameOverModal } from "@/components/games/dev-pong/GameOverModal"
import {
  createInitialGameState,
  updateGameState,
  resetGame,
  loadBestScore,
  saveBestScore,
  getMatchDuration,
  movePlayerPaddle,
  type GameState,
  GAME_HEIGHT,
  PADDLE_HEIGHT,
} from "@/lib/games/dev-pong/game-logic"
import { updateAIPaddle, resetAIState } from "@/lib/games/dev-pong/ai-logic"

export default function DevPongPage() {
  const { data: session } = useSession()
  const [gameState, setGameState] = useState<GameState>(createInitialGameState)
  const [scoreSaved, setScoreSaved] = useState(false)
  const [mouseEnabled, setMouseEnabled] = useState(true)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  
  // Handle keyboard controls (W/S and Arrow Up/Down)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState.gameOver) return
      
      const moveSpeed = 15
      let newY = gameState.playerPaddle.y
      
      switch (event.key) {
        case 'w':
        case 'W':
        case 'ArrowUp':
          event.preventDefault()
          newY -= moveSpeed
          break
        case 's':
        case 'S':
        case 'ArrowDown':
          event.preventDefault()
          newY += moveSpeed
          break
        default:
          return
      }
      
      setGameState(prevState => movePlayerPaddle(prevState, newY))
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState.gameOver, gameState.playerPaddle.y])
  
  // Handle mouse controls
  useEffect(() => {
    if (!mouseEnabled || gameState.gameOver) return
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!canvasContainerRef.current) return
      
      const rect = canvasContainerRef.current.getBoundingClientRect()
      const mouseY = event.clientY - rect.top
      
      // Clamp mouse Y to canvas bounds
      const clampedMouseY = Math.max(0, Math.min(rect.height, mouseY))
      const scaleY = GAME_HEIGHT / rect.height
      const gameY = clampedMouseY * scaleY
      
      // Center paddle on mouse, but ensure it stays within bounds
      const paddleY = Math.max(0, Math.min(GAME_HEIGHT - PADDLE_HEIGHT, gameY - PADDLE_HEIGHT / 2))
      
      setGameState(prevState => movePlayerPaddle(prevState, paddleY))
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseEnabled, gameState.gameOver])
  
  // Handle touch controls
  const handleTouchMove = (event: React.TouchEvent) => {
    if (gameState.gameOver || !canvasContainerRef.current) return
    
    const touch = event.touches[0]
    const rect = canvasContainerRef.current.getBoundingClientRect()
    const touchY = touch.clientY - rect.top
    
    // Clamp touch Y to canvas bounds
    const clampedTouchY = Math.max(0, Math.min(rect.height, touchY))
    const scaleY = GAME_HEIGHT / rect.height
    const gameY = clampedTouchY * scaleY
    
    // Center paddle on touch, but ensure it stays within bounds
    const paddleY = Math.max(0, Math.min(GAME_HEIGHT - PADDLE_HEIGHT, gameY - PADDLE_HEIGHT / 2))
    
    setGameState(prevState => movePlayerPaddle(prevState, paddleY))
  }
  
  // Game update loop
  const handleGameUpdate = useCallback((deltaTime: number) => {
    if (gameState.gameOver) return
    
    setGameState(prevState => {
      // Update AI paddle
      let newState = updateAIPaddle(prevState, deltaTime)
      
      // Update ball and game logic
      newState = updateGameState(newState)
      
      return newState
    })
  }, [gameState.gameOver])
  
  // Save score to API when game ends
  useEffect(() => {
    if (gameState.gameOver && !scoreSaved && session?.user && gameState.playerScore > 0) {
      setScoreSaved(true)
      
      // Save best score to localStorage
      saveBestScore(gameState.playerScore)
      
      const saveScore = async () => {
        try {
          const duration = getMatchDuration(gameState)
          
          const response = await fetch('/api/scores', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for authentication
            body: JSON.stringify({
              gameId: 'dev-pong',
              score: gameState.playerScore,
              duration,
              moves: gameState.hitCount,
              metadata: {
                aiScore: gameState.aiScore,
                winner: gameState.winner,
                hitCount: gameState.hitCount,
                finalBallSpeed: gameState.ballSpeed,
                aiDifficulty: gameState.aiDifficulty,
              },
              gameState: {
                playerScore: gameState.playerScore,
                aiScore: gameState.aiScore,
                hitCount: gameState.hitCount,
                duration,
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
  }, [gameState.gameOver, gameState.playerScore, gameState.aiScore, gameState.winner, gameState.hitCount, gameState.ballSpeed, gameState.aiDifficulty, session, scoreSaved])
  
  // Handle play again
  const handlePlayAgain = () => {
    resetAIState()
    setGameState(resetGame())
    setScoreSaved(false)
  }
  
  // Disable mouse controls on mobile
  useEffect(() => {
    const checkMobile = () => {
      setMouseEnabled(window.innerWidth >= 768) // Enable mouse on tablet and desktop
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return (
    <main className="min-h-screen bg-page pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Dev Pong
          </h1>
          <p className="text-text-secondary">
            Pong minimalista com estética futurista. Primeiro a 7 pontos vence!
          </p>
        </div>

        {/* Score Display */}
        <ScoreDisplay 
          playerScore={gameState.playerScore} 
          aiScore={gameState.aiScore} 
        />

        {/* Game Canvas */}
        <div
          ref={canvasContainerRef}
          onTouchMove={handleTouchMove}
          className="mb-8"
        >
          <PongCanvas 
            gameState={gameState} 
            onUpdate={handleGameUpdate}
          />
        </div>

        {/* Instructions */}
        <div className="
          max-w-2xl mx-auto
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
            <p>
              <strong className="text-text">Teclado:</strong> Use <kbd className="px-2 py-1 bg-page border border-border rounded text-xs">W</kbd> / <kbd className="px-2 py-1 bg-page border border-border rounded text-xs">S</kbd> ou <kbd className="px-2 py-1 bg-page border border-border rounded text-xs">↑</kbd> / <kbd className="px-2 py-1 bg-page border border-border rounded text-xs">↓</kbd> para mover seu paddle
            </p>
            <p>
              <strong className="text-text">Mouse:</strong> Mova o cursor verticalmente para controlar seu paddle (desktop/tablet)
            </p>
            <p>
              <strong className="text-text">Touch:</strong> Toque e arraste verticalmente para mover seu paddle (mobile)
            </p>
            <p className="pt-2">
              Primeiro jogador a marcar <strong className="text-primary">7 pontos</strong> vence!
            </p>
          </div>
        </div>

        {/* Game Over Modal */}
        <GameOverModal
          isOpen={gameState.gameOver}
          playerScore={gameState.playerScore}
          aiScore={gameState.aiScore}
          winner={gameState.winner}
          onPlayAgain={handlePlayAgain}
        />
      </div>
    </main>
  )
}

