# Spec Requirements: Session Isolation Security Fix

## Initial Description

**PROBLEMA CRÍTICO DE SEGURANÇA REPORTADO:**

Vazamento de sessão entre usuários em produção. Quando um usuário (bruno C# de burro) acessou a aplicação e o desenvolvedor deu refresh, ele estava logado na conta desse usuário. Isso indica falha no isolamento de sessões entre usuários.

**Contexto do Incidente:**
- Ambiente: Vercel (Production)
- Domínio: compileandchill.dev
- Usuário afetado identificado: "bruno C# de burro" 
- Ação tomada: Projeto foi derrubado imediatamente por segurança
- Frequência: Ocorreu uma vez, não foi possível reproduzir (servidor foi derrubado)
- Status atual: Aplicação está offline

## Requirements Discussion

### First Round Questions

**Q1:** Quando este problema ocorreu, você estava usando qual ambiente de produção? Assumo que seja SquareCloud (conforme tech-stack). Você tem certeza de que a variável de ambiente `NEXTAUTH_SECRET` está configurada corretamente lá, ou ela pode estar ausente/compartilhada entre instâncias?

**Answer:** Vercel (não SquareCloud). `NEXTAUTH_SECRET` estava configurada corretamente com chave criptografada.

**Q2:** O problema aconteceu apenas **uma vez** ou você conseguiu reproduzir múltiplas vezes? Assumo que foi um caso isolado, mas preciso confirmar se é intermitente ou consistente.

**Answer:** Aconteceu uma vez e o servidor foi derrubado por receio. Não foi reproduzido.

**Q3:** Quando você deu refresh e viu a conta do outro usuário, você conseguiu identificar **qual usuário era**? Assumo que sim - você tem os logs ou IDs desses usuários para rastrear a sessão no banco de dados?

**Answer:** Sim, identificado como "bruno C# de burro". Verificou o perfil dele no X e confirmou. Não tem logs porque não verificou antes de derrubar.

**Q4:** Você está usando algum **sistema de cache** em produção (Redis, Upstash, ou cache do próprio SquareCloud)? Assumo que não, mas se estiver usando, isso pode estar causando compartilhamento de sessões em memória.

**Answer:** Sim, Upstash + Redis.

**Q5:** Quantas **instâncias da aplicação** estão rodando em produção no SquareCloud? Assumo que seja apenas uma instância, mas se for múltiplas, o problema pode estar relacionado a sessões não sincronizadas entre instâncias.

**Answer:** Apenas 1 instância na Vercel.

**Q6:** Você verificou se o problema pode estar relacionado a **cookies sendo compartilhados**? Por exemplo, o cookie `next-auth.session-token` pode estar sem a flag `Secure` ou `SameSite` adequada, ou o domínio pode estar incorreto.

**Answer:** Não verificou.

**Q7:** O código em produção é **exatamente o mesmo** que está no git status mostrado (com todas essas modificações não commitadas)? Assumo que pode ter diferenças, e isso é crítico para entender o problema.

**Answer:** Sim, o código em produção é o mesmo.

**Q8:** Você tem **logs da aplicação em produção** mostrando as chamadas de `createSession` e `getUser`? Os console.logs no código (linhas 221, 233, 259 do `auth-adapter.ts`) devem ter capturado informações sobre qual sessão foi criada para qual usuário.

**Answer:** Não tem logs.

**Q9:** Há algum código de **desenvolvimento/debug** rodando em produção que pode estar causando este problema? Por exemplo, os arquivos de script em `scripts/delete-all-users.ts` ou qualquer outra funcionalidade de admin?

**Answer:** Não sabe.

**Q10:** O problema aconteceu logo após um **deploy** ou durante uso normal da aplicação já estável em produção? Assumo que foi após deploy, o que pode indicar problema de configuração.

**Answer:** Durante uso normal, aplicação já estava em produção.

### Follow-up Questions

**Follow-up 1:** Na Vercel, você configurou **`NEXTAUTH_SECRET`** ou **`AUTH_SECRET`** (ou ambos)? O `auth.config.ts` (linha 9) aceita ambos, mas preciso confirmar qual você configurou e se o valor é **único e forte** (não é algo simples como "secret123").

**Answer:** Configurado certinho, chave criptografada.

**Follow-up 2:** Na Vercel, você configurou essas variáveis para **todos os ambientes** (Production, Preview, Development) ou apenas para Production? Se configurou para múltiplos ambientes, **são valores diferentes ou o mesmo valor**?

**Answer:** Production apenas.

**Follow-up 3:** Você está usando um **domínio customizado** na Vercel ou está usando o domínio padrão `.vercel.app`? O problema de sessão pode estar relacionado a cookies com domínio incorreto ou compartilhado.

**Answer:** Domínio customizado: compileandchill.dev

**Follow-up 4:** Você configurou alguma variável de ambiente relacionada a **`NEXTAUTH_URL`** na Vercel? Esta variável é crítica para o NextAuth funcionar corretamente em produção.

**Answer:** Sim, está configurada.

**Follow-up 5:** O banco de dados PostgreSQL que você está usando na Vercel é o **mesmo banco** que você usa em desenvolvimento local, ou é um banco separado para produção? Se for o mesmo, pode haver conflito de sessões.

**Answer:** Bancos separados (prod/dev).

**Follow-up 6:** Após o incidente, você verificou a tabela **`Session`** no banco de dados para ver quantas sessões existem, se há sessões duplicadas, se a sessão do "bruno C# de burro" ainda existe, ou se há alguma sessão sem `userId` ou com `userId` incorreto?

**Answer:** Não verificou, mas pode verificar agora.

**Follow-up 7:** Você configurou **o mesmo Upstash Redis** para desenvolvimento e produção, ou são instâncias separadas? Se for o mesmo, os prefixes (`@ratelimit/...`) são diferentes para cada ambiente?

**Answer:** Não está usando Redis localmente (só em prod).

**Follow-up 8:** Há alguma possibilidade de ter código que **cache dados de usuário no Redis** além do rate limiting? Por exemplo, algum código customizado que você não me mostrou?

**Answer:** Acha que não.

**Follow-up 9:** Você consegue me passar os **logs do Vercel** do momento em que o problema ocorreu? Especificamente logs da rota `/api/auth/session`, `/api/auth/callback/twitter`, ou qualquer erro relacionado a sessões?

**Answer:** Não tem logs.

**Follow-up 10:** Quando você "derrubou o server", você apenas pausou o deployment na Vercel ou você **deletou todas as sessões do banco de dados** também? As sessões antigas ainda podem estar no banco.

**Answer:** Deletou o projeto inteiro da Vercel.

**Follow-up 11:** O código atualmente em produção **ainda tem aquele problema** ou você já fez alguma mudança que pode ter corrigido? Você consegue reproduzir o problema agora em produção?

**Answer:** Está offline (projeto foi deletado).

**Follow-up 12:** Há algum outro usuário que reportou problema similar, ou foi apenas este caso isolado com você e o "bruno C# de burro"?

**Answer:** Apenas um caso, derrubou logo ao identificar.

## Existing Code to Reference

**Similar Features Identified:**
- Auth system completo já implementado com NextAuth + Twitter OAuth
- Sistema de adapter customizado em `lib/auth-adapter.ts`
- Middleware de autenticação em `lib/middleware-auth.ts`
- Sistema de rate limiting com Upstash Redis em `lib/rate-limit.ts`
- Sistema de sessão stability em `lib/performance/session-stability.ts`

**Backend logic to reference:**
- `auth.config.ts` - Configuração NextAuth com callbacks críticos
- `auth.ts` - Exportação das funções NextAuth
- `lib/auth-adapter.ts` - Adapter customizado com lógica de criação de sessões
- `lib/api-auth.ts` - Wrapper de autenticação para API routes
- `middleware.ts` - Middleware de segurança
- `lib/rate-limit.ts` - Cliente Upstash Redis para rate limiting

## Visual Assets

No visual assets provided.

## Requirements Summary

### Functional Requirements

**AUDITORIA DE SEGURANÇA COMPLETA:**

1. **Isolamento de Sessões:**
   - Garantir que sessões sejam únicas por usuário
   - Verificar que `sessionToken` nunca seja compartilhado ou reutilizado
   - Validar que cookies sejam configurados corretamente com flags de segurança apropriadas
   - Confirmar que não há estado global ou cache compartilhado entre requisições de diferentes usuários

2. **Configuração de NextAuth:**
   - Auditar todas as configurações de sessão e cookies
   - Verificar configuração de `NEXTAUTH_SECRET` e `NEXTAUTH_URL`
   - Validar estratégia de sessão "database" e sua interação com Prisma
   - Revisar callbacks de `signIn`, `session`, e `redirect`

3. **Adapter Customizado:**
   - Revisar lógica de `createSession` para garantir unicidade de tokens
   - Verificar `getUserByAccount` para prevenir retorno de usuário errado
   - Validar que `createUser` não cria duplicatas
   - Auditar logs de criação de sessão (linhas 221-266 de `auth-adapter.ts`)

4. **Cookie Security:**
   - Configurar cookies com flags `Secure`, `HttpOnly`, `SameSite=Lax` ou `Strict`
   - Validar que domínio do cookie está correto para `compileandchill.dev`
   - Verificar que `__Secure-` prefix é usado em produção
   - Confirmar que cookies não são compartilháveis entre subdomínios indevidamente

5. **Banco de Dados:**
   - Adicionar constraints únicos na tabela `Session` para `sessionToken`
   - Adicionar índices para performance de lookup de sessões
   - Implementar cleanup automático de sessões expiradas
   - Validar integridade referencial entre `Session` e `User`

6. **Redis/Upstash:**
   - Verificar se há cache de dados de usuário além de rate limiting
   - Garantir que prefixes do Redis sejam adequados para prevenir colisões
   - Auditar uso de `@upstash/ratelimit` para prevenir vazamento de dados
   - Confirmar que nenhum dado sensível é cacheado

7. **Middleware:**
   - Revisar lógica de autenticação no middleware
   - Validar que rotas protegidas checam sessão corretamente
   - Verificar que middleware não cria condições de corrida com sessões
   - Garantir que `auth()` é chamado corretamente em cada requisição

8. **Logging e Monitoramento:**
   - Implementar logs estruturados de criação/atualização de sessões
   - Adicionar alertas para detecção de sessões duplicadas
   - Registrar IPs e user agents em sessões para auditoria
   - Criar dashboard de monitoramento de sessões ativas

### Reusability Opportunities

- Sistema de logging existente em `lib/performance/light-logging.ts`
- Sistema de error handling em `lib/api-errors.ts`
- Adapter pattern já usado em `lib/auth-adapter.ts`
- Middleware de segurança em `lib/security-headers.ts`

### Scope Boundaries

**In Scope:**
- Auditoria completa do sistema de autenticação
- Identificação de todos os vetores de vulnerabilidade de sessão
- Correções de segurança no NextAuth config
- Melhoria de configuração de cookies
- Implementação de constraints no banco de dados
- Adição de logging e monitoramento de sessões
- Testes de isolamento de sessões
- Documentação de segurança

**Out of Scope:**
- Migração para outro sistema de autenticação (mantém NextAuth)
- Implementação de autenticação multi-fator (MFA)
- Sistema de detecção de fraude ou anomalias avançado
- Auditoria de outras partes da aplicação não relacionadas a sessões
- Recuperação de dados perdidos do incidente (projeto foi deletado)

### Technical Considerations

**Vetores de Vulnerabilidade Identificados:**

1. **Configuração de Cookies (VETOR MAIS PROVÁVEL):**
   - ❌ **CRÍTICO:** Código NÃO TEM configuração explícita de cookies em `auth.config.ts`
   - ❌ NextAuth usa defaults que podem NÃO ser adequados para domínio customizado `compileandchill.dev`
   - ❌ Possível falta de flags `Secure`, `HttpOnly`, `SameSite=lax/strict`
   - ❌ Cookie domain pode estar incorreto (pode estar usando `.vercel.app` ao invés de `.compileandchill.dev`)
   - ❌ Cookie path pode estar incorreto se `NEXTAUTH_URL` não estiver configurado corretamente
   - **IMPACTO:** Cookies mal configurados podem ser lidos por requisições de diferentes usuários ou contextos

2. **Estratégia de Sessão "database" (VETOR DESCARTADO):**
   - ✅ Usa Prisma para armazenar sessões no PostgreSQL
   - ✅ **VERIFICADO:** Tabela sessions TEM UNIQUE constraint em `sessionToken` (`sessions_sessionToken_key`)
   - ✅ Race condition em `createSession` é PREVENIDA pelo UNIQUE constraint
   - ⚠️ Código verifica sessão existente mas isso é redundante (linhas 226-247)
   - ✅ **CONCLUSÃO:** Banco de dados NÃO é a causa do problema

3. **Adapter Customizado:**
   - Conversões entre string e int para `userId` (múltiplos pontos de falha)
   - Lógica complexa em `signIn` callback que atualiza usuários existentes
   - Possível criação de sessão antes de garantir usuário correto
   - Logs extensivos indicam que houve problemas anteriores (muitos console.logs)

4. **NextAuth Configuration:**
   - `session.strategy: "database"` com `maxAge: 30 days` e `updateAge: 24 hours`
   - Não há configuração explícita de `cookies` em `auth.config.ts`
   - Callback `session` faz query adicional ao banco (pode causar inconsistências)
   - Callback `signIn` tem lógica muito complexa com múltiplos updates

5. **Estado Global/Cache:**
   - Redis usado apenas para rate limiting (segundo desenvolvedor)
   - Zustand store usado para tema (localStorage, não compartilhado server-side)
   - Não identificado cache de sessão ou usuário além do NextAuth

6. **Possível Causa Raiz (Hipóteses ATUALIZADAS):**
   - 🔴 **Hipótese A (MAIS PROVÁVEL):** Cookie configurado com domínio incorreto (ex: `.vercel.app` ao invés de `.compileandchill.dev`) - **Falta configuração explícita de cookies**
   - ❌ **Hipótese B (DESCARTADA):** Race condition em `createSession` - **UNIQUE constraint no banco PREVINE isso**
   - 🟠 **Hipótese C (POSSÍVEL):** Callback `session` retornou usuário errado por bug em query ao banco
   - 🔴 **Hipótese D (PROVÁVEL):** `NEXTAUTH_URL` não estava correto para domínio customizado, causando cookie path/domain incorreto
   - 🟡 **Hipótese E (MENOS PROVÁVEL):** Middleware ou Edge runtime causou compartilhamento de contexto entre requisições

## Análise Forense do Banco de Dados

**Data da Análise:** 2025-11-19

**Banco Analisado:** Neon PostgreSQL - Projeto "compilechill" (empty-dream-20874112)

### Schema Verificado

**Tabela `sessions`:**
- ✅ UNIQUE constraint em `sessionToken` (`sessions_sessionToken_key`)
- ✅ FOREIGN KEY para `users(id)` com ON DELETE CASCADE
- ✅ Índices: sessions_pkey, sessions_sessionToken_key, sessions_userId_idx, sessions_sessionToken_idx
- ✅ Colunas: id (text), sessionToken (text), userId (integer), expires (timestamp)

**Tabela `users`:**
- ✅ UNIQUE constraint em `xId` (`users_xId_key`)
- ✅ PRIMARY KEY em `id`
- ✅ Índices: users_pkey, users_xId_key, users_xId_idx, users_id_idx
- ✅ Colunas: id (integer), name (text), avatar (text), xId (text), createdAt, updatedAt, showPublicHistory, theme, xUsername

### Estado Atual do Banco

```
Total de sessões: 0
Total de usuários: 0
Total de scores: 0
Total de accounts: 0
```

**Última migração:** `20251118185622_add_x_username` (2025-11-19 01:13:40)

**Observação:** Banco foi completamente limpo após o incidente. Não há dados para análise forense direta.

### Descoberta Crítica

**✅ O schema do banco de dados está CORRETO e NÃO é a causa do problema.**

A tabela `sessions` JÁ POSSUI UNIQUE constraint em `sessionToken`, o que significa:
- ❌ **Hipótese B DESCARTADA:** NÃO é possível ter sessionTokens duplicados no banco
- ❌ **Race condition no banco DESCARTADA:** O UNIQUE constraint previne isso
- ✅ **O problema DEVE estar na camada de aplicação ou cookies**

**Prioridade de Investigação (ATUALIZADA):**
1. 🔴 **CRÍTICO:** Adicionar configuração explícita de cookies no NextAuth config (FALTANDO!)
2. 🔴 **CRÍTICO:** Validar que NEXTAUTH_URL está configurado como `https://compileandchill.dev`
3. 🟠 **ALTO:** Simplificar callback `signIn` para reduzir complexidade
4. 🟠 **ALTO:** Adicionar logging estruturado de todas as operações de sessão
5. 🟠 **ALTO:** Implementar testes de isolamento de sessões
6. 🟡 **MÉDIO:** Revisar uso do Edge runtime vs Node runtime
7. 🟡 **MÉDIO:** Auditar todas as queries ao banco no fluxo de autenticação
8. ✅ **COMPLETO:** UNIQUE constraint em `Session.sessionToken` (JÁ EXISTE)

**Constraints Técnicos:**
- Deve manter NextAuth como sistema de autenticação
- Deve manter Twitter/X OAuth como único provider
- Deve manter Prisma como ORM
- Deve manter PostgreSQL como banco de dados
- Deve manter estratégia de sessão "database" (não JWT)
- Deve funcionar na Vercel com domínio customizado
- Deve ser compatível com Upstash Redis para rate limiting

**Requisitos de Testes:**
- Teste automatizado de isolamento de sessões (2 usuários simultâneos)
- Teste de concorrência (múltiplos logins simultâneos)
- Teste de refresh de página com sessão ativa
- Teste de expiração e renovação de sessão
- Teste de logout e criação de nova sessão
- Teste de múltiplas abas com mesmo usuário
- Teste de múltiplas abas com usuários diferentes
- Verificação manual em staging antes de produção

**Ambiente:**
- Production: Vercel
- Domínio: compileandchill.dev
- Database: PostgreSQL (separado prod/dev)
- Cache: Upstash Redis (apenas rate limiting)
- Instâncias: 1 apenas

