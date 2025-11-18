"use client"

import { SessionProvider } from "next-auth/react"
import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/ThemeProvider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  )
}

