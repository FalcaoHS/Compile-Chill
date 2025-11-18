"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface RankingEntryProps {
  rank: number
  userId: number
  userName: string
  userAvatar: string
  score: number
  duration?: number | null
  moves?: number | null
  gameId?: string
  gameName?: string
  gameIcon?: string
  isCurrentUser?: boolean
  index: number
}

function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (remainingSeconds === 0) {
    return `${minutes}min`
  }
  return `${minutes}min ${remainingSeconds}s`
}

export function RankingEntry({
  rank,
  userName,
  userAvatar,
  score,
  duration,
  moves,
  gameId,
  gameName,
  gameIcon,
  isCurrentUser = false,
  index,
}: RankingEntryProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return null
  }

  const rankIcon = getRankIcon(rank)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 * index }}
      className={`
        p-4
        bg-page-secondary
        border-2 
        ${isCurrentUser ? "border-primary shadow-glow" : "border-border"}
        rounded-lg
        hover:border-primary
        transition-all duration-200
      `}
    >
      <div className="flex items-center gap-4">
        {/* Rank */}
        <div className="flex-shrink-0 w-12 text-center">
          {rankIcon ? (
            <span className="text-2xl">{rankIcon}</span>
          ) : (
            <div className="text-lg font-bold text-text-secondary font-theme">
              #{rank}
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex-shrink-0">
          {userAvatar ? (
            <Image
              src={userAvatar}
              alt={userName}
              width={48}
              height={48}
              className="rounded-full border-2 border-border"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-page border-2 border-border flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
          )}
        </div>

        {/* User Info and Score */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-text truncate">
              {userName}
            </h3>
            {isCurrentUser && (
              <span className="px-2 py-0.5 bg-primary text-page text-xs font-bold rounded">
                Você
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
            {/* Game Info (for global rankings) */}
            {gameId && gameName && (
              <div className="flex items-center gap-1">
                <span>{gameIcon || "🎮"}</span>
                <span className="truncate max-w-[150px]">{gameName}</span>
              </div>
            )}
            
            {/* Duration */}
            {duration && (
              <div className="flex items-center gap-1">
                <span>⏱️</span>
                <span>{formatDuration(duration)}</span>
              </div>
            )}
            
            {/* Moves */}
            {moves !== null && moves !== undefined && (
              <div className="flex items-center gap-1">
                <span>🔄</span>
                <span>{moves} movimentos</span>
              </div>
            )}
          </div>
        </div>

        {/* Score */}
        <div className="flex-shrink-0 text-right">
          <div className="text-xs text-text-secondary mb-1">Score</div>
          <div className="text-2xl font-bold text-primary font-theme">
            {score.toLocaleString()}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

