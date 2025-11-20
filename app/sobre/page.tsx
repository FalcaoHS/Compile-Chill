'use client'

import { useState } from 'react'
import { useThemeStore } from '@/lib/theme-store'
import { THEMES } from '@/lib/themes'

type TabId = 'projeto' | 'criador' | 'missao' | 'manifesto' | 'equipe' | 'roadmap' | 'devlog' | 'presskit' | 'brand' | 'faq' | 'status'

export default function SobrePage() {
  const [activeTab, setActiveTab] = useState<TabId>('projeto')
  const [lang, setLang] = useState<'pt' | 'en'>('pt')
  const { theme: themeId } = useThemeStore()
  const currentTheme = THEMES[themeId].vars

  const tabs = {
    pt: [
      { id: 'projeto', label: 'Sobre o Projeto' },
      { id: 'criador', label: 'A História do Criador' },
      { id: 'missao', label: 'Missão e Propósito' },
      { id: 'manifesto', label: 'Manifesto' },
      { id: 'equipe', label: 'Equipe' },
      { id: 'roadmap', label: 'Roadmap' },
      { id: 'devlog', label: 'Devlog' },
      { id: 'presskit', label: 'Press Kit' },
      { id: 'brand', label: 'Brand' },
      { id: 'faq', label: 'FAQ' },
      { id: 'status', label: 'Status' },
    ],
    en: [
      { id: 'projeto', label: 'About the Project' },
      { id: 'criador', label: "Creator's Story" },
      { id: 'missao', label: 'Mission & Purpose' },
      { id: 'manifesto', label: 'Manifesto' },
      { id: 'equipe', label: 'Team' },
      { id: 'roadmap', label: 'Roadmap' },
      { id: 'devlog', label: 'Devlog' },
      { id: 'presskit', label: 'Press Kit' },
      { id: 'brand', label: 'Brand' },
      { id: 'faq', label: 'FAQ' },
      { id: 'status', label: 'Status' },
    ]
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold" style={{ color: currentTheme['--color-text'] }}>
            {lang === 'pt' ? 'Sobre o Compile & Chill' : 'About Compile & Chill'}
          </h1>
          <button
            onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
            className="px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: currentTheme['--color-primary'],
              color: currentTheme['--color-bg'],
            }}
          >
            {lang === 'pt' ? 'EN' : 'PT'}
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b" style={{ borderColor: currentTheme['--color-text'] + '20' }}>
          {tabs[lang].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id ? 'font-bold' : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                backgroundColor: activeTab === tab.id ? currentTheme['--color-primary'] : 'transparent',
                color: activeTab === tab.id ? currentTheme['--color-bg'] : currentTheme['--color-text'],
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          {activeTab === 'projeto' && <ProjetoContent lang={lang} theme={currentTheme} />}
          {activeTab === 'criador' && <CriadorContent lang={lang} theme={currentTheme} />}
          {activeTab === 'missao' && <MissaoContent lang={lang} theme={currentTheme} />}
          {activeTab === 'manifesto' && <ManifestoContent lang={lang} theme={currentTheme} />}
          {activeTab === 'equipe' && <EquipeContent lang={lang} theme={currentTheme} />}
          {activeTab === 'roadmap' && <RoadmapContent lang={lang} theme={currentTheme} />}
          {activeTab === 'devlog' && <DevlogContent lang={lang} theme={currentTheme} />}
          {activeTab === 'presskit' && <PresskitContent lang={lang} theme={currentTheme} />}
          {activeTab === 'brand' && <BrandContent lang={lang} theme={currentTheme} />}
          {activeTab === 'faq' && <FAQContent lang={lang} theme={currentTheme} />}
          {activeTab === 'status' && <StatusContent lang={lang} theme={currentTheme} />}
        </div>
      </div>
    </div>
  )
}

function ProjetoContent({ lang, theme }: { lang: 'pt' | 'en'; theme: any }) {
  if (lang === 'pt') {
    return (
      <div style={{ color: theme['--color-text'] }}>
        <h2 className="text-3xl font-bold mb-4">O Que É o Compile & Chill?</h2>
        <p className="mb-4">
          Compile & Chill é um portal de descompressão criado especialmente para desenvolvedores e entusiastas de tecnologia.
          Um espaço onde você pode fazer pausas rápidas sem sair do "clima dev", jogando games com estética hacker/cyber,
          competindo em rankings e compartilhando conquistas com a comunidade.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-4">Por Que Existe?</h3>
        <p className="mb-4">
          A maioria dos jogos casuais quebra completamente o fluxo de trabalho do desenvolvedor. Você está imerso em código,
          precisa de uma pausa de 5 minutos, mas os jogos genéricos te tiram completamente do contexto tech.
        </p>
        <p className="mb-4">
          Aqui, cada jogo mantém você no universo dev: obstáculos são bugs e compiladores, power-ups são "copiou do stackoverflow",
          e a estética é puramente hacker. Não existe quebra de contexto.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-4">O Que Oferecemos?</h3>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>11 Jogos Customizados:</strong> Terminal 2048, Bit Runner, Stack Overflow Dodge, Hack Grid, Debug Maze, Dev Pong, Refactor Rush, Crypto Miner, Packet Switch, Byte Match e Dev Fifteen HEX</li>
          <li><strong>5 Temas Visuais:</strong> Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal e Blueprint Dev</li>
          <li><strong>Login com X (Twitter):</strong> Autenticação simples e rápida via OAuth</li>
          <li><strong>Rankings Globais:</strong> Compete com desenvolvedores do mundo todo</li>
          <li><strong>Perfil Personalizado:</strong> Acompanhe suas conquistas, medalhas e histórico</li>
        </ul>

        <h3 className="text-2xl font-bold mt-8 mb-4">Para Quem É?</h3>
        <p className="mb-4">
          <strong>Desenvolvedores ocupados (25-40 anos)</strong> que precisam de pausas rápidas entre sessões de código sem perder o foco.<br />
          <strong>Entusiastas de estética tech (20-35 anos)</strong> que apreciam visual hacker, pixel art, neon e terminal.<br />
          <strong>Codadores competitivos (22-38 anos)</strong> que curtem gamificação e competir com outros devs.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-4">Nossa Filosofia</h3>
        <p className="mb-4">
          Compile & Chill não é apenas um site de jogos. É um hub de acolhimento para a comunidade dev. Um lugar onde você pode
          descomprimir, rir, conectar-se e, principalmente, sentir-se em casa.
        </p>
        <p>
          Feito de dev para devs, com muito amor e atenção aos detalhes.
        </p>
      </div>
    )
  }

  return (
    <div style={{ color: theme['--color-text'] }}>
      <h2 className="text-3xl font-bold mb-4">What Is Compile & Chill?</h2>
      <p className="mb-4">
        Compile & Chill is a decompression portal created specifically for developers and tech enthusiasts.
        A space where you can take quick breaks without leaving the "dev vibe", playing games with hacker/cyber aesthetics,
        competing in rankings, and sharing achievements with the community.
      </p>

      <h3 className="text-2xl font-bold mt-8 mb-4">Why Does It Exist?</h3>
      <p className="mb-4">
        Most casual games completely break a developer's workflow. You're immersed in code, need a 5-minute break,
        but generic games pull you completely out of the tech context.
      </p>
      <p className="mb-4">
        Here, every game keeps you in the dev universe: obstacles are bugs and compilers, power-ups are "copied from stackoverflow",
        and the aesthetics are purely hacker. No context switching.
      </p>

      <h3 className="text-2xl font-bold mt-8 mb-4">What Do We Offer?</h3>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li><strong>11 Custom Games:</strong> Terminal 2048, Bit Runner, Stack Overflow Dodge, Hack Grid, Debug Maze, Dev Pong, Refactor Rush, Crypto Miner, Packet Switch, Byte Match, and Dev Fifteen HEX</li>
        <li><strong>5 Visual Themes:</strong> Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal, and Blueprint Dev</li>
        <li><strong>X (Twitter) Login:</strong> Simple and fast OAuth authentication</li>
        <li><strong>Global Rankings:</strong> Compete with developers worldwide</li>
        <li><strong>Personal Profile:</strong> Track your achievements, medals, and history</li>
      </ul>

      <h3 className="text-2xl font-bold mt-8 mb-4">Who Is It For?</h3>
      <p className="mb-4">
        <strong>Busy developers (25-40)</strong> who need quick breaks between coding sessions without losing focus.<br />
        <strong>Tech aesthetic enthusiasts (20-35)</strong> who appreciate hacker visuals, pixel art, neon, and terminal themes.<br />
        <strong>Competitive coders (22-38)</strong> who enjoy gamification and competing with other devs.
      </p>

      <h3 className="text-2xl font-bold mt-8 mb-4">Our Philosophy</h3>
      <p className="mb-4">
        Compile & Chill isn't just a gaming website. It's a welcoming hub for the dev community. A place where you can
        decompress, laugh, connect, and most importantly, feel at home.
      </p>
      <p>
        Made by devs for devs, with lots of love and attention to detail.
      </p>
    </div>
  )
}

