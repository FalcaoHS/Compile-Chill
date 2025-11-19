import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/api-auth"
import { handleApiError } from "@/lib/api-errors"

interface TwitterTweet {
  id: string
  text: string
  created_at: string
  public_metrics?: {
    like_count: number
    retweet_count: number
    reply_count: number
  }
}

interface TwitterResponse {
  data?: TwitterTweet[]
  meta?: {
    result_count: number
  }
  errors?: Array<{ message: string; code: number }>
}

/**
 * GET /api/users/me/tweets
 *
 * Returns the authenticated user's recent tweets from X (Twitter).
 * Requires authentication and valid X OAuth access token.
 */
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const userId = parseInt(user.id)

    // Get user's X account with access token
    const account = await prisma.account.findFirst({
      where: {
        userId,
        provider: "twitter",
      },
      select: {
        access_token: true,
        providerAccountId: true,
        refresh_token: true,
        expires_at: true,
        token_type: true,
        scope: true,
      },
    })

    // Debug: Log account info (without exposing token)
    

    if (!account) {
      return NextResponse.json(
        {
          error: {
            code: "no_account",
            message: "Conta do X não encontrada. Faça login novamente.",
          },
        },
        { status: 401 }
      )
    }

    if (!account.access_token) {
      return NextResponse.json(
        {
          error: {
            code: "no_token",
            message: "Token de acesso do X não encontrado. Faça login novamente para gerar um novo token.",
            debug: {
              hasRefreshToken: !!account.refresh_token,
              expiresAt: account.expires_at,
            },
          },
        },
        { status: 401 }
      )
    }

    // Fetch user's tweets from Twitter API v2
    // Using the user's own tweets endpoint
    const twitterApiUrl = `https://api.twitter.com/2/users/${account.providerAccountId}/tweets`
    
    const params = new URLSearchParams({
      max_results: "1", // Last tweet only
      "tweet.fields": "created_at,public_metrics",
      exclude: "retweets,replies", // Only original tweets
    })

    const response = await fetch(`${twitterApiUrl}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${account.access_token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      // Handle rate limiting
      if (response.status === 429) {
        // Rate limit é por aplicação, não por usuário
        // No plano Free do Twitter, o limite é bem restritivo
        const retryAfter = response.headers.get("retry-after") || "15"
        
        
        return NextResponse.json(
          {
            error: {
              code: "rate_limit",
              message: "Limite de requisições da API do X atingido. Tente novamente mais tarde.",
              retryAfter: parseInt(retryAfter),
            },
          },
          { 
            status: 429,
            headers: {
              "Retry-After": retryAfter,
            },
          }
        )
      }

      // Handle invalid/expired token
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          {
            error: {
              code: "invalid_token",
              message: "Token de acesso inválido ou expirado. Faça login novamente.",
            },
          },
          { status: 401 }
        )
      }

      return NextResponse.json(
        {
          error: {
            code: "twitter_api_error",
            message: "Erro ao buscar tweets do X",
            details: errorData,
          },
        },
        { status: response.status }
      )
    }

    const data: TwitterResponse = await response.json()

    if (data.errors && data.errors.length > 0) {
      return NextResponse.json(
        {
          error: {
            code: "twitter_api_error",
            message: data.errors[0].message || "Erro ao buscar tweets do X",
          },
        },
        { status: 400 }
      )
    }

    // Format tweets for frontend
    const tweets = (data.data || []).map((tweet) => ({
      id: tweet.id,
      text: tweet.text,
      createdAt: tweet.created_at,
      metrics: {
        likes: tweet.public_metrics?.like_count || 0,
        retweets: tweet.public_metrics?.retweet_count || 0,
        replies: tweet.public_metrics?.reply_count || 0,
      },
    }))

    return NextResponse.json(
      {
        tweets,
        count: data.meta?.result_count || 0,
      },
      { status: 200 }
    )
  } catch (error) {
    return handleApiError(error, request)
  }
})


