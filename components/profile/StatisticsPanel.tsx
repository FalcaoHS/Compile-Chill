"use client"

import { motion } from "framer-motion"
import { getGame } from "@/lib/games"

interface StatisticsPanelProps {
  totalGames: number
  averageDuration: number
  highestScore: number
  bestScoresByGame: Record<string, number>
  favoriteGames: Array<{ gameId: string; count: number; name: string }>
  bestStreak: number
  mostActiveHour: number
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

export function StatisticsPanel({
  totalGames,
  averageDuration,
  highestScore,
  bestScoresByGame,
  favoriteGames,
  bestStreak,
  mostActiveHour,
}: StatisticsPanelProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-text mb-6 font-theme">
        Estatísticas
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Games */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="
            p-4 sm:p-6
            bg-page-secondary
            border-2 border-border
            rounded-lg
            shadow-glow-sm
          "
        >
          <div className="text-xs sm:text-sm text-text-secondary mb-2">
            Total de Partidas
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-text font-theme">
            {totalGames.toLocaleString()}
          </div>
        </motion.div>

        {/* Average Duration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="
            p-4 sm:p-6
            bg-page-secondary
            border-2 border-border
            rounded-lg
            shadow-glow-sm
          "
        >
          <div className="text-xs sm:text-sm text-text-secondary mb-2">
            Duração Média
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-text font-theme">
            {formatDuration(averageDuration)}
          </div>
        </motion.div>

        {/* Highest Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="
            p-4 sm:p-6
            bg-page-secondary
            border-2 border-border
            rounded-lg
            shadow-glow-sm
          "
        >
          <div className="text-xs sm:text-sm text-text-secondary mb-2">
            Maior Score
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-primary font-theme">
            {highestScore.toLocaleString()}
          </div>
        </motion.div>

        {/* Best Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="
            p-4 sm:p-6
            bg-page-secondary
            border-2 border-border
            rounded-lg
            shadow-glow-sm
          "
        >
          <div className="text-xs sm:text-sm text-text-secondary mb-2">
            Melhor Streak
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-text font-theme">
            {bestStreak} {bestStreak === 1 ? "dia" : "dias"}
          </div>
        </motion.div>

        {/* Most Active Hour */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="
            p-4 sm:p-6
            bg-page-secondary
            border-2 border-border
            rounded-lg
            shadow-glow-sm
          "
        >
          <div className="text-xs sm:text-sm text-text-secondary mb-2">
            Horário Mais Ativo
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-text font-theme">
            {mostActiveHour}h
          </div>
        </motion.div>

        {/* Favorite Games */}
        {favoriteGames.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="
              p-4 sm:p-6
              bg-page-secondary
              border-2 border-border
              rounded-lg
              shadow-glow-sm
              sm:col-span-2 lg:col-span-1
            "
          >
            <div className="text-xs sm:text-sm text-text-secondary mb-3">
              Jogos Favoritos
            </div>
            <div className="space-y-2">
              {favoriteGames.slice(0, 3).map((game) => (
                <div key={game.gameId} className="flex items-center justify-between">
                  <span className="text-sm text-text">{game.name}</span>
                  <span className="text-sm text-text-secondary">{game.count}x</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Best Scores Per Game */}
      {Object.keys(bestScoresByGame).length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-text mb-4 font-theme">
            Melhores Scores por Jogo
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(bestScoresByGame).map(([gameId, score], index) => {
              const game = getGame(gameId)
              return (
                <motion.div
                  key={gameId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="
                    p-4
                    bg-page-secondary
                    border border-border
                    rounded-lg
                    hover:border-primary
                    transition-all duration-200
                  "
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-text-secondary mb-1">
                        {game?.name || gameId}
                      </div>
                      <div className="text-lg font-bold text-primary font-theme">
                        {score.toLocaleString()}
                      </div>
                    </div>
                    {game?.icon && (
                      <span className="text-2xl">{game.icon}</span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

