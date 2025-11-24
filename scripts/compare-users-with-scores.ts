/**
 * Script para comparar usuários que têm scores vs usuários sem scores
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function compareUsers() {
  try {
    console.log('\n🔍 Comparando usuários com e sem scores\n')

    // 1. Buscar usuário problemático
    const problemUser = await prisma.user.findFirst({
      where: {
        xUsername: 'karenyouzinho',
      },
      include: {
        scores: true,
        accounts: true,
        sessions: {
          where: {
            expires: {
              gt: new Date(),
            },
          },
          take: 1,
        },
      },
    })

    // 2. Buscar alguns usuários que TÊM scores
    const usersWithScores = await prisma.user.findMany({
      where: {
        scores: {
          some: {},
        },
      },
      include: {
        scores: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
        accounts: true,
        sessions: {
          where: {
            expires: {
              gt: new Date(),
            },
          },
          take: 1,
        },
      },
      take: 5,
    })

    console.log('='.repeat(80))
    console.log('USUÁRIO PROBLEMÁTICO: @karenyouzinho')
    console.log('='.repeat(80))
    
    if (problemUser) {
      console.log(`ID: ${problemUser.id}`)
      console.log(`Nome: ${problemUser.name}`)
      console.log(`X Username: ${problemUser.xUsername}`)
      console.log(`X ID: ${problemUser.xId}`)
      console.log(`Criado em: ${problemUser.createdAt.toISOString()}`)
      console.log(`Total de scores: ${problemUser.scores.length}`)
      console.log(`Total de accounts: ${problemUser.accounts.length}`)
      console.log(`Sessões ativas: ${problemUser.sessions.length}`)
      
      if (problemUser.accounts.length > 0) {
        console.log(`\nAccount:`)
        problemUser.accounts.forEach(acc => {
          console.log(`  - Provider: ${acc.provider}`)
          console.log(`  - Provider Account ID: ${acc.providerAccountId}`)
          console.log(`  - Type: ${acc.type}`)
        })
      }
      
      if (problemUser.sessions.length > 0) {
        console.log(`\nSessão ativa:`)
        problemUser.sessions.forEach(sess => {
          console.log(`  - Expira em: ${sess.expires.toISOString()}`)
          console.log(`  - Session Token: ${sess.sessionToken.substring(0, 20)}...`)
        })
      }
    }

    console.log('\n' + '='.repeat(80))
    console.log('USUÁRIOS QUE CONSEGUEM SALVAR SCORES (amostra)')
    console.log('='.repeat(80))

    usersWithScores.forEach((user, idx) => {
      console.log(`\n${idx + 1}. ${user.name} (@${user.xUsername || user.xId})`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Criado em: ${user.createdAt.toISOString()}`)
      console.log(`   Total de scores: ${user.scores.length}`)
      console.log(`   Último score: ${user.scores[0]?.createdAt.toISOString() || 'N/A'}`)
      console.log(`   Accounts: ${user.accounts.length}`)
      console.log(`   Sessões ativas: ${user.sessions.length}`)
      
      if (user.accounts.length > 0) {
        user.accounts.forEach(acc => {
          console.log(`     - Provider: ${acc.provider}, Account ID: ${acc.providerAccountId}`)
        })
      }
    })

    // 3. Comparar estrutura das accounts
    console.log('\n' + '='.repeat(80))
    console.log('COMPARAÇÃO DE ESTRUTURA')
    console.log('='.repeat(80))

    if (problemUser && problemUser.accounts.length > 0 && usersWithScores.length > 0) {
      const problemAccount = problemUser.accounts[0]
      const workingAccount = usersWithScores[0].accounts[0]
      
      console.log('\nAccount do usuário problemático:')
      console.log(JSON.stringify(problemAccount, null, 2))
      
      console.log('\nAccount de um usuário que funciona:')
      console.log(JSON.stringify(workingAccount, null, 2))
    }

    // 4. Verificar se há diferença no formato do user.id na sessão
    console.log('\n' + '='.repeat(80))
    console.log('VERIFICAÇÃO DE SESSÕES')
    console.log('='.repeat(80))

    if (problemUser && problemUser.sessions.length > 0) {
      const problemSession = problemUser.sessions[0]
      console.log(`\nSessão do usuário problemático:`)
      console.log(`  UserId na sessão (banco): ${problemSession.userId}`)
      console.log(`  UserId do usuário: ${problemUser.id}`)
      console.log(`  Match: ${problemSession.userId === problemUser.id ? '✅' : '❌'}`)
    }

    // 5. Verificar se há scores com userId diferente
    console.log('\n' + '='.repeat(80))
    console.log('VERIFICAÇÃO DE SCORES ÓRFÃOS')
    console.log('='.repeat(80))

    if (problemUser) {
      // Verificar se há scores com o xId mas userId diferente
      const scoresWithSameXId = await prisma.score.findMany({
        where: {
          user: {
            xId: problemUser.xId,
          },
        },
        select: {
          id: true,
          userId: true,
          gameId: true,
          score: true,
          createdAt: true,
        },
      })

      if (scoresWithSameXId.length > 0) {
        console.log(`\n⚠️  ENCONTRADOS ${scoresWithSameXId.length} SCORES COM O MESMO X ID:`)
        scoresWithSameXId.forEach(score => {
          console.log(`  Score ID: ${score.id}, UserId: ${score.userId}, Game: ${score.gameId}, Score: ${score.score}`)
          if (score.userId !== problemUser.id) {
            console.log(`  ❌ PROBLEMA: Score está associado ao userId ${score.userId}, mas deveria ser ${problemUser.id}`)
          }
        })
      } else {
        console.log('\n✅ Nenhum score encontrado com o mesmo xId')
      }
    }

  } catch (error) {
    console.error('❌ Erro:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

compareUsers()
  .then(() => {
    console.log('\n✅ Análise concluída')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Erro:', error)
    process.exit(1)
  })

