/**
 * Script para verificar tentativas recentes de salvamento de scores
 * e ver se há algum padrão de falha
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkRecentAttempts() {
  try {
    console.log('\n🔍 Verificando tentativas de salvamento de scores\n')

    // 1. Verificar usuário problemático
    const problemUser = await prisma.user.findFirst({
      where: {
        xUsername: 'karenyouzinho',
      },
    })

    if (!problemUser) {
      console.log('❌ Usuário não encontrado')
      return
    }

    console.log('='.repeat(80))
    console.log('USUÁRIO: @karenyouzinho')
    console.log('='.repeat(80))
    console.log(`ID: ${problemUser.id}`)
    console.log(`Criado em: ${problemUser.createdAt.toISOString()}`)

    // 2. Verificar falhas de validação (pode indicar tentativas que falharam)
    const validationFails = await prisma.scoreValidationFail.findMany({
      where: {
        userId: problemUser.id,
      },
      orderBy: {
        lastAttempt: 'desc',
      },
    })

    if (validationFails.length > 0) {
      console.log(`\n⚠️  ENCONTRADAS ${validationFails.length} FALHAS DE VALIDAÇÃO:`)
      validationFails.forEach((fail, idx) => {
        console.log(`\n${idx + 1}. Game: ${fail.gameId}`)
        console.log(`   Tentativas: ${fail.count}`)
        console.log(`   Última tentativa: ${fail.lastAttempt.toISOString()}`)
        console.log(`   Detalhes: ${JSON.stringify(fail.details, null, 2)}`)
      })
    } else {
      console.log('\n✅ Nenhuma falha de validação registrada')
      console.log('   Isso significa que NENHUMA tentativa de salvamento chegou na API')
      console.log('   Possíveis causas:')
      console.log('   1. Sessão não está disponível no frontend (session?.user é null)')
      console.log('   2. Usuário não está jogando enquanto logado')
      console.log('   3. Erro no frontend que impede o fetch de ser executado')
    }

    // 3. Verificar sessões recentes
    console.log('\n' + '='.repeat(80))
    console.log('SESSÕES RECENTES')
    console.log('='.repeat(80))

    const recentSessions = await prisma.session.findMany({
      where: {
        userId: problemUser.id,
      },
      orderBy: {
        expires: 'desc',
      },
      take: 5,
    })

    if (recentSessions.length > 0) {
      console.log(`\nTotal de sessões: ${recentSessions.length}`)
      recentSessions.forEach((session, idx) => {
        const isActive = session.expires > new Date()
        console.log(`\n${idx + 1}. ${isActive ? '✅ ATIVA' : '❌ EXPIRADA'}`)
        console.log(`   Criada: ${session.expires.toISOString()}`)
        console.log(`   Expira: ${session.expires.toISOString()}`)
        console.log(`   Token: ${session.sessionToken.substring(0, 20)}...`)
      })
    } else {
      console.log('\n⚠️  Nenhuma sessão encontrada')
    }

    // 4. Comparar com usuários que funcionam
    console.log('\n' + '='.repeat(80))
    console.log('COMPARAÇÃO COM USUÁRIOS QUE FUNCIONAM')
    console.log('='.repeat(80))

    const workingUsers = await prisma.user.findMany({
      where: {
        scores: {
          some: {},
        },
      },
      include: {
        _count: {
          select: {
            scores: true,
            scoreValidationFails: true,
            sessions: true,
          },
        },
      },
      take: 3,
    })

    workingUsers.forEach((user, idx) => {
      console.log(`\n${idx + 1}. ${user.name} (@${user.xUsername || user.xId})`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Scores: ${user._count.scores}`)
      console.log(`   Falhas de validação: ${user._count.scoreValidationFails}`)
      console.log(`   Sessões: ${user._count.sessions}`)
    })

    // 5. Verificar se há diferença na estrutura das sessões
    if (recentSessions.length > 0 && workingUsers.length > 0) {
      const problemSession = recentSessions[0]
      const workingUserSessions = await prisma.session.findMany({
        where: {
          userId: workingUsers[0].id,
        },
        take: 1,
      })

      if (workingUserSessions.length > 0) {
        const workingSession = workingUserSessions[0]
        
        console.log('\n' + '='.repeat(80))
        console.log('COMPARAÇÃO DE SESSÕES')
        console.log('='.repeat(80))
        
        console.log('\nSessão do usuário problemático:')
        console.log(JSON.stringify({
          userId: problemSession.userId,
          expires: problemSession.expires.toISOString(),
          isActive: problemSession.expires > new Date(),
        }, null, 2))
        
        console.log('\nSessão de um usuário que funciona:')
        console.log(JSON.stringify({
          userId: workingSession.userId,
          expires: workingSession.expires.toISOString(),
          isActive: workingSession.expires > new Date(),
        }, null, 2))
      }
    }

    // 6. Verificar quando foi a última vez que o usuário teve atividade
    console.log('\n' + '='.repeat(80))
    console.log('ATIVIDADE RECENTE')
    console.log('='.repeat(80))

    const lastSession = recentSessions[0]
    if (lastSession) {
      const daysSinceLastSession = Math.floor(
        (Date.now() - lastSession.expires.getTime()) / (1000 * 60 * 60 * 24)
      )
      console.log(`\nÚltima sessão: ${lastSession.expires.toISOString()}`)
      console.log(`Dias desde última sessão: ${daysSinceLastSession}`)
      console.log(`Sessão está ativa: ${lastSession.expires > new Date() ? '✅ Sim' : '❌ Não'}`)
    }

    console.log(`\nÚltima atualização do perfil: ${problemUser.updatedAt.toISOString()}`)

  } catch (error) {
    console.error('❌ Erro:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

checkRecentAttempts()
  .then(() => {
    console.log('\n✅ Verificação concluída')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Erro:', error)
    process.exit(1)
  })

