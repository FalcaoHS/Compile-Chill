import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllGames } from '@/lib/games'

export const metadata: Metadata = {
  title: 'Jogos - Compile & Chill',
  description: 'Lista completa de todos os jogos disponíveis no Compile & Chill. Jogos temáticos para desenvolvedores.',
  keywords: ['jogos', 'games', 'desenvolvedores', 'dev games', 'hacker games'],
  openGraph: {
    title: 'Jogos - Compile & Chill',
    description: 'Lista completa de jogos para desenvolvedores.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: '/jogos',
  },
}

export default function JogosPage() {
  const games = getAllGames()

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            Jogos
          </h1>
          <p className="text-lg opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
            Escolha um jogo e comece a descomprimir. Todos os jogos são temáticos para desenvolvedores.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link
              key={game.id}
              href={game.route}
              className="block p-6 rounded-lg transition-all hover:scale-[1.02] hover:shadow-lg"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderLeft: '4px solid var(--color-primary)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{game.icon}</span>
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                  {game.name}
                </h2>
              </div>
              <p className="mb-4 opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
                {game.description}
              </p>
              {game.category && (
                <span
                  className="inline-block text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-bg)',
                  }}
                >
                  {game.category}
                </span>
              )}
              <div className="mt-4 text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                Jogar agora →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

