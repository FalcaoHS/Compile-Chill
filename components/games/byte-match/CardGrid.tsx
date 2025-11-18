"use client"

import type { Card } from "@/lib/games/byte-match/game-logic"
import { Card as CardComponent } from "./Card"

interface CardGridProps {
  cards: Card[]
  flippedIndices: number[]
  matchedIndices: number[]
  onCardClick: (index: number) => void
  disabled?: boolean
}

export function CardGrid({ cards, flippedIndices, matchedIndices, onCardClick, disabled }: CardGridProps) {
  return (
    <div className="
      w-full max-w-md mx-auto
      aspect-square
      grid grid-cols-4 gap-2 sm:gap-3
      p-2 sm:p-4
      bg-page-secondary
      rounded-xl
      border-2 border-border
    ">
      {cards.map((card, index) => {
        const isFlipped = flippedIndices.includes(index)
        const isMatched = matchedIndices.includes(index)
        
        return (
          <CardComponent
            key={card.id}
            card={card}
            isFlipped={isFlipped}
            isMatched={isMatched}
            onClick={() => onCardClick(index)}
            disabled={disabled || isMatched || isFlipped}
          />
        )
      })}
    </div>
  )
}

