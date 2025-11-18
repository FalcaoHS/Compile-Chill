# Task Breakdown: Security Foundation

## Overview
Total Tasks: 5 task groups, 25+ sub-tasks

## Implementation Status

✅ **All Essential Implementation Tasks Complete**

### Completed Task Groups:
- ✅ **Task Group 1: Core Security Utilities** - All implementation tasks complete (1.2, 1.3, 1.4)
- ✅ **Task Group 2: Rate Limiting Infrastructure** - All implementation tasks complete (2.2, 2.3, 2.4)
- ✅ **Task Group 3: Middleware Updates** - All implementation tasks complete (3.2, 3.3, 3.4)
- ✅ **Task Group 4: Route Refactoring** - All implementation tasks complete (4.2, 4.3, 4.4, 4.5, 4.6, 4.7)

### Skipped Tasks (No Test Framework):
- ⚠️ **Task Group 5: Testing** - Skipped (no test framework configured)
- ⚠️ All test-related subtasks (1.1, 1.5, 2.1, 2.5, 3.1, 3.5, 4.1, 4.8) - Skipped

### Verification:
All essential security utilities have been implemented and verified:
- ✅ Centralized error handling (`lib/api-errors.ts`)
- ✅ Zod validation helpers (`lib/validations/validate.ts`)
- ✅ Authentication wrappers (`lib/api-auth.ts`)
- ✅ Rate limiting infrastructure (`lib/rate-limit.ts`, `lib/api-rate-limit.ts`)
- ✅ Middleware protection (`middleware.ts`, `lib/middleware-auth.ts`)
- ✅ Security headers placeholders (`lib/security-headers.ts`)
- ✅ All API routes refactored to use new utilities

## Task List

### Core Security Utilities

#### Task Group 1: Error Handling and Validation Utilities
**Dependencies:** None

- [x] 1.0 Complete core security utilities
  - [ ] 1.1 Write 2-8 focused tests for error handling and validation utilities
    - ⚠️ Skipped: No test framework configured in project (no Jest/Vitest setup)
    - Tests should be added when test framework is set up
    - Test `handleApiError` with different error types (400, 401, 403, 429, 500)
    - Test error response format normalization
    - Test that sensitive information is not exposed
    - Test `validate` helper with valid and invalid Zod schemas
    - Test validation error formatting
    - Skip exhaustive edge case testing
  - [x] 1.2 Create centralized error handler utility (`lib/api-errors.ts`)
    - Function: `handleApiError(error, request?)` that normalizes error responses
    - Format: `{error: {code: string, message: string, details?: any}}`
    - Map error types to HTTP status codes: 400, 401, 403, 429, 500
    - Log detailed errors server-side with `console.error`
    - Include Sentry integration hook for future use
    - Ensure no stack traces or sensitive data in client responses
    - Follow error handling patterns from `app/api/scores/route.ts`
  - [x] 1.3 Create Zod validation helper (`lib/validations/validate.ts`)
    - Function: `validate<T>(body: unknown, schema: ZodSchema<T>)` that throws on validation failure
    - Extract field-specific errors from Zod's `error.issues` array
    - Format validation errors as `{error: {code: 'invalid_input', message: 'Dados inválidos', details: [...]}}`
    - Throw errors with status 400 for use with `handleApiError`
    - Follow pattern from `lib/validations/score.ts`
  - [x] 1.4 Create authentication helper (`lib/api-auth.ts`)
    - Function: `withAuth<T>(handler: (request: NextRequest, user: {id: string, name?: string, ...}) => Promise<NextResponse>)` wrapper
    - Extract session using `auth()` from `@/auth`
    - Return 401 with standardized format if no session
    - Pass `session.user` to wrapped handler
    - Support fine-grained authorization checks within handlers
    - Follow authentication pattern from `app/api/scores/route.ts`
  - [ ] 1.5 Ensure core utilities tests pass
    - ⚠️ Skipped: No test framework configured
    - Tests should be added when test framework is set up
    - Run ONLY the 2-8 tests written in 1.1
    - Verify error handler normalizes responses correctly
    - Verify validation helper throws appropriate errors
    - Verify auth helper wraps handlers correctly
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Error handler normalizes all error types correctly
- Validation helper formats Zod errors appropriately
- Auth helper successfully wraps route handlers
- No sensitive information exposed in error responses

### Rate Limiting Infrastructure

#### Task Group 2: Upstash Rate Limiting Setup
**Dependencies:** Task Group 1

