"use client"

import { motion } from "framer-motion"
import type { Card as CardType } from "@/lib/games/byte-match/game-logic"
import { getCardDisplayInfo } from "@/lib/games/byte-match/game-logic"

interface CardProps {
  card: CardType
  isFlipped: boolean
  isMatched: boolean
  onClick: () => void
  disabled?: boolean
}

export function Card({ card, isFlipped, isMatched, onClick, disabled }: CardProps) {
  const displayInfo = getCardDisplayInfo(card.type)
  const isFaceUp = isFlipped || isMatched

  return (
    <div
      className="
        aspect-square
        cursor-pointer
        relative
        w-full h-full
      "
      style={{ perspective: "1000px" }}
      onClick={disabled ? undefined : onClick}
    >
      <motion.div
        initial={false}
        animate={{
          rotateY: isFaceUp ? 180 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        style={{
          transformStyle: "preserve-3d",
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        {/* Back of card (face-down) */}
        <div
          className="
            absolute inset-0
            rounded-lg
            bg-page-secondary
            border-2 border-border
            flex items-center justify-center
            shadow-sm
            hover:border-primary/50
            transition-colors
          "
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
          }}
        >
          <div className="
            text-2xl sm:text-3xl
            text-text-secondary
            opacity-50
          ">
            ?
          </div>
        </div>

        {/* Front of card (face-up) */}
        <motion.div
          className="
            absolute inset-0
            rounded-lg
            bg-page-secondary
            border-2 border-primary
            flex flex-col items-center justify-center
            shadow-glow-sm
            p-2 sm:p-3
          "
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          animate={isMatched ? {
            scale: [1, 1.05, 1],
          } : {}}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
        >
          <span className="text-3xl sm:text-4xl mb-1">
            {displayInfo.emoji}
          </span>
          <span className="
            text-xs sm:text-sm font-bold
            text-text
            text-center
            line-clamp-2
          ">
            {displayInfo.label}
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}

