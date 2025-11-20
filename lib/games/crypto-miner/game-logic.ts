/**
 * Crypto Miner Game Logic
 * 
 * Core game mechanics for the idle clicker game
 */

// ==================== TYPES ====================

export interface MinerTier {
  id: string
  name: string
  description: string
  baseCost: number
  baseProduction: number // coins per second
  costMultiplier: number
  icon: string
}

export interface ClickUpgrade {
  id: string
  name: string
  description: string
  cost: number
  clickPowerBonus: number
  icon: string
}

export interface MultiplierUpgrade {
  id: string
  name: string
  description: string
  cost: number
  multiplier: number
  icon: string
  purchased: boolean
}

export interface GameState {
  coins: number
  coinsPerClick: number
  totalClicks: number
  lastSaveTime: number
  lastTickTime: number
  
  // Upgrades owned
  miners: Record<string, number> // miner id -> quantity owned
  clickUpgradeLevel: number // current click upgrade tier
  multipliers: string[] // purchased multiplier IDs
}

// ==================== CONFIGURATION ====================

export const MINER_TIERS: MinerTier[] = [
  {
    id: 'raspberry-pi',
    name: 'Raspberry Pi Miner',
    description: 'Hobby mining setup',
    baseCost: 10,
    baseProduction: 1,
    costMultiplier: 1.15,
    icon: '🫐'
  },
  {
    id: 'old-laptop',
    name: 'Old Laptop',
    description: 'Mining with what you have',
    baseCost: 100,
    baseProduction: 5,
    costMultiplier: 1.15,
    icon: '💻'
  },
  {
    id: 'gaming-pc',
    name: 'Gaming PC',
    description: 'Dedicated GPU mining',
    baseCost: 1000,
    baseProduction: 25,
    costMultiplier: 1.15,
    icon: '🖥️'
  },
  {
    id: 'server-rack',
    name: 'Server Rack',
    description: 'Professional operation',
    baseCost: 10000,
    baseProduction: 100,
    costMultiplier: 1.15,
    icon: '🗄️'
  },
  {
    id: 'asic-miner',
    name: 'ASIC Miner',
    description: 'Specialized hardware',
    baseCost: 100000,
    baseProduction: 500,
    costMultiplier: 1.15,
    icon: '⚙️'
  },
  {
    id: 'mining-farm',
    name: 'Mining Farm',
    description: 'Industrial scale',
    baseCost: 1000000,
    baseProduction: 2500,
    costMultiplier: 1.15,
    icon: '🏭'
  },
  {
    id: 'data-center',
    name: 'Data Center',
    description: 'Corporate infrastructure',
    baseCost: 10000000,
    baseProduction: 12500,
    costMultiplier: 1.15,
    icon: '🏢'
  },
  {
    id: 'quantum-computer',
    name: 'Quantum Computer',
    description: 'Future technology',
    baseCost: 100000000,
    baseProduction: 62500,
    costMultiplier: 1.15,
    icon: '🔬'
  },
  {
    id: 'blockchain-node',
    name: 'Blockchain Node',
    description: 'Decentralized power',
    baseCost: 1000000000,
    baseProduction: 312500,
    costMultiplier: 1.15,
    icon: '⛓️'
  },
  {
    id: 'dyson-sphere',
    name: 'Dyson Sphere',
    description: 'Ultimate energy source',
    baseCost: 10000000000,
    baseProduction: 1562500,
    costMultiplier: 1.15,
    icon: '🌞'
  }
]

export const CLICK_UPGRADES: ClickUpgrade[] = [
  {
    id: 'keyboard-1',
    name: 'Better Keyboard',
    description: 'Faster typing = faster mining',
    cost: 100,
    clickPowerBonus: 1,
    icon: '⌨️'
  },
  {
    id: 'keyboard-2',
    name: 'Mechanical Switches',
    description: 'Premium click feel',
    cost: 1000,
    clickPowerBonus: 5,
    icon: '🎹'
  },
  {
    id: 'keyboard-3',
    name: 'Macro Scripts',
    description: 'Automation assistance',
    cost: 10000,
    clickPowerBonus: 25,
    icon: '🤖'
  },
  {
    id: 'keyboard-4',
    name: 'AI Assistant',
    description: 'Smart mining optimization',
    cost: 100000,
    clickPowerBonus: 100,
    icon: '🧠'
  },
  {
    id: 'keyboard-5',
    name: 'Quantum Clicker',
    description: 'Break the speed barrier',
    cost: 1000000,
    clickPowerBonus: 500,
    icon: '⚛️'
  },
  {
    id: 'keyboard-6',
    name: 'Neural Interface',
    description: 'Direct brain-to-click connection',
    cost: 10000000,
    clickPowerBonus: 2500,
    icon: '🧬'
  },
  {
    id: 'keyboard-7',
    name: 'Time Dilation',
    description: 'Click faster than time itself',
    cost: 100000000,
    clickPowerBonus: 12500,
    icon: '⏰'
  },
  {
    id: 'keyboard-8',
    name: 'Reality Breaker',
    description: 'Clicks that transcend reality',
    cost: 1000000000,
    clickPowerBonus: 62500,
    icon: '🌀'
  },
  {
    id: 'keyboard-9',
    name: 'Infinity Clicker',
    description: 'Unlimited clicking power',
    cost: 10000000000,
    clickPowerBonus: 312500,
    icon: '♾️'
  },
  {
    id: 'keyboard-10',
    name: 'God Mode',
    description: 'Absolute clicking supremacy',
    cost: 100000000000,
    clickPowerBonus: 1562500,
    icon: '👑'
  }
]