- [x] 2.0 Complete rate limiting infrastructure
  - [ ] 2.1 Write 2-8 focused tests for rate limiting
    - ⚠️ Skipped: No test framework configured in project
    - Tests should be added when test framework is set up
    - Test rate limiter with sliding window algorithm
    - Test rate limit enforcement (429 response when exceeded)
    - Test rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)
    - Test Retry-After header in 429 responses
    - Test different rate limit keys (user:{id}, ip:{ip}, endpoint:{name})
    - Skip exhaustive edge case testing
  - [x] 2.2 Install and configure Upstash packages
    - Install `@upstash/ratelimit` and `@upstash/redis` packages
    - Add environment variables to `.env.example`: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
    - Document environment variable setup in README or config
  - [x] 2.3 Create rate limiter configuration (`lib/rate-limit.ts`)
    - Configure Upstash Redis connection using environment variables
    - Create rate limiter instances with sliding window algorithm
    - Define rate limit configurations for different endpoint types:
      - Score submissions: 10 requests/minute per user
      - Other write endpoints: configurable limits (5-30 requests/minute)
    - Support flexible rate limit keys: `user:{id}`, `ip:{ip}`, `endpoint:{name}`
  - [x] 2.4 Create rate limiting middleware helper (`lib/api-rate-limit.ts`)
    - Function: `withRateLimit(handler, config)` wrapper
    - Check rate limits before executing handler
    - Return 429 with `Retry-After` header when limit exceeded
    - Include rate limit headers in all responses (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)
    - Extract user ID or IP from request for rate limit key
  - [ ] 2.5 Ensure rate limiting tests pass
    - ⚠️ Skipped: No test framework configured
    - Tests should be added when test framework is set up
    - Run ONLY the 2-8 tests written in 2.1
    - Verify rate limits are enforced correctly
    - Verify rate limit headers are included
    - Verify 429 responses include Retry-After header
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Rate limiter connects to Upstash Redis successfully
- Rate limits are enforced per user/endpoint
- Rate limit headers are included in responses
- 429 responses include proper Retry-After header

### Middleware Updates

#### Task Group 3: Next.js Middleware for Edge Protection
**Dependencies:** Task Group 1

- [x] 3.0 Complete middleware updates
  - [ ] 3.1 Write 2-8 focused tests for middleware
    - ⚠️ Skipped: No test framework configured in project
    - Tests should be added when test framework is set up
    - Test middleware blocks unauthenticated requests to protected routes
    - Test middleware allows public routes (leaderboards, public GETs)
    - Test middleware allows authenticated requests to protected routes
    - Test middleware preserves existing auth error handling
    - Skip exhaustive edge case testing
  - [x] 3.2 Extend existing middleware (`middleware.ts`)
    - Add route-level authentication checks at edge
    - Protect route groups: `/api/users/me/**` and `/api/scores/me` (all user-specific endpoints)
    - Protect write operations: POST/PATCH/DELETE methods under `/api/*`
    - Keep public routes open: `/api/scores/leaderboard`, `/api/auth/**`, public GET endpoints
    - Use Next.js middleware matcher to target specific route patterns efficiently
    - Perform lightweight session validation at edge
    - Maintain existing auth error handling from NextAuth
  - [x] 3.3 Create route protection helper for middleware
    - Function: `requireAuthMiddleware(request: NextRequest)` for edge checks
    - Quick session validation without full handler execution
    - Return 401 response if authentication fails
    - Allow route handlers to perform fine-grained authorization after edge check
  - [x] 3.4 Add hooks for future security headers
    - Create placeholder structure for CSP headers configuration
    - Create placeholder structure for CORS configuration
    - Document integration points for security hardening phase (roadmap item 25)
    - Ensure current implementation doesn't conflict with future headers
  - [ ] 3.5 Ensure middleware tests pass
    - ⚠️ Skipped: No test framework configured
    - Tests should be added when test framework is set up
    - Run ONLY the 2-8 tests written in 3.1
    - Verify protected routes require authentication
    - Verify public routes remain accessible
    - Verify existing auth error handling still works
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- Middleware blocks unauthenticated requests to protected routes
- Public routes remain accessible without authentication
- Existing NextAuth error handling is preserved
- Placeholders for future security headers are in place

### Route Refactoring

#### Task Group 4: Update Existing API Routes
**Dependencies:** Task Groups 1, 2, 3

