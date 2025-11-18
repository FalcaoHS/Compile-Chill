"use client"

import { useState, useCallback, useEffect } from "react"
import { CodeBlock } from "./CodeBlock"
import type { GameState, BlockPosition } from "@/lib/games/refactor-rush/game-logic"
import { getBlockType, type BlockType } from "@/lib/games/refactor-rush/block-types"
import type { Level } from "@/lib/games/refactor-rush/game-logic"

interface RefactorGridProps {
  gameState: GameState
  level: Level | null
  onBlockMove: (from: BlockPosition, to: BlockPosition) => void
  selectedBlock: BlockPosition | null
  onBlockSelect: (position: BlockPosition | null) => void
}

export function RefactorGrid({
  gameState,
  level,
  onBlockMove,
  selectedBlock,
  onBlockSelect,
}: RefactorGridProps) {
  const [draggedBlock, setDraggedBlock] = useState<{ blockId: string; row: number; col: number } | null>(null)
  const [dragOverPosition, setDragOverPosition] = useState<BlockPosition | null>(null)
  const [cellSize, setCellSize] = useState(80) // Default cell size

  // Find block type by ID from level data
  const getBlockTypeById = useCallback((blockId: string): BlockType | null => {
    if (!level) return null
    // Search in both initial and target blocks
    const block = level.initialBlocks.find(b => b.id === blockId) || 
                  level.targetBlocks.find(b => b.id === blockId)
    return block ? (block.type as BlockType) : null
  }, [level])

  const handleDragStart = useCallback((blockId: string, row: number, col: number) => {
    setDraggedBlock({ blockId, row, col })
  }, [])

  const handleDragEnd = useCallback(() => {
    if (draggedBlock && dragOverPosition) {
      onBlockMove(
        { row: draggedBlock.row, col: draggedBlock.col },
        dragOverPosition
      )
    }
    setDraggedBlock(null)
    setDragOverPosition(null)
  }, [draggedBlock, dragOverPosition, onBlockMove])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    
    const target = e.currentTarget as HTMLElement
    const row = parseInt(target.dataset.row || "0", 10)
    const col = parseInt(target.dataset.col || "0", 10)
    
    setDragOverPosition({ row, col })
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOverPosition(null)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const data = e.dataTransfer.getData("text/plain")
    if (!data || !draggedBlock) return

    const target = e.currentTarget as HTMLElement
    const row = parseInt(target.dataset.row || "0", 10)
    const col = parseInt(target.dataset.col || "0", 10)

    onBlockMove(
      { row: draggedBlock.row, col: draggedBlock.col },
      { row, col }
    )

    setDraggedBlock(null)
    setDragOverPosition(null)
  }, [draggedBlock, onBlockMove])

  const handleCellTap = useCallback((row: number, col: number) => {
    if (selectedBlock) {
      // Second tap - place block
      if (selectedBlock.row !== row || selectedBlock.col !== col) {
        onBlockMove(selectedBlock, { row, col })
      }
      onBlockSelect(null)
    } else {
      // First tap - select block
      const blockId = gameState.grid[row][col]
      if (blockId) {
        onBlockSelect({ row, col })
      }
    }
  }, [selectedBlock, gameState.grid, onBlockMove, onBlockSelect])

  const handleBlockTap = useCallback((blockId: string, row: number, col: number) => {
    if (selectedBlock && (selectedBlock.row !== row || selectedBlock.col !== col)) {
      // Place selected block at this position
      onBlockMove(selectedBlock, { row, col })
      onBlockSelect(null)
    } else {
      // Select this block
      onBlockSelect({ row, col })
    }
  }, [selectedBlock, onBlockMove, onBlockSelect])

  // Calculate responsive grid size to fit viewport
  useEffect(() => {
    const calculateCellSize = () => {
      // Account for: header (~64px), stats bar (~80px), padding (32px), undo button (~60px), gaps (~40px)
      // Available height: ~calc(100vh - 64px - 80px - 32px - 60px - 40px) = ~calc(100vh - 276px)
      const headerHeight = 64
      const statsBarHeight = 80
      const padding = 32
      const undoButtonHeight = 60
      const gaps = 40
      const totalReserved = headerHeight + statsBarHeight + padding + undoButtonHeight + gaps
      
      const availableHeight = window.innerHeight - totalReserved
      const availableWidth = window.innerWidth - 64 // Account for padding and help panel
      
      // Calculate max cell size based on available space
      const gapSize = 8 * (gameState.gridSize - 1) // Total gap space between cells
      const maxHeight = Math.floor((availableHeight - gapSize) / gameState.gridSize)
      const maxWidth = Math.floor((availableWidth - gapSize) / gameState.gridSize)
      
      // Use the smaller of the two, but ensure minimum 50px and maximum 120px
      const calculatedSize = Math.min(maxHeight, maxWidth)
      const finalSize = Math.max(50, Math.min(120, calculatedSize))
      
      setCellSize(finalSize)
    }

    calculateCellSize()
    window.addEventListener('resize', calculateCellSize)
    return () => window.removeEventListener('resize', calculateCellSize)
  }, [gameState.gridSize])

  return (
    <div
      className={`
        w-full mx-auto
        grid gap-2 sm:gap-3
        p-2 sm:p-4
        bg-page-secondary
        rounded-xl
        border-2 border-border
      `}
      style={{
        gridTemplateColumns: `repeat(${gameState.gridSize}, minmax(0, 1fr))`,
        maxWidth: `${cellSize * gameState.gridSize + 64}px`, // cell size * grid + padding
        maxHeight: `${cellSize * gameState.gridSize + 64}px`,
      }}
    >
      {Array.from({ length: gameState.gridSize }).map((_, rowIndex) =>
        Array.from({ length: gameState.gridSize }).map((_, colIndex) => {
          const blockId = gameState.grid[rowIndex][colIndex]
          const isSelected = selectedBlock?.row === rowIndex && selectedBlock?.col === colIndex
          const isDragOver = dragOverPosition?.row === rowIndex && dragOverPosition?.col === colIndex
          const isDragging = draggedBlock?.row === rowIndex && draggedBlock?.col === colIndex

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              data-row={rowIndex}
              data-col={colIndex}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => handleCellTap(rowIndex, colIndex)}
              className={`
                aspect-square
                rounded-lg
                border-2
                ${blockId ? 'border-transparent' : 'border-border border-dashed'}
                ${isDragOver ? 'bg-primary/20 border-primary' : ''}
                ${isSelected && !blockId ? 'ring-2 ring-primary' : ''}
                transition-all
                flex items-center justify-center
                relative
                group
              `}
              style={{
                minHeight: `${cellSize}px`,
                minWidth: `${cellSize}px`,
              }}
              title={blockId ? `${getBlockTypeById(blockId) || 'code'} block` : 'Empty cell - drop block here'}
            >
              {blockId ? (
                <CodeBlock
                  blockId={blockId}
                  blockType={getBlockTypeById(blockId) || 'import'}
                  row={rowIndex}
                  col={colIndex}
                  isSelected={isSelected}
                  isDragging={isDragging}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onTap={handleBlockTap}
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center text-text-secondary/30"
                  title="Célula vazia - solte um bloco aqui"
                >
                  <span className="text-xs">Empty</span>
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

