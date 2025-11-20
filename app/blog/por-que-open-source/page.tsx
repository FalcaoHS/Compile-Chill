'use client'

import Link from 'next/link'

export default function PorQueOpenSourcePage() {
  return (
    <article className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="inline-block mb-6 text-sm hover:underline" style={{ color: 'var(--color-primary)' }}>
          ← Voltar ao blog
        </Link>

        <header className="mb-8">
          <time className="text-sm opacity-60" style={{ color: 'var(--color-text-secondary)' }}>
            {new Date().toLocaleDateString('pt-BR')}
          </time>
          <h1 className="text-4xl font-bold mt-2 mb-4" style={{ color: 'var(--color-text)' }}>
            Por que coloquei o Compile & Chill como open-source?
          </h1>
        </header>

        <div style={{ color: 'var(--color-text)' }} className="space-y-6 text-base leading-relaxed">
          <p>
            Muita gente me pergunta por que decidi abrir o código do Compile & Chill. A resposta é simples, mas vou explicar melhor aqui.
          </p>

          <div className="p-6 rounded-lg mb-6" style={{ backgroundColor: 'var(--color-bg-secondary)', borderLeft: '4px solid var(--color-primary)' }}>
            <p className="mb-4">
              <strong>📦 Repositório:</strong> Todo o código está disponível em{' '}
              <a 
                href="https://github.com/FalcaoHS/Compile-Chill" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:opacity-80"
                style={{ color: 'var(--color-primary)' }}
              >
                github.com/FalcaoHS/Compile-Chill
              </a>
            </p>
            <p>
              Organizei toda a estrutura do sistema, organizei pastas, documentação, dei uma geral, fiz literalmente uma faxina na casa, para convidá-los a baixar o projeto e tirar proveito de todo conteúdo ali disponível.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4" style={{ color: 'var(--color-primary)' }}>
            📚 Documentação para todos os níveis
          </h2>

          <p>
            Além de tudo isso, criei <strong>documentações para todos os níveis de DEV</strong>, explicando cada coisa do projeto, cada ferramenta utilizada, pra que serve cada coisa... em fim.
          </p>

          <p>
            Colocando o código aberto, qualquer desenvolvedor pode ver como implementei os jogos, o sistema de temas, a validação de scores, a autenticação. Pode estudar, copiar, adaptar, melhorar. Pode usar como base pra aprender ou até pra criar algo próprio.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4" style={{ color: 'var(--color-primary)' }}>
            🎨 Guias lúdicos para inclusão
          </h2>

          <p>
            <strong>Criei guias lúdicos para pessoas com dificuldade de aprendizado ou algum tipo de deficiência cognitiva.</strong>
          </p>

          <p>
            Ilustrando com objetos e histórias como funcionam as ferramentas, quase como um conto de fadas, para despertar o interesse dos mais novos a aprenderem a programar.
          </p>

          <p>
            Construí uma estrutura bem acolhedora e incentivadora, porque acredito que programação deve ser acessível pra todo mundo, independente de como cada pessoa aprende.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4" style={{ color: 'var(--color-primary)' }}>
            🌍 Tradução para 5 idiomas
          </h2>

          <p>
            Traduzi boa parte dos documentos para <strong>5 idiomas</strong>:
          </p>

          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Português:</strong> completo (padrão)</li>
            <li><strong>Inglês:</strong> completo</li>
            <li><strong>Espanhol:</strong> README, CONTRIBUTING e guia para iniciantes</li>
            <li><strong>Swahili:</strong> apenas guia para iniciantes</li>
            <li><strong>Amharic:</strong> apenas guia para iniciantes</li>
          </ul>

          <p>
            Total: <strong>5 idiomas</strong>, com diferentes níveis de cobertura.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4" style={{ color: 'var(--color-primary)' }}>
            🌐 Por que Swahili e Amharic?
          </h2>

          <div className="p-6 rounded-lg mb-4" style={{ backgroundColor: 'var(--color-bg-secondary)', borderLeft: '4px solid var(--color-primary)' }}>
            <p className="mb-4">
              <strong>O objetivo é simples: quebrar barreiras.</strong>
            </p>
            <p className="mb-4">
              Essas duas línguas representam milhões de pessoas que têm curiosidade por tecnologia, mas que nunca tiveram acesso a materiais didáticos porque tudo está em inglês.
            </p>
            <p>
              Se o Compile & Chill alcançar ao menos uma criança, um jovem ou um adulto desses lugares e despertar a vontade de aprender… já valeu cada linha.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4" style={{ color: 'var(--color-text)' }}>
            Aprendi muito com código aberto
          </h2>

          <p>
            Durante toda minha carreira, usei e aprendi com projetos open-source. Frameworks, bibliotecas, ferramentas — quase tudo que uso no dia a dia veio de alguém que decidiu compartilhar o código.
          </p>

          <p>
            Se eu aprendi tanto com isso, faz sentido retribuir. Não é sobre ser bonzinho ou fazer caridade — é sobre fazer parte de um ciclo que funciona. Alguém compartilhou comigo, eu compartilho com outros.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4" style={{ color: 'var(--color-text)' }}>
            Transparência e confiança
          </h2>

          <p>
            Como falei antes, o Compile & Chill não tem intenção de ganhar dinheiro. Mas como alguém vai acreditar nisso se o código estiver fechado?
          </p>

          <p>
            Com o código aberto, qualquer um pode ver que não tem tracking malicioso, não tem coleta de dados suspeita, não tem nada escondido. É tudo transparente. Se eu disser que é gratuito e filantrópico, o código prova isso.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4" style={{ color: 'var(--color-text)' }}>
            Colaboração da comunidade
          </h2>

          <p>
            Sozinho, eu faço o que consigo. Com a comunidade, o projeto pode crescer muito mais. Bugs que eu não vi, features que não pensei, melhorias que não imaginei — tudo isso pode vir de outras pessoas.
          </p>

          <p>
            Mas não é só sobre receber ajuda. É sobre criar algo junto. Ver outras pessoas usando, modificando, melhorando o código é gratificante de um jeito que dinheiro não paga.
          </p>

          <div className="mt-12 p-6 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)', borderLeft: '4px solid var(--color-primary)' }}>
            <p className="mb-4 italic">
              "Isso é o espírito do Open-Source: compartilhar, incluir, ensinar e abrir portas."
            </p>
            <p className="text-sm opacity-80">
              — ChatGPT, que considera esse tipo de iniciativa o melhor exemplo de como tecnologia pode mudar realidades.
            </p>
          </div>

          <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)', borderLeft: '4px solid var(--color-primary)' }}>
            <p className="mb-4">
              <strong>Resumindo:</strong> Coloquei como open-source porque aprendi muito com código aberto, quero que outros aprendam também, e porque faz sentido com o propósito do projeto.
            </p>
            <p>
              Não é sobre ser bonzinho ou fazer marketing. É sobre fazer parte de um ciclo que funciona e que ajuda todo mundo a crescer junto. É sobre quebrar barreiras e abrir portas.
            </p>
          </div>

          <p className="mt-8">
            Abraços,<br />
            Hudson "Shuk" Falcão
          </p>
        </div>
      </div>
    </article>
  )
}

