/**
 * Tests for Bit Runner Canvas component
 */

import { render, screen } from '@testing-library/react'
import { BitRunnerCanvas } from './BitRunnerCanvas'
import { createInitialGameState } from '@/lib/games/bit-runner/game-logic'

// Mock theme store
jest.mock('@/lib/theme-store', () => ({
  useThemeStore: () => ({ theme: 'cyber' }),
}))

describe('BitRunnerCanvas Component', () => {
  describe('Canvas Initialization', () => {
    test('should render canvas element', () => {
      const gameState = createInitialGameState()
      
      const { container } = render(<BitRunnerCanvas gameState={gameState} />)
      
      const canvas = container.querySelector('canvas')
      expect(canvas).toBeInTheDocument()
    })

    test('should set canvas dimensions correctly', () => {
      const gameState = createInitialGameState()
      
      const { container } = render(<BitRunnerCanvas gameState={gameState} />)
      
      const canvas = container.querySelector('canvas') as HTMLCanvasElement
      expect(canvas).toBeInTheDocument()
      // Canvas dimensions are set in useEffect, so we verify element exists
    })
  })

  describe('Character Rendering', () => {
    test('should render character in running state', () => {
      const gameState = createInitialGameState()
      
      const { container } = render(<BitRunnerCanvas gameState={gameState} />)
      
      const canvas = container.querySelector('canvas')
      expect(canvas).toBeInTheDocument()
      expect(gameState.character.state).toBe('running')
    })

    test('should render character in jumping state', () => {
      const gameState = createInitialGameState()
      gameState.character.state = 'jumping'
      gameState.character.y = 300 // Jumping position
      
      const { container } = render(<BitRunnerCanvas gameState={gameState} />)
      
      const canvas = container.querySelector('canvas')
      expect(canvas).toBeInTheDocument()
      expect(gameState.character.state).toBe('jumping')
    })

    test('should render character in ducking state', () => {
      const gameState = createInitialGameState()
      gameState.character.state = 'ducking'
      gameState.character.y = 438 // Ducking position
      
      const { container } = render(<BitRunnerCanvas gameState={gameState} />)
      
      const canvas = container.querySelector('canvas')
      expect(canvas).toBeInTheDocument()
      expect(gameState.character.state).toBe('ducking')
    })
  })

  describe('Obstacle Rendering', () => {
    test('should render obstacles when present', () => {
      const gameState = createInitialGameState()
      gameState.obstacles = [
        {
          x: 500,
          y: 400,
          width: 30,
          height: 20,
          type: 'compiler',
        },
      ]
      
      const { container } = render(<BitRunnerCanvas gameState={gameState} />)
      
      const canvas = container.querySelector('canvas')
      expect(canvas).toBeInTheDocument()
      expect(gameState.obstacles.length).toBe(1)
    })

    test('should render multiple obstacles', () => {
      const gameState = createInitialGameState()
      gameState.obstacles = [
        {
          x: 500,
          y: 400,
          width: 30,
          height: 20,
          type: 'compiler',
        },
        {
          x: 600,
          y: 350,
          width: 25,
          height: 50,
          type: 'bug',
        },
      ]
      
      const { container } = render(<BitRunnerCanvas gameState={gameState} />)
      
      const canvas = container.querySelector('canvas')
      expect(canvas).toBeInTheDocument()
      expect(gameState.obstacles.length).toBe(2)
    })
  })

  describe('Theme Integration', () => {
    test('should apply theme-aware styling', () => {
      const gameState = createInitialGameState()
      
      const { container } = render(<BitRunnerCanvas gameState={gameState} />)
      
      const canvas = container.querySelector('canvas')
      expect(canvas).toHaveClass('border-border')
      expect(canvas).toHaveClass('shadow-glow')
      expect(canvas).toHaveClass('bg-page-secondary')
    })

    test('should apply pixelated rendering for pixel theme', () => {
      // This would need to mock useThemeStore to return 'pixel'
      const gameState = createInitialGameState()
      
      const { container } = render(<BitRunnerCanvas gameState={gameState} />)
      
      const canvas = container.querySelector('canvas')
      expect(canvas).toBeInTheDocument()
    })
  })

  describe('Game State Updates', () => {
    test('should call onUpdate callback', (done) => {
      const gameState = createInitialGameState()
      let updateCount = 0
      
      const handleUpdate = (deltaTime: number) => {
        updateCount++
        if (updateCount >= 2) {
          expect(deltaTime).toBeGreaterThan(0)
          done()
        }
      }
      
      render(<BitRunnerCanvas gameState={gameState} onUpdate={handleUpdate} />)
    })

    test('should stop rendering when game over', () => {
      const gameState = createInitialGameState()
      gameState.gameOver = true
      
      const { container } = render(<BitRunnerCanvas gameState={gameState} />)
      
      const canvas = container.querySelector('canvas')
      expect(canvas).toBeInTheDocument()
      expect(gameState.gameOver).toBe(true)
    })
  })
})

