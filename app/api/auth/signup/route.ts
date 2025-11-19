import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError } from "@/lib/api-errors"
import { validateEmail } from "@/lib/email-validation"
import { hashPassword } from "@/lib/password"
import { encrypt } from "@/lib/encryption"
import { signIn } from "next-auth/react"

/**
 * POST /api/auth/signup
 * 
 * Creates a new user account with email/password authentication.
 * Validates email format and domain, hashes password, encrypts name.
 * Returns user data on success.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, avatar, rememberMe } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: {
            code: "validation_error",
            message: "Nome, email e senha são obrigatórios",
          },
        },
        { status: 400 }
      )
    }

    // Validate name
    const trimmedName = name.trim()
    if (trimmedName.length < 2 || trimmedName.length > 100) {
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

    // Validate email format and domain
    const emailValidation = await validateEmail(email.trim().toLowerCase())
    if (!emailValidation.isValid) {
      return NextResponse.json(
        {
          error: {
            code: "validation_error",
            message: emailValidation.error || "Email inválido",
          },
        },
        { status: 400 }
      )
    }

    // Validate password
    if (password.length < 6 || password.length > 100) {
      return NextResponse.json(
        {
          error: {
            code: "validation_error",
            message: "Senha deve ter entre 6 e 100 caracteres",
          },
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          error: {
            code: "user_exists",
            message: "Já existe uma conta com este email",
          },
        },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Encrypt name
    const nameEncrypted = encrypt(trimmedName)

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: trimmedName, // Store plain name as fallback
        nameEncrypted, // Store encrypted name for privacy
        email: email.trim().toLowerCase(),
        passwordHash,
        avatar: avatar || null,
      },
    })

    // Create NextAuth account record for credentials provider
    await prisma.account.create({
      data: {
        userId: newUser.id,
        type: "credentials",
        provider: "credentials",
        providerAccountId: newUser.id.toString(),
      },
    })

    // Auto-login: create session
    // Note: In NextAuth v5, we need to use the signIn function from next-auth/react
    // But this is a server route, so we'll return success and let the client handle login
    // The client will call signIn("credentials") after successful signup

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          name: trimmedName,
          email: newUser.email,
        },
        message: "Conta criada com sucesso",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("❌ [API] Signup error:", error)
    return handleApiError(error, request)
  }
}

