import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {
  requireAuthMiddleware,
  isProtectedRoute,
  isPublicRoute,
} from "@/lib/auth/middleware"
import { applySecurityHeaders } from "@/lib/security-headers"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method

  // PT: Trata erros de autenticação do NextAuth | EN: Handle NextAuth auth errors | ES: Maneja errores de autenticación de NextAuth | FR: Gère les erreurs d'authentification NextAuth | DE: Behandelt NextAuth-Authentifizierungsfehler
  const error = request.nextUrl.searchParams.get("error")
  
  if (error) {
    // Log error server-side only
    
    
    // Return generic error response
    return NextResponse.redirect(
      new URL("/?error=auth_failed", request.url)
    )
  }

  // PT: Ignora proteção para rotas públicas | EN: Skip protection for public routes | ES: Omite protección para rutas públicas | FR: Ignore la protection pour les routes publiques | DE: Schutz für öffentliche Routen überspringen
  if (isPublicRoute(pathname)) {
    const response = NextResponse.next()
    // PT: Aplica headers de segurança mesmo em rotas públicas | EN: Apply security headers to public routes too | ES: Aplica headers de seguridad también en rutas públicas | FR: Applique les en-têtes de sécurité aux routes publiques aussi | DE: Sicherheitsheader auch auf öffentliche Routen anwenden
    const securityHeaders = applySecurityHeaders(request)
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  // PT: Verifica se rota requer autenticação | EN: Check if route requires authentication | ES: Verifica si la ruta requiere autenticación | FR: Vérifie si la route nécessite une authentification | DE: Prüft, ob Route Authentifizierung erfordert
  if (isProtectedRoute(pathname, method)) {
    // PT: Verificação leve de autenticação no edge (sem Prisma) | EN: Lightweight auth check at edge (no Prisma) | ES: Verificación ligera de auth en edge (sin Prisma) | FR: Vérification d'auth légère au edge (sans Prisma) | DE: Leichte Auth-Prüfung am Edge (ohne Prisma)
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

