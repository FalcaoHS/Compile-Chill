import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre o Compile & Chill',
  description: 'Conheça a história, missão e valores do Compile & Chill. Portal de descompressão feito de dev para devs.',
  keywords: ['sobre', 'história', 'missão', 'manifesto', 'equipe', 'roadmap', 'devlog'],
  openGraph: {
    title: 'Sobre o Compile & Chill',
    description: 'Conheça a história, missão e valores do Compile & Chill.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: '/sobre',
  },
}

export default function SobreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

