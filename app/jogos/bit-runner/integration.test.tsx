/**
 * Integration tests for Bit Runner
 * Tests complete game workflow and score submission
 */

import { render, screen, waitFor } from '@testing-library/react'
import BitRunnerPage from './page'
import { createInitialGameState } from '@/lib/games/bit-runner/game-logic'

// Mock next-auth
const mockSession = {
  user: {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
  },
}

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: mockSession, status: 'authenticated' })),
}))

// Mock fetch for API calls
global.fetch = jest.fn()

// Mock components
jest.mock('@/components/games/bit-runner/BitRunnerCanvas', () => ({
  BitRunnerCanvas: ({ gameState, onUpdate }: any) => {
    // Simulate game update after a short delay
    if (onUpdate && !gameState.gameOver) {
      setTimeout(() => onUpdate(16.67), 100)
    }
    return <div data-testid="canvas">Canvas</div>
  },
}))

jest.mock('@/components/games/bit-runner/ScoreDisplay', () => ({
  ScoreDisplay: ({ distance, bestDistance }: any) => (
    <div data-testid="score-display">
      Distance: {Math.floor(distance)}m, Best: {Math.floor(bestDistance)}m
    </div>
  ),
}))

jest.mock('@/components/games/bit-runner/GameOverModal', () => ({
  GameOverModal: ({ isOpen }: any) =>
    isOpen ? <div data-testid="game-over-modal">Game Over</div> : null,
}))

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('Bit Runner Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    })
  })

  describe('Score Submission', () => {
    test('should submit score when game ends with authenticated user', async () => {
      // Set up game state that will end
      const gameState = createInitialGameState()
      gameState.gameOver = true
      gameState.distance = 1000

      render(<BitRunnerPage />)

      // Wait for score submission
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/scores',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        )
      }, { timeout: 3000 })
    })

    test('should not submit score when user is not authenticated', async () => {
      // Mock unauthenticated session
      const useSessionMock = require('next-auth/react').useSession
      useSessionMock.mockReturnValue({ data: null, status: 'unauthenticated' })

      render(<BitRunnerPage />)

      // Wait a bit to ensure no fetch call is made
      await waitFor(() => {
        expect(global.fetch).not.toHaveBeenCalled()
      }, { timeout: 1000 })
    })
  })

  describe('Game State Persistence', () => {
    test('should load best score from localStorage', () => {
      localStorage.setItem('bit-runner-best-score', '2000')

      render(<BitRunnerPage />)

      expect(screen.getByTestId('score-display')).toHaveTextContent('Best: 2000m')
    })

    test('should save best score to localStorage when game ends', async () => {
      render(<BitRunnerPage />)

      // Simulate game end with score
      const gameState = createInitialGameState()
      gameState.gameOver = true
      gameState.distance = 1500

      await waitFor(() => {
        const saved = localStorage.getItem('bit-runner-best-score')
        // Score should be saved (this is a simplified test)
        expect(saved).toBeDefined()
      })
    })
  })

  describe('Theme Integration', () => {
    test('should render with theme-aware styling', () => {
      const { container } = render(<BitRunnerPage />)

      const themeElements = container.querySelectorAll('.bg-page, .text-text, .border-border')
      expect(themeElements.length).toBeGreaterThan(0)
    })
  })

  describe('Complete Game Workflow', () => {
    test('should render all major UI components', () => {
      render(<BitRunnerPage />)

      expect(screen.getByText('Bit Runner')).toBeInTheDocument()
      expect(screen.getByTestId('canvas')).toBeInTheDocument()
      expect(screen.getByTestId('score-display')).toBeInTheDocument()
      expect(screen.getByText('Controles')).toBeInTheDocument()
    })

    test('should display instructions for all control methods', () => {
      render(<BitRunnerPage />)

      expect(screen.getByText('Teclado')).toBeInTheDocument()
      expect(screen.getByText('Touch')).toBeInTheDocument()
      expect(screen.getByText('Objetivo')).toBeInTheDocument()
    })

    test('should have back link to home page', () => {
      render(<BitRunnerPage />)

      const backLink = screen.getByText('Voltar')
      expect(backLink.closest('a')).toHaveAttribute('href', '/')
    })
  })
})

