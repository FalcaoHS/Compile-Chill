## Tech stack

This document defines the technical stack for Compile & Chill. All development should follow these choices to maintain consistency across the project.

### Framework & Runtime
- **Application Framework:** Next.js 14 (App Router)
- **Language/Runtime:** Node.js
- **Package Manager:** npm

### Frontend
- **JavaScript Framework:** Next.js 14 with React (App Router)
- **CSS Framework:** TailwindCSS
- **Animation Library:** Framer Motion (for light animations and transitions)
- **State Management:** Zustand or Jotai (for local state management)
- **Game Rendering:**
  - Pixi.js (for games requiring more visual effects)
  - Canvas API (for simple games)
- **UI Components:** Custom components built with TailwindCSS and Framer Motion

### Backend
- **API Framework:** Next.js API Routes
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth with X (Twitter) OAuth provider

### Database & Storage
- **Database:** PostgreSQL
- **ORM/Query Builder:** Prisma
- **Hosting/Storage:** SquareCloud

### Image Generation & Sharing
- **Game Result Images:** html-to-image or Canvas API (for personalized game result images)
- **Social Sharing Images:** @vercel/og (for social media sharing images)

### Testing & Quality
- **Test Framework:** (To be determined based on project needs)
- **Linting/Formatting:** ESLint, Prettier (following project standards)

### Deployment & Infrastructure
- **Hosting:** SquareCloud
- **CI/CD:** (To be determined based on project needs)

### Third-Party Services
- **Authentication:** NextAuth (X OAuth integration)
- **Social Platform:** X (Twitter) for OAuth and sharing
- **Monitoring:** (To be determined based on project needs)

### Security
- **Authentication & Authorization:** NextAuth session management with protected API routes and middleware
- **Input Validation:** Server-side validation using Zod schema validation library for all API inputs
- **Validation Library:** Zod (for type-safe schema validation)
- **Score Integrity:** Server-side game logic validation to prevent score manipulation via client-side scripts
- **Error Handling:** Generic error messages for users; detailed errors only in server logs (never expose stack traces, database errors, or internal details)
- **Rate Limiting:** API rate limiting to prevent abuse (using libraries like `@upstash/ratelimit` or similar)
- **CORS Configuration:** Proper CORS settings for API routes
- **XSS Protection:** Content Security Policy (CSP) headers, input sanitization, and safe rendering practices
- **CSRF Protection:** Built-in Next.js CSRF protection for API routes
- **SQL Injection Prevention:** Prisma ORM with parameterized queries (never raw SQL with user input)
- **Environment Variables:** Secure storage of secrets, API keys, and sensitive configuration
- **Protected Routes:** Middleware to protect authenticated routes and API endpoints
- **Data Sanitization:** Sanitize all user inputs before database storage and display

### Development Tools
- **Version Control:** Git
- **Package Manager:** npm
- **Build Tool:** Next.js built-in build system

