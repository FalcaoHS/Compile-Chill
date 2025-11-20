📘 Environment Setup Driver — Compile & Chill

> 💡 **Como usar:** É só arrastar este arquivo para o prompt do agente de IA e dar Enter!

Autor: Hudson "Shuk" Falcão
Data: 20/01/2025
Versão: 1.0
Objetivo: Automatizar a configuração completa do ambiente de desenvolvimento do Compile & Chill, permitindo setup por etapas ou automático.

🤖 IMPORTANTE: Instruções para o Agente de IA

⚠️ REGRAS OBRIGATÓRIAS - O AGENTE DEVE SEGUIR EXATAMENTE:

1. **O agente DEVE perguntar o modo de execução!**
   - SEMPRE perguntar: "Deseja executar por etapas (interativo) ou automaticamente (tudo de uma vez)?"
   - NUNCA assumir o modo de execução
   - SEMPRE aguardar resposta do usuário

2. **O agente DEVE validar pré-requisitos antes de começar!**
   - Verificar Node.js instalado
   - Verificar pnpm instalado
   - Verificar Git instalado
   - NUNCA prosseguir se pré-requisitos não estiverem instalados

3. **O agente DEVE gerar automaticamente quando possível!**
   - Gerar `NEXTAUTH_SECRET` automaticamente (sem perguntar)
   - Criar arquivo `.env` com template completo automaticamente
   - Executar comandos diretamente (sem pedir confirmação para comandos seguros)
   - Apenas perguntar quando realmente necessário (credenciais externas que o agente não pode gerar)

4. **O agente DEVE validar cada etapa antes de prosseguir!**
   - Verificar se comandos foram executados com sucesso
   - Validar arquivos criados
   - Testar conexões quando aplicável
   - NUNCA pular validações

5. **O agente DEVE gerar relatório completo ao final!**
   - Listar todas as etapas executadas
   - Indicar o que foi configurado
   - Listar próximos passos se algo ficou pendente
   - NUNCA finalizar sem relatório

6. **O agente NUNCA deve tocar no CANVAS!**
   - NUNCA sugerir mudanças em arquivos do canvas
   - NUNCA modificar `components/canvas/` ou `lib/canvas/`
   - NUNCA alterar lógica de renderização ou temas visuais
   - O CANVAS é área CRÍTICA e SENSÍVEL - requer supervisão manual
   - Se encontrar problemas no canvas, apenas informar, NUNCA tentar corrigir automaticamente

**Fluxo esperado (OBRIGATÓRIO seguir):**

1. Agente valida pré-requisitos automaticamente
2. Agente executa etapas automaticamente (gerando código, criando arquivos, executando comandos)
3. Agente pergunta APENAS quando precisa de informações externas (credenciais de serviços)
4. Agente valida cada etapa automaticamente
5. Agente gera relatório final completo
6. **Agente NUNCA toca no CANVAS** (área crítica, requer supervisão manual)

**O agente NUNCA deve:**
- ❌ Pedir confirmação para comandos seguros (install, build, etc.)
- ❌ Pular validação de pré-requisitos
- ❌ Pedir valores que pode gerar automaticamente (NEXTAUTH_SECRET, etc.)
- ❌ Pular validações de etapas
- ❌ Finalizar sem relatório
- ❌ Pedir confirmação antes de criar arquivos de configuração
- ❌ **SUGERIR OU FAZER MUDANÇAS NO CANVAS** (área muito sensível, requer supervisão manual)
- ❌ Modificar arquivos em `components/canvas/`, `lib/canvas/`, ou qualquer código relacionado ao CANVAS
- ❌ Alterar lógica de renderização, temas visuais, ou componentes do canvas

---

## 🎯 Objetivo

Este driver automatiza a configuração completa do ambiente de desenvolvimento do Compile & Chill, incluindo:
- ✅ Verificação de pré-requisitos
- ✅ Instalação de dependências
- ✅ Configuração de variáveis de ambiente
- ✅ Setup de banco de dados
- ✅ Configuração de OAuth (X/Twitter)
- ✅ Configuração de Upstash Redis
- ✅ Validação final do ambiente

---

## 📋 Pré-requisitos

Antes de executar este driver, o usuário precisa ter:

- ✅ **Node.js** (versão 18 ou superior)
- ✅ **pnpm** (gerenciador de pacotes)
- ✅ **Git** instalado
- ✅ **Conta no GitHub** (para clonar repositório)
- ✅ **Conta no X (Twitter)** (para OAuth)
- ✅ **Conta no Neon/Supabase** (para banco de dados PostgreSQL)
- ✅ **Conta no Upstash** (para Redis - opcional em desenvolvimento)

---

## 🔄 Modo de Execução

**Modo Automático (Padrão)**

O agente executa todas as etapas automaticamente, gerando código e executando comandos diretamente. Apenas pergunta quando precisa de informações externas que não pode gerar (credenciais de serviços).

