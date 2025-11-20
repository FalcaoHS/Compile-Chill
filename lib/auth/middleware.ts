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
    // PT: Obtém sessão usando NextAuth | EN: Get session using NextAuth | ES: Obtiene sesión usando NextAuth | FR: Obtient session avec NextAuth | DE: Ruft Sitzung mit NextAuth ab
    // PT: Pode falhar no Edge runtime se Prisma usado no adapter | EN: May fail in Edge runtime if Prisma used in adapter | ES: Puede fallar en Edge runtime si Prisma usado en adapter | FR: Peut échouer en Edge runtime si Prisma utilisé dans adapter | DE: Kann im Edge-Runtime fehlschlagen, wenn Prisma im Adapter verwendet wird
    // PT: Rotas usando withAuth farão autenticação nos handlers (Node.js runtime) | EN: Routes using withAuth will handle auth in handlers (Node.js runtime) | ES: Rutas usando withAuth manejarán auth en handlers (Node.js runtime) | FR: Routes avec withAuth géreront auth dans handlers (Node.js runtime) | DE: Routen mit withAuth behandeln Auth in Handlern (Node.js-Runtime)
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

    // PT: Usuário autenticado, permite requisição prosseguir | EN: User authenticated, allow request to proceed | ES: Usuario autenticado, permite que solicitud continúe | FR: Utilisateur authentifié, permet à la requête de continuer | DE: Benutzer authentifiziert, Anfrage fortfahren lassen
    return null
  } catch (error) {
    // PT: Se auth() falhar (ex: Edge runtime com Prisma), permite prosseguir | EN: If auth() fails (e.g., Edge runtime with Prisma), allow to proceed | ES: Si auth() falla (ej: Edge runtime con Prisma), permite continuar | FR: Si auth() échoue (ex: Edge runtime avec Prisma), permet de continuer | DE: Wenn auth() fehlschlägt (z.B. Edge-Runtime mit Prisma), fortfahren lassen
    // PT: Handlers com withAuth farão verificação adequada (Node.js runtime) | EN: Handlers with withAuth will perform proper check (Node.js runtime) | ES: Handlers con withAuth harán verificación adecuada (Node.js runtime) | FR: Handlers avec withAuth feront vérification appropriée (Node.js runtime) | DE: Handler mit withAuth führen ordnungsgemäße Prüfung durch (Node.js-Runtime)
    // PT: Isso evita bloquear requisições por limitações do Edge runtime | EN: This prevents blocking requests due to Edge runtime limitations | ES: Esto evita bloquear solicitudes por limitaciones de Edge runtime | FR: Cela évite de bloquer les requêtes à cause des limitations Edge runtime | DE: Dies verhindert Blockierung von Anfragen aufgrund von Edge-Runtime-Limitierungen
    if (error instanceof Error && error.message.includes('edge runtime')) {
      // PT: Permite silenciosamente prosseguir - handler verificará auth | EN: Silently allow to proceed - handler will verify auth | ES: Permite silenciosamente continuar - handler verificará auth | FR: Permet silencieusement de continuer - handler vérifiera auth | DE: Lässt stillschweigend fortfahren - Handler wird Auth prüfen
      return null
    }
    // PT: Para outros erros, permite prosseguir (handler tratará) | EN: For other errors, allow to proceed (handler will handle) | ES: Para otros errores, permite continuar (handler manejará) | FR: Pour autres erreurs, permet de continuer (handler gérera) | DE: Bei anderen Fehlern fortfahren lassen (Handler wird behandeln)
    
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
  // PT: API routes NÃO devem ser verificadas no middleware (limitações Edge Runtime) | EN: API routes should NOT be checked in middleware (Edge Runtime limitations) | ES: Rutas API NO deben verificarse en middleware (limitaciones Edge Runtime) | FR: Routes API ne doivent PAS être vérifiées dans middleware (limitations Edge Runtime) | DE: API-Routen sollten NICHT im Middleware geprüft werden (Edge-Runtime-Limitierungen)
  // PT: Rotas API usam withAuth() que roda em Node.js runtime (Prisma funciona) | EN: API routes use withAuth() running in Node.js runtime (Prisma works) | ES: Rutas API usan withAuth() que corre en Node.js runtime (Prisma funciona) | FR: Routes API utilisent withAuth() dans Node.js runtime (Prisma fonctionne) | DE: API-Routen verwenden withAuth() im Node.js-Runtime (Prisma funktioniert)
  // PT: Retorna false para todas as rotas API para evitar erros Prisma no Edge | EN: Returns false for all API routes to avoid Prisma Edge Runtime errors | ES: Retorna false para todas las rutas API para evitar errores Prisma Edge Runtime | FR: Retourne false pour toutes routes API pour éviter erreurs Prisma Edge Runtime | DE: Gibt false für alle API-Routen zurück, um Prisma Edge-Runtime-Fehler zu vermeiden
  
  // PT: Ignora verificação de autenticação para TODAS as rotas API no middleware | EN: Skip auth check for ALL API routes in middleware | ES: Omite verificación auth para TODAS las rutas API en middleware | FR: Ignore vérification auth pour TOUTES routes API dans middleware | DE: Auth-Prüfung für ALLE API-Routen im Middleware überspringen
  // PT: Handlers de rotas API usam withAuth() que roda em Node.js runtime | EN: API route handlers use withAuth() running in Node.js runtime | ES: Handlers de rutas API usan withAuth() que corre en Node.js runtime | FR: Handlers de routes API utilisent withAuth() dans Node.js runtime | DE: API-Route-Handler verwenden withAuth() im Node.js-Runtime
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

