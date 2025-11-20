import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/utils/api-auth"
import { handleApiError } from "@/lib/utils/api-errors"

/**
 * GET /api/users/me
 * 
 * Returns the authenticated user's profile data.
 * Requires authentication.
 */
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const userId = parseInt(user.id)

    // Get user profile data from database
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatar: true,
        xId: true,
        xUsername: true,
        theme: true,
        showPublicHistory: true,
        createdAt: true,
      },
    })

    if (!dbUser) {
      return NextResponse.json(
        {
          error: {
            code: "not_found",
            message: "Usuário não encontrado",
          },
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        user: {
          id: dbUser.id,
          name: dbUser.name,
          avatar: dbUser.avatar,
          handle: dbUser.xUsername || dbUser.xId, // Prefer xUsername, fallback to xId
          xId: dbUser.xId,
          xUsername: dbUser.xUsername,
          theme: dbUser.theme,
          showPublicHistory: dbUser.showPublicHistory,
          joinDate: dbUser.createdAt,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return handleApiError(error, request)
  }
})