function CriadorContent({ lang, theme }: { lang: 'pt' | 'en'; theme: any }) {
  if (lang === 'pt') {
    return (
      <div style={{ color: theme['--color-text'] }}>
        <h2 className="text-3xl font-bold mb-4">Hudson "Shuk" Falcão</h2>
        <p className="mb-4 text-xl opacity-80">Analista de Sistemas Sr. | Criador do Compile & Chill</p>

        <h3 className="text-2xl font-bold mt-8 mb-4">A Jornada</h3>
        <p className="mb-4">
          Hudson começou a trabalhar com TI em 1998, aos 17 anos, migrando para desenvolvimento em 2002.
          Como Homologador de Software aos 21 anos, participou de projetos massivos como o GENASV2 — uma migração
          de 3.800 máquinas do Windows 95 para Windows Professional.
        </p>

        <p className="mb-4">
          Ao longo dos anos, enfrentou altos e baixos, lutando contra problemas pessoais e financeiros.
          Em 2019, após um término de relacionamento, entrou em um período difícil. Foi salvo por sua comunidade
          na Twitch (onde fazia lives desde 2014), que o apoiou com conversas, acolhimento e ajuda.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-4">O Recomeço</h3>
        <p className="mb-4">
          Depois de 5 anos afastado, uma internação hospitalar e um telefonema de um ex-chefe mudaram tudo.
          Hudson aceitou voltar ao mercado, mesmo ganhando pouco inicialmente. Mas cansou de viver o sonho dos outros.
        </p>

        <p className="mb-4">
          Em outubro de 2025, algo extraordinário aconteceu: após anos na depressão profunda (chegando ao ponto de
          não conseguir calcular 2+2 rapidamente), sua mente voltou a funcionar. A criatividade aflorou novamente.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-4">A Explosão Criativa</h3>
        <p className="mb-4">
          Com experiência em segurança, usabilidade e design, Hudson viu nas LLMs a oportunidade de criar tudo que sempre quis.
          Em menos de 1 mês, lançou 4 MVPs sensacionais:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>ReactZone.com.br</li>
          <li>BanheiroUrgente.app</li>
          <li>Taroom (experimento)</li>
          <li>Poupancinha</li>
        </ul>

        <p className="mb-4">
          E em 18 de novembro de 2025, após quase 20 horas virado (35 horas acordado no total), lançou o Compile & Chill —
          seu 5º MVP feito em um dia.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-4">A Motivação</h3>
        <p className="mb-4">
          O incentivo maior veio do carinho e reconhecimento da comunidade dev. Hudson, que se sentia esquecido pelo mundo
          (a depressão afastou todos os seus amigos), encontrou força em seu filho, que mostrou o quanto ele tem capacidade
          de criar algo especial.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-4">A Mensagem</h3>
        <p className="mb-4 italic" style={{ borderLeft: `4px solid ${theme['--color-primary']}`, paddingLeft: '1rem' }}>
          "Acredite em você. Lute. Corra atrás. As IAs estão aí pra te ajudar a pôr em prática suas ideias — e eu tenho sido a prova disso."
        </p>

        <p className="mb-4">
          Compile & Chill é feito com atenção, carinho, percepção e amor. Um local para devs dividirem experiências,
          darem risadas e, principalmente, sentirem-se acolhidos.
        </p>

        <p className="mt-8 opacity-80">
          <strong>Contato:</strong> @shuktv no X (Twitter) | @hudsonfalcao no Instagram
        </p>
      </div>
    )
  }

  return (
    <div style={{ color: theme['--color-text'] }}>
      <h2 className="text-3xl font-bold mb-4">Hudson "Shuk" Falcão</h2>
      <p className="mb-4 text-xl opacity-80">Senior Systems Analyst | Creator of Compile & Chill</p>

      <h3 className="text-2xl font-bold mt-8 mb-4">The Journey</h3>
      <p className="mb-4">
        Hudson started working in IT in 1998, at age 17, moving into development in 2002.
        As a Software Tester at 21, he participated in massive projects like GENASV2 — a migration
        of 3,800 machines from Windows 95 to Windows Professional.
      </p>

      <p className="mb-4">
        Over the years, he faced ups and downs, struggling with personal and financial issues.
        In 2019, after a relationship breakup, he entered a difficult period. He was saved by his
        Twitch community (where he streamed since 2014), who supported him with conversations, warmth, and help.
      </p>

      <h3 className="text-2xl font-bold mt-8 mb-4">The Comeback</h3>
      <p className="mb-4">
        After 5 years away, a hospital stay and a phone call from a former boss changed everything.
        Hudson accepted returning to the market, even earning little initially. But he grew tired of living other people's dreams.
      </p>

      <p className="mb-4">
        In October 2025, something extraordinary happened: after years in deep depression (to the point of
        not being able to calculate 2+2 quickly), his mind started working again. Creativity flourished once more.
      </p>

      <h3 className="text-2xl font-bold mt-8 mb-4">The Creative Explosion</h3>
      <p className="mb-4">
        With experience in security, usability, and design, Hudson saw in LLMs the opportunity to create everything he always wanted.
        In less than a month, he launched 4 sensational MVPs:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li>ReactZone.com.br</li>
        <li>BanheiroUrgente.app</li>
        <li>Taroom (experiment)</li>
        <li>Poupancinha</li>
      </ul>

      <p className="mb-4">
        And on November 18, 2025, after almost 20 hours straight (35 hours awake in total), he launched Compile & Chill —
        his 5th MVP made in a day.
      </p>

      <h3 className="text-2xl font-bold mt-8 mb-4">The Motivation</h3>
      <p className="mb-4">
        The main drive came from the affection and recognition from the dev community. Hudson, who felt forgotten by the world
        (depression drove away all his friends), found strength in his son, who showed him how much he's capable
        of creating something special.
      </p>

      <h3 className="text-2xl font-bold mt-8 mb-4">The Message</h3>
      <p className="mb-4 italic" style={{ borderLeft: `4px solid ${theme['--color-primary']}`, paddingLeft: '1rem' }}>
        "Believe in yourself. Fight. Chase it. AIs are there to help you put your ideas into practice — and I've been proof of that."
      </p>

      <p className="mb-4">
        Compile & Chill is made with attention, care, perception, and love. A place for devs to share experiences,
        have laughs, and most importantly, feel welcomed.
      </p>

      <p className="mt-8 opacity-80">
        <strong>Contact:</strong> @shuktv on X (Twitter) | @hudsonfalcao on Instagram
      </p>
    </div>
  )
}

