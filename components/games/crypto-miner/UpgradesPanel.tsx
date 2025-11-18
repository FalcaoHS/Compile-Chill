'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import UpgradeCard from './UpgradeCard'
import {
  MINER_TIERS,
  CLICK_UPGRADES,
  MULTIPLIER_UPGRADES,
  GameState,
  calculateMinerCost,
  canAffordMiner,
  canAffordClickUpgrade,
  canAffordMultiplier,
  getNextClickUpgrade,
  getAvailableMultipliers
} from '@/lib/games/crypto-miner/game-logic'

interface UpgradesPanelProps {
  gameState: GameState
  onPurchaseMiner: (minerId: string) => void
  onPurchaseClickUpgrade: () => void
  onPurchaseMultiplier: (multId: string) => void
}

type Tab = 'miners' | 'clicks' | 'multipliers'

export default function UpgradesPanel({
  gameState,
  onPurchaseMiner,
  onPurchaseClickUpgrade,
  onPurchaseMultiplier
}: UpgradesPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('miners')
  const [isCollapsed, setIsCollapsed] = useState(false)

  const nextClickUpgrade = useMemo(() => getNextClickUpgrade(gameState), [gameState])
  const availableMultipliers = useMemo(() => getAvailableMultipliers(gameState), [gameState])

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'miners', label: '⛏️ Mineradores', count: MINER_TIERS.length },
    { id: 'clicks', label: '⌨️ Poder de Clique', count: CLICK_UPGRADES.length },
    { id: 'multipliers', label: '⚡ Multiplicadores', count: MULTIPLIER_UPGRADES.length }
  ]

  return (
    <div className="w-full h-full flex flex-col">
      {/* Mobile collapse button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="md:hidden w-full bg-page-secondary border border-border rounded-lg p-3 mb-2 flex items-center justify-between text-text hover:bg-page transition-colors"
      >
        <span className="font-bold">Melhorias</span>
        <span className="text-xl">{isCollapsed ? '▼' : '▲'}</span>
      </button>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 flex-shrink-0">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 min-w-[120px] px-4 py-3 rounded-lg font-medium transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-primary text-white shadow-glow-sm'
                      : 'bg-page-secondary border border-border text-text hover:bg-page'
                    }
                  `}
                >
                  <div className="text-sm">{tab.label}</div>
                  <div className="text-xs opacity-75 mt-1">
                    {tab.id === 'clicks' 
                      ? `Nível ${gameState.clickUpgradeLevel}/${tab.count}`
                      : tab.id === 'multipliers'
                      ? `${gameState.multipliers.length}/${tab.count}`
                      : `${Object.keys(gameState.miners).length} tipos`
                    }
                  </div>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 bg-page-secondary border border-border rounded-lg p-4 overflow-y-auto min-h-0">
              <AnimatePresence mode="wait">
                {/* Miners Tab */}
                {activeTab === 'miners' && (
                  <motion.div
                    key="miners"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {MINER_TIERS.map((miner, index) => {
                      const quantityOwned = gameState.miners[miner.id] || 0
                      const cost = calculateMinerCost(miner.id, quantityOwned)
                      const canAfford = canAffordMiner(gameState, miner.id)

                      return (
                        <motion.div
                          key={miner.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <UpgradeCard
                            name={miner.name}
                            description={miner.description}
                            icon={miner.icon}
                            cost={cost}
                            canAfford={canAfford}
                            quantity={quantityOwned}
                            production={miner.baseProduction}
                            onClick={() => onPurchaseMiner(miner.id)}
                          />
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )}

                {/* Click Upgrades Tab */}
                {activeTab === 'clicks' && (
                  <motion.div
                    key="clicks"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {CLICK_UPGRADES.map((upgrade, index) => {
                      const isPurchased = index < gameState.clickUpgradeLevel
                      const isNext = index === gameState.clickUpgradeLevel
                      const canAfford = isNext && canAffordClickUpgrade(gameState)

                      return (
                        <motion.div
                          key={upgrade.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <UpgradeCard
                            name={upgrade.name}
                            description={`${upgrade.description} (+${upgrade.clickPowerBonus} por clique)`}
                            icon={upgrade.icon}
                            cost={upgrade.cost}
                            canAfford={canAfford}
                            quantity={isPurchased ? 1 : undefined}
                            onClick={() => isNext && onPurchaseClickUpgrade()}
                            disabled={!isNext}
                          />
                        </motion.div>
                      )
                    })}
                    
                    {gameState.clickUpgradeLevel >= CLICK_UPGRADES.length && (
                      <div className="text-center py-8 text-text-secondary">
                        <p className="text-lg">🎉 Nível Máximo Alcançado!</p>
                        <p className="text-sm mt-2">Você comprou todos os upgrades de clique.</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Multipliers Tab */}
                {activeTab === 'multipliers' && (
                  <motion.div
                    key="multipliers"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {MULTIPLIER_UPGRADES.map((mult, index) => {
                      const isPurchased = gameState.multipliers.includes(mult.id)
                      const canAfford = canAffordMultiplier(gameState, mult.id)

                      return (
                        <motion.div
                          key={mult.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <UpgradeCard
                            name={mult.name}
                            description={`${mult.description} (${mult.multiplier}x)`}
                            icon={mult.icon}
                            cost={mult.cost}
                            canAfford={canAfford}
                            quantity={isPurchased ? 1 : undefined}
                            onClick={() => onPurchaseMultiplier(mult.id)}
                            disabled={isPurchased}
                          />
                        </motion.div>
                      )
                    })}
                    
                    {gameState.multipliers.length >= MULTIPLIER_UPGRADES.length && (
                      <div className="text-center py-8 text-text-secondary">
                        <p className="text-lg">🎉 Todos os Multiplicadores Comprados!</p>
                        <p className="text-sm mt-2">Sua produção está maximizada.</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