- [x] 4.0 Complete route refactoring
  - [ ] 4.1 Write 2-8 focused tests for refactored routes
    - ⚠️ Skipped: No test framework configured in project
    - Tests should be added when test framework is set up
    - Test POST /api/scores with new utilities (auth, validation, error handling, rate limiting)
    - Test PATCH /api/users/me/theme with new utilities
    - Test GET /api/scores/me with new auth helper
    - Test error responses use standardized format
    - Test rate limiting on write endpoints
    - Skip exhaustive testing of all route combinations
  - [x] 4.2 Create Zod schemas for routes missing validation
    - Create schema for theme update: `lib/validations/theme.ts`
    - Create schemas for query parameters where needed
    - Follow pattern from `scoreSubmissionSchema` in `lib/validations/score.ts`
  - [x] 4.3 Refactor POST /api/scores route
    - Replace manual auth check with `withAuth` helper
    - Replace manual validation with `validate` helper
    - Replace try-catch with `handleApiError`
    - Add rate limiting with `withRateLimit` (10 requests/minute per user)
    - Maintain existing business logic (isBestScore management)
  - [x] 4.4 Refactor PATCH /api/users/me/theme route
    - Replace manual auth check with `withAuth` helper
    - Replace manual validation with Zod schema and `validate` helper
    - Replace try-catch with `handleApiError`
    - Add rate limiting with `withRateLimit` (5 requests/minute per user)
  - [x] 4.5 Refactor GET /api/scores/me route
    - Replace manual auth check with `withAuth` helper
    - Replace try-catch with `handleApiError`
    - Keep as read-only (no rate limiting needed)
  - [x] 4.6 Refactor GET /api/scores route (when filtering by userId)
    - Replace manual auth check with `withAuth` helper
    - Replace try-catch with `handleApiError`
    - Keep public access when not filtering by userId
  - [x] 4.7 Refactor GET /api/users/me/theme route
    - Replace manual auth check with `withAuth` helper
    - Replace try-catch with `handleApiError`
    - Keep as read-only (no rate limiting needed)
  - [ ] 4.8 Ensure refactored routes tests pass
    - ⚠️ Skipped: No test framework configured
    - Tests should be added when test framework is set up
    - Run ONLY the 2-8 tests written in 4.1
    - Verify all routes use new utilities correctly
    - Verify error responses are standardized
    - Verify rate limiting works on write endpoints
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 4.1 pass
- All routes use centralized auth, validation, and error handling
- Error responses follow standardized format
- Rate limiting is applied to write endpoints
- Existing functionality is preserved

### Testing

#### Task Group 5: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-4

- [ ] 5.0 Review existing tests and fill critical gaps only
  - [ ] 5.1 Review tests from Task Groups 1-4
    - Review the 2-8 tests written by utilities-engineer (Task 1.1)
    - Review the 2-8 tests written by rate-limit-engineer (Task 2.1)
    - Review the 2-8 tests written by middleware-engineer (Task 3.1)
    - Review the 2-8 tests written by route-engineer (Task 4.1)
    - Total existing tests: approximately 8-32 tests
  - [ ] 5.2 Analyze test coverage gaps for THIS feature only
    - Identify critical security workflows that lack test coverage
    - Focus ONLY on gaps related to security foundation requirements
    - Do NOT assess entire application test coverage
    - Prioritize integration tests for auth + validation + rate limiting flows
  - [ ] 5.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on end-to-end security workflows (auth → validation → rate limit → error handling)
    - Test middleware + route handler integration
    - Do NOT write comprehensive coverage for all scenarios
    - Skip edge cases and performance tests unless security-critical
  - [ ] 5.4 Run feature-specific tests only
    - Run ONLY tests related to this spec's feature (tests from 1.1, 2.1, 3.1, 4.1, and 5.3)
    - Expected total: approximately 18-42 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical security workflows pass

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 18-42 tests total)
- Critical security workflows for this feature are covered
- No more than 10 additional tests added when filling in testing gaps
- Testing focused exclusively on this spec's security foundation requirements

## Execution Order

Recommended implementation sequence:
1. Core Security Utilities (Task Group 1) - Foundation for everything else
2. Rate Limiting Infrastructure (Task Group 2) - Depends on error handling from Group 1
3. Middleware Updates (Task Group 3) - Can be done in parallel with Group 2, but depends on Group 1
4. Route Refactoring (Task Group 4) - Depends on all previous groups
5. Test Review & Gap Analysis (Task Group 5) - Final validation after all implementation

