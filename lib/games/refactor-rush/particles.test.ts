/**
 * Tests for Refactor Rush particle system
 */

import {
  getParticleConfig,
  getTerminalParticleChar,
  type ParticleConfig,
} from './particles'

describe('Refactor Rush Particle System', () => {
  describe('getParticleConfig', () => {
    it('should return particle config for cyber-hacker theme', () => {
      const config: ParticleConfig = {
        type: 'placement',
        theme: 'cyber-hacker',
        position: { x: 100, y: 100 },
      }
      const particleConfig = getParticleConfig(config)
      expect(particleConfig.color).toBe('#10b981')
      expect(particleConfig.shape).toBe('square')
    })

    it('should return particle config for completion type', () => {
      const config: ParticleConfig = {
        type: 'completion',
        theme: 'neon-future',
        position: { x: 200, y: 200 },
      }
      const particleConfig = getParticleConfig(config)
      expect(particleConfig.shape).toBe('glow')
      expect(particleConfig.duration).toBe(2500)
    })

    it('should use default theme if theme not found', () => {
      const config: ParticleConfig = {
        type: 'placement',
        theme: 'unknown-theme',
        position: { x: 0, y: 0 },
      }
      const particleConfig = getParticleConfig(config)
      expect(particleConfig.color).toBe('#10b981') // cyber-hacker default
    })
  })

  describe('getTerminalParticleChar', () => {
    it('should return a valid ASCII character', () => {
      const char = getTerminalParticleChar()
      expect(['+', '#', ':', '*', '=', '-']).toContain(char)
    })
  })
})

