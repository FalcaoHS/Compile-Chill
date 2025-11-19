import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/api-auth"
import { handleApiError } from "@/lib/api-errors"

/**
 * POST /api/users/setup-profile
 * 
 * Updates the authenticated user's profile with display name and avatar.
 * Used for first-time Google users to set up their profile.
 * Requires authentication.
 */
export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json()
    const { name, avatar } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        {
          error: {
            code: "validation_error",
            message: "Nome é obrigatório",
          },
        },
        { status: 400 }
      )
    }

    // Validate name length
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        {
          error: {
            code: "validation_error",
            message: "Nome deve ter entre 2 e 100 caracteres",
          },
        },
        { status: 400 }
      )
    }

    const userId = parseInt(user.id)

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        nameEncrypted: name, // name is already encrypted from client
        avatar: avatar || null,
      },
      select: {
        id: true,
        name: true,
        nameEncrypted: true,
        avatar: true,
        email: true,
      },
    })

    return NextResponse.json(
      {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          avatar: updatedUser.avatar,
          email: updatedUser.email,
        },
        message: "Perfil atualizado com sucesso",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ [API] Setup profile error:", error)
    return handleApiError(error, request)
  }
})

