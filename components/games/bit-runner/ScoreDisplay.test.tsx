/**
 * Tests for Bit Runner Score Display component
 */

import { render, screen } from '@testing-library/react'
import { ScoreDisplay } from './ScoreDisplay'

describe('ScoreDisplay Component', () => {
  test('should display current distance', () => {
    render(<ScoreDisplay distance={1234} bestDistance={0} />)

    expect(screen.getByText('Distance')).toBeInTheDocument()
    expect(screen.getByText('1234m')).toBeInTheDocument()
  })

  test('should display best distance when greater than zero', () => {
    render(<ScoreDisplay distance={500} bestDistance={1000} />)

    expect(screen.getByText('Best')).toBeInTheDocument()
    expect(screen.getByText('1000m')).toBeInTheDocument()
  })

  test('should not display best distance when zero', () => {
    render(<ScoreDisplay distance={500} bestDistance={0} />)

    expect(screen.queryByText('Best')).not.toBeInTheDocument()
  })

  test('should floor decimal distances', () => {
    render(<ScoreDisplay distance={1234.56} bestDistance={5678.90} />)

    expect(screen.getByText('1234m')).toBeInTheDocument()
    expect(screen.getByText('5678m')).toBeInTheDocument()
  })

  test('should have responsive styling', () => {
    const { container } = render(<ScoreDisplay distance={1000} bestDistance={2000} />)

    const scoreBoxes = container.querySelectorAll('.rounded-lg')
    expect(scoreBoxes.length).toBeGreaterThanOrEqual(2)
  })
})

