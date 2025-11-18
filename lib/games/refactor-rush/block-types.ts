/**
 * Block type definitions for Refactor Rush
 * 
 * Defines the 6 block types representing real code elements
 */

export type BlockType = 'import' | 'const' | 'function' | 'class' | 'comment' | 'return'

export interface BlockTypeDefinition {
  id: BlockType
  label: string
  icon: string
  defaultColor: string
  textContent: string
}

/**
 * Block type definitions
 */
export const BLOCK_TYPES: Record<BlockType, BlockTypeDefinition> = {
  import: {
    id: 'import',
    label: 'Import',
    icon: '📦',
    defaultColor: 'blue',
    textContent: 'import {...}',
  },
  const: {
    id: 'const',
    label: 'Constant',
    icon: '🔒',
    defaultColor: 'purple',
    textContent: 'const variable',
  },
  function: {
    id: 'function',
    label: 'Function',
    icon: '⚙️',
    defaultColor: 'green',
    textContent: 'function method()',
  },
  class: {
    id: 'class',
    label: 'Class',
    icon: '🏗️',
    defaultColor: 'orange',
    textContent: 'class Something {}',
  },
  comment: {
    id: 'comment',
    label: 'Comment',
    icon: '💬',
    defaultColor: 'gray',
    textContent: '// comments',
  },
  return: {
    id: 'return',
    label: 'Return',
    icon: '↩️',
    defaultColor: 'red',
    textContent: 'return …',
  },
}

/**
 * Get block type definition
 */
export function getBlockType(type: BlockType): BlockTypeDefinition {
  return BLOCK_TYPES[type]
}

/**
 * Get block label
 */
export function getBlockLabel(type: BlockType): string {
  return BLOCK_TYPES[type].label
}

/**
 * Get block icon
 */
export function getBlockIcon(type: BlockType): string {
  return BLOCK_TYPES[type].icon
}

/**
 * Get block text content
 */
export function getBlockTextContent(type: BlockType): string {
  return BLOCK_TYPES[type].textContent
}

/**
 * Get theme-aware styling classes for block
 */
export function getBlockStylingClasses(type: BlockType, theme: string = 'default'): string {
  const baseClasses = 'flex items-center justify-center rounded-lg border-2 font-mono text-sm font-semibold transition-all'
  
  // Theme-aware color classes
  const themeColors: Record<string, Record<BlockType, string>> = {
    'cyber-hacker': {
      import: 'bg-green-900/20 border-green-500 text-green-400',
      const: 'bg-purple-900/20 border-purple-500 text-purple-400',
      function: 'bg-cyan-900/20 border-cyan-500 text-cyan-400',
      class: 'bg-orange-900/20 border-orange-500 text-orange-400',
      comment: 'bg-gray-800/20 border-gray-600 text-gray-400',
      return: 'bg-red-900/20 border-red-500 text-red-400',
    },
    'pixel-lab': {
      import: 'bg-blue-800/30 border-blue-600 text-blue-300',
      const: 'bg-purple-800/30 border-purple-600 text-purple-300',
      function: 'bg-green-800/30 border-green-600 text-green-300',
      class: 'bg-yellow-800/30 border-yellow-600 text-yellow-300',
      comment: 'bg-gray-700/30 border-gray-500 text-gray-300',
      return: 'bg-red-800/30 border-red-600 text-red-300',
    },
    'neon-future': {
      import: 'bg-blue-500/10 border-blue-400 text-blue-300 shadow-blue-400/50',
      const: 'bg-purple-500/10 border-purple-400 text-purple-300 shadow-purple-400/50',
      function: 'bg-green-500/10 border-green-400 text-green-300 shadow-green-400/50',
      class: 'bg-pink-500/10 border-pink-400 text-pink-300 shadow-pink-400/50',
      comment: 'bg-gray-500/10 border-gray-400 text-gray-300 shadow-gray-400/50',
      return: 'bg-red-500/10 border-red-400 text-red-300 shadow-red-400/50',
    },
    'terminal-minimal': {
      import: 'bg-slate-800 border-slate-600 text-slate-300',
      const: 'bg-slate-800 border-slate-600 text-slate-300',
      function: 'bg-slate-800 border-slate-600 text-slate-300',
      class: 'bg-slate-800 border-slate-600 text-slate-300',
      comment: 'bg-slate-800 border-slate-600 text-slate-400',
      return: 'bg-slate-800 border-slate-600 text-slate-300',
    },
    'blueprint-dev': {
      import: 'bg-blue-50 border-blue-300 text-blue-700',
      const: 'bg-purple-50 border-purple-300 text-purple-700',
      function: 'bg-green-50 border-green-300 text-green-700',
      class: 'bg-orange-50 border-orange-300 text-orange-700',
      comment: 'bg-gray-50 border-gray-300 text-gray-600',
      return: 'bg-red-50 border-red-300 text-red-700',
    },
    default: {
      import: 'bg-blue-100 border-blue-300 text-blue-700',
      const: 'bg-purple-100 border-purple-300 text-purple-700',
      function: 'bg-green-100 border-green-300 text-green-700',
      class: 'bg-orange-100 border-orange-300 text-orange-700',
      comment: 'bg-gray-100 border-gray-300 text-gray-600',
      return: 'bg-red-100 border-red-300 text-red-700',
    },
  }

  const themeMap = themeColors[theme] || themeColors.default
  const colorClasses = themeMap[type] || themeMap.import

  return `${baseClasses} ${colorClasses}`
}

/**
 * Check if block type is valid
 */
export function isValidBlockType(type: string): type is BlockType {
  return type in BLOCK_TYPES
}

/**
 * Get all block types
 */
export function getAllBlockTypes(): BlockType[] {
  return Object.keys(BLOCK_TYPES) as BlockType[]
}

