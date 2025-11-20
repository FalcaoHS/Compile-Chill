🧼 Manutenção e Higienização da Arquitetura — Guia Oficial

Autor: Hudson "Shuk" Falcão
Data: 19/11/2025
Versão: 2.1
Motivo: Garantir que todas as funcionalidades implementadas e planejadas estejam organizadas, documentadas e coerentes com a arquitetura geral do projeto — preparando terreno para contribuidores, novos temas, otimizações e expansão futura.

⚠️ **CRÍTICO: ANTES de executar este driver, o agente DEVE ler:**
- `docs/DRIVERS/TOKEN_MANAGEMENT.md` - Gerenciamento de tokens (OBRIGATÓRIO)
- Este arquivo contém regras sobre consumo de tokens e modo leve
- O agente DEVE informar sobre tokens e perguntar sobre plano antes de executar

🎯 Como funciona

Este documento é um DRIVER para manter e organizar a arquitetura do Compile & Chill usando IA ou revisão manual.
Basta fornecer este documento completo para um agente de IA.
O agente irá:

✅ Revisar toda a estrutura de pastas e arquivos
✅ Identificar arquivos fora do lugar ou com nomes incorretos
✅ Verificar e corrigir referências quebradas
✅ Organizar módulos conforme a arquitetura recomendada
✅ Criar/atualizar documentação técnica
✅ Padronizar nomes e convenções
✅ Validar que tudo está alinhado

🤖 IMPORTANTE: Instruções para o Agente de IA

**⚠️ REGRAS OBRIGATÓRIAS - O AGENTE DEVE SEGUIR EXATAMENTE:**

0. **O agente DEVE ler TOKEN_MANAGEMENT.md ANTES de executar!**
   - SEMPRE ler `docs/DRIVERS/TOKEN_MANAGEMENT.md` primeiro
   - SEMPRE informar sobre consumo estimado de tokens (~15.000-30.000 tokens modo completo)
   - SEMPRE perguntar sobre plano (pago/free)
   - SEMPRE oferecer modo leve (~5.000-10.000 tokens, redução ~60-70%)
   - NUNCA executar sem informar sobre tokens
   - NUNCA ignorar preocupações do usuário sobre consumo

1. **O agente DEVE fazer perguntas antes de mover/reorganizar arquivos!**
   - NUNCA mover arquivos sem perguntar primeiro
   - NUNCA assumir o que o usuário quer
   - SEMPRE perguntar antes de executar qualquer ação de reorganização

2. **O agente DEVE analisar completamente antes de agir!**
   - SEMPRE mapear todos os arquivos primeiro
   - SEMPRE identificar problemas antes de corrigir
   - NUNCA fazer mudanças sem entender o contexto completo

3. **O agente DEVE verificar referências antes de mover arquivos!**
   - SEMPRE verificar imports e referências
   - SEMPRE atualizar referências quebradas
   - NUNCA mover arquivos sem atualizar referências

4. **O agente DEVE seguir o fluxo completo!**
   - Não pular nenhuma etapa
   - Não assumir respostas
   - Sempre aguardar confirmação do usuário
   - Sempre gerar relatório das mudanças

**O agente NUNCA deve:**
- ❌ Mover arquivos sem perguntar primeiro
- ❌ Reorganizar sem analisar completamente
- ❌ Quebrar referências ao mover arquivos
- ❌ Pular etapas de validação
- ❌ Assumir o que o usuário quer
- ❌ Fazer mudanças sem gerar relatório

🔄 AUTO-ATUALIZAÇÃO: Melhoria Contínua dos Drivers

**⚠️ REGRA CRÍTICA - O agente DEVE auto-atualizar este driver quando necessário:**

1. **O agente DEVE identificar problemas e melhorias:**
   - Quando o usuário tiver dúvidas sobre a reorganização
   - Quando o usuário reclamar de arquivos movidos incorretamente
   - Quando o agente identificar padrões de problemas recorrentes
   - Quando houver ambiguidade sobre onde arquivos devem ficar

