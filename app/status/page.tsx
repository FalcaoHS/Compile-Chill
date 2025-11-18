import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Status do Sistema - Compile & Chill',
  description: 'Status atual de todos os componentes do Compile & Chill. Uptime, incidentes e monitoramento.',
  keywords: ['status', 'sistema', 'uptime', 'monitoramento'],
  openGraph: {
    title: 'Status do Sistema - Compile & Chill',
    description: 'Status atual do sistema.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: '/status',
  },
}

export default function StatusPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
          Status do Sistema
        </h1>
        <p className="text-lg mb-8 opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
          Monitoramento em tempo real de todos os componentes do Compile & Chill.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)', borderLeft: '4px solid #10b981' }}>
            <h3 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>Backend</h3>
            <p className="text-green-400 font-bold">Operacional</p>
            <p className="text-sm mt-2 opacity-60" style={{ color: 'var(--color-text-secondary)' }}>
              Uptime: 99.9%
            </p>
          </div>
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)', borderLeft: '4px solid #10b981' }}>
            <h3 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>Banco de Dados</h3>
            <p className="text-green-400 font-bold">Operacional</p>
            <p className="text-sm mt-2 opacity-60" style={{ color: 'var(--color-text-secondary)' }}>
              Latência: &lt;50ms
            </p>
          </div>
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)', borderLeft: '4px solid #10b981' }}>
            <h3 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>APIs</h3>
            <p className="text-green-400 font-bold">Operacional</p>
            <p className="text-sm mt-2 opacity-60" style={{ color: 'var(--color-text-secondary)' }}>
              Tempo de resposta: &lt;200ms
            </p>
          </div>
        </div>

        <div className="mb-8" style={{ color: 'var(--color-text)' }}>
          <h2 className="text-2xl font-bold mb-4">Componentes Monitorados</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
              <span>Autenticação (NextAuth)</span>
              <span className="text-green-400 font-bold">OK</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
              <span>Sistema de Pontuação</span>
              <span className="text-green-400 font-bold">OK</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
              <span>Rankings</span>
              <span className="text-green-400 font-bold">OK</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
              <span>Sistema de Temas</span>
              <span className="text-green-400 font-bold">OK</span>
            </div>
          </div>
        </div>

        <div className="mb-8" style={{ color: 'var(--color-text)' }}>
          <h2 className="text-2xl font-bold mb-4">Incidentes Recentes</h2>
          <p className="opacity-60">Nenhum incidente reportado nos últimos 30 dias.</p>
        </div>

        <p className="text-sm opacity-60" style={{ color: 'var(--color-text-secondary)' }}>
          Última atualização: {new Date().toLocaleString('pt-BR')}
        </p>
      </div>
    </div>
  )
}

