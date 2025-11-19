"use client"

import { useThemeStore } from "@/lib/theme-store"

/**
 * ThemeEffects component
 * 
 * Applies global visual effects based on current theme.
 * Each theme now has a UNIQUE background effect.
 * Mounted in root layout for global application.
 */
export function ThemeEffects() {
  const { theme } = useThemeStore()

  return (
    <>
      {/* ====== CYBER HACKER: Scanlines + Matrix Rain ====== */}
      {theme === 'cyber' && (
        <>
          {/* Scanlines horizontais */}
          <div
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 255, 255, 0.03) 2px,
                rgba(0, 255, 255, 0.03) 4px
              )`,
              mixBlendMode: 'overlay',
            }}
            aria-hidden="true"
          />
          {/* Grid ciano diagonal */}
          <div
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              backgroundImage: `
                linear-gradient(45deg, transparent 48%, rgba(0, 255, 255, 0.02) 49%, rgba(0, 255, 255, 0.02) 51%, transparent 52%),
                linear-gradient(-45deg, transparent 48%, rgba(0, 255, 255, 0.02) 49%, rgba(0, 255, 255, 0.02) 51%, transparent 52%)
              `,
              backgroundSize: '80px 80px',
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* ====== PIXEL LAB: Pixelated Grid + Retro Dots ====== */}
      {theme === 'pixel' && (
        <>
          {/* Grid pixelado */}
          <div
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              imageRendering: 'pixelated',
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 3px,
                rgba(255, 107, 157, 0.04) 3px,
                rgba(255, 107, 157, 0.04) 4px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 3px,
                rgba(255, 107, 157, 0.04) 3px,
                rgba(255, 107, 157, 0.04) 4px
              )`,
            }}
            aria-hidden="true"
          />
          {/* Dots retrô */}
          <div
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255, 107, 157, 0.08) 1px, transparent 1px)`,
              backgroundSize: '16px 16px',
              imageRendering: 'pixelated',
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* ====== NEON FUTURE: Bloom Rosa + Ondas Roxas ====== */}
      {theme === 'neon' && (
        <>
          {/* Bloom rosa central */}
          <div
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, rgba(255, 0, 110, 0.15), transparent 50%),
                radial-gradient(circle at 70% 70%, rgba(251, 86, 7, 0.12), transparent 50%)
              `,
              mixBlendMode: 'screen',
            }}
            aria-hidden="true"
          />
          {/* Ondas concêntricas roxas */}
          <div
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              backgroundImage: `repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 80px, rgba(131, 56, 236, 0.03) 81px, transparent 82px)`,
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* ====== TERMINAL: Matrix Code Rain Effect ====== */}
      {theme === 'terminal' && (
        <>
          {/* Scanlines verdes */}
          <div
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 1px,
                rgba(0, 255, 0, 0.02) 1px,
                rgba(0, 255, 0, 0.02) 2px
              )`,
            }}
            aria-hidden="true"
          />
          {/* Linhas verticais (simulando code rain) */}
          <div
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 19px,
                rgba(0, 255, 0, 0.03) 19px,
                rgba(0, 255, 0, 0.03) 20px
              )`,
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* ====== BLUEPRINT DEV: Grid Técnico + Circuitos ====== */}
      {theme === 'blueprint' && (
        <>
          {/* Grid blueprint principal */}
          <div
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              backgroundImage: `
                linear-gradient(rgba(74, 158, 255, 0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(74, 158, 255, 0.08) 1px, transparent 1px),
                linear-gradient(rgba(74, 158, 255, 0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(74, 158, 255, 0.04) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
            }}
            aria-hidden="true"
          />
          {/* Linhas diagonais (circuitos) */}
          <div
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              backgroundImage: `
                linear-gradient(45deg, transparent 45%, rgba(74, 158, 255, 0.02) 49%, rgba(74, 158, 255, 0.02) 51%, transparent 55%)
              `,
              backgroundSize: '60px 60px',
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* ====== BRUNO C# DE BURRO: Suspiros + Overlay Melancólico ====== */}
      {theme === 'bruno-csharp' && (
        <>
          {/* Overlay de cansaço */}
          <div
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              background: 'rgba(37, 42, 49, 0.1)',
              mixBlendMode: 'multiply',
            }}
            aria-hidden="true"
          />
          {/* Scanlines muito sutis */}
          <div
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 3px,
                rgba(92, 219, 149, 0.015) 3px,
                rgba(92, 219, 149, 0.015) 6px
              )`,
            }}
            aria-hidden="true"
          />
          {/* Noise sutil (tela velha) */}
          <div
            className="fixed inset-0 pointer-events-none z-50 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* ====== ANALISTA SR: Textura de Papel + Linhas Corporativas ====== */}
      {theme === 'analista-sr' && (
        <>
          {/* Textura de papel sutil */}
          <div
            className="fixed inset-0 pointer-events-none z-50 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperFilter)'/%3E%3C/svg%3E")`,
            }}
            aria-hidden="true"
          />
          {/* Grid corporativo muito sutil */}
          <div
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              backgroundImage: `
                linear-gradient(rgba(44, 62, 80, 0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(44, 62, 80, 0.02) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
            aria-hidden="true"
          />
        </>
      )}
    </>
  )
}

