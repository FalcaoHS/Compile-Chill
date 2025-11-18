import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contato - Compile & Chill',
  description: 'Entre em contato com o Compile & Chill. Dúvidas, sugestões ou feedback.',
  keywords: ['contato', 'suporte', 'feedback', 'sugestões'],
  openGraph: {
    title: 'Contato - Compile & Chill',
    description: 'Entre em contato conosco.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: '/contato',
  },
}

export default function ContatoPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
          Contato
        </h1>
        <p className="text-lg mb-8 opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
          Entre em contato para dúvidas, sugestões, reportar bugs ou apenas conversar.
        </p>

        <div className="space-y-6" style={{ color: 'var(--color-text)' }}>
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)', borderLeft: '4px solid var(--color-primary)' }}>
            <h2 className="text-2xl font-bold mb-4">Redes Sociais</h2>
            <div className="space-y-3">
              <div>
                <strong>X (Twitter):</strong>{' '}
                <a href="https://x.com/shuktv" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
                  @shuktv
                </a>
              </div>
              <div>
                <strong>Instagram:</strong>{' '}
                <a href="https://instagram.com/hudsonfalcao" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
                  @hudsonfalcao
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)', borderLeft: '4px solid var(--color-primary)' }}>
            <h2 className="text-2xl font-bold mb-4">Email</h2>
            <p className="mb-2">
              Para questões formais, suporte ou parcerias:
            </p>
            <a href="mailto:falcaoh@gmail.com" className="underline hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
              falcaoh@gmail.com
            </a>
          </div>

          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)', borderLeft: '4px solid var(--color-primary)' }}>
            <h2 className="text-2xl font-bold mb-4">Sobre o Criador</h2>
            <p className="mb-2">
              <strong>Hudson "Shuk" Falcão</strong>
            </p>
            <p className="mb-2 opacity-80">
              Analista de Sistemas Sênior | Criador do Compile & Chill
            </p>
            <p className="text-sm opacity-60">
              Mais de 20 anos de experiência em TI, especialista em segurança e usabilidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

