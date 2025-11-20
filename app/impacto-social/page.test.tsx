/**
 * Integration tests for Impact Social page
 * 
 * Tests verify page renders correctly, theme integration works,
 * and all sections are displayed properly.
 */

import { render, screen } from '@testing-library/react'
import ImpactoSocialPage from './page'

// Mock theme store
jest.mock('@/lib/theme-store', () => ({
  useThemeStore: () => ({ theme: 'cyber' }),
}))

// Mock themes
jest.mock('@/lib/themes', () => ({
  THEMES: {
    cyber: {
      vars: {
        '--color-text': '#ffffff',
        '--color-text-secondary': '#cccccc',
        '--color-bg': '#000000',
        '--color-bg-secondary': '#1a1a1a',
        '--color-primary': '#00ff00',
      },
    },
  },
}))

describe('Impact Social Page Tests', () => {
  describe('Page Rendering', () => {
    test('should render page with main heading', () => {
      render(<ImpactoSocialPage />)
      
      expect(screen.getByText(/🌍 Impacto Social \/ Regiões de Interesse/i)).toBeInTheDocument()
    })

    test('should render page description', () => {
      render(<ImpactoSocialPage />)
      
      expect(screen.getByText(/Nosso projeto busca apoiar comunidades/i)).toBeInTheDocument()
    })
  })

  describe('Target Countries Section', () => {
    test('should display all three target countries', () => {
      render(<ImpactoSocialPage />)
      
      expect(screen.getByText(/🇪🇹 Etiópia/i)).toBeInTheDocument()
      expect(screen.getByText(/🇺🇬 Uganda/i)).toBeInTheDocument()
      expect(screen.getByText(/🇹🇿 Tanzânia/i)).toBeInTheDocument()
    })

    test('should display country information', () => {
      render(<ImpactoSocialPage />)
      
      expect(screen.getByText(/Acesso digital baixo/i)).toBeInTheDocument()
      expect(screen.getByText(/Barreiras de infraestrutura/i)).toBeInTheDocument()
      expect(screen.getByText(/Comunidades rurais/i)).toBeInTheDocument()
    })
  })

  describe('Partnership Section', () => {
    test('should display partnership information', () => {
      render(<ImpactoSocialPage />)
      
      expect(screen.getByText(/Parcerias e ONGs/i)).toBeInTheDocument()
      expect(screen.getByText(/Como Contribuir/i)).toBeInTheDocument()
    })

    test('should display contact email', () => {
      render(<ImpactoSocialPage />)
      
      const emailLink = screen.getByText('falcaoh@gmail.com')
      expect(emailLink).toBeInTheDocument()
      expect(emailLink.closest('a')).toHaveAttribute('href', 'mailto:falcaoh@gmail.com')
    })
  })

  describe('Multilingual Roadmap Section', () => {
    test('should display all three phases', () => {
      render(<ImpactoSocialPage />)
      
      expect(screen.getByText(/Fase 1: Inglês/i)).toBeInTheDocument()
      expect(screen.getByText(/Fase 2: Suaíli/i)).toBeInTheDocument()
      expect(screen.getByText(/Fase 3: Amárico/i)).toBeInTheDocument()
    })
  })

  describe('Theme Integration', () => {
    test('should apply theme-aware styling', () => {
      const { container } = render(<ImpactoSocialPage />)
      
      // Check that page structure exists
      const mainContent = container.querySelector('.max-w-6xl')
      expect(mainContent).toBeInTheDocument()
    })
  })

  describe('Contributor Guidelines', () => {
    test('should display contributor guidelines', () => {
      render(<ImpactoSocialPage />)
      
      expect(screen.getByText(/Diretrizes para Contribuidores/i)).toBeInTheDocument()
    })

    test('should have GitHub contribution link', () => {
      render(<ImpactoSocialPage />)
      
      const githubLink = screen.getByText(/Contribuir no GitHub/i)
      expect(githubLink).toBeInTheDocument()
      expect(githubLink.closest('a')).toHaveAttribute('href', 'https://github.com/shuktv/CompileandChill')
      expect(githubLink.closest('a')).toHaveAttribute('target', '_blank')
    })
  })
})

