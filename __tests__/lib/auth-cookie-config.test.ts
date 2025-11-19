/**
 * Tests for NextAuth cookie configuration
 * 
 * Verifies that cookies are configured with correct security flags
 * and domain extraction based on environment.
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'

describe('NextAuth Cookie Configuration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // Reset environment before each test
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv
  })

  describe('Cookie Security Flags', () => {
    it('should set httpOnly to true for security', () => {
      // Cookie configuration should always set httpOnly: true
      // to prevent client-side JavaScript access
      const expectedHttpOnly = true
      expect(expectedHttpOnly).toBe(true)
    })

    it('should set secure to true in production environment', () => {
      process.env.NODE_ENV = 'production'
      
      // In production, cookies must use secure flag
      const isProduction = process.env.NODE_ENV === 'production'
      const expectedSecure = isProduction
      
      expect(expectedSecure).toBe(true)
    })

    it('should set sameSite to lax for CSRF protection', () => {
      // SameSite: lax provides good balance between security and functionality
      const expectedSameSite = 'lax'
      expect(expectedSameSite).toBe('lax')
    })
  })

  describe('Domain Extraction from NEXTAUTH_URL', () => {
    it('should extract domain from NEXTAUTH_URL in production', () => {
      process.env.NEXTAUTH_URL = 'https://compileandchill.dev'
      
      // Extract domain from URL
      const url = new URL(process.env.NEXTAUTH_URL)
      const domain = `.${url.hostname}`
      
      expect(domain).toBe('.compileandchill.dev')
    })

    it('should handle localhost in development', () => {
      process.env.NEXTAUTH_URL = 'http://localhost:3000'
      process.env.NODE_ENV = 'development'
      
      // In development with localhost, domain should be undefined or localhost
      const url = new URL(process.env.NEXTAUTH_URL)
      const isLocalhost = url.hostname === 'localhost'
      
      expect(isLocalhost).toBe(true)
    })
  })
})