function MissaoContent({ lang, theme }: { lang: 'pt' | 'en'; theme: any }) {
  if (lang === 'pt') {
    return (
      <div style={{ color: theme['--color-text'] }}>
        <h2 className="text-3xl font-bold mb-4">Missão e Propósito</h2>

        <h3 className="text-2xl font-bold mt-8 mb-4">Nossa Missão</h3>
        <p className="mb-4 text-xl" style={{ borderLeft: `4px solid ${theme['--color-primary']}`, paddingLeft: '1rem' }}>
          Criar um portal de descompressão que ajuda desenvolvedores e entusiastas de tecnologia a fazer pausas rápidas
          sem sair do "clima dev", oferecendo jogos customizados com estética hacker/cyber, recursos sociais e rankings competitivos.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-4">O Problema Que Resolvemos</h3>
        <p className="mb-4">
          <strong>Pausas genéricas quebram o fluxo do desenvolvedor.</strong> A maioria dos jogos casuais desconecta completamente
          os desenvolvedores do ambiente tech. Essa mudança de contexto dificulta o retorno ao código.
        </p>
        <p className="mb-4">
          Além disso, não existe uma plataforma que combine jogos rápidos e envolventes com a estética hacker/cyber que muitos
          desenvolvedores apreciam.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-4">Nossa Solução</h3>
        <p className="mb-4">
          Um portal dedicado com 11 jogos customizados projetados especificamente para desenvolvedores, com obstáculos,
          power-ups e estética temáticos. A plataforma mantém o "clima dev" com múltiplos temas visuais enquanto oferece
          recursos sociais e rankings competitivos.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-4">Para Quem Trabalhamos</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-xl font-bold mb-2">O Desenvolvedor Ocupado (25-40)</h4>
            <p className="mb-2"><strong>Contexto:</strong> Precisa de pausas de 2-5 minutos entre sessões de código para recarregar sem perder o foco.</p>
            <p className="mb-2"><strong>Dor:</strong> Jogos genéricos quebram completamente o mindset tech; mudança de contexto atrapalha o fluxo de trabalho.</p>
            <p><strong>Objetivo:</strong> Jogos rápidos e envolventes que mantêm a estética e vibe de desenvolvedor.</p>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-2">O Entusiasta de Estética (20-35)</h4>
            <p className="mb-2"><strong>Contexto:</strong> Aprecia estética hacker/cyber, retro gaming e pixel art.</p>
            <p className="mb-2"><strong>Dor:</strong> Opções limitadas de jogos que combinam com suas preferências visuais.</p>
            <p><strong>Objetivo:</strong> Temas customizáveis e jogos visualmente atraentes que combinem com seu gosto estético.</p>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-2">O Codador Competitivo (22-38)</h4>
            <p className="mb-2"><strong>Contexto:</strong> Quer competir com colegas, acompanhar progresso e compartilhar conquistas.</p>
            <p className="mb-2"><strong>Dor:</strong> Sem forma fácil de competir com outros desenvolvedores de forma divertida e descontraída.</p>
            <p><strong>Objetivo:</strong> Rankings, conquistas e recursos de compartilhamento social para competir e conectar com outros desenvolvedores.</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold mt-8 mb-4">Nossos Diferenciais</h3>
        <ul className="list-disc pl-6 space-y-3 mb-4">
          <li><strong>Design de jogos pensado para desenvolvedores:</strong> Jogos com obstáculos temáticos (compiladores, bugs, brackets), power-ups ("resolveu!", "copiou do stackoverflow") e referências que ressoam com a comunidade dev.</li>
          <li><strong>Temas visuais customizáveis:</strong> 5 temas distintos (Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal, Blueprint Dev) com troca instantânea.</li>
          <li><strong>Gaming social integrado:</strong> Combinamos jogos rápidos, rankings, conquistas e compartilhamento social especificamente para a comunidade dev.</li>
        </ul>

        <h3 className="text-2xl font-bold mt-8 mb-4">Sobre o Projeto</h3>
        <div className="mb-6 p-6 rounded-lg" style={{ backgroundColor: theme['--color-primary'] + '10', borderLeft: `4px solid ${theme['--color-primary']}` }}>
          <p className="mb-4">
            Compile & Chill não tem intenção de ganhar dinheiro com isso.
          </p>
          <p className="mb-4">
            A ideia é simples: levar informação e acesso pra quem precisa, especialmente pra desenvolvedores que têm recursos limitados.
            Por isso, tudo aqui é de graça — sem anúncios, sem assinaturas, sem cobrança nenhuma.
          </p>
          <p>
            É um projeto feito com carinho pela comunidade dev, pra criar um espaço onde todo mundo se sinta acolhido e possa descomprimir.
          </p>
        </div>

        <h3 className="text-2xl font-bold mt-8 mb-4">Visão de Futuro</h3>
        <p className="mb-4">
          Queremos que o Compile & Chill se torne o hub de descompressão padrão para a comunidade global de desenvolvedores.
          Um lugar onde você sempre volta quando precisa de uma pausa, onde encontra amigos, compete de forma saudável
          e se sente genuinamente em casa.
        </p>
        <p>
          Não somos apenas um site de jogos. Somos uma comunidade.
        </p>
      </div>
    )
  }

  return (
    <div style={{ color: theme['--color-text'] }}>
      <h2 className="text-3xl font-bold mb-4">Mission & Purpose</h2>

      <h3 className="text-2xl font-bold mt-8 mb-4">Our Mission</h3>
      <p className="mb-4 text-xl" style={{ borderLeft: `4px solid ${theme['--color-primary']}`, paddingLeft: '1rem' }}>
        Create a decompression portal that helps developers and tech enthusiasts take quick breaks
        without leaving the "dev vibe", offering custom games with hacker/cyber aesthetics, social features, and competitive rankings.
      </p>

      <h3 className="text-2xl font-bold mt-8 mb-4">The Problem We Solve</h3>
      <p className="mb-4">
        <strong>Generic breaks break developer flow.</strong> Most casual games completely disconnect
        developers from the tech environment. This context switching makes it harder to return to code.
      </p>
      <p className="mb-4">
        Additionally, there's no platform that combines quick, engaging games with the hacker/cyber aesthetic that many
        developers appreciate.
      </p>

      <h3 className="text-2xl font-bold mt-8 mb-4">Our Solution</h3>
      <p className="mb-4">
        A dedicated portal with 11 custom games designed specifically for developers, featuring themed obstacles,
        power-ups, and aesthetics. The platform maintains the "dev vibe" with multiple visual themes while offering
        social features and competitive rankings.
      </p>

      <h3 className="text-2xl font-bold mt-8 mb-4">Who We Work For</h3>
      <div className="space-y-6">
        <div>
          <h4 className="text-xl font-bold mb-2">The Busy Developer (25-40)</h4>
          <p className="mb-2"><strong>Context:</strong> Needs 2-5 minute breaks between coding sessions to recharge without losing focus.</p>
          <p className="mb-2"><strong>Pain:</strong> Generic games completely break the tech mindset; context switching disrupts workflow.</p>
          <p><strong>Goal:</strong> Quick, engaging games that maintain the developer aesthetic and vibe.</p>
        </div>

        <div>
          <h4 className="text-xl font-bold mb-2">The Aesthetic Enthusiast (20-35)</h4>
          <p className="mb-2"><strong>Context:</strong> Appreciates hacker/cyber aesthetics, retro gaming, and pixel art.</p>
          <p className="mb-2"><strong>Pain:</strong> Limited options for games that match their visual preferences.</p>
          <p><strong>Goal:</strong> Customizable themes and visually appealing games that match their aesthetic taste.</p>
        </div>

        <div>
          <h4 className="text-xl font-bold mb-2">The Competitive Coder (22-38)</h4>
          <p className="mb-2"><strong>Context:</strong> Wants to compete with peers, track progress, and share achievements.</p>
          <p className="mb-2"><strong>Pain:</strong> No easy way to compete with other developers in a fun, low-stakes environment.</p>
          <p><strong>Goal:</strong> Rankings, achievements, and social sharing features to compete and connect with other developers.</p>
        </div>
      </div>

      <h3 className="text-2xl font-bold mt-8 mb-4">Our Differentiators</h3>
      <ul className="list-disc pl-6 space-y-3 mb-4">
        <li><strong>Developer-first game design:</strong> Games with themed obstacles (compilers, bugs, brackets), power-ups ("solved it!", "copied from stackoverflow") and references that resonate with the dev community.</li>
        <li><strong>Customizable visual themes:</strong> 5 distinct themes (Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal, Blueprint Dev) with instant switching.</li>
        <li><strong>Integrated social gaming:</strong> We combine quick games, rankings, achievements, and social sharing specifically for the dev community.</li>
      </ul>

      <h3 className="text-2xl font-bold mt-8 mb-4">About the Project</h3>
      <div className="mb-6 p-6 rounded-lg" style={{ backgroundColor: theme['--color-primary'] + '10', borderLeft: `4px solid ${theme['--color-primary']}` }}>
        <p className="mb-4">
          Compile & Chill has no intention of making money from this.
        </p>
        <p className="mb-4">
          The idea is simple: bring information and access to those who need it, especially developers with limited resources.
          That's why everything here is free — no ads, no subscriptions, no charges whatsoever.
        </p>
        <p>
          This is a project made with care for the dev community, to create a space where everyone feels welcome and can decompress.
        </p>
      </div>

      <h3 className="text-2xl font-bold mt-8 mb-4">Future Vision</h3>
      <p className="mb-4">
        We want Compile & Chill to become the default decompression hub for the global developer community.
        A place you always come back to when you need a break, where you find friends, compete healthily,
        and genuinely feel at home.
      </p>
      <p>
        We're not just a gaming website. We're a community.
      </p>
    </div>
  )
}

