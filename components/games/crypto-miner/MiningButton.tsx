'use client'

import { motion } from 'framer-motion'
import { useState, useCallback } from 'react'
import { formatNumber } from '@/lib/games/crypto-miner/game-logic'

interface MiningButtonProps {
  onClick: () => void
  coinsPerClick: number
  disabled?: boolean
}

export default function MiningButton({ onClick, coinsPerClick, disabled = false }: MiningButtonProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([])
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    
    onClick()
    
    // Create particle effect at click position
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const particleId = Date.now()
    
    setParticles(prev => [...prev, { id: particleId, x, y }])
    setRipples(prev => [...prev, { id: particleId, x, y }])
    
    // Remove particle after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== particleId))
      setRipples(prev => prev.filter(r => r.id !== particleId))
    }, 1000)
  }, [onClick, disabled])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      if (!disabled) {
        onClick()
      }
    }
  }, [onClick, disabled])

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary flex items-center justify-center overflow-hidden transition-all duration-200 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-page"
        aria-label={`Mine cryptocurrency. Earn ${formatNumber(coinsPerClick)} coins per click`}
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 animate-pulse" />
        
        {/* Mining icon */}
        <motion.div
          className="text-7xl md:text-8xl z-10"
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ⛏️
        </motion.div>
        
        {/* Ripple effects */}
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="absolute w-4 h-4 rounded-full border-2 border-primary pointer-events-none"
            style={{
              left: ripple.x - 8,
              top: ripple.y - 8,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 10, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
        
        {/* Click particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute text-2xl font-bold text-primary pointer-events-none"
            style={{
              left: particle.x,
              top: particle.y,
            }}
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -50, opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            +{formatNumber(coinsPerClick)}
          </motion.div>
        ))}
      </motion.button>
      
      {/* Coins per click display */}
      <div className="text-center">
        <p className="text-sm text-text-secondary">Por clique</p>
        <p className="text-2xl font-bold text-primary">{formatNumber(coinsPerClick)} 💎</p>
      </div>
    </div>
  )
}

