/**
 * Validate new scoring formulas
 * 
 * This script tests the new proposed formulas against current data
 * to verify they produce balanced, fair results.
 */

import * as fs from 'fs'
import * as path from 'path'

// Load exported data
const dataPath = path.join(__dirname, '..', 'agent-os', 'specs', '2025-11-19-fair-scoring-system-analysis', 'planning', 'score-data-export.json')
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

// ==================== NEW SCORING FORMULAS ====================

function calculateHackGridNewScore(metadata: any, duration: number, level: number): number {
  const segments = metadata?.segments || 0
  const difficulty = 1 // Level 1 difficulty
  
  // Base score scales with level and difficulty
  const baseScore = 100 * difficulty
  
  // Time bonus (0-200% of base, capped)
  const maxTime = 300 // seconds (5 minutes)
  const durationSeconds = duration / 1000
  const timeRatio = Math.min(1, Math.max(0, (maxTime - durationSeconds) / maxTime))
  const timeBonus = baseScore * 2 * timeRatio
  
  // For efficiency, we need to know requiredSegments
  // Level 1 has ~6 required segments based on data
  const requiredSegments = 6
  const efficiencyRatio = segments > 0 ? Math.min(1, requiredSegments / segments) : 1
  const efficiencyBonus = baseScore * 0.5 * efficiencyRatio
  
  // Total score
  return Math.floor(baseScore + timeBonus + efficiencyBonus)
}

function calculateDebugMazeNewScore(metadata: any, duration: number, moves: number): number {
  // Base score for completion
  const baseScore = 200
  
  // Time bonus (0-200% of base)
  const maxTime = 300 // seconds
  const durationSeconds = duration / 1000
  const timeRatio = Math.min(1, Math.max(0, (maxTime - durationSeconds) / maxTime))
  const timeBonus = baseScore * 2 * timeRatio
  
  // Move efficiency bonus (0-100% of base)
  // Level 1 optimal is ~8 moves (Manhattan distance)
  const optimalMoves = 8
  const moveEfficiency = Math.max(0, Math.min(1, optimalMoves / moves))
  const moveBonus = baseScore * moveEfficiency
  
  // Total score
  return Math.floor(baseScore + timeBonus + moveBonus)
}

function calculatePacketSwitchNewScore(metadata: any, duration: number): number {
  const packetsDelivered = metadata?.packetsDelivered || 1
  const averageHops = metadata?.averageHops || 2
  const difficulty = 1 // Level 1
  
  // Base score per packet delivered
  const baseScorePerPacket = 50
  
  // Difficulty multiplier
  const difficultyMultiplier = difficulty
  
  // Efficiency bonus (fewer hops = better)
  const minPossibleHops = 1 // theoretical minimum
  const hopEfficiency = Math.max(0.5, minPossibleHops / averageHops)
  
  // Time bonus (faster is better, but minor component)
  const maxTime = 120 // seconds
  const durationSeconds = duration / 1000
  const timeRatio = Math.max(0, Math.min(1, (maxTime - durationSeconds) / maxTime))
  const timeBonus = 100 * timeRatio
  
  // Total score
  return Math.floor(
    (baseScorePerPacket * packetsDelivered * difficultyMultiplier * hopEfficiency) + timeBonus
  )
}

function calculateStackOverflowDodgeNewScore(metadata: any, duration: number): number {
  const powerUpsCollected = metadata?.powerUpsCollected || 0
  const errorsAvoided = metadata?.errorsAvoided || 0
  
  // Increase scoring rate
  const SCORE_PER_SECOND = 30 // increased from 12
  const POWER_UP_BONUS = 50
  const ERROR_BONUS = 5
  
  const durationSeconds = duration / 1000
  
  return Math.floor(
    durationSeconds * SCORE_PER_SECOND + 
    powerUpsCollected * POWER_UP_BONUS +
    errorsAvoided * ERROR_BONUS
  )
}

// ==================== VALIDATION ====================

console.log('🧪 Validating New Scoring Formulas\n')
console.log('='.repeat(100))

