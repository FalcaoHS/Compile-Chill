/**
 * Theme configuration for Compile & Chill
 * 
 * Defines 9 unique visual themes with comprehensive design tokens.
 * Each theme includes colors, typography, and effect variables.
 */

export type ThemeId = 'analista-jr' | 'analista-sr' | 'lofi-code' | 'cyber' | 'pixel' | 'neon' | 'terminal' | 'blueprint' | 'bruno-csharp'

export interface Theme {
  name: string
  vars: Record<string, string>
}

export const THEMES: Record<ThemeId, Theme> = {
  'analista-jr': {
    name: 'Analista Jr.',
    vars: {
      // Colors - Tentando ser profissional mas não consegue
      '--color-bg': '#1a1a1a', // Preto "programador raiz"
      '--color-bg-secondary': '#2d2d2d',
      '--color-primary': '#ff6b6b', // Vermelho urgente (tudo é urgente)
      '--color-primary-hover': '#ff5252',
      '--color-accent': '#4ecdc4', // Verde água do tutorial
      '--color-accent-hover': '#45b7aa',
      '--color-muted': '#95a5a6',
      '--color-text': '#ffffff', // Branco puro (sem contrast ratio)
      '--color-text-secondary': '#ecf0f1',
      '--color-glow': 'rgba(78, 205, 196, 0.7)', // Glow excessivo
      '--color-border': 'rgba(255, 107, 107, 0.4)',
      '--color-error': '#ff0000', // RGB puro
      
      // Typography - Pegou do primeiro tutorial
      '--font': "'Roboto', 'Arial', sans-serif",
      '--font-size-base': '17px', // Meio estranho mas "ficou legal"
      
      // Effects - Tudo meio exagerado
      '--glow-sm': '0 0 12px rgba(78, 205, 196, 0.6)',
      '--glow-md': '0 0 20px rgba(78, 205, 196, 0.7)',
      '--glow-lg': '0 0 30px rgba(255, 107, 107, 0.8)',
      '--glow-xl': '0 0 45px rgba(78, 205, 196, 0.9)',
      '--glow-intensity': '1.8', // Muito glow
      '--anim-duration': '150ms', // Rápido demais
      '--anim-easing': 'ease-in-out',
      '--border-radius': '12px', // Tudo bem arredondado
      '--scanline-opacity': '0.08',
      '--noise-opacity': '0.05',
      
      // Canvas/Game
      '--orb-fill': '#ff6b6b',
      '--orb-stroke': '#4ecdc4',
      '--orb-glow': 'rgba(78, 205, 196, 0.6)',
      '--basket-fill': '#2d2d2d',
      '--basket-stroke': '#4ecdc4',
      '--particle-color-1': '#ff6b6b',
      '--particle-color-2': '#4ecdc4',
      '--particle-color-3': '#f9ca24',
    },
  },
  'lofi-code': {
    name: 'Lofi Code',
    vars: {
      // Colors - Tons pastel suaves estilo lofi hip hop (warm & cozy)
      '--color-bg': '#2b3a4a', // Azul acinzentado (janela ao entardecer)
      '--color-bg-secondary': '#34495e', // Azul ardósia
      '--color-primary': '#f39c6b', // Laranja pastel (sol poente)
      '--color-primary-hover': '#f5b78a',
      '--color-accent': '#e8a87c', // Pêssego suave
      '--color-accent-hover': '#f0b890',
      '--color-muted': '#7f8c9f', // Cinza azulado suave
      '--color-text': '#e8dfd4', // Bege claro (papel envelhecido)
      '--color-text-secondary': '#b8a896',
      '--color-glow': 'rgba(243, 156, 107, 0.25)', // Glow laranja MUITO sutil
      '--color-border': 'rgba(200, 184, 157, 0.3)',
      '--color-error': '#d98670', // Coral suave
      
      // Typography - Arredondada e confortável
      '--font': "'DM Sans', 'Inter', 'Segoe UI', sans-serif",
      '--font-size-base': '16px',
      
      // Effects - TUDO suave e slow (relaxante)
      '--glow-sm': '0 2px 4px rgba(243, 156, 107, 0.15)',
      '--glow-md': '0 4px 8px rgba(243, 156, 107, 0.2)',
      '--glow-lg': '0 6px 12px rgba(243, 156, 107, 0.25)',
      '--glow-xl': '0 10px 20px rgba(243, 156, 107, 0.3)',
      '--glow-intensity': '0.2', // Muito baixo (relaxante)
      '--anim-duration': '800ms', // Slow motion suave
      '--anim-easing': 'cubic-bezier(0.4, 0, 0.2, 1)',
      '--border-radius': '6px', // Cantos suaves
      '--scanline-opacity': '0.015', // Quase imperceptível
      '--noise-opacity': '0.025', // Textura de vinil sutil
      
      // Canvas/Game - Cores quentes e acolhedoras
      '--orb-fill': '#f39c6b',
      '--orb-stroke': '#e8a87c',
      '--orb-glow': 'rgba(243, 156, 107, 0.3)',
      '--basket-fill': '#34495e',
      '--basket-stroke': '#f39c6b',
      '--particle-color-1': '#f39c6b',
      '--particle-color-2': '#e8a87c',
      '--particle-color-3': '#c8b89d',
      '--firework-color-1': '#f39c6b',
      '--firework-color-2': '#e8a87c',
      '--firework-color-3': '#f5b78a',
      
      // EXCLUSIVO: Efeitos lofi
      '--lofi-warmth': '1.05', // Filtro de calor
      '--lofi-grain': '0.03', // Grão de filme
      '--lofi-vignette': '0.2', // Vinheta sutil
      '--paper-lines-opacity': '0.08', // Linhas de caderno
    },
  },
  cyber: {
    name: 'Cyber Hacker',
    vars: {
      // Colors - Ciano néon vibrante (hacker clássico)
      '--color-bg': '#050a0f', // Preto azulado profundo
      '--color-bg-secondary': '#0a1520', // Azul marinho escuro
      '--color-primary': '#00ffff', // Ciano elétrico puro
      '--color-primary-hover': '#33ffff',
      '--color-accent': '#00d4ff', // Azul ciano brilhante
      '--color-accent-hover': '#00e5ff',
      '--color-muted': '#5a8a9f',
      '--color-text': '#e0f7ff', // Texto ciano claro
      '--color-text-secondary': '#a0d5e8',
      '--color-glow': 'rgba(0, 255, 255, 0.5)', // Glow ciano forte
      '--color-border': 'rgba(0, 255, 255, 0.25)',
      
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
      // Colors - Rosa/Roxo néon futurista (totalmente diferente!)
      '--color-bg': '#0d0221', // Roxo quase preto
      '--color-bg-secondary': '#190339', // Roxo escuro profundo
      '--color-primary': '#ff006e', // Rosa néon choque
      '--color-primary-hover': '#ff1a7f',
      '--color-accent': '#fb5607', // Laranja néon vibrante  
      '--color-accent-hover': '#ff6b1a',
      '--color-muted': '#8338ec', // Roxo médio
      '--color-text': '#ffffff',
      '--color-text-secondary': '#e0b3ff',
      '--color-glow': 'rgba(255, 0, 110, 0.6)', // Glow rosa forte
      '--color-border': 'rgba(255, 0, 110, 0.3)',
      
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
      // Colors - Verde Matrix / Terminal clássico
      '--color-bg': '#0c0c0c', // Preto terminal
      '--color-bg-secondary': '#1a1a1a', // Cinza terminal
      '--color-primary': '#00ff00', // Verde Matrix puro
      '--color-primary-hover': '#33ff33',
      '--color-accent': '#00cc00', // Verde terminal escuro
      '--color-accent-hover': '#00dd00',
      '--color-muted': '#505050',
      '--color-text': '#ccffcc', // Texto verde claro
      '--color-text-secondary': '#88cc88',
      '--color-glow': 'rgba(0, 255, 0, 0.3)', // Glow verde
      '--color-border': 'rgba(0, 255, 0, 0.2)',
      
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
  'analista-sr': {
    name: 'Analista Sr.',
    vars: {
      // Colors - Paleta corporativa profissional (sem néon, muito sóbrio)
      '--color-bg': '#f5f7fa', // Cinza claro corporativo (LIGHT MODE!)
      '--color-bg-secondary': '#e8ecf1', // Cinza gelo
      '--color-primary': '#2c3e50', // Azul petróleo escuro (sério)
      '--color-primary-hover': '#34495e',
      '--color-accent': '#3498db', // Azul corporate limpo
      '--color-accent-hover': '#2980b9',
      '--color-secondary': '#7f8c8d', // Cinza neutro
      '--color-highlight': '#16a085', // Verde corporativo discreto
      '--color-muted': '#95a5a6', // Cinza médio
      '--color-text': '#2c3e50', // Texto escuro (inversão!)
      '--color-text-secondary': '#7f8c8d', // Texto cinza
      '--color-glow': 'rgba(52, 152, 219, 0.15)', // Glow MUITO sutil
      '--color-border': 'rgba(127, 140, 141, 0.3)',
      '--color-error': '#e74c3c', // Vermelho corporativo
      
      // Typography - Sans-serif profissional
      '--font': "'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif",
      '--font-size-base': '16px',
      '--font-weight-normal': '400',
      '--line-height': '1.6',
      
      // Effects - MINIMALISTAS (sem exageros)
      '--glow-sm': '0 1px 3px rgba(0, 0, 0, 0.08)', // Sombra sutil
      '--glow-md': '0 2px 6px rgba(0, 0, 0, 0.1)',
      '--glow-lg': '0 4px 12px rgba(0, 0, 0, 0.12)',
      '--glow-xl': '0 8px 24px rgba(0, 0, 0, 0.15)',
      '--glow-intensity': '0.1', // Quase imperceptível
      '--anim-duration': '200ms', // Rápido e eficiente
      '--anim-easing': 'cubic-bezier(0.4, 0, 0.2, 1)',
      '--border-radius': '8px', // Bordas arredondadas profissionais
      '--pulse-speed': '0ms', // SEM pulse (muito profissional)
      '--drift-speed': '0ms', // SEM drift
      '--scanline-opacity': '0', // SEM scanlines
      '--noise-opacity': '0', // SEM noise
      '--blur-intensity': '0px', // SEM blur
      '--cursor-blink': 'none', // SEM blink
      '--minimal-opacity': '1', // Totalmente opaco
      
      // Efeitos corporativos
      '--paper-texture': '0.02', // Leve textura de papel
      '--card-elevation': '0 2px 8px rgba(0, 0, 0, 0.08)', // Elevação tipo Material
      '--divider-opacity': '0.12', // Divisores sutis
      '--table-stripe': 'rgba(127, 140, 141, 0.04)', // Linhas de tabela
      
      // Canvas/Game specific - Cores corporativas
      '--orb-fill': '#3498db', // Azul corporativo
      '--orb-stroke': '#2c3e50', // Azul petróleo
      '--orb-glow': 'rgba(52, 152, 219, 0.2)',
      '--orb-trail-opacity': '0.1',
      '--orb-gravity': '1.0', // Normal
      '--basket-fill': '#ecf0f1', // Cinza claro
      '--basket-stroke': '#2c3e50',
      '--basket-stroke-width': '2px',
      '--particle-color-1': '#3498db',
      '--particle-color-2': '#2c3e50',
      '--particle-color-3': '#16a085',
      '--particle-lifetime': '1200ms', // Rápido
      '--particle-fade-delay': '200ms',
      '--firework-color-1': '#3498db',
      '--firework-color-2': '#2c3e50',
      '--firework-color-3': '#16a085',
      '--firework-speed': '1.2', // Rápido
      '--firework-gravity': '1.0',
      
      // EXCLUSIVO: Tema profissional
      '--professional-mode': 'true', // Flag para componentes
      '--serif-accent': "'Merriweather', 'Georgia', serif", // Para títulos
      '--system-font': 'system-ui', // Fallback system
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

