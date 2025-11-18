/**
 * Games configuration for Compile & Chill
 * 
 * Defines all available games with their metadata.
 * This file serves as the single source of truth for game information.
 */

export interface Game {
  id: string
  name: string
  description: string
  route: string
  icon: string
  category?: string
}

export const GAMES: Game[] = [
  {
    id: 'terminal-2048',
    name: 'Terminal 2048',
    description: 'Puzzle game com tiles temáticos de desenvolvimento. Combine arquivos, pastas e extensões para alcançar 2048!',
    route: '/jogos/terminal-2048',
    icon: '🎮',
    category: 'puzzle',
  },
  {
    id: 'dev-fifteen-hex',
    name: 'Dev Fifteen HEX',
    description: 'Puzzle clássico com endereços de memória em hexadecimal. Organize os blocos 0x01 a 0x0F para defragmentar a memória!',
    route: '/jogos/dev-fifteen-hex',
    icon: '🧩',
    category: 'puzzle',
  },
  {
    id: 'byte-match',
    name: 'Byte Match',
    description: 'Jogo de memória com pares temáticos: ícones Git, pastas /src, scripts de café e mais!',
    route: '/jogos/byte-match',
    icon: '🧠',
    category: 'memory',
  },
  {
    id: 'dev-pong',
    name: 'Dev Pong',
    description: 'Pong minimalista com estética futurista. Controles responsivos e integração com temas.',
    route: '/jogos/dev-pong',
    icon: '🏓',
    category: 'arcade',
  },
  {
    id: 'bit-runner',
    name: 'Bit Runner',
    description: 'Runner infinito com personagem pixelado. Evite obstáculos temáticos: compiladores, bugs e brackets!',
    route: '/jogos/bit-runner',
    icon: '🏃',
    category: 'runner',
  },
  {
    id: 'stack-overflow-dodge',
    name: 'Stack Overflow Dodge',
    description: 'Desvie dos "erros" caindo! Colete power-ups como "resolveu!" e "copiou do stackoverflow".',
    route: '/jogos/stack-overflow-dodge',
    icon: '💥',
    category: 'arcade',
  },
  {
    id: 'hack-grid',
    name: 'Hack Grid',
    description: 'Quebra-cabeça lógico conectando nós de rede iluminando caminhos. Animações neon e integração com temas.',
    route: '/jogos/hack-grid',
    icon: '🔌',
    category: 'puzzle',
  },
  {
    id: 'debug-maze',
    name: 'Debug Maze',
    description: 'Labirinto onde você guia um "bug" até o patch. Tema retro pixel, rastreamento de pontuação.',
    route: '/jogos/debug-maze',
    icon: '🐛',
    category: 'puzzle',
  },
  {
    id: 'refactor-rush',
    name: 'Refactor Rush',
    description: 'Puzzle reorganizando "blocos de código" para limpar arquivos. Efeitos de partículas nos movimentos.',
    route: '/jogos/refactor-rush',
    icon: '♻️',
    category: 'puzzle',
  },
  {
    id: 'crypto-miner-game',
    name: 'Crypto Miner Game',
    description: 'Idle clicker onde você minera blocos. Escalonamento simples, gamificação leve e UI temática.',
    route: '/jogos/crypto-miner-game',
    icon: '⛏️',
    category: 'idle',
  },
  {
    id: 'packet-switch',
    name: 'Packet Switch',
    description: 'Jogo de lógica de roteamento direcionando pacotes. Animações de partículas de rede e integração com temas.',
    route: '/jogos/packet-switch',
    icon: '📡',
    category: 'puzzle',
  },
]

/**
 * Get game by ID
 */
export function getGame(id: string): Game | undefined {
  return GAMES.find(game => game.id === id)
}

/**
 * Get all games
 */
export function getAllGames(): Game[] {
  return GAMES
}

/**
 * Get games by category
 */
export function getGamesByCategory(category: string): Game[] {
  return GAMES.filter(game => game.category === category)
}

/**
 * Get all available categories
 */
export function getCategories(): string[] {
  const categories = new Set(GAMES.map(game => game.category).filter(Boolean))
  return Array.from(categories) as string[]
}