function ManifestoContent({ lang, theme }: { lang: 'pt' | 'en'; theme: any }) {
  if (lang === 'pt') {
    return (
      <div style={{ color: theme['--color-text'] }}>
        <h2 className="text-3xl font-bold mb-6">Manifesto do Compile & Chill</h2>

        <div className="text-xl mb-8 p-6 rounded-lg" style={{ backgroundColor: theme['--color-primary'] + '10', borderLeft: `4px solid ${theme['--color-primary']}` }}>
          <p className="mb-4">
            Nós acreditamos que desenvolvedores merecem um espaço próprio. Um lugar onde pausas não quebram o fluxo,
            onde o humor é entendido, onde a estética ressoa com nossa cultura.
          </p>
          <p>
            Este é o Compile & Chill. Feito de dev para devs, com amor.
          </p>
        </div>

        <h3 className="text-2xl font-bold mt-8 mb-4">🎯 Por Que Existimos</h3>
        <p className="mb-4">
          A cultura dev é única. Temos nosso próprio humor, nossas próprias referências, nossa própria estética.
          Mas quando precisamos de uma pausa, somos jogados em jogos genéricos que ignoram completamente quem somos.
        </p>
        <p className="mb-4">
          Não mais. O Compile & Chill existe para criar um espaço que entende desenvolvedores. Um portal onde você
          pode descomprimir sem sair do universo tech.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-4">💡 Nossa Visão de Futuro</h3>
        <p className="mb-4">
          Imaginamos um futuro onde cada desenvolvedor, em qualquer lugar do mundo, tem um lugar para chamar de seu.
          Onde pausas são celebradas, não vistas como perda de tempo. Onde competição é saudável e comunidade é real.
        </p>
        <p className="mb-4">
          Queremos construir mais que um site de jogos. Queremos construir um movimento de descompressão consciente
          para a comunidade dev global.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-4">🤝 Cultura & Valores</h3>
        <ul className="space-y-4 mb-4">
          <li className="flex items-start">
            <span className="font-bold mr-3" style={{ color: theme['--color-primary'] }}>→</span>
            <div>
              <strong>Acolhimento acima de tudo:</strong> Este é um espaço seguro. Toxicidade não é bem-vinda. Aqui, todos são respeitados.
            </div>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-3" style={{ color: theme['--color-primary'] }}>→</span>
            <div>
              <strong>Humor dev-friendly:</strong> Piadas sobre bugs, Stack Overflow e café são não apenas permitidas — são encorajadas.
            </div>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-3" style={{ color: theme['--color-primary'] }}>→</span>
            <div>
              <strong>Estética importa:</strong> Nós nos preocupamos com visual. Cada pixel, cada animação, cada transição foi pensada.
            </div>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-3" style={{ color: theme['--color-primary'] }}>→</span>
            <div>
              <strong>Comunidade real:</strong> Não somos apenas usuários em um banco de dados. Somos desenvolvedores conectados por paixão.
            </div>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-3" style={{ color: theme['--color-primary'] }}>→</span>
            <div>
              <strong>Open feedback:</strong> Sua voz importa. Sugestões, bugs, ideias — tudo é bem-vindo e levado a sério.
            </div>
          </li>
        </ul>

        <h3 className="text-2xl font-bold mt-8 mb-4">🚫 Anti-Toxicity</h3>
        <p className="mb-4">
          O mundo dev já tem pressão suficiente. Deadlines impossíveis, bugs críticos, síndrome do impostor.
          O Compile & Chill é um respiro de tudo isso.
        </p>
        <p className="mb-4">
          Aqui, não toleramos:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Elitismo técnico (todos estamos aprendendo sempre)</li>
          <li>Gatekeeping de tecnologias (use o que funciona pra você)</li>
          <li>Comparações destrutivas (cada jornada é única)</li>
          <li>Hostilidade de qualquer tipo (seja gentil, sempre)</li>
        </ul>

        <h3 className="text-2xl font-bold mt-8 mb-4">🌍 Construindo Juntos</h3>
        <p className="mb-4">
          O Compile & Chill é um projeto vivo. Ele cresce com a comunidade, evolui com feedback, melhora com sugestões.
        </p>
        <p className="mb-4">
          Se você tem uma ideia, compartilhe. Se encontrou um bug, reporte. Se curtiu algo, espalhe.
          Este portal é nosso — de toda a comunidade dev.
        </p>

        <div className="mt-12 p-6 rounded-lg text-center" style={{ backgroundColor: theme['--color-primary'] + '15' }}>
          <p className="text-2xl font-bold mb-4">Compile & Chill</p>
          <p className="text-lg opacity-90">Feito de dev para devs, com muito amor e descompressão.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ color: theme['--color-text'] }}>
      <h2 className="text-3xl font-bold mb-6">Compile & Chill Manifesto</h2>

      <div className="text-xl mb-8 p-6 rounded-lg" style={{ backgroundColor: theme['--color-primary'] + '10', borderLeft: `4px solid ${theme['--color-primary']}` }}>
        <p className="mb-4">
          We believe developers deserve their own space. A place where breaks don't break flow,
          where humor is understood, where aesthetics resonate with our culture.
        </p>
        <p>
          This is Compile & Chill. Made by devs for devs, with love.
        </p>
      </div>

      <h3 className="text-2xl font-bold mt-8 mb-4">🎯 Why We Exist</h3>
      <p className="mb-4">
        Dev culture is unique. We have our own humor, our own references, our own aesthetics.
        But when we need a break, we're thrown into generic games that completely ignore who we are.
      </p>
      <p className="mb-4">
        Not anymore. Compile & Chill exists to create a space that understands developers. A portal where you
        can decompress without leaving the tech universe.
      </p>

      <h3 className="text-2xl font-bold mt-8 mb-4">💡 Our Vision for the Future</h3>
      <p className="mb-4">
        We imagine a future where every developer, anywhere in the world, has a place to call their own.
        Where breaks are celebrated, not seen as wasted time. Where competition is healthy and community is real.
      </p>
      <p className="mb-4">
        We want to build more than a gaming website. We want to build a conscious decompression movement
        for the global dev community.
      </p>

      <h3 className="text-2xl font-bold mt-8 mb-4">🤝 Culture & Values</h3>
      <ul className="space-y-4 mb-4">
        <li className="flex items-start">
          <span className="font-bold mr-3" style={{ color: theme['--color-primary'] }}>→</span>
          <div>
            <strong>Welcoming above all:</strong> This is a safe space. Toxicity is not welcome. Here, everyone is respected.
          </div>
        </li>
        <li className="flex items-start">
          <span className="font-bold mr-3" style={{ color: theme['--color-primary'] }}>→</span>
          <div>
            <strong>Dev-friendly humor:</strong> Jokes about bugs, Stack Overflow, and coffee are not just allowed — they're encouraged.
          </div>
        </li>
        <li className="flex items-start">
          <span className="font-bold mr-3" style={{ color: theme['--color-primary'] }}>→</span>
          <div>
            <strong>Aesthetics matter:</strong> We care about visuals. Every pixel, every animation, every transition was thought through.
          </div>
        </li>
        <li className="flex items-start">
          <span className="font-bold mr-3" style={{ color: theme['--color-primary'] }}>→</span>
          <div>
            <strong>Real community:</strong> We're not just users in a database. We're developers connected by passion.
          </div>
        </li>
        <li className="flex items-start">
          <span className="font-bold mr-3" style={{ color: theme['--color-primary'] }}>→</span>
          <div>
            <strong>Open feedback:</strong> Your voice matters. Suggestions, bugs, ideas — everything is welcome and taken seriously.
          </div>
        </li>
      </ul>

      <h3 className="text-2xl font-bold mt-8 mb-4">🚫 Anti-Toxicity</h3>
      <p className="mb-4">
        The dev world already has enough pressure. Impossible deadlines, critical bugs, impostor syndrome.
        Compile & Chill is a breath from all of that.
      </p>
      <p className="mb-4">
        Here, we don't tolerate:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li>Technical elitism (we're all always learning)</li>
        <li>Technology gatekeeping (use what works for you)</li>
        <li>Destructive comparisons (each journey is unique)</li>
        <li>Hostility of any kind (be kind, always)</li>
      </ul>

      <h3 className="text-2xl font-bold mt-8 mb-4">🌍 Building Together</h3>
      <p className="mb-4">
        Compile & Chill is a living project. It grows with the community, evolves with feedback, improves with suggestions.
      </p>
      <p className="mb-4">
        If you have an idea, share it. If you found a bug, report it. If you liked something, spread it.
        This portal is ours — of the entire dev community.
      </p>

      <div className="mt-12 p-6 rounded-lg text-center" style={{ backgroundColor: theme['--color-primary'] + '15' }}>
        <p className="text-2xl font-bold mb-4">Compile & Chill</p>
        <p className="text-lg opacity-90">Made by devs for devs, with lots of love and decompression.</p>
      </div>
    </div>
  )
}

