/**
 * Canvas utilities for generating score card images for sharing
 * 
 * This module provides functions to generate shareable images
 * from score card data using the Canvas API.
 */

interface ScoreCardImageOptions {
  gameName: string
  score: number
  theme?: string
  width?: number
  height?: number
}

/**
 * Generate a shareable image for a score card
 * 
 * @param options - Score card data and styling options
 * @returns Promise resolving to a data URL of the generated image
 */
export async function generateScoreCardImage(
  options: ScoreCardImageOptions
): Promise<string> {
  const { gameName, score, theme = "cyber", width = 1200, height = 630 } = options

  // Create canvas
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  
  if (!ctx) {
    throw new Error("Canvas context not available")
  }

  // Get theme colors from CSS variables
  const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-primary")
    .trim() || "#00ff00"
  
  const bgColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-bg")
    .trim() || "#000000"
  
  const textColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-text")
    .trim() || "#ffffff"

  // Draw background
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, width, height)

  // Draw game name
  ctx.fillStyle = textColor
  ctx.font = "bold 48px system-ui"
  ctx.textAlign = "center"
  ctx.fillText(gameName, width / 2, height / 2 - 60)

  // Draw score
  ctx.fillStyle = primaryColor
  ctx.font = "bold 72px system-ui"
  ctx.fillText(score.toLocaleString(), width / 2, height / 2 + 40)

  // Add theme-specific effects based on theme
  if (theme === "neon" || theme === "cyber") {
    // Add glow effect
    ctx.shadowBlur = 20
    ctx.shadowColor = primaryColor
    ctx.fillText(score.toLocaleString(), width / 2, height / 2 + 40)
  }

  // Return as data URL
  return canvas.toDataURL("image/png")
}

/**
 * Download the generated image
 */
export function downloadScoreCardImage(dataUrl: string, filename: string) {
  const link = document.createElement("a")
  link.download = filename
  link.href = dataUrl
  link.click()
}

