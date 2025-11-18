import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const error = searchParams.get("error")

  // Return generic error message to frontend
  // Never expose technical details
  return NextResponse.json(
    {
      error: "Não foi possível fazer login. Tente novamente.",
    },
    { status: 400 }
  )
}

