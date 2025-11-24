/**
 * Script para investigar usuário e seus scores
 * 
 * Uso: npx tsx scripts/investigate-user.ts karenyouzinho
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function investigateUser(slug: string) {
  try {
    // Remove @ se presente
    const cleanSlug = slug.replace('@', '')
    
    console.log(`\n🔍 Investigando usuário com slug: ${cleanSlug}\n`)

    // 1. Buscar usuário por xUsername
    const userByUsername = await prisma.user.findFirst({
      where: {
        xUsername: cleanSlug,
      },
      include: {
        scores: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        _count: {
          select: {
            scores: true,
          },
        },
      },
    })

    // 2. Buscar usuário por xId (caso o slug seja o xId)
    const userByXId = await prisma.user.findFirst({
      where: {
        xId: cleanSlug,
      },
      include: {
        scores: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        _count: {
          select: {
            scores: true,
          },
        },
      },
    })

    // 3. Buscar por xUsername case-insensitive
    const allUsers = await prisma.user.findMany({
      where: {
        OR: [
          { xUsername: { contains: cleanSlug, mode: 'insensitive' } },
          { xId: { contains: cleanSlug } },
        ],
      },
      select: {
        id: true,
        name: true,
        xId: true,
        xUsername: true,
        showPublicHistory: true,
        createdAt: true,
        _count: {
          select: {
            scores: true,
          },
        },
      },
    })

    console.log('='.repeat(80))
    console.log('RESULTADO DA BUSCA')
    console.log('='.repeat(80))

    if (userByUsername) {
      console.log('\n✅ Usuário encontrado por xUsername:')
      console.log(`   ID: ${userByUsername.id}`)
      console.log(`   Nome: ${userByUsername.name}`)
      console.log(`   X ID: ${userByUsername.xId}`)
      console.log(`   X Username: ${userByUsername.xUsername || 'N/A'}`)
      console.log(`   Show Public History: ${userByUsername.showPublicHistory}`)
      console.log(`   Criado em: ${userByUsername.createdAt}`)
      console.log(`   Total de scores: ${userByUsername._count.scores}`)
      
      if (userByUsername.scores.length > 0) {
        console.log(`\n📊 Últimos ${userByUsername.scores.length} scores:`)
        userByUsername.scores.forEach((score, idx) => {
          console.log(`   ${idx + 1}. Game: ${score.gameId}, Score: ${score.score}, Best: ${score.isBestScore}, Data: ${score.createdAt}`)
        })
      } else {
        console.log('\n⚠️  Nenhum score encontrado para este usuário')
      }

      // Verificar integridade dos scores
      console.log('\n🔍 Verificando integridade dos dados...')
      const allScores = await prisma.score.findMany({
        where: {
          userId: userByUsername.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      console.log(`   Total de scores no banco: ${allScores.length}`)
      
      const bestScores = allScores.filter(s => s.isBestScore)
      console.log(`   Scores marcados como best: ${bestScores.length}`)

      // Verificar se há scores órfãos (userId que não existe)
      const orphanScores = await prisma.$queryRaw`
        SELECT COUNT(*) as count
        FROM scores
        WHERE "userId" = ${userByUsername.id}
        AND NOT EXISTS (
          SELECT 1 FROM users WHERE id = scores."userId"
        )
      `
      console.log(`   Scores órfãos: ${orphanScores}`)

      // Verificar se há múltiplos best scores para o mesmo jogo
      const bestScoresByGame = await prisma.score.groupBy({
        by: ['gameId'],
        where: {
          userId: userByUsername.id,
          isBestScore: true,
        },
        _count: {
          id: true,
        },
      })

      const duplicates = bestScoresByGame.filter(g => g._count.id > 1)
      if (duplicates.length > 0) {
        console.log(`\n⚠️  PROBLEMA: Múltiplos best scores para os mesmos jogos:`)
        duplicates.forEach(dup => {
          console.log(`   - ${dup.gameId}: ${dup._count.id} best scores`)
        })
      }

    } else if (userByXId) {
      console.log('\n✅ Usuário encontrado por xId:')
      console.log(`   ID: ${userByXId.id}`)
      console.log(`   Nome: ${userByXId.name}`)
      console.log(`   X ID: ${userByXId.xId}`)
      console.log(`   X Username: ${userByXId.xUsername || 'N/A'}`)
      console.log(`   Show Public History: ${userByXId.showPublicHistory}`)
      console.log(`   Criado em: ${userByXId.createdAt}`)
      console.log(`   Total de scores: ${userByXId._count.scores}`)
      
      if (userByXId.scores.length > 0) {
        console.log(`\n📊 Últimos ${userByXId.scores.length} scores:`)
        userByXId.scores.forEach((score, idx) => {
          console.log(`   ${idx + 1}. Game: ${score.gameId}, Score: ${score.score}, Best: ${score.isBestScore}, Data: ${score.createdAt}`)
        })
      } else {
        console.log('\n⚠️  Nenhum score encontrado para este usuário')
      }
    } else {
      console.log('\n❌ Usuário não encontrado por xUsername ou xId')
      
      if (allUsers.length > 0) {
        console.log(`\n🔍 Encontrados ${allUsers.length} usuários com nome similar:`)
        allUsers.forEach((user, idx) => {
          console.log(`   ${idx + 1}. ID: ${user.id}, Nome: ${user.name}, xUsername: ${user.xUsername || 'N/A'}, xId: ${user.xId}, Scores: ${user._count.scores}`)
        })
      }
    }

    // 4. Verificar se há scores sem usuário válido
    console.log('\n' + '='.repeat(80))
    console.log('VERIFICAÇÃO DE INTEGRIDADE GERAL')
    console.log('='.repeat(80))

    const orphanScoresCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count
      FROM scores
      WHERE NOT EXISTS (
        SELECT 1 FROM users WHERE id = scores."userId"
      )
    `
    console.log(`\n📊 Scores órfãos (sem usuário válido): ${orphanScoresCount[0]?.count || 0}`)

    // Verificar usuários sem xUsername mas com scores
    const usersWithoutUsername = await prisma.user.findMany({
      where: {
        xUsername: null,
        scores: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
        xId: true,
        _count: {
          select: {
            scores: true,
          },
        },
      },
    })

    if (usersWithoutUsername.length > 0) {
      console.log(`\n⚠️  Usuários sem xUsername mas com scores: ${usersWithoutUsername.length}`)
      usersWithoutUsername.forEach(user => {
        console.log(`   - ID: ${user.id}, Nome: ${user.name}, xId: ${user.xId}, Scores: ${user._count.scores}`)
      })
    }

  } catch (error) {
    console.error('❌ Erro ao investigar usuário:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

const slug = process.argv[2]

if (!slug) {
  console.error('❌ Por favor, forneça um slug de usuário')
  console.log('Uso: npx tsx scripts/investigate-user.ts karenyouzinho')
  process.exit(1)
}

investigateUser(slug)
  .then(() => {
    console.log('\n✅ Investigação concluída')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Erro:', error)
    process.exit(1)
  })

