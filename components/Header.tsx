"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { LoginButton } from "./LoginButton"
import { ProfileButton } from "./ProfileButton"
import { ThemeSwitcher } from "./ThemeSwitcher"

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header
      className="
        fixed top-0 left-0 right-0
        z-50
        bg-page-secondary/80
        backdrop-blur-sm
        border-b border-border
        shadow-sm
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/logo.png"
              alt="Compile & Chill"
              width={32}
              height={32}
              className="rounded"
              priority
            />
            <h1 className="text-xl font-bold text-text hidden sm:block font-theme">
              Compile & Chill
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-text-secondary hover:text-text transition-colors"
            >
              Home
            </Link>
            <Link
              href="/jogos"
              className="text-sm font-medium text-text-secondary hover:text-text transition-colors"
            >
              Jogos
            </Link>
            <Link
              href="/sobre"
              className="text-sm font-medium text-text-secondary hover:text-text transition-colors"
            >
              Sobre
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-text-secondary hover:text-text transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/ranking"
              className="text-sm font-medium text-text-secondary hover:text-text transition-colors"
            >
              Ranking
            </Link>
            {session && (
              <Link
                href="/profile"
                className="text-sm font-medium text-text-secondary hover:text-text transition-colors"
              >
                Perfil
              </Link>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            {status === "loading" ? (
              <div className="w-20 h-8 bg-page rounded-lg animate-pulse" />
            ) : session ? (
              <ProfileButton session={session} />
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