**O que o agente faz automaticamente:**
- ✅ Valida pré-requisitos
- ✅ Instala dependências
- ✅ Gera `NEXTAUTH_SECRET` automaticamente
- ✅ Cria arquivo `.env` com template completo
- ✅ Executa comandos de build e validação
- ✅ Gera relatório completo

**O que o agente pergunta (apenas quando necessário):**
- ⚠️ Connection string do banco de dados (se não existir)
- ⚠️ Credenciais OAuth do X/Twitter (se não existirem)
- ⚠️ Credenciais do Upstash Redis (se quiser configurar)

---

## 📝 Instruções para o Agente de IA

### Passo 1: Inicialização

1. **Validar pré-requisitos automaticamente:**
   - Executar: `node --version` (verificar se Node.js está instalado)
   - Executar: `pnpm --version` (verificar se pnpm está instalado)
   - Executar: `git --version` (verificar se Git está instalado)
   - Se algum não estiver instalado, informar e parar

2. **Verificar se está na pasta do projeto:**
   - Verificar se existe `package.json`
   - Se não estiver, informar que precisa estar na raiz do projeto

3. **Iniciar setup automático:**
   - Informar que vai executar todas as etapas automaticamente
   - Apenas perguntará quando precisar de credenciais externas

### Passo 2: Instalação de Dependências

**Comandos a executar:**
```bash
pnpm install
```

**Validação:**
- Verificar se `node_modules/` foi criado
- Verificar se não há erros críticos no output
- Se houver erros, informar e parar
- Se sucesso, prosseguir automaticamente para próxima etapa

### Passo 3: Configuração de Variáveis de Ambiente

**Ações automáticas (sem perguntar):**

1. **Verificar se `.env` existe:**
   - Se não existir, criar automaticamente
   - Se existir, verificar se tem todas as variáveis necessárias

2. **Gerar `NEXTAUTH_SECRET` automaticamente:**
   - Windows: Executar PowerShell: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))`
   - Linux/Mac: Executar: `openssl rand -base64 32`
   - Se não conseguir gerar localmente, usar gerador online ou criar valor aleatório

3. **Criar/atualizar arquivo `.env` automaticamente:**
   - Preencher `NEXTAUTH_URL="http://localhost:3000"` automaticamente
   - Preencher `NEXTAUTH_SECRET` com valor gerado
   - Deixar campos de credenciais externas vazios (serão preenchidos depois)

**Template `.env` a criar:**
```env
# ============================================
# CONFIGURAÇÃO DO BANCO DE DADOS
# ============================================
DATABASE_URL="postgresql://user:password@localhost:5432/compileandchill?schema=public"

# ============================================
# CONFIGURAÇÃO DO NEXTAUTH
# ============================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[GERAR AUTOMATICAMENTE]"

# ============================================
# X OAUTH CREDENTIALS
# ============================================
X_CLIENT_ID=""
X_CLIENT_SECRET=""

# ============================================
# UPSTASH REDIS (Rate Limiting)
# ============================================
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

**Validação:**
- Verificar se arquivo `.env` foi criado
- Verificar se `NEXTAUTH_SECRET` foi gerado
- Informar quais variáveis ainda precisam ser preenchidas

### Passo 4: Configuração de Banco de Dados

**Ações automáticas:**

1. **Verificar se `DATABASE_URL` já existe no `.env`:**
   - Se existir e for válida, pular para validação
   - Se não existir ou estiver vazia, perguntar connection string

2. **Se precisar de connection string:**
   - Perguntar: "Qual é a connection string do seu banco PostgreSQL? (Neon, Supabase, local, etc.)"
   - Se não tiver, fornecer link: https://neon.tech e aguardar

3. **Após ter `DATABASE_URL`:**
   - Executar automaticamente: `pnpm prisma migrate dev` ou `npx prisma migrate dev`
   - Não pedir confirmação, executar diretamente

**Validação automática:**
- Verificar se migrations foram executadas com sucesso
- Se houver erro de conexão, informar e aguardar correção
- Se sucesso, prosseguir automaticamente

### Passo 5: Configuração de OAuth (X/Twitter)

**Ações automáticas:**

1. **Verificar se credenciais já existem no `.env`:**
   - Se `X_CLIENT_ID` e `X_CLIENT_SECRET` já estiverem preenchidos, pular etapa
   - Se estiverem vazias, perguntar credenciais

2. **Se precisar de credenciais:**
   - Perguntar: "Qual é o X_CLIENT_ID e X_CLIENT_SECRET? (obtenha em https://developer.twitter.com/en/portal/dashboard)"
   - Se não tiver, fornecer link e instruções:
     - Link: https://developer.twitter.com/en/portal/dashboard
     - Callback URL: `http://localhost:3000/api/auth/callback/x`
   - Aguardar credenciais do usuário

3. **Após receber credenciais:**
   - Adicionar automaticamente ao `.env`
   - Não pedir confirmação, atualizar diretamente

