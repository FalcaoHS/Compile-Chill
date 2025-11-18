import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso - Compile & Chill',
  description: 'Termos de uso do Compile & Chill. Regras e responsabilidades ao usar o serviço.',
  keywords: ['termos', 'uso', 'regras', 'responsabilidade'],
  openGraph: {
    title: 'Termos de Uso - Compile & Chill',
    description: 'Regras de uso do serviço.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: '/termos',
  },
}

export default function TermosPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto prose prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
          Termos de Uso
        </h1>

        <div style={{ color: 'var(--color-text)' }}>
          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">Aceitação dos Termos</h2>
            <p className="mb-4">
              Ao usar o Compile & Chill, você concorda com estes termos de uso. Se não concordar, não utilize o serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">Uso do Serviço</h2>
            <p className="mb-4">Você concorda em:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Usar o serviço apenas para fins legais e lícitos</li>
              <li>Não tentar manipular pontuações ou rankings</li>
              <li>Não usar bots, scripts ou automação para jogar</li>
              <li>Respeitar outros usuários e a comunidade</li>
              <li>Não compartilhar conteúdo ofensivo ou tóxico</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">Responsabilidade</h2>
            <p className="mb-4">
              O Compile & Chill é fornecido "como está". Não garantimos disponibilidade 100% ou ausência de erros.
              Você é responsável por suas ações no serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">Moderação</h2>
            <p className="mb-4">
              Reservamos o direito de moderar conteúdo, remover pontuações suspeitas e banir usuários que violarem
              estes termos ou a cultura da comunidade.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">Propriedade Intelectual</h2>
            <p className="mb-4">
              Todo o conteúdo do Compile & Chill (jogos, design, código) é propriedade do criador. Você pode usar
              o serviço, mas não pode copiar, modificar ou distribuir sem autorização.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">Alterações</h2>
            <p className="mb-4">
              Estes termos podem ser atualizados. Continuar usando o serviço após alterações significa aceitar os novos termos.
            </p>
            <p className="text-sm opacity-80">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

