/**
 * Score Migration Script
 * 
 * Recalculates all existing scores using the new balanced formulas.
 * 
 * Date: 2025-11-19
 * Changes:
 * - Hack Grid: 299K → 350 points (99.9% reduction)
 * - Debug Maze: 295K → 723 points (99.75% reduction)
 * - Packet Switch: 0 → 124 points (fixed)
 * - Stack Overflow Dodge: Increased rate 12→30 pts/sec
 */

import { prisma } from '../lib/prisma'

// ==================== NEW SCORING FORMULAS ====================

function calculateHackGridNewScore(metadata: any, duration: number, level: number): number {
  const segments = metadata?.segments || 0
  const difficulty = 1 // Level 1 difficulty (adjust if you have difficulty data)
  
  const BASE_SCORE_PER_DIFFICULTY = 100
  const MAX_TIME_SECONDS = 300
  const TIME_BONUS_MULTIPLIER = 2
  const EFFICIENCY_BONUS_MULTIPLIER = 0.5
  
  // Base score scales with level difficulty
  const baseScore = BASE_SCORE_PER_DIFFICULTY * difficulty
  
  // Time bonus (0-200% of base, capped)
  const durationSeconds = duration / 1000
  const timeRatio = Math.min(1, Math.max(0, (MAX_TIME_SECONDS - durationSeconds) / MAX_TIME_SECONDS))
  const timeBonus = baseScore * TIME_BONUS_MULTIPLIER * timeRatio
  
  // Efficiency bonus (0-50% of base)
  // Level 1 has ~6 required segments based on data analysis
  const requiredSegments = 6
  const efficiencyRatio = segments > 0 ? Math.min(1, requiredSegments / segments) : 1
  const efficiencyBonus = baseScore * EFFICIENCY_BONUS_MULTIPLIER * efficiencyRatio
  
  // Total score
  return Math.floor(baseScore + timeBonus + efficiencyBonus)
}

function calculateDebugMazeNewScore(metadata: any, duration: number, moves: number): number {
  const BASE_SCORE = 200
  const MAX_TIME_SECONDS = 300
  const TIME_BONUS_MULTIPLIER = 2
  const MOVE_EFFICIENCY_MULTIPLIER = 1
  
  // Base score for completion
  const baseScore = BASE_SCORE
  
  // Time bonus (0-200% of base)
  const durationSeconds = duration / 1000
  const timeRatio = Math.min(1, Math.max(0, (MAX_TIME_SECONDS - durationSeconds) / MAX_TIME_SECONDS))
  const timeBonus = baseScore * TIME_BONUS_MULTIPLIER * timeRatio
  
  // Move efficiency bonus (0-100% of base)
  // Level 1 optimal is ~8 moves (Manhattan distance)
  const optimalMoves = 8
  const moveEfficiency = Math.max(0, Math.min(1, optimalMoves / moves))
  const moveBonus = baseScore * MOVE_EFFICIENCY_MULTIPLIER * moveEfficiency
  
  // Total score
  return Math.floor(baseScore + timeBonus + moveBonus)
}

function calculatePacketSwitchNewScore(metadata: any, duration: number): number {
  const BASE_SCORE_PER_PACKET = 50
  const MAX_TIME_SECONDS = 120
  const TIME_BONUS_POINTS = 100
  
  const packetsDelivered = metadata?.packetsDelivered || 1
  const averageHops = metadata?.averageHops || 2
  const difficulty = 1 // Level 1
  
  // Base score per packet delivered
  const baseScorePerPacket = BASE_SCORE_PER_PACKET
  
  // Difficulty multiplier
  const difficultyMultiplier = difficulty
  
  // Efficiency bonus (fewer hops = better)
  const minPossibleHops = 1
  const hopEfficiency = Math.max(0.5, minPossibleHops / averageHops)
  
  // Time bonus (faster is better, but minor component)
  const durationSeconds = duration / 1000
  const timeRatio = Math.max(0, Math.min(1, (MAX_TIME_SECONDS - durationSeconds) / MAX_TIME_SECONDS))
  const timeBonus = TIME_BONUS_POINTS * timeRatio
  
  // Total score
  return Math.floor(
    (baseScorePerPacket * packetsDelivered * difficultyMultiplier * hopEfficiency) + timeBonus
  )
}

function calculateStackOverflowDodgeNewScore(metadata: any, duration: number): number {
  const SCORE_PER_SECOND = 30 // increased from 12
  const POWER_UP_BONUS = 50
  const ERROR_BONUS = 5
  
  const powerUpsCollected = metadata?.powerUpsCollected || 0
  const errorsAvoided = metadata?.errorsAvoided || 0
  
  const durationSeconds = duration / 1000
  
  return Math.floor(
    durationSeconds * SCORE_PER_SECOND + 
    powerUpsCollected * POWER_UP_BONUS +
    errorsAvoided * ERROR_BONUS
  )
}

// ==================== MIGRATION ====================

