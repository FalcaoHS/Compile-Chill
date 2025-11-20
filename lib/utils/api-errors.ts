import { NextRequest, NextResponse } from "next/server"

/**
 * API Error interface for standardized error responses
 */
export interface ApiError {
  status: number
  code: string
  message: string
  details?: any
}

/**
 * Centralized error handler for API routes
 * 
 * Normalizes all error responses to format: {error: {code, message, details?}}
 * Logs detailed errors server-side while keeping user messages generic
 * 
 * @param error - The error to handle (can be Error, ApiError, or unknown)
 * @param request - Optional NextRequest for logging context
 * @returns NextResponse with standardized error format
 */
export function handleApiError(
  error: unknown,
  request?: NextRequest
): NextResponse {
  // Log detailed error server-side only
  const errorContext = {
    error,
    url: request?.url,
    method: request?.method,
    timestamp: new Date().toISOString(),
  }
  

  // Handle ApiError type (custom errors with status codes)
  if (error && typeof error === "object" && "status" in error) {
    const apiError = error as ApiError
    return NextResponse.json(
      {
        error: {
          code: apiError.code || "error",
          message: apiError.message || "Ocorreu um erro. Tente novamente.",
          ...(apiError.details && { details: apiError.details }),
        },
      },
      { status: apiError.status }
    )
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    // Map common error patterns to status codes
    let status = 500
    let code = "server_error"
    let message = "Ocorreu um erro. Tente novamente."

    // Check for specific error types
    if (error.message.includes("validation") || error.message.includes("invalid")) {
      status = 400
      code = "validation_error"
      message = "Dados inválidos"
    } else if (error.message.includes("unauthorized") || error.message.includes("auth")) {
      status = 401
      code = "unauthorized"
      message = "Não autorizado"
    } else if (error.message.includes("forbidden")) {
      status = 403
      code = "forbidden"
      message = "Acesso negado"
    } else if (error.message.includes("rate limit") || error.message.includes("too many")) {
      status = 429
      code = "rate_limit_exceeded"
      message = "Muitas requisições. Tente novamente mais tarde."
    }

    return NextResponse.json(
      {
        error: {
          code,
          message,
        },
      },
      { status }
    )
  }

  // Handle unknown error types
  return NextResponse.json(
    {
      error: {
        code: "server_error",
        message: "Ocorreu um erro. Tente novamente.",
      },
    },
    { status: 500 }
  )
}

/**
 * Create a standardized API error object
 * 
 * @param status - HTTP status code
 * @param code - Error code identifier
 * @param message - User-friendly error message
 * @param details - Optional additional error details
 * @returns ApiError object
 */
export function createApiError(
  status: number,
  code: string,
  message: string,
  details?: any
): ApiError {
  return {
    status,
    code,
    message,
    ...(details && { details }),
  }
}

/**
 * Common API error creators for convenience
 */
export const ApiErrors = {
  badRequest: (message: string = "Dados inválidos", details?: any) =>
    createApiError(400, "invalid_input", message, details),
  
  unauthorized: (message: string = "Não autorizado") =>
    createApiError(401, "unauthorized", message),
  
  forbidden: (message: string = "Acesso negado") =>
    createApiError(403, "forbidden", message),
  
  notFound: (message: string = "Recurso não encontrado") =>
    createApiError(404, "not_found", message),
  
  rateLimitExceeded: (message: string = "Muitas requisições. Tente novamente mais tarde.") =>
    createApiError(429, "rate_limit_exceeded", message),
  
  serverError: (message: string = "Ocorreu um erro. Tente novamente.") =>
    createApiError(500, "server_error", message),
}

