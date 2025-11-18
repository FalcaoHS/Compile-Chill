"use client"

import { getAllGames } from "@/lib/games"

interface GameSelectorProps {
  selectedGameId: string
  onGameChange: (gameId: string) => void
}

export function GameSelector({ selectedGameId, onGameChange }: GameSelectorProps) {
  const games = getAllGames()

  return (
    <div className="mb-6">
      <label htmlFor="game-selector" className="block text-sm font-medium text-text-secondary mb-2">
        Selecione o Jogo
      </label>
      <select
        id="game-selector"
        value={selectedGameId}
        onChange={(e) => onGameChange(e.target.value)}
        className="
          w-full
          px-4 py-3
          bg-page-secondary
          border-2 border-border
          rounded-lg
          text-text
          font-medium
          transition-all duration-200
          hover:border-primary
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          cursor-pointer
        "
      >
        {games.map((game) => (
          <option key={game.id} value={game.id}>
            {game.icon} {game.name}
          </option>
        ))}
      </select>
    </div>
  )
}

