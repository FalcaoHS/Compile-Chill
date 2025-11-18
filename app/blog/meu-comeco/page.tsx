'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-3 py-1 rounded text-sm transition-all hover:opacity-80"
      style={{
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-bg)',
      }}
      title="Copiar email"
    >
      {copied ? '✓ Copiado!' : '📋 Copiar'}
    </button>
  )
}

export default function MeuComecoPage() {
  return (
    <article className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="inline-block mb-6 text-sm hover:underline" style={{ color: 'var(--color-primary)' }}>
          ← Voltar ao blog
        </Link>

        <header className="mb-8">
          <time className="text-sm opacity-60" style={{ color: 'var(--color-text-secondary)' }}>
            18 de novembro de 2025
          </time>
          <h1 className="text-4xl font-bold mt-2 mb-4" style={{ color: 'var(--color-text)' }}>
            A história do Hudson "Shuk" Falcão: de 1998 ao Compile & Chill
          </h1>
        </header>

        <div style={{ color: 'var(--color-text)' }} className="space-y-6 text-base leading-relaxed">
          <p>
            Oi, dessa vez sou eu mesmo escrevendo e não a IA.<br />
            Vou contar uma história aqui pra vocês rapidinho.
          </p>

          <p>
            Eu comecei a trabalhar com TI em 1998, com apenas 17 anos. Fui migrando de área até chegar no desenvolvimento em 2002.<br />
            Eu, com 21 anos, era Homologador de Software e fazia empacotamento de Aplicativos que eram instalados para os usuários diretamente no login, através da Rede Novell. Lá fiz diversos trabalhos, como participar de projetos gigantes, como o GENASV2 — um projeto que migrou um parque de 3800 máquinas do Windows 95 para o Windows Professional. Nesse processo, eu implementei, configurei e criei pacotes de aplicações a serem instalados pelo Script Logic, uma ferramenta que basicamente instalava tudo no primeiro login.
          </p>

          <p>
            Passei anos na área, mas sempre tendo meus altos e baixos devido aos problemas que tenho das ideias rs…
          </p>

          <p>
            Em 2019, quando terminei um relacionamento e morava sozinho, eu entrei em surto e ferrei com toda a minha vida financeira. Fazia lives na Twitch jogando (comecei em 2014 como hobby) e essas lives salvaram a minha vida, por conta de pessoas maravilhosas que eu esbarrei no caminho e que me ajudaram muito com conversas, apoio financeiro, acolhimento, entre outras coisas.
          </p>

          <p>
            Eu tenho uma memória espetacularmente irritante, pois lembro de tudo da minha vida claramente — e com as lembranças vêm também as sensações (sim, sou um cara extremamente sensível, papo de sentir dor física). Talvez seja algum probleminha aí que eu devo ter.
          </p>

          <p>
            Então vou resumir pra não me alongar: depois de 5 anos parado, eu fui internado por conta de uma fístula na virilha. Quando estava pra receber alta, um ex-chefe me ligou dizendo que precisava de mim para trabalhar. Eu ainda estava inseguro, mas não aguentava mais ter que pedir dinheiro emprestado — dinheiro pra comer, pra luz, internet — e aceitei a proposta que ele podia me oferecer. Ganho bem pouco ainda, mas mesmo assim ele me ajudou muito.<br />
            Mas eu cansei de viver o sonho dos outros. Talvez esse aqui seja aquele sistema queridinho que talvez nem me renda nada, mas enquanto eu puder, manterei ele no ar.
          </p>

          <p>
            Mês passado eu tive um BOOOM de energia e a minha mente, depois de anos na depressão, voltou a funcionar.<br />
            Sério gente, eu não conseguia calcular 2+2 de forma rápida. Eu estava literalmente BURRO cognitivamente falando. Hoje, com a criatividade aflorando cada vez mais, com experiência na parte de segurança de software, com experiência na usabilidade de sistemas (eu sei o que é chato, eu sei o que é ruim quando abro a tela e me vejo perdido, sei quando não tá bom), eu vi nas LLMs a oportunidade de criar tudo que sempre quis criar — pra mim e por mim.
          </p>

          <p>
            Foram 3 MVPs sensacionais em menos de 1 mês:<br />
            ReactZone.com.br, BanheiroUrgente.app, Taroom (não vou levar à frente, foi uma experiência apenas), Poupancinha…<br />
            E hoje (18/11/2025), depois de quase 20 horas virado, estou lançando aqui pra vocês o meu 5º MVP feito em um dia.
          </p>

          <p>
            Acreditem: tem muita atenção, carinho, percepção e mais — feito por amor.
          </p>

          <p>
            Espero que se divirtam. Espero que se sintam descomprimidos após um tempinho no site, e a ideia é ESSA: criar um local para nós DEVs dividirmos experiências, darmos risadas e, principalmente, nos sentirmos acolhidos.
          </p>

          <p>
            AH… fazer network também ;P
          </p>

          <p>
            Fiz o projeto sem dormir, estou há mais de 35 horas acordado. São agora 17:29 de 18/11/2025.
          </p>

          <p>
            E eu juro pra vocês: o incentivo maior foi todo o carinho e reconhecimento que deram pelos trabalhos que compartilhei aqui com vocês.
          </p>

          <p>
            Vi que já estou inspirando gente a desenvolver seus próprios apps — e pra quem se achava esquecido pelo mundo (sim, a depressão tirou todos os meus amigos), graças a DEUS eu tenho meu filho.<br />
            Ele me mostrou o quanto eu de fato tenho capacidade de fazer algo muito legal, útil e — não menos importante — da forma correta.
          </p>

          <p>
            Então é isso. Contei um pouco sobre mim e, sério, espero muito que curtam… porque eu gastei meu almoço todo do resto do mês assinando IA pra fazer algo majestoso ao meu ver.
          </p>

          <p>
            Divirtam-se e descomprimam…
          </p>

          <p>
            Abraços,<br />
            Hudson "Shuk" Falcão (Analista de Sistemas Sr.)
          </p>

          <p>
            Eu vou ser bem sincero com vocês (necessidade apenas):<br />
            Eu gastei mais de 600 reais esse mês — duas assinaturas do Cursor, assinatura do Canvas, assinatura do GPT, assinatura do Gemini… Todos esses caras foram envolvidos no processo de idealização, definição, criação e desenvolvimento, com prompts rabiscados e sempre com um pinguinho a mais de toda experiência que tenho como DEV.<br />
            Lembra que eu lembro de tudo? Nesse ponto ajuda.
          </p>

          <p>
            Então… se quiserem me pagar um café ou uma quentinha pra me ajudar, meu pix é:
          </p>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-lg">📧</span>
            <span className="font-mono text-lg">falcaoh@gmail.com</span>
            <CopyEmailButton email="falcaoh@gmail.com" />
          </div>

          <p>
            Se você leu até aqui:
          </p>

          <p>
            Acredite em você. Lute. Corra atrás.<br />
            As IAs estão aí pra te ajudar a pôr em prática suas ideias — e eu tenho sido a prova disso.
          </p>

          <p>
            Obrigado, gente, por me acolher, me incentivar e elogiar o meu esforço.<br />
            Moro sozinho e sinto tudo — lembra que comentei ali em cima? É isso.
          </p>

          <p>
            Precisando de dicas, sugestões, querendo tirar dúvidas, me manda um direct no X (@shuktv) ou no Instagram (@hudsonfalcao).
          </p>

          <p>
            Compile & Chill — feito de DEV pra DEVs, com muito amor e descompressão.
          </p>

          <p>
            ME SEGUE, porque o backlog tá grande viu… e cheio de coisas legais.
          </p>

          {/* Foto no final */}
          <div className="mt-12 mb-8 flex flex-col items-center">
            <Image
              src="/itsme.png"
              alt="Hudson Shuk Falcão e Jubti"
              width={300}
              height={225}
              className="rounded-lg w-auto max-w-full h-auto shadow-lg"
              style={{
                border: '2px solid var(--color-primary)',
                maxWidth: '250px',
              }}
              priority
            />
            <p className="text-center mt-4 text-lg font-medium" style={{ color: 'var(--color-text)' }}>
              Eu e meu melhor amigo, o Jubti
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
