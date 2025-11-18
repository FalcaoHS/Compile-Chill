"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { getBlockType, getBlockStylingClasses, type BlockType } from "@/lib/games/refactor-rush/block-types"
import { useThemeStore } from "@/lib/theme-store"

interface CodeBlockProps {
  blockId: string
  blockType: BlockType
  row: number
  col: number
  isSelected?: boolean
  isDragging?: boolean
  onDragStart?: (blockId: string, row: number, col: number) => void
  onDragEnd?: () => void
  onTap?: (blockId: string, row: number, col: number) => void
}

export function CodeBlock({
  blockId,
  blockType,
  row,
  col,
  isSelected = false,
  isDragging = false,
  onDragStart,
  onDragEnd,
  onTap,
}: CodeBlockProps) {
  const { theme: themeId } = useThemeStore()
  const [isHovered, setIsHovered] = useState(false)
  const blockTypeDef = getBlockType(blockType)
  const stylingClasses = getBlockStylingClasses(blockType, themeId)

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", `${blockId}:${row}:${col}`)
    onDragStart?.(blockId, row, col)
  }

  const handleDragEnd = () => {
    onDragEnd?.()
  }

  const handleTap = () => {
    onTap?.(blockId, row, col)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <motion.div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleTap}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        ${stylingClasses}
        w-full h-full
        min-h-[60px] min-w-[60px]
        cursor-move
        select-none
        relative
        group
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${isHovered ? 'scale-105 shadow-lg' : ''}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`${blockTypeDef.label} block at row ${row}, column ${col}`}
      role="button"
      tabIndex={0}
      title={`${blockTypeDef.label}: ${blockTypeDef.textContent} - Arraste para reorganizar`}
    >
      <div className="flex flex-col items-center justify-center p-2 text-center">
        <span className="text-lg mb-1" aria-hidden="true">
          {blockTypeDef.icon}
        </span>
        <span className="text-xs font-mono leading-tight">
          {blockTypeDef.textContent}
        </span>
      </div>
      
      {/* Tooltip on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="bg-page-secondary border border-border rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
            <div className="text-xs font-semibold text-text mb-1">
              {blockTypeDef.label}
            </div>
            <div className="text-xs text-text-secondary">
              {blockTypeDef.textContent}
            </div>
            <div className="text-[10px] text-text-secondary/70 mt-1">
              Arraste para reorganizar
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -mb-1">
            <div className="w-2 h-2 bg-page-secondary border-r border-b border-border transform rotate-45"></div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

