'use client'

import { useEffect, useState } from 'react'

interface DevMaster99EggProps {
  onClose: () => void
}

export function DevMaster99Egg({ onClose }: DevMaster99EggProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Anima entrada
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const handleShare = () => {
    const tweetText = encodeURIComponent("Acabei de fazer 99 cestas no Compile & Chill! 🎯 @shuktv")
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank')
  }

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="egg-title"
    >
      <div
        className={`relative p-8 rounded-lg max-w-md w-full mx-4 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
        }`}
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          border: '2px solid var(--color-primary)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}
      >
        <h1
          id="egg-title"
          className="text-3xl font-bold mb-4 text-center"
          style={{ color: 'var(--color-primary)' }}
        >
          🎉 PARABÉNS, DEV! 🎉
        </h1>
        
        <p className="text-center mb-4" style={{ color: 'var(--color-text)' }}>
          Você atingiu <strong>99 cestas</strong>! Se chegou até aqui é porque está curtindo o site…
        </p>
        
        <p className="text-center mb-6 text-sm opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
          Compartilhe com outros devs e me segue no X:{' '}
          <a
            href="https://x.com/shuktv"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80"
            style={{ color: 'var(--color-primary)' }}
          >
            @shuktv
          </a>
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleShare}
            className="px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-bg)',
            }}
          >
            Compartilhar no X
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--color-text)',
              border: '2px solid var(--color-text-secondary)',
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

