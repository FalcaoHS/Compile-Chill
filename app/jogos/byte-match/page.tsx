"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { CardGrid } from "@/components/games/byte-match/CardGrid"
import { ScoreDisplay } from "@/components/games/byte-match/ScoreDisplay"
import { GameOverModal } from "@/components/games/byte-match/GameOverModal"
import {
  createInitialGameState,
  processCardFlip,
  handleNonMatch,
  calculateScore,
  resetGame,
  loadBestScore,
  type GameState,
} from "@/lib/games/byte-match/game-logic"

export default function ByteMatchPage() {
  const { data: session } = useSession()
  const [gameState, setGameState] = useState<GameState>(() => {
    const bestScore = loadBestScore()
    return createInitialGameState(bestScore)
  })
  const [currentDuration, setCurrentDuration] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [scoreSaved, setScoreSaved] = useState(false)
  const [showHelpPanel, setShowHelpPanel] = useState(true)
  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update timer in real-time
  useEffect(() => {
    if (gameState.gameOver) {
      return
    }

    const interval = setInterval(() => {
      setCurrentDuration(Date.now() - gameState.startTime)
    }, 100) // Update every 100ms for smooth display

    return () => clearInterval(interval)
  }, [gameState.startTime, gameState.gameOver])

  // Handle card click
  const handleCardClick = useCallback((index: number) => {
    if (isProcessing || gameState.gameOver) {
      return
    }

    // Process the card flip
    const newState = processCardFlip(gameState, index)
    setGameState(newState)

    // If we have 2 flipped cards, check if they match
    if (newState.flippedCards.length === 2) {
      const [idx1, idx2] = newState.flippedCards
      const card1 = newState.cards[idx1]
      const card2 = newState.cards[idx2]

      // Check if cards match
      if (card1.type === card2.type && card1.id !== card2.id) {
        // Match found - already handled in processCardFlip/handleMatch
        setIsProcessing(false)
      } else {
        // No match - flip back after delay
        setIsProcessing(true)
        
        // Clear any existing timeout
        if (flipTimeoutRef.current) {
          clearTimeout(flipTimeoutRef.current)
        }

        // Flip back after 500ms delay (this will increment moves)
        flipTimeoutRef.current = setTimeout(() => {
          setGameState(prevState => handleNonMatch(prevState))
          setIsProcessing(false)
          flipTimeoutRef.current = null
        }, 500)
      }
    }
  }, [gameState, isProcessing])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (flipTimeoutRef.current) {
        clearTimeout(flipTimeoutRef.current)
      }
    }
  }, [])

  // Save score to API when game ends
  useEffect(() => {
    if (gameState.gameOver && !scoreSaved && session?.user && gameState.moves > 0) {
      setScoreSaved(true)
      
      const saveScore = async () => {
        try {
          const score = calculateScore(gameState.moves)
          const duration = Math.floor(gameState.duration / 1000) // in seconds
          
          const response = await fetch('/api/scores', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              gameId: 'byte-match',
              score,
              duration,
              moves: gameState.moves,
              metadata: {
                gridSize: 4,
                matches: gameState.matches,
                seed: gameState.seed,
              },
              gameState: {
                matches: gameState.matches,
                moves: gameState.moves,
                startTime: gameState.startTime,
                endTime: gameState.startTime + gameState.duration,
                seed: gameState.seed,
              },
            }),
          })
          
          if (!response.ok) {
            const error = await response.json()
            
          } else {
            
          }
        } catch (error) {
          
        }
      }
      
      saveScore()
    }
  }, [gameState.gameOver, gameState.moves, gameState.duration, gameState.matches, gameState.startTime, gameState.seed, session, scoreSaved])

  const handlePlayAgain = () => {
    // Clear any pending timeout
    if (flipTimeoutRef.current) {
      clearTimeout(flipTimeoutRef.current)
      flipTimeoutRef.current = null
    }

    const bestScore = loadBestScore()
    setGameState(resetGame(bestScore))
    setCurrentDuration(0)
    setScoreSaved(false)
    setIsProcessing(false)
  }

  // Get matched card indices
  const matchedIndices = gameState.cards
    .map((card, index) => card.state === 'matched' ? index : -1)
    .filter(idx => idx !== -1)

  // Calculate current score
  const currentScore = gameState.gameOver 
    ? calculateScore(gameState.moves)
    : calculateScore(gameState.moves)

  return (
    <div className="h-screen flex flex-col bg-page overflow-hidden pt-16">
      {/* Header */}
      <header className="border-b border-border bg-page-secondary flex-shrink-0 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link
            href="/"
            className="text-text hover:text-primary transition-colors font-semibold"
          >
            ← Voltar
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-text font-theme">
            Byte Match
          </h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Help Panel (Desktop) */}
        <AnimatePresence>
          {showHelpPanel && (
            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="hidden lg:flex flex-col w-80 border-r border-border bg-page-secondary flex-shrink-0"
            >
              <header className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-text">Como Jogar</h3>
                <button
                  onClick={() => setShowHelpPanel(false)}
                  className="text-text-secondary hover:text-text transition-colors"
                  aria-label="Fechar painel de ajuda"
                >
                  ✕
                </button>
              </header>
              
              <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-page border border-border rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-text mb-3 text-sm">Instruções Básicas</h4>
                  <ul className="text-sm text-text-secondary space-y-3">
                    <li className="flex gap-2">
                      <span className="flex-shrink-0">🖱️</span>
                      <div>
                        <strong className="text-text">Desktop:</strong>
                        <p className="text-xs mt-1">Clique nas cartas para virá-las</p>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="flex-shrink-0">📱</span>
                      <div>
                        <strong className="text-text">Mobile:</strong>
                        <p className="text-xs mt-1">Toque nas cartas para virá-las</p>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="flex-shrink-0">🎯</span>
                      <div>
                        <strong className="text-text">Objetivo:</strong>
                        <p className="text-xs mt-1">Encontre todos os pares correspondentes</p>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="flex-shrink-0">⭐</span>
                      <div>
                        <strong className="text-text">Pontuação:</strong>
                        <p className="text-xs mt-1">Menos movimentos = maior pontuação!</p>
                      </div>
                    </li>
                  </ul>
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
              title="Mostrar painel de ajuda e instruções"
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
              duration={gameState.gameOver ? gameState.duration : currentDuration}
              score={currentScore}
            />
          </div>

          {/* Game area */}
          <div className="flex-1 overflow-hidden flex items-center justify-center p-2 sm:p-4 relative min-h-0">
            <div className="w-full h-full max-w-4xl flex items-center justify-center">
              <CardGrid
                cards={gameState.cards}
                flippedIndices={gameState.flippedCards}
                matchedIndices={matchedIndices}
                onCardClick={handleCardClick}
                disabled={isProcessing || gameState.gameOver}
              />
            </div>

            {/* Invisible overlay during delay to prevent clicks */}
            {isProcessing && (
              <div className="fixed inset-0 z-40" style={{ pointerEvents: 'none' }} />
            )}
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={gameState.gameOver}
        score={currentScore}
        moves={gameState.moves}
        duration={gameState.duration}
        bestScore={gameState.bestScore}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  )
}

