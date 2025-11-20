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
            Quero que outros aprendam
          </h2>

          <p>
            Quando comecei a programar, tinha muita dificuldade pra entender como as coisas funcionavam de verdade. Código fechado não ensina nada — você só vê o resultado final.
          </p>

          <p>
            Colocando o código aberto, qualquer desenvolvedor pode ver como implementei os jogos, o sistema de temas, a validação de scores, a autenticação. Pode estudar, copiar, adaptar, melhorar. Pode usar como base pra aprender ou até pra criar algo próprio.
          </p>

          <p>
            Especialmente pra quem está começando, ter código real pra estudar faz toda a diferença. Documentação é legal, mas ver o código funcionando é outra coisa.
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

          <h2 className="text-2xl font-bold mt-8 mb-4" style={{ color: 'var(--color-text)' }}>
            Não tenho nada a esconder
          </h2>

          <p>
            O código não é perfeito. Tem gambiarra, tem coisa que podia ser melhor, tem decisão técnica que outro desenvolvedor faria diferente. E tá tudo bem.
          </p>

          <p>
            Mostrar código imperfeito também é importante. Ajuda outros desenvolvedores a verem que não precisa ser perfeito pra funcionar, que dá pra melhorar aos poucos, que todo mundo começa de algum lugar.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4" style={{ color: 'var(--color-text)' }}>
            É sobre acesso
          </h2>

          <p>
            No final das contas, é sobre acesso. Se o código está aberto, qualquer pessoa pode usar, estudar, modificar, distribuir. Não precisa pedir permissão, não precisa pagar, não precisa depender de mim.
          </p>

          <p>
            Pra quem tem recursos limitados, isso faz diferença. Pra quem está aprendendo, isso faz diferença. Pra quem quer criar algo próprio mas não sabe por onde começar, isso faz diferença.
          </p>

          <p>
            Se o objetivo do projeto é levar informação e acesso pra quem precisa, faz todo sentido que o código também seja acessível.
          </p>

          <div className="mt-12 p-6 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)', borderLeft: '4px solid var(--color-primary)' }}>
            <p className="mb-4">
              <strong>Resumindo:</strong> Coloquei como open-source porque aprendi muito com código aberto, quero que outros aprendam também, e porque faz sentido com o propósito do projeto.
            </p>
            <p>
              Não é sobre ser bonzinho ou fazer marketing. É sobre fazer parte de um ciclo que funciona e que ajuda todo mundo a crescer junto.
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

