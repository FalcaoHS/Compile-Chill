"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useThemeStore } from "@/lib/theme-store"
import { RefactorGrid } from "@/components/games/refactor-rush/RefactorGrid"
import { ScoreDisplay } from "@/components/games/refactor-rush/ScoreDisplay"
import { GameOverModal } from "@/components/games/refactor-rush/GameOverModal"
import { UndoButton } from "@/components/games/refactor-rush/UndoButton"
import { ParticleEffect } from "@/components/games/refactor-rush/ParticleEffect"
import {
  type GameState,
  type Level,
  type BlockPosition,
  createInitialGameState,
  moveBlock,
  undoLastMove,
  updateGameState,
  resetGame,
  loadLevelByNumber,
  loadDefaultLevel,
  getNextLevel,
  calculateScore,
  loadBestScore,
  saveBestScore,
  getScoreData,
} from "@/lib/games/refactor-rush/game-logic"
import type { ParticleConfig } from "@/lib/games/refactor-rush/particles"

const UPDATE_INTERVAL = 16 // ~60 FPS

export default function RefactorRushPage() {
  const { data: session } = useSession()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [level, setLevel] = useState<Level | null>(null)
  const [showHelpPanel, setShowHelpPanel] = useState(true)
  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<BlockPosition | null>(null)
  const [particleConfig, setParticleConfig] = useState<ParticleConfig | null>(null)
  const gameStateRef = useRef<GameState | null>(null)
  const { theme: themeId } = useThemeStore()

  // Keep ref in sync with state
  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  // Initialize game state
  useEffect(() => {
    const defaultLevel = loadDefaultLevel()
    if (defaultLevel) {
      setLevel(defaultLevel)
      const initialState = createInitialGameState(defaultLevel)
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
        if (updated.completed && !prevState.completed) {
          setShowGameOverModal(true)
          
          // Trigger completion particles
          setParticleConfig({
            type: 'completion',
            theme: themeId,
            position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
          })
        }
        
        return updated
      })
    }, UPDATE_INTERVAL)

    return () => clearInterval(interval)
  }, [gameState, themeId])

  // Handle block movement
  const handleBlockMove = useCallback((from: BlockPosition, to: BlockPosition) => {
    if (!gameState || gameState.gameOver) return

    setGameState(prevState => {
      if (!prevState) return prevState
      const newState = moveBlock(prevState, from, to)
      
      // Trigger placement particles
      const cellElement = document.querySelector(`[data-row="${to.row}"][data-col="${to.col}"]`)
      if (cellElement) {
        const rect = cellElement.getBoundingClientRect()
        setParticleConfig({
          type: 'placement',
          theme: themeId,
          position: {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          },
        })
      }
      
      return newState
    })
    
    setSelectedBlock(null)
  }, [gameState, themeId])

  // Handle undo
  const handleUndo = useCallback(() => {
    if (!gameState || gameState.moveHistory.length === 0) return

    setGameState(prevState => {
      if (!prevState) return prevState
      return undoLastMove(prevState)
    })
  }, [gameState])

  // Handle play again
  const handlePlayAgain = useCallback(() => {
    if (!level) return
    const newState = resetGame(level)
    setGameState(newState)
    gameStateRef.current = newState
    setShowGameOverModal(false)
    setSelectedBlock(null)
  }, [level])

  // Handle next level
  const handleNextLevel = useCallback(() => {
    if (!gameState) return
    const nextLevelNum = getNextLevel(gameState.level)
    if (nextLevelNum) {
      const nextLevel = loadLevelByNumber(nextLevelNum)
      if (nextLevel) {
        setLevel(nextLevel)
        const newState = createInitialGameState(nextLevel)
        setGameState(newState)
        gameStateRef.current = newState
        setShowGameOverModal(false)
        setSelectedBlock(null)
      }
    }
  }, [gameState])

  // Submit score
  const submitScore = useCallback(async (state: GameState) => {
    if (!session?.user) return

    const scoreData = getScoreData(state)
    
    try {
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: "refactor-rush",
          score: scoreData.score,
          metadata: {
            moves: scoreData.moves,
            duration: scoreData.duration,
            gridSize: scoreData.gridSize,
            correctPlacements: scoreData.correctPlacements,
            levelId: scoreData.levelId,
          },
        }),
      })

      if (!response.ok) {
        
      }
    } catch (error) {
      
    }
  }, [session])

  // Submit score when game completes
  useEffect(() => {
    if (gameState?.completed && session?.user) {
      submitScore(gameState)
    }
  }, [gameState?.completed, session, submitScore])

  if (!gameState || !level) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-pulse">🎮</div>
          <p className="text-text-secondary">Carregando...</p>
        </div>
      </div>
    )
  }

  const bestScore = loadBestScore(gameState.level)
  const currentScore = calculateScore(gameState).score

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
            Refactor Rush
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
                        <p className="text-xs mt-1">Arraste e solte os blocos para reorganizá-los</p>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="flex-shrink-0">📱</span>
                      <div>
                        <strong className="text-text">Mobile:</strong>
                        <p className="text-xs mt-1">Toque para selecionar, depois toque onde quer colocar</p>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="flex-shrink-0">↶</span>
                      <div>
                        <strong className="text-text">Desfazer:</strong>
                        <p className="text-xs mt-1">Use o botão Undo para desfazer o último movimento</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {level.rules && (
                  <div className="bg-page border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-text mb-2 text-sm">Regras do Nível {level.level}</h4>
                    <p className="text-sm text-text-secondary">{level.rules}</p>
                  </div>
                )}
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
              score={currentScore}
              bestScore={bestScore}
              time={gameState.duration}
              moves={gameState.moves}
              level={gameState.level}
            />
          </div>

          {/* Game area */}
          <div className="flex-1 overflow-hidden flex items-center justify-center p-2 sm:p-4 relative min-h-0">
            <div className="w-full h-full max-w-4xl flex flex-col items-center justify-center gap-3 sm:gap-4">
              <RefactorGrid
                gameState={gameState}
                level={level}
                onBlockMove={handleBlockMove}
                selectedBlock={selectedBlock}
                onBlockSelect={setSelectedBlock}
              />
              
              {/* Undo Button */}
              <div className="flex-shrink-0">
                <UndoButton
                  onClick={handleUndo}
                  disabled={gameState.moveHistory.length === 0}
                />
              </div>
            </div>

            {/* Particle Effects */}
            {particleConfig && (
              <ParticleEffect
                config={particleConfig}
                onComplete={() => setParticleConfig(null)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={showGameOverModal}
        score={currentScore}
        bestScore={Math.max(bestScore, currentScore)}
        time={gameState.duration}
        moves={gameState.moves}
        level={gameState.level}
        onPlayAgain={handlePlayAgain}
        onNextLevel={handleNextLevel}
        hasNextLevel={getNextLevel(gameState.level) !== null}
      />
    </div>
  )
}