interface ComparisonResult {
  gameId: string
  userId: number
  userName: string
  oldScore: number
  newScore: number
  change: number
  changePercent: number
}

const results: ComparisonResult[] = []

// Process each score
for (const score of data.rawScores) {
  let newScore = score.score // default to unchanged
  
  // Calculate new score based on game
  switch (score.gameId) {
    case 'hack-grid':
      newScore = calculateHackGridNewScore(score.metadata, score.duration, score.level)
      break
    case 'debug-maze':
      newScore = calculateDebugMazeNewScore(score.metadata, score.duration, score.moves)
      break
    case 'packet-switch':
      newScore = calculatePacketSwitchNewScore(score.metadata, score.duration)
      break
    case 'stack-overflow-dodge':
      newScore = calculateStackOverflowDodgeNewScore(score.metadata, score.duration)
      break
    // Other games unchanged
    default:
      newScore = score.score
  }
  
  const change = newScore - score.score
  const changePercent = score.score !== 0 ? (change / score.score) * 100 : 0
  
  results.push({
    gameId: score.gameId,
    userId: score.userId,
    userName: score.userName,
    oldScore: score.score,
    newScore,
    change,
    changePercent,
  })
}

// Sort by new score descending
results.sort((a, b) => b.newScore - a.newScore)

// Print top 15
console.log('\n📊 NEW GLOBAL LEADERBOARD (Top 15)\n')
console.log('Rank | User | Game | Old Score | New Score | Change')
console.log('-'.repeat(100))

results.slice(0, 15).forEach((result, index) => {
  const changeStr = result.change >= 0 ? `+${result.change}` : `${result.change}`
  const changeIcon = Math.abs(result.changePercent) < 5 ? '✅' : 
                     result.change < 0 ? '⬇️' : '⬆️'
  console.log(
    `${(index + 1).toString().padStart(2)} | ` +
    `${result.userName.substring(0, 20).padEnd(20)} | ` +
    `${result.gameId.padEnd(20)} | ` +
    `${result.oldScore.toString().padStart(8)} | ` +
    `${result.newScore.toString().padStart(8)} | ` +
    `${changeStr.padStart(10)} ${changeIcon}`
  )
})

// Calculate statistics
console.log('\n' + '='.repeat(100))
console.log('\n📈 SCORE DISTRIBUTION ANALYSIS\n')

interface GameStats {
  gameId: string
  count: number
  oldMin: number
  oldMax: number
  oldMean: number
  newMin: number
  newMax: number
  newMean: number
  changed: boolean
}

const gameStats: Record<string, GameStats> = {}

for (const result of results) {
  if (!gameStats[result.gameId]) {
    gameStats[result.gameId] = {
      gameId: result.gameId,
      count: 0,
      oldMin: Infinity,
      oldMax: -Infinity,
      oldMean: 0,
      newMin: Infinity,
      newMax: -Infinity,
      newMean: 0,
      changed: false,
    }
  }
  
  const stats = gameStats[result.gameId]
  stats.count++
  stats.oldMin = Math.min(stats.oldMin, result.oldScore)
  stats.oldMax = Math.max(stats.oldMax, result.oldScore)
  stats.oldMean += result.oldScore
  stats.newMin = Math.min(stats.newMin, result.newScore)
  stats.newMax = Math.max(stats.newMax, result.newScore)
  stats.newMean += result.newScore
  
  if (result.change !== 0) {
    stats.changed = true
  }
}

// Calculate means
for (const gameId in gameStats) {
  const stats = gameStats[gameId]
  stats.oldMean = stats.oldMean / stats.count
  stats.newMean = stats.newMean / stats.count
}

console.log('Game | Old Range | New Range | Old Mean | New Mean | Status')
console.log('-'.repeat(100))

