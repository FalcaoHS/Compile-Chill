"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { HexPuzzle } from "@/components/games/dev-fifteen-hex/HexPuzzle"
import { ScoreDisplay } from "@/components/games/dev-fifteen-hex/ScoreDisplay"
import { GameOverModal } from "@/components/games/dev-fifteen-hex/GameOverModal"
import {
  createInitialGameState,
  executeMove,
  moveTile,
  resetGame,
  calculateScore,
  checkEasterEgg,
  type GameState,
  type Direction,
  type Position,
} from "@/lib/games/dev-fifteen-hex/game-logic"
import { useSafeScore } from "@/hooks/useSafeScore"
import { getParticleConfig } from "@/lib/games/dev-fifteen-hex/theme-styles"
import { useThemeStore } from "@/lib/theme-store"
import { ParticleEffect } from "@/components/games/dev-fifteen-hex/ParticleEffect"

export default function DevFifteenHexPage() {
  const { data: session } = useSession()
  const { submitScore } = useSafeScore()
  const { theme } = useThemeStore()
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState())
  const [initialBoard, setInitialBoard] = useState<(string | null)[][] | null>(null)
  const [bestScore, setBestScore] = useState(0)
  const [scoreSaved, setScoreSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [completionParticles, setCompletionParticles] = useState<{ x: number; y: number; config: ReturnType<typeof getParticleConfig> } | null>(null)
  
  // Load best score from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('dev-fifteen-hex-best-score')
    if (stored) {
      setBestScore(parseInt(stored, 10))
    }
    setIsLoading(false)
  }, [])
  
  // Save best score
  useEffect(() => {
    if (gameState.isWon && !scoreSaved) {
      const duration = gameState.endTime! - gameState.startTime
      const score = calculateScore(gameState.moves, duration)
      
      if (score > bestScore) {
        setBestScore(score)
        localStorage.setItem('dev-fifteen-hex-best-score', score.toString())
      }
      
      // Trigger completion particles
      const boardRect = document.querySelector('[data-puzzle-board]')?.getBoundingClientRect()
      if (boardRect) {
        const config = getParticleConfig(theme, true)
        setCompletionParticles({
          x: boardRect.left + boardRect.width / 2,
          y: boardRect.top + boardRect.height / 2,
          config,
        })
      }
      
      // Save score to server
      if (session?.user) {
        const isEasterEgg = checkEasterEgg(gameState.moves, duration)
        
        // We need to store the initial board for validation
        // For now, we'll store it in a ref or reconstruct from moveHistory backwards
        // Actually, we can't reconstruct it perfectly, so we'll validate differently
        // The validator will check that the final board is solved and moves are valid
        submitScore({
          gameId: 'dev-fifteen-hex',
          score,
          duration: Math.floor(duration / 1000),
          moves: gameState.moves,
          gameState: {
            board: initialBoard || gameState.board, // Initial board for validation
            moveHistory: gameState.moveHistory,
            moveTimestamps: gameState.moveTimestamps,
            startTime: gameState.startTime,
            endTime: gameState.endTime!,
          },
          metadata: {
            isEasterEgg,
          },
        }).then(() => {
          setScoreSaved(true)
        })
      } else {
        setScoreSaved(true)
      }
    }
  }, [gameState.isWon, gameState.endTime, gameState.startTime, gameState.moves, gameState.moveHistory, gameState.moveTimestamps, gameState.board, bestScore, scoreSaved, session, submitScore, theme])
  
  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState.isAnimating || gameState.isWon || isLoading) {
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
  }, [gameState, isLoading])
  
  // Handle touch controls
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || gameState.isAnimating || gameState.isWon || isLoading) {
      return
    }
    
    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y
    const minSwipeDistance = 30
    
    let direction: Direction | null = null
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        direction = deltaX > 0 ? 'right' : 'left'
      }
    } else {
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
    setGameState(prevState => {
      const newState = executeMove(prevState, direction)
      return newState || prevState
    })
  }, [])
  
  const handleTileClick = useCallback((position: Position) => {
    setGameState(prevState => {
      const newState = moveTile(prevState, position)
      return newState || prevState
    })
  }, [])
  
  const handleMoveComplete = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      isAnimating: false,
    }))
  }, [])
  
  const handlePlayAgain = useCallback(() => {
    const newState = resetGame()
    setGameState(newState)
    setInitialBoard(JSON.parse(JSON.stringify(newState.board)))
    setScoreSaved(false)
    setCompletionParticles(null)
  }, [])
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text font-theme">
          <div className="mb-2">Allocating memory segments…</div>
          <div className="mb-2">Defragmenting blocks…</div>
          <div>Puzzle online.</div>
        </div>
      </div>
    )
  }
  
  const duration = gameState.endTime ? gameState.endTime - gameState.startTime : Date.now() - gameState.startTime
  const score = calculateScore(gameState.moves, duration)
  const isEasterEgg = gameState.isWon ? checkEasterEgg(gameState.moves, duration) : false
  
  return (
    <div
      className="min-h-screen flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <ScoreDisplay
        moves={gameState.moves}
        duration={duration}
        score={score}
      />
      
      <div className="flex-1 flex items-center justify-center" data-puzzle-board>
        <HexPuzzle
          gameState={gameState}
          onTileClick={handleTileClick}
          onMoveComplete={handleMoveComplete}
        />
      </div>
      
      {completionParticles && (
        <ParticleEffect
          x={completionParticles.x}
          y={completionParticles.y}
          config={completionParticles.config}
          onComplete={() => setCompletionParticles(null)}
        />
      )}
      
      <GameOverModal
        isOpen={gameState.isWon}
        score={score}
        bestScore={bestScore}
        moves={gameState.moves}
        duration={duration}
        isEasterEgg={isEasterEgg}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  )
}

