"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useThemeStore } from "@/lib/theme-store"
import type { GameState, Node, Packet, Link } from "@/lib/games/packet-switch/game-logic"
import { getNodeById, linkExists } from "@/lib/games/packet-switch/game-logic"

interface PacketSwitchCanvasProps {
  gameState: GameState
  onNodeClick?: (nodeId: string) => void
  onUpdate?: (deltaTime: number) => void
}

export function PacketSwitchCanvas({
  gameState,
  onNodeClick,
  onUpdate,
}: PacketSwitchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastFrameTimeRef = useRef<number>(0)
  const animationFrameRef = useRef<number>()
  const pulseAnimationRef = useRef<number>(0)
  const hoveredNodeRef = useRef<string | null>(null)

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

  // Convert hex color to RGB values
  const hexToRgb = (hex: string): string => {
    hex = hex.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `${r}, ${g}, ${b}`
  }

  // Find node at canvas coordinates (with tolerance for easier clicking)
  const findNodeAtPosition = (x: number, y: number): Node | null => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    // Convert to logical coordinates
    const logicalWidth = canvas.width / dpr
    const logicalHeight = canvas.height / dpr
    const logicalX = (x / rect.width) * logicalWidth
    const logicalY = (y / rect.height) * logicalHeight

    // Scale node positions to match current canvas
    const scaledNodes = scaleNodePositions(gameState.nodes, logicalWidth, logicalHeight)

    const nodeRadius = 15 // Node clickable radius
    const tolerance = nodeRadius * 1.5 // Add 50% tolerance for easier clicking

    for (const node of scaledNodes) {
      const distance = Math.sqrt(
        Math.pow(logicalX - node.x, 2) + Math.pow(logicalY - node.y, 2)
      )

      if (distance <= tolerance) {
        // Return original node (not scaled) for game logic
        return gameState.nodes.find(n => n.id === node.id) || null
      }
    }

    return null
  }

  // Draw link between two nodes
  const drawLink = (
    ctx: CanvasRenderingContext2D,
    colors: ReturnType<typeof getThemeColors>,
    from: Node,
    to: Node,
    isActive: boolean = false
  ) => {
    if (!colors) return

    ctx.save()

    // Draw line with glow effect
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

    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()

    ctx.shadowBlur = 0
    ctx.restore()
  }

  // Draw node
  const drawNode = (
    ctx: CanvasRenderingContext2D,
    colors: ReturnType<typeof getThemeColors>,
    node: Node,
    pulsePhase: number
  ) => {
    if (!colors) return

    const isHovered = hoveredNodeRef.current === node.id
    const isActive = node.state === 'active'

    ctx.save()

    // Node pulse animation
    let pulseScale = 1
    if (isActive || isHovered) {
      pulseScale = 1 + Math.sin(pulsePhase) * 0.15
    }

    const nodeSize = 12 * pulseScale

    // Draw node glow
    if (node.type === 'source') {
      ctx.shadowBlur = 20
      ctx.shadowColor = colors.accent
    } else if (node.type === 'destination') {
      ctx.shadowBlur = 20
      ctx.shadowColor = colors.primary
    } else if (isActive || isHovered) {
      ctx.shadowBlur = 15
      ctx.shadowColor = colors.glow
    } else {
      ctx.shadowBlur = 8
      ctx.shadowColor = colors.glow
    }

    // Draw node (router/switch style)
    if (node.type === 'source') {
      ctx.fillStyle = colors.accent
    } else if (node.type === 'destination') {
      ctx.fillStyle = colors.primary
    } else {
      ctx.fillStyle = colors.primary
    }

    ctx.beginPath()
    ctx.arc(node.x, node.y, nodeSize / 2, 0, Math.PI * 2)
    ctx.fill()

    // Draw node center (router detail)
    ctx.fillStyle = colors.bgSecondary
    ctx.beginPath()
    ctx.arc(node.x, node.y, nodeSize / 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.shadowBlur = 0
    ctx.restore()
  }

  // Draw packet particle
  const drawPacket = (
    ctx: CanvasRenderingContext2D,
    colors: ReturnType<typeof getThemeColors>,
    packet: Packet,
    fromNode: Node | undefined,
    toNode: Node | undefined
  ) => {
    if (!colors || !fromNode || !toNode) return

    // Calculate packet position along link
    const dx = toNode.x - fromNode.x
    const dy = toNode.y - fromNode.y
    const x = fromNode.x + dx * packet.progress
    const y = fromNode.y + dy * packet.progress

    ctx.save()

    // Packet glow effect
    ctx.shadowBlur = 10
    ctx.shadowColor = colors.glow
    ctx.fillStyle = colors.accent

    ctx.beginPath()
    ctx.arc(x, y, 6, 0, Math.PI * 2)
    ctx.fill()

    ctx.shadowBlur = 0
    ctx.restore()
  }

  // Draw completion animation (pop of light)
  const drawCompletionAnimation = (
    ctx: CanvasRenderingContext2D,
    colors: ReturnType<typeof getThemeColors>
  ) => {
    if (!colors || !gameState.completed) return

    ctx.save()
    ctx.globalAlpha = 0.3
    ctx.fillStyle = colors.glow
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.globalAlpha = 1
    ctx.restore()
  }

  // Scale node positions to fit canvas
  const scaleNodePositions = (nodes: Node[], canvasWidth: number, canvasHeight: number): Node[] => {
    // Levels are designed for ~700x600 canvas, scale to actual canvas size
    const designWidth = 700
    const designHeight = 600
    
    const scaleX = canvasWidth / designWidth
    const scaleY = canvasHeight / designHeight
    const scale = Math.min(scaleX, scaleY) // Maintain aspect ratio
    
    // Center the scaled content
    const offsetX = (canvasWidth - designWidth * scale) / 2
    const offsetY = (canvasHeight - designHeight * scale) / 2
    
    return nodes.map(node => ({
      ...node,
      x: node.x * scale + offsetX,
      y: node.y * scale + offsetY,
    }))
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

    // Scale node positions to fit canvas
    const scaledNodes = scaleNodePositions(gameState.nodes, logicalWidth, logicalHeight)

    // Clear canvas
    ctx.fillStyle = colors.bg
    ctx.fillRect(0, 0, logicalWidth, logicalHeight)

    // Update pulse animation
    const deltaTime = currentTime - lastFrameTimeRef.current
    lastFrameTimeRef.current = currentTime
    pulseAnimationRef.current += deltaTime * 0.005

    // Call onUpdate callback
    if (onUpdate) {
      onUpdate(deltaTime)
    }

    // Draw links (must be drawn before nodes so they appear behind)
    gameState.links.forEach(link => {
      const fromNode = getNodeById(link.from, scaledNodes)
      const toNode = getNodeById(link.to, scaledNodes)
      
      if (fromNode && toNode) {
        // Check if any packet is traveling on this link
        const isActive = gameState.activePackets.some(packet => 
          (packet.currentNodeId === link.from && packet.targetNodeId === link.to) ||
          (packet.currentNodeId === link.to && packet.targetNodeId === link.from)
        )
        
        drawLink(ctx, colors, fromNode, toNode, isActive)
      }
    })

    // Draw nodes
    scaledNodes.forEach(node => {
      drawNode(ctx, colors, node, pulseAnimationRef.current)
    })

    // Draw packet particles
    gameState.activePackets.forEach(packet => {
      if (packet.targetNodeId) {
        const fromNode = getNodeById(packet.currentNodeId, scaledNodes)
        const toNode = getNodeById(packet.targetNodeId, scaledNodes)
        drawPacket(ctx, colors, packet, fromNode, toNode)
      } else {
        // Packet is at a node, draw it there
        const currentNode = getNodeById(packet.currentNodeId, scaledNodes)
        if (currentNode) {
          ctx.save()
          ctx.shadowBlur = 10
          ctx.shadowColor = colors.glow
          ctx.fillStyle = colors.accent
          ctx.beginPath()
          ctx.arc(currentNode.x, currentNode.y, 6, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
          ctx.restore()
        }
      }
    })

    // Draw completion animation
    drawCompletionAnimation(ctx, colors)

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
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(dpr, dpr)
      }

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
  const handleMouseClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || gameState.gameOver) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const node = findNodeAtPosition(x, y)
    if (node && onNodeClick) {
      onNodeClick(node.id)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const node = findNodeAtPosition(x, y)
    hoveredNodeRef.current = node ? node.id : null
  }

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || gameState.gameOver) return

    e.preventDefault()
    const touch = e.touches[0]
    const rect = canvas.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    const node = findNodeAtPosition(x, y)
    if (node && onNodeClick) {
      onNodeClick(node.id)
    }
  }

  return (
    <canvas
      ref={canvasRef}
      onClick={handleMouseClick}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      className="w-full h-full"
      style={{ touchAction: 'none' }}
    />
  )
}

