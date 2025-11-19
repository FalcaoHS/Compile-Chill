import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/api-auth"
import { handleApiError } from "@/lib/api-errors"

/**
 * DELETE /api/admin/cleanup-crypto-miner
 * 
 * Removes all crypto-miner-game scores from the database.
 * This is a one-time cleanup operation.
 * 
 * Reason: Crypto Miner was submitting scores every 60 seconds,
 * polluting user statistics and game history.
 * 
 * Requires authentication (any logged-in user can run this for now).
 */
export const DELETE = withAuth(async (request: NextRequest, user) => {
  try {
    // Delete all crypto-miner-game scores
    const result = await prisma.score.deleteMany({
      where: {
        gameId: 'crypto-miner-game'
      }
    })

    return NextResponse.json(
      {
        message: "Crypto Miner scores deleted successfully",
        deletedCount: result.count,
      },
      { status: 200 }
    )
  } catch (error) {
    return handleApiError(error, request)
  }
})

