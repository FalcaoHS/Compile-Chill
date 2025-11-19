"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AvatarPicker } from "@/components/auth/AvatarPicker"
import { encrypt } from "@/lib/encryption"

export default function SetupProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [displayName, setDisplayName] = useState("")
  const [avatar, setAvatar] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)

  // Redirect if not authenticated or not a new Google user
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
      return
    }

    // Check if user already has a name set (not a new Google user)
    if (session?.user?.name && status === "authenticated") {
      // Check if user needs setup by checking URL params or session flag
      const urlParams = new URLSearchParams(window.location.search)
      const needsSetup = urlParams.get("setup") === "true"
      if (!needsSetup) {
        router.push("/")
      }
    }
  }, [session, status, router])

  // Pre-fill display name from session if available
  useEffect(() => {
    if (session?.user?.name && !displayName) {
      setDisplayName(session.user.name)
    }
  }, [session, displayName])

  const validateForm = (): boolean => {
    let isValid = true

    if (!displayName || displayName.trim().length === 0) {
      setNameError("Nome é obrigatório")
      isValid = false
    } else if (displayName.trim().length < 2) {
      setNameError("Nome deve ter no mínimo 2 caracteres")
      isValid = false
    } else if (displayName.trim().length > 100) {
      setNameError("Nome deve ter no máximo 100 caracteres")
      isValid = false
    } else {
      setNameError(null)
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
      // Encrypt the display name
      const encryptedName = encrypt(displayName.trim())

      const response = await fetch("/api/users/setup-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: encryptedName,
          avatar: avatar || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Não foi possível salvar o perfil. Tente novamente.")
        return
      }

      // Success - redirect to home
      router.push("/?profile=setup")
    } catch (err) {
      setError("Erro ao salvar perfil. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page">
        <div className="text-center">
          <div className="text-6xl animate-pulse">🎮</div>
          <p className="text-text-secondary mt-4">Carregando...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null // Will redirect
  }

  const googlePhotoUrl = (session?.user as any)?.image || null

  return (
    <div className="min-h-screen flex items-center justify-center bg-page py-16 px-4">
      <div className="w-full max-w-2xl">
        <div className="bg-page-secondary border border-border rounded-lg p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text mb-2">
              Configurar Perfil
            </h1>
            <p className="text-sm text-text-secondary">
              Escolha um nome de exibição e avatar para seu perfil
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="displayName"
                className="text-sm font-medium text-text-secondary"
              >
                Nome de Exibição
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value)
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
              <p className="text-xs text-text-secondary">
                Este nome será criptografado para sua privacidade
              </p>
            </div>

            <AvatarPicker
              value={avatar}
              onChange={setAvatar}
              googlePhotoUrl={googlePhotoUrl}
            />

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
                  <span>Salvando…</span>
                </>
              ) : (
                <span>Salvar Perfil</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

