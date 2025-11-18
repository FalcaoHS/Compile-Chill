/**
 * Tests for Bit Runner Game Over Modal component
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { GameOverModal } from './GameOverModal'

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('GameOverModal Component', () => {
  test('should not render when closed', () => {
    render(
      <GameOverModal
        isOpen={false}
        distance={1000}
        bestDistance={2000}
        onPlayAgain={() => {}}
      />
    )

    expect(screen.queryByText('Game Over')).not.toBeInTheDocument()
  })

  test('should render when open', () => {
    render(
      <GameOverModal
        isOpen={true}
        distance={1000}
        bestDistance={2000}
        onPlayAgain={() => {}}
      />
    )

    expect(screen.getByText('Game Over')).toBeInTheDocument()
  })

  test('should display final distance', () => {
    render(
      <GameOverModal
        isOpen={true}
        distance={1234}
        bestDistance={2000}
        onPlayAgain={() => {}}
      />
    )

    expect(screen.getByText('Distância Final')).toBeInTheDocument()
    expect(screen.getByText('1234m')).toBeInTheDocument()
  })

  test('should display best distance', () => {
    render(
      <GameOverModal
        isOpen={true}
        distance={1000}
        bestDistance={2000}
        onPlayAgain={() => {}}
      />
    )

    expect(screen.getByText('Melhor Distância')).toBeInTheDocument()
    expect(screen.getByText('2000m')).toBeInTheDocument()
  })

  test('should show new record message when distance equals best', () => {
    render(
      <GameOverModal
        isOpen={true}
        distance={2000}
        bestDistance={2000}
        onPlayAgain={() => {}}
      />
    )

    expect(screen.getByText('🎉 Novo recorde!')).toBeInTheDocument()
  })

  test('should call onPlayAgain when button clicked', () => {
    const onPlayAgain = jest.fn()

    render(
      <GameOverModal
        isOpen={true}
        distance={1000}
        bestDistance={2000}
        onPlayAgain={onPlayAgain}
      />
    )

    const playAgainButton = screen.getByText('Jogar Novamente')
    fireEvent.click(playAgainButton)

    expect(onPlayAgain).toHaveBeenCalledTimes(1)
  })

  test('should have back to home link', () => {
    render(
      <GameOverModal
        isOpen={true}
        distance={1000}
        bestDistance={2000}
        onPlayAgain={() => {}}
      />
    )

    const backLink = screen.getByText('Voltar ao Início')
    expect(backLink).toBeInTheDocument()
    expect(backLink.closest('a')).toHaveAttribute('href', '/')
  })
})

