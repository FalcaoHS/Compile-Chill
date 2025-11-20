import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { themeUpdateSchema } from "@/lib/validations/theme"
import { validate } from "@/lib/validations/validate"
import { withAuth } from "@/lib/utils/api-auth"
import { withAuthAndRateLimit } from "@/lib/utils/api-rate-limit"
import { getThemeUpdateLimiter } from "@/lib/rate-limit"
import { handleApiError } from "@/lib/utils/api-errors"

/**
 * GET /api/users/me/theme
 * 
 * Gets the user's theme preference from the database.
 * Requires authentication.
 */
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    // Get user theme from database
    const userId = parseInt(user.id)
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { theme: true },
    })

    return NextResponse.json(
      { theme: dbUser?.theme || null },
      { status: 200 }
    )
  } catch (error) {
    return handleApiError(error, request)
  }
})

/**
 * PATCH /api/users/me/theme
 * 
 * Updates the user's theme preference in the database.
 * Requires authentication and rate limiting (5 requests/minute per user).
 */
export const PATCH = withAuthAndRateLimit(
  async (request: NextRequest, user) => {
    try {
      // Parse and validate request body
      const body = await request.json()
      const { theme } = validate(body, themeUpdateSchema)

      // Update user theme in database
      const userId = parseInt(user.id)
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { theme },
      })

      return NextResponse.json(
        { theme: updatedUser.theme },
        { status: 200 }
      )
    } catch (error) {
      return handleApiError(error, request)
    }
  },
  {
    limiter: getThemeUpdateLimiter(),
  }
)