export const MULTIPLIER_UPGRADES: MultiplierUpgrade[] = [
  {
    id: 'mult-1',
    name: 'Overclocking',
    description: '+10% all production',
    cost: 5000,
    multiplier: 1.1,
    icon: '🔥',
    purchased: false
  },
  {
    id: 'mult-2',
    name: 'Cooling System',
    description: '+25% all production',
    cost: 50000,
    multiplier: 1.25,
    icon: '❄️',
    purchased: false
  },
  {
    id: 'mult-3',
    name: 'Power Optimization',
    description: '+50% all production',
    cost: 500000,
    multiplier: 1.5,
    icon: '⚡',
    purchased: false
  },
  {
    id: 'mult-4',
    name: 'Blockchain Fork',
    description: '+100% all production',
    cost: 5000000,
    multiplier: 2.0,
    icon: '🍴',
    purchased: false
  },
  {
    id: 'mult-5',
    name: 'Parallel Processing',
    description: '+200% all production',
    cost: 50000000,
    multiplier: 3.0,
    icon: '🔀',
    purchased: false
  },
  {
    id: 'mult-6',
    name: 'Quantum Entanglement',
    description: '+400% all production',
    cost: 500000000,
    multiplier: 5.0,
    icon: '🔮',
    purchased: false
  },
  {
    id: 'mult-7',
    name: 'Dimensional Rift',
    description: '+900% all production',
    cost: 5000000000,
    multiplier: 10.0,
    icon: '🌌',
    purchased: false
  },
  {
    id: 'mult-8',
    name: 'Reality Warp',
    description: '+1900% all production',
    cost: 50000000000,
    multiplier: 20.0,
    icon: '🌀',
    purchased: false
  },
  {
    id: 'mult-9',
    name: 'Universe Expansion',
    description: '+4900% all production',
    cost: 500000000000,
    multiplier: 50.0,
    icon: '🌠',
    purchased: false
  },
  {
    id: 'mult-10',
    name: 'Omnipotence',
    description: '+9900% all production',
    cost: 5000000000000,
    multiplier: 100.0,
    icon: '👁️',
    purchased: false
  }
]

// ==================== INITIAL STATE ====================

export function createInitialState(): GameState {
  const now = Date.now()
  return {
    coins: 0,
    coinsPerClick: 1,
    totalClicks: 0,
    lastSaveTime: now,
    lastTickTime: now,
    miners: {},
    clickUpgradeLevel: 0,
    multipliers: []
  }
}

// ==================== CORE GAME LOGIC ====================

/**
 * Handle a click action - mine coins
 */
export function handleClick(state: GameState): GameState {
  return {
    ...state,
    coins: state.coins + state.coinsPerClick,
    totalClicks: state.totalClicks + 1
  }
}

/**
 * Calculate total coins per second from all miners
 */
export function calculateCoinsPerSecond(state: GameState): number {
  let totalCPS = 0
  
  // Calculate base CPS from all miners
  for (const [minerId, quantity] of Object.entries(state.miners)) {
    const minerTier = MINER_TIERS.find(m => m.id === minerId)
    if (minerTier && quantity > 0) {
      totalCPS += minerTier.baseProduction * quantity
    }
  }
  
  // Apply multipliers
  const multiplier = calculateTotalMultiplier(state)
  totalCPS *= multiplier
  
  return totalCPS
}

/**
 * Calculate total multiplier from purchased upgrades
 */
export function calculateTotalMultiplier(state: GameState): number {
  let multiplier = 1
  
  for (const multId of state.multipliers) {
    const mult = MULTIPLIER_UPGRADES.find(m => m.id === multId)
    if (mult) {
      multiplier *= mult.multiplier
    }
  }
  
  return multiplier
}

/**
 * Process a game tick - update coins based on passive income
 */
export function processTick(state: GameState, currentTime: number): GameState {
  const timeDelta = (currentTime - state.lastTickTime) / 1000 // seconds
  
  // Cap timeDelta to prevent huge gains from large time gaps (max 1 second per tick)
  const cappedTimeDelta = Math.min(timeDelta, 1.0)
  
  const coinsPerSecond = calculateCoinsPerSecond(state)
  const coinsEarned = coinsPerSecond * cappedTimeDelta
  
  return {
    ...state,
    coins: state.coins + coinsEarned,
    lastTickTime: currentTime
  }
}

/**
 * Calculate offline earnings when player returns
 */