async function main() {
  console.log('🔄 Starting Score Migration...\n')
  console.log('=' .repeat(80))
  
  try {
    // Get all scores that need migration
    const affectedGames = ['hack-grid', 'debug-maze', 'packet-switch', 'stack-overflow-dodge']
    
    const scoresToMigrate = await prisma.score.findMany({
      where: {
        gameId: {
          in: affectedGames
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        score: 'desc'
      }
    })
    
    console.log(`\n📊 Found ${scoresToMigrate.length} scores to migrate`)
    console.log(`   Games: ${affectedGames.join(', ')}\n`)
    console.log('=' .repeat(80))
    
    let migratedCount = 0
    let unchangedCount = 0
    const changes: any[] = []
    
    // Process each score
    for (const score of scoresToMigrate) {
      let newScore = score.score // default to unchanged
      
      // Calculate new score based on game
      try {
        switch (score.gameId) {
          case 'hack-grid':
            newScore = calculateHackGridNewScore(score.metadata, score.duration || 0, score.level || 1)
            break
          case 'debug-maze':
            newScore = calculateDebugMazeNewScore(score.metadata, score.duration || 0, score.moves || 0)
            break
          case 'packet-switch':
            newScore = calculatePacketSwitchNewScore(score.metadata, score.duration || 0)
            break
          case 'stack-overflow-dodge':
            newScore = calculateStackOverflowDodgeNewScore(score.metadata, score.duration || 0)
            break
        }
      } catch (error) {
        console.error(`❌ Error calculating score for ${score.gameId} (ID: ${score.id}):`, error)
        continue
      }
      
      // Update if changed
      if (newScore !== score.score) {
        await prisma.score.update({
          where: { id: score.id },
          data: { score: newScore }
        })
        
        migratedCount++
        changes.push({
          id: score.id,
          userId: score.userId,
          userName: score.user.name,
          gameId: score.gameId,
          oldScore: score.score,
          newScore: newScore,
          change: newScore - score.score,
          changePercent: ((newScore - score.score) / score.score * 100).toFixed(2)
        })
        
        console.log(
          `✅ Migrated: ${score.user.name.substring(0, 20).padEnd(20)} | ` +
          `${score.gameId.padEnd(20)} | ` +
          `${score.score.toString().padStart(8)} → ${newScore.toString().padStart(8)} | ` +
          `${(newScore - score.score).toString().padStart(10)}`
        )
      } else {
        unchangedCount++
      }
    }
    
    console.log('\n' + '='.repeat(80))
    console.log('\n📊 Migration Summary:\n')
    console.log(`   Total scores processed: ${scoresToMigrate.length}`)
    console.log(`   ✅ Migrated: ${migratedCount}`)
    console.log(`   ⏭️  Unchanged: ${unchangedCount}`)
    
    if (changes.length > 0) {
      console.log('\n📈 Biggest Changes:\n')
      const sortedChanges = changes.sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
      sortedChanges.slice(0, 5).forEach((change, i) => {
        console.log(
          `   ${i + 1}. ${change.userName} (${change.gameId}): ` +
          `${change.oldScore} → ${change.newScore} (${change.changePercent}%)`
        )
      })
    }
    
    // Verify isBestScore flags are still correct
    console.log('\n🔍 Verifying isBestScore flags...')
    
    const users = await prisma.user.findMany({
      select: { id: true }
    })
    
    let bestScoreUpdates = 0
    
    for (const user of users) {
      for (const gameId of affectedGames) {
        // Get all scores for this user and game
        const userGameScores = await prisma.score.findMany({
          where: {
            userId: user.id,
            gameId: gameId
          },
          orderBy: {
            score: 'desc'
          }
        })
        
        if (userGameScores.length > 0) {
          const highestScore = userGameScores[0]
          
          // Update all scores for this user/game
          for (const score of userGameScores) {
            const shouldBeBest = score.id === highestScore.id
            if (score.isBestScore !== shouldBeBest) {
              await prisma.score.update({
                where: { id: score.id },
                data: { isBestScore: shouldBeBest }
              })
              bestScoreUpdates++
            }
          }
        }
      }
    }
    
    console.log(`   ✅ Updated ${bestScoreUpdates} isBestScore flags`)
    
    console.log('\n' + '='.repeat(80))
    console.log('\n✅ Migration Complete!\n')
    
    // Show new top 10
    console.log('📊 New Global Leaderboard (Top 10):\n')
    const newTopScores = await prisma.score.findMany({
      where: {
        isBestScore: true
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        score: 'desc'
      },
      take: 10
    })
    
    newTopScores.forEach((score, index) => {
      console.log(
        `   ${(index + 1).toString().padStart(2)}. ` +
        `${score.user.name.substring(0, 25).padEnd(25)} | ` +
        `${score.gameId.padEnd(20)} | ` +
        `${score.score.toString().padStart(8)} pts`
      )
    })
    
    console.log('\n🎉 All done! Ranking is now fair and balanced.\n')
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

