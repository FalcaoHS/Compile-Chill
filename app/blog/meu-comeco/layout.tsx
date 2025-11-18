import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'A história do Hudson "Shuk" Falcão: de 1998 ao Compile & Chill',
  description: 'Uma jornada de mais de 20 anos em TI, passando por altos e baixos, até chegar na criação do Compile & Chill.',
  keywords: ['história', 'jornada', 'desenvolvimento', 'Hudson Falcão', 'Shuk'],
  openGraph: {
    title: 'A história do Hudson "Shuk" Falcão: de 1998 ao Compile & Chill',
    description: 'Uma jornada de mais de 20 anos em TI até o Compile & Chill.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: '/blog/meu-comeco',
  },
}

export default function MeuComecoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

