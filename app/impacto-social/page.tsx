'use client'

import { useThemeStore } from '@/lib/theme-store'
import { THEMES } from '@/lib/themes'

export default function ImpactoSocialPage() {
  const { theme: themeId } = useThemeStore()
  const currentTheme = THEMES[themeId].vars

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-4xl font-bold mb-4" 
            style={{ color: currentTheme['--color-text'] }}
          >
            🌍 Impacto Social / Regiões de Interesse
          </h1>
          <p 
            className="text-lg opacity-80" 
            style={{ color: currentTheme['--color-text-secondary'] }}
          >
            Nosso projeto busca apoiar comunidades com acesso limitado a recursos digitais
          </p>
        </div>

        {/* Target Countries Section */}
        <section className="mb-12">
          <h2 
            className="text-3xl font-bold mb-6" 
            style={{ color: currentTheme['--color-text'] }}
          >
            Países-Alvo
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Ethiopia */}
            <div 
              className="p-6 rounded-lg" 
              style={{ 
                backgroundColor: currentTheme['--color-bg-secondary'],
                borderLeft: '4px solid ' + currentTheme['--color-primary']
              }}
            >
              <h3 className="text-2xl font-bold mb-3" style={{ color: currentTheme['--color-text'] }}>
                🇪🇹 Etiópia
              </h3>
              <p className="mb-2" style={{ color: currentTheme['--color-text-secondary'] }}>
                Acesso digital baixo, muitos jovens sem conexão.
              </p>
              <p className="text-sm opacity-80" style={{ color: currentTheme['--color-text-secondary'] }}>
                <strong>Idiomas:</strong> Amárico, Inglês
              </p>
            </div>

            {/* Uganda */}
            <div 
              className="p-6 rounded-lg" 
              style={{ 
                backgroundColor: currentTheme['--color-bg-secondary'],
                borderLeft: '4px solid ' + currentTheme['--color-primary']
              }}
            >
              <h3 className="text-2xl font-bold mb-3" style={{ color: currentTheme['--color-text'] }}>
                🇺🇬 Uganda
              </h3>
              <p className="mb-2" style={{ color: currentTheme['--color-text-secondary'] }}>
                Barreiras de infraestrutura e alto custo de dados.
              </p>
              <p className="text-sm opacity-80" style={{ color: currentTheme['--color-text-secondary'] }}>
                <strong>Idiomas:</strong> Inglês, Luganda
              </p>
            </div>

            {/* Tanzania */}
            <div 
              className="p-6 rounded-lg" 
              style={{ 
                backgroundColor: currentTheme['--color-bg-secondary'],
                borderLeft: '4px solid ' + currentTheme['--color-primary']
              }}
            >
              <h3 className="text-2xl font-bold mb-3" style={{ color: currentTheme['--color-text'] }}>
                🇹🇿 Tanzânia
              </h3>
              <p className="mb-2" style={{ color: currentTheme['--color-text-secondary'] }}>
                Comunidades rurais com acesso limitado e grande interesse por tecnologia.
              </p>
              <p className="text-sm opacity-80" style={{ color: currentTheme['--color-text-secondary'] }}>
                <strong>Idiomas:</strong> Suaíli, Inglês
              </p>
            </div>
          </div>
        </section>

        {/* Partnership and NGO Section */}
        <section className="mb-12">
          <h2 
            className="text-3xl font-bold mb-6" 
            style={{ color: currentTheme['--color-text'] }}
          >
            Parcerias e ONGs
          </h2>
          <div 
            className="p-6 rounded-lg mb-6" 
            style={{ backgroundColor: currentTheme['--color-bg-secondary'] }}
          >
            <h3 className="text-2xl font-bold mb-4" style={{ color: currentTheme['--color-text'] }}>
              Como Contribuir
            </h3>
            <div className="space-y-4" style={{ color: currentTheme['--color-text-secondary'] }}>
              <div>
                <h4 className="font-bold mb-2" style={{ color: currentTheme['--color-text'] }}>
                  1. Documentação e Tutoriais
                </h4>
                <p>
                  Produza documentação e tutoriais em inglês + línguas locais relevantes (amárico, suaíli).
                  Ajude a tornar o projeto acessível para desenvolvedores e educadores nessas regiões.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2" style={{ color: currentTheme['--color-text'] }}>
                  2. Versões "Light" da Ferramenta
                </h4>
                <p>
                  Crie pacotes ou versões "light" para uso offline ou com baixa largura de banda.
                  Isso facilita o uso em escolas, ONGs e comunidades com conexão limitada.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2" style={{ color: currentTheme['--color-text'] }}>
                  3. Conexão com ONGs e Escolas
                </h4>
                <p>
                  Conecte-se com ONGs locais, escolas ou projetos de educação digital para distribuir
                  esse conteúdo e expandir o acesso à tecnologia educacional.
                </p>
              </div>
            </div>
          </div>

          <div 
            className="p-6 rounded-lg" 
            style={{ backgroundColor: currentTheme['--color-bg-secondary'] }}
          >
            <h3 className="text-2xl font-bold mb-4" style={{ color: currentTheme['--color-text'] }}>
              Contato para Parcerias
            </h3>
            <p className="mb-4" style={{ color: currentTheme['--color-text-secondary'] }}>
              Se você representa uma ONG, escola ou projeto de educação digital e gostaria de
              estabelecer uma parceria, entre em contato:
            </p>
            <a 
              href="mailto:falcaoh@gmail.com" 
              className="inline-block px-6 py-3 rounded-lg font-semibold transition-colors hover:opacity-80"
              style={{ 
                backgroundColor: currentTheme['--color-primary'],
                color: currentTheme['--color-bg']
              }}
            >
              falcaoh@gmail.com
            </a>
          </div>
        </section>

        {/* Multilingual Roadmap Section */}
        <section className="mb-12">
          <h2 
            className="text-3xl font-bold mb-6" 
            style={{ color: currentTheme['--color-text'] }}
          >
            Plano de Suporte Multilíngue
          </h2>
          <div className="space-y-6">
            {/* Phase 1 */}
            <div 
              className="p-6 rounded-lg" 
              style={{ 
                backgroundColor: currentTheme['--color-bg-secondary'],
                borderLeft: '4px solid ' + currentTheme['--color-primary']
              }}
            >
              <h3 className="text-2xl font-bold mb-3" style={{ color: currentTheme['--color-text'] }}>
                ✅ Fase 1: Inglês (Implementado)
              </h3>
              <p style={{ color: currentTheme['--color-text-secondary'] }}>
                Documentação em inglês já disponível, cobrindo Etiópia, Uganda e parte da Tanzânia
                no contexto educacional e tecnológico.
              </p>
            </div>

            {/* Phase 2 */}
            <div 
              className="p-6 rounded-lg" 
              style={{ 
                backgroundColor: currentTheme['--color-bg-secondary'],
                borderLeft: '4px solid ' + currentTheme['--color-primary']
              }}
            >
              <h3 className="text-2xl font-bold mb-3" style={{ color: currentTheme['--color-text'] }}>
                🚧 Fase 2: Suaíli (Em Desenvolvimento)
              </h3>
              <p style={{ color: currentTheme['--color-text-secondary'] }}>
                Adicionar suporte para suaíli, impactando significativamente a Tanzânia e parte do Quênia.
                Guias e documentação serão traduzidos para facilitar o acesso nessas regiões.
              </p>
            </div>

            {/* Phase 3 */}
            <div 
              className="p-6 rounded-lg" 
              style={{ 
                backgroundColor: currentTheme['--color-bg-secondary'],
                borderLeft: '4px solid ' + currentTheme['--color-primary']
              }}
            >
              <h3 className="text-2xl font-bold mb-3" style={{ color: currentTheme['--color-text'] }}>
                📋 Fase 3: Amárico (Planejado)
              </h3>
              <p style={{ color: currentTheme['--color-text-secondary'] }}>
                Adicionar suporte para amárico, impactando significativamente a Etiópia.
                Documentação completa será disponibilizada em amárico para ampliar o acesso.
              </p>
            </div>
          </div>
        </section>

        {/* Data Economy Mode Planning */}
        <section className="mb-12">
          <h2 
            className="text-3xl font-bold mb-6" 
            style={{ color: currentTheme['--color-text'] }}
          >
            Modo Economia de Dados (Planejado)
          </h2>
          <div 
            className="p-6 rounded-lg" 
            style={{ backgroundColor: currentTheme['--color-bg-secondary'] }}
          >
            <p className="mb-4" style={{ color: currentTheme['--color-text-secondary'] }}>
              Estamos planejando implementar um "Modo Economia de Dados" que permitirá:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{ color: currentTheme['--color-text-secondary'] }}>
              <li>Uso otimizado para conexões de internet fracas</li>
              <li>Versões leves dos jogos com menor consumo de dados</li>
              <li>Melhor experiência para escolas e ONGs com recursos limitados</li>
              <li>Uso direto no navegador sem necessidade de downloads pesados</li>
            </ul>
            <p className="mt-4 text-sm opacity-80" style={{ color: currentTheme['--color-text-secondary'] }}>
              <strong>Nota:</strong> Distribuições offline (APK, EXE, pendrive) são possibilidades futuras,
              mas o foco inicial será em uma opção na interface do produto.
            </p>
          </div>
        </section>

        {/* Contributor Guidelines */}
        <section>
          <h2 
            className="text-3xl font-bold mb-6" 
            style={{ color: currentTheme['--color-text'] }}
          >
            Diretrizes para Contribuidores
          </h2>
          <div 
            className="p-6 rounded-lg" 
            style={{ backgroundColor: currentTheme['--color-bg-secondary'] }}
          >
            <p className="mb-4" style={{ color: currentTheme['--color-text-secondary'] }}>
              Se você é desenvolvedor, tradutor ou educador e quer contribuir voltado para essas regiões:
            </p>
            <div className="space-y-3" style={{ color: currentTheme['--color-text-secondary'] }}>
              <div>
                <strong style={{ color: currentTheme['--color-text'] }}>Tradução:</strong> Ajude a traduzir
                documentação e guias para amárico, suaíli ou outras línguas locais relevantes.
              </div>
              <div>
                <strong style={{ color: currentTheme['--color-text'] }}>Documentação:</strong> Crie ou melhore
                tutoriais específicos para essas regiões, considerando desafios locais de acesso digital.
              </div>
              <div>
                <strong style={{ color: currentTheme['--color-text'] }}>Distribuição:</strong> Ajude a conectar
                o projeto com ONGs, escolas e projetos de educação digital nessas regiões.
              </div>
            </div>
            <div className="mt-6">
              <a 
                href="https://github.com/shuktv/CompileandChill" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 rounded-lg font-semibold transition-colors hover:opacity-80"
                style={{ 
                  backgroundColor: currentTheme['--color-primary'],
                  color: currentTheme['--color-bg']
                }}
              >
                Contribuir no GitHub
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

