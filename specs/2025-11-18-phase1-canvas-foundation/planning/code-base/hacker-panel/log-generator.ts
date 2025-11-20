/**
 * Log Generator
 * 
 * Gera logs fake procedurais para o Hacker Panel.
 */

import { LogType } from '../interfaces'

interface FakeLog {
  type: LogType
  message: string
}

const LOG_TEMPLATES: FakeLog[] = [
  {
    type: 'info',
    message: 'Bug localizado no setor {sector}',
  },
  {
    type: 'warn',
    message: 'Commit suspeito detectado',
  },
  {
    type: 'debug',
    message: 'Packet 0x{hex} retransmitido',
  },
  {
    type: 'info',
    message: 'Memory leak em {module}',
  },
  {
    type: 'warn',
    message: 'Connection timeout: {ip}',
  },
  {
    type: 'debug',
    message: 'Cache invalidation required',
  },
  {
    type: 'info',
    message: 'Database query optimization needed',
  },
  {
    type: 'warn',
    message: 'Rate limit approaching threshold',
  },
  {
    type: 'debug',
    message: 'WebSocket reconnection attempt {n}',
  },
  {
    type: 'info',
    message: 'CDN cache hit rate: {percent}%',
  },
]

const SECTORS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const MODULES = [
  'auth',
  'api',
  'database',
  'cache',
  'websocket',
  'analytics',
  'payment',
  'notification',
]

/**
 * Gera IP aleatório
 */
function generateIP(): string {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
}

/**
 * Gera hex aleatório
 */
function generateHex(): string {
  return Math.floor(Math.random() * 0xffff)
    .toString(16)
    .toUpperCase()
    .padStart(4, '0')
}

/**
 * Gera log fake
 */
export function generateFakeLog(): FakeLog {
  const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)]
  let message = template.message

  // Substituir placeholders
  message = message.replace('{sector}', String(SECTORS[Math.floor(Math.random() * SECTORS.length)]))
  message = message.replace('{module}', MODULES[Math.floor(Math.random() * MODULES.length)])
  message = message.replace('{ip}', generateIP())
  message = message.replace('{hex}', generateHex())
  message = message.replace('{n}', String(Math.floor(Math.random() * 5) + 1))
  message = message.replace('{percent}', String(Math.floor(Math.random() * 100)))

  return {
    type: template.type,
    message: `[${template.type.toUpperCase()}] ${message}`,
  }
}

