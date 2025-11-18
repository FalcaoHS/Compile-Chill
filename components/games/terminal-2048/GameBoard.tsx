"use client"

import type { Board } from "@/lib/games/terminal-2048/game-logic"
import { Tile } from "./Tile"

interface GameBoardProps {
  board: Board
}

export function GameBoard({ board }: GameBoardProps) {
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
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Tile
            key={`${rowIndex}-${colIndex}`}
            value={cell}
            row={rowIndex}
            col={colIndex}
          />
        ))
      )}
    </div>
  )
}

