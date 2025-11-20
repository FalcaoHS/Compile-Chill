# Specification: Session Isolation Security Fix

## Goal
Eliminate session leakage vulnerability by adding explicit cookie configuration, environment variable validation, structured session logging, and comprehensive isolation testing to ensure each user's session is completely isolated from others.

## User Stories
- As a developer, I want explicit cookie security configuration so that sessions are properly scoped to the correct domain and cannot be shared between users
- As a platform administrator, I want structured session logging and monitoring so that I can detect and prevent session leakage incidents immediately

## Specific Requirements

**Cookie Security Configuration**
- Add explicit `cookies` configuration to `auth.config.ts` with `sessionToken` settings
- Set `httpOnly: true`, `sameSite: 'lax'`, `secure: true` (production), `path: '/'`
- Configure cookie domain dynamically based on environment (`.compileandchill.dev` in production)
- Use `__Secure-next-auth.session-token` prefix in production for additional browser protection
- Validate that cookie configuration matches `NEXTAUTH_URL` domain
- Remove default NextAuth cookie behavior that may be incorrect for custom domains

**Environment Variable Validation**
- Create startup validation function that checks required auth environment variables exist
- Validate `NEXTAUTH_URL` format matches expected pattern (`https://compileandchill.dev` in production)
- Validate `NEXTAUTH_SECRET` or `AUTH_SECRET` is set and is at least 32 characters
- Log validation errors to server console with clear actionable messages
- Prevent server startup if critical auth variables are missing or malformed in production
- Create documentation showing correct environment variable configuration for Vercel

**Structured Session Logging**
- Extend existing `lib/performance/light-logging.ts` with new session event types
- Add log events: `session_created`, `session_duplicate_detected`, `session_user_mismatch`, `session_destroyed`
- Log session metadata: userId, sessionToken (first 8 chars only), IP address, user agent, timestamp
- Create server-side logging in `auth-adapter.ts` for all session operations (create, update, delete)
- Add alerts when suspicious patterns detected (duplicate tokens, rapid session creation, user mismatches)
- Include session count and user count in periodic health check logs

**Adapter Simplification**
- Simplify `signIn` callback in `auth.config.ts` by removing complex user update logic
- Move user update logic to dedicated `updateUserFromOAuth` utility function in `lib/auth-adapter.ts`
- Remove redundant session existence check in `createSession` (UNIQUE constraint already prevents duplicates)
- Add structured logging to all adapter methods (createUser, getUser, getUserByAccount, createSession)
- Reduce adapter method complexity to single responsibility per method
- Add comprehensive error handling with specific error messages for debugging

**Session Callback Audit**
- Review `session` callback in `auth.config.ts` for potential user cross-contamination
- Ensure database query in session callback uses correct user ID from session token
- Add validation that user returned from DB matches user ID in session
- Log warning if user ID mismatch detected between session and database query
- Consider caching user data in session object to reduce database queries
- Add defensive checks to prevent returning wrong user if query fails or returns unexpected result

**Session Isolation Tests**
- Create integration test that simulates two users logging in simultaneously
- Test that User A's session cookie never returns User B's data after refresh
- Test concurrent login scenarios with multiple users (5+ simultaneous logins)
- Test session expiry and renewal for correct user isolation
- Create manual test script for staging environment verification before production deploy
- Test that logout properly destroys session and subsequent requests return 401
- Verify that multiple browser tabs with same user don't interfere with different user sessions

**Security Headers Review**
- Audit `lib/security-headers.ts` to ensure Content-Security-Policy doesn't allow cookie leakage
- Verify `X-Frame-Options`, `X-Content-Type-Options`, and other headers are properly set
- Add `Referrer-Policy: strict-origin-when-cross-origin` if not present
- Ensure middleware applies security headers to all routes including auth routes

**Monitoring Dashboard Setup**
- Document how to monitor active sessions in production using database queries
- Create SQL queries for detecting anomalies (duplicate sessions, orphaned sessions, rapid creation)
- Set up alerts for suspicious session activity patterns
- Document process for emergency session cleanup if vulnerability detected

## Visual Design

No visual assets provided for this security fix specification.

## Existing Code to Leverage

**`lib/performance/light-logging.ts`**
- Reuse existing `LogEventType` pattern and `logEvent` function structure
- Extend with new session-related event types following same pattern
- Use existing device class detection and timestamp bucketing logic
- Follow same console logging pattern for development vs production

**`lib/auth-adapter.ts`**
- Build on existing adapter pattern with string-to-int userId conversions
- Keep existing Prisma session management structure (findUnique, create, update, delete)
- Extend existing error handling try-catch blocks with structured logging
- Leverage existing user fetch patterns from `getUser` and `getUserByAccount` methods

**`auth.config.ts`**
- Keep existing `session.strategy: "database"`, `maxAge: 30 days`, `updateAge: 24 hours` configuration
- Maintain existing Twitter OAuth provider setup and profile mapper logic
- Extend existing callbacks (signIn, session, redirect) without breaking current behavior
- Add cookies configuration as new top-level property alongside existing config

**`lib/api-auth.ts` and `lib/middleware-auth.ts`**
- Use existing `withAuth` wrapper pattern for protecting API routes
- Leverage existing `requireAuthMiddleware` for authentication checks
- Follow same error response format (401 with error.code and error.message)
- Use existing `getAuthenticatedUser` utility for session retrieval

**Database Schema (Verified)**
- Leverage existing UNIQUE constraint on `sessions.sessionToken` (no changes needed)
- Use existing foreign key CASCADE on `sessions.userId` references `users.id`
- No database migrations required - schema is already correct

## Out of Scope
- Migration to different authentication system (NextAuth remains)
- Adding multi-factor authentication (MFA)
- Implementing refresh tokens or JWT session strategy
- Adding OAuth providers other than Twitter/X
- Changing session storage from database to Redis or in-memory cache
- Building admin dashboard UI for session management
- Automated anomaly detection or machine learning fraud detection
- Session replay or detailed session activity tracking beyond basic logs
- Recovery of data from the deleted production incident (not possible)
- Implementing session fingerprinting or device tracking beyond IP and user agent

