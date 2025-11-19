"use client"

import { useThemeStore } from "@/lib/theme-store"
import { useEffect, useRef, useState } from "react"

interface ShakeButtonProps {
  onShake: () => void
}

const STORAGE_KEY = "compilechill_shake_button_used"

export function ShakeButton({ onShake }: ShakeButtonProps) {
  const { theme } = useThemeStore()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [showHint, setShowHint] = useState(false)

  // Check if user has used the button before
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasUsed = localStorage.getItem(STORAGE_KEY)
      if (!hasUsed) {
        setShowHint(true)
      }
    }
  }, [])

  const handleClick = () => {
    // Mark as used in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "true")
    }
    setShowHint(false)
    onShake()
  }

  // Map theme IDs to CSS class names
  const getThemeClass = (themeId: string) => {
    const themeMap: Record<string, string> = {
      'analista-jr': "shake-button--analista-jr",
      'analista-sr': "shake-button--analista-sr",
      'lofi-code': "shake-button--lofi-code",
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
    <>
      <button
        ref={buttonRef}
        className={`shake-button ${getThemeClass(theme)}`}
        onClick={handleClick}
        aria-label="Shake orbs"
      >
        SHAKE
      </button>
      {showHint && (
        <div className="fixed bottom-24 pointer-events-none animate-bounce z-[999]" style={{ right: '0', transform: 'translateY(-100%)', marginBottom: '2px', paddingRight: '36px', display: 'flex', justifyContent: 'center' }}>
          <div className="flex flex-col items-end gap-1" style={{ width: '100%', maxWidth: 'calc(100vw - 36px)' }}>
            <div className="text-xs text-text-secondary bg-page-secondary px-2 py-1 rounded border border-border whitespace-nowrap">
              Experimente!
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <span className="text-2xl" style={{ marginTop: '-4px' }}>👇</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

