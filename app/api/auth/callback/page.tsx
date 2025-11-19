"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { notifyParentWindow } from "@/lib/auth-popup"

/**
 * Callback page for popup authentication
 * 
 * This page is shown in the popup after OAuth redirect.
 * It notifies the parent window and closes the popup.
 */
export default function AuthCallbackPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if this is a popup callback by checking URL params and window.opener
    const popupId = searchParams.get("popupId")
    const error = searchParams.get("error")
    const callbackUrl = searchParams.get("callbackUrl") || "/"

    if (popupId && window.opener) {
      // This is a popup - notify parent window
      const success = !error
      notifyParentWindow(success, error || undefined, popupId)
    } else {
      // Not a popup, redirect normally
      window.location.href = callbackUrl
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-page">
      <div className="text-center">
        <div className="text-6xl animate-pulse mb-4">🔐</div>
        <p className="text-text-secondary">Finalizando autenticação...</p>
      </div>
    </div>
  )
}

