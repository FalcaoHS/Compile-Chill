'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { formatNumber } from '@/lib/games/crypto-miner/game-logic'
import { useEffect, useState } from 'react'

interface StatsDisplayProps {
  coins: number
  coinsPerSecond: number
  coinsPerClick: number
  totalClicks: number
}

export default function StatsDisplay({ coins, coinsPerSecond, coinsPerClick, totalClicks }: StatsDisplayProps) {
  const [displayCoins, setDisplayCoins] = useState(coins)
  
  // Update display coins when coins change
  useEffect(() => {
    setDisplayCoins(coins)
  }, [coins])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
      {/* Total Coins */}
      <motion.div
        className="bg-page border border-border rounded-lg p-2 flex flex-col items-center justify-center"
      >
        <p className="text-xs text-text-secondary mb-0.5">Total de Moedas</p>
        <div className="flex items-center gap-1.5">
          <span className="text-lg">💎</span>
          <AnimatePresence mode="wait">
            <motion.p
              key={Math.floor(displayCoins)}
              className="text-lg md:text-xl font-bold text-primary"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {formatNumber(displayCoins)}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Coins Per Second */}
      <motion.div
        className="bg-page border border-border rounded-lg p-2 flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-xs text-text-secondary mb-0.5">Por Segundo</p>
        <div className="flex items-center gap-1.5">
          <span className="text-lg">⚡</span>
          <p className="text-lg md:text-xl font-bold text-success">
            {formatNumber(coinsPerSecond)}/s
          </p>
        </div>
      </motion.div>

      {/* Coins Per Click */}
      <motion.div
        className="bg-page border border-border rounded-lg p-2 flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-xs text-text-secondary mb-0.5">Por Clique</p>
        <div className="flex items-center gap-1.5">
          <span className="text-lg">🖱️</span>
          <p className="text-lg md:text-xl font-bold text-text">
            {formatNumber(coinsPerClick)}
          </p>
        </div>
      </motion.div>

      {/* Total Clicks */}
      <motion.div
        className="bg-page border border-border rounded-lg p-2 flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs text-text-secondary mb-0.5">Total de Cliques</p>
        <div className="flex items-center gap-1.5">
          <span className="text-lg">👆</span>
          <p className="text-lg md:text-xl font-bold text-text">
            {formatNumber(totalClicks)}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

