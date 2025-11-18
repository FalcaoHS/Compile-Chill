"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { HackGridCanvas } from "@/components/games/hack-grid/HackGridCanvas"
import { ScoreDisplay } from "@/components/games/hack-grid/ScoreDisplay"
import { GameOverModal } from "@/components/games/hack-grid/GameOverModal"
import {
  createInitialGameState,
  addConnection,
  selectNode,
  updateGameState,
  resetGame,
  loadLevelByNumber,
  loadDefaultLevel,
  getNextLevel,
  getScoreData,
  calculateScore,
  type GameState,
} from "@/lib/games/hack-grid/game-logic"

export default function HackGridPage() {
  const { data: session } = useSession()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [bestScore, setBestScore] = useState(0)
  const [scoreSaved, setScoreSaved] = useState(false)
  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null)

  // Initialize game
  useEffect(() => {
    const level = loadDefaultLevel()
    if (level) {
      const initialState = createInitialGameState(level)
      setGameState(initialState)
      
      // Load best score from localStorage
      const savedBest = localStorage.getItem(`hack-grid-best-${level.level}`)
      if (savedBest) {
        setBestScore(parseInt(savedBest, 10))
      }
    }
  }, [])

  // Update game state on each frame
  useEffect(() => {
    if (!gameState || gameState.gameOver) return

    const interval = setInterval(() => {
      setGameState(prevState => {
        if (!prevState) return prevState
        return updateGameState(prevState)
      })
    }, 100) // Update every 100ms

    return () => clearInterval(interval)
  }, [gameState?.gameOver])

  // Check for completion and show modal
  useEffect(() => {
    if (gameState?.completed && !showGameOverModal) {
      setShowGameOverModal(true)
      
      // Calculate score
      const scoreCalc = calculateScore(gameState)
      const finalScore = scoreCalc.score
      
      // Update best score
      if (finalScore > bestScore) {
        setBestScore(finalScore)
        localStorage.setItem(`hack-grid-best-${gameState.currentLevel}`, finalScore.toString())
      }
    }
  }, [gameState?.completed, showGameOverModal, bestScore, gameState?.currentLevel])

  // Save score to API when game ends
  useEffect(() => {
    if (gameState?.completed && !scoreSaved && session?.user && gameState) {
      setScoreSaved(true)
      
      const saveScore = async () => {
        try {
          // Debug: Log authentication status
          console.log('[score-submission] Attempting to save score', {
            hasSession: !!session,
            hasUser: !!session?.user,
            userId: session?.user?.id,
            gameId: 'hack-grid',
          })
          
          const scoreData = getScoreData(gameState)
          
          // Convert duration from milliseconds to seconds
          const durationInSeconds = Math.floor(scoreData.duration / 1000)
          
          const response = await fetch('/api/scores', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for authentication
            body: JSON.stringify({
              gameId: 'hack-grid',
              score: scoreData.score,
              duration: durationInSeconds,
              moves: scoreData.moves,
              level: scoreData.level,
              metadata: scoreData.metadata,
              gameState: {
                currentLevel: gameState.currentLevel,
                nodes: gameState.nodes.map(n => ({ id: n.id, row: n.row, col: n.col })),
                connections: gameState.connections,
                duration: gameState.duration,
                moves: gameState.moves,
                segments: gameState.segments,
                completed: gameState.completed,
              },
            }),
          })
          
          if (!response.ok) {
            if (response.status === 401) {
              const errorData = await response.json().catch(() => ({}))
              console.warn('[score-submission] User not authenticated, score not saved to server', {
                error: errorData,
                sessionStatus: {
                  hasSession: !!session,
                  hasUser: !!session?.user,
                  userId: session?.user?.id,
                },
              })
            } else {
              const error = await response.json()
              console.error('[score-submission] Failed to save score:', error)
            }
          } else {
            const result = await response.json().catch(() => ({}))
            console.log('[score-submission] Score saved successfully!', result)
          }
        } catch (error) {
          console.error('Error saving score:', error)
        }
      }
      
      saveScore()
    }
  }, [gameState?.completed, scoreSaved, session, gameState])

  // Handle node click (for tap-to-tap selection)
  const handleNodeClick = useCallback((nodeId: string) => {
    if (!gameState || gameState.gameOver) return
    
    // Use tap-to-tap selection
    setGameState(prevState => {
      if (!prevState) return prevState
      return selectNode(prevState, nodeId)
    })
  }, [gameState])

  // Handle node drag start
  const handleNodeDragStart = useCallback((nodeId: string) => {
    setDraggedNodeId(nodeId)
  }, [])

  // Handle node drag end (create connection)
  const handleNodeDragEnd = useCallback((targetNodeId: string) => {
    if (!gameState || gameState.gameOver || !draggedNodeId) {
      setDraggedNodeId(null)
      return
    }
    
    // Only create connection if target is different from source and valid
    if (targetNodeId && draggedNodeId !== targetNodeId) {
      setGameState(prevState => {
        if (!prevState) return prevState
        const newState = addConnection(prevState, draggedNodeId, targetNodeId)
        // Debug: log connection attempt
        if (newState.connections.length === prevState.connections.length) {
          console.log('Connection failed validation:', draggedNodeId, '->', targetNodeId)
        } else {
          console.log('Connection added:', draggedNodeId, '->', targetNodeId, 'Total:', newState.connections.length)
        }
        return newState
      })
    }
    setDraggedNodeId(null)
  }, [gameState, draggedNodeId])

  // Handle play again
  const handlePlayAgain = useCallback(() => {
    if (!gameState) return
    
    const level = loadLevelByNumber(gameState.currentLevel)
    if (level) {
      const newState = resetGame(gameState, level)
      setGameState(newState)
      setScoreSaved(false)
      setShowGameOverModal(false)
    }
  }, [gameState])

  // Handle next level
  const handleNextLevel = useCallback(() => {
    if (!gameState) return
    
    const nextLevelNum = getNextLevel(gameState.currentLevel)
    if (nextLevelNum) {
      const nextLevel = loadLevelByNumber(nextLevelNum)
      if (nextLevel) {
        const newState = createInitialGameState(nextLevel)
        setGameState(newState)
        setScoreSaved(false)
        setShowGameOverModal(false)
        
        // Load best score for next level
        const savedBest = localStorage.getItem(`hack-grid-best-${nextLevelNum}`)
        if (savedBest) {
          setBestScore(parseInt(savedBest, 10))
        } else {
          setBestScore(0)
        }
      }
    }
  }, [gameState])

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text">Carregando...</div>
      </div>
    )
  }

  const scoreCalc = calculateScore(gameState)
  const currentScore = gameState.completed ? scoreCalc.score : 0
  const hasNextLevel = getNextLevel(gameState.currentLevel) !== null

  return (
    <div className="h-screen flex flex-col bg-page overflow-hidden pt-16">
      {/* Header */}
      <div className="flex-shrink-0 p-2 sm:p-4 border-b border-border bg-page-secondary">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-text hover:text-primary transition-colors text-sm sm:text-base"
          >
            ← Voltar
          </Link>
          <h1 className="text-lg sm:text-xl font-bold text-text font-theme">
            Hack Grid
          </h1>
          <div className="text-xs sm:text-sm text-text-secondary">
            Nível {gameState.currentLevel}
          </div>
        </div>
      </div>

      {/* Score Display */}
      <div className="flex-shrink-0 p-2 sm:p-3 border-b border-border bg-page-secondary">
        <ScoreDisplay
          score={currentScore}
          bestScore={bestScore}
          time={gameState.duration}
          moves={gameState.moves}
        />
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden min-h-0">
        <div className="w-full h-full max-w-2xl bg-page-secondary border border-border rounded-xl overflow-hidden flex items-center justify-center">
          <HackGridCanvas
            gameState={gameState}
            onNodeClick={handleNodeClick}
            onNodeDragStart={handleNodeDragStart}
            onNodeDragEnd={handleNodeDragEnd}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="flex-shrink-0 p-2 sm:p-3 border-t border-border bg-page-secondary">
        <div className="max-w-7xl mx-auto text-center text-xs sm:text-sm text-text-secondary">
          <p className="font-semibold text-text mb-1">Conecte cada par correspondente de nós para completar o puzzle.</p>
          <p className="text-xs">Nós obrigatórios têm um anel brilhante. Arraste entre nós para criar conexões seguindo o grid.</p>
        </div>
      </div>

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={showGameOverModal}
        score={currentScore}
        bestScore={bestScore}
        time={gameState.duration}
        moves={gameState.moves}
        level={gameState.currentLevel}
        onPlayAgain={handlePlayAgain}
        onNextLevel={hasNextLevel ? handleNextLevel : undefined}
        hasNextLevel={hasNextLevel}
      />
    </div>
  )
}

