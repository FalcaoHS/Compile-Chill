import { NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { handleApiError, ApiErrors } from "@/lib/api-errors"
import { getAuthenticatedUser } from "@/lib/api-auth"

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
  // Try various headers that might contain the real IP
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const cfConnectingIp = request.headers.get("cf-connecting-ip")

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
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

      // Generate rate limit key
      const keyGenerator = config.keyGenerator || defaultKeyGenerator
      const key = keyGenerator(request, user?.id || null)

      // Check rate limit
      const { success, limit, remaining, reset } = await config.limiter.limit(key)

      // Create response headers with rate limit information
      const headers = new Headers()
      headers.set("X-RateLimit-Limit", limit.toString())
      headers.set("X-RateLimit-Remaining", remaining.toString())
      headers.set("X-RateLimit-Reset", new Date(reset).toISOString())

      // If rate limit exceeded, return 429 with Retry-After header
      if (!success) {
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
      const { withAuth } = await import("@/lib/api-auth")
      const authHandler = withAuth(handler)
      return authHandler(request)
    },
    config
  )
}

