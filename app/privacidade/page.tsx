import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade - Compile & Chill',
  description: 'Política de privacidade do Compile & Chill. Como coletamos, usamos e protegemos seus dados.',
  keywords: ['privacidade', 'política', 'dados', 'LGPD'],
  openGraph: {
    title: 'Política de Privacidade - Compile & Chill',
    description: 'Como protegemos seus dados.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: '/privacidade',
  },
}

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto prose prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
          Política de Privacidade
        </h1>

        <div style={{ color: 'var(--color-text)' }}>
          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">Dados Coletados</h2>
            <p className="mb-4">
              Coletamos apenas os dados necessários para o funcionamento do serviço:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Informações da conta X (Twitter): nome, avatar e ID quando você faz login via OAuth</li>
              <li>Pontuações dos jogos para exibição em rankings</li>
              <li>Preferências de tema (armazenadas localmente e no servidor)</li>
              <li>Dados de uso anonimizados para melhorias no serviço</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">Cookies</h2>
            <p className="mb-4">
              Utilizamos cookies essenciais para autenticação e preferências. Não utilizamos cookies de rastreamento
              ou publicidade de terceiros.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">Armazenamento</h2>
            <p className="mb-4">
              Seus dados são armazenados de forma segura em servidores com criptografia. Não compartilhamos seus dados
              com terceiros, exceto quando necessário para o funcionamento do serviço (ex: provedor de autenticação X).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">Seus Direitos</h2>
            <p className="mb-4">
              Você tem direito a acessar, corrigir ou excluir seus dados a qualquer momento. Entre em contato via
              email (falcaoh@gmail.com) ou redes sociais (@shuktv no X).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">Alterações</h2>
            <p className="mb-4">
              Esta política pode ser atualizada. Alterações significativas serão comunicadas aos usuários.
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