function EquipeContent({ lang, theme }: { lang: 'pt' | 'en'; theme: any }) {
  if (lang === 'pt') {
    return (
      <div style={{ color: theme['--color-text'] }}>
        <h2 className="text-3xl font-bold mb-4">Equipe</h2>
        <p className="mb-6 text-lg opacity-80">
          Compile & Chill é um projeto criado e mantido por um desenvolvedor apaixonado pela comunidade dev.
        </p>

        <div className="grid md:grid-cols-1 gap-6">
          <div className="p-6 rounded-lg" style={{ backgroundColor: theme['--color-primary'] + '10', borderLeft: `4px solid ${theme['--color-primary']}` }}>
            <h3 className="text-2xl font-bold mb-2">Hudson "Shuk" Falcão</h3>
            <p className="text-lg mb-2 opacity-90">Criador & Desenvolvedor Principal</p>
            <p className="mb-4">
              Analista de Sistemas Sênior com mais de 20 anos de experiência em TI. Especialista em segurança,
              usabilidade e design de sistemas. Criador do Compile & Chill e de outros projetos como ReactZone,
              BanheiroUrgente e Poupancinha.
            </p>
            <div className="flex gap-4 text-sm">
              <a href="https://x.com/shuktv" target="_blank" rel="noopener noreferrer" className="underline opacity-80 hover:opacity-100">
                @shuktv (X)
              </a>
              <a href="https://instagram.com/hudsonfalcao" target="_blank" rel="noopener noreferrer" className="underline opacity-80 hover:opacity-100">
                @hudsonfalcao (Instagram)
              </a>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold mt-8 mb-4">Contribuidores</h3>
        <p className="mb-4">
          O Compile & Chill é construído com a ajuda de ferramentas de IA (Cursor, GPT, Gemini) e com o feedback
          valioso da comunidade dev. Se você tem sugestões, encontrou bugs ou quer contribuir, entre em contato!
        </p>
      </div>
    )
  }

  return (
    <div style={{ color: theme['--color-text'] }}>
      <h2 className="text-3xl font-bold mb-4">Team</h2>
      <p className="mb-6 text-lg opacity-80">
        Compile & Chill is a project created and maintained by a developer passionate about the dev community.
      </p>

      <div className="grid md:grid-cols-1 gap-6">
        <div className="p-6 rounded-lg" style={{ backgroundColor: theme['--color-primary'] + '10', borderLeft: `4px solid ${theme['--color-primary']}` }}>
          <h3 className="text-2xl font-bold mb-2">Hudson "Shuk" Falcão</h3>
          <p className="text-lg mb-2 opacity-90">Creator & Lead Developer</p>
          <p className="mb-4">
            Senior Systems Analyst with over 20 years of IT experience. Specialist in security,
            usability, and system design. Creator of Compile & Chill and other projects like ReactZone,
            BanheiroUrgente, and Poupancinha.
          </p>
          <div className="flex gap-4 text-sm">
            <a href="https://x.com/shuktv" target="_blank" rel="noopener noreferrer" className="underline opacity-80 hover:opacity-100">
              @shuktv (X)
            </a>
            <a href="https://instagram.com/hudsonfalcao" target="_blank" rel="noopener noreferrer" className="underline opacity-80 hover:opacity-100">
              @hudsonfalcao (Instagram)
            </a>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold mt-8 mb-4">Contributors</h3>
      <p className="mb-4">
        Compile & Chill is built with the help of AI tools (Cursor, GPT, Gemini) and with valuable feedback
        from the dev community. If you have suggestions, found bugs, or want to contribute, get in touch!
      </p>
    </div>
  )
}

