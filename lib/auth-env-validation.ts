/**
 * Authentication Environment Variable Validation
 * 
 * Validates required auth environment variables on server startup
 * to prevent runtime errors and security misconfigurations.
 */

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validate authentication environment variables
 * 
 * Checks that all required variables are present and correctly formatted.
 * In production, strict validation is enforced. In development, warnings
 * are logged but server startup is allowed.
 * 
 * @returns ValidationResult with validation status and error/warning messages
 */
export function validateAuthEnvironment(): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const isProduction = process.env.NODE_ENV === 'production'

  // Validate NEXTAUTH_URL
  const nextauthUrl = process.env.NEXTAUTH_URL
  if (!nextauthUrl) {
    errors.push('❌ NEXTAUTH_URL is required but not set. Set it to your application URL (e.g., https://compileandchill.dev)')
  } else {
    try {
      const url = new URL(nextauthUrl)
      
      // In production, require HTTPS
      if (isProduction && url.protocol !== 'https:') {
        errors.push(`❌ NEXTAUTH_URL must use HTTPS in production. Current: ${nextauthUrl}`)
      }
      
      // Warn if using localhost in production
      if (isProduction && url.hostname === 'localhost') {
        errors.push('❌ NEXTAUTH_URL cannot use localhost in production')
      }
    } catch (error) {
      errors.push(`❌ NEXTAUTH_URL is not a valid URL: ${nextauthUrl}`)
    }
  }

  // Validate NEXTAUTH_SECRET or AUTH_SECRET
  const nextauthSecret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
  if (!nextauthSecret) {
    errors.push('❌ NEXTAUTH_SECRET or AUTH_SECRET is required but not set. Generate one with: openssl rand -base64 32')
  } else if (nextauthSecret.length < 32) {
    errors.push(`❌ NEXTAUTH_SECRET must be at least 32 characters. Current length: ${nextauthSecret.length}`)
  }

  // Validate X OAuth credentials
  if (!process.env.X_CLIENT_ID) {
    errors.push('❌ X_CLIENT_ID is required but not set. Get it from Twitter Developer Portal')
  }

  if (!process.env.X_CLIENT_SECRET) {
    errors.push('❌ X_CLIENT_SECRET is required but not set. Get it from Twitter Developer Portal')
  }

  // Warn about Upstash Redis (optional but recommended for production)
  if (isProduction && (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN)) {
    warnings.push('⚠️  Upstash Redis is not configured. Rate limiting will be disabled.')
  }

  const valid = errors.length === 0

  return {
    valid,
    errors,
    warnings,
  }
}

/**
 * Validate and log results
 * 
 * In production: throws error if validation fails (prevents server startup)
 * In development: logs warnings but allows server to start
 */
export function validateAndLogAuthEnvironment(): void {
  const result = validateAuthEnvironment()
  const isProduction = process.env.NODE_ENV === 'production'

  // Log errors
  if (result.errors.length > 0) {
    console.error('\n🚨 Authentication Environment Validation Failed:\n')
    result.errors.forEach(error => console.error(error))
    console.error('\n')

    if (isProduction) {
      throw new Error('Authentication environment validation failed. Fix the errors above before deploying to production.')
    } else {
      console.error('⚠️  Server will start in development mode, but authentication may not work correctly.\n')
    }
  }

  // Log warnings
  if (result.warnings.length > 0) {
    console.warn('\n⚠️  Authentication Environment Warnings:\n')
    result.warnings.forEach(warning => console.warn(warning))
    console.warn('\n')
  }

  // Log success in production
  if (result.valid && isProduction) {
    console.log('✅ Authentication environment validation passed\n')
  }
}

