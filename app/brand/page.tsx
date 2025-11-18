import type { Metadata } from 'next'
import { THEMES } from '@/lib/themes'

export const metadata: Metadata = {
  title: 'Brand & Identidade Visual - Compile & Chill',
  description: 'Diretrizes de marca e identidade visual do Compile & Chill. Cores, tipografia e uso da marca.',
  keywords: ['brand', 'identidade visual', 'marca', 'design', 'guidelines'],
  openGraph: {
    title: 'Brand & Identidade Visual - Compile & Chill',
    description: 'Diretrizes de marca e identidade visual.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: '/brand',
  },
}

export default function BrandPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
          Brand & Identidade Visual
        </h1>
        <p className="text-lg mb-8 opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
          Diretrizes de marca e identidade visual do Compile & Chill.
        </p>

        <div style={{ color: 'var(--color-text)' }}>
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Cores</h2>
            <p className="mb-4">
              O Compile & Chill possui 5 temas visuais distintos, cada um com sua própria paleta de cores:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {Object.entries(THEMES).map(([id, themeData]) => (
                <div key={id} className="p-4 rounded-lg" style={{ backgroundColor: themeData.vars['--color-bg-secondary'] }}>
                  <div className="h-16 rounded mb-2" style={{ backgroundColor: themeData.vars['--color-primary'] }}></div>
                  <p className="text-sm font-bold mb-1">{themeData.name}</p>
                  <p className="text-xs opacity-80 mb-2">Primária: {themeData.vars['--color-primary']}</p>
                  <p className="text-xs opacity-60">Fundo: {themeData.vars['--color-bg']}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)', borderLeft: '4px solid var(--color-primary)' }}>
            <h2 className="text-2xl font-bold mb-4">Tipografia</h2>
            <p className="mb-4">Cada tema possui sua própria tipografia:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Cyber Hacker:</strong> Roboto Mono</li>
              <li><strong>Pixel Lab:</strong> Press Start 2P</li>
              <li><strong>Neon Future:</strong> Orbitron</li>
              <li><strong>Terminal Minimal:</strong> JetBrains Mono</li>
              <li><strong>Blueprint Dev:</strong> Inter</li>
            </ul>
          </section>

          <section className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)', borderLeft: '4px solid var(--color-primary)' }}>
            <h2 className="text-2xl font-bold mb-4">Logo</h2>
            <p className="mb-4">
              O logo do Compile & Chill é texto simples: <strong>"Compile & Chill"</strong> com estilização baseada no tema ativo.
            </p>
            <p className="mb-4">
              Não existe um logo fixo — a identidade visual se adapta ao tema escolhido pelo usuário.
            </p>
          </section>

          <section className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)', borderLeft: '4px solid var(--color-primary)' }}>
            <h2 className="text-2xl font-bold mb-4">Uso da Marca</h2>
            <p className="mb-4">
              Ao usar a marca Compile & Chill, mantenha a integridade visual. Não distorça, modifique ou altere
              as cores principais sem autorização.
            </p>
            <p className="mb-4">
              Para uso comercial ou em projetos, entre em contato via email (falcaoh@gmail.com) ou redes sociais.
            </p>
          </section>

          <section className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)', borderLeft: '4px solid var(--color-primary)' }}>
            <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
            <p className="mb-4">
              Screenshots dos jogos e interface podem ser usados livremente para fins de divulgação, desde que
              mantenham o contexto original e não sejam modificados de forma a distorcer a experiência.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

