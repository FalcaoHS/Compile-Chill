"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import type { Game } from "@/lib/games"

interface GameCardProps {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Link
        href={game.route}
        className="
          block
          h-full
          p-6 rounded-lg
          bg-page-secondary
          border-2 border-border
          text-text
          hover:bg-page
          hover:border-primary
          hover:shadow-glow-sm
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-page
          group
        "
        role="button"
        aria-label={`Jogar ${game.name}`}
      >
        <div className="flex flex-col gap-3 h-full">
          {/* Icon and Name */}
          <div className="flex items-center gap-3">
            <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
              {game.icon}
            </span>
            <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors duration-200">
              {game.name}
            </h3>
          </div>
          
          {/* Description */}
          <p className="text-sm text-text-secondary line-clamp-2 flex-grow">
            {game.description}
          </p>
          
          {/* Category Badge (optional) */}
          {game.category && (
            <div className="mt-auto pt-2">
              <span className="
                inline-block
                px-2 py-1
                text-xs
                rounded-md
                bg-page
                text-text-secondary
                border border-border
              ">
                {game.category}
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

