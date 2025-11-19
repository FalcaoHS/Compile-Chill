import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/avatars/[userId]
 * 
 * Proxy endpoint for user avatars to bypass CORS restrictions.
 * 
 * Twitter/X blocks CORS access to profile images (pbs.twimg.com),
 * which prevents canvas from loading them. This endpoint:
 * 1. Fetches the avatar URL from database
 * 2. Downloads the image from Twitter
 * 3. Serves it from our domain (enabling CORS)
 * 
 * Public access (no authentication required).
 * Cached by browser and CDN.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId)

    // Validate userId
    if (isNaN(userId) || userId < 0) {
      return new NextResponse("Invalid user ID", { status: 400 })
    }

    // Special handling for fake users (negative IDs)
    if (userId < 0) {
      // Return a simple colored circle SVG for fake users
      const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2"]
      const colorIndex = Math.abs(userId) % colors.length
      const color = colors[colorIndex]
      
      const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="100" fill="${color}"/>
      </svg>`
      
      return new NextResponse(svg, {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=86400, immutable", // 24 hours
          "Access-Control-Allow-Origin": "*", // Enable CORS
        },
      })
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    })

    if (!user || !user.avatar) {
      // Return a default avatar SVG
      const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="100" fill="#CBD5E0"/>
        <text x="100" y="120" font-size="80" text-anchor="middle" fill="#718096">?</text>
      </svg>`
      
      return new NextResponse(svg, {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=3600", // 1 hour
          "Access-Control-Allow-Origin": "*",
        },
      })
    }

    // Fetch avatar from Twitter
    const avatarResponse = await fetch(user.avatar, {
      headers: {
        // Pretend to be a browser to bypass some restrictions
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!avatarResponse.ok) {
      throw new Error(`Failed to fetch avatar: ${avatarResponse.status}`)
    }

    // Get image data
    const imageBuffer = await avatarResponse.arrayBuffer()
    const contentType = avatarResponse.headers.get("content-type") || "image/jpeg"

    // Return proxied image with CORS enabled
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, immutable", // 24 hours
        "Access-Control-Allow-Origin": "*", // Enable CORS for canvas
      },
    })
  } catch (error) {
    console.error("[AVATAR-PROXY] Error:", error)
    
    // Return fallback SVG on error
    const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="100" fill="#E2E8F0"/>
      <text x="100" y="120" font-size="80" text-anchor="middle" fill="#A0AEC0">?</text>
    </svg>`
    
    return new NextResponse(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=300", // 5 minutes
        "Access-Control-Allow-Origin": "*",
      },
    })
  }
}

