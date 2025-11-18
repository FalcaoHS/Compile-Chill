"use client"

import { motion } from "framer-motion"
import { getTileInfo } from "@/lib/games/terminal-2048/tile-system"

interface TileProps {
  value: number | null
  row: number
  col: number
}

export function Tile({ value, row, col }: TileProps) {
  if (value === null) {
    return (
      <div className="
        aspect-square
        rounded-lg
        bg-page
        border border-border/50
      " />
    )
  }

  const tileInfo = getTileInfo(value)
  const isHighValue = value >= 1024

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`
        aspect-square
        rounded-lg
        flex flex-col items-center justify-center
        bg-page-secondary
        border-2 border-primary
        ${isHighValue ? 'shadow-glow' : 'shadow-sm'}
        p-2
      `}
    >
      <span className="text-2xl sm:text-3xl mb-1">
        {tileInfo.icon}
      </span>
      <span className={`
        text-xs sm:text-sm font-bold
        ${tileInfo.color}
        text-center
        line-clamp-1
      `}>
        {tileInfo.label}
      </span>
      {value > 2048 && (
        <span className="text-[10px] text-text-secondary mt-0.5">
          {value}
        </span>
      )}
    </motion.div>
  )
}

