"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"

interface EmailLoginFormProps {
  className?: string
  onSuccess?: () => void
}

export function EmailLoginForm({
  className = "",
  onSuccess,
}: EmailLoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const validateForm = (): boolean => {
    let isValid = true

    // Validate email
    if (!email) {
      setEmailError("Email é obrigatório")
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Formato de email inválido")
      isValid = false
    } else {
      setEmailError(null)
    }

    // Validate password
    if (!password) {
      setPasswordError("Senha é obrigatória")
      isValid = false
    } else if (password.length < 6) {
      setPasswordError("Senha deve ter no mínimo 6 caracteres")
      isValid = false
    } else if (password.length > 100) {
      setPasswordError("Senha deve ter no máximo 100 caracteres")
      isValid = false
    } else {
      setPasswordError(null)
    }

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        rememberMe,
        redirect: false,
      })

      if (result?.error) {
        setError("Email ou senha incorretos")
      } else if (result?.ok) {
        // Success - NextAuth will handle redirect
        if (onSuccess) {
          onSuccess()
        } else {
          window.location.href = "/"
        }
      }
    } catch (err) {
      setError("Não foi possível fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-4 ${className}`}
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-text-secondary"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setEmailError(null)
          }}
          disabled={isLoading}
          className={`
            px-4 py-2 rounded-lg
            bg-page border
            text-text
            focus:outline-none focus:ring-2 focus:ring-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${emailError ? "border-red-500" : "border-border"}
          `}
          placeholder="seu@email.com"
          aria-invalid={!!emailError}
          aria-describedby={emailError ? "email-error" : undefined}
        />
        {emailError && (
          <p
            id="email-error"
            className="text-sm text-red-500"
            role="alert"
          >
            {emailError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-text-secondary"
        >
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setPasswordError(null)
          }}
          disabled={isLoading}
          className={`
            px-4 py-2 rounded-lg
            bg-page border
            text-text
            focus:outline-none focus:ring-2 focus:ring-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${passwordError ? "border-red-500" : "border-border"}
          `}
          placeholder="••••••••"
          aria-invalid={!!passwordError}
          aria-describedby={passwordError ? "password-error" : undefined}
        />
        {passwordError && (
          <p
            id="password-error"
            className="text-sm text-red-500"
            role="alert"
          >
            {passwordError}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="rememberMe"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          disabled={isLoading}
          className="
            w-4 h-4
            rounded
            border-border
            bg-page
            text-primary
            focus:ring-2 focus:ring-primary
            disabled:opacity-50
          "
        />
        <label
          htmlFor="rememberMe"
          className="text-sm text-text-secondary cursor-pointer"
        >
          Permanecer logado
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-500" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="
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
          flex items-center justify-center gap-2
        "
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <span
              className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            />
            <span>Entrando…</span>
          </>
        ) : (
          <span>Entrar</span>
        )}
      </button>

      <p className="text-xs text-text-secondary text-center">
        Não tem conta?{" "}
        <Link
          href="/signup"
          className="text-primary hover:text-primary-hover underline"
        >
          Criar conta
        </Link>
      </p>
    </form>
  )
}

