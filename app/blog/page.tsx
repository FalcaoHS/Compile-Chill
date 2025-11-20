import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog - Compile & Chill',
  description: 'Artigos, devlogs e histórias sobre desenvolvimento, jogos e a comunidade dev.',
  keywords: ['blog', 'devlog', 'artigos', 'desenvolvimento', 'histórias'],
  openGraph: {
    title: 'Blog - Compile & Chill',
    description: 'Artigos, devlogs e histórias sobre desenvolvimento.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: '/blog',
  },
}

const posts = [
  {
    slug: 'meu-comeco',
    title: 'A história do Hudson "Shuk" Falcão: de 1998 ao Compile & Chill',
    excerpt: 'Uma jornada de mais de 20 anos em TI, passando por altos e baixos, até chegar na criação do Compile & Chill.',
    date: '2025-11-18',
    category: 'História',
  },
  {
    slug: 'por-que-open-source',
    title: 'Por que coloquei o Compile & Chill como open-source?',
    excerpt: 'Explicação clara sobre os motivos de tornar o projeto open-source: aprendizado, transparência e acesso.',
    date: new Date().toISOString().split('T')[0],
    category: 'Reflexão',
  },
  {
    slug: 'sistema-fisica-compile-chill',
    title: 'Como nasceu o sistema de física do Compile & Chill',
    excerpt: 'Detalhes técnicos sobre a implementação do motor de física usado nos jogos do portal.',
    date: '2025-11-18',
    category: 'Técnico',
  },
  {
    slug: '1-dia-desenvolvimento',
    title: '1 dia de desenvolvimento: do zero ao MVP',
    excerpt: 'Como foi possível criar um MVP completo em menos de 24 horas usando LLMs como copiloto.',
    date: '2025-11-18',
    category: 'Devlog',
  },
  {
    slug: 'ia-copiloto-criativo',
    title: 'IA como copiloto criativo: bastidores',
    excerpt: 'Reflexões sobre o uso de inteligência artificial no processo criativo e de desenvolvimento.',
    date: '2025-11-18',
    category: 'Reflexão',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
          Blog
        </h1>
        <p className="text-lg mb-8 opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
          Artigos, devlogs e histórias sobre desenvolvimento, jogos e a comunidade dev.
        </p>

        <div className="space-y-6">
          {posts.sort((a, b) => {
            // Fixar "meu-comeco" sempre no topo
            if (a.slug === 'meu-comeco') return -1
            if (b.slug === 'meu-comeco') return 1
            // Ordenar os demais por data (mais recente primeiro)
            return new Date(b.date).getTime() - new Date(a.date).getTime()
          }).map((post) => (
            <article
              key={post.slug}
              className="p-6 rounded-lg transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderLeft: '4px solid var(--color-primary)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-bg)',
                  }}
                >
                  {post.category}
                </span>
                <time className="text-sm opacity-60" style={{ color: 'var(--color-text-secondary)' }}>
                  {new Date(post.date).toLocaleDateString('pt-BR')}
                </time>
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="mb-4 opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-block text-sm font-bold hover:underline"
                style={{ color: 'var(--color-primary)' }}
              >
                Ler mais →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

