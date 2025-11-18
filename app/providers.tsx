"use client"

import { SessionProvider } from "next-auth/react"
import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/ThemeProvider"
import { MobileModeInitializer } from "@/components/MobileModeInitializer"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <MobileModeInitializer />
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}

