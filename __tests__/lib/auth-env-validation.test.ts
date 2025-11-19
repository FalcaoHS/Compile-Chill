/**
 * Tests for authentication environment variable validation
 * 
 * Verifies that required auth environment variables are validated
 * correctly on server startup.
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { validateAuthEnvironment } from '@/lib/auth-env-validation'

describe('Auth Environment Validation', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // Reset environment before each test
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv
  })

  describe('NEXTAUTH_URL validation', () => {
    it('should pass with valid HTTPS URL in production', () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXTAUTH_URL = 'https://compileandchill.dev'
      process.env.NEXTAUTH_SECRET = 'a'.repeat(32)
      process.env.X_CLIENT_ID = 'test_client_id'
      process.env.X_CLIENT_SECRET = 'test_client_secret'

      const result = validateAuthEnvironment()
      
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should fail if NEXTAUTH_URL is missing', () => {
      process.env.NODE_ENV = 'production'
      delete process.env.NEXTAUTH_URL
      process.env.NEXTAUTH_SECRET = 'a'.repeat(32)
      process.env.X_CLIENT_ID = 'test_client_id'
      process.env.X_CLIENT_SECRET = 'test_client_secret'

      const result = validateAuthEnvironment()
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain(expect.stringContaining('NEXTAUTH_URL'))
    })

    it('should fail if NEXTAUTH_URL does not start with https in production', () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXTAUTH_URL = 'http://compileandchill.dev'
      process.env.NEXTAUTH_SECRET = 'a'.repeat(32)
      process.env.X_CLIENT_ID = 'test_client_id'
      process.env.X_CLIENT_SECRET = 'test_client_secret'

      const result = validateAuthEnvironment()
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain(expect.stringContaining('https://'))
    })
  })

  describe('NEXTAUTH_SECRET validation', () => {
    it('should pass with secret of 32+ characters', () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXTAUTH_URL = 'https://compileandchill.dev'
      process.env.NEXTAUTH_SECRET = 'a'.repeat(32)
      process.env.X_CLIENT_ID = 'test_client_id'
      process.env.X_CLIENT_SECRET = 'test_client_secret'

      const result = validateAuthEnvironment()
      
      expect(result.valid).toBe(true)
    })

    it('should fail if NEXTAUTH_SECRET is too short', () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXTAUTH_URL = 'https://compileandchill.dev'
      process.env.NEXTAUTH_SECRET = 'short'
      process.env.X_CLIENT_ID = 'test_client_id'
      process.env.X_CLIENT_SECRET = 'test_client_secret'

      const result = validateAuthEnvironment()
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain(expect.stringContaining('32 characters'))
    })

    it('should accept AUTH_SECRET as alternative to NEXTAUTH_SECRET', () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXTAUTH_URL = 'https://compileandchill.dev'
      process.env.AUTH_SECRET = 'a'.repeat(32)
      delete process.env.NEXTAUTH_SECRET
      process.env.X_CLIENT_ID = 'test_client_id'
      process.env.X_CLIENT_SECRET = 'test_client_secret'

      const result = validateAuthEnvironment()
      
      expect(result.valid).toBe(true)
    })
  })

  describe('X OAuth credentials validation', () => {
    it('should fail if X_CLIENT_ID is missing', () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXTAUTH_URL = 'https://compileandchill.dev'
      process.env.NEXTAUTH_SECRET = 'a'.repeat(32)
      delete process.env.X_CLIENT_ID
      process.env.X_CLIENT_SECRET = 'test_client_secret'

      const result = validateAuthEnvironment()
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain(expect.stringContaining('X_CLIENT_ID'))
    })

    it('should fail if X_CLIENT_SECRET is missing', () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXTAUTH_URL = 'https://compileandchill.dev'
      process.env.NEXTAUTH_SECRET = 'a'.repeat(32)
      process.env.X_CLIENT_ID = 'test_client_id'
      delete process.env.X_CLIENT_SECRET

      const result = validateAuthEnvironment()
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain(expect.stringContaining('X_CLIENT_SECRET'))
    })
  })
})