for (const gameId in gameStats) {
  const stats = gameStats[gameId]
  const status = !stats.changed ? '✅ Unchanged' : 
                 stats.newMean < stats.oldMean * 0.5 ? '⬇️ Reduced' :
                 stats.newMean > stats.oldMean * 1.5 ? '⬆️ Increased' :
                 '🔧 Adjusted'
  
  console.log(
    `${gameId.padEnd(25)} | ` +
    `${stats.oldMin}-${stats.oldMax} | `.padEnd(18) +
    `${stats.newMin}-${stats.newMax} | `.padEnd(18) +
    `${Math.floor(stats.oldMean).toString().padStart(8)} | ` +
    `${Math.floor(stats.newMean).toString().padStart(8)} | ` +
    status
  )
}

// Balance analysis
console.log('\n' + '='.repeat(100))
console.log('\n⚖️  BALANCE ANALYSIS\n')

const allNewScores = results.map(r => r.newScore).sort((a, b) => b - a)
const top10NewScores = allNewScores.slice(0, 10)
const newMax = Math.max(...allNewScores)
const newMin = Math.min(...allNewScores.filter(s => s > 0)) // exclude zeros

const oldMax = Math.max(...results.map(r => r.oldScore))
const oldMin = Math.min(...results.map(r => r.oldScore).filter(s => s > 0))

console.log(`Old Score Range: ${oldMin} - ${oldMax} (${(oldMax / oldMin).toFixed(2)}x variance)`)
console.log(`New Score Range: ${newMin} - ${newMax} (${(newMax / newMin).toFixed(2)}x variance)`)
console.log()

// Calculate coefficient of variation for top 10
const top10Mean = top10NewScores.reduce((a, b) => a + b, 0) / top10NewScores.length
const top10Variance = top10NewScores.reduce((sum, score) => sum + Math.pow(score - top10Mean, 2), 0) / top10NewScores.length
const top10StdDev = Math.sqrt(top10Variance)
const top10CV = (top10StdDev / top10Mean) * 100

console.log(`Top 10 Coefficient of Variation: ${top10CV.toFixed(2)}%`)
console.log(`  (Lower is better, <50% is good, <100% is acceptable)`)
console.log()

// Game diversity in top 10
const top10Games = new Set(results.slice(0, 10).map(r => r.gameId))
console.log(`Games represented in Top 10: ${top10Games.size} out of ${Object.keys(gameStats).length}`)
console.log(`  Games: ${Array.from(top10Games).join(', ')}`)

console.log('\n' + '='.repeat(100))
console.log('\n✅ VALIDATION COMPLETE')
console.log()

// Success criteria
const criteriaResults = {
  'No 100x imbalance': (newMax / newMin) < 100,
  'Top 10 variance < 10x': (Math.max(...top10NewScores) / Math.min(...top10NewScores)) < 10,
  'No zero scores (except broken games)': allNewScores.filter(s => s === 0).length === results.filter(r => r.gameId === 'packet-switch' && r.oldScore === 0).length,
  'Coefficient of Variation < 100%': top10CV < 100,
}

console.log('📋 Success Criteria:\n')
for (const [criterion, passed] of Object.entries(criteriaResults)) {
  console.log(`  ${passed ? '✅' : '❌'} ${criterion}`)
}

const allPassed = Object.values(criteriaResults).every(v => v)
console.log()
console.log(allPassed ? '🎉 ALL CRITERIA PASSED!' : '⚠️  Some criteria failed, review needed')
console.log()

// Export results
const outputPath = path.join(__dirname, '..', 'agent-os', 'specs', '2025-11-19-fair-scoring-system-analysis', 'planning', 'validation-results.json')
fs.writeFileSync(outputPath, JSON.stringify({
  results,
  gameStats,
  balanceAnalysis: {
    oldRange: { min: oldMin, max: oldMax, variance: oldMax / oldMin },
    newRange: { min: newMin, max: newMax, variance: newMax / newMin },
    top10CV: top10CV,
    gamesInTop10: Array.from(top10Games),
  },
  criteriaResults,
  allPassed,
}, null, 2))

console.log(`💾 Detailed results saved to: ${outputPath}`)
console.log()

