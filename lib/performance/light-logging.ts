/**
 * Light Logging System
 * 
 * Anonymous logging of critical performance events and device metrics.
 * All data is anonymized and optional.
 */

export type LogEventType = 
  | 'fps_low'
  | 'canvas_crash'
  | 'score_save_failure'
  | 'multi_tab_warning'
  | 'session_renewal'
  | 'session_renewal_failure'
  | 'session_created'
  | 'session_duplicate_detected'
  | 'session_user_mismatch'
  | 'session_destroyed'

export interface LogEvent {
  type: LogEventType
  timestamp: number
  deviceClass: 'desktop' | 'mobile' | 'tablet'
  sessionDuration?: string // Buckets: <1m, 1-5m, 5-15m, >15m
  metrics?: Record<string, any>
}

/**
 * Get device class
 */
function getDeviceClass(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop'
  
  const width = window.innerWidth
  const ua = navigator.userAgent.toLowerCase()
  
  if (/tablet|ipad|playbook|silk/i.test(ua) || (width >= 768 && width < 1024)) {
    return 'tablet'
  }
  
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua) || width < 768) {
    return 'mobile'
  }
  
  return 'desktop'
}

/**
 * Get session duration bucket
 */
function getSessionDurationBucket(startTime: number): string {
  const duration = Date.now() - startTime
  const minutes = duration / (1000 * 60)
  
  if (minutes < 1) return '<1m'
  if (minutes < 5) return '1-5m'
  if (minutes < 15) return '5-15m'
  return '>15m'
}

/**
 * Log event
 */
export function logEvent(
  type: LogEventType,
  metrics?: Record<string, any>,
  sessionStartTime?: number
): void {
  const event: LogEvent = {
    type,
    timestamp: Date.now(),
    deviceClass: getDeviceClass(),
    metrics: metrics ? { ...metrics } : undefined,
  }
  
  if (sessionStartTime) {
    event.sessionDuration = getSessionDurationBucket(sessionStartTime)
  }
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    
  }
  
  // TODO: Send to analytics service in production
  // sendToAnalytics(event)
}

/**
 * Log FPS low event
 */
export function logFPSLow(level: number, averageFPS: number): void {
  logEvent('fps_low', {
    level,
    averageFPS: Math.round(averageFPS),
  })
}

/**
 * Log canvas crash
 */
export function logCanvasCrash(component: string, error: Error, crashCount: number): void {
  logEvent('canvas_crash', {
    component,
    message: error.message,
    crashCount,
    // Don't log full stack in production for privacy
    hasStack: !!error.stack,
  })
}

/**
 * Log score save failure
 */
export function logScoreSaveFailure(gameId: string, attemptCount: number): void {
  logEvent('score_save_failure', {
    gameId,
    attemptCount,
  })
}

/**
 * Log multi-tab warning
 */
export function logMultiTabWarning(): void {
  logEvent('multi_tab_warning')
}

/**
 * Log session renewal
 */
export function logSessionRenewal(success: boolean): void {
  logEvent(success ? 'session_renewal' : 'session_renewal_failure')
}

/**
 * Session Event Metadata
 * 
 * Metadata captured for session-related events
 */
export interface SessionEventMetadata {
  userId?: number | string
  sessionToken?: string // First 8 chars only for security
  ip?: string
  userAgent?: string
  [key: string]: any
}

/**
 * Log session event
 * 
 * Generic function for logging session-related events with metadata.
 * Session tokens are truncated to first 8 characters for security.
 * 
 * @param type - Session event type
 * @param metadata - Event metadata (userId, sessionToken, IP, user agent, etc.)
 */
export function logSessionEvent(
  type: Extract<LogEventType, 'session_created' | 'session_duplicate_detected' | 'session_user_mismatch' | 'session_destroyed'>,
  metadata: SessionEventMetadata
): void {
  // Truncate session token to first 8 chars for security
  const safeMetadata = { ...metadata }
  if (safeMetadata.sessionToken) {
    safeMetadata.sessionToken = safeMetadata.sessionToken.substring(0, 8) + '...'
  }
  
  logEvent(type, safeMetadata)
}

