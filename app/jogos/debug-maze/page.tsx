'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { MazeCanvas } from '@/components/games/debug-maze/MazeCanvas'
import { ScoreDisplay } from '@/components/games/debug-maze/ScoreDisplay'
import { GameOverModal } from '@/components/games/debug-maze/GameOverModal'
import {
  GameState,
  createInitialGameState,
  moveBug,
  updateGameState,
  resetGame,
  loadMazeByLevel,
  loadDefaultMaze,
  getScoreData,
  type Direction,
} from '@/lib/games/debug-maze/game-logic'

const UPDATE_INTERVAL = 16 // ~60 FPS

export default function DebugMazePage() {
  const { data: session } = useSession()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [showHelpPanel, setShowHelpPanel] = useState(true)
  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [scoreSaved, setScoreSaved] = useState(false)
  const gameStateRef = useRef<GameState | null>(null)
  const lastSwipeRef = useRef<{ x: number; y: number; time: number } | null>(null)

  // Keep ref in sync with state
  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  // Initialize game state
  useEffect(() => {
    const maze = loadDefaultMaze()
    if (maze) {
      const initialState = createInitialGameState(maze)
      setGameState(initialState)
      gameStateRef.current = initialState
    }
  }, [])

  // Game loop - update game state
  useEffect(() => {
    if (!gameState) return

    const interval = setInterval(() => {
      setGameState(prevState => {
        if (!prevState) return prevState
        const updated = updateGameState(prevState)
        
        // Show modal when game completes
        if (updated.gameCompleted && !prevState.gameCompleted) {
          setShowGameOverModal(true)
        }
        
        return updated
      })
    }, UPDATE_INTERVAL)

    return () => clearInterval(interval)
  }, [gameState])

  // Handle movement
  const handleMove = useCallback((direction: Direction) => {
    if (!gameState || gameState.gameOver || gameState.isAnimating) return

    setGameState(prevState => {
      if (!prevState) return prevState
      return moveBug(prevState, direction)
    })
  }, [gameState])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      const key = e.key.toLowerCase()

      // Movement keys
      if (key === 'arrowup' || key === 'w' || key === '8') {
        e.preventDefault()
        handleMove('up')
      } else if (key === 'arrowdown' || key === 's' || key === '2') {
        e.preventDefault()
        handleMove('down')
      } else if (key === 'arrowleft' || key === 'a' || key === '4') {
        e.preventDefault()
        handleMove('left')
      } else if (key === 'arrowright' || key === 'd' || key === '6') {
        e.preventDefault()
        handleMove('right')
      } else if (key === 'r') {
        // Restart level
        e.preventDefault()
        if (gameState?.maze) {
          const newState = resetGame(gameState, gameState.maze)
          setGameState(newState)
          gameStateRef.current = newState
          setShowGameOverModal(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleMove, gameState])

  // Touch/swipe controls for mobile
  useEffect(() => {
    if (!gameState) return

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      lastSwipeRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!lastSwipeRef.current) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - lastSwipeRef.current.x
      const deltaY = touch.clientY - lastSwipeRef.current.y
      const deltaTime = Date.now() - lastSwipeRef.current.time
      const minSwipeDistance = 30
      const maxSwipeTime = 300

      if (deltaTime > maxSwipeTime) {
        lastSwipeRef.current = null
        return
      }

      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      if (absX < minSwipeDistance && absY < minSwipeDistance) {
        lastSwipeRef.current = null
        return
      }

      // Determine direction
      if (absX > absY) {
        // Horizontal swipe
        if (deltaX > 0) {
          handleMove('right')
        } else {
          handleMove('left')
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          handleMove('down')
        } else {
          handleMove('up')
        }
      }

      lastSwipeRef.current = null
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [gameState, handleMove])

  // Handle play again
  const handlePlayAgain = useCallback(() => {
    if (gameState?.maze) {
      const newState = resetGame(gameState, gameState.maze)
      setGameState(newState)
      gameStateRef.current = newState
      setShowGameOverModal(false)
      setScoreSaved(false) // Reset for new game
    }
  }, [gameState])

  // Handle next level
  const handleNextLevel = useCallback(() => {
    if (!gameState) return

    const nextLevel = gameState.level + 1
    const nextMaze = loadMazeByLevel(nextLevel)

    if (nextMaze) {
      const newState = createInitialGameState(nextMaze)
      setGameState(newState)
      gameStateRef.current = newState
      setShowGameOverModal(false)
      setScoreSaved(false) // Reset for new level
    } else {
      // No more levels, restart current
      handlePlayAgain()
    }
  }, [gameState, handlePlayAgain])

  // Save score to API when game completes
  useEffect(() => {
    if (gameState?.gameCompleted && !scoreSaved && session?.user && gameState) {
      setScoreSaved(true)
      
      const saveScore = async () => {
        try {
          const scoreData = getScoreData(gameState)
          
          // Convert duration from milliseconds to seconds
          const durationInSeconds = Math.floor(scoreData.duration / 1000)
          
          const response = await fetch('/api/scores', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              gameId: 'debug-maze',
              score: scoreData.score,
              duration: durationInSeconds,
              moves: scoreData.moves,
              level: scoreData.level,
              metadata: {
                level: scoreData.level,
                moves: scoreData.moves,
                duration: scoreData.duration,
              },
            }),
          })
          
          if (!response.ok) {
            if (response.status === 401) {
              
            } else {
              const error = await response.json()
              
            }
          } else {
            const result = await response.json().catch(() => ({}))
            
          }
        } catch (error) {
          
        }
      }
      
      saveScore()
    }
  }, [gameState?.gameCompleted, scoreSaved, session, gameState])

  // Canvas update callback
  const handleCanvasUpdate = useCallback((deltaTime: number) => {
    // Animation updates are handled by the game loop
  }, [])

  if (!gameState) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🐛</div>
          <p className="text-text-secondary">Carregando labirinto...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-page overflow-hidden pt-16">
      {/* Header */}
      <div className="border-b border-border bg-page-secondary flex-shrink-0 relative z-40">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-1.5"
            >
              ← Voltar
            </Link>
            <h1 className="text-lg md:text-xl font-bold text-text flex items-center gap-2">
              <span>🐛</span>
              Debug Maze
            </h1>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Help Panel - Desktop only */}
        <AnimatePresence>
          {showHelpPanel && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="hidden lg:flex flex-col w-72 border-r border-border bg-page-secondary flex-shrink-0"
            >
              <div className="p-2 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-text flex items-center gap-1.5 text-sm">
                  <span>📖</span>
                  Como Jogar
                </h3>
                <button
                  onClick={() => setShowHelpPanel(false)}
                  className="text-text-secondary hover:text-error transition-colors p-1"
                  aria-label="Fechar painel de ajuda"
                >
                  <span className="text-lg">✕</span>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2">
                <div className="space-y-2">
                  {/* Instructions */}
                  <div className="bg-page border border-border rounded-lg p-2">
                    <h4 className="font-semibold text-text mb-1.5 text-xs">Como Jogar</h4>
                    <ul className="text-xs text-text-secondary space-y-2">
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">⌨️</span>
                        <span>Use <kbd className="px-1 py-0.5 bg-page-secondary border border-border rounded text-xs">Setas</kbd> ou <kbd className="px-1 py-0.5 bg-page-secondary border border-border rounded text-xs">WASD</kbd> para mover</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">📱</span>
                        <span>No mobile: deslize para mover</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">🐛</span>
                        <span>Guie o bug até o patch (✓)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">⏱️</span>
                        <span>Score = tempo + movimentos</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">🔄</span>
                        <span>Pressione <kbd className="px-1 py-0.5 bg-page-secondary border border-border rounded text-xs">R</kbd> para reiniciar</span>
                      </li>
                    </ul>
                  </div>

                  {/* Tips */}
                  <div className="bg-primary/10 border border-primary rounded-lg p-2">
                    <h4 className="font-semibold text-primary mb-1.5 text-xs flex items-center gap-1">
                      <span>💡</span> Dicas
                    </h4>
                    <ul className="text-xs text-text-secondary space-y-1">
                      <li>• Menos movimentos = mais pontos</li>
                      <li>• Tempo menor = score maior</li>
                      <li>• Planeje o caminho antes</li>
                      <li>• Evite voltar pelo mesmo caminho</li>
                    </ul>
                  </div>

                  {/* Strategy */}
                  <div className="bg-page border border-border rounded-lg p-2">
                    <h4 className="font-semibold text-text mb-1.5 text-xs flex items-center gap-1">
                      <span>🎯</span> Estratégia
                    </h4>
                    <ul className="text-xs text-text-secondary space-y-1">
                      <li><strong className="text-success">Início:</strong> Explore o labirinto</li>
                      <li><strong className="text-primary">Meio:</strong> Encontre o caminho mais curto</li>
                      <li><strong className="text-error">Avançado:</strong> Otimize tempo e movimentos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Floating help button when panel is hidden */}
        <AnimatePresence>
          {!showHelpPanel && (
            <motion.button
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              onClick={() => setShowHelpPanel(true)}
              className="hidden lg:flex fixed left-4 bottom-4 z-40 w-10 h-10 items-center justify-center bg-primary text-white rounded-full shadow-glow hover:scale-110 transition-transform"
              aria-label="Mostrar painel de ajuda"
            >
              <span className="text-lg">📖</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Main game content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Stats bar */}
          <div className="p-2 border-b border-border bg-page-secondary flex-shrink-0">
            <ScoreDisplay
              moves={gameState.moves}
              duration={gameState.duration}
              level={gameState.level}
            />
          </div>

          {/* Game area */}
          <div className="flex-1 overflow-hidden flex items-center justify-center p-4">
            <div className="w-full h-full max-w-4xl max-h-[600px] bg-page-secondary border border-border rounded-xl overflow-hidden">
              <MazeCanvas
                gameState={gameState}
                onUpdate={handleCanvasUpdate}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={showGameOverModal}
        gameState={gameState}
        onPlayAgain={handlePlayAgain}
        onNextLevel={handleNextLevel}
      />
    </div>
  )
}

