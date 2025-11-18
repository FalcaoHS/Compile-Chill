import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'IA como copiloto criativo: bastidores',
  description: 'Reflexões sobre o uso de inteligência artificial no processo criativo e de desenvolvimento.',
  keywords: ['IA', 'LLM', 'criatividade', 'desenvolvimento', 'reflexão'],
  openGraph: {
    title: 'IA como copiloto criativo: bastidores',
    description: 'Reflexões sobre IA no desenvolvimento.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: '/blog/ia-copiloto-criativo',
  },
}

export default function IACopilotoPage() {
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
            IA como copiloto criativo: bastidores
          </h1>
        </header>

        <div style={{ color: 'var(--color-text)' }}>
          <p className="mb-4">
            Muita gente tem medo de que IAs vão substituir desenvolvedores. Eu vejo diferente: IAs são ferramentas
            incríveis que amplificam nossa capacidade criativa.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">O Que IAs Fazem Bem</h2>
          <p className="mb-4">
            IAs são excelentes para tarefas repetitivas, geração de boilerplate, sugestões de código e debugging.
            Elas aceleram o processo, mas não substituem a criatividade e experiência humana.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">O Que IAs Não Fazem</h2>
          <p className="mb-4">
            IAs não entendem contexto de negócio, não têm intuição sobre UX, não sentem empatia pelo usuário final.
            Essas são habilidades humanas que continuam sendo essenciais.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Minha Experiência</h2>
          <p className="mb-4">
            Usei IAs extensivamente no Compile & Chill, mas sempre como copiloto. Eu definia a direção, a arquitetura,
            as decisões de design. A IA ajudava a implementar mais rápido.
          </p>

          <p className="mb-4">
            O resultado? Um projeto que reflete minha visão e experiência, mas que foi construído muito mais rápido
            do que seria possível sozinho.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">O Futuro</h2>
          <p className="mb-4">
            Acredito que desenvolvedores que aprenderem a trabalhar com IAs vão ser muito mais produtivos. Não é sobre
            ser substituído, é sobre evoluir e usar as melhores ferramentas disponíveis.
          </p>
        </div>
      </div>
    </article>
  )
}

