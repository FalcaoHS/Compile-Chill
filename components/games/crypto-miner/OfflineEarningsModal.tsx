'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { formatNumber, formatTime } from '@/lib/games/crypto-miner/game-logic'
import { useEffect, useState } from 'react'

interface OfflineEarningsModalProps {
  isOpen: boolean
  coinsEarned: number
  timeAway: number
  onCollect: () => void
}

export default function OfflineEarningsModal({
  isOpen,
  coinsEarned,
  timeAway,
  onCollect
}: OfflineEarningsModalProps) {
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number; rotation: number }[]>([])

  useEffect(() => {
    if (isOpen) {
      // Create confetti particles
      const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360
      }))
      setConfetti(particles)
    }
  }, [isOpen])

  const handleCollect = () => {
    onCollect()
    setConfetti([])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCollect()
    }
    if (e.key === 'Escape') {
      handleCollect()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={handleCollect}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-page border-2 border-primary rounded-2xl p-8 max-w-md w-full shadow-glow relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
              role="dialog"
              aria-labelledby="offline-earnings-title"
              aria-describedby="offline-earnings-description"
            >
              {/* Confetti particles */}
              {confetti.map(particle => (
                <motion.div
                  key={particle.id}
                  className="absolute text-2xl pointer-events-none"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                  }}
                  initial={{ y: 0, opacity: 1, rotate: particle.rotation }}
                  animate={{
                    y: 600,
                    opacity: 0,
                    rotate: particle.rotation + 360
                  }}
                  transition={{
                    duration: 3,
                    delay: Math.random() * 0.5,
                    ease: 'easeIn'
                  }}
                >
                  {['💎', '⚡', '⛏️', '🌟'][Math.floor(Math.random() * 4)]}
                </motion.div>
              ))}

              {/* Content */}
              <div className="text-center relative z-10">
                {/* Icon */}
                <motion.div
                  className="text-8xl mb-4"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  💰
                </motion.div>

                {/* Title */}
                <h2
                  id="offline-earnings-title"
                  className="text-3xl font-bold text-primary mb-2"
                >
                  Bem-vindo de volta!
                </h2>

                {/* Time away */}
                <p
                  id="offline-earnings-description"
                  className="text-text-secondary mb-6"
                >
                  Você esteve fora por <span className="font-bold text-text">{formatTime(timeAway)}</span>
                </p>

                {/* Earnings display */}
                <div className="bg-primary/10 border border-primary rounded-lg p-6 mb-6">
                  <p className="text-sm text-text-secondary mb-2">Moedas Mineradas</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl">💎</span>
                    <motion.p
                      className="text-5xl font-bold text-primary"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.3 }}
                    >
                      {formatNumber(coinsEarned)}
                    </motion.p>
                  </div>
                </div>

                {/* Collect button */}
                <motion.button
                  onClick={handleCollect}
                  className="w-full py-4 bg-primary text-white font-bold text-lg rounded-lg hover:bg-primary/90 transition-colors shadow-glow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-page"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  autoFocus
                >
                  Coletar Moedas! 🎉
                </motion.button>

                <p className="text-xs text-text-secondary mt-4">
                  Pressione Enter ou clique para continuar
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

