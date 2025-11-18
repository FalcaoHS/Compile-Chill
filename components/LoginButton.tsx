"use client"

import { signIn } from "next-auth/react"
import { useState, useEffect } from "react"

interface LoginButtonProps {
  variant?: "default" | "prominent"
  className?: string
}

export function LoginButton({ variant = "default", className = "" }: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check for authentication error in URL
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get("error")
    if (errorParam === "auth_failed") {
      setError("Não foi possível fazer login. Tente novamente.")
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname)
    }
  }, [])

  const handleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      await signIn("twitter", {
        callbackUrl: "/",
      })
    } catch (err) {
      setError("Não foi possível fazer login. Tente novamente.")
      setIsLoading(false)
    }
  }

  const baseStyles = `
    inline-flex items-center justify-center gap-2
    px-4 py-2 rounded-lg
    font-medium text-sm
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    bg-primary text-page
    hover:bg-primary-hover
    focus:ring-primary
    active:scale-95
    shadow-glow-sm
  `

  const prominentStyles = variant === "prominent" ? `
    px-6 py-3 text-base
    shadow-lg
  ` : ""

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <button
        onClick={handleSignIn}
        disabled={isLoading}
        className={`${baseStyles} ${prominentStyles}`}
        aria-label="Entrar com X"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            <span>Conectando…</span>
          </>
        ) : (
          <span>Entrar com X</span>
        )}
      </button>
      {error && (
        <p className="text-sm text-red-500" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  )
}

