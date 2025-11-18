/**
 * Log Generator
 * 
 * Gera logs fake procedurais para o Hacker Panel.
 * Template-based message creation with random placeholder replacement.
 */

export type LogType = 'info' | 'warn' | 'error' | 'debug' | 'status' | 'game'

interface FakeLog {
  type: LogType
  message: string
}

const LOG_TEMPLATES: FakeLog[] = [
  {
    type: 'info',
    message: '[INFO] Bug localizado no setor {sector}',
  },
  {
    type: 'warn',
    message: '[WARN] Commit suspeito detectado',
  },
  {
    type: 'debug',
    message: '[DEBUG] Packet 0x{hex} retransmitido',
  },
  {
    type: 'info',
    message: '[INFO] Memory leak em {module}',
  },
  {
    type: 'warn',
    message: '[WARN] Connection timeout: {ip}',
  },
  {
    type: 'debug',
    message: '[DEBUG] Cache invalidation required',
  },
  {
    type: 'info',
    message: '[INFO] Database query optimization needed',
  },
  {
    type: 'warn',
    message: '[WARN] Rate limit approaching threshold',
  },
  {
    type: 'debug',
    message: '[DEBUG] WebSocket reconnection attempt {n}',
  },
  {
    type: 'info',
    message: '[INFO] CDN cache hit rate: {percent}%',
  },
  {
    type: 'info',
    message: '[INFO] Compilation successful: {module}',
  },
  {
    type: 'warn',
    message: '[WARN] High CPU usage detected: {percent}%',
  },
  {
    type: 'debug',
    message: '[DEBUG] API endpoint response time: {n}ms',
  },
  {
    type: 'info',
    message: '[INFO] New dependency installed: {module}',
  },
  {
    type: 'error',
    message: '[ERROR] Failed to connect to database',
  },
  {
    type: 'info',
    message: '[INFO] Background job completed: {module}',
  },
  {
    type: 'warn',
    message: '[WARN] Disk space usage: {percent}%',
  },
  {
    type: 'debug',
    message: '[DEBUG] Session token expired: {ip}',
  },
  {
    type: 'info',
    message: '[INFO] Code review requested: {module}',
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
  'storage',
  'queue',
  'worker',
  'scheduler',
]

/**
 * Gera IP de exemplo/documentação (inválido para uso real)
 * Usa ranges reservados para documentação: 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24
 */
function generateIP(): string {
  const testNetworks = [
    { base: '192.0.2', max: 255 }, // TEST-NET-1
    { base: '198.51.100', max: 255 }, // TEST-NET-2
    { base: '203.0.113', max: 255 }, // TEST-NET-3
  ]
  
  const network = testNetworks[Math.floor(Math.random() * testNetworks.length)]
  const lastOctet = Math.floor(Math.random() * network.max)
  
  return `${network.base}.${lastOctet}`
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
 * Gera log fake procedural
 */
export function generateFakeLog(): FakeLog {
  const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)]
  let message = template.message

  // Substituir placeholders
  message = message.replace(/{sector}/g, String(SECTORS[Math.floor(Math.random() * SECTORS.length)]))
  message = message.replace(/{module}/g, MODULES[Math.floor(Math.random() * MODULES.length)])
  message = message.replace(/{ip}/g, generateIP())
  message = message.replace(/{hex}/g, generateHex())
  message = message.replace(/{n}/g, String(Math.floor(Math.random() * 5) + 1))
  message = message.replace(/{percent}/g, String(Math.floor(Math.random() * 100)))

  return {
    type: template.type,
    message,
  }
}

