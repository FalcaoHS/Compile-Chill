/**
 * Export all scores for analysis
 * 
 * This script exports all best scores from the database to analyze
 * score distributions across different games and identify imbalances.
 */

import { prisma } from '../lib/prisma'
import * as fs from 'fs'
import * as path from 'path'

interface ScoreAnalysis {
  gameId: string
  scores: number[]
  count: number
  min: number
  max: number
  mean: number
  median: number
  stdDev: number
  percentiles: {
    p25: number
    p50: number
    p75: number
    p90: number
    p95: number
    p99: number
  }
}

async function main() {
  try {
    console.log('📊 Fetching all best scores from database...\n')

    // Get all best scores
    const scores = await prisma.score.findMany({
      where: {
        isBestScore: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        score: 'desc',
      },
    })

    console.log(`✅ Found ${scores.length} best scores\n`)

    // Group by game
    const gameScores: Record<string, number[]> = {}
    scores.forEach(score => {
      if (!gameScores[score.gameId]) {
        gameScores[score.gameId] = []
      }
      gameScores[score.gameId].push(score.score)
    })

    // Calculate statistics for each game
    const analysis: Record<string, ScoreAnalysis> = {}

    for (const [gameId, scoreList] of Object.entries(gameScores)) {
      const sorted = scoreList.sort((a, b) => a - b)
      const count = sorted.length
      const sum = sorted.reduce((a, b) => a + b, 0)
      const mean = sum / count
      
      // Calculate standard deviation
      const squaredDiffs = sorted.map(score => Math.pow(score - mean, 2))
      const variance = squaredDiffs.reduce((a, b) => a + b, 0) / count
      const stdDev = Math.sqrt(variance)
      
      // Calculate percentiles
      const percentile = (p: number) => {
        const index = Math.ceil((p / 100) * count) - 1
        return sorted[Math.max(0, index)]
      }

      analysis[gameId] = {
        gameId,
        scores: sorted,
        count,
        min: sorted[0],
        max: sorted[count - 1],
        mean,
        median: percentile(50),
        stdDev,
        percentiles: {
          p25: percentile(25),
          p50: percentile(50),
          p75: percentile(75),
          p90: percentile(90),
          p95: percentile(95),
          p99: percentile(99),
        },
      }
    }

    // Print summary
    console.log('📈 Score Analysis by Game:\n')
    console.log('=' .repeat(100))
    
    for (const [gameId, stats] of Object.entries(analysis)) {
      console.log(`\n🎮 ${gameId.toUpperCase()}`)
      console.log(`   Count: ${stats.count}`)
      console.log(`   Range: ${stats.min} - ${stats.max}`)
      console.log(`   Mean: ${stats.mean.toFixed(2)}`)
      console.log(`   Median: ${stats.median}`)
      console.log(`   Std Dev: ${stats.stdDev.toFixed(2)}`)
      console.log(`   Percentiles:`)
      console.log(`     25th: ${stats.percentiles.p25}`)
      console.log(`     50th: ${stats.percentiles.p50}`)
      console.log(`     75th: ${stats.percentiles.p75}`)
      console.log(`     90th: ${stats.percentiles.p90}`)
      console.log(`     95th: ${stats.percentiles.p95}`)
      console.log(`     99th: ${stats.percentiles.p99}`)
    }

    console.log('\n' + '='.repeat(100))

    // Save to file
    const outputDir = path.join(__dirname, '..', 'agent-os', 'specs', '2025-11-19-fair-scoring-system-analysis', 'planning')
    const outputPath = path.join(outputDir, 'score-data-export.json')

    const exportData = {
      exportDate: new Date().toISOString(),
      totalScores: scores.length,
      games: Object.keys(gameScores),
      rawScores: scores.map(s => ({
        id: s.id,
        userId: s.userId,
        userName: s.user.name,
        gameId: s.gameId,
        score: s.score,
        duration: s.duration,
        moves: s.moves,
        level: s.level,
        metadata: s.metadata,
        createdAt: s.createdAt,
      })),
      analysis,
    }

    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2))
    console.log(`\n💾 Full data exported to: ${outputPath}`)

    // Create summary markdown
    const summaryPath = path.join(outputDir, 'score-analysis-summary.md')
    let markdown = '# Score Analysis Summary\n\n'
    markdown += `**Export Date:** ${new Date().toISOString()}\n\n`
    markdown += `**Total Best Scores:** ${scores.length}\n\n`
    markdown += `**Games Analyzed:** ${Object.keys(gameScores).length}\n\n`
    markdown += '## Statistics by Game\n\n'

    for (const [gameId, stats] of Object.entries(analysis)) {
      markdown += `### ${gameId}\n\n`
      markdown += `| Metric | Value |\n`
      markdown += `|--------|-------|\n`
      markdown += `| Sample Size | ${stats.count} |\n`
      markdown += `| Min Score | ${stats.min} |\n`
      markdown += `| Max Score | ${stats.max} |\n`
      markdown += `| Mean | ${stats.mean.toFixed(2)} |\n`
      markdown += `| Median | ${stats.median} |\n`
      markdown += `| Std Deviation | ${stats.stdDev.toFixed(2)} |\n`
      markdown += `| 25th Percentile | ${stats.percentiles.p25} |\n`
      markdown += `| 75th Percentile | ${stats.percentiles.p75} |\n`
      markdown += `| 90th Percentile | ${stats.percentiles.p90} |\n`
      markdown += `| 95th Percentile | ${stats.percentiles.p95} |\n`
      markdown += `| 99th Percentile | ${stats.percentiles.p99} |\n`
      markdown += `\n`
    }

    // Add comparison table
    markdown += '## Comparative Overview\n\n'
    markdown += '| Game | Count | Min | Max | Mean | Median | Std Dev | Range Ratio |\n'
    markdown += '|------|-------|-----|-----|------|--------|---------|-------------|\n'
    
    for (const [gameId, stats] of Object.entries(analysis)) {
      const rangeRatio = stats.max / (stats.min || 1)
      markdown += `| ${gameId} | ${stats.count} | ${stats.min} | ${stats.max} | ${stats.mean.toFixed(0)} | ${stats.median} | ${stats.stdDev.toFixed(0)} | ${rangeRatio.toFixed(2)}x |\n`
    }

    fs.writeFileSync(summaryPath, markdown)
    console.log(`📝 Summary markdown exported to: ${summaryPath}`)

    console.log('\n✅ Export complete!\n')
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

