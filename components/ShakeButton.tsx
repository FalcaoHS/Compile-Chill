"use client"

import { useThemeStore } from "@/lib/theme-store"
import { useEffect, useRef } from "react"

interface ShakeButtonProps {
  onShake: () => void
}

export function ShakeButton({ onShake }: ShakeButtonProps) {
  const { theme } = useThemeStore()
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Map theme IDs to CSS class names
  const getThemeClass = (themeId: string) => {
    const themeMap: Record<string, string> = {
      'analista-jr': "shake-button--analista-jr",
      'analista-sr': "shake-button--analista-sr",
      cyber: "shake-button--cyber",
      neon: "shake-button--neon",
      pixel: "shake-button--pixel",
      terminal: "shake-button--terminal",
      blueprint: "shake-button--blueprint",
      'bruno-csharp': "shake-button--bruno-csharp",
    }
    return themeMap[themeId] || "shake-button--cyber"
  }

  return (
    <button
      ref={buttonRef}
      className={`shake-button ${getThemeClass(theme)}`}
      onClick={onShake}
      aria-label="Shake orbs"
    >
      SHAKE
    </button>
  )
}

