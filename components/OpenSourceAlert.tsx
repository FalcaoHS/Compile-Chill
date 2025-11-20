'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useThemeStore } from '@/lib/theme-store'
import { THEMES } from '@/lib/themes'

const STORAGE_KEY = 'compilechill_opensource_alert_dismissed'

export function OpenSourceAlert() {
  const { theme: themeId } = useThemeStore()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissing, setIsDismissing] = useState(false)
  const currentTheme = THEMES[themeId]?.vars || THEMES.cyber.vars

  useEffect(() => {
    // Check if user has dismissed the alert
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem(STORAGE_KEY)
      if (!dismissed) {
        // Show after a small delay for better UX
        setTimeout(() => setIsVisible(true), 500)
      }
    }
  }, [])

  const handleDismiss = () => {
    setIsDismissing(true)
    setTimeout(() => {
      setIsVisible(false)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, 'true')
      }
    }, 300)
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full mx-4 transition-all duration-300 ${
        isDismissing ? 'opacity-0 translate-y-[-20px]' : 'opacity-100 translate-y-0'
      }`}
      style={{ pointerEvents: 'auto' }}
    >
      <div
        className="p-6 rounded-lg border-2 shadow-2xl backdrop-blur-sm"
        style={{
          backgroundColor: currentTheme['--color-bg-secondary'] + 'F0',
          borderColor: currentTheme['--color-primary'],
          boxShadow: `0 8px 32px ${currentTheme['--color-primary']}40, 0 0 20px ${currentTheme['--color-primary']}20`,
        }}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-3xl">🔓</div>
          
          <div className="flex-1">
            <h3
              className="text-xl font-bold mb-2"
              style={{ color: currentTheme['--color-primary'] }}
            >
              O código está aberto. Quer ver como funciona?
            </h3>
            <p
              className="text-sm mb-4 leading-relaxed"
              style={{ color: currentTheme['--color-text'] }}
            >
              Agora você pode explorar todo o código do Compile & Chill. Veja como os jogos foram feitos, 
              como o sistema de temas funciona, como a validação de scores é implementada. 
              Tudo transparente, tudo acessível.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog/por-que-open-source"
                className="px-4 py-2 rounded font-medium text-sm transition-all hover:scale-105"
                style={{
                  backgroundColor: currentTheme['--color-primary'],
                  color: currentTheme['--color-bg'],
                  boxShadow: `0 4px 12px ${currentTheme['--color-primary']}60`,
                }}
              >
                Ler o post completo →
              </Link>
              
              <a
                href="https://github.com/FalcaoHS/Compile-Chill"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded font-medium text-sm transition-all hover:scale-105 border-2"
                style={{
                  borderColor: currentTheme['--color-primary'],
                  color: currentTheme['--color-primary'],
                  backgroundColor: 'transparent',
                }}
              >
                Ver no GitHub
              </a>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded hover:opacity-70 transition-opacity"
            style={{ color: currentTheme['--color-text-secondary'] }}
            aria-label="Fechar alerta"
            title="Não mostrar de novo"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 5L5 15M5 5l10 10" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

