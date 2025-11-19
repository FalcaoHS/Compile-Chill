/**
 * Security headers configuration
 * 
 * Placeholder structure for future security hardening (roadmap item 25).
 * This module will be expanded to include:
 * - Content Security Policy (CSP) headers
 * - CORS configuration
 * - HSTS headers
 * - Other security headers
 * 
 * Current implementation provides hooks for integration without
 * conflicting with existing functionality.
 */

/**
 * Content Security Policy configuration
 * 
 * TODO: Implement in security hardening phase (roadmap item 25)
 * 
 * @returns CSP header value or null if not configured
 */
export function getCSPHeader(): string | null {
  // Placeholder for CSP implementation
  // Will be implemented in security hardening phase
  return null
}

/**
 * CORS configuration
 * 
 * TODO: Implement in security hardening phase (roadmap item 25)
 * 
 * @param origin - Request origin
 * @returns CORS headers object or null if not configured
 */
export function getCORSHeaders(origin: string | null): Record<string, string> | null {
  // Placeholder for CORS implementation
  // Will be implemented in security hardening phase
  return null
}

/**
 * Security headers to apply to responses
 * 
 * Implements essential security headers for session isolation and general security.
 * 
 * @returns Object with security headers
 */
export function getSecurityHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}

  // CSP header (if configured)
  const csp = getCSPHeader()
  if (csp) {
    headers["Content-Security-Policy"] = csp
  }

  // 🔐 X-Frame-Options: Prevent clickjacking attacks
  // SAMEORIGIN allows framing from same origin (safe for OAuth callbacks)
  headers["X-Frame-Options"] = "SAMEORIGIN"

  // 🔐 X-Content-Type-Options: Prevent MIME type sniffing
  // Forces browser to respect declared content type
  headers["X-Content-Type-Options"] = "nosniff"

  // 🔐 Referrer-Policy: Control referrer information
  // strict-origin-when-cross-origin provides good balance:
  // - Sends full URL for same-origin requests
  // - Sends only origin for cross-origin HTTPS requests
  // - Sends nothing for HTTPS to HTTP downgrades
  headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

  // 🔐 X-XSS-Protection: Enable browser XSS filtering (legacy browsers)
  // Modern browsers rely on CSP, but this helps older browsers
  headers["X-XSS-Protection"] = "1; mode=block"

  // Note: HSTS and Permissions-Policy can be added in future hardening phase
  // These headers do NOT conflict with NextAuth cookie functionality

  return headers
}

/**
 * Integration points for security hardening phase
 * 
 * This function can be called from middleware to apply security headers
 * to all responses. Currently returns empty object, but provides the
 * integration point for future implementation.
 * 
 * @param request - NextRequest object (for context-aware headers)
 * @returns Security headers object
 */
export function applySecurityHeaders(request: Request): Record<string, string> {
  // Get base security headers
  const headers = getSecurityHeaders()

  // CORS headers (if configured)
  const origin = request.headers.get("origin")
  const corsHeaders = getCORSHeaders(origin)
  if (corsHeaders) {
    Object.assign(headers, corsHeaders)
  }

  return headers
}

