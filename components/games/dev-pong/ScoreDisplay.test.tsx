/**
 * Tests for ScoreDisplay component
 * 
 * Note: Requires Jest or Vitest with React Testing Library
 * Run: npm test or npm run test
 */

import { render, screen } from '@testing-library/react'
import { ScoreDisplay } from './ScoreDisplay'

describe('ScoreDisplay Component', () => {
  test('should render player and AI scores', () => {
    render(<ScoreDisplay playerScore={3} aiScore={2} />)
    
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })
  
  test('should render player label', () => {
    render(<ScoreDisplay playerScore={0} aiScore={0} />)
    
    expect(screen.getByText('Você')).toBeInTheDocument()
  })
  
  test('should render AI label', () => {
    render(<ScoreDisplay playerScore={0} aiScore={0} />)
    
    expect(screen.getByText('IA')).toBeInTheDocument()
  })
  
  test('should display scores from 0 to 7', () => {
    const { rerender } = render(<ScoreDisplay playerScore={0} aiScore={7} />)
    
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    
    // Test mid-game score
    rerender(<ScoreDisplay playerScore={4} aiScore={3} />)
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })
  
  test('should have proper theme classes', () => {
    const { container } = render(<ScoreDisplay playerScore={5} aiScore={4} />)
    
    const scoreCards = container.querySelectorAll('.bg-page-secondary')
    expect(scoreCards.length).toBe(2) // Player and AI score cards
  })
})

