"use client"

import { motion, AnimatePresence } from "framer-motion"
import { getParticleConfig, getParticleVariants, getTerminalParticleChar, type ParticleConfig } from "@/lib/games/refactor-rush/particles"

interface ParticleEffectProps {
  config: ParticleConfig | null
  onComplete?: () => void
}

export function ParticleEffect({ config, onComplete }: ParticleEffectProps) {
  if (!config) return null

  const particleConfig = getParticleConfig(config)
  const variants = getParticleVariants(config)

  const renderParticle = () => {
    const { shape, color, size, type } = particleConfig

    if (shape === 'char' && config.theme === 'terminal-minimal') {
      return (
        <span
          className="font-mono text-text"
          style={{
            fontSize: `${size}px`,
            color,
          }}
        >
          {getTerminalParticleChar()}
        </span>
      )
    }

    if (shape === 'line') {
      return (
        <div
          style={{
            width: `${size * 10}px`,
            height: `${size}px`,
            backgroundColor: color,
            borderRadius: '2px',
          }}
        />
      )
    }

    if (shape === 'glow') {
      return (
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            borderRadius: '50%',
            boxShadow: `0 0 ${size * 2}px ${color}`,
          }}
        />
      )
    }

    // Default: square
    return (
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
        }}
      />
    )
  }

  const particleCount = config.type === 'completion' ? 20 : 5
  const duration = config.type === 'completion' ? 2 : 1

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {Array.from({ length: particleCount }).map((_, index) => (
        <motion.div
          key={index}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration,
            delay: index * 0.05,
            ease: "easeOut",
          }}
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          {renderParticle()}
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

