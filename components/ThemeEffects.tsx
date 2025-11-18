"use client"

import { useThemeStore } from "@/lib/theme-store"

/**
 * ThemeEffects component
 * 
 * Applies global visual effects based on current theme.
 * Effects include: scanlines, noise, neon bloom, etc.
 * Mounted in root layout for global application.
 */
export function ThemeEffects() {
  const { theme } = useThemeStore()

  return (
    <>
      {/* Cyber Hacker: Scanlines effect */}
      {theme === 'cyber' && (
        <div
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(126, 249, 255, var(--scanline-opacity)) 2px,
              rgba(126, 249, 255, var(--scanline-opacity)) 4px
            )`,
            mixBlendMode: 'overlay',
          }}
          aria-hidden="true"
        />
      )}

      {/* Cyber Hacker: Noise effect */}
      {theme === 'cyber' && (
        <div
          className="fixed inset-0 pointer-events-none z-50 opacity-[var(--noise-opacity)]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay',
          }}
          aria-hidden="true"
        />
      )}

      {/* Pixel Lab: Pixelated overlay */}
      {theme === 'pixel' && (
        <div
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            imageRendering: 'pixelated',
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent calc(var(--pixel-size) - 1px),
              rgba(255, 107, 157, 0.05) calc(var(--pixel-size) - 1px),
              rgba(255, 107, 157, 0.05) var(--pixel-size)
            )`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Neon Future: Bloom effect */}
      {theme === 'neon' && (
        <div
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            background: `radial-gradient(
              circle at 50% 50%,
              rgba(0, 245, 255, calc(0.1 * var(--neon-bloom-intensity))),
              transparent 70%
            )`,
            mixBlendMode: 'screen',
          }}
          aria-hidden="true"
        />
      )}

      {/* Blueprint Dev: Grid pattern */}
      {theme === 'blueprint' && (
        <div
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            backgroundImage: `
              linear-gradient(rgba(74, 158, 255, var(--grid-opacity)) 1px, transparent 1px),
              linear-gradient(90deg, rgba(74, 158, 255, var(--grid-opacity)) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
          aria-hidden="true"
        />
      )}
    </>
  )
}

