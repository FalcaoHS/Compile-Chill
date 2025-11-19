import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {
  requireAuthMiddleware,
  isProtectedRoute,
  isPublicRoute,
} from "@/lib/middleware-auth"
import { applySecurityHeaders } from "@/lib/security-headers"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method

  // Handle authentication errors from NextAuth
  const error = request.nextUrl.searchParams.get("error")
  
  if (error) {
    // Log error server-side only
    
    
    // Return generic error response
    return NextResponse.redirect(
      new URL("/?error=auth_failed", request.url)
    )
  }

  // Skip protection for public routes
  if (isPublicRoute(pathname)) {
    const response = NextResponse.next()
    // Apply security headers to public routes too
    const securityHeaders = applySecurityHeaders(request)
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  // Check if route requires authentication
  if (isProtectedRoute(pathname, method)) {
    // Perform lightweight authentication check at edge
    const authResult = await requireAuthMiddleware(request)
    
    if (authResult) {
      // Authentication failed, return 401 response
      // Apply security headers even to error responses
      const securityHeaders = applySecurityHeaders(request)
      Object.entries(securityHeaders).forEach(([key, value]) => {
        authResult.headers.set(key, value)
      })
      return authResult
    }
    
    // User is authenticated, allow request to proceed
    // Route handlers will perform fine-grained authorization checks
  }

  // Create response and apply security headers
  const response = NextResponse.next()
  const securityHeaders = applySecurityHeaders(request)
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: [
    // Match all API routes except static files
    "/api/:path*",
    // Also match auth routes for error handling
    "/api/auth/:path*",
  ],
}

