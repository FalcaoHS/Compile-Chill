"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { PacketSwitchCanvas } from "@/components/games/packet-switch/PacketSwitchCanvas"
import { ScoreDisplay } from "@/components/games/packet-switch/ScoreDisplay"
import { GameOverModal } from "@/components/games/packet-switch/GameOverModal"
import {
  createInitialGameState,
  routePacketToNode,
  updatePacketPositions,
  checkCompletion,
  resetGame,
  loadLevelByNumber,
  loadDefaultLevel,
  getNextLevel,
  getScoreData,
  calculateScore,
  type GameState,
} from "@/lib/games/packet-switch/game-logic"

export default function PacketSwitchPage() {
  const { data: session } = useSession()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [bestScore, setBestScore] = useState(0)
  const [scoreSaved, setScoreSaved] = useState(false)
  const [showGameOverModal, setShowGameOverModal] = useState(false)

  // Initialize game
  useEffect(() => {
    const level = loadDefaultLevel()
    if (level) {
      const initialState = createInitialGameState(level)
      setGameState(initialState)
      
      // Load best score from localStorage
      const savedBest = localStorage.getItem(`packet-switch-best-${level.level}`)
      if (savedBest) {
        setBestScore(parseInt(savedBest, 10))
      }
    }
  }, [])

  // Update game state on each frame
  const handleUpdate = useCallback((deltaTime: number) => {
    if (!gameState || gameState.gameOver) return

    setGameState(prevState => {
      if (!prevState) return prevState
      
      // Update packet positions
      let updatedState = updatePacketPositions(prevState)
      
      // Check for completion
      updatedState = checkCompletion(updatedState)
      
      return updatedState
    })
  }, [gameState?.gameOver])

  // Check for completion and show modal
  useEffect(() => {
    if (gameState?.completed && !showGameOverModal) {
      setShowGameOverModal(true)
      
      // Calculate score
      const finalScore = calculateScore(gameState)
      
      // Update best score
      if (finalScore > bestScore) {
        setBestScore(finalScore)
        localStorage.setItem(`packet-switch-best-${gameState.currentLevel}`, finalScore.toString())
      }
    }
  }, [gameState?.completed, showGameOverModal, bestScore, gameState?.currentLevel])

  // Save score to API when game ends
  useEffect(() => {
    if (gameState?.completed && !scoreSaved && session?.user && gameState) {
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
              gameId: 'packet-switch',
              score: scoreData.score,
              duration: durationInSeconds,
              moves: scoreData.moves,
              level: scoreData.levelId,
              metadata: {
                packetsDelivered: scoreData.packetsDelivered,
                averageHops: scoreData.averageHops,
                levelId: scoreData.levelId,
              },
            }),
          })
          
          if (!response.ok) {
            if (response.status === 401) {
              console.warn('[score-submission] User not authenticated, score not saved to server')
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

  // Handle node click
  const handleNodeClick = useCallback((nodeId: string) => {
    if (!gameState || gameState.gameOver) return

    setGameState(prevState => {
      if (!prevState) return prevState

      // Find a packet that needs routing (not at destination, no current target)
      const packetNeedingRoute = prevState.activePackets.find(
        p => !p.targetNodeId && 
             p.currentNodeId !== p.destinationNodeId &&
             p.currentNodeId !== nodeId // Don't route to same node
      )

      if (!packetNeedingRoute) return prevState

      // Route the packet to the clicked node
      return routePacketToNode(packetNeedingRoute.id, nodeId, prevState)
    })
  }, [gameState])

  // Handle play again
  const handlePlayAgain = useCallback(() => {
    if (!gameState) return

    const level = loadLevelByNumber(gameState.currentLevel)
    if (level) {
      const newState = resetGame(level)
      setGameState(newState)
      setShowGameOverModal(false)
      setScoreSaved(false)
    }
  }, [gameState])

  // Handle next level
  const handleNextLevel = useCallback(() => {
    if (!gameState) return

    const nextLevelNum = getNextLevel(gameState.currentLevel)
    if (nextLevelNum) {
      const level = loadLevelByNumber(nextLevelNum)
      if (level) {
        const newState = resetGame(level)
        setGameState(newState)
        setShowGameOverModal(false)
        setScoreSaved(false)
        
        // Load best score for new level
        const savedBest = localStorage.getItem(`packet-switch-best-${nextLevelNum}`)
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
      <div className="h-screen flex items-center justify-center bg-page">
        <div className="text-text">Carregando...</div>
      </div>
    )
  }

  const currentScore = calculateScore(gameState)
  const hasNextLevel = getNextLevel(gameState.currentLevel) !== null

  return (
    <div className="h-screen flex flex-col bg-page overflow-hidden">
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
            Packet Switch
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
          packetsDelivered={gameState.completedPackets}
        />
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden min-h-0">
        <div className="w-full h-full max-w-4xl bg-page-secondary border border-border rounded-xl overflow-hidden flex items-center justify-center">
          <PacketSwitchCanvas
            gameState={gameState}
            onNodeClick={handleNodeClick}
            onUpdate={handleUpdate}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="flex-shrink-0 p-2 sm:p-3 border-t border-border bg-page-secondary">
        <div className="max-w-7xl mx-auto text-center text-xs sm:text-sm text-text-secondary">
          Clique/tap nos nós para rotear pacotes da origem ao destino
        </div>
      </div>

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={showGameOverModal}
        gameState={{
          score: currentScore,
          duration: gameState.duration,
          moves: gameState.moves,
          completedPackets: gameState.completedPackets,
          averageHops: gameState.averageHops,
        }}
        bestScore={bestScore}
        hasNextLevel={hasNextLevel}
        onPlayAgain={handlePlayAgain}
        onNextLevel={hasNextLevel ? handleNextLevel : undefined}
      />
    </div>
  )
}

