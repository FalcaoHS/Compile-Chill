import { NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { handleApiError, ApiErrors } from "@/lib/utils/api-errors"
import { getAuthenticatedUser } from "@/lib/utils/api-auth"

/**
 * Rate limit configuration for route handlers
 */
export interface RateLimitHandlerConfig {
  /**
   * Rate limiter instance to use
   * If null, rate limiting will be skipped (development mode)
   */
  limiter: Ratelimit | null
  /**
   * Function to generate rate limit key from request
   * Default: uses user ID if authenticated, otherwise IP address
   */
  keyGenerator?: (request: NextRequest, userId?: string | null) => string
  /**
   * Custom error message when rate limit is exceeded
   */
  errorMessage?: string
}

/**
 * Get client IP address from request
 */
function getClientIp(request: NextRequest): string {
  // PT: Tenta vários headers que podem conter o IP real (proxies, load balancers) | EN: Try various headers that might contain real IP (proxies, load balancers) | ES: Intenta varios headers que pueden contener IP real (proxies, load balancers) | FR: Essaie divers headers pouvant contenir IP réel (proxies, load balancers) | DE: Versucht verschiedene Header, die echte IP enthalten könnten (Proxies, Load Balancer)
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const cfConnectingIp = request.headers.get("cf-connecting-ip")

  if (forwarded) {
    // PT: x-forwarded-for pode conter múltiplos IPs, pega o primeiro (cliente original) | EN: x-forwarded-for can contain multiple IPs, take first (original client) | ES: x-forwarded-for puede contener múltiples IPs, toma el primero (cliente original) | FR: x-forwarded-for peut contenir plusieurs IPs, prendre le premier (client original) | DE: x-forwarded-for kann mehrere IPs enthalten, erste nehmen (ursprünglicher Client)
    return forwarded.split(",")[0].trim()
  }

  if (realIp) {
    return realIp
  }

  if (cfConnectingIp) {
    return cfConnectingIp
  }

  // Fallback to a default if no IP can be determined
  return "unknown"
}

/**
 * Default key generator: uses user ID if authenticated, otherwise IP address
 */
function defaultKeyGenerator(
  request: NextRequest,
  userId?: string | null
): string {
  if (userId) {
    return `user:${userId}`
  }
  return `ip:${getClientIp(request)}`
}

/**
 * Route handler type
 */
export type RouteHandler = (
  request: NextRequest
) => Promise<NextResponse>

/**
 * Rate limiting wrapper for API route handlers
 * 
 * Checks rate limits before executing the handler and returns 429
 * with Retry-After header when limit is exceeded. Includes rate limit
 * headers in all responses.
 * 
 * @param handler - Route handler function
 * @param config - Rate limit configuration
 * @returns Wrapped handler with rate limiting
 * 
 * @example
 * ```ts
 * import { getScoreSubmissionLimiter } from "@/lib/rate-limit"
 * 
 * export const POST = withRateLimit(
 *   async (request) => {
 *     // ... handler logic
 *   },
 *   {
 *     limiter: getScoreSubmissionLimiter(),
 *   }
 * )
 * ```
 */
export function withRateLimit(
  handler: RouteHandler,
  config: RateLimitHandlerConfig
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // If rate limiter is not configured (development mode), skip rate limiting
      if (!config.limiter) {
        return await handler(request)
      }

      // Get authenticated user (if any)
      const user = await getAuthenticatedUser(request)

      // PT: Gera chave de rate limit (user ID se autenticado, senão IP) | EN: Generate rate limit key (user ID if authenticated, else IP) | ES: Genera clave de rate limit (user ID si autenticado, sino IP) | FR: Génère clé rate limit (user ID si authentifié, sinon IP) | DE: Generiert Rate-Limit-Schlüssel (Benutzer-ID wenn authentifiziert, sonst IP)
      const keyGenerator = config.keyGenerator || defaultKeyGenerator
      const key = keyGenerator(request, user?.id || null)

      // PT: Verifica rate limit (sliding window) | EN: Check rate limit (sliding window) | ES: Verifica rate limit (ventana deslizante) | FR: Vérifie rate limit (fenêtre glissante) | DE: Prüft Rate-Limit (gleitendes Fenster)
      const { success, limit, remaining, reset } = await config.limiter.limit(key)

      // Create response headers with rate limit information
      const headers = new Headers()
      headers.set("X-RateLimit-Limit", limit.toString())
      headers.set("X-RateLimit-Remaining", remaining.toString())
      headers.set("X-RateLimit-Reset", new Date(reset).toISOString())

      // PT: Se rate limit excedido, retorna 429 com header Retry-After | EN: If rate limit exceeded, return 429 with Retry-After header | ES: Si rate limit excedido, retorna 429 con header Retry-After | FR: Si rate limit dépassé, retourne 429 avec header Retry-After | DE: Wenn Rate-Limit überschritten, 429 mit Retry-After-Header zurückgeben
      if (!success) {
        // PT: Calcula segundos até reset (para header Retry-After) | EN: Calculate seconds until reset (for Retry-After header) | ES: Calcula segundos hasta reset (para header Retry-After) | FR: Calcule secondes jusqu'à reset (pour header Retry-After) | DE: Berechnet Sekunden bis Reset (für Retry-After-Header)
        const retryAfter = Math.ceil((reset - Date.now()) / 1000)
        headers.set("Retry-After", retryAfter.toString())

        return NextResponse.json(
          {
            error: {
              code: "rate_limit_exceeded",
              message:
                config.errorMessage ||
                "Muitas requisições. Tente novamente mais tarde.",
            },
          },
          {
            status: 429,
            headers,
          }
        )
      }

      // Execute handler
      const response = await handler(request)

      // Add rate limit headers to response
      headers.forEach((value, key) => {
        response.headers.set(key, value)
      })

      return response
    } catch (error) {
      // Use centralized error handler
      return handleApiError(error, request)
    }
  }
}

/**
 * Combine authentication and rate limiting
 * 
 * Convenience wrapper that applies both authentication and rate limiting
 * to a route handler.
 * 
 * @param handler - Authenticated route handler
 * @param config - Rate limit configuration
 * @returns Wrapped handler with auth and rate limiting
 */
export function withAuthAndRateLimit(
  handler: (
    request: NextRequest,
    user: { id: string; name?: string | null; email?: string | null; image?: string | null }
  ) => Promise<NextResponse>,
  config: RateLimitHandlerConfig
) {
  return withRateLimit(
    async (request: NextRequest) => {
      // Import here to avoid circular dependency
      const { withAuth } = await import("@/lib/utils/api-auth")
      const authHandler = withAuth(handler)
      return authHandler(request)
    },
    config
  )
}

