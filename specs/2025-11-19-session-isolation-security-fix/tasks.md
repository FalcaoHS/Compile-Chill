# Task Breakdown: Session Isolation Security Fix

## Overview
Total Task Groups: 5
Estimated Priority: 🔴 **CRITICAL SECURITY FIX**

⚠️ **IMPORTANT**: This is a security-critical feature. All tasks must be completed and thoroughly tested before production deployment.

## Task List

### Configuration Layer

#### Task Group 1: Cookie Security & Environment Validation
**Dependencies:** None

- [x] 1.0 Complete cookie security configuration and environment validation
  - [x] 1.1 Write 2-4 focused tests for cookie configuration
    - Test cookie settings in production vs development environment
    - Test domain extraction from NEXTAUTH_URL
    - Test cookie security flags are correctly applied
    - Limit to 2-4 critical configuration tests maximum
  - [x] 1.2 Add explicit cookies configuration to `auth.config.ts`
    - Create cookies object with sessionToken configuration
    - Set `httpOnly: true`, `sameSite: 'lax'`, `path: '/'`
    - Set `secure: true` when NODE_ENV is production
    - Extract domain from NEXTAUTH_URL environment variable (e.g., `.compileandchill.dev`)
    - Use `__Secure-next-auth.session-token` name prefix in production
    - Keep existing session strategy and other NextAuth config unchanged
  - [x] 1.3 Create environment validation utility at `lib/auth-env-validation.ts`
    - Create `validateAuthEnvironment()` function that runs on server startup
    - Validate NEXTAUTH_URL exists and matches pattern `https://[domain]` in production
    - Validate NEXTAUTH_SECRET or AUTH_SECRET exists and is minimum 32 characters
    - Validate X_CLIENT_ID and X_CLIENT_SECRET exist
    - Return validation result with specific error messages for each missing/invalid variable
    - Log validation errors with actionable guidance to server console
  - [x] 1.4 Integrate validation into server startup
    - Import and call `validateAuthEnvironment()` in `auth.config.ts` at top level
    - In production: throw error and prevent startup if validation fails
    - In development: log warnings but allow startup with invalid config
    - Document required format for each environment variable
  - [x] 1.5 Update documentation with Vercel environment variable guide
    - Create `VERCEL_AUTH_SETUP.md` with step-by-step Vercel configuration
    - Document exact format for NEXTAUTH_URL (must include https:// and domain)
    - Include screenshots or clear instructions for Vercel Environment Variables UI
    - Add troubleshooting section for common cookie/domain issues
  - [x] 1.6 Run configuration tests
    - Run ONLY the 2-4 tests written in 1.1
    - Verify cookie configuration works in both dev and prod mode
    - Manually test that NEXTAUTH_URL validation catches malformed URLs
    - Do NOT run entire test suite at this stage

**Acceptance Criteria:**
- The 2-4 tests written in 1.1 pass
- Cookies configuration includes all required security flags
- Domain is dynamically extracted from NEXTAUTH_URL
- Environment validation prevents startup with invalid config in production
- Documentation clearly explains Vercel setup

---

### Logging Infrastructure

#### Task Group 2: Structured Session Logging
**Dependencies:** Task Group 1

- [x] 2.0 Complete structured session logging
  - [x] 2.1 Write 2-4 focused tests for logging functions
    - Test session event logging captures correct metadata
    - Test log output format for different event types
    - Test IP address and user agent extraction
    - Limit to 2-4 critical logging tests maximum
  - [x] 2.2 Extend `lib/performance/light-logging.ts` with session events
    - Add new LogEventType values: `session_created`, `session_duplicate_detected`, `session_user_mismatch`, `session_destroyed`
    - Create `logSessionEvent()` function that captures: userId, sessionToken (first 8 chars), IP, userAgent, timestamp
    - Add `getClientMetadata()` helper to extract IP and user agent from request
    - Follow existing logging pattern (console in dev, prepared for analytics in prod)
    - Keep existing log event types and functions unchanged
  - [x] 2.3 Create session monitoring utilities at `lib/session-monitor.ts`
    - Create `logSessionCreated(userId, sessionToken, metadata)` wrapper
    - Create `logSessionDuplicate(sessionToken, existingUserId, newUserId)` wrapper
    - Create `logSessionUserMismatch(sessionId, sessionUserId, queryUserId)` wrapper
    - Create `logSessionDestroyed(userId, sessionToken, reason)` wrapper
    - Each function calls `logSessionEvent()` with appropriate event type
    - Add JSDoc comments explaining when each function should be used
  - [x] 2.4 Add logging to `lib/auth-adapter.ts`
    - Import session monitoring utilities
    - Add `logSessionCreated()` call after successful session creation
    - Add `logSessionDuplicate()` call when existing session detected and deleted
    - Add structured error logging to all adapter methods with userId context
    - Keep existing adapter logic unchanged, only add logging
  - [x] 2.5 Add logging to session callback in `auth.config.ts`
    - Import `logSessionUserMismatch` from session-monitor
    - After DB query in session callback, validate user.id matches dbUser.id
    - Log mismatch warning if IDs don't match
    - Add try-catch around DB query with error logging
  - [x] 2.6 Run logging tests
    - Run ONLY the 2-4 tests written in 2.1
    - Verify session events are logged correctly
    - Manually verify logs appear in console during session creation
    - Do NOT run entire test suite at this stage

**Acceptance Criteria:**
- The 2-4 tests written in 2.1 pass
- All session operations log structured events with metadata
- Logging functions follow existing light-logging pattern
- No existing functionality broken by adding logging

---

### Adapter Refactoring

#### Task Group 3: Auth Adapter Simplification
**Dependencies:** Task Group 2

- [x] 3.0 Complete auth adapter simplification
  - [x] 3.1 Write 2-4 focused tests for refactored adapter
    - Test user update logic in new utility function
    - Test simplified signIn callback behavior
    - Test adapter methods maintain correct functionality after refactoring
    - Limit to 2-4 critical adapter tests maximum
  - [x] 3.2 Create `updateUserFromOAuth()` utility in `lib/auth-adapter.ts`
    - Extract user update logic from signIn callback
    - Function signature: `updateUserFromOAuth(userId, profile, account)` 
    - Handle name, avatar, xUsername updates
    - Return updated user object
    - Include error handling with structured logging
    - Keep Twitter API fallback logic if name/avatar missing
  - [x] 3.3 Simplify signIn callback in `auth.config.ts`
    - Replace complex inline user update logic with `updateUserFromOAuth()` call
    - Remove redundant comments and console.logs
    - Keep essential logic: xId extraction, user creation, account linking
    - Reduce callback to < 50 lines of code
    - Maintain all existing functionality
  - [x] 3.4 Remove redundant session check in createSession
    - In `lib/auth-adapter.ts` createSession method, remove existingSession check
    - Database UNIQUE constraint already prevents duplicates
    - Keep structured logging of session creation
    - Add comment explaining UNIQUE constraint handles duplicates
    - Remove unnecessary delete operation
  - [x] 3.5 Add defensive checks to session callback
    - In `auth.config.ts` session callback, add null check for dbUser before using
    - If dbUser is null, log error and return session with existing user data
    - If dbUser.id !== user.id, log critical warning with both IDs
    - Add fallback to prevent returning null/undefined user in session
  - [x] 3.6 Run adapter refactoring tests
    - Run ONLY the 2-4 tests written in 3.1
    - Verify OAuth user updates still work correctly
    - Verify signIn and session callbacks maintain functionality
    - Do NOT run entire test suite at this stage

**Acceptance Criteria:**
- The 2-4 tests written in 3.1 pass
- signIn callback reduced in complexity (< 50 lines)
- User update logic extracted to reusable utility
- Defensive checks prevent null/undefined user returns
- All existing auth functionality works unchanged

---

### Security Hardening

#### Task Group 4: Security Headers & Session Callback Audit
**Dependencies:** Task Group 3

- [x] 4.0 Complete security hardening
  - [x] 4.1 Write 2-4 focused tests for security improvements
    - Test security headers are applied to all routes
    - Test session callback returns correct user under various conditions
    - Test referrer policy header is set correctly
    - Limit to 2-4 critical security tests maximum
  - [x] 4.2 Audit and update `lib/security-headers.ts`
    - Review existing Content-Security-Policy for cookie-related directives
    - Verify X-Frame-Options is set to DENY or SAMEORIGIN
    - Verify X-Content-Type-Options is set to nosniff
    - Add Referrer-Policy: strict-origin-when-cross-origin if missing
    - Ensure headers don't conflict with NextAuth cookie requirements
    - Document each header's security purpose in comments
  - [x] 4.3 Verify middleware applies headers to auth routes
    - Review `middleware.ts` to confirm headers applied to `/api/auth/*` routes
    - Verify security headers are included in auth success and error responses
    - Test that headers don't break OAuth callback flow
    - Add integration test for headers on auth endpoints if missing
  - [x] 4.4 Add session data validation in session callback
    - In `auth.config.ts` session callback, validate session.user.id format
    - Check that session.user.id is valid integer string
    - Validate dbUser returned from query has expected structure
    - Add TypeScript type guards for runtime safety
    - Return early with existing session if validation fails
  - [x] 4.5 Consider session data caching strategy
    - Document current approach: query DB on every session access
    - Analyze if caching user data in session object reduces DB load
    - If implementing cache: only cache non-sensitive data (id, name, avatar)
    - Add cache invalidation logic if user data changes
    - Document trade-offs between freshness and performance
  - [x] 4.6 Run security hardening tests
    - Run ONLY the 2-4 tests written in 4.1
    - Verify security headers are present on sample routes
    - Verify session callback handles edge cases safely
    - Do NOT run entire test suite at this stage

**Acceptance Criteria:**
- The 2-4 tests written in 4.1 pass
- All required security headers present and correctly configured
- Session callback includes defensive validation and error handling
- No security headers break NextAuth functionality

---

### Testing & Monitoring

#### Task Group 5: Session Isolation Tests & Monitoring Setup
**Dependencies:** Task Groups 1-4

- [x] 5.0 Complete session isolation testing and monitoring
  - [x] 5.1 Create integration test file `tests/integration/session-isolation.test.ts`
    - Setup: Create test helper for simulating multiple users
    - Test 1: Two users login simultaneously, verify sessions are isolated
    - Test 2: User A refreshes page, never gets User B's data
    - Test 3: Five users login concurrently, each gets correct session
    - Test 4: User logs out, subsequent requests return 401
    - Test 5: Multiple tabs same user work, different users stay isolated
    - Use actual NextAuth flow (not mocked) for realistic testing
    - Limit to 5-6 integration tests maximum
  - [x] 5.2 Create manual test script `scripts/test-session-isolation-manual.ts`
    - Script to run in staging before production deploy
    - Simulates real-world scenario: multiple users, page refreshes, concurrent logins
    - Outputs clear PASS/FAIL for each scenario
    - Includes instructions for manual verification in browser
    - Tests session expiry and renewal workflows
  - [x] 5.3 Create session monitoring queries in `SESSION_MONITORING.md`
    - SQL query: List all active sessions with user info
    - SQL query: Detect duplicate sessionTokens (should always return 0)
    - SQL query: Find sessions without valid userId
    - SQL query: Detect rapid session creation (> 10 sessions per minute per user)
    - SQL query: Find orphaned sessions (user deleted but session remains)
    - Include instructions for running queries in production Neon dashboard
  - [x] 5.4 Create emergency session cleanup documentation
    - Document process for clearing all sessions if vulnerability detected
    - SQL commands for safe session cleanup
    - Steps to invalidate all sessions and force re-login
    - Rollback procedure if fix causes issues
    - Communication template for notifying users of forced logout
  - [x] 5.5 Document session monitoring checklist for production
    - Pre-deploy checklist: environment variables verified, tests passed, manual verification done
    - Post-deploy monitoring: watch for session anomalies first 24 hours
    - Metrics to track: sessions created per hour, session-user ratio, mismatch warnings
    - Alert thresholds: > 0 duplicate sessions, > 0 user mismatches, rapid session spikes
    - Incident response process if session leakage detected
  - [x] 5.6 Run all session isolation tests
    - Run integration tests from 5.1 (5-6 tests)
    - Run manual test script from 5.2 in local environment
    - Verify SQL monitoring queries return expected results
    - Review emergency cleanup documentation for completeness
    - Run full test suite for this feature (tests from 1.1, 2.1, 3.1, 4.1, 5.1)
    - Expected total: approximately 14-22 tests maximum
    - Fix any failures before marking task complete

**Acceptance Criteria:**
- All feature-specific tests pass (14-22 tests total)
- Integration tests verify sessions are isolated under all scenarios
- Manual test script produces clear PASS/FAIL results
- Monitoring documentation includes actionable SQL queries
- Emergency cleanup process is documented and verified
- Production deployment checklist is complete

---

## Execution Order

**Recommended implementation sequence:**

1. **Task Group 1** - Configuration Layer (Cookie security, env validation)
   - Establishes foundation for secure session handling
   - Must be done first as other tasks depend on correct cookie config

2. **Task Group 2** - Logging Infrastructure (Session event logging)
   - Adds visibility into session operations
   - Required before refactoring to track changes

3. **Task Group 3** - Adapter Refactoring (Simplification, defensive checks)
   - Reduces complexity and potential bug vectors
   - Logging from Task Group 2 helps verify refactoring correctness

4. **Task Group 4** - Security Hardening (Headers audit, session validation)
   - Adds additional security layers
   - Builds on simplified adapter from Task Group 3

5. **Task Group 5** - Testing & Monitoring (Isolation tests, monitoring setup)
   - Validates all previous changes work together
   - Provides ongoing monitoring capabilities
   - Must be last to test complete integrated system

---

## Critical Pre-Production Checklist

Before deploying to production, verify ALL of the following:

- [ ] ✅ All 14-22 tests pass (run full feature test suite)
- [ ] ✅ Manual test script passes in staging environment
- [ ] ✅ Environment variables validated in Vercel production settings
- [ ] ✅ NEXTAUTH_URL exactly matches `https://compileandchill.dev`
- [ ] ✅ Cookie domain configuration verified for `.compileandchill.dev`
- [ ] ✅ Session monitoring queries tested against production database
- [ ] ✅ Emergency cleanup procedure reviewed and understood
- [ ] ✅ Two team members have reviewed all code changes
- [ ] ✅ Rollback plan prepared in case of issues
- [ ] ✅ Monitoring alerts configured for session anomalies

**⚠️ DO NOT DEPLOY TO PRODUCTION UNTIL ALL ITEMS ABOVE ARE CHECKED!**

---

## Post-Deployment Monitoring (First 24 Hours)

After production deployment, monitor the following:

1. **Immediate (First Hour):**
   - Watch for session creation errors in logs
   - Verify users can login successfully
   - Check that cookies are being set with correct domain
   - Monitor for any session mismatch warnings

2. **First 6 Hours:**
   - Run session monitoring SQL queries every hour
   - Verify no duplicate sessionTokens detected
   - Check session-to-user ratio is normal (< 3 sessions per user)
   - Monitor for user reports of login issues

3. **First 24 Hours:**
   - Review all session-related logs for anomalies
   - Verify session renewal works correctly
   - Check that logout properly destroys sessions
   - Document any issues for future reference

**Emergency Contact:** Keep team available for rapid response if issues detected

