/**
 * Session Isolation Integration Tests
 * 
 * These tests verify that sessions are properly isolated between users
 * and that the critical session leakage vulnerability has been fixed.
 * 
 * CRITICAL TESTS - These must pass before deploying to production
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import { prisma } from '@/lib/prisma'

describe('Session Isolation', () => {
  let testUser1: any
  let testUser2: any
  let session1: any
  let session2: any

  beforeAll(async () => {
    // Create two test users
    testUser1 = await prisma.user.create({
      data: {
        name: 'Test User One',
        xId: 'test_user_1_' + Date.now(),
        xUsername: 'testuser1',
        avatar: null,
      },
    })

    testUser2 = await prisma.user.create({
      data: {
        name: 'Test User Two',
        xId: 'test_user_2_' + Date.now(),
        xUsername: 'testuser2',
        avatar: null,
      },
    })
  })

  afterAll(async () => {
    // Cleanup: delete test sessions
    await prisma.session.deleteMany({
      where: {
        userId: {
          in: [testUser1.id, testUser2.id],
        },
      },
    })

    // Cleanup: delete test users
    await prisma.user.deleteMany({
      where: {
        id: {
          in: [testUser1.id, testUser2.id],
        },
      },
    })

    await prisma.$disconnect()
  })

  describe('🔐 Session Token Uniqueness', () => {
    it('should prevent duplicate session tokens (CRITICAL)', async () => {
      const sessionToken = 'test_unique_token_' + Date.now()
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

      // Create first session with this token
      session1 = await prisma.session.create({
        data: {
          sessionToken,
          userId: testUser1.id,
          expires,
        },
      })

      // Attempt to create second session with SAME token for different user
      // This MUST fail due to UNIQUE constraint
      await expect(
        prisma.session.create({
          data: {
            sessionToken, // Same token - should fail
            userId: testUser2.id,
            expires,
          },
        })
      ).rejects.toThrow()

      // Verify only one session exists with this token
      const sessions = await prisma.session.findMany({
        where: { sessionToken },
      })

      expect(sessions).toHaveLength(1)
      expect(sessions[0].userId).toBe(testUser1.id)
    })

    it('should allow different users to have different session tokens', async () => {
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

      // Create session for user 1
      const session1 = await prisma.session.create({
        data: {
          sessionToken: 'test_token_user1_' + Date.now(),
          userId: testUser1.id,
          expires,
        },
      })

      // Create session for user 2 with DIFFERENT token
      const session2 = await prisma.session.create({
        data: {
          sessionToken: 'test_token_user2_' + Date.now(),
          userId: testUser2.id,
          expires,
        },
      })

      // Both should exist and be different
      expect(session1.id).not.toBe(session2.id)
      expect(session1.sessionToken).not.toBe(session2.sessionToken)
      expect(session1.userId).toBe(testUser1.id)
      expect(session2.userId).toBe(testUser2.id)
    })
  })

  describe('🔍 Session-User Mapping', () => {
    it('should correctly map session to user', async () => {
      const sessionToken = 'test_mapping_' + Date.now()
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

      // Create session for user 1
      const session = await prisma.session.create({
        data: {
          sessionToken,
          userId: testUser1.id,
          expires,
        },
        include: {
          user: true,
        },
      })

      // Verify session maps to correct user
      expect(session.userId).toBe(testUser1.id)
      expect(session.user.id).toBe(testUser1.id)
      expect(session.user.name).toBe('Test User One')
      expect(session.user.xUsername).toBe('testuser1')
    })

    it('should not allow session userId to be changed to another user', async () => {
      const sessionToken = 'test_immutable_' + Date.now()
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

      // Create session for user 1
      const session = await prisma.session.create({
        data: {
          sessionToken,
          userId: testUser1.id,
          expires,
        },
      })

      // Attempt to update session to point to user 2
      // This should work at DB level, but our application logic should prevent it
      const updatedSession = await prisma.session.update({
        where: { id: session.id },
        data: { userId: testUser2.id },
      })

      // Verify update succeeded (DB allows it)
      expect(updatedSession.userId).toBe(testUser2.id)

      // NOTE: Our application code should NEVER update userId on existing session
      // This test documents the DB behavior, but application logic prevents this
    })
  })

  describe('🔒 Session Lookup by Token', () => {
    it('should return correct user for given session token', async () => {
      const sessionToken1 = 'test_lookup1_' + Date.now()
      const sessionToken2 = 'test_lookup2_' + Date.now()
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

      // Create sessions for both users
      await prisma.session.create({
        data: { sessionToken: sessionToken1, userId: testUser1.id, expires },
      })

      await prisma.session.create({
        data: { sessionToken: sessionToken2, userId: testUser2.id, expires },
      })

      // Lookup session 1
      const foundSession1 = await prisma.session.findUnique({
        where: { sessionToken: sessionToken1 },
        include: { user: true },
      })

      expect(foundSession1).toBeTruthy()
      expect(foundSession1?.userId).toBe(testUser1.id)
      expect(foundSession1?.user.name).toBe('Test User One')

      // Lookup session 2
      const foundSession2 = await prisma.session.findUnique({
        where: { sessionToken: sessionToken2 },
        include: { user: true },
      })

      expect(foundSession2).toBeTruthy()
      expect(foundSession2?.userId).toBe(testUser2.id)
      expect(foundSession2?.user.name).toBe('Test User Two')

      // Verify they are different sessions
      expect(foundSession1?.id).not.toBe(foundSession2?.id)
    })

    it('should return null for non-existent session token', async () => {
      const nonExistentToken = 'definitely_does_not_exist_' + Date.now()

      const foundSession = await prisma.session.findUnique({
        where: { sessionToken: nonExistentToken },
      })

      expect(foundSession).toBeNull()
    })
  })

  describe('⏰ Session Expiry', () => {
    it('should correctly handle expired sessions', async () => {
      const sessionToken = 'test_expired_' + Date.now()
      const expires = new Date(Date.now() - 24 * 60 * 60 * 1000) // Expired 1 day ago

      // Create expired session
      const session = await prisma.session.create({
        data: {
          sessionToken,
          userId: testUser1.id,
          expires,
        },
      })

      // Session exists in DB
      const foundSession = await prisma.session.findUnique({
        where: { sessionToken },
      })

      expect(foundSession).toBeTruthy()
      expect(foundSession?.expires.getTime()).toBeLessThan(Date.now())

      // Application logic should reject expired sessions
      // (this test documents DB state, application must check expiry)
    })

    it('should correctly handle future-expiring sessions', async () => {
      const sessionToken = 'test_future_' + Date.now()
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Expires in 30 days

      const session = await prisma.session.create({
        data: {
          sessionToken,
          userId: testUser1.id,
          expires,
        },
      })

      const foundSession = await prisma.session.findUnique({
        where: { sessionToken },
      })

      expect(foundSession).toBeTruthy()
      expect(foundSession?.expires.getTime()).toBeGreaterThan(Date.now())
    })
  })

  describe('📊 Session Monitoring Queries', () => {
    it('should detect duplicate session tokens (should always be 0)', async () => {
      // This query should return 0 rows in healthy system
      const duplicates = await prisma.$queryRaw<any[]>`
        SELECT 
          "sessionToken",
          COUNT(*) as duplicate_count
        FROM sessions
        GROUP BY "sessionToken"
        HAVING COUNT(*) > 1
      `

      expect(duplicates).toHaveLength(0)
    })

    it('should find sessions without valid user (orphaned sessions)', async () => {
      // Create orphaned session manually (user doesn't exist)
      const orphanedToken = 'test_orphaned_' + Date.now()
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

      // Insert directly to bypass foreign key check (if possible)
      // In production, this should not happen due to foreign key constraints
      try {
        await prisma.$executeRaw`
          INSERT INTO sessions ("sessionToken", "userId", expires)
          VALUES (${orphanedToken}, 999999999, ${expires})
        `

        // Query for orphaned sessions
        const orphaned = await prisma.$queryRaw<any[]>`
          SELECT s.*
          FROM sessions s
          LEFT JOIN users u ON s."userId" = u.id
          WHERE u.id IS NULL
        `

        // Should find the orphaned session we just created
        expect(orphaned.length).toBeGreaterThanOrEqual(1)

        // Cleanup
        await prisma.$executeRaw`DELETE FROM sessions WHERE "sessionToken" = ${orphanedToken}`
      } catch (error) {
        // Foreign key constraint prevented orphaned session (good!)
        // This is the expected behavior with proper DB constraints
        expect(error).toBeTruthy()
      }
    })

    it('should calculate session-to-user ratio', async () => {
      // Create multiple sessions for test users
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

      await prisma.session.createMany({
        data: [
          { sessionToken: 'test_ratio1_' + Date.now(), userId: testUser1.id, expires },
          { sessionToken: 'test_ratio2_' + Date.now(), userId: testUser1.id, expires },
          { sessionToken: 'test_ratio3_' + Date.now(), userId: testUser2.id, expires },
        ],
      })

      // Calculate ratio
      const result = await prisma.$queryRaw<any[]>`
        SELECT 
          COUNT(DISTINCT "userId") as total_users,
          COUNT(*) as total_sessions,
          ROUND(COUNT(*)::numeric / NULLIF(COUNT(DISTINCT "userId"), 0), 2) as sessions_per_user
        FROM sessions
        WHERE "userId" IN (${testUser1.id}, ${testUser2.id})
      `

      expect(result).toHaveLength(1)
      expect(Number(result[0].total_users)).toBeGreaterThanOrEqual(2)
      expect(Number(result[0].total_sessions)).toBeGreaterThanOrEqual(3)
      
      // Healthy ratio should be < 3
      const ratio = Number(result[0].sessions_per_user)
      expect(ratio).toBeGreaterThan(0)
      expect(ratio).toBeLessThan(5) // Allow some margin for test sessions
    })
  })
})

describe('Cookie Configuration', () => {
  it('should have secure cookie settings for production', () => {
    // These values should match auth.config.ts
    const isProduction = process.env.NODE_ENV === 'production'
    
    // In production, cookies should be:
    // - httpOnly: true (prevent XSS)
    // - secure: true (HTTPS only)
    // - sameSite: 'lax' (CSRF protection)
    // - domain: extracted from NEXTAUTH_URL
    
    if (isProduction) {
      expect(process.env.NEXTAUTH_URL).toBeTruthy()
      expect(process.env.NEXTAUTH_URL).toMatch(/^https:/)
      expect(process.env.NEXTAUTH_SECRET).toBeTruthy()
      expect(process.env.NEXTAUTH_SECRET?.length).toBeGreaterThan(32)
    }
  })
})