**Validação automática:**
- Verificar se variáveis foram adicionadas ao `.env`
- Informar que OAuth está configurado (testar após rodar projeto)

### Passo 6: Configuração de Upstash Redis (Opcional)

**Ações automáticas:**

1. **Verificar se credenciais já existem:**
   - Se `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` já estiverem preenchidos, pular etapa
   - Se estiverem vazias, perguntar se quer configurar

2. **Se precisar configurar:**
   - Perguntar: "Deseja configurar Upstash Redis agora? (opcional - pode pular para desenvolvimento)"
   - Se sim, perguntar: "Qual é a UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN?"
   - Se não tiver, fornecer link: https://upstash.com e aguardar

3. **Após receber credenciais:**
   - Adicionar automaticamente ao `.env`
   - Não pedir confirmação, atualizar diretamente

**Validação automática:**
- Se configurado, informar que rate limiting estará ativo
- Se não configurado, informar que pode configurar depois (não bloqueia desenvolvimento)

### Passo 7: Validação Final

**Comandos a executar automaticamente (sem pedir confirmação):**

```bash
# Verificar TypeScript
pnpm ts:check || npx tsc --noEmit

# Verificar build
pnpm build || npm run build
```

**Validação automática:**
- Executar comandos diretamente
- Verificar se não há erros de TypeScript
- Verificar se build foi bem-sucedido
- Se houver erros, informar e listar problemas
- Se houver apenas warnings, informar mas prosseguir
- Se tudo OK, prosseguir para teste final

### Passo 8: Teste do Ambiente

**Ação automática:**

1. **Perguntar se quer iniciar servidor:**
   - Perguntar: "Deseja que eu inicie o servidor de desenvolvimento agora? (y/n)"
   - Se sim, executar automaticamente: `pnpm dev` ou `npm run dev`
   - Se não, informar que pode rodar depois com `pnpm dev`

2. **Se iniciar servidor:**
   - Executar comando diretamente (sem pedir confirmação adicional)
   - Aguardar alguns segundos e verificar se iniciou
   - Informar URL: http://localhost:3000
   - Informar que servidor está rodando em background

**Validação automática:**
- Verificar se servidor iniciou na porta 3000
- Se houver erro, informar e listar problemas
- Se sucesso, informar que ambiente está pronto

---

## 📊 Relatório Final

O agente DEVE gerar um relatório completo ao final, incluindo:

### ✅ O que foi configurado:
- [ ] Dependências instaladas
- [ ] Arquivo `.env` criado
- [ ] `NEXTAUTH_SECRET` gerado
- [ ] Banco de dados configurado
- [ ] OAuth (X) configurado
- [ ] Upstash Redis configurado (se aplicável)
- [ ] Build validado

### ⚠️ O que ainda precisa ser feito:
- Listar variáveis de ambiente não preenchidas
- Listar serviços não configurados
- Próximos passos recomendados

### 🔗 Links úteis:
- Documentação: `docs/`
- Guias para iniciantes: `docs/GUIA_INICIANTE_PT.md`
- Setup de serviços: `docs/setup/`

---

## 🚫 O que NUNCA deve ser feito

- ❌ Commitar arquivo `.env` (já está no `.gitignore`)
- ❌ Assumir valores de configuração sem perguntar
- ❌ Pular validações de pré-requisitos
- ❌ Executar comandos destrutivos sem confirmação
- ❌ Expor credenciais no relatório final
- ❌ **SUGERIR OU FAZER MUDANÇAS NO CANVAS** - ÁREA CRÍTICA E SENSÍVEL
  - Não modificar arquivos em `components/canvas/`
  - Não modificar arquivos em `lib/canvas/`
  - Não alterar lógica de renderização
  - Não alterar temas visuais
  - Não alterar componentes do canvas
  - **O CANVAS requer supervisão manual e não deve ser alterado automaticamente**

---

## 📁 Estrutura de Arquivos

```
projeto/
├── .env                    # Criado pelo driver (NUNCA commitar)
├── package.json            # Já existe
├── prisma/
│   └── schema.prisma       # Schema do banco
└── docs/
    └── DRIVERS/
        └── SETUP/
            └── ENVIRONMENT_SETUP_DRIVER.md  # Este arquivo
```

---

## 🔗 Referências

- Guia Completo para Iniciantes: `docs/GUIA_INICIANTE_PT.md`
- Setup do Upstash: `docs/setup/UPSTASH_SETUP.md`
- Setup do GitHub: `docs/setup/GITHUB_SETUP.md`
- README Principal: `README.md`

---

## 📝 Notas Finais

- Este driver pode ser executado múltiplas vezes (idempotente)
- Variáveis já configuradas não serão sobrescritas sem confirmação
- O driver valida cada etapa antes de prosseguir
- Sempre gera relatório completo ao final

---

**Última atualização:** 2025-01-20

