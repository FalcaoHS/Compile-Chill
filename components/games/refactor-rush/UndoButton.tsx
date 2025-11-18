"use client"

import { motion } from "framer-motion"

interface UndoButtonProps {
  onClick: () => void
  disabled?: boolean
}

export function UndoButton({ onClick, disabled = false }: UndoButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2
        rounded-lg
        border-2 border-border
        bg-page-secondary
        text-text
        font-semibold
        transition-all
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:bg-page hover:border-primary cursor-pointer'
        }
      `}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      aria-label="Undo last move"
      title={disabled ? "Nenhum movimento para desfazer" : "Desfazer último movimento"}
    >
      <span className="flex items-center gap-2">
        <span>↶</span>
        <span>Undo</span>
      </span>
    </motion.button>
  )
}

