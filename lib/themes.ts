/**
 * Theme configuration for Compile & Chill
 * 
 * Defines 6 unique visual themes with comprehensive design tokens.
 * Each theme includes colors, typography, and effect variables.
 */

export type ThemeId = 'cyber' | 'pixel' | 'neon' | 'terminal' | 'blueprint' | 'bruno-csharp'

export interface Theme {
  name: string
  vars: Record<string, string>
}

export const THEMES: Record<ThemeId, Theme> = {
  cyber: {
    name: 'Cyber Hacker',
    vars: {
      // Colors
      '--color-bg': '#070912',
      '--color-bg-secondary': '#0a0f1a',
      '--color-primary': '#7ef9ff',
      '--color-primary-hover': '#5dd5e0',
      '--color-accent': '#7dd3fc',
      '--color-accent-hover': '#60b8d4',
      '--color-muted': '#94a3b8',
      '--color-text': '#e2e8f0',
      '--color-text-secondary': '#cbd5e1',
      '--color-glow': 'rgba(126, 249, 255, 0.45)',
      '--color-border': 'rgba(126, 249, 255, 0.2)',
      
      // Typography
      '--font': "'Roboto Mono', 'Courier New', monospace",
      '--font-size-base': '16px',
      
      // Effects
      '--scanline-opacity': '0.06',
      '--noise-opacity': '0.03',
      '--glow-intensity': '1',
      '--cursor-blink': 'blink',
    },
  },
  pixel: {
    name: 'Pixel Lab',
    vars: {
      // Colors
      '--color-bg': '#1a1a2e',
      '--color-bg-secondary': '#16213e',
      '--color-primary': '#ff6b9d',
      '--color-primary-hover': '#ff4d7f',
      '--color-accent': '#c44569',
      '--color-accent-hover': '#a8325a',
      '--color-muted': '#8b7fa8',
      '--color-text': '#f4f4f4',
      '--color-text-secondary': '#d4d4d4',
      '--color-glow': 'rgba(255, 107, 157, 0.4)',
      '--color-border': 'rgba(255, 107, 157, 0.3)',
      
      // Typography
      '--font': "'Press Start 2P', 'Courier New', monospace",
      '--font-size-base': '14px',
      
      // Effects
      '--pixel-size': '4px',
      '--glitch-intensity': '0.5',
      '--glow-intensity': '0.8',
    },
  },
  neon: {
    name: 'Neon Future',
    vars: {
      // Colors
      '--color-bg': '#0a0e27',
      '--color-bg-secondary': '#0f1629',
      '--color-primary': '#00f5ff',
      '--color-primary-hover': '#00d4e0',
      '--color-accent': '#ff00ff',
      '--color-accent-hover': '#e000e0',
      '--color-muted': '#6b7aa0',
      '--color-text': '#ffffff',
      '--color-text-secondary': '#e0e0e0',
      '--color-glow': 'rgba(0, 245, 255, 0.6)',
      '--color-border': 'rgba(0, 245, 255, 0.4)',
      
      // Typography
      '--font': "'Orbitron', 'Arial', sans-serif",
      '--font-size-base': '16px',
      
      // Effects
      '--neon-bloom-intensity': '1.2',
      '--glow-intensity': '1.5',
      '--glass-opacity': '0.1',
    },
  },
  terminal: {
    name: 'Terminal Minimal',
    vars: {
      // Colors
      '--color-bg': '#1e1e1e',
      '--color-bg-secondary': '#252525',
      '--color-primary': '#4ec9b0',
      '--color-primary-hover': '#3ab89f',
      '--color-accent': '#569cd6',
      '--color-accent-hover': '#4a8bc0',
      '--color-muted': '#858585',
      '--color-text': '#d4d4d4',
      '--color-text-secondary': '#b4b4b4',
      '--color-glow': 'rgba(78, 201, 176, 0.3)',
      '--color-border': 'rgba(78, 201, 176, 0.2)',
      
      // Typography
      '--font': "'Fira Code', 'Consolas', monospace",
      '--font-size-base': '15px',
      
      // Effects
      '--cursor-blink': 'blink',
      '--minimal-opacity': '0.8',
    },
  },
  blueprint: {
    name: 'Blueprint Dev',
    vars: {
      // Colors
      '--color-bg': '#1a2332',
      '--color-bg-secondary': '#223344',
      '--color-primary': '#4a9eff',
      '--color-primary-hover': '#3a8eef',
      '--color-accent': '#5bb3ff',
      '--color-accent-hover': '#4ba3ef',
      '--color-muted': '#7a8a9a',
      '--color-text': '#e8f0f8',
      '--color-text-secondary': '#d0d8e0',
      '--color-glow': 'rgba(74, 158, 255, 0.4)',
      '--color-border': 'rgba(74, 158, 255, 0.3)',
      
      // Typography
      '--font': "'Inter', 'Segoe UI', sans-serif",
      '--font-size-base': '16px',
      
      // Effects
      '--grid-opacity': '0.1',
      '--line-opacity': '0.3',
      '--glow-intensity': '0.9',
    },
  },
  'bruno-csharp': {
    name: 'Bruno C# de Burro',
    vars: {
      // Colors - Paleta ÚNICA: Cinza hospital + Verde cirúrgico depressivo
      '--color-bg': '#252a31', // Cinza aço escuro (TOTALMENTE diferente dos outros)
      '--color-bg-secondary': '#2f3640', // Cinza concreto
      '--color-primary': '#b4bcc8', // Prata fosco envelhecido
      '--color-primary-hover': '#cbd3dd',
      '--color-accent': '#5cdb95', // Verde água hospitalar (único!)
      '--color-accent-hover': '#6ff3a8',
      '--color-secondary': '#3d4653', // Cinza ardósia azulado
      '--color-highlight': '#8feba5', // Verde menta pálido
      '--color-muted': '#6c7a89', // Cinza azulado neutro
      '--color-text': '#dfe4ea', // Texto prata claro
      '--color-text-secondary': '#a4b0be', // Texto névoa
      '--color-glow': 'rgba(92, 219, 149, 0.35)', // Glow verde água suave
      '--color-border': 'rgba(92, 219, 149, 0.18)',
      '--color-error': '#ee5a6f', // Rosa salmão (diferente!)
      
      // Typography - Condensada e pesada, como código antigo
      '--font': "'IBM Plex Mono', 'Consolas', monospace",
      '--font-size-base': '15px',
      '--font-weight-normal': '500', // Mais pesado que o normal
      '--line-height': '1.8', // Espaçamento cansado
      
      // Effects ÚNICOS - Movimentos pesados e relutantes
      '--glow-sm': '0 0 4px rgba(92, 219, 149, 0.2)', // Verde água fosco
      '--glow-md': '0 0 8px rgba(92, 219, 149, 0.3)',
      '--glow-lg': '0 0 15px rgba(92, 219, 149, 0.4)',
      '--glow-xl': '0 0 25px rgba(92, 219, 149, 0.5)',
      '--glow-intensity': '0.3', // Muito baixo (vs. 1.5 do neon, 1 do cyber)
      '--anim-duration': '1800ms', // MUITO mais lento que todos
      '--anim-easing': 'cubic-bezier(0.7, 0, 0.3, 1)', // Ease pesado
      '--border-radius': '2px', // Quase reto (robótico)
      '--pulse-speed': '4500ms', // Pulsação quase imperceptível
      '--drift-speed': '8000ms', // Drift preguiçoso
      '--scanline-opacity': '0.04', // Scanlines mais visíveis que cyber
      '--noise-opacity': '0.03', // Igual ao cyber mas com blur
      '--blur-intensity': '0.5px', // EXCLUSIVO: Leve desfoque nostálgico
      '--cursor-blink': 'slow-blink', // Cursor pisca devagar (vs. 'blink' normal)
      '--minimal-opacity': '0.6', // Mais transparente que terminal (0.8)
      
      // EXCLUSIVO: Efeitos de "cansaço" visual
      '--fatigue-overlay': 'rgba(13, 17, 23, 0.15)', // Overlay de cansaço
      '--glitch-chance': '0.02', // 2% chance de glitch aleatório
      '--flicker-interval': '7000ms', // Tela pisca a cada 7s
      '--sigh-particle-speed': '0.3', // Partículas caem devagar
      '--existential-pause': '2s', // Pausa antes de animações
      
      // Canvas/Game specific - Movimentos PESADOS
      '--orb-fill': '#7f8fa6', // Cinza prata azulado (único!)
      '--orb-stroke': '#5cdb95', // Verde água hospitalar
      '--orb-glow': 'rgba(92, 219, 149, 0.25)', // Glow verde água suave
      '--orb-trail-opacity': '0.18', // Rastro bem sutil
      '--orb-gravity': '1.4', // Cai MUITO pesado (exageradamente lento)
      '--basket-fill': '#353b48', // Cinza grafite azulado escuro
      '--basket-stroke': '#5cdb95',
      '--basket-stroke-width': '4px', // Linha MUITO grossa (robusta)
      '--particle-color-1': '#5cdb95', // Verde água
      '--particle-color-2': '#b4bcc8', // Prata
      '--particle-color-3': '#8feba5', // Verde menta
      '--particle-lifetime': '4200ms', // Partículas duram AINDA MAIS
      '--particle-fade-delay': '1500ms', // Demora muito pra sumir
      '--firework-color-1': '#5cdb95', // Verde água
      '--firework-color-2': '#b4bcc8', // Prata
      '--firework-color-3': '#8feba5', // Verde menta
      '--firework-speed': '0.5', // Explosões MUITO lentas
      '--firework-gravity': '0.9', // Partículas caem bem pesadas
      
      // EXCLUSIVO: Efeitos de "suspiro robótico"
      '--sigh-frequency': '15s', // A cada 15s solta um "suspiro"
      '--sigh-particle-count': '3', // Poucas partículas (minimalista)
      '--sigh-color': 'rgba(139, 148, 158, 0.3)', // Cinza transparente
      '--depression-filter': 'saturate(0.7) brightness(0.85)', // Dessaturado
      
      // EXCLUSIVO: Textos especiais
      '--idle-message': '"Life. Don\'t talk to me about life..."', // Frase idle
      '--idle-message-opacity': '0.3',
      '--idle-message-delay': '30s', // Aparece após 30s idle
    },
  },
}

/**
 * Get theme by ID
 */
export function getTheme(themeId: ThemeId): Theme {
  return THEMES[themeId]
}

/**
 * Get all theme IDs
 */
export function getAllThemeIds(): ThemeId[] {
  return Object.keys(THEMES) as ThemeId[]
}

/**
 * Check if theme ID is valid
 */
export function isValidTheme(themeId: string): themeId is ThemeId {
  return themeId in THEMES
}

