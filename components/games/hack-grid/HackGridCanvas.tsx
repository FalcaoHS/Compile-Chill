"use client"

import { useEffect, useRef, useState } from "react"
import { useThemeStore } from "@/lib/theme-store"
import type { GameState, Node, Connection } from "@/lib/games/hack-grid/game-logic"
import { GRID_SIZE, validateConnection, getRequiredPairs, isRequiredPairCompleted } from "@/lib/games/hack-grid/game-logic"

interface HackGridCanvasProps {
  gameState: GameState
  onNodeClick?: (nodeId: string) => void
  onNodeDragStart?: (nodeId: string) => void
  onNodeDragEnd?: (nodeId: string) => void
  onNodeHover?: (nodeId: string | null) => void
}

export function HackGridCanvas({
  gameState,
  onNodeClick,
  onNodeDragStart,
  onNodeDragEnd,
  onNodeHover,
}: HackGridCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastFrameTimeRef = useRef<number>(0)
  const animationFrameRef = useRef<number>()
  const pulseAnimationRef = useRef<number>(0)
  const hoveredNodeRef = useRef<string | null>(null)
  const draggedNodeRef = useRef<string | null>(null)
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null)

  const { theme: themeId } = useThemeStore()

  // Get theme colors from CSS variables
  const getThemeColors = () => {
    if (typeof window === 'undefined') return null

    const root = document.documentElement
    const computedStyle = getComputedStyle(root)

    return {
      primary: computedStyle.getPropertyValue('--color-primary').trim(),
      accent: computedStyle.getPropertyValue('--color-accent').trim(),
      text: computedStyle.getPropertyValue('--color-text').trim(),
      glow: computedStyle.getPropertyValue('--color-glow').trim(),
      bg: computedStyle.getPropertyValue('--color-bg').trim(),
      bgSecondary: computedStyle.getPropertyValue('--color-bg-secondary').trim(),
      border: computedStyle.getPropertyValue('--color-border').trim(),
    }
  }

  // Calculate cell size based on canvas dimensions
  const calculateCellSize = (canvasWidth: number, canvasHeight: number): number => {
    // Account for device pixel ratio - canvas dimensions are in device pixels
    const dpr = window.devicePixelRatio || 1
    const logicalWidth = canvasWidth / dpr
    const logicalHeight = canvasHeight / dpr
    
    const padding = 40
    const availableWidth = logicalWidth - padding * 2
    const availableHeight = logicalHeight - padding * 2
    const cellSize = Math.min(availableWidth / GRID_SIZE, availableHeight / GRID_SIZE)
    return Math.max(10, cellSize) // Minimum cell size
  }

  // Convert grid coordinates to canvas coordinates
  const gridToCanvas = (row: number, col: number, cellSize: number, padding: number) => {
    return {
      x: padding + col * cellSize + cellSize / 2,
      y: padding + row * cellSize + cellSize / 2,
    }
  }

  // Convert canvas coordinates to grid coordinates
  const canvasToGrid = (x: number, y: number, cellSize: number, padding: number): { row: number; col: number } | null => {
    const col = Math.floor((x - padding) / cellSize)
    const row = Math.floor((y - padding) / cellSize)
    
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      return { row, col }
    }
    return null
  }

  // Find node at canvas coordinates (with tolerance for easier clicking)
  const findNodeAtPosition = (x: number, y: number): Node | null => {
    const canvas = canvasRef.current
    if (!canvas) return null

    // Coordinates are already in CSS pixels (from getBoundingClientRect)
    // Canvas is scaled by DPR, so we need to convert to logical coordinates
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    // x and y are already relative to canvas CSS size, so we can use them directly
    // (no need to scale since context is already scaled by DPR)

    const cellSize = calculateCellSize(canvas.width, canvas.height)
    const padding = 40
    
    // Check each node to see if click is within node bounds (with tolerance)
    const nodeRadius = cellSize * 0.25 // Node size is 40% of cell, so radius is 20%
    const tolerance = nodeRadius * 1.5 // Add 50% tolerance for easier clicking
    
    for (const node of gameState.nodes) {
      const nodePos = gridToCanvas(node.row, node.col, cellSize, padding)
      const distance = Math.sqrt(
        Math.pow(x - nodePos.x, 2) + Math.pow(y - nodePos.y, 2)
      )
      
      if (distance <= tolerance) {
        return node
      }
    }
    
    return null
  }

  // Draw grid background
  const drawGrid = (ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>, cellSize: number, padding: number) => {
    if (!colors) return

    ctx.save()
    ctx.strokeStyle = colors.border
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.3

    // Draw vertical lines
    for (let col = 0; col <= GRID_SIZE; col++) {
      const x = padding + col * cellSize
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, padding + GRID_SIZE * cellSize)
      ctx.stroke()
    }

    // Draw horizontal lines
    for (let row = 0; row <= GRID_SIZE; row++) {
      const y = padding + row * cellSize
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + GRID_SIZE * cellSize, y)
      ctx.stroke()
    }

    ctx.globalAlpha = 1
    ctx.restore()
  }

  // Draw connection line (grid-aligned path)
  const drawConnection = (
    ctx: CanvasRenderingContext2D,
    colors: ReturnType<typeof getThemeColors>,
    from: Node,
    to: Node,
    cellSize: number,
    padding: number,
    isActive: boolean = false
  ) => {
    if (!colors) return

    const fromPos = gridToCanvas(from.row, from.col, cellSize, padding)
    const toPos = gridToCanvas(to.row, to.col, cellSize, padding)

    ctx.save()

    // Draw line with neon glow effect
    if (isActive) {
      ctx.shadowBlur = 15
      ctx.shadowColor = colors.glow
      ctx.strokeStyle = colors.primary
      ctx.lineWidth = 3
    } else {
      ctx.shadowBlur = 8
      ctx.shadowColor = colors.glow
      ctx.strokeStyle = colors.accent
      ctx.lineWidth = 2
    }

    // Draw grid-aligned path (L-shaped: horizontal first, then vertical)
    ctx.beginPath()
    ctx.moveTo(fromPos.x, fromPos.y)
    
    // First move horizontally to align column
    ctx.lineTo(toPos.x, fromPos.y)
    // Then move vertically to align row
    ctx.lineTo(toPos.x, toPos.y)
    
    ctx.stroke()

    ctx.shadowBlur = 0
    ctx.restore()
  }

  // Draw node
  const drawNode = (
    ctx: CanvasRenderingContext2D,
    colors: ReturnType<typeof getThemeColors>,
    node: Node,
    cellSize: number,
    padding: number,
    pulsePhase: number
  ) => {
    if (!colors) return

    const pos = gridToCanvas(node.row, node.col, cellSize, padding)
    const nodeSize = cellSize * 0.4
    const isHovered = hoveredNodeRef.current === node.id
    const isSelected = gameState.selectedNodeId === node.id
    const isDragged = draggedNodeRef.current === node.id

    // Check if this node is part of required pairs
    const requiredPairs = getRequiredPairs(gameState.level)
    const isRequiredNode = requiredPairs.has(node.id)
    const requiredTargets = requiredPairs.get(node.id) || []
    
    // Check if all required pairs for this node are completed
    const allPairsCompleted = isRequiredNode && requiredTargets.every(targetId => {
      return isRequiredPairCompleted(
        { from: node.id, to: targetId },
        gameState.connections
      )
    })

    ctx.save()

    // Node pulse animation
    let pulseScale = 1
    if (node.state === 'active' || isSelected || isHovered) {
      pulseScale = 1 + Math.sin(pulsePhase) * 0.15
    } else if (node.state === 'connected' || node.state === 'completed') {
      pulseScale = 1 + Math.sin(pulsePhase * 0.5) * 0.1
    } else if (isRequiredNode && !allPairsCompleted) {
      // Pulse for required nodes that aren't completed yet
      pulseScale = 1 + Math.sin(pulsePhase * 0.3) * 0.08
    }

    const currentSize = nodeSize * pulseScale

    // Draw node glow - stronger for required nodes and completed pairs
    if (node.state === 'completed' || allPairsCompleted) {
      ctx.shadowBlur = 25
      ctx.shadowColor = colors.accent
    } else if (node.state === 'active' || isSelected || isHovered || isDragged) {
      ctx.shadowBlur = 20
      ctx.shadowColor = colors.glow
    } else if (node.state === 'connected') {
      ctx.shadowBlur = 10
      ctx.shadowColor = colors.glow
    } else if (isRequiredNode) {
      // Subtle glow for required nodes
      ctx.shadowBlur = 8
      ctx.shadowColor = colors.accent
    } else {
      ctx.shadowBlur = 0
    }

    // Draw node (pixelated server/router style)
    // Use accent color for completed pairs, primary for others
    // Use slightly different color for required nodes
    if (node.state === 'completed' || allPairsCompleted) {
      ctx.fillStyle = colors.accent
    } else if (isRequiredNode) {
      // Slightly brighter for required nodes
      ctx.fillStyle = colors.primary
    } else {
      ctx.fillStyle = colors.primary
    }
    
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, currentSize / 2, 0, Math.PI * 2)
    ctx.fill()

    // Draw node center (server/router detail)
    ctx.fillStyle = colors.bgSecondary
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, currentSize / 4, 0, Math.PI * 2)
    ctx.fill()
    
    // Draw indicator for required nodes (small ring or dot)
    if (isRequiredNode && !allPairsCompleted) {
      ctx.strokeStyle = colors.accent
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, currentSize / 2 + 3, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Draw connection points (small dots on edges)
    if (node.state === 'connected' || node.state === 'active') {
      ctx.fillStyle = colors.glow
      const connectionPointSize = 3
      
      // Top
      ctx.beginPath()
      ctx.arc(pos.x, pos.y - currentSize / 2, connectionPointSize, 0, Math.PI * 2)
      ctx.fill()
      
      // Right
      ctx.beginPath()
      ctx.arc(pos.x + currentSize / 2, pos.y, connectionPointSize, 0, Math.PI * 2)
      ctx.fill()
      
      // Bottom
      ctx.beginPath()
      ctx.arc(pos.x, pos.y + currentSize / 2, connectionPointSize, 0, Math.PI * 2)
      ctx.fill()
      
      // Left
      ctx.beginPath()
      ctx.arc(pos.x - currentSize / 2, pos.y, connectionPointSize, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.shadowBlur = 0
    ctx.restore()
  }

  // Draw completion animation
  const drawCompletionAnimation = (
    ctx: CanvasRenderingContext2D,
    colors: ReturnType<typeof getThemeColors>,
    cellSize: number,
    padding: number
  ) => {
    if (!colors || !gameState.completed) return

    ctx.save()
    ctx.globalAlpha = 0.3
    ctx.fillStyle = colors.glow
    ctx.fillRect(
      padding,
      padding,
      GRID_SIZE * cellSize,
      GRID_SIZE * cellSize
    )
    ctx.globalAlpha = 1
    ctx.restore()
  }

  // Main render function
  const render = (currentTime: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const colors = getThemeColors()
    if (!colors) return

    // Calculate dimensions (account for DPR scaling)
    const dpr = window.devicePixelRatio || 1
    const logicalWidth = canvas.width / dpr
    const logicalHeight = canvas.height / dpr
    const cellSize = calculateCellSize(canvas.width, canvas.height)
    const padding = 40

    // Clear canvas (use logical dimensions)
    ctx.fillStyle = colors.bg
    ctx.fillRect(0, 0, logicalWidth, logicalHeight)

    // Update pulse animation
    const deltaTime = currentTime - lastFrameTimeRef.current
    lastFrameTimeRef.current = currentTime
    pulseAnimationRef.current += deltaTime * 0.005

    // Draw grid
    drawGrid(ctx, colors, cellSize, padding)

    // Draw connections (must be drawn before nodes so they appear behind)
    if (gameState.connections && gameState.connections.length > 0) {
      gameState.connections.forEach((conn, index) => {
        const fromNode = gameState.nodes.find(n => n.id === conn.from)
        const toNode = gameState.nodes.find(n => n.id === conn.to)
        if (fromNode && toNode) {
          const isActive = draggedNodeRef.current === conn.from || draggedNodeRef.current === conn.to
          
          // Check if this is a required connection (brighter glow)
          const isRequired = gameState.level?.requiredConnections.some(
            reqConn =>
              (reqConn.from === conn.from && reqConn.to === conn.to) ||
              (reqConn.from === conn.to && reqConn.to === conn.from)
          )
          
          // Draw with stronger glow if it's a required connection
          drawConnection(ctx, colors, fromNode, toNode, cellSize, padding, isActive || isRequired)
        } else {
          // Debug: log missing nodes
          
        }
      })
    }

    // Draw temporary drag connection
    if (draggedNodeRef.current && dragStartPosRef.current) {
      const draggedNode = gameState.nodes.find(n => n.id === draggedNodeRef.current)
      if (draggedNode) {
        const fromPos = gridToCanvas(draggedNode.row, draggedNode.col, cellSize, padding)
        
        // Draw dashed line for drag connection
        ctx.save()
        ctx.strokeStyle = colors.accent
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(fromPos.x, fromPos.y)
        ctx.lineTo(dragStartPosRef.current.x, dragStartPosRef.current.y)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.restore()
      }
    }

    // Draw nodes
    gameState.nodes.forEach(node => {
      drawNode(ctx, colors, node, cellSize, padding, pulseAnimationRef.current)
    })

    // Draw completion animation
    drawCompletionAnimation(ctx, colors, cellSize, padding)

    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(render)
  }

  // Initialize canvas and start render loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size
    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (!container) return

      const rect = container.getBoundingClientRect()
      // Use device pixel ratio for crisp rendering
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      
      // Scale context to match device pixel ratio
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(dpr, dpr)
      }
      
      // Set CSS size to match container
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Start render loop
    lastFrameTimeRef.current = performance.now()
    animationFrameRef.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameState])

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const node = findNodeAtPosition(x, y)
    if (node) {
      draggedNodeRef.current = node.id
      dragStartPosRef.current = { x, y }
      onNodeDragStart?.(node.id)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (draggedNodeRef.current && dragStartPosRef.current) {
      // Update drag position
      dragStartPosRef.current = { x, y }
      
    } else {
      const node = findNodeAtPosition(x, y)
      if (node && hoveredNodeRef.current !== node.id) {
        hoveredNodeRef.current = node.id
        onNodeHover?.(node.id)
      } else if (!node && hoveredNodeRef.current) {
        hoveredNodeRef.current = null
        onNodeHover?.(null)
      }
    }
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (draggedNodeRef.current) {
      const targetNode = findNodeAtPosition(x, y)
      const draggedId = draggedNodeRef.current
      draggedNodeRef.current = null
      dragStartPosRef.current = null
      
      // Call drag end with target node ID (or empty string if no target)
      if (targetNode && targetNode.id !== draggedId) {
        onNodeDragEnd?.(targetNode.id)
      } else {
        onNodeDragEnd?.('')
      }
    } else {
      const node = findNodeAtPosition(x, y)
      if (node) {
        onNodeClick?.(node.id)
      }
    }
  }

  // Handle touch events (using non-passive listeners to allow preventDefault)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      const rect = canvas.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      // Find node at position (inline function to avoid dependency issues)
      const findNode = (x: number, y: number): Node | null => {
        if (!canvas) return null
        const dpr = window.devicePixelRatio || 1
        const cellSize = calculateCellSize(canvas.width, canvas.height)
        const padding = 40
        const nodeRadius = cellSize * 0.25
        const tolerance = nodeRadius * 1.5
        
        for (const node of gameState.nodes) {
          const nodePos = gridToCanvas(node.row, node.col, cellSize, padding)
          const distance = Math.sqrt(
            Math.pow(x - nodePos.x, 2) + Math.pow(y - nodePos.y, 2)
          )
          if (distance <= tolerance) {
            return node
          }
        }
        return null
      }

      const node = findNode(x, y)
      if (node) {
        draggedNodeRef.current = node.id
        dragStartPosRef.current = { x, y }
        onNodeDragStart?.(node.id)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (!draggedNodeRef.current) return

      const touch = e.touches[0]
      const rect = canvas.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      dragStartPosRef.current = { x, y }
      
      // Check if hovering over a node and validate connection
      const findNode = (x: number, y: number): Node | null => {
        if (!canvas) return null
        const dpr = window.devicePixelRatio || 1
        const cellSize = calculateCellSize(canvas.width, canvas.height)
        const padding = 40
        const nodeRadius = cellSize * 0.25
        const tolerance = nodeRadius * 1.5
        
        for (const node of gameState.nodes) {
          const nodePos = gridToCanvas(node.row, node.col, cellSize, padding)
          const distance = Math.sqrt(
            Math.pow(x - nodePos.x, 2) + Math.pow(y - nodePos.y, 2)
          )
          if (distance <= tolerance) {
            return node
          }
        }
        return null
      }
      
    }

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault()
      
      // Find node at position (inline function)
      const findNode = (x: number, y: number): Node | null => {
        if (!canvas) return null
        const dpr = window.devicePixelRatio || 1
        const cellSize = calculateCellSize(canvas.width, canvas.height)
        const padding = 40
        const nodeRadius = cellSize * 0.25
        const tolerance = nodeRadius * 1.5
        
        for (const node of gameState.nodes) {
          const nodePos = gridToCanvas(node.row, node.col, cellSize, padding)
          const distance = Math.sqrt(
            Math.pow(x - nodePos.x, 2) + Math.pow(y - nodePos.y, 2)
          )
          if (distance <= tolerance) {
            return node
          }
        }
        return null
      }
      
      if (draggedNodeRef.current) {
        const touch = e.changedTouches[0]
        const rect = canvas.getBoundingClientRect()
        const x = touch.clientX - rect.left
        const y = touch.clientY - rect.top

        const targetNode = findNode(x, y)
        const draggedId = draggedNodeRef.current
        draggedNodeRef.current = null
        dragStartPosRef.current = null
        
        // Call drag end with target node ID (or empty string if no target)
        if (targetNode && targetNode.id !== draggedId) {
          onNodeDragEnd?.(targetNode.id)
        } else {
          onNodeDragEnd?.('')
        }
      } else {
        const touch = e.changedTouches[0]
        const rect = canvas.getBoundingClientRect()
        const x = touch.clientX - rect.left
        const y = touch.clientY - rect.top
        const node = findNode(x, y)
        if (node) {
          onNodeClick?.(node.id)
        }
      }
    }

    // Add listeners with passive: false to allow preventDefault
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onNodeClick, onNodeDragStart, onNodeDragEnd, gameState])

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="w-full h-full touch-none"
      style={{ touchAction: 'none' }}
    />
  )
}

