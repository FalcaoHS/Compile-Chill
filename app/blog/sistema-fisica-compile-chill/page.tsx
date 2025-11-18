import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Como nasceu o sistema de física do Compile & Chill',
  description: 'Detalhes técnicos sobre a implementação do motor de física usado nos jogos do portal.',
  keywords: ['física', 'game engine', 'desenvolvimento', 'técnico'],
  openGraph: {
    title: 'Como nasceu o sistema de física do Compile & Chill',
    description: 'Detalhes técnicos sobre o motor de física.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: '/blog/sistema-fisica-compile-chill',
  },
}

export default function SistemaFisicaPage() {
  return (
    <article className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto prose prose-invert max-w-none">
        <Link href="/blog" className="inline-block mb-6 text-sm hover:underline" style={{ color: 'var(--color-primary)' }}>
          ← Voltar ao blog
        </Link>

        <header className="mb-8">
          <time className="text-sm opacity-60" style={{ color: 'var(--color-text-secondary)' }}>
            18 de novembro de 2025
          </time>
          <h1 className="text-4xl font-bold mt-2 mb-4" style={{ color: 'var(--color-text)' }}>
            Como nasceu o sistema de física do Compile & Chill
          </h1>
        </header>

        <div style={{ color: 'var(--color-text)' }}>
          <p className="mb-4">
            Quando comecei a desenvolver os jogos do Compile & Chill, uma das primeiras decisões técnicas foi criar um sistema
            de física unificado que pudesse ser reutilizado em múltiplos jogos.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">O Desafio</h2>
          <p className="mb-4">
            Cada jogo tem suas próprias necessidades: Bit Runner precisa de colisão precisa, Stack Overflow Dodge precisa de
            gravidade e movimento fluido, enquanto Hack Grid precisa de detecção de nós conectados.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">A Solução</h2>
          <p className="mb-4">
            Criei um motor de física leve baseado em Canvas 2D, com detecção de colisão otimizada e sistema de partículas
            que se adapta ao tema ativo do usuário.
          </p>

          <p className="mb-4">
            O sistema é modular: cada jogo pode usar apenas o que precisa, mantendo performance mesmo em dispositivos móveis.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Performance</h2>
          <p className="mb-4">
            Implementei um sistema de budget de partículas que monitora FPS e ajusta automaticamente a quantidade de efeitos
            visuais para manter 60fps sempre que possível.
          </p>

          <p className="mb-4">
            O resultado? Jogos fluidos mesmo em dispositivos mais antigos, sem sacrificar a experiência visual.
          </p>
        </div>
      </div>
    </article>
  )
}

