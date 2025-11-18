"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { getParticleConfig } from "@/lib/games/dev-fifteen-hex/theme-styles"
import type { ThemeId } from "@/lib/themes"

interface ParticleEffectProps {
  x: number
  y: number
  config: ReturnType<typeof getParticleConfig>
  onComplete: () => void
}

export function ParticleEffect({ x, y, config, onComplete }: ParticleEffectProps) {
  const [particles, setParticles] = useState<Array<{ id: number; angle: number; distance: number }>>([])
  
  useEffect(() => {
    const newParticles = Array.from({ length: config.count }, (_, i) => ({
      id: i,
      angle: (Math.PI * 2 * i) / config.count + Math.random() * 0.5,
      distance: 30 + Math.random() * 40,
    }))
    setParticles(newParticles)
    
    const timer = setTimeout(() => {
      onComplete()
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [config.count, onComplete])
  
  const renderParticle = (particle: typeof particles[0]) => {
    const finalX = Math.cos(particle.angle) * particle.distance
    const finalY = Math.sin(particle.angle) * particle.distance
    
    switch (config.shape) {
      case 'bit':
        return (
          <div
            style={{
              width: `${config.size}px`,
              height: `${config.size}px`,
              backgroundColor: config.color,
              borderRadius: '50%',
            }}
          />
        )
      case 'line':
        return (
          <div
            style={{
              width: `${config.size * 10}px`,
              height: `${config.size}px`,
              backgroundColor: config.color,
              borderRadius: '2px',
            }}
          />
        )
      case 'glow':
        return (
          <div
            style={{
              width: `${config.size}px`,
              height: `${config.size}px`,
              backgroundColor: config.color,
              borderRadius: '50%',
              boxShadow: `0 0 ${config.size * 2}px ${config.color}`,
            }}
          />
        )
      case 'char':
        return (
          <span
            className="font-mono"
            style={{
              fontSize: `${config.size}px`,
              color: config.color,
            }}
          >
            {String.fromCharCode(0x2588)}
          </span>
        )
      case 'square':
        return (
          <div
            style={{
              width: `${config.size}px`,
              height: `${config.size}px`,
              backgroundColor: config.color,
            }}
          />
        )
      default:
        return null
    }
  }
  
  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {particles.map(particle => {
        const finalX = Math.cos(particle.angle) * particle.distance
        const finalY = Math.sin(particle.angle) * particle.distance
        
        return (
          <motion.div
            key={particle.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: finalX,
              y: finalY,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            style={{
              position: 'absolute',
            }}
          >
            {renderParticle(particle)}
          </motion.div>
        )
      })}
    </div>
  )
}