function RoadmapContent({ lang, theme }: { lang: 'pt' | 'en'; theme: any }) {
  const completed = [
    'X OAuth Authentication',
    'Theme System Foundation',
    'Home Page with Game List',
    'Terminal 2048',
    'Game Score Storage',
    'Byte Match',
    'Dev Pong',
    'Bit Runner',
    'Stack Overflow Dodge',
    'Hack Grid',
    'Debug Maze',
    'Refactor Rush',
    'Crypto Miner Game',
    'Packet Switch',
    'Dev Fifteen HEX',
  ]

  const inProgress = [
    'Security Foundation',
    'Game Score Validation System',
    'User Profile Page',
    'Global Rankings Page',
  ]

  const planned = [
    'Social Feed Page',
    'Share to Feed Feature',
    'X Sharing with Image Generation',
    'Achievement System',
    'Monthly Seasons',
    'Header Navigation',
    'Game Page Layout',
    'Responsive Design & Animations',
    'Security Hardening',
  ]

  if (lang === 'pt') {
    return (
      <div style={{ color: theme['--color-text'] }}>
        <h2 className="text-3xl font-bold mb-4">Roadmap</h2>
        <p className="mb-6">
          O Compile & Chill está em constante evolução. Aqui está o que já foi implementado e o que está por vir.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-4">✅ Concluído</h3>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          {completed.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h3 className="text-2xl font-bold mt-8 mb-4">🚧 Em Progresso</h3>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          {inProgress.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h3 className="text-2xl font-bold mt-8 mb-4">📋 Planejado</h3>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          {planned.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <p className="mt-8 text-sm opacity-80">
          O roadmap é atualizado regularmente conforme o projeto evolui. Para sugestões, entre em contato!
        </p>
      </div>
    )
  }

  return (
    <div style={{ color: theme['--color-text'] }}>
      <h2 className="text-3xl font-bold mb-4">Roadmap</h2>
      <p className="mb-6">
        Compile & Chill is constantly evolving. Here's what's been implemented and what's coming next.
      </p>

      <h3 className="text-2xl font-bold mt-8 mb-4">✅ Completed</h3>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        {completed.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h3 className="text-2xl font-bold mt-8 mb-4">🚧 In Progress</h3>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        {inProgress.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h3 className="text-2xl font-bold mt-8 mb-4">📋 Planned</h3>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        {planned.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <p className="mt-8 text-sm opacity-80">
        The roadmap is updated regularly as the project evolves. For suggestions, get in touch!
      </p>
    </div>
  )
}

function DevlogContent({ lang, theme }: { lang: 'pt' | 'en'; theme: any }) {
  if (lang === 'pt') {
    return (
      <div style={{ color: theme['--color-text'] }}>
        <h2 className="text-3xl font-bold mb-4">Devlog</h2>
        <p className="mb-6">
          Acompanhe o desenvolvimento do Compile & Chill. Histórico de atualizações, melhorias e novidades.
        </p>

        <div className="space-y-6">
          <div className="p-4 rounded-lg" style={{ backgroundColor: theme['--color-primary'] + '10' }}>
            <h3 className="text-xl font-bold mb-2">18/11/2025 - Lançamento Inicial</h3>
            <p className="mb-2">
              Compile & Chill foi lançado após quase 20 horas de desenvolvimento direto. O MVP inclui:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>11 jogos customizados para desenvolvedores</li>
              <li>Sistema de temas com 5 opções visuais</li>
              <li>Autenticação via X (Twitter) OAuth</li>
              <li>Sistema de pontuação e rankings</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg" style={{ backgroundColor: theme['--color-primary'] + '10' }}>
            <h3 className="text-xl font-bold mb-2">Outubro 2025 - Explosão Criativa</h3>
            <p className="mb-2">
              Após anos de depressão, a mente do criador voltou a funcionar. Em menos de 1 mês, foram lançados
              4 MVPs: ReactZone, BanheiroUrgente, Taroom e Poupancinha.
            </p>
          </div>
        </div>

        <p className="mt-8 text-sm opacity-80">
          O devlog será atualizado conforme novas features forem implementadas. Fique de olho!
        </p>
      </div>
    )
  }

  return (
    <div style={{ color: theme['--color-text'] }}>
      <h2 className="text-3xl font-bold mb-4">Devlog</h2>
      <p className="mb-6">
        Follow Compile & Chill's development. History of updates, improvements, and news.
      </p>

      <div className="space-y-6">
        <div className="p-4 rounded-lg" style={{ backgroundColor: theme['--color-primary'] + '10' }}>
          <h3 className="text-xl font-bold mb-2">11/18/2025 - Initial Launch</h3>
          <p className="mb-2">
            Compile & Chill was launched after almost 20 hours of straight development. The MVP includes:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>11 custom games for developers</li>
            <li>Theme system with 5 visual options</li>
            <li>X (Twitter) OAuth authentication</li>
            <li>Scoring and ranking system</li>
          </ul>
        </div>

        <div className="p-4 rounded-lg" style={{ backgroundColor: theme['--color-primary'] + '10' }}>
          <h3 className="text-xl font-bold mb-2">October 2025 - Creative Explosion</h3>
          <p className="mb-2">
            After years of depression, the creator's mind started working again. In less than 1 month, 4 MVPs
            were launched: ReactZone, BanheiroUrgente, Taroom, and Poupancinha.
          </p>
        </div>
      </div>

      <p className="mt-8 text-sm opacity-80">
        The devlog will be updated as new features are implemented. Stay tuned!
      </p>
    </div>
  )
}

function PresskitContent({ lang, theme }: { lang: 'pt' | 'en'; theme: any }) {
  if (lang === 'pt') {
    return (
      <div style={{ color: theme['--color-text'] }}>
        <h2 className="text-3xl font-bold mb-4">Press Kit</h2>
        <p className="mb-6">
          Recursos para imprensa, blogueiros e criadores de conteúdo que querem falar sobre o Compile & Chill.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-4">Sobre o Projeto</h3>
        <p className="mb-4">
          Compile & Chill é um portal de descompressão criado especialmente para desenvolvedores e entusiastas
          de tecnologia. Oferece 11 jogos customizados com estética hacker/cyber, sistema de rankings e recursos sociais.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-4">Informações de Contato</h3>
        <p className="mb-2"><strong>Criador:</strong> Hudson "Shuk" Falcão</p>
        <p className="mb-2"><strong>Email:</strong> falcaoh@gmail.com</p>
        <p className="mb-2"><strong>X (Twitter):</strong> @shuktv</p>
        <p className="mb-4"><strong>Instagram:</strong> @hudsonfalcao</p>

        <h3 className="text-2xl font-bold mt-8 mb-4">Recursos Visuais</h3>
        <p className="mb-4">
          Logos, screenshots e outros recursos visuais estão disponíveis na página <a href="/brand" className="underline">/brand</a>.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-4">Fatos Rápidos</h3>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Lançado em 18 de novembro de 2025</li>
          <li>11 jogos customizados para desenvolvedores</li>
          <li>5 temas visuais distintos</li>
          <li>Autenticação via X (Twitter) OAuth</li>
          <li>100% gratuito e open-source (em breve)</li>
        </ul>
      </div>
    )
  }

  return (
    <div style={{ color: theme['--color-text'] }}>
      <h2 className="text-3xl font-bold mb-4">Press Kit</h2>
      <p className="mb-6">
        Resources for press, bloggers, and content creators who want to talk about Compile & Chill.
      </p>

      <h3 className="text-2xl font-bold mt-8 mb-4">About the Project</h3>
      <p className="mb-4">
        Compile & Chill is a decompression portal created specifically for developers and tech enthusiasts.
        It offers 11 custom games with hacker/cyber aesthetics, ranking system, and social features.
      </p>

      <h3 className="text-2xl font-bold mt-8 mb-4">Contact Information</h3>
      <p className="mb-2"><strong>Creator:</strong> Hudson "Shuk" Falcão</p>
      <p className="mb-2"><strong>Email:</strong> falcaoh@gmail.com</p>
      <p className="mb-2"><strong>X (Twitter):</strong> @shuktv</p>
      <p className="mb-4"><strong>Instagram:</strong> @hudsonfalcao</p>

      <h3 className="text-2xl font-bold mt-8 mb-4">Visual Resources</h3>
      <p className="mb-4">
        Logos, screenshots, and other visual resources are available on the <a href="/brand" className="underline">/brand</a> page.
      </p>

      <h3 className="text-2xl font-bold mt-8 mb-4">Quick Facts</h3>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li>Launched on November 18, 2025</li>
        <li>11 custom games for developers</li>
        <li>5 distinct visual themes</li>
        <li>X (Twitter) OAuth authentication</li>
        <li>100% free and open-source (coming soon)</li>
      </ul>
    </div>
  )
}

function BrandContent({ lang, theme }: { lang: 'pt' | 'en'; theme: any }) {
  if (lang === 'pt') {
    return (
      <div style={{ color: theme['--color-text'] }}>
        <h2 className="text-3xl font-bold mb-4">Identidade Visual</h2>
        <p className="mb-6">
          Diretrizes de marca e identidade visual do Compile & Chill.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-4">Cores</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {Object.entries(THEMES).map(([id, themeData]) => (
            <div key={id} className="p-4 rounded-lg" style={{ backgroundColor: themeData.vars['--color-bg-secondary'] }}>
              <div className="h-16 rounded mb-2" style={{ backgroundColor: themeData.vars['--color-primary'] }}></div>
              <p className="text-sm font-bold">{themeData.name}</p>
              <p className="text-xs opacity-80">{themeData.vars['--color-primary']}</p>
            </div>
          ))}
        </div>

        <h3 className="text-2xl font-bold mt-8 mb-4">Tipografia</h3>
        <p className="mb-4">
          Cada tema possui sua própria tipografia:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>Cyber Hacker:</strong> Roboto Mono</li>
          <li><strong>Pixel Lab:</strong> Press Start 2P</li>
          <li><strong>Neon Future:</strong> Orbitron</li>
          <li><strong>Terminal Minimal:</strong> JetBrains Mono</li>
          <li><strong>Blueprint Dev:</strong> Inter</li>
        </ul>

        <h3 className="text-2xl font-bold mt-8 mb-4">Logo</h3>
        <p className="mb-4">
          O logo do Compile & Chill é texto simples: "Compile & Chill" com estilização baseada no tema ativo.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-4">Uso</h3>
        <p className="mb-4">
          Ao usar a marca Compile & Chill, mantenha a integridade visual. Não distorça, modifique ou altere
          as cores principais sem autorização.
        </p>
      </div>
    )
  }

  return (
    <div style={{ color: theme['--color-text'] }}>
      <h2 className="text-3xl font-bold mb-4">Visual Identity</h2>
      <p className="mb-6">
        Brand and visual identity guidelines for Compile & Chill.
      </p>

      <h3 className="text-2xl font-bold mt-8 mb-4">Colors</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {Object.entries(THEMES).map(([id, themeData]) => (
          <div key={id} className="p-4 rounded-lg" style={{ backgroundColor: themeData.vars['--color-bg-secondary'] }}>
            <div className="h-16 rounded mb-2" style={{ backgroundColor: themeData.vars['--color-primary'] }}></div>
            <p className="text-sm font-bold">{themeData.name}</p>
            <p className="text-xs opacity-80">{themeData.vars['--color-primary']}</p>
          </div>
        ))}
      </div>

      <h3 className="text-2xl font-bold mt-8 mb-4">Typography</h3>
      <p className="mb-4">
        Each theme has its own typography:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li><strong>Cyber Hacker:</strong> Roboto Mono</li>
        <li><strong>Pixel Lab:</strong> Press Start 2P</li>
        <li><strong>Neon Future:</strong> Orbitron</li>
        <li><strong>Terminal Minimal:</strong> JetBrains Mono</li>
        <li><strong>Blueprint Dev:</strong> Inter</li>
      </ul>

      <h3 className="text-2xl font-bold mt-8 mb-4">Logo</h3>
      <p className="mb-4">
        The Compile & Chill logo is simple text: "Compile & Chill" with styling based on the active theme.
      </p>

      <h3 className="text-2xl font-bold mt-8 mb-4">Usage</h3>
      <p className="mb-4">
        When using the Compile & Chill brand, maintain visual integrity. Do not distort, modify, or change
        primary colors without authorization.
      </p>
    </div>
  )
}

