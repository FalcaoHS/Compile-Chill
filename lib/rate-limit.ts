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

    // If Redis is not configured, return null (rate limiting disabled)
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

  // If Redis is not configured, return null (rate limiting disabled)
  if (!redis) {
    return null
  }

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

