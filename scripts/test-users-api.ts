/**
 * Script para testar a API de usuários recentes
 * Execute: npx tsx scripts/test-users-api.ts
 */

async function testUsersAPI() {
  console.log('\n🔍 Testando API /api/users/recent...\n')
  
  try {
    // Simular requisição local
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const url = `${baseUrl}/api/users/recent`
    
    console.log(`📡 Fazendo requisição para: ${url}\n`)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`)
    
    if (!response.ok) {
      console.error(`❌ Erro na resposta: ${response.statusText}`)
      const text = await response.text()
      console.error(`Resposta: ${text}`)
      return
    }
    
    const data = await response.json()
    
    console.log(`✅ Usuários retornados: ${data.users?.length || 0}\n`)
    
    if (data.users && data.users.length > 0) {
      console.log('📋 Lista de usuários:')
      data.users.forEach((user: any, i: number) => {
        console.log(`  ${i + 1}. ${user.username?.padEnd(20)} | ID: ${user.userId.toString().padStart(5)} | Avatar: ${user.avatar ? '✅' : '❌'}`)
      })
    } else {
      console.log('⚠️  Nenhum usuário retornado!')
      console.log('   Isso significa que:')
      console.log('   - Não há sessões ativas no banco')
      console.log('   - Não há usuários atualizados nos últimos 5 minutos')
      console.log('   - A API deveria retornar FAKE_PROFILES, mas não retornou')
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar API:', error)
    if (error instanceof Error) {
      console.error('   Mensagem:', error.message)
      console.error('   Stack:', error.stack)
    }
  }
}

testUsersAPI()

