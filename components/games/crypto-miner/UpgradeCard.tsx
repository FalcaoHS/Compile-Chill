'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'
import { formatNumber } from '@/lib/games/crypto-miner/game-logic'

interface UpgradeCardProps {
  name: string
  description: string
  icon: string
  cost: number
  canAfford: boolean
  quantity?: number
  production?: number // coins per second (for miners)
  onClick: () => void
  disabled?: boolean
}

const UpgradeCard = memo(function UpgradeCard({
  name,
  description,
  icon,
  cost,
  canAfford,
  quantity,
  production,
  onClick,
  disabled = false
}: UpgradeCardProps) {
  const isPurchased = quantity !== undefined && quantity > 0
  const isDisabled = disabled || !canAfford

  return (
    <motion.button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        w-full p-4 rounded-lg border-2 text-left transition-all duration-200
        ${canAfford 
          ? 'bg-page border-primary hover:bg-page-secondary hover:shadow-glow-sm' 
          : 'bg-page-secondary border-border opacity-60 cursor-not-allowed'
        }
        ${isPurchased ? 'ring-1 ring-primary/30' : ''}
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-page
        disabled:cursor-not-allowed
      `}
      whileHover={canAfford && !disabled ? { scale: 1.02 } : {}}
      whileTap={canAfford && !disabled ? { scale: 0.98 } : {}}
      aria-label={`${name}. ${description}. Cost: ${formatNumber(cost)} coins. ${quantity !== undefined ? `Owned: ${quantity}` : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="text-4xl flex-shrink-0">
          {icon}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-text text-lg leading-tight">
              {name}
            </h3>
            {quantity !== undefined && quantity > 0 && (
              <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-0.5 rounded flex-shrink-0">
                x{quantity}
              </span>
            )}
          </div>
          
          <p className="text-sm text-text-secondary mb-2 line-clamp-2">
            {description}
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3">
              {/* Cost */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-text-secondary">Custo:</span>
                <span className={`text-sm font-bold ${canAfford ? 'text-success' : 'text-error'}`}>
                  💎 {formatNumber(cost)}
                </span>
              </div>
              
              {/* Production (for miners) */}
              {production !== undefined && production > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-text-secondary">Produção:</span>
                  <span className="text-sm font-bold text-primary">
                    ⚡ {formatNumber(production)}/s
                  </span>
                </div>
              )}
            </div>
            
            {/* Purchase indicator */}
            {canAfford && !disabled && (
              <span className="text-xs text-primary font-medium">
                Clique para comprar →
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  )
})

export default UpgradeCard

