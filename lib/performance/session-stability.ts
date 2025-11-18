/**
 * Session Stability System
 * 
 * Proactive session renewal and expiry warnings.
 */

import { Session } from 'next-auth'
import { showToast } from '@/components/Toast'
import { logSessionRenewal } from './light-logging'
import { processAllPendingScores } from './safe-score'

const RENEWAL_THRESHOLD_MS = 24 * 60 * 60 * 1000 // 24 hours
const WARNING_THRESHOLD_MS = 2 * 60 * 1000 // 2 minutes
const CHECK_INTERVAL_MS = 30 * 1000 // Check every 30 seconds

let sessionCheckInterval: NodeJS.Timeout | null = null
let lastWarningTime = 0
const WARNING_COOLDOWN_MS = 5 * 60 * 1000 // Don't show warning more than once per 5 minutes

/**
 * Check session and handle renewal/warnings
 */
export function checkSession(session: Session | null): void {
  if (!session?.expires) return

  const now = Date.now()
  const expiresAt = new Date(session.expires).getTime()
  const timeUntilExpiry = expiresAt - now

  // Proactive renewal: if session expires in less than 24h
  if (timeUntilExpiry < RENEWAL_THRESHOLD_MS && timeUntilExpiry > 0) {
    attemptProactiveRenewal()
  }

  // Warning: if session expires in less than 2 minutes
  if (timeUntilExpiry < WARNING_THRESHOLD_MS && timeUntilExpiry > 0) {
    const timeSinceLastWarning = now - lastWarningTime
    if (timeSinceLastWarning > WARNING_COOLDOWN_MS) {
      showSessionExpiryWarning()
      lastWarningTime = now
    }
  }
}

/**
 * Attempt proactive session renewal
 */
async function attemptProactiveRenewal(): Promise<void> {
  try {
    // Try to refresh session by making a request to a protected endpoint
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      credentials: 'include',
    })

    if (response.ok) {
      logSessionRenewal(true)
      // Retry pending scores after renewal
      await processAllPendingScores()
    } else {
      logSessionRenewal(false)
    }
  } catch (error) {
    console.error('Session renewal error:', error)
    logSessionRenewal(false)
  }
}

/**
 * Show session expiry warning
 */
function showSessionExpiryWarning(): void {
  showToast(
    'Sua sessão expirará em breve. Seu score está seguro e será enviado automaticamente quando você fizer login.',
    'warning',
    10000 // 10 seconds
  )
}

/**
 * Start session monitoring
 */
export function startSessionMonitoring(session: Session | null): void {
  stopSessionMonitoring()
  
  if (!session) return

  // Check immediately
  checkSession(session)

  // Check periodically
  sessionCheckInterval = setInterval(() => {
    // Get current session from window (if available)
    // In a real implementation, you'd get this from useSession hook
    checkSession(session)
  }, CHECK_INTERVAL_MS)
}

/**
 * Stop session monitoring
 */
export function stopSessionMonitoring(): void {
  if (sessionCheckInterval) {
    clearInterval(sessionCheckInterval)
    sessionCheckInterval = null
  }
}

