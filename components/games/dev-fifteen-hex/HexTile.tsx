"use client"

import { motion } from "framer-motion"
import { useThemeStore } from "@/lib/theme-store"
import { getTileStyles } from "@/lib/games/dev-fifteen-hex/theme-styles"
import type { HexValue } from "@/lib/games/dev-fifteen-hex/game-logic"

interface HexTileProps {
  value: HexValue
  position: { row: number; col: number }
  isEmpty: boolean
  isAnimating: boolean
  onClick: () => void
}

export function HexTile({ value, isEmpty, isAnimating, onClick }: HexTileProps) {
  const { theme } = useThemeStore()
  const styles = getTileStyles(theme, isAnimating)
  
  if (isEmpty) {
    return (
      <div
        className="
          w-full h-full
          rounded
          border-2 border-dashed
          opacity-30
        "
        style={{
          borderColor: styles.borderColor,
        }}
      />
    )
  }
  
  return (
    <motion.button
      onClick={onClick}
      disabled={isAnimating}
      className="
        w-full h-full
        rounded
        border-2
        flex items-center justify-center
        font-bold
        cursor-pointer
        transition-all
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
      style={{
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor,
        color: styles.textColor,
        boxShadow: styles.shadow,
        fontFamily: styles.fontFamily,
      }}
      whileHover={!isAnimating ? {
        scale: 1.05,
        boxShadow: styles.glowColor ? `0 0 15px ${styles.glowColor}` : undefined,
      } : {}}
      whileTap={!isAnimating ? { scale: 0.95 } : {}}
      animate={isAnimating ? {
        scale: [1, 1.1, 1],
      } : {}}
      transition={{
        duration: 0.12,
        ease: "easeOut",
      }}
    >
      <span className="text-sm sm:text-base md:text-lg">
        {value}
      </span>
    </motion.button>
  )
}

