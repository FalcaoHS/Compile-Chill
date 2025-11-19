/**
 * Popup-based authentication utility
 * 
 * Opens OAuth providers in a popup window and handles the callback
 * to close the popup and update the parent window.
 */

interface PopupAuthOptions {
  provider: "twitter" | "google"
  callbackUrl?: string
}

/**
 * Open OAuth provider in popup and handle callback
 * 
 * @param options - Authentication options
 * @returns Promise that resolves when authentication completes
 */
export async function signInWithPopup({
  provider,
  callbackUrl = "/",
}: PopupAuthOptions): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    // Generate a unique ID for this popup session
    const popupId = `auth-popup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Build the sign-in URL
    // Pass popupId in the callback URL so the popup can access it
    const baseUrl = window.location.origin
    const callbackUrlWithPopup = `${baseUrl}/api/auth/callback?callbackUrl=${encodeURIComponent(callbackUrl)}&popupId=${popupId}`
    const signInUrl = `${baseUrl}/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent(callbackUrlWithPopup)}`

    // Calculate popup dimensions (centered on screen)
    const width = 600
    const height = 700
    const left = window.screen.width / 2 - width / 2
    const top = window.screen.height / 2 - height / 2

    // Open popup window
    const popup = window.open(
      signInUrl,
      "auth-popup",
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
    )

    if (!popup) {
      resolve({
        success: false,
        error: "Popup bloqueado. Por favor, permita popups para este site.",
      })
      return
    }

    let resolved = false

    // Listen for messages from popup
    const messageHandler = (event: MessageEvent) => {
      // Security: Only accept messages from same origin
      if (event.origin !== window.location.origin) {
        return
      }

      // Check if this message is for this popup session
      if (event.data.type === "auth-popup-callback" && event.data.popupId === popupId) {
        if (resolved) return
        resolved = true

        // Remove listener
        window.removeEventListener("message", messageHandler)

        // Close popup if still open
        if (!popup.closed) {
          popup.close()
        }

        // Resolve promise
        if (event.data.success) {
          resolve({ success: true })
          // Reload page to update session
          window.location.reload()
        } else {
          resolve({
            success: false,
            error: event.data.error || "Falha na autenticação",
          })
        }
      }
    }

    window.addEventListener("message", messageHandler)

    // Check if popup was closed manually (before receiving message)
    const checkClosed = setInterval(() => {
      if (popup.closed && !resolved) {
        resolved = true
        clearInterval(checkClosed)
        window.removeEventListener("message", messageHandler)
        resolve({
          success: false,
          error: "Autenticação cancelada",
        })
      }
    }, 500)

    // Cleanup after 5 minutes (timeout)
    setTimeout(() => {
      if (!resolved && !popup.closed) {
        resolved = true
        popup.close()
        clearInterval(checkClosed)
        window.removeEventListener("message", messageHandler)
        resolve({
          success: false,
          error: "Tempo de autenticação expirado",
        })
      }
    }, 5 * 60 * 1000)
  })
}

/**
 * Send message to parent window (called from popup after auth)
 * 
 * @param success - Whether authentication was successful
 * @param error - Error message if authentication failed
 * @param popupId - The popup ID to match with parent window
 */
export function notifyParentWindow(success: boolean, error: string | undefined, popupId: string) {
  if (popupId && window.opener) {
    window.opener.postMessage(
      {
        type: "auth-popup-callback",
        popupId,
        success,
        error,
      },
      window.location.origin
    )

    // Close popup after a short delay
    setTimeout(() => {
      window.close()
    }, 500)
  }
}

