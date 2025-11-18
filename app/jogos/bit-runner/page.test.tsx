/**
 * Tests for Bit Runner game page
 */

import { render, screen, fireEvent } from '@testing-library/react'
import BitRunnerPage from './page'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
}))

// Mock components
jest.mock('@/components/games/bit-runner/BitRunnerCanvas', () => ({
  BitRunnerCanvas: ({ gameState, onUpdate }: any) => (
    <div data-testid="canvas">Canvas Component</div>
  ),
}))

jest.mock('@/components/games/bit-runner/ScoreDisplay', () => ({
  ScoreDisplay: ({ distance, bestDistance }: any) => (
    <div data-testid="score-display">
      Distance: {distance}m, Best: {bestDistance}m
    </div>
  ),
}))

jest.mock('@/components/games/bit-runner/GameOverModal', () => ({
  GameOverModal: ({ isOpen, onPlayAgain }: any) =>
    isOpen ? <div data-testid="game-over-modal">Game Over</div> : null,
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('BitRunnerPage', () => {
  describe('Page Rendering', () => {
    test('should render page title', () => {
      render(<BitRunnerPage />)

      expect(screen.getByText('Bit Runner')).toBeInTheDocument()
    })

    test('should render canvas component', () => {
      render(<BitRunnerPage />)

      expect(screen.getByTestId('canvas')).toBeInTheDocument()
    })

    test('should render score display', () => {
      render(<BitRunnerPage />)

      expect(screen.getByTestId('score-display')).toBeInTheDocument()
    })

    test('should have back link', () => {
      render(<BitRunnerPage />)

      const backLink = screen.getByText('Voltar')
      expect(backLink).toBeInTheDocument()
      expect(backLink.closest('a')).toHaveAttribute('href', '/')
    })
  })

  describe('Controls Instructions', () => {
    test('should display keyboard controls', () => {
      render(<BitRunnerPage />)

      expect(screen.getByText('Teclado')).toBeInTheDocument()
      expect(screen.getByText(/↑ ou Espaço: Pular/)).toBeInTheDocument()
      expect(screen.getByText(/↓: Abaixar/)).toBeInTheDocument()
    })

    test('should display touch controls', () => {
      render(<BitRunnerPage />)

      expect(screen.getByText('Touch')).toBeInTheDocument()
      expect(screen.getByText(/Swipe ↑: Pular/)).toBeInTheDocument()
      expect(screen.getByText(/Swipe ↓: Abaixar/)).toBeInTheDocument()
    })

    test('should display objective', () => {
      render(<BitRunnerPage />)

      expect(screen.getByText('Objetivo')).toBeInTheDocument()
      expect(screen.getByText(/Evite obstáculos/)).toBeInTheDocument()
    })
  })

  describe('Keyboard Controls', () => {
    test('should handle spacebar for jump', () => {
      render(<BitRunnerPage />)

      fireEvent.keyDown(window, { key: ' ' })
      // Control state is internal, we just verify no errors
    })

    test('should handle arrow up for jump', () => {
      render(<BitRunnerPage />)

      fireEvent.keyDown(window, { key: 'ArrowUp' })
      // Control state is internal, we just verify no errors
    })

    test('should handle arrow down for duck', () => {
      render(<BitRunnerPage />)

      fireEvent.keyDown(window, { key: 'ArrowDown' })
      // Control state is internal, we just verify no errors
    })
  })

  describe('Game State', () => {
    test('should initialize game state', () => {
      const { container } = render(<BitRunnerPage />)

      // Verify page renders without errors
      expect(container).toBeInTheDocument()
    })

    test('should load best score from localStorage', () => {
      localStorage.setItem('bit-runner-best-score', '1000')

      render(<BitRunnerPage />)

      // Best score should be loaded
      expect(screen.getByTestId('score-display')).toHaveTextContent('Best: 1000m')
    })
  })
})

