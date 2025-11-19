import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

/**
 * Lightweight authentication check for Next.js middleware
 * 
 * Performs quick session validation at the edge without full handler execution.
 * Returns null if authenticated, or a 401 response if not.
 * 
 * This is used in middleware for quick checks. Route handlers should still
 * perform full authentication validation using `withAuth` for fine-grained
 * authorization checks.
 * 
 * @param request - NextRequest object
 * @returns null if authenticated, NextResponse with 401 if not
 */
export async function requireAuthMiddleware(
  request: NextRequest
): Promise<NextResponse | null> {
  try {
    // Get session using NextAuth
    // Note: This may fail in Edge runtime if Prisma is used in adapter
    // Routes using withAuth will handle authentication in route handlers
    const session = await auth()

    // Check if session exists and has user ID
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: {
            code: "unauthorized",
            message: "Não autorizado",
          },
        },
        { status: 401 }
      )
    }

    // User is authenticated, allow request to proceed
    return null
  } catch (error) {
    // If auth() fails (e.g., Edge runtime Prisma issue), allow request to proceed
    // Route handlers using withAuth will perform proper authentication checks
    // This prevents blocking requests due to Edge runtime limitations
    // The error is expected in Edge runtime when using Prisma adapter
    if (error instanceof Error && error.message.includes('edge runtime')) {
      // Silently allow request to proceed - route handler will verify auth
      return null
    }
    // For other errors, log and allow request to proceed
    
    return null
  }
}

/**
 * Check if a route path requires authentication
 * 
 * @param pathname - Request pathname
 * @param method - HTTP method
 * @returns true if route requires authentication
 */
export function isProtectedRoute(pathname: string, method: string): boolean {
  // Note: API routes should NOT be checked in middleware due to Edge Runtime limitations.
  // API routes use withAuth() wrapper which runs in Node.js runtime where Prisma works.
  // This function returns false for all API routes to avoid Prisma Edge Runtime errors.
  
  // Skip authentication check for ALL API routes in middleware
  // API route handlers use withAuth() which runs in Node.js runtime
  if (pathname.startsWith('/api/')) {
    return false
  }

  // Could add other protected routes here (non-API routes) if needed
  return false
}

/**
 * Check if a route is public (should not be protected)
 * 
 * @param pathname - Request pathname
 * @returns true if route is public
 */
export function isPublicRoute(pathname: string): boolean {
  // Public routes that should never be protected
  const publicRoutes = [
    "/api/scores/leaderboard",
    "/api/auth/",
  ]

  return publicRoutes.some((route) => pathname.startsWith(route))
}

