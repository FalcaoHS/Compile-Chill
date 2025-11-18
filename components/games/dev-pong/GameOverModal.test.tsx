/**
 * Tests for GameOverModal component
 * 
 * Note: Requires Jest or Vitest with React Testing Library
 * Run: npm test or npm run test
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { GameOverModal } from './GameOverModal'

describe('GameOverModal Component', () => {
  const mockOnPlayAgain = jest.fn()
  
  beforeEach(() => {
    mockOnPlayAgain.mockClear()
  })
  
  test('should not render when isOpen is false', () => {
    render(
      <GameOverModal
        isOpen={false}
        playerScore={7}
        aiScore={5}
        winner="player"
        onPlayAgain={mockOnPlayAgain}
      />
    )
    
    expect(screen.queryByText('Você Venceu!')).not.toBeInTheDocument()
  })
  
  test('should render win message when player wins', () => {
    render(
      <GameOverModal
        isOpen={true}
        playerScore={7}
        aiScore={5}
        winner="player"
        onPlayAgain={mockOnPlayAgain}
      />
    )
    
    expect(screen.getByText('Você Venceu!')).toBeInTheDocument()
    expect(screen.getByText('🎉 Parabéns!')).toBeInTheDocument()
  })
  
  test('should render loss message when AI wins', () => {
    render(
      <GameOverModal
        isOpen={true}
        playerScore={5}
        aiScore={7}
        winner="ai"
        onPlayAgain={mockOnPlayAgain}
      />
    )
    
    expect(screen.getByText('Você Perdeu')).toBeInTheDocument()
    expect(screen.queryByText('🎉 Parabéns!')).not.toBeInTheDocument()
  })
  
  test('should display final scores', () => {
    render(
      <GameOverModal
        isOpen={true}
        playerScore={7}
        aiScore={3}
        winner="player"
        onPlayAgain={mockOnPlayAgain}
      />
    )
    
    expect(screen.getByText('7 — 3')).toBeInTheDocument()
    expect(screen.getByText('Seus Pontos')).toBeInTheDocument()
  })
  
  test('should call onPlayAgain when button clicked', () => {
    render(
      <GameOverModal
        isOpen={true}
        playerScore={7}
        aiScore={5}
        winner="player"
        onPlayAgain={mockOnPlayAgain}
      />
    )
    
    const playAgainButton = screen.getByText('Jogar Novamente')
    fireEvent.click(playAgainButton)
    
    expect(mockOnPlayAgain).toHaveBeenCalledTimes(1)
  })
  
  test('should have link to home page', () => {
    render(
      <GameOverModal
        isOpen={true}
        playerScore={7}
        aiScore={5}
        winner="player"
        onPlayAgain={mockOnPlayAgain}
      />
    )
    
    const homeLink = screen.getByText('Voltar ao Início')
    expect(homeLink).toHaveAttribute('href', '/')
  })
})

