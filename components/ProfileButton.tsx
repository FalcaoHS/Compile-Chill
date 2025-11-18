"use client"

import { signOut } from "next-auth/react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Session } from "next-auth"

interface ProfileButtonProps {
  session: Session
  className?: string
}

export function ProfileButton({ session, className = "" }: ProfileButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const handleSignOut = async () => {
    setIsOpen(false)
    await signOut({ callbackUrl: "/" })
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      toggleDropdown()
    }
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        className="
          inline-flex items-center gap-2
          px-3 py-2 rounded-lg
          font-medium text-sm
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2
          bg-primary text-page
          hover:bg-primary-hover
          focus:ring-primary
          active:scale-95
          shadow-glow-sm
        "
        aria-label="Menu do perfil"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* ⚠️ ATENÇÃO: AVATAR - session.user.image vem do callback de sessão
            Se o avatar sumir, verificar auth.config.ts session callback primeiro!
            O image deve sempre estar definido (mesmo que null) na sessão. */}
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || "Avatar"}
            width={32}
            height={32}
            className="w-8 h-8 rounded"
            unoptimized
          />
        ) : (
          <div className="w-8 h-8 rounded bg-gray-600 flex items-center justify-center">
            <span className="text-white text-xs">
              {session.user?.name?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
        )}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="
            absolute right-0 mt-2 w-48
            bg-page-secondary
            rounded-lg shadow-glow
            border border-border
            z-50
            transition-all duration-200 ease-in-out
          "
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            <div className="px-4 py-2 border-b border-border">
              <p className="text-sm font-medium text-text">
                {session.user?.name || "Usuário"}
              </p>
              {session.user?.email && (
                <p className="text-xs text-text-secondary truncate">
                  {session.user.email}
                </p>
              )}
            </div>
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="
                block
                w-full text-left
                px-4 py-2 text-sm
                text-text-secondary
                hover:bg-page
                focus:outline-none focus:bg-page
                transition-colors duration-150
              "
              role="menuitem"
            >
              Meu Perfil
            </Link>
            <button
              onClick={handleSignOut}
              className="
                w-full text-left
                px-4 py-2 text-sm
                text-text-secondary
                hover:bg-page
                focus:outline-none focus:bg-page
                transition-colors duration-150
                first:rounded-t-lg last:rounded-b-lg
              "
              role="menuitem"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

