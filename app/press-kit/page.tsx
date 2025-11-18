import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Press Kit - Compile & Chill',
  description: 'Recursos para imprensa, blogueiros e criadores de conteúdo sobre o Compile & Chill.',
  keywords: ['press kit', 'imprensa', 'mídia', 'recursos'],
  openGraph: {
    title: 'Press Kit - Compile & Chill',
    description: 'Recursos para imprensa e criadores.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: '/press-kit',
  },
}

export default function PressKitPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
          Press Kit
        </h1>
        <p className="text-lg mb-8 opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
          Recursos para imprensa, blogueiros e criadores de conteúdo.
        </p>

        <div style={{ color: 'var(--color-text)' }}>
          <section className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)', borderLeft: '4px solid var(--color-primary)' }}>
            <h2 className="text-2xl font-bold mb-4">Sobre o Projeto</h2>
            <p className="mb-4">
              Compile & Chill é um portal de descompressão criado especialmente para desenvolvedores e entusiastas
              de tecnologia. Oferece 11 jogos customizados com estética hacker/cyber, sistema de rankings e recursos sociais.
            </p>
            <p>
              Lançado em 18 de novembro de 2025, o projeto foi desenvolvido em menos de 24 horas como MVP.
            </p>
          </section>

          <section className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)', borderLeft: '4px solid var(--color-primary)' }}>
            <h2 className="text-2xl font-bold mb-4">Informações de Contato</h2>
            <ul className="space-y-2">
              <li><strong>Criador:</strong> Hudson "Shuk" Falcão</li>
              <li><strong>Email:</strong> falcaoh@gmail.com</li>
              <li><strong>X (Twitter):</strong> <a href="https://x.com/shuktv" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--color-primary)' }}>@shuktv</a></li>
              <li><strong>Instagram:</strong> <a href="https://instagram.com/hudsonfalcao" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--color-primary)' }}>@hudsonfalcao</a></li>
            </ul>
          </section>

          <section className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)', borderLeft: '4px solid var(--color-primary)' }}>
            <h2 className="text-2xl font-bold mb-4">Recursos Visuais</h2>
            <p className="mb-4">
              Logos, screenshots e outros recursos visuais estão disponíveis na página{' '}
              <Link href="/brand" className="underline" style={{ color: 'var(--color-primary)' }}>/brand</Link>.
            </p>
          </section>

          <section className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)', borderLeft: '4px solid var(--color-primary)' }}>
            <h2 className="text-2xl font-bold mb-4">Fatos Rápidos</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Lançado em 18 de novembro de 2025</li>
              <li>11 jogos customizados para desenvolvedores</li>
              <li>5 temas visuais distintos</li>
              <li>Autenticação via X (Twitter) OAuth</li>
              <li>100% gratuito</li>
              <li>Open-source (em breve)</li>
            </ul>
          </section>

          <section className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)', borderLeft: '4px solid var(--color-primary)' }}>
            <h2 className="text-2xl font-bold mb-4">Texto Institucional Curto</h2>
            <p className="mb-4 italic">
              "Compile & Chill é um portal de descompressão feito de dev para devs. Um espaço onde você pode fazer
              pausas rápidas sem sair do 'clima dev', jogando games com estética hacker/cyber, competindo em rankings
              e compartilhando conquistas com a comunidade."
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

