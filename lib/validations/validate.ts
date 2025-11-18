import { ZodSchema, ZodError } from "zod"
import { ApiError, ApiErrors } from "@/lib/api-errors"

/**
 * Validation helper that throws standardized API errors on validation failure
 * 
 * Validates request body against a Zod schema and throws an ApiError
 * with status 400 if validation fails. Returns validated data if successful.
 * 
 * @param body - The data to validate (typically from request.json())
 * @param schema - Zod schema to validate against
 * @returns Validated data with proper TypeScript types
 * @throws ApiError with status 400 if validation fails
 * 
 * @example
 * ```ts
 * const body = await request.json()
 * const validatedData = validate(body, scoreSubmissionSchema)
 * // validatedData is now type-safe and validated
 * ```
 */
export function validate<T>(
  body: unknown,
  schema: ZodSchema<T>
): T {
  const result = schema.safeParse(body)

  if (!result.success) {
    // Extract field-specific errors from Zod's error.issues array
    const details = result.error.errors.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
      code: issue.code,
    }))

    // Throw ApiError that can be caught by handleApiError
    throw ApiErrors.badRequest("Dados inválidos", details)
  }

  return result.data
}

/**
 * Validation helper for query parameters
 * 
 * Validates query parameters against a Zod schema.
 * Useful for validating URL search params.
 * 
 * @param params - Query parameters object (from request.nextUrl.searchParams)
 * @param schema - Zod schema to validate against
 * @returns Validated query parameters with proper TypeScript types
 * @throws ApiError with status 400 if validation fails
 */
export function validateQuery<T>(
  params: Record<string, string | string[] | undefined>,
  schema: ZodSchema<T>
): T {
  const result = schema.safeParse(params)

  if (!result.success) {
    const details = result.error.errors.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
      code: issue.code,
    }))

    throw ApiErrors.badRequest("Parâmetros inválidos", details)
  }

  return result.data
}