2. **O agente DEVE atualizar este driver:**
   - Adicionar regras na seção "REGRAS OBRIGATÓRIAS"
   - Adicionar exemplos claros de estrutura recomendada
   - Adicionar validações na checklist pós-organização
   - Incrementar versão do driver (ex: 2.0 → 2.1)
   - Documentar a mudança no histórico

3. **O agente DEVE seguir este processo:**
   ```
   a) Identificar o problema/dúvida/reclamação sobre organização
   b) Entender a causa (ex: estrutura não clara, falta de validação)
   c) Propor solução (ex: adicionar exemplo, regra explícita)
   d) Perguntar: "Identifiquei um problema na organização. Posso atualizar o Architecture Hygiene Driver para evitar que isso aconteça novamente?"
   e) Se autorizado, atualizar o driver
   f) Documentar: "📝 Histórico: [Data] - [Problema] - [Solução]"
   ```

4. **Exemplos de situações que requerem atualização:**
   - Usuário: "Por que você moveu X para Y?" → Adicionar regra clara sobre onde X deve ficar
   - Usuário: "Isso quebrou minhas referências" → Adicionar validação obrigatória de referências
   - Agente move arquivo para lugar errado → Adicionar exemplo na estrutura recomendada
   - Dúvida sobre onde colocar novo tipo de arquivo → Adicionar na seção de estrutura

5. **Formato de atualização:**
   - **Regra** → Adicionar em "REGRAS OBRIGATÓRIAS"
   - **Estrutura** → Atualizar seção "Estrutura Recomendada" com exemplo
   - **Validação** → Adicionar na "Checklist de Validação Pós-Organização"
   - **Versão** → Incrementar (2.0 → 2.1)

**Exemplo prático:**
```
Situação: Usuário reclama "você moveu os testes mas quebrou os imports"

Ação do agente:
1. Identifica: Falta validação de imports após mover arquivos
2. Atualiza driver:
   - Adiciona em "REGRAS OBRIGATÓRIAS": "5. O agente DEVE verificar e atualizar TODOS os imports após mover arquivos!"
   - Adiciona na checklist: "- [ ] Todos os imports foram atualizados após mover arquivos"
   - Incrementa versão: 2.0 → 2.1
   - Adiciona histórico: "📝 20/11/2025 - Adicionada validação obrigatória de imports após mover arquivos"
```

**Fluxo esperado (OBRIGATÓRIO seguir):**
1. O agente analisa estrutura atual completamente
2. O agente identifica problemas e arquivos fora do lugar
3. O agente pergunta ao usuário sobre as mudanças propostas
4. O agente reorganiza arquivos (se autorizado)
5. O agente atualiza referências quebradas
6. O agente cria/atualiza documentação
7. O agente valida que tudo está alinhado
8. O agente gera relatório completo das mudanças

---

Ao processar este driver, o agente DEVE:

1. **Analisar estrutura atual**:
   - Mapear todos os arquivos e pastas
   - Identificar arquivos fora do lugar
   - Detectar nomes incorretos ou inconsistentes
   - Verificar referências quebradas

2. **Reorganizar arquivos** (se necessário):
   - Mover arquivos para pastas corretas
   - Corrigir nomes de arquivos (kebab-case)
   - Remover pastas vazias
   - Consolidar código duplicado

3. **Criar/atualizar documentação**:
   - Criar docs técnicas faltantes
   - Atualizar READMEs
   - Adicionar comentários JSDoc onde necessário
   - Garantir que docs estão atualizadas

4. **Validar estrutura**:
   - Verificar que todos os módulos estão organizados
   - Confirmar que convenções estão sendo seguidas
   - Garantir que não há referências quebradas
   - Validar que a arquitetura está coerente

5. **Gerar relatório**:
   - Listar mudanças feitas
   - Documentar decisões de organização
   - Criar checklist de validação

