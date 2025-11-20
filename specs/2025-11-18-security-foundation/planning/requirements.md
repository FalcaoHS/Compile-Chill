# Spec Requirements: Security Foundation

## Initial Description

Security Foundation — Implement security middleware: protected API routes with NextAuth session validation, generic error handling (no sensitive error exposure), input validation with Zod schemas, and rate limiting on score submission endpoints `M`

## Requirements Discussion

### First Round Questions

**Q1:** I'm assuming we should create a reusable middleware/helper function that wraps protected routes (like a `withAuth()` wrapper or Next.js middleware) to avoid repeating the same auth check in every route handler. Is that correct, or would you prefer to keep auth checks inline in each route?

**Answer:** Centralizado + wrapper por rota. Crie um middleware reutilizável que faça checks rápidos (ex.: requireAuthMiddleware) e um helper para handlers withAuth(handler) que valida dentro do handler quando precisar de info adicional (ex.: verificar ownership). Isso reduz duplicação e mantém flexibilidade.

**Q2:** I'm assuming we should only protect routes that modify data (POST/PATCH/DELETE) and user-specific GET endpoints, while keeping public routes like leaderboards open. Is that correct, or should all `/api/*` routes require authentication by default?

**Answer:** Proteja apenas rotas que alteram dados (POST/PATCH/DELETE) e GETs que retornam dados sensíveis do usuário (/api/scores/me, /api/users/me/*). Rotas públicas (leaderboards, assets, listagens públicas) permanecem abertas.

**Q3:** I'm assuming we should use `@upstash/ratelimit` (as mentioned in tech-stack.md) with something like 10 submissions per minute per user for score submission endpoints. Should we apply rate limiting to all write endpoints (POST/PATCH/DELETE) or only score submissions?

**Answer:** Use Upstash (@upstash/ratelimit) com Redis (Upstash) e aplique: Principal: score submission endpoint (POST /api/scores) — exemplo: 10 requisições/minuto por usuário. Amplie para todos os endpoints de escrita (POST/PATCH/DELETE) com limites menores ou leveis diferentes por endpoint (ex.: 5/min para criação de posts, 30/min para likes). Não usar in-memory em produção.

**Q4:** I'm assuming we should create a centralized error handler utility that standardizes error format, logging, and responses across all API routes. Is that correct, or should we keep the current per-route try-catch pattern?

**Answer:** Criar um erro padrão + handler utilitário (handleApiError) que: normaliza respostas ({error:{ code, message }}), faz console.error (ou envia para Sentry), retorna status apropriado (400/401/403/429/500). Use-o em todos os handlers.

**Q5:** I'm assuming we should require Zod schemas for all API route inputs and create a validation helper to avoid manual validation scattered across routes. Is that correct, or should we keep manual validation for simple cases?

**Answer:** Obrigatória: usar Zod para todos os inputs de rota. Crie helper validate(body, schema) que dispara 400 com mensagens amigáveis. Evita validação manual espalhada.

**Q6:** I'm assuming we should use a hybrid approach: Next.js middleware for route-level protection at the edge, and route handlers for fine-grained authorization. Is that correct, or should we handle all protection inside route handlers?

**Answer:** Híbrido (recomendado): Next.js middleware (edge): bloqueio por padrão para grupos de rotas (ex.: /api/me/**, /api/scores/*/private) para reduzir custo. Route handlers: checagens finas (ownership, permissões, roles, limites por usuário). Isso dá performance + segurança granular.

**Q7:** I'm assuming we should use Upstash Redis for rate limiting storage (persistent, works across instances) rather than in-memory storage. Is that correct?

**Answer:** Upstash Redis (ou Redis gerenciado). Motivo: persistente, cross-instance, confiável para limites globais. Não use in-memory em produção.

**Q8:** I'm assuming this spec should only include the security foundation (auth middleware, error handling, validation helpers, rate limiting), with security hardening (CSP headers, CORS, CSRF protection) left for a separate phase. Is that correct, or should we include hardening in this spec?

