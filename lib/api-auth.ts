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
      // PT: Obtém sessão autenticada | EN: Get authenticated session | ES: Obtiene sesión autenticada | FR: Obtient la session authentifiée | DE: Ruft authentifizierte Sitzung ab
      // PT: NextAuth v5 lê cookies automaticamente do contexto da requisição | EN: NextAuth v5 auto-reads cookies from request context | ES: NextAuth v5 lee cookies automáticamente del contexto | FR: NextAuth v5 lit automatiquement les cookies du contexte | DE: NextAuth v5 liest Cookies automatisch aus dem Kontext
      const session = await auth()

      // PT: Verifica se sessão existe e tem ID de usuário | EN: Check if session exists and has user ID | ES: Verifica si sesión existe y tiene ID de usuario | FR: Vérifie si session existe et a un ID utilisateur | DE: Prüft, ob Sitzung existiert und Benutzer-ID hat
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

      // PT: Extrai dados do usuário da sessão | EN: Extract user data from session | ES: Extrae datos del usuario de la sesión | FR: Extrait les données utilisateur de la session | DE: Extrahiert Benutzerdaten aus der Sitzung
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