🔍 1. Estrutura de Pastas — Diagnóstico & Recomendação

### ✅ Estrutura Atual Detectada

```
app/
  api/
    auth/
    scores/
    users/
    stats/
  jogos/
  profile/
components/
  games/
  profile/
  rankings/
  hacker-panel/
lib/
  canvas/
    drops/
    emotes/
    hacker-panel/
  performance/
  physics/
  games/
  game-validators/
hooks/
```

### ❗ Problemas Comuns Após Muitas Features

- Arquivos de canvas misturados em locais diferentes
- Engines e managers separados (physics, drops, emotes) em pastas inconsistentes
- Duplicação leve de lógica
- Modelos de tema espalhados
- Faltam docs por pasta
- Alguns arquivos cresceram demais (DevOrbsCanvas.tsx)

### ✅ Reorganização Sugerida (não quebra nada)

```
/lib
  /auth
    auth.ts
    auth-adapter.ts
    auth-env-validation.ts
    middleware-auth.ts
  /canvas
    /core
      render-loop.ts
      background-renderer.ts
      orb-renderer.ts
    /physics
      orbs-engine.ts
      collisions.ts
    /decorative-objects
      theme-objects.ts
      object-renderer.ts
    /orb-renderers
      theme-orb-variations.ts
      indiana-jones-orb.ts
      star-wars-orb.ts
    /effects
      fireworks.ts
      particles.ts
    /drops
      Drop.ts
      DropManager.ts
      drop-config.ts
    /emotes
      EmoteRenderer.ts
      EmoteManager.ts
      emote-types.ts
    /hacker-panel
      log-generator.ts
  /performance
    fps-guardian.ts
    mobile-mode.ts
    particle-budget.ts
    canvas-crash-resilience.ts
    multi-tab.ts
    session-stability.ts
  /theme
    themes.ts
    theme-store.ts
    theme-utils.ts
    /themes (se necessário separar por arquivo)
  /games
    (manter estrutura atual)
  /game-validators
    (manter estrutura atual)
  /utils
    rate-limit.ts
    api-errors.ts
    api-rate-limit.ts

/components
  /canvas
    DevOrbsCanvas.tsx
    DropsCanvas.tsx
  /ui
    ThemeSwitcher.tsx
    Toast.tsx
    GameCard.tsx
  /profile
    (manter estrutura atual)
  /games
    (manter estrutura atual)
  /layout
    Header.tsx
    Footer.tsx

/hooks
  useDrops.ts
  useEmotes.ts
  useSafeScore.ts
  useHackerPanel.ts
```

### Benefícios

- Entra colaborador → entende tudo em 10 min
- Novo tema → só mexe em `/lib/theme` e `/lib/canvas`
- Orbs, objetos, partículas → organizados
- DevOrbsCanvas pode ficar limpo (delegate para handlers)

⚙️ 2. Documentação que Precisa ser Criada/Ajustada

### ☑ Criar em `/docs/`

- [ ] `docs/architecture/canvas-architecture.md` - Arquitetura do sistema Canvas
- [ ] `docs/architecture/performance-engine.md` - Sistema de performance
- [ ] `docs/architecture/physics-system.md` - Sistema de física
- [ ] `docs/architecture/auth-flow.md` - Fluxo de autenticação
- [ ] `docs/architecture/scores-anti-cheat.md` - Sistema de scores e anti-cheat
- [ ] `docs/architecture/mobile-modes.md` - Modos mobile (lite/full)
- [ ] `docs/contributing.md` - Guia de contribuição (atualizar)
- [ ] `docs/theme-style-guide.md` - Guia de estilo para temas

### Faltam Explicações Técnicas para:

- FPS Guardian
- Mobile Mode (lite/full)
- Particle Budget (global)
- Fireworks Manager
- Decorative Objects System
- Orb Variations System
- Drops Engine
- Emotes Bubble Engine
- Easter Egg System
- Multi-tab Protection
- Safe Score System
- Canvas Crash Resilience

