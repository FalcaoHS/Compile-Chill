'use client'

import { useState, useEffect, useCallback, useRef, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import MiningButton from '@/components/games/crypto-miner/MiningButton'
import StatsDisplay from '@/components/games/crypto-miner/StatsDisplay'
import UpgradesPanel from '@/components/games/crypto-miner/UpgradesPanel'
import OfflineEarningsModal from '@/components/games/crypto-miner/OfflineEarningsModal'
import {
  GameState,
  createInitialState,
  handleClick,
  calculateCoinsPerSecond,
  processTick,
  calculateOfflineEarnings,
  purchaseMiner,
  purchaseClickUpgrade,
  purchaseMultiplier
} from '@/lib/games/crypto-miner/game-logic'
import {
  saveGameState,
  loadGameState
} from '@/lib/games/crypto-miner/storage'

const TICK_INTERVAL = 1000 // 1 second
const SAVE_INTERVAL = 5000 // 5 seconds
const MAX_CLICK_RATE = 20 // clicks per second
const CLICK_WINDOW = 1000 // 1 second window

export default function CryptoMinerPage() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [showOfflineModal, setShowOfflineModal] = useState(false)
  const [offlineEarnings, setOfflineEarnings] = useState({ coins: 0, timeAway: 0 })
  const [showHelpPanel, setShowHelpPanel] = useState(true)
  
  // Click rate limiting
  const clickTimestamps = useRef<number[]>([])
  const [clicksDisabled, setClicksDisabled] = useState(false)
  const gameStateRef = useRef<GameState | null>(null)

  // Keep ref in sync with state
  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  // Initialize game state
  useEffect(() => {
    const savedState = loadGameState()
    const currentTime = Date.now()
    
    if (savedState) {
      // Calculate offline earnings
      const offline = calculateOfflineEarnings(savedState, currentTime)
      
      if (offline.coins > 0) {
        setOfflineEarnings(offline)
        setShowOfflineModal(true)
      }
      
      // Update game state with current time
      const initialState = {
        ...savedState,
        lastTickTime: currentTime,
        lastSaveTime: currentTime
      }
      setGameState(initialState)
      gameStateRef.current = initialState
    } else {
      // New game
      const initialState = createInitialState()
      setGameState(initialState)
      gameStateRef.current = initialState
    }
  }, [])

  // Game loop - passive income tick
  useEffect(() => {
    if (!gameState) return

    const interval = setInterval(() => {
      setGameState(prevState => {
        if (!prevState) return prevState
        const currentTime = Date.now()
        const newState = processTick(prevState, currentTime)
        gameStateRef.current = newState
        return newState
      })
    }, TICK_INTERVAL)

    return () => clearInterval(interval)
  }, [!!gameState]) // Only recreate when gameState changes from null to non-null

  // Auto-save
  useEffect(() => {
    if (!gameState) return

    const interval = setInterval(() => {
      saveGameState(gameState)
    }, SAVE_INTERVAL)

    return () => clearInterval(interval)
  }, [gameState])

  // Save on window unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (gameState) {
        saveGameState(gameState)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [gameState])

  // Handle page visibility for pause/resume
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && gameState) {
        saveGameState(gameState)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [gameState])

  // Click handler with rate limiting
  const handleMiningClick = useCallback(() => {
    if (!gameState || clicksDisabled) return

    const now = Date.now()
    
    // Remove old timestamps outside the window
    clickTimestamps.current = clickTimestamps.current.filter(
      timestamp => now - timestamp < CLICK_WINDOW
    )
    
    // Check rate limit
    if (clickTimestamps.current.length >= MAX_CLICK_RATE) {
      setClicksDisabled(true)
      setTimeout(() => setClicksDisabled(false), 1000)
      return
    }
    
    // Add current timestamp
    clickTimestamps.current.push(now)
    
    // Process click
    setGameState(prevState => {
      if (!prevState) return prevState
      return handleClick(prevState)
    })
  }, [gameState, clicksDisabled])

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault()
        handleMiningClick()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleMiningClick])

  // Purchase handlers
  const handlePurchaseMiner = useCallback((minerId: string) => {
    setGameState(prevState => {
      if (!prevState) return prevState
      const newState = purchaseMiner(prevState, minerId)
      if (newState !== prevState) {
        saveGameState(newState)
      }
      return newState
    })
  }, [])

  const handlePurchaseClickUpgrade = useCallback(() => {
    setGameState(prevState => {
      if (!prevState) return prevState
      const newState = purchaseClickUpgrade(prevState)
      if (newState !== prevState) {
        saveGameState(newState)
      }
      return newState
    })
  }, [])

  const handlePurchaseMultiplier = useCallback((multId: string) => {
    setGameState(prevState => {
      if (!prevState) return prevState
      const newState = purchaseMultiplier(prevState, multId)
      if (newState !== prevState) {
        saveGameState(newState)
      }
      return newState
    })
  }, [])

  // Collect offline earnings
  const handleCollectOfflineEarnings = useCallback(() => {
    if (!gameState) return
    
    setGameState(prevState => {
      if (!prevState) return prevState
      return {
        ...prevState,
        coins: prevState.coins + offlineEarnings.coins
      }
    })
    
    setShowOfflineModal(false)
  }, [gameState, offlineEarnings])

  if (!gameState) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">⛏️</div>
          <p className="text-text-secondary">Carregando mineradora...</p>
        </div>
      </div>
    )
  }

  const coinsPerSecond = calculateCoinsPerSecond(gameState)

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
              <span>⛏️</span>
              Crypto Miner
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
                        <span className="flex-shrink-0">🖱️</span>
                        <span>Clique no botão ou pressione <kbd className="px-1 py-0.5 bg-page-secondary border border-border rounded text-xs">Espaço</kbd></span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">⛏️</span>
                        <span>Compre mineradores para ganhos passivos</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">⌨️</span>
                        <span>Melhore poder de clique para mais moedas</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">⚡</span>
                        <span>Multiplicadores aumentam toda produção</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">💰</span>
                        <span>Ganhe moedas mesmo offline!</span>
                      </li>
                    </ul>
                  </div>

                  {/* Tips */}
                  <div className="bg-primary/10 border border-primary rounded-lg p-2">
                    <h4 className="font-semibold text-primary mb-1.5 text-xs flex items-center gap-1">
                      <span>💡</span> Dicas
                    </h4>
                    <ul className="text-xs text-text-secondary space-y-1">
                      <li>• Compre mineradores cedo</li>
                      <li>• Balance cliques e mineradores</li>
                      <li>• Multiplicadores afetam tudo</li>
                      <li>• Volte para coletar offline</li>
                    </ul>
                  </div>

                  {/* Strategy */}
                  <div className="bg-page border border-border rounded-lg p-2">
                    <h4 className="font-semibold text-text mb-1.5 text-xs flex items-center gap-1">
                      <span>🎯</span> Estratégia
                    </h4>
                    <ul className="text-xs text-text-secondary space-y-1">
                      <li><strong className="text-success">Início:</strong> Cliques + primeiros mineradores</li>
                      <li><strong className="text-primary">Meio:</strong> Balance mineradores médios</li>
                      <li><strong className="text-error">Avançado:</strong> Multiplicadores + top miners</li>
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
            <StatsDisplay
              coins={gameState.coins}
              coinsPerSecond={coinsPerSecond}
              coinsPerClick={gameState.coinsPerClick}
              totalClicks={gameState.totalClicks}
            />
          </div>

          {/* Game area */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full grid lg:grid-cols-2 gap-4 p-4">
              {/* Mining area */}
              <div className="flex flex-col items-center justify-center bg-page-secondary border border-border rounded-xl p-6 lg:p-8">
                <MiningButton
                  onClick={handleMiningClick}
                  coinsPerClick={gameState.coinsPerClick}
                  disabled={clicksDisabled}
                />
                {clicksDisabled && (
                  <p className="text-sm text-error mt-4">
                    ⚠️ Clicks muito rápidos! Aguarde um momento...
                  </p>
                )}
              </div>

              {/* Upgrades panel */}
              <div className="flex flex-col h-full overflow-hidden">
                <UpgradesPanel
                  gameState={gameState}
                  onPurchaseMiner={handlePurchaseMiner}
                  onPurchaseClickUpgrade={handlePurchaseClickUpgrade}
                  onPurchaseMultiplier={handlePurchaseMultiplier}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offline earnings modal */}
      <OfflineEarningsModal
        isOpen={showOfflineModal}
        coinsEarned={offlineEarnings.coins}
        timeAway={offlineEarnings.timeAway}
        onCollect={handleCollectOfflineEarnings}
      />
    </div>
  )
}

