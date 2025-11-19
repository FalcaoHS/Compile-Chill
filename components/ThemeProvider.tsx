"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useThemeStore } from "@/lib/theme-store"
import { type ThemeId, isValidTheme } from "@/lib/themes"

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, setTheme, init } = useThemeStore()
  const { data: session, status } = useSession()
  const [hasSynced, setHasSynced] = useState(false)

  useEffect(() => {
    // Initialize theme on mount
    init()
  }, [init])

  useEffect(() => {
    // Sync theme from database if user is authenticated
    if (session?.user && status === "authenticated" && !hasSynced) {
      const fetchUserTheme = async () => {
        try {
          const response = await fetch("/api/users/me/theme", {
            credentials: "include",
          })
          if (response.ok) {
            const data = await response.json()
            if (data.theme && isValidTheme(data.theme)) {
              // Override localStorage with database theme
              setTheme(data.theme as ThemeId)
            }
          }
        } catch (error) {
          
        } finally {
          setHasSynced(true)
        }
      }

      fetchUserTheme()
    } else if (status === "unauthenticated") {
      // Reset sync flag when user logs out
      setHasSynced(false)
    }
  }, [session, status, hasSynced, setTheme])

  return <>{children}</>
}