**Estas docs são essenciais para contribuidores.**

🧮 3. Módulos que Precisam de Alinhamento ou Limpeza

### 🔥 Canvas (o mais complexo)

**Problema**: `DevOrbsCanvas.tsx` está muito grande

**Solução**: Separar em submódulos:

- Render loop → `/lib/canvas/core/render-loop.ts`
- Physics update → `/lib/canvas/physics/orbs-engine.ts`
- Background decorator → `/lib/canvas/core/background-renderer.ts`
- Orb renderer → `/lib/canvas/core/orb-renderer.ts`
- Fireworks → `/lib/canvas/effects/fireworks.ts`
- Drops → já organizado em `/lib/canvas/drops/`
- Emotes → já organizado em `/lib/canvas/emotes/`
- Theme objects → `/lib/canvas/decorative-objects/theme-objects.ts`
- Event triggers → `/lib/canvas/core/event-triggers.ts`

### 🧠 Themes

**Padronização necessária**:

- Todos os temas devem estar em `/lib/theme/themes.ts` (ou separados em `/lib/theme/themes/*.ts`)
- Padronizar estrutura:
  - `id` (kebab-case)
  - `colors` (objeto padronizado)
  - `orb variations` (se aplicável)
  - `objects` (decorative objects)
  - `effects` (efeitos especiais)
  - `easter eggs` (se aplicável)

### 🚀 Drops & Emotes

**Status**: Já organizados, mas verificar:

- [ ] Classes estão em `/lib/canvas/drops/` e `/lib/canvas/emotes/`
- [ ] Documentação está completa
- [ ] Tipos estão exportados corretamente

### 👤 Auth

**Ações necessárias**:

- [ ] Criar doc com callback flow
- [ ] Revisar signIn callback
- [ ] Implementar logging de falhas (se não existir)

### 🏅 Scores

**Documentação necessária**:

- [ ] Explicar safe-score-system
- [ ] Documentar retry logic
- [ ] Explicar local fallback
- [ ] Documentar anti-cheat rules

### ⚡ Performance

**Ações necessárias**:

- [ ] Criar doc única para mobile-mode + fps-guardian + particle-budget
- [ ] Padronizar thresholds
- [ ] Garantir que estão sendo chamados no lugar certo

🛡️ 4. Pontos que Devem ser Revisados no Código

### 🔧 1. Rate Limiting

**Ação**: Garantir todos os endpoints sensíveis usam rate limiter:

- [ ] `/api/scores` - usar rate limiter
- [ ] `/api/auth` - usar rate limiter
- [ ] `/api/users/recent` - usar rate limiter
- [ ] `/api/stats` - usar rate limiter

**Solução**: Criar `/lib/rate-limit.ts` centralizado (já existe, verificar uso)

### 🔧 2. Session Stability

**Status**: NextAuth database sessions → ok

**Melhorias sugeridas**:

- [ ] Implementar auto-renew
- [ ] Aviso no toast se expirar
- [ ] Retry automático

### 🔧 3. Multi-tab Protection

**Verificar**: Se BroadcastChannel está integrado em:

- [ ] DevOrbsCanvas
- [ ] Drops
- [ ] Emotes

**Arquivo**: `/lib/performance/multi-tab.ts` (já existe, verificar integração)

### 🔧 4. Canvas Crash Resilience

**Garantir**:

- [ ] try/catch em todos os loops de render
- [ ] Fallback estático se canvas falhar
- [ ] Contador de falhas

**Arquivo**: `/lib/performance/canvas-crash-resilience.ts` (já existe, verificar uso)

⭐ 5. Ajustes Recomendados na Documentação Atual

### Você deve atualizar:

#### `/README.md`

**Adicionar**:

- Features principais
- Como rodar
- Como contribuir
- Links das docs

#### `/docs/contributing.md`

**Precisa de**:

- Como criar temas
- Como criar jogos
- Como adicionar Easter Eggs
- Como fazer commit organizado

