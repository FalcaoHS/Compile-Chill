'use client'

import { useState } from 'react'

interface Test99BasketsButtonProps {
  onTrigger?: () => void
}

export function Test99BasketsButton({ onTrigger }: Test99BasketsButtonProps) {
  const [isTesting, setIsTesting] = useState(false)

  const handleTest = () => {
    setIsTesting(true)
    
    // Remove o flag de já visto para permitir testar novamente
    if (typeof window !== 'undefined') {
      localStorage.removeItem('compilechill_egg_99_v1')
    }

    // Dispara o easter egg diretamente
    if (onTrigger) {
      onTrigger()
    } else {
      // Fallback: tenta disparar via evento customizado
      const event = new CustomEvent('trigger99Baskets')
      window.dispatchEvent(event)
    }

    setTimeout(() => setIsTesting(false), 1000)
  }

  return (
    <button
      onClick={handleTest}
      disabled={isTesting}
      className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105 disabled:opacity-50"
      style={{
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-bg)',
        border: '2px solid var(--color-primary)',
      }}
      title="Testar Easter Egg 99 Cestas"
    >
      {isTesting ? 'Testando...' : '🎯 Testar 99 Cestas'}
    </button>
  )
}

