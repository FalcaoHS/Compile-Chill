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
      {/* ====== ANALISTA JR: Cores aleatórias tentando ser legal ====== */}
      {theme === 'analista-jr' && (
        <>
          {/* Grid colorido meio torto */}
          <div
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              backgroundImage: `
                linear-gradient(rgba(78, 205, 196, 0.15) 1.5px, transparent 1.5px),
                linear-gradient(90deg, rgba(255, 107, 107, 0.15) 1.5px, transparent 1.5px)
              `,
              backgroundSize: '35px 35px',
            }}
            aria-hidden="true"
          />
          {/* Dots aleatórios */}
          <div
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(78, 205, 196, 0.25) 2px, transparent 2px)`,
              backgroundSize: '45px 45px',
              backgroundPosition: '10px 10px',
            }}
            aria-hidden="true"
          />
        </>
      )}

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

      {/* ====== BRUNO C# DE BURRO: Espaço Sideral Melancólico (Marvin Theme) ====== */}
      {theme === 'bruno-csharp' && (
        <>
          {/* Espaço profundo (gradiente de nebulosa sutil) */}
          <div
            className="fixed inset-0 pointer-events-none z-40"
            style={{
              background: `
                radial-gradient(ellipse at 20% 30%, rgba(92, 219, 149, 0.04), transparent 60%),
                radial-gradient(ellipse at 80% 70%, rgba(127, 143, 166, 0.05), transparent 60%),
                radial-gradient(circle at 50% 50%, rgba(37, 42, 49, 0.3), rgba(37, 42, 49, 0.1))
              `,
            }}
            aria-hidden="true"
          />
          
          {/* Estrelas pequenas distantes (cansadas) */}
          <div
            className="fixed inset-0 pointer-events-none z-41"
            style={{
              backgroundImage: `
                radial-gradient(circle, rgba(180, 188, 200, 0.3) 0.5px, transparent 1px),
                radial-gradient(circle, rgba(180, 188, 200, 0.2) 0.5px, transparent 1px)
              `,
              backgroundSize: '150px 150px, 230px 230px',
              backgroundPosition: '0 0, 75px 115px',
            }}
            aria-hidden="true"
          />
          
          {/* Estrelas médias (piscando devagar) */}
          <div
            className="fixed inset-0 pointer-events-none z-42 animate-[pulse_8s_ease-in-out_infinite]"
            style={{
              backgroundImage: `
                radial-gradient(circle, rgba(143, 235, 165, 0.4) 1px, transparent 2px),
                radial-gradient(circle, rgba(180, 188, 200, 0.35) 0.8px, transparent 1.5px)
              `,
              backgroundSize: '300px 300px, 400px 400px',
              backgroundPosition: '50px 80px, 200px 150px',
            }}
            aria-hidden="true"
          />
          
          {/* Estrelas grandes (bem raras, muito lentas) */}
          <div
            className="fixed inset-0 pointer-events-none z-43 animate-[pulse_12s_ease-in-out_infinite]"
            style={{
              backgroundImage: `
                radial-gradient(circle, rgba(92, 219, 149, 0.5) 1.5px, transparent 3px)
              `,
              backgroundSize: '600px 600px',
              backgroundPosition: '120px 200px',
            }}
            aria-hidden="true"
          />
          
          {/* Poeira cósmica (noise espacial) */}
          <div
            className="fixed inset-0 pointer-events-none z-44 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='spaceNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.015' numOctaves='6' seed='42' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23spaceNoise)' opacity='0.4'/%3E%3C/svg%3E")`,
            }}
            aria-hidden="true"
          />
          
          {/* Overlay melancólico final (vignette) */}
          <div
            className="fixed inset-0 pointer-events-none z-45"
            style={{
              background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(37, 42, 49, 0.4) 100%)',
              mixBlendMode: 'multiply',
            }}
            aria-hidden="true"
          />
          
          {/* Scanlines de monitor antigo (referência sci-fi anos 70) */}
          <div
            className="fixed inset-0 pointer-events-none z-46"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 4px,
                rgba(92, 219, 149, 0.008) 4px,
                rgba(92, 219, 149, 0.008) 8px
              )`,
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

