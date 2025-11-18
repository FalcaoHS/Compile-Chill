'use client'

import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border mt-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="font-bold mb-3 text-text">Compile & Chill</h3>
            <p className="text-sm text-text-secondary mb-4">
              Portal de descompressão feito de dev para devs.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-text">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sobre" className="text-text-secondary hover:text-text transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-text-secondary hover:text-text transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/jogos" className="text-text-secondary hover:text-text transition-colors">
                  Jogos
                </Link>
              </li>
              <li>
                <Link href="/ranking" className="text-text-secondary hover:text-text transition-colors">
                  Ranking
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-text">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacidade" className="text-text-secondary hover:text-text transition-colors">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-text-secondary hover:text-text transition-colors">
                  Termos
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-text-secondary hover:text-text transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-text-secondary hover:text-text transition-colors">
                  Status
                </Link>
              </li>
              <li>
                <Link href="/press-kit" className="text-text-secondary hover:text-text transition-colors">
                  Press Kit
                </Link>
              </li>
              <li>
                <Link href="/brand" className="text-text-secondary hover:text-text transition-colors">
                  Brand
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-sm text-text-secondary">
          <p>
            © {currentYear} Compile & Chill. Feito com ❤️ por{' '}
            <a
              href="https://x.com/shuktv"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text transition-colors underline"
            >
              @shuktv
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

