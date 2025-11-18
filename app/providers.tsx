"use client"

import { SessionProvider } from "next-auth/react"
import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/ThemeProvider"
import { MobileModeInitializer } from "@/components/MobileModeInitializer"
import { ToastProvider } from "@/components/ToastProvider"
import { MultiTabInitializer } from "@/components/MultiTabInitializer"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <MobileModeInitializer />
        <MultiTabInitializer />
        <ToastProvider />
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}

