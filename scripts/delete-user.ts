/**
 * Script para deletar um usuário do banco de dados
 * 
 * Uso: npx tsx scripts/delete-user.ts <xId ou xUsername>
 * 
 * Exemplo:
 * npx tsx scripts/delete-user.ts shuktv
 * ou
 * npx tsx scripts/delete-user.ts 123456789
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteUser(identifier: string) {
  try {
    // Tentar encontrar por xUsername primeiro
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { xUsername: identifier },
          { xId: identifier },
        ],
      },
      include: {
        scores: true,
        accounts: true,
        sessions: true,
      },
    })

    if (!user) {
      // Tentar por ID numérico
      const numericId = parseInt(identifier)
      if (!isNaN(numericId)) {
        user = await prisma.user.findUnique({
          where: { id: numericId },
          include: {
            scores: true,
            accounts: true,
            sessions: true,
          },
        })
      }
    }

    if (!user) {
      console.error(`❌ Usuário não encontrado: ${identifier}`)
      process.exit(1)
    }

    console.log(`📋 Usuário encontrado:`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Nome: ${user.name}`)
    console.log(`   X ID: ${user.xId}`)
    console.log(`   X Username: ${user.xUsername || 'N/A'}`)
    console.log(`   Scores: ${user.scores.length}`)
    console.log(`   Accounts: ${user.accounts.length}`)
    console.log(`   Sessions: ${user.sessions.length}`)

    // Deletar scores primeiro (devido às relações)
    if (user.scores.length > 0) {
      console.log(`\n🗑️  Deletando ${user.scores.length} scores...`)
      await prisma.score.deleteMany({
        where: { userId: user.id },
      })
    }

    // Deletar accounts
    if (user.accounts.length > 0) {
      console.log(`🗑️  Deletando ${user.accounts.length} accounts...`)
      await prisma.account.deleteMany({
        where: { userId: user.id },
      })
    }

    // Deletar sessions
    if (user.sessions.length > 0) {
      console.log(`🗑️  Deletando ${user.sessions.length} sessions...`)
      await prisma.session.deleteMany({
        where: { userId: user.id },
      })
    }

    // Deletar score validation fails se existir
    const validationFails = await prisma.scoreValidationFail.count({
      where: { userId: user.id },
    })
    if (validationFails > 0) {
      console.log(`🗑️  Deletando ${validationFails} score validation fails...`)
      await prisma.scoreValidationFail.deleteMany({
        where: { userId: user.id },
      })
    }

    // Deletar o usuário
    console.log(`\n🗑️  Deletando usuário...`)
    await prisma.user.delete({
      where: { id: user.id },
    })

    console.log(`\n✅ Usuário deletado com sucesso!`)
    console.log(`   Você pode fazer login novamente para criar um novo usuário.`)
  } catch (error) {
    console.error('❌ Erro ao deletar usuário:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Pegar argumento da linha de comando
const identifier = process.argv[2]

if (!identifier) {
  console.error('❌ Por favor, forneça um xId, xUsername ou ID do usuário')
  console.error('   Uso: npx tsx scripts/delete-user.ts <xId ou xUsername>')
  console.error('   Exemplo: npx tsx scripts/delete-user.ts shuktv')
  process.exit(1)
}

deleteUser(identifier)

