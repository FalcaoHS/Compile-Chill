/**
 * Script para verificar tentativas de salvamento de scores
 * e possíveis problemas de autenticação
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkScoreSubmissions() {
  try {
    console.log('\n🔍 Verificando problemas com salvamento de scores\n')

    // 1. Verificar usuário específico
    const user = await prisma.user.findFirst({
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
          orderBy: {
            expires: 'desc',
          },
          take: 5,
        },
        scoreValidationFails: {
          orderBy: {
            lastAttempt: 'desc',
          },
          take: 10,
        },
      },
    })

    if (!user) {
      console.log('❌ Usuário não encontrado')
      return
    }

    console.log('='.repeat(80))
    console.log('INFORMAÇÕES DO USUÁRIO')
    console.log('='.repeat(80))
    console.log(`ID: ${user.id}`)
    console.log(`Nome: ${user.name}`)
    console.log(`X Username: ${user.xUsername}`)
    console.log(`X ID: ${user.xId}`)
    console.log(`Show Public History: ${user.showPublicHistory}`)
    console.log(`Total de scores: ${user.scores.length}`)
    console.log(`Total de accounts: ${user.accounts.length}`)
    console.log(`Total de sessões ativas: ${user.sessions.length}`)
    console.log(`Total de falhas de validação: ${user.scoreValidationFails.length}`)

    // 2. Verificar accounts
    if (user.accounts.length > 0) {
      console.log('\n📋 Accounts:')
      user.accounts.forEach((account, idx) => {
        console.log(`   ${idx + 1}. Provider: ${account.provider}, Type: ${account.type}, Provider Account ID: ${account.providerAccountId}`)
      })
    } else {
      console.log('\n⚠️  Nenhuma account encontrada - usuário pode não estar autenticado corretamente')
    }

    // 3. Verificar sessões ativas
    if (user.sessions.length > 0) {
      console.log('\n📋 Sessões ativas:')
      user.sessions.forEach((session, idx) => {
        console.log(`   ${idx + 1}. Expira em: ${session.expires.toISOString()}`)
      })
    } else {
      console.log('\n⚠️  Nenhuma sessão ativa encontrada - usuário pode não estar logado')
    }

    // 4. Verificar falhas de validação
    if (user.scoreValidationFails.length > 0) {
      console.log('\n⚠️  Falhas de validação de scores:')
      user.scoreValidationFails.forEach((fail, idx) => {
        console.log(`   ${idx + 1}. Game: ${fail.gameId}, Tentativas: ${fail.count}, Última tentativa: ${fail.lastAttempt.toISOString()}`)
        console.log(`      Detalhes: ${JSON.stringify(fail.details, null, 2)}`)
      })
    }

    // 5. Verificar se há scores com userId incorreto
    console.log('\n' + '='.repeat(80))
    console.log('VERIFICAÇÃO DE INTEGRIDADE')
    console.log('='.repeat(80))

    // Verificar scores órfãos
    const orphanScores = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count
      FROM scores
      WHERE "userId" = ${user.id}
      AND NOT EXISTS (
        SELECT 1 FROM users WHERE id = ${user.id}
      )
    `
    console.log(`Scores órfãos para este usuário: ${orphanScores[0]?.count || 0}`)

    // Verificar se há scores com xId mas userId diferente
    const scoresWithWrongUserId = await prisma.score.findMany({
      where: {
        user: {
          xId: user.xId,
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

    if (scoresWithWrongUserId.length > 0) {
      console.log(`\n⚠️  Encontrados ${scoresWithWrongUserId.length} scores associados ao xId mas com userId diferente:`)
      scoresWithWrongUserId.forEach((score) => {
        console.log(`   Score ID: ${score.id}, UserId no score: ${score.userId}, UserId correto: ${user.id}, Game: ${score.gameId}`)
      })
    }

    // 6. Verificar todos os scores do usuário (caso existam)
    if (user.scores.length > 0) {
      console.log('\n📊 Scores do usuário:')
      user.scores.forEach((score, idx) => {
        console.log(`   ${idx + 1}. ID: ${score.id}, Game: ${score.gameId}, Score: ${score.score}, Best: ${score.isBestScore}, Data: ${score.createdAt.toISOString()}`)
      })
    }

    // 7. Verificar se há problema com a autenticação
    console.log('\n' + '='.repeat(80))
    console.log('DIAGNÓSTICO')
    console.log('='.repeat(80))

    if (user.accounts.length === 0) {
      console.log('❌ PROBLEMA: Usuário não tem accounts - autenticação pode estar quebrada')
    }

    if (user.sessions.length === 0) {
      console.log('⚠️  AVISO: Usuário não tem sessões ativas - pode não estar logado no momento')
    }

    if (user.scoreValidationFails.length > 0) {
      console.log('⚠️  AVISO: Há falhas de validação de scores - pode haver problema com os dados enviados')
    }

    if (user.scores.length === 0 && user.scoreValidationFails.length === 0) {
      console.log('❓ POSSÍVEL CAUSA: Usuário pode não estar tentando salvar scores, ou há problema na autenticação que impede o salvamento')
    }

  } catch (error) {
    console.error('❌ Erro ao verificar:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

checkScoreSubmissions()
  .then(() => {
    console.log('\n✅ Verificação concluída')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Erro:', error)
    process.exit(1)
  })

