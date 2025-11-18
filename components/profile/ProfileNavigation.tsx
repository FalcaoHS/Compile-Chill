"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"

interface ProfileNavigationProps {
  isOwnProfile?: boolean
}

export function ProfileNavigation({ isOwnProfile = false }: ProfileNavigationProps) {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Voltar", icon: "←" },
    { href: "/", label: "Jogos", icon: "🎮" },
    { href: "/ranking", label: "Ranking", icon: "🏆" },
  ]

  // Add Settings only for own profile
  if (isOwnProfile) {
    navItems.push({ href: "/profile", label: "Configurações", icon: "⚙️" })
  }

  return (
    <nav className="mb-8">
      <div className="
        flex flex-wrap items-center gap-2 sm:gap-4
        p-4
        bg-page-secondary
        border border-border
        rounded-lg
      ">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={`${item.href}-${item.label}-${index}`}
              href={item.href}
              className={`
                inline-flex items-center gap-2
                px-4 py-2
                rounded-lg
                text-sm font-medium
                transition-all duration-200
                ${
                  isActive
                    ? "bg-primary text-page shadow-glow-sm"
                    : "bg-page text-text hover:bg-page-secondary hover:border-primary border border-transparent"
                }
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              `}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
        
        {/* Theme Switcher */}
        <div className="ml-auto">
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  )
}