function FAQContent({ lang, theme }: { lang: 'pt' | 'en'; theme: any }) {
  const faqs = lang === 'pt' ? [
    {
      q: 'O que é o Compile & Chill?',
      a: 'Compile & Chill é um portal de descompressão criado especialmente para desenvolvedores. Oferece 11 jogos customizados com estética hacker/cyber, sistema de rankings e recursos sociais.'
    },
    {
      q: 'É gratuito?',
      a: 'Sim! O Compile & Chill é 100% gratuito. Não há planos pagos ou assinaturas.'
    },
    {
      q: 'Preciso criar uma conta?',
      a: 'Para salvar pontuações e competir em rankings, sim. Você pode fazer login rapidamente com sua conta X (Twitter).'
    },
    {
      q: 'Como funcionam os rankings?',
      a: 'Os rankings são globais e por jogo. Você compete com desenvolvedores do mundo todo. Os rankings são resetados mensalmente para manter a competição justa.'
    },
    {
      q: 'Posso sugerir novos jogos?',
      a: 'Claro! Entre em contato via X (@shuktv) ou Instagram (@hudsonfalcao) com suas sugestões.'
    },
    {
      q: 'O código é open-source?',
      a: 'Em breve! O projeto será disponibilizado como open-source.'
    },
  ] : [
    {
      q: 'What is Compile & Chill?',
      a: 'Compile & Chill is a decompression portal created specifically for developers. It offers 11 custom games with hacker/cyber aesthetics, ranking system, and social features.'
    },
    {
      q: 'Is it free?',
      a: 'Yes! Compile & Chill is 100% free. There are no paid plans or subscriptions.'
    },
    {
      q: 'Do I need to create an account?',
      a: 'To save scores and compete in rankings, yes. You can quickly log in with your X (Twitter) account.'
    },
    {
      q: 'How do rankings work?',
      a: 'Rankings are global and per-game. You compete with developers worldwide. Rankings reset monthly to keep competition fair.'
    },
    {
      q: 'Can I suggest new games?',
      a: 'Of course! Contact us via X (@shuktv) or Instagram (@hudsonfalcao) with your suggestions.'
    },
    {
      q: 'Is the code open-source?',
      a: 'Coming soon! The project will be available as open-source.'
    },
  ]

  return (
    <div style={{ color: theme['--color-text'] }}>
      <h2 className="text-3xl font-bold mb-4">{lang === 'pt' ? 'Perguntas Frequentes' : 'Frequently Asked Questions'}</h2>
      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="p-4 rounded-lg" style={{ backgroundColor: theme['--color-primary'] + '10' }}>
            <h3 className="text-xl font-bold mb-2">{faq.q}</h3>
            <p>{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusContent({ lang, theme }: { lang: 'pt' | 'en'; theme: any }) {
  if (lang === 'pt') {
    return (
      <div style={{ color: theme['--color-text'] }}>
        <h2 className="text-3xl font-bold mb-4">Status do Sistema</h2>
        <p className="mb-6">
          Resumo do status atual do Compile & Chill. Para informações detalhadas, visite a <a href="/status" className="underline">página completa de status</a>.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg" style={{ backgroundColor: theme['--color-primary'] + '20' }}>
            <h3 className="font-bold mb-2">Backend</h3>
            <p className="text-green-400">Operacional</p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: theme['--color-primary'] + '20' }}>
            <h3 className="font-bold mb-2">Banco de Dados</h3>
            <p className="text-green-400">Operacional</p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: theme['--color-primary'] + '20' }}>
            <h3 className="font-bold mb-2">APIs</h3>
            <p className="text-green-400">Operacional</p>
          </div>
        </div>

        <p className="text-sm opacity-80">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>
    )
  }

  return (
    <div style={{ color: theme['--color-text'] }}>
      <h2 className="text-3xl font-bold mb-4">System Status</h2>
      <p className="mb-6">
        Summary of Compile & Chill's current status. For detailed information, visit the <a href="/status" className="underline">full status page</a>.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg" style={{ backgroundColor: theme['--color-primary'] + '20' }}>
          <h3 className="font-bold mb-2">Backend</h3>
          <p className="text-green-400">Operational</p>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: theme['--color-primary'] + '20' }}>
          <h3 className="font-bold mb-2">Database</h3>
          <p className="text-green-400">Operational</p>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: theme['--color-primary'] + '20' }}>
          <h3 className="font-bold mb-2">APIs</h3>
          <p className="text-green-400">Operational</p>
        </div>
      </div>

      <p className="text-sm opacity-80">
        Last update: {new Date().toLocaleDateString('en-US')}
      </p>
    </div>
  )
}

