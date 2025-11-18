"use client"

import { RankingEntry } from "./RankingEntry"

interface RankingsListProps {
  rankings: Array<{
    rank: number
    id: number
    userId: number
    userName: string
    userAvatar: string
    score: number
    duration?: number | null
    moves?: number | null
    gameId?: string
    gameName?: string
    gameIcon?: string
  }>
  currentUserId?: number
  isLoading?: boolean
}

export function RankingsList({ rankings, currentUserId, isLoading = false }: RankingsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="
              h-24
              bg-page-secondary
              border-2 border-border
              rounded-lg
              animate-pulse
            "
          />
        ))}
      </div>
    )
  }

  if (rankings.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {rankings.map((entry, index) => (
        <RankingEntry
          key={entry.id}
          rank={entry.rank}
          userId={entry.userId}
          userName={entry.userName}
          userAvatar={entry.userAvatar}
          score={entry.score}
          duration={entry.duration}
          moves={entry.moves}
          gameId={entry.gameId}
          gameName={entry.gameName}
          gameIcon={entry.gameIcon}
          isCurrentUser={currentUserId === entry.userId}
          index={index}
        />
      ))}
    </div>
  )
}