🧭 6. Arquivos que Devem ser Movidos

### Para `/lib/canvas/core/`:

- [ ] Loop principal do DevOrbsCanvas
- [ ] Funções de render (drawBackground, drawOrbs, etc.)
- [ ] Event triggers (baskets, rim hits, ground hits)

### Para `/lib/canvas/physics/`:

- [ ] `orbs-engine.ts` (já existe, verificar se está completo)
- [ ] `collisions.ts` (criar se não existir)

### Para `/lib/canvas/decorative-objects/`:

- [ ] Objetos por tema
- [ ] Funções `drawXThemeObject`

### Para `/lib/canvas/orb-renderers/`:

- [ ] Funções `drawThemeOrb`
- [ ] Variações de orbs por tema
- [ ] Efeitos especiais de orbs

### Para `/lib/performance/`:

- [ ] `fps-guardian.ts` (já existe)
- [ ] `mobile-mode.ts` (já existe)
- [ ] `particle-budget.ts` (já existe)
- [ ] Verificar se há funções throttle/utilities que devem estar aqui

🧼 7. Coisas que Devem ser Padronizadas

### Convenções de Nomenclatura

- [ ] **Temas**: kebab-case (`indiana-jones`, `star-wars`)
- [ ] **Funções**: camelCase (`drawThemeOrb`, `handleCollision`)
- [ ] **Arquivos**: kebab-case (`theme-utils.ts`, `fps-guardian.ts`)
- [ ] **Componentes**: PascalCase (`DevOrbsCanvas.tsx`, `ThemeSwitcher.tsx`)
- [ ] **Exports**: Usar named exports (evitar default exports)
- [ ] **Comentários**: JSDoc para funções públicas

### Estrutura de Código

- [ ] Imports organizados (externos → internos → relativos)
- [ ] Tipos TypeScript bem definidos
- [ ] Interfaces documentadas
- [ ] Funções pequenas e focadas

🚀 8. Checklist de Validação Pós-Organização

Após o agente organizar a arquitetura, verificar:

- [ ] Todos os arquivos estão nas pastas corretas
- [ ] Nomes de arquivos seguem padrão kebab-case
- [ ] Nomes de funções seguem padrão camelCase
- [ ] Componentes seguem padrão PascalCase
- [ ] Não há referências quebradas
- [ ] Documentação está atualizada
- [ ] READMEs estão completos
- [ ] Imports estão corretos
- [ ] Tipos TypeScript estão definidos
- [ ] Não há código duplicado
- [ ] Pastas vazias foram removidas
- [ ] Convenções estão sendo seguidas

🔗 Referências Úteis

- Estrutura atual: `lib/`, `components/`, `hooks/`
- Documentação de temas: `docs/DRIVERS/THEME_CREATION/THEME_CREATION_DRIVER.md`
- Especificações: `agent-os/specs/`
- Performance: `lib/performance/`
- Canvas: `lib/canvas/`

📝 Histórico de Atualizações

**Versão 2.1 (20/11/2025):**
- Adicionada seção de AUTO-ATUALIZAÇÃO para melhoria contínua dos drivers
- Instruções para o agente auto-atualizar o driver quando identificar problemas ou receber feedback do usuário
- Exemplos práticos de como atualizar o driver baseado em feedback sobre organização

**Versão 2.0 (19/11/2025):**
- Versão inicial do Architecture Hygiene Driver

📋 Conclusão

A arquitetura do Compile & Chill está no caminho certo.

Mas agora, com:
- 10+ jogos
- 12+ temas
- Canvas avançado
- Física
- Drops
- Emotes
- Easter eggs
- Mobile mode
- FPS guardian
- Score system
- Performance engine

…o projeto precisa de:

✅ **Organização** - Arquivos no lugar certo
✅ **Docs** - Documentação técnica completa
✅ **Padronização** - Convenções consistentes

Este driver garante que tudo fique organizado e pronto para crescimento futuro.

