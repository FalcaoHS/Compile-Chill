"use client"

import { useState, useRef } from "react"
import { convertImageToBase64, validateImageSize, validateImageType } from "@/lib/avatar"

interface AvatarPickerProps {
  value?: string // Base64 data URI
  onChange: (base64: string) => void
  className?: string
  googlePhotoUrl?: string // Optional Google photo URL
}

// Predefined avatars (placeholder - will be replaced with actual base64 avatars)
const PREDEFINED_AVATARS = [
  { id: "avatar-1", name: "Avatar 1", dataUri: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzdlZjlmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjMDcwOTEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+MTwvdGV4dD48L3N2Zz4=" },
  { id: "avatar-2", name: "Avatar 2", dataUri: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmNmI5ZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjMWExYTJlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+MjwvdGV4dD48L3N2Zz4=" },
  { id: "avatar-3", name: "Avatar 3", dataUri: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzBkNGVmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+MzwvdGV4dD48L3N2Zz4=" },
  { id: "avatar-4", name: "Avatar 4", dataUri: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmYzEwNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjMWExYTJlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+NDwvdGV4dD48L3N2Zz4=" },
  { id: "avatar-5", name: "Avatar 5", dataUri: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzEwYjk4MSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+NTwvdGV4dD48L3N2Zz4=" },
  { id: "avatar-6", name: "Avatar 6", dataUri: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1NzJhMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+NjwvdGV4dD48L3N2Zz4=" },
]

export function AvatarPicker({
  value,
  onChange,
  className = "",
  googlePhotoUrl,
}: AvatarPickerProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(value || null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarSelect = (avatarDataUri: string) => {
    setSelectedAvatar(avatarDataUri)
    onChange(avatarDataUri)
    setUploadError(null)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    // Validate file type
    if (!validateImageType(file)) {
      setUploadError("Tipo de arquivo inválido. Use JPG, PNG ou WEBP.")
      return
    }

    // Validate file size
    const sizeValidation = validateImageSize(file)
    if (!sizeValidation.isValid) {
      setUploadError(sizeValidation.error || "Arquivo muito grande")
      return
    }

    try {
      const base64 = await convertImageToBase64(file)
      setSelectedAvatar(base64)
      onChange(base64)
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "Erro ao processar imagem"
      )
    }
  }

  const handleUseGooglePhoto = async () => {
    if (!googlePhotoUrl) return

    try {
      const { convertImageUrlToBase64 } = await import("@/lib/avatar")
      const base64 = await convertImageUrlToBase64(googlePhotoUrl)
      setSelectedAvatar(base64)
      onChange(base64)
      setUploadError(null)
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "Erro ao carregar foto do Google"
      )
    }
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <label className="text-sm font-medium text-text-secondary">
        Escolha seu Avatar
      </label>

      {/* Google Photo Option (if available) */}
      {googlePhotoUrl && (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleUseGooglePhoto}
            className={`
              px-4 py-3 rounded-lg border-2
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary
              ${
                selectedAvatar?.startsWith("data:image") &&
                !PREDEFINED_AVATARS.some((a) => a.dataUri === selectedAvatar)
                  ? "border-primary bg-primary/10"
                  : "border-border bg-page hover:border-primary/50"
              }
            `}
          >
            <div className="flex items-center gap-3">
              {selectedAvatar &&
                selectedAvatar !== googlePhotoUrl &&
                !PREDEFINED_AVATARS.some(
                  (a) => a.dataUri === selectedAvatar
                ) && (
                  <img
                    src={selectedAvatar}
                    alt="Preview"
                    className="w-12 h-12 rounded object-cover"
                  />
                )}
              {(!selectedAvatar ||
                PREDEFINED_AVATARS.some(
                  (a) => a.dataUri === selectedAvatar
                )) && (
                <img
                  src={googlePhotoUrl}
                  alt="Foto do Google"
                  className="w-12 h-12 rounded object-cover"
                />
              )}
              <span className="text-sm text-text">
                Usar foto do Google
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Predefined Avatars Grid */}
      <div>
        <p className="text-xs text-text-secondary mb-2">
          Ou escolha um avatar pré-definido:
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {PREDEFINED_AVATARS.map((avatar) => (
            <button
              key={avatar.id}
              type="button"
              onClick={() => handleAvatarSelect(avatar.dataUri)}
              className={`
                aspect-square rounded-lg border-2 overflow-hidden
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-primary
                hover:scale-105
                ${
                  selectedAvatar === avatar.dataUri
                    ? "border-primary ring-2 ring-primary"
                    : "border-border hover:border-primary/50"
                }
              `}
              aria-label={avatar.name}
            >
              <img
                src={avatar.dataUri}
                alt={avatar.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Upload Custom Image */}
      <div className="flex flex-col gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileUpload}
          className="hidden"
          aria-label="Upload de imagem personalizada"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="
            px-4 py-2 rounded-lg border border-border
            bg-page text-text-secondary
            hover:border-primary/50 hover:text-text
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary
            text-sm
          "
        >
          Upload de imagem personalizada
        </button>
        <p className="text-xs text-text-secondary">
          Máximo 2MB • JPG, PNG ou WEBP
        </p>
      </div>

      {/* Preview */}
      {selectedAvatar && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-text-secondary">Preview:</p>
          <div className="w-24 h-24 rounded-lg border border-border overflow-hidden">
            <img
              src={selectedAvatar}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {uploadError && (
        <p className="text-sm text-red-500" role="alert" aria-live="polite">
          {uploadError}
        </p>
      )}
    </div>
  )
}

