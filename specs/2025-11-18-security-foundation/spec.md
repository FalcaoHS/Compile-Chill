# Specification: Security Foundation

## Goal
Implement centralized security infrastructure including authentication middleware, error handling utilities, Zod validation helpers, and rate limiting to protect API routes and prevent abuse while maintaining code reusability and consistency.

## User Stories
- As a developer, I want protected API routes to use centralized authentication middleware so that security checks are consistent and maintainable across all endpoints
- As a user, I want rate limiting on score submissions so that the system remains fair and prevents abuse
- As a developer, I want standardized error handling so that users receive clear messages without exposing sensitive technical details

## Specific Requirements

**Centralized Authentication Middleware**
- Create `requireAuthMiddleware` function for quick edge-level authentication checks in Next.js middleware
- Create `withAuth(handler)` helper wrapper for route handlers that validates session and provides user context
- `withAuth` should extract session using `auth()` from `@/auth` and pass `session.user` to wrapped handler
- Middleware should protect routes matching patterns: `/api/me/**`, `/api/scores/*/private`, and all POST/PATCH/DELETE methods under `/api/*`
- Keep public routes open: `/api/scores/leaderboard`, public GET endpoints, and asset routes
- Return 401 with standardized error format `{error: {code: 'unauthorized', message: 'Não autorizado'}}` when authentication fails
- Integrate with existing NextAuth session management from `@/auth`
- Allow fine-grained authorization checks (ownership, permissions) within route handlers after authentication

**Centralized Error Handling Utility**
- Create `handleApiError` utility function that normalizes all error responses to format `{error: {code: string, message: string, details?: any}}`
- Log detailed errors server-side using `console.error` (with future Sentry integration hook)
- Map error types to appropriate HTTP status codes: 400 (validation), 401 (unauthorized), 403 (forbidden), 429 (rate limit), 500 (server error)
- Ensure no sensitive information (stack traces, database errors, internal paths) is exposed to clients
- Replace all existing try-catch blocks in API routes with centralized error handler
- Support custom error codes and messages while maintaining consistent response structure
- Include error context in server logs for debugging while keeping user messages generic
- Integrate with existing error handling patterns from `app/api/scores/route.ts` and `app/api/users/me/theme/route.ts`

**Zod Validation Helper**
- Create `validate(body, schema)` helper function that accepts request body and Zod schema
- Throw validation errors with status 400 and user-friendly error messages
- Format validation errors as `{error: {code: 'invalid_input', message: 'Dados inválidos', details: [field-specific errors]}}`
- Extract field-specific error messages from Zod's `error.issues` array
- Require Zod schemas for all API route inputs (request body, query parameters, path parameters)
- Replace manual validation in routes like `app/api/users/me/theme/route.ts` with Zod schemas
- Extend existing `scoreSubmissionSchema` pattern from `lib/validations/score.ts` to all routes
- Ensure validation happens before any business logic or database operations

**Rate Limiting with Upstash**
- Install and configure `@upstash/ratelimit` and `@upstash/redis` packages
- Configure Upstash Redis connection using environment variables: `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- Create rate limiter instances with sliding window algorithm for different endpoint types
- Apply rate limiting to POST `/api/scores` endpoint: 10 requests per minute per user (key: `score:{userId}`)
- Extend rate limiting to all write endpoints (POST/PATCH/DELETE) with endpoint-specific limits
- Use flexible rate limit keys: `user:{id}`, `ip:{ip}`, `endpoint:{name}` for different strategies
- Return 429 status with `Retry-After` header when rate limit is exceeded
- Include rate limit information in response headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)

**Next.js Middleware for Edge Protection**
- Extend existing `middleware.ts` to include route-level authentication checks at edge
- Protect route groups: `/api/me/**` (all user-specific endpoints), write operations under `/api/*`
- Use Next.js middleware matcher to target specific route patterns efficiently
- Perform lightweight session validation at edge to reduce server load
- Allow route handlers to perform fine-grained authorization after edge check passes
- Maintain existing auth error handling from NextAuth in middleware
- Keep middleware focused on quick checks, delegate detailed validation to route handlers

**Hooks for Future Security Hardening**
- Create placeholder structure for CSP (Content Security Policy) headers configuration
- Create placeholder structure for CORS configuration
- Design error handler and middleware to support future CSP/CORS integration
- Document integration points for security hardening phase (roadmap item 25)
- Ensure current implementation doesn't conflict with future security headers

## Visual Design
No visual assets provided.

## Existing Code to Leverage

**Authentication Pattern from `app/api/scores/route.ts` and `app/api/users/me/theme/route.ts`**
- Existing pattern of calling `auth()` from `@/auth` to get session
- Manual session validation with `if (!session?.user?.id)` checks
- Return 401 with `{error: "Não autorizado"}` format
- Extract `userId` using `parseInt(session.user.id)` pattern

**Error Handling Pattern from Existing API Routes**
- Generic error messages to users: "Não foi possível salvar o score. Tente novamente."
- Detailed error logging with `console.error` server-side only
- Try-catch blocks wrapping route handler logic
- Consistent error response format already emerging across routes

**Zod Validation Pattern from `lib/validations/score.ts`**
- Existing `scoreSubmissionSchema` demonstrates Zod schema structure
- Use of `safeParse()` method for validation
- Error extraction from `validationResult.error.errors`
- Type inference with `z.infer<typeof schema>` pattern

**Middleware Structure from `middleware.ts`**
- Existing Next.js middleware setup with `NextRequest` and `NextResponse`
- Matcher configuration for route targeting
- Error handling and redirect patterns
- Integration with NextAuth error handling

**API Route Structure from Next.js App Router**
- Route handler pattern: `export async function POST(request: NextRequest)`
- Use of `NextRequest` and `NextResponse` types
- Request body parsing with `await request.json()`
- Query parameter extraction from `request.nextUrl.searchParams`

## Out of Scope
- Full Content Security Policy (CSP) headers implementation - deferred to roadmap item 25
- Complete CORS configuration and cross-origin policies - deferred to roadmap item 25
- CSRF protection implementation - deferred to roadmap item 25
- HSTS (HTTP Strict Transport Security) headers - deferred to roadmap item 25
- Comprehensive security audit of all endpoints - deferred to roadmap item 25
- Full input sanitization for all user-generated content - deferred to roadmap item 25
- In-memory rate limiting solutions (must use Upstash Redis)
- Authentication requirements for public routes (leaderboards, public listings)
- Advanced authorization features (roles, permissions beyond basic ownership checks)
- Rate limiting for read-only GET endpoints (only write operations require rate limiting)

