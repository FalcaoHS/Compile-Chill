import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { ApiErrors, handleApiError } from "@/lib/api-errors"

/**
 * User type from NextAuth session
 */
export type AuthenticatedUser = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

/**
 * Authenticated route handler type
 * 
 * The handler receives the request and authenticated user object
 */
export type AuthenticatedHandler = (
  request: NextRequest,
  user: AuthenticatedUser
) => Promise<NextResponse>

/**
 * Authentication wrapper for API route handlers
 * 
 * Validates that the user is authenticated and passes the user object
 * to the wrapped handler. Returns 401 if authentication fails.
 * 
 * Supports fine-grained authorization checks within the handler
 * (e.g., ownership verification, permissions).
 * 
 * @param handler - Route handler function that requires authentication
 * @returns Wrapped handler that validates authentication before execution
 * 
 * @example
 * ```ts
 * export const POST = withAuth(async (request, user) => {
 *   // user is guaranteed to be authenticated here
 *   const userId = parseInt(user.id)
 *   // ... handler logic
 * })
 * ```
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Get authenticated session
      // In NextAuth v5, auth() automatically reads cookies from the current request context
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

      // Extract user from session
      const user: AuthenticatedUser = {
        id: session.user.id,
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      }

      // Call the handler with authenticated user
      return await handler(request, user)
    } catch (error) {
      // Use centralized error handler
      return handleApiError(error, request)
    }
  }
}

/**
 * Get authenticated user from request
 * 
 * Utility function to extract authenticated user without wrapping a handler.
 * Useful for conditional authentication checks.
 * 
 * @param request - NextRequest object
 * @returns AuthenticatedUser if authenticated, null otherwise
 */
export async function getAuthenticatedUser(
  request?: NextRequest
): Promise<AuthenticatedUser | null> {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return null
    }

    return {
      id: session.user.id,
      name: session.user.name ?? null,
      email: session.user.email ?? null,
      image: session.user.image ?? null,
    }
  } catch {
    return null
  }
}

