import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

/**
 * Upstash Redis client for rate limiting
 * 
 * Uses environment variables:
 * - UPSTASH_REDIS_REST_URL: Upstash Redis REST API URL
 * - UPSTASH_REDIS_REST_TOKEN: Upstash Redis REST API token
 * 
 * If these are not set, rate limiting will be disabled (development mode)
 */
let redis: Redis | null = null

function getRedisClient(): Redis | null {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    // PT: Se Redis não configurado, retorna null (rate limiting desabilitado em dev) | EN: If Redis not configured, return null (rate limiting disabled in dev) | ES: Si Redis no configurado, retorna null (rate limiting deshabilitado en dev) | FR: Si Redis non configuré, retourne null (limitation désactivée en dev) | DE: Wenn Redis nicht konfiguriert, null zurückgeben (Rate-Limiting in Dev deaktiviert)
    if (!url || !token) {
      
      return null
    }

    redis = new Redis({
      url,
      token,
    })
  }

  return redis
}

/**
 * Rate limit configuration for different endpoint types
 */
export interface RateLimitConfig {
  /**
   * Number of requests allowed
   */
  limit: number
  /**
   * Time window in seconds
   */
  window: number
  /**
   * Optional identifier for this rate limit configuration
   */
  identifier?: string
}

/**
 * Predefined rate limit configurations
 */
export const RateLimitPresets = {
  /**
   * Score submissions: 10 requests per minute per user
   */
  scoreSubmission: {
    limit: 10,
    window: 60, // 1 minute
    identifier: "score_submission",
  } as RateLimitConfig,

  /**
   * Theme updates: 5 requests per minute per user
   */
  themeUpdate: {
    limit: 5,
    window: 60, // 1 minute
    identifier: "theme_update",
  } as RateLimitConfig,

  /**
   * General write operations: 30 requests per minute per user
   */
  writeOperation: {
    limit: 30,
    window: 60, // 1 minute
    identifier: "write_operation",
  } as RateLimitConfig,
}

/**
 * Create a rate limiter instance with sliding window algorithm
 * 
 * @param config - Rate limit configuration
 * @returns Ratelimit instance or null if Redis is not configured
 */
export function createRateLimiter(config: RateLimitConfig): Ratelimit | null {
  const redis = getRedisClient()

  // PT: Se Redis não configurado, rate limiting desabilitado (modo desenvolvimento) | EN: If Redis not configured, rate limiting disabled (dev mode) | ES: Si Redis no configurado, rate limiting deshabilitado (modo desarrollo) | FR: Si Redis non configuré, limitation désactivée (mode dev) | DE: Wenn Redis nicht konfiguriert, Rate-Limiting deaktiviert (Dev-Modus)
  if (!redis) {
    return null
  }

  // PT: Sliding window: janela deslizante permite distribuir requisições ao longo do tempo | EN: Sliding window: allows distributing requests over time | ES: Ventana deslizante: permite distribuir solicitudes en el tiempo | FR: Fenêtre glissante: permet de distribuer les requêtes dans le temps | DE: Gleitendes Fenster: ermöglicht Verteilung der Anfragen über die Zeit
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.limit, `${config.window} s`),
    analytics: true,
    prefix: `@ratelimit/${config.identifier || "default"}`,
  })
}

/**
 * Get rate limiter for score submissions
 * Returns null if Redis is not configured (development mode)
 */
export function getScoreSubmissionLimiter(): Ratelimit | null {
  return createRateLimiter(RateLimitPresets.scoreSubmission)
}

/**
 * Get rate limiter for theme updates
 * Returns null if Redis is not configured (development mode)
 */
export function getThemeUpdateLimiter(): Ratelimit | null {
  return createRateLimiter(RateLimitPresets.themeUpdate)
}

/**
 * Get rate limiter for general write operations
 * Returns null if Redis is not configured (development mode)
 */
export function getWriteOperationLimiter(): Ratelimit | null {
  return createRateLimiter(RateLimitPresets.writeOperation)
}

