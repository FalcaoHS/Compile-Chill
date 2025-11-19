import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/api-auth"
import { handleApiError } from "@/lib/api-errors"
import { decrypt } from "@/lib/encryption"

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
        nameEncrypted: true,
        avatar: true,
        xId: true,
        xUsername: true,
        email: true,
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

    // Decrypt name if encrypted
    let displayName = dbUser.name
    if (dbUser.nameEncrypted) {
      try {
        displayName = decrypt(dbUser.nameEncrypted)
      } catch (error) {
        console.error("❌ [API] Failed to decrypt name for user:", userId, error)
        // Fallback to plain name or default
        displayName = dbUser.name || "Usuário"
      }
    }

    // Determine handle (identifier) - prefer xUsername, then xId, then email, then name
    const handle = dbUser.xUsername || dbUser.xId || dbUser.email || displayName

    return NextResponse.json(
      {
        user: {
          id: dbUser.id,
          name: displayName,
          avatar: dbUser.avatar,
          handle, // Identifier for display
          xId: dbUser.xId,
          xUsername: dbUser.xUsername,
          email: dbUser.email,
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

