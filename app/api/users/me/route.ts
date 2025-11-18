import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/api-auth"
import { handleApiError } from "@/lib/api-errors"

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
        theme: true,
        showPublicHistory: true,
        createdAt: true,
      },
    })

    if (!dbUser) {
      return Response.json(
        {
          error: {
            code: "not_found",
            message: "Usuário não encontrado",
          },
        },
        { status: 404 }
      )
    }

    return Response.json(
      {
        user: {
          id: dbUser.id,
          name: dbUser.name,
          avatar: dbUser.avatar,
          handle: dbUser.xId, // xId is used as handle/username
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

