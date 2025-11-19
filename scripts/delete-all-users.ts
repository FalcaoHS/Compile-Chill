import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteAllUsers() {
  try {
    console.log("🗑️  Iniciando limpeza de todos os usuários...")
    
    // Contar usuários antes de deletar
    const usersCount = await prisma.user.count()
    const scoresCount = await prisma.score.count()
    const accountsCount = await prisma.account.count()
    const sessionsCount = await prisma.session.count()
    
    console.log("\n📊 Estatísticas antes da limpeza:")
    console.log(`   Usuários: ${usersCount}`)
    console.log(`   Scores: ${scoresCount}`)
    console.log(`   Accounts: ${accountsCount}`)
    console.log(`   Sessions: ${sessionsCount}`)
    
    if (usersCount === 0) {
      console.log("\n✅ Nenhum usuário encontrado. Nada para deletar.")
      return
    }
    
    // Deletar scores primeiro (foreign key constraint)
    if (scoresCount > 0) {
      console.log(`\n🗑️  Deletando ${scoresCount} scores...`)
      await prisma.score.deleteMany({})
      console.log("✅ Scores deletados")
    }
    
    // Deletar accounts
    if (accountsCount > 0) {
      console.log(`\n🗑️  Deletando ${accountsCount} accounts...`)
      await prisma.account.deleteMany({})
      console.log("✅ Accounts deletados")
    }
    
    // Deletar sessions
    if (sessionsCount > 0) {
      console.log(`\n🗑️  Deletando ${sessionsCount} sessions...`)
      await prisma.session.deleteMany({})
      console.log("✅ Sessions deletados")
    }
    
    // Deletar score validation fails
    const validationFailsCount = await prisma.scoreValidationFail.count()
    if (validationFailsCount > 0) {
      console.log(`\n🗑️  Deletando ${validationFailsCount} score validation fails...`)
      await prisma.scoreValidationFail.deleteMany({})
      console.log("✅ Score validation fails deletados")
    }
    
    // Deletar usuários por último
    console.log(`\n🗑️  Deletando ${usersCount} usuários...`)
    await prisma.user.deleteMany({})
    console.log("✅ Usuários deletados")
    
    // Verificar se tudo foi deletado
    const remainingUsers = await prisma.user.count()
    const remainingScores = await prisma.score.count()
    const remainingAccounts = await prisma.account.count()
    const remainingSessions = await prisma.session.count()
    
    console.log("\n📊 Estatísticas após a limpeza:")
    console.log(`   Usuários: ${remainingUsers}`)
    console.log(`   Scores: ${remainingScores}`)
    console.log(`   Accounts: ${remainingAccounts}`)
    console.log(`   Sessions: ${remainingSessions}`)
    
    if (remainingUsers === 0 && remainingScores === 0 && remainingAccounts === 0 && remainingSessions === 0) {
      console.log("\n✅ Limpeza concluída com sucesso!")
      console.log("   Todos os dados foram removidos. Você pode fazer login novamente para criar um novo usuário.")
    } else {
      console.log("\n⚠️  Ainda há dados restantes. Verifique manualmente.")
    }

  } catch (error) {
    console.error("❌ Erro ao deletar usuários:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Executar
deleteAllUsers()
  .then(() => {
    console.log("\n✅ Script finalizado")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n❌ Erro fatal:", error)
    process.exit(1)
  })

