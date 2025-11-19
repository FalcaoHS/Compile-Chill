import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"
import { NextRequest } from "next/server"

const { handlers } = NextAuth(authConfig)

// Wrap handlers with error handling
const handleRequest = async (req: NextRequest, handler: (req: NextRequest) => Promise<Response>) => {
  try {
    return await handler(req)
  } catch (error) {
    console.error("NextAuth handler error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      url: req.url,
    })
    // Return error response
    return new Response(
      JSON.stringify({ error: "Authentication error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}

export const GET = (req: NextRequest) => handleRequest(req, handlers.GET)
export const POST = (req: NextRequest) => handleRequest(req, handlers.POST)

