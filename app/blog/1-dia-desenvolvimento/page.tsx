import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '1 dia de desenvolvimento: do zero ao MVP',
  description: 'Como foi possível criar um MVP completo em menos de 24 horas usando LLMs como copiloto.',
  keywords: ['MVP', 'desenvolvimento rápido', 'LLM', 'produtividade'],
  openGraph: {
    title: '1 dia de desenvolvimento: do zero ao MVP',
    description: 'Como criar um MVP em 24 horas com LLMs.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: '/blog/1-dia-desenvolvimento',
  },
}

export default function UmDiaDesenvolvimentoPage() {
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
            1 dia de desenvolvimento: do zero ao MVP
          </h1>
        </header>

        <div style={{ color: 'var(--color-text)' }}>
          <p className="mb-4">
            Muita gente pergunta como foi possível criar o Compile & Chill em um único dia. A resposta não é simples,
            mas envolve uma combinação de experiência, ferramentas certas e muito café.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">A Preparação</h2>
          <p className="mb-4">
            Antes de começar, já tinha uma visão clara do que queria: um portal de jogos para desenvolvedores, com
            estética hacker e sistema de rankings. O planejamento mental já estava feito há semanas.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">As Ferramentas</h2>
          <p className="mb-4">
            Usei Next.js 14 com App Router, Prisma para o banco, NextAuth para autenticação e TailwindCSS para estilização.
            Todas ferramentas que já conhecia bem, o que acelerou muito o processo.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">O Copiloto</h2>
          <p className="mb-4">
            LLMs como Cursor, GPT-4 e Gemini foram essenciais. Não para escrever código por mim, mas para acelerar
            tarefas repetitivas, sugerir estruturas e ajudar com decisões técnicas.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">O Resultado</h2>
          <p className="mb-4">
            Em cerca de 20 horas, tinha um MVP funcional com 11 jogos, sistema de temas, autenticação e rankings.
            Não é perfeito, mas é funcional e pronto para receber feedback da comunidade.
          </p>

          <p className="mb-4">
            A lição? Com experiência, ferramentas certas e foco, é possível criar muito em pouco tempo.
          </p>
        </div>
      </div>
    </article>
  )
}