export function calculateOfflineEarnings(
  state: GameState,
  currentTime: number
): { coins: number; timeAway: number } {
  const MAX_OFFLINE_HOURS = 48
  const timeAwayMs = currentTime - state.lastSaveTime
  const timeAwayHours = timeAwayMs / (1000 * 60 * 60)
  
  // Cap at 48 hours
  const cappedTimeMs = Math.min(timeAwayMs, MAX_OFFLINE_HOURS * 60 * 60 * 1000)
  const timeAwaySec = cappedTimeMs / 1000
  
  const coinsPerSecond = calculateCoinsPerSecond(state)
  const coinsEarned = coinsPerSecond * timeAwaySec
  
  return {
    coins: coinsEarned,
    timeAway: timeAwayMs
  }
}

// ==================== UPGRADE LOGIC ====================

/**
 * Calculate the cost of purchasing a miner
 */
export function calculateMinerCost(minerId: string, quantityOwned: number): number {
  const minerTier = MINER_TIERS.find(m => m.id === minerId)
  if (!minerTier) return Infinity
  
  return Math.floor(minerTier.baseCost * Math.pow(minerTier.costMultiplier, quantityOwned))
}

/**
 * Check if player can afford a miner
 */
export function canAffordMiner(state: GameState, minerId: string): boolean {
  const quantityOwned = state.miners[minerId] || 0
  const cost = calculateMinerCost(minerId, quantityOwned)
  return state.coins >= cost
}

/**
 * Purchase a miner upgrade
 */
export function purchaseMiner(state: GameState, minerId: string): GameState {
  const quantityOwned = state.miners[minerId] || 0
  const cost = calculateMinerCost(minerId, quantityOwned)
  
  if (state.coins < cost) {
    return state // Can't afford
  }
  
  return {
    ...state,
    coins: state.coins - cost,
    miners: {
      ...state.miners,
      [minerId]: quantityOwned + 1
    }
  }
}

/**
 * Check if player can afford a click upgrade
 */
export function canAffordClickUpgrade(state: GameState): boolean {
  const nextUpgrade = CLICK_UPGRADES[state.clickUpgradeLevel]
  if (!nextUpgrade) return false
  return state.coins >= nextUpgrade.cost
}

/**
 * Purchase a click power upgrade
 */
export function purchaseClickUpgrade(state: GameState): GameState {
  const nextUpgrade = CLICK_UPGRADES[state.clickUpgradeLevel]
  if (!nextUpgrade || state.coins < nextUpgrade.cost) {
    return state // Can't afford or max level
  }
  
  return {
    ...state,
    coins: state.coins - nextUpgrade.cost,
    coinsPerClick: state.coinsPerClick + nextUpgrade.clickPowerBonus,
    clickUpgradeLevel: state.clickUpgradeLevel + 1
  }
}

/**
 * Check if player can afford a multiplier upgrade
 */
export function canAffordMultiplier(state: GameState, multId: string): boolean {
  // Check if already purchased
  if (state.multipliers.includes(multId)) {
    return false
  }
  
  const mult = MULTIPLIER_UPGRADES.find(m => m.id === multId)
  if (!mult) return false
  
  return state.coins >= mult.cost
}

/**
 * Purchase a multiplier upgrade
 */
export function purchaseMultiplier(state: GameState, multId: string): GameState {
  // Check if already purchased
  if (state.multipliers.includes(multId)) {
    return state
  }
  
  const mult = MULTIPLIER_UPGRADES.find(m => m.id === multId)
  if (!mult || state.coins < mult.cost) {
    return state // Can't afford
  }
  
  return {
    ...state,
    coins: state.coins - mult.cost,
    multipliers: [...state.multipliers, multId]
  }
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format large numbers with suffixes (K, M, B, T, etc.)
 */
export function formatNumber(num: number): string {
  if (num < 1000) {
    return Math.floor(num).toString()
  }
  
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc']
  const tier = Math.floor(Math.log10(Math.abs(num)) / 3)
  
  if (tier <= 0) {
    return Math.floor(num).toString()
  }
  
  const suffix = suffixes[tier] || 'e' + (tier * 3)
  const scale = Math.pow(10, tier * 3)
  const scaled = num / scale
  
  // Show 2 decimal places for numbers >= 1000
  return scaled.toFixed(2) + suffix
}

/**
 * Format time duration (milliseconds to human readable)
 */
export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    const remainingHours = hours % 24
    return `${days}d ${remainingHours}h`
  }
  
  if (hours > 0) {
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }
  
  if (minutes > 0) {
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }
  
  return `${seconds}s`
}

/**
 * Get the next available click upgrade
 */
export function getNextClickUpgrade(state: GameState): ClickUpgrade | null {
  return CLICK_UPGRADES[state.clickUpgradeLevel] || null
}

/**
 * Get all available multiplier upgrades (not yet purchased)
 */
export function getAvailableMultipliers(state: GameState): MultiplierUpgrade[] {
  return MULTIPLIER_UPGRADES.filter(m => !state.multipliers.includes(m.id))
}

/**
 * Get all purchased multipliers
 */
export function getPurchasedMultipliers(state: GameState): MultiplierUpgrade[] {
  return MULTIPLIER_UPGRADES.filter(m => state.multipliers.includes(m.id))
}

