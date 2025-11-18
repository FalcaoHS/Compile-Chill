"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { useThemeStore } from "@/lib/theme-store"
import { THEMES, getAllThemeIds, type ThemeId } from "@/lib/themes"

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme, syncWithDatabase } = useThemeStore()
  const { data: session } = useSession()

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

  // Keyboard shortcut: T key to open switcher
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 't' || event.key === 'T') {
        // Only open if not typing in an input
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
          return
        }
        event.preventDefault()
        setIsOpen(!isOpen)
      }
    }

    document.addEventListener("keydown", handleKeyPress)
    return () => {
      document.removeEventListener("keydown", handleKeyPress)
    }
  }, [isOpen])

  const handleThemeSelect = async (themeId: ThemeId) => {
    setTheme(themeId)
    setIsOpen(false)
    
    // Sync with database if authenticated (debounced)
    if (session?.user) {
      syncWithDatabase(themeId)
    }
  }

  const handleSaveToProfile = async () => {
    if (session?.user) {
      await syncWithDatabase(theme)
      setIsOpen(false)
    }
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

  const themeIds = getAllThemeIds()

  return (
    <div className={`relative ${isOpen ? 'z-50' : ''}`} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        className="
          inline-flex items-center justify-center
          w-10 h-10 rounded-lg
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2
          bg-page-secondary text-text
          hover:bg-primary hover:text-page
          focus:ring-primary
          active:scale-95
        "
        aria-label="Trocar tema"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="
              absolute right-0 mt-2
              bg-page-secondary border border-border
              rounded-lg shadow-glow-lg
              p-4
              min-w-[280px]
            "
            role="menu"
            aria-orientation="vertical"
          >
            <div className="grid grid-cols-3 gap-2 mb-4">
              {themeIds.map((themeId) => {
                const themeData = THEMES[themeId]
                const isActive = theme === themeId
                
                return (
                  <motion.button
                    key={themeId}
                    onClick={() => handleThemeSelect(themeId)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative aspect-square rounded-lg
                      p-2 border-2 transition-all
                      ${isActive 
                        ? 'border-primary shadow-glow' 
                        : 'border-border hover:border-primary-hover'
                      }
                    `}
                    style={{
                      backgroundColor: themeData.vars['--color-bg'],
                      color: themeData.vars['--color-text'],
                    }}
                    role="menuitem"
                    aria-label={`Tema ${themeData.name}`}
                    aria-pressed={isActive}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <div
                        className="w-full h-3 rounded mb-1"
                        style={{
                          backgroundColor: themeData.vars['--color-primary'],
                        }}
                      />
                      <div
                        className="w-2/3 h-1 rounded"
                        style={{
                          backgroundColor: themeData.vars['--color-accent'],
                        }}
                      />
                      <span className="text-[8px] mt-1 font-theme opacity-80">
                        {themeData.name.split(' ')[0]}
                      </span>
                    </div>
                    {isActive && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
                    )}
                  </motion.button>
                )
              })}
            </div>

            {session?.user && (
              <button
                onClick={handleSaveToProfile}
                className="
                  w-full
                  px-4 py-2 text-sm
                  rounded-lg
                  transition-all duration-200
                  bg-primary text-page
                  hover:bg-primary-hover
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  font-medium
                "
                role="menuitem"
              >
                Salvar no perfil
              </button>
            )}

            <div className="mt-2 text-xs text-text-secondary text-center">
              Pressione <kbd className="px-1 py-0.5 bg-page border border-border rounded">T</kbd> para abrir
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

