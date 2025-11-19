/**
 * Session Monitoring Utilities
 * 
 * Convenience wrappers for logging session-related events.
 * These functions provide a clear API for logging specific session operations.
 */

import { logSessionEvent, type SessionEventMetadata } from './performance/light-logging'

/**
 * Log successful session creation
 * 
 * Called after a new session is created in the database.
 * 
 * @param userId - User ID associated with the session
 * @param sessionToken - Session token (will be truncated for security)
 * @param metadata - Additional metadata (IP, user agent, etc.)
 * 
 * @example
 * ```ts
 * logSessionCreated(user.id, session.sessionToken, {
 *   ip: request.ip,
 *   userAgent: request.headers['user-agent']
 * })
 * ```
 */
export function logSessionCreated(
  userId: number | string,
  sessionToken: string,
  metadata?: Omit<SessionEventMetadata, 'userId' | 'sessionToken'>
): void {
  logSessionEvent('session_created', {
    userId,
    sessionToken,
    ...metadata,
  })
}

/**
 * Log duplicate session detection
 * 
 * Called when an existing session with the same token is found.
 * This should be rare due to UNIQUE constraints, but if it happens,
 * it indicates a potential security issue.
 * 
 * @param sessionToken - Duplicate session token
 * @param existingUserId - User ID of existing session
 * @param newUserId - User ID attempting to create new session
 * 
 * @example
 * ```ts
 * logSessionDuplicate(
 *   session.sessionToken,
 *   existingSession.userId,
 *   newUserId
 * )
 * ```
 */
export function logSessionDuplicate(
  sessionToken: string,
  existingUserId: number | string,
  newUserId: number | string
): void {
  logSessionEvent('session_duplicate_detected', {
    sessionToken,
    existingUserId,
    newUserId,
    severity: 'high',
  })
}

/**
 * Log session-user mismatch
 * 
 * Called when session callback returns a user that doesn't match
 * the user ID stored in the session. This indicates a critical bug
 * that could lead to session leakage.
 * 
 * @param sessionId - Session ID or token
 * @param sessionUserId - User ID stored in session
 * @param queryUserId - User ID returned from database query
 * 
 * @example
 * ```ts
 * if (session.user.id !== dbUser.id) {
 *   logSessionUserMismatch(
 *     session.id,
 *     session.user.id,
 *     dbUser.id
 *   )
 * }
 * ```
 */
export function logSessionUserMismatch(
  sessionId: string,
  sessionUserId: number | string,
  queryUserId: number | string
): void {
  logSessionEvent('session_user_mismatch', {
    sessionId,
    sessionUserId,
    queryUserId,
    severity: 'critical',
  })
}

/**
 * Log session destruction
 * 
 * Called when a session is destroyed (logout, expiration, etc.)
 * 
 * @param userId - User ID whose session is being destroyed
 * @param sessionToken - Session token being destroyed
 * @param reason - Reason for destruction (logout, expired, duplicate, etc.)
 * 
 * @example
 * ```ts
 * logSessionDestroyed(user.id, session.sessionToken, 'logout')
 * logSessionDestroyed(user.id, session.sessionToken, 'expired')
 * logSessionDestroyed(user.id, session.sessionToken, 'duplicate')
 * ```
 */
export function logSessionDestroyed(
  userId: number | string,
  sessionToken: string,
  reason: 'logout' | 'expired' | 'duplicate' | 'security' | 'other'
): void {
  logSessionEvent('session_destroyed', {
    userId,
    sessionToken,
    reason,
  })
}

/**
 * Extract client metadata from request headers
 * 
 * Helper function to extract IP address and user agent from request.
 * Can be used when logging session events that have request context.
 * 
 * @param headers - Request headers object
 * @returns Metadata object with ip and userAgent
 * 
 * @example
 * ```ts
 * import { headers } from 'next/headers'
 * const metadata = getClientMetadata(headers())
 * logSessionCreated(userId, sessionToken, metadata)
 * ```
 */
export function getClientMetadata(headers: Headers | Record<string, string | string[] | undefined>): {
  ip?: string
  userAgent?: string
} {
  let ip: string | undefined
  let userAgent: string | undefined

  if (headers instanceof Headers) {
    // Next.js Headers object
    ip = headers.get('x-forwarded-for')?.split(',')[0].trim() 
      || headers.get('x-real-ip') 
      || headers.get('cf-connecting-ip') 
      || undefined
    
    userAgent = headers.get('user-agent') || undefined
  } else {
    // Plain object (e.g., from NextRequest.headers)
    const xForwardedFor = headers['x-forwarded-for']
    ip = (Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor)?.split(',')[0].trim()
      || (Array.isArray(headers['x-real-ip']) ? headers['x-real-ip'][0] : headers['x-real-ip'])
      || (Array.isArray(headers['cf-connecting-ip']) ? headers['cf-connecting-ip'][0] : headers['cf-connecting-ip'])
      || undefined
    
    const ua = headers['user-agent']
    userAgent = Array.isArray(ua) ? ua[0] : ua || undefined
  }

  return { ip, userAgent }
}