**Answer:** Apenas a fundação de segurança: auth middleware, error handler, Zod helpers, rate limiting, basic edge middleware. Hardening (CSP, CORS, CSRF, headers HSTS, security scans) fica em fase seguinte — mas deixar hooks para aplicar CSP/CORS globalmente desde já é recomendado.

### Existing Code to Reference

**Similar Features Identified:**
- Feature: Authentication checks in API routes - Path: `app/api/scores/route.ts`, `app/api/users/me/theme/route.ts`
- Pattern: Manual `auth()` calls with session validation repeated across routes
- Pattern: Generic error handling with console.error and user-friendly messages
- Pattern: Zod validation already used in `app/api/scores/route.ts` with `scoreSubmissionSchema`
- Pattern: Basic middleware exists at `middleware.ts` but only handles auth errors, not route protection
- Backend logic to reference: Existing error handling patterns that return generic messages and log details server-side

### Follow-up Questions

No follow-up questions needed - all requirements were comprehensively answered.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
No visual assets provided.

## Requirements Summary

### Functional Requirements
- Create centralized authentication middleware (`requireAuthMiddleware`) for quick checks at edge
- Create `withAuth(handler)` helper wrapper for route handlers that need additional info (ownership, permissions)
- Protect only routes that modify data (POST/PATCH/DELETE) and sensitive user GET endpoints (/api/scores/me, /api/users/me/*)
- Keep public routes open (leaderboards, public listings, assets)
- Implement rate limiting using @upstash/ratelimit with Upstash Redis
- Apply rate limiting to score submission endpoint (POST /api/scores) with 10 requests/minute per user
- Extend rate limiting to all write endpoints (POST/PATCH/DELETE) with different limits per endpoint type
- Create centralized error handler utility (`handleApiError`) that:
  - Normalizes error responses to format: `{error: {code, message}}`
  - Logs errors server-side (console.error or Sentry)
  - Returns appropriate status codes (400/401/403/429/500)
- Require Zod validation for all API route inputs
- Create `validate(body, schema)` helper that throws 400 with friendly messages
- Implement hybrid protection: Next.js middleware for route-level edge protection + route handlers for fine-grained authorization
- Use Upstash Redis for rate limiting storage (not in-memory)
- Leave hooks for CSP/CORS global application (but don't implement hardening in this phase)

### Reusability Opportunities
- Existing authentication pattern: `auth()` function from `@/auth` used across routes
- Existing error handling pattern: Generic messages to users, detailed logging server-side
- Existing validation pattern: Zod schemas already used in score submission (`scoreSubmissionSchema`)
- Existing middleware: Basic middleware at `middleware.ts` can be extended
- Existing API route structure: Next.js App Router route handlers pattern to follow

### Scope Boundaries

**In Scope:**
- Centralized authentication middleware and helpers
- Route protection for write operations and sensitive GET endpoints
- Rate limiting with Upstash Redis for write endpoints
- Centralized error handling utility
- Zod validation helper for all route inputs
- Next.js middleware for edge-level route protection
- Hooks/placeholders for CSP/CORS (not full implementation)

**Out of Scope:**
- Full security hardening (CSP headers, CORS configuration, CSRF protection, HSTS headers) - deferred to roadmap item 25
- Security audit of all endpoints - deferred to roadmap item 25
- Comprehensive input sanitization for all user-generated content - deferred to roadmap item 25
- In-memory rate limiting solutions
- Authentication for public routes
- Advanced authorization (roles, permissions beyond basic ownership checks)

### Technical Considerations
- Integration with existing NextAuth setup (`@/auth`)
- Integration with existing Prisma database queries
- Use of @upstash/ratelimit and @upstash/redis packages
- Next.js App Router middleware patterns
- Environment variables for Upstash Redis connection (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN)
- Error logging integration (console.error or Sentry)
- Rate limiting keys: user:{id}, ip:{ip}, endpoint:{name} for flexible limits
- JWT/Session cookie security (SameSite=Lax, HttpOnly)
- 429 responses should include retry-after header
- Testing requirements: simulate rate limits and auth failures in automated tests
- Error response format: `{error: {code: string, message: string, details?: any}}`

