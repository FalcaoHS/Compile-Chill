"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { AvatarPicker } from "./AvatarPicker"
import { validateEmail } from "@/lib/email-validation"

interface SignupFormProps {
  className?: string
}

export function SignupForm({ className = "" }: SignupFormProps) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [avatar, setAvatar] = useState<string>("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null)

  const validateForm = async (): Promise<boolean> => {
    let isValid = true

    // Validate name
    if (!name || name.trim().length === 0) {
      setNameError("Nome é obrigatório")
      isValid = false
    } else if (name.trim().length < 2) {
      setNameError("Nome deve ter no mínimo 2 caracteres")
      isValid = false
    } else if (name.trim().length > 100) {
      setNameError("Nome deve ter no máximo 100 caracteres")
      isValid = false
    } else {
      setNameError(null)
    }

    // Validate email
    if (!email) {
      setEmailError("Email é obrigatório")
      isValid = false
    } else {
      const emailValidation = await validateEmail(email)
      if (!emailValidation.isValid) {
        setEmailError(emailValidation.error || "Email inválido")
        isValid = false
      } else {
        setEmailError(null)
      }
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

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError("Confirmação de senha é obrigatória")
      isValid = false
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("As senhas não coincidem")
      isValid = false
    } else {
      setConfirmPasswordError(null)
    }

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const isValid = await validateForm()
    if (!isValid) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          avatar: avatar || null,
          rememberMe,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Não foi possível criar a conta. Tente novamente.")
        return
      }

      // Success - auto-login after signup
      const loginResult = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        rememberMe,
        redirect: false,
      })

      if (loginResult?.error) {
        // Account created but login failed - redirect to login page
        router.push("/?signup=success&login=true")
      } else {
        // Login successful - redirect to home
        router.push("/?signup=success")
      }
    } catch (err) {
      setError("Erro ao criar conta. Tente novamente.")
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
          htmlFor="name"
          className="text-sm font-medium text-text-secondary"
        >
          Nome
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setNameError(null)
          }}
          disabled={isLoading}
          className={`
            px-4 py-2 rounded-lg
            bg-page border
            text-text
            focus:outline-none focus:ring-2 focus:ring-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${nameError ? "border-red-500" : "border-border"}
          `}
          placeholder="Seu nome"
          aria-invalid={!!nameError}
          aria-describedby={nameError ? "name-error" : undefined}
        />
        {nameError && (
          <p
            id="name-error"
            className="text-sm text-red-500"
            role="alert"
          >
            {nameError}
          </p>
        )}
      </div>

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
        <p className="text-xs text-text-secondary">
          Mínimo 6 caracteres, máximo 100 caracteres
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-text-secondary"
        >
          Confirmar Senha
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            setConfirmPasswordError(null)
          }}
          disabled={isLoading}
          className={`
            px-4 py-2 rounded-lg
            bg-page border
            text-text
            focus:outline-none focus:ring-2 focus:ring-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${confirmPasswordError ? "border-red-500" : "border-border"}
          `}
          placeholder="••••••••"
          aria-invalid={!!confirmPasswordError}
          aria-describedby={
            confirmPasswordError ? "confirm-password-error" : undefined
          }
        />
        {confirmPasswordError && (
          <p
            id="confirm-password-error"
            className="text-sm text-red-500"
            role="alert"
          >
            {confirmPasswordError}
          </p>
        )}
      </div>

      <AvatarPicker value={avatar} onChange={setAvatar} />

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
            <span>Criando conta…</span>
          </>
        ) : (
          <span>Criar Conta</span>
        )}
      </button>

      <p className="text-xs text-text-secondary text-center">
        Já tem conta?{" "}
        <Link
          href="/"
          className="text-primary hover:text-primary-hover underline"
        >
          Fazer login
        </Link>
      </p>
    </form>
  )
}

