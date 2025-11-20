# 🎮 Game Creation Driver — Compile & Chill

Autor: Hudson "Shuk" Falcão  
Data: 20/11/2025  
Versão: 1.0  
Objetivo: Driver completo para criação de novos jogos no Compile & Chill, garantindo que todos os jogos sigam padrões de qualidade, integração com o sistema de pontuação, validação anti-cheat e experiência consistente.

⚠️ **CRÍTICO: ANTES de executar este driver, o agente DEVE ler:**
- `docs/DRIVERS/TOKEN_MANAGEMENT.md` - Gerenciamento de tokens (OBRIGATÓRIO)
- Este arquivo contém regras sobre consumo de tokens e modo leve
- O agente DEVE informar sobre tokens e perguntar sobre plano antes de executar
- **Este driver pode consumir ~15.000-25.000 tokens (modo completo) ou ~6.000-10.000 tokens (modo leve)**

🤖 IMPORTANTE: Instruções para o Agente de IA

**⚠️ REGRAS OBRIGATÓRIAS - O AGENTE DEVE SEGUIR EXATAMENTE:**

0. **O agente DEVE ler TOKEN_MANAGEMENT.md ANTES de executar!**
   - SEMPRE ler `docs/DRIVERS/TOKEN_MANAGEMENT.md` primeiro
   - SEMPRE informar sobre consumo estimado de tokens (~15.000-25.000 tokens modo completo)
   - SEMPRE perguntar sobre plano (pago/free)
   - SEMPRE oferecer modo leve (~6.000-10.000 tokens, redução ~60-70%)
   - NUNCA executar sem informar sobre tokens
   - NUNCA ignorar preocupações do usuário sobre consumo

1. **O agente DEVE fazer TODAS as perguntas antes de criar arquivos!**
   - NUNCA criar arquivos sem perguntar primeiro
   - NUNCA assumir o que o usuário quer
   - SEMPRE perguntar antes de executar qualquer ação
   - SEMPRE exemplificar respostas para dar insights ao colaborador

2. **O agente DEVE avaliar viabilidade antes de prosseguir!**
   - SEMPRE verificar se o jogo é viável tecnicamente
   - SEMPRE alertar sobre complexidade excessiva
   - NUNCA criar jogos impertinentes ou fora do tema
   - SEMPRE sugerir simplificações se necessário

3. **O agente DEVE seguir métricas existentes do sistema!**
   - SEMPRE usar sistema de pontuação balanceado
   - SEMPRE seguir padrões de ranking existentes
   - SEMPRE integrar com validação anti-cheat
   - NUNCA criar fórmulas de pontuação desbalanceadas

4. **O agente DEVE seguir o fluxo completo de perguntas!**
   - Não pular nenhuma etapa
   - Não assumir respostas
   - Sempre aguardar confirmação do usuário
   - Sempre gerar relatório das mudanças

**O agente NUNCA deve:**
- ❌ Criar arquivos sem perguntar primeiro
- ❌ Criar jogos sem avaliar viabilidade
- ❌ Ignorar métricas de pontuação existentes
- ❌ Criar fórmulas de pontuação desbalanceadas
- ❌ Pular etapas de validação
- ❌ Assumir o que o usuário quer
- ❌ Criar jogos fora do tema "desenvolvedor/dev"

**Fluxo esperado (OBRIGATÓRIO seguir):**
1. O agente lê TOKEN_MANAGEMENT.md e informa sobre tokens
2. O agente faz PERGUNTA 1: Conceito básico do jogo
3. O agente faz PERGUNTA 2: Mecânicas principais
4. O agente faz PERGUNTA 3: Viabilidade técnica
5. O agente faz PERGUNTA 4: Sistema de pontuação
6. O agente faz PERGUNTA 5: Integração com temas
7. O agente faz PERGUNTA 6: Validação anti-cheat
8. O agente faz PERGUNTA 7: Help/Instruções
9. O agente faz PERGUNTA 8: Estrutura de arquivos
10. O agente avalia tudo e pergunta se pode criar
11. O agente cria arquivos (se autorizado)
12. O agente gera relatório completo

🔄 AUTO-ATUALIZAÇÃO: Melhoria Contínua dos Drivers

**⚠️ REGRA CRÍTICA - O agente DEVE auto-atualizar este driver quando necessário:**

1. **O agente DEVE identificar problemas e melhorias:**
   - Quando o usuário tiver dúvidas sobre criação de jogos
   - Quando o usuário reclamar de algo no processo
   - Quando o agente identificar padrões de problemas recorrentes
   - Quando houver ambiguidade sobre como criar jogos

2. **O agente DEVE atualizar este driver:**
   - Adicionar regras na seção "REGRAS OBRIGATÓRIAS"
   - Adicionar perguntas na seção de perguntas se necessário
   - Adicionar exemplos na seção de exemplos
   - Incrementar versão do driver (ex: 1.0 → 1.1)
   - Documentar a mudança no histórico

3. **O agente DEVE seguir este processo:**
   ```
   a) Identificar o problema/dúvida/reclamação sobre criação de jogos
   b) Entender a causa (ex: falta de validação, pergunta ambígua)
   c) Propor solução (ex: adicionar validação, esclarecer pergunta)
   d) Perguntar: "Identifiquei um problema no processo de criação de jogos. Posso atualizar o Game Creation Driver para evitar que isso aconteça novamente?"
   e) Se autorizado, atualizar o driver
   f) Documentar: "📝 Histórico: [Data] - [Problema] - [Solução]"
   ```

4. **Exemplos de situações que requerem atualização:**
   - Usuário: "Por que você não perguntou sobre X?" → Adicionar pergunta sobre X
   - Usuário: "Isso não deveria ter sido criado assim" → Adicionar validação/regra
   - Agente cria jogo sem validar viabilidade → Adicionar checklist obrigatório
   - Dúvida sobre onde colocar arquivos → Adicionar exemplo mais claro

---

## 🎯 Como Funciona

Este driver guia a criação completa de novos jogos no Compile & Chill através de perguntas estruturadas e validações, garantindo que todos os jogos:

- ✅ Seguem padrões de qualidade
- ✅ Integram com sistema de pontuação
- ✅ Têm validação anti-cheat
- ✅ São temáticos para desenvolvedores
- ✅ Têm experiência consistente
- ✅ Estão bem documentados

---

## 📋 PERGUNTAS OBRIGATÓRIAS (Fluxo Completo)

### PERGUNTA 1: Conceito Básico do Jogo

**O agente DEVE perguntar:**

"Qual o conceito básico do jogo? Descreva em 2-3 frases o que o jogador faz."

**Exemplos de respostas (para dar insights):**
- ✅ "Jogo de memória onde o jogador precisa encontrar pares de comandos Git (git commit, git push, etc.)"
- ✅ "Runner infinito onde o personagem corre e precisa pular sobre bugs e coletar coffee cups"
- ✅ "Puzzle onde o jogador reorganiza blocos de código para formar funções válidas"
- ✅ "Jogo de estratégia onde o jogador roteia pacotes de rede conectando nós"

**O agente DEVE:**
- Anotar o conceito
- Verificar se está relacionado ao tema "desenvolvedor"
- Alertar se o conceito for muito genérico ou fora do tema
- Sugerir melhorias se necessário

**Validações:**
- [ ] Conceito está relacionado ao tema desenvolvedor/dev
- [ ] Conceito é claro e compreensível
- [ ] Conceito não é muito genérico
- [ ] Conceito é viável tecnicamente

---

### PERGUNTA 2: Mecânicas Principais

**O agente DEVE perguntar:**

"Como o jogo funciona? Descreva as mecânicas principais: controles, objetivos, condições de vitória/derrota."

**Exemplos de respostas (para dar insights):**
- ✅ "Controles: setas do teclado ou swipe. Objetivo: encontrar todos os pares. Vitória: encontrar todos os pares. Derrota: não há, é apenas tempo."
- ✅ "Controles: espaço para pular, setas para mover. Objetivo: correr o máximo possível. Vitória: sobreviver. Derrota: colidir com obstáculo."
- ✅ "Controles: drag and drop. Objetivo: organizar blocos. Vitória: completar nível. Derrota: tempo acabar."

**O agente DEVE:**
- Entender as mecânicas principais
- Identificar complexidade técnica
- Avaliar se é viável implementar
- Sugerir simplificações se muito complexo

**Validações:**
- [ ] Mecânicas são claras
- [ ] Mecânicas são viáveis tecnicamente
- [ ] Complexidade é razoável
- [ ] Não requer tecnologias não disponíveis

---

### PERGUNTA 3: Viabilidade Técnica

**O agente DEVE perguntar e avaliar:**

"Vamos avaliar a viabilidade técnica. O jogo requer:"
- Canvas/WebGL? (complexidade: alta)
- Física complexa? (complexidade: média-alta)
- Multiplayer? (complexidade: muito alta - geralmente não viável)
- Servidor dedicado? (complexidade: muito alta - geralmente não viável)
- Bibliotecas externas pesadas? (complexidade: média)

**O agente DEVE:**
- Avaliar cada requisito
- Alertar sobre complexidade alta
- Sugerir alternativas mais simples
- Perguntar se usuário quer simplificar

**Exemplos de avaliação:**
- ✅ "Jogo de memória simples - Viável ✅ (apenas React state)"
- ⚠️ "Jogo com física complexa - Viável mas complexo ⚠️ (requer Matter.js)"
- ❌ "Jogo multiplayer em tempo real - Não viável ❌ (requer servidor dedicado)"

**Se não viável:**
- O agente DEVE sugerir simplificações
- O agente DEVE perguntar se usuário quer adaptar
- O agente NUNCA deve criar jogo não viável sem alertar

---

### PERGUNTA 4: Sistema de Pontuação

**O agente DEVE perguntar:**

"Como será o sistema de pontuação? Você quer definir as regras ou prefere que eu gere baseado na lógica do jogo?"

**Opções:**
1. **Usuário define:** O agente pergunta detalhes e valida
2. **Agente gera:** O agente cria fórmula balanceada seguindo padrões

**Se usuário escolher "Agente gera":**

O agente DEVE criar fórmula seguindo estes padrões:

**Padrões de Pontuação (OBRIGATÓRIO seguir):**
- Base score: 100-500 pontos (dependendo da complexidade)
- Time bonus: 0-200% do base (capped, não dominante)
- Efficiency bonus: 0-50% do base (movimentos, precisão, etc.)
- Difficulty multiplier: baseado em níveis/dificuldade
- **NUNCA criar fórmulas onde time bonus domina 99% do score**
- **SEMPRE balancear: base + time + efficiency**

**Exemplo de fórmula balanceada:**
```typescript
// Base score
const baseScore = 200

// Time bonus (0-200% of base, capped)
const timeRatio = Math.min(1, (MAX_TIME - duration) / MAX_TIME)
const timeBonus = baseScore * 2 * timeRatio

// Efficiency bonus (0-50% of base)
const efficiencyRatio = optimalMoves / actualMoves
const efficiencyBonus = baseScore * 0.5 * efficiencyRatio

// Total
const score = Math.floor(baseScore + timeBonus + efficiencyBonus)
```

**Se usuário escolher "Eu defino":**

O agente DEVE perguntar:
- "Qual a pontuação base?"
- "Há bônus de tempo? Quanto?"
- "Há bônus de eficiência? Quanto?"
- "Há multiplicador de dificuldade? Como funciona?"

E então VALIDAR se está balanceado:
- ⚠️ Alertar se time bonus > 80% do score total
- ⚠️ Alertar se fórmula pode gerar scores muito altos (> 10.000)
- ⚠️ Alertar se fórmula pode gerar scores muito baixos (< 10)
- ✅ Sugerir ajustes se necessário

**Validações:**
- [ ] Fórmula está balanceada
- [ ] Time bonus não domina (> 80%)
- [ ] Score range é razoável (10 - 5.000 para jogos simples)
- [ ] Segue padrões do sistema

---

### PERGUNTA 5: Integração com Temas

**O agente DEVE perguntar:**

"O jogo deve integrar com o sistema de temas? (cores, estilos visuais variam conforme tema ativo)"

**Opções:**
1. **Sim, integração completa:** Cores, estilos, elementos visuais mudam com tema
2. **Sim, integração parcial:** Apenas cores básicas mudam
3. **Não, tema fixo:** Jogo tem seu próprio tema fixo

**Exemplos:**
- ✅ "Sim, completo - O jogo usa var(--color-primary), var(--color-bg), etc."
- ✅ "Sim, parcial - Apenas cores de fundo e texto"
- ✅ "Não - Jogo tem tema retro pixel fixo"

**O agente DEVE:**
- Se "Sim", garantir que usa CSS variables do tema
- Se "Não", garantir que tema não conflita com o site
- Documentar decisão

---

### PERGUNTA 6: Validação Anti-Cheat

**O agente DEVE perguntar:**

"O jogo precisa de validação anti-cheat específica? (ex: validar movimentos, tempo mínimo, etc.)"

**O agente DEVE:**
- Explicar que TODOS os jogos têm validação básica (score, duration, moves)
- Perguntar se há validações específicas necessárias
- Se sim, perguntar quais validações
- Criar validador em `lib/game-validators/[game-id].ts`

**Validações básicas (sempre incluídas):**
- Score é número positivo
- Duration é razoável (não negativo, não muito alto)
- Moves são razoáveis (se aplicável)
- GameState é válido (se enviado)

**Validações específicas (se necessário):**
- Movimentos são válidos (ex: não pode mover peça para lugar impossível)
- Tempo mínimo (ex: não pode completar em 0.1s)
- Sequência de ações válida
- Estado do jogo é alcançável

**O agente DEVE criar validador seguindo padrão:**
```typescript
import { GameValidator, ValidationResult } from "./types"

export const [gameId]Validator: GameValidator = {
  validate(submission, context) {
    // Validações básicas
    // Validações específicas
    // Retornar ValidationResult
  }
}
```

---

### PERGUNTA 7: Help/Instruções

**O agente DEVE perguntar:**

"Deseja criar uma seção de ajuda/instruções no jogo? Onde deve aparecer?"

**Opções:**
1. **Modal de ajuda:** Botão "?" abre modal com instruções
2. **Seção na página:** Instruções sempre visíveis
3. **Tooltip:** Dicas ao passar mouse
4. **Não precisa:** Jogo é auto-explicativo

**O agente DEVE:**
- Se "Sim", perguntar conteúdo das instruções
- Criar componente de Help se necessário
- Integrar na página do jogo

**Exemplo de conteúdo:**
- Como jogar (controles)
- Objetivo do jogo
- Como ganhar pontos
- Dicas e truques

---

### PERGUNTA 8: Estrutura de Arquivos

**O agente DEVE perguntar:**

"Onde você quer que eu crie os arquivos? Seguindo a estrutura padrão?"

**Estrutura padrão sugerida:**
```
lib/games/[game-id]/
  ├── game-logic.ts          (lógica principal)
  ├── game-logic.test.ts     (testes, opcional)
  └── [outros arquivos].ts   (lógica específica, se necessário)

components/games/[game-id]/
  ├── [GameName]Canvas.tsx   (componente principal)
  ├── ScoreDisplay.tsx       (exibição de score)
  ├── GameOverModal.tsx      (modal de game over)
  └── [outros componentes].tsx

app/jogos/[game-id]/
  └── page.tsx               (página do jogo)

lib/game-validators/
  └── [game-id].ts           (validador anti-cheat)
```

**O agente DEVE:**
- Confirmar estrutura
- Perguntar se quer criar testes
- Perguntar se quer componentes adicionais
- Listar todos os arquivos que serão criados

---

### PERGUNTA 9: Categoria e Metadados

**O agente DEVE perguntar:**

"Qual a categoria do jogo? (puzzle, arcade, memory, runner, idle, etc.)"

**Categorias disponíveis:**
- `puzzle` - Jogos de quebra-cabeça/lógica
- `arcade` - Jogos de ação rápida
- `memory` - Jogos de memória
- `runner` - Jogos de corrida infinita
- `idle` - Jogos idle/clicker
- `strategy` - Jogos de estratégia

**O agente DEVE também perguntar:**
- "Qual o nome do jogo?" (ex: "Terminal 2048")
- "Qual a descrição curta?" (ex: "Puzzle game com tiles temáticos")
- "Qual o ícone/emoji?" (ex: "🎮")
- "Qual o ID do jogo?" (kebab-case, ex: "terminal-2048")

**Validações:**
- [ ] ID é único (não existe em `lib/games.ts`)
- [ ] ID está em kebab-case
- [ ] Nome é descritivo
- [ ] Categoria existe

---

### PERGUNTA 10: Confirmação Final

**O agente DEVE listar TUDO que será criado:**

```
📋 Resumo do que será criado:

Arquivos de lógica:
- lib/games/[game-id]/game-logic.ts
- lib/games/[game-id]/[outros].ts

Componentes:
- components/games/[game-id]/[GameName]Canvas.tsx
- components/games/[game-id]/ScoreDisplay.tsx
- components/games/[game-id]/GameOverModal.tsx

Páginas:
- app/jogos/[game-id]/page.tsx

Validadores:
- lib/game-validators/[game-id].ts

Atualizações:
- lib/games.ts (adicionar jogo ao array GAMES)
- lib/game-validators/index.ts (registrar validador)

Deseja que eu crie tudo isso agora?
```

**O agente DEVE:**
- Aguardar confirmação explícita
- NUNCA criar sem confirmação
- Se "Não", perguntar o que ajustar

---

## 🎯 Padrões Obrigatórios

### Sistema de Pontuação

**Fórmula balanceada (OBRIGATÓRIO seguir):**
```typescript
// 1. Base Score (100-500 pontos)
const baseScore = 200 // Ajustar conforme complexidade

// 2. Time Bonus (0-200% of base, CAPPED)
const maxTime = 300 // 5 minutos
const timeRatio = Math.min(1, (maxTime - durationSeconds) / maxTime)
const timeBonus = baseScore * 2 * timeRatio // Máximo 2x base

// 3. Efficiency Bonus (0-50% of base)
const efficiencyRatio = optimalValue / actualValue
const efficiencyBonus = baseScore * 0.5 * efficiencyRatio

// 4. Difficulty Multiplier (se aplicável)
const difficultyMultiplier = level.difficulty || 1

// 5. Total Score
const score = Math.floor(
  (baseScore * difficultyMultiplier) + timeBonus + efficiencyBonus
)
```

**⚠️ NUNCA criar fórmulas onde:**
- Time bonus > 80% do score total
- Score pode ser > 10.000 (para jogos simples)
- Score pode ser < 10 (muito baixo)
- Fórmula é muito complexa ou confusa

### Estrutura de GameState

**Padrão mínimo (OBRIGATÓRIO incluir):**
```typescript
export interface GameState {
  // Estado do jogo
  [gameSpecificFields]: any
  
  // Campos obrigatórios
  score: number
  duration: number // em milissegundos
  gameOver: boolean
  startTime: number // timestamp
  
  // Campos opcionais mas recomendados
  moves?: number
  level?: number
  difficulty?: number
}
```

### Funções Obrigatórias

**Todas as lógicas de jogo DEVE ter:**
```typescript
// 1. Criar estado inicial
export function createInitialGameState(): GameState

// 2. Atualizar estado
export function updateGameState(state: GameState): GameState

// 3. Calcular pontuação
export function calculateScore(state: GameState): number

// 4. Obter dados para API
export function getScoreData(state: GameState): {
  score: number
  duration: number
  [outros campos]
}
```

### Integração com API

**O agente DEVE garantir que:**
- Score é enviado para `/api/scores` quando jogo termina
- Dados seguem formato `ScoreSubmissionInput`
- Validação anti-cheat é executada
- Erros são tratados graciosamente

---

## 🚫 O que NUNCA deve ser criado

**O agente NUNCA deve criar:**
- ❌ Jogos fora do tema "desenvolvedor/dev"
- ❌ Jogos com complexidade técnica inviável
- ❌ Jogos multiplayer em tempo real
- ❌ Jogos que requerem servidor dedicado
- ❌ Fórmulas de pontuação desbalanceadas
- ❌ Jogos sem validação anti-cheat
- ❌ Jogos sem integração com sistema de temas (a menos que explicitamente solicitado)
- ❌ Jogos sem documentação

---

## ✅ Checklist de Validação Final

Antes de criar os arquivos, o agente DEVE verificar:

**Conceito:**
- [ ] Conceito está relacionado ao tema desenvolvedor
- [ ] Conceito é claro e viável
- [ ] Mecânicas são compreensíveis

**Técnico:**
- [ ] Viabilidade técnica confirmada
- [ ] Complexidade é razoável
- [ ] Não requer tecnologias não disponíveis

**Pontuação:**
- [ ] Fórmula está balanceada
- [ ] Segue padrões do sistema
- [ ] Time bonus não domina
- [ ] Score range é razoável

**Integração:**
- [ ] Integra com sistema de temas (ou tema fixo definido)
- [ ] Integra com API de scores
- [ ] Tem validador anti-cheat
- [ ] Está registrado em `lib/games.ts`

**Estrutura:**
- [ ] Arquivos seguem estrutura padrão
- [ ] Nomes seguem convenções (kebab-case)
- [ ] Componentes estão organizados
- [ ] Testes criados (se solicitado)

**Documentação:**
- [ ] Help/instruções criadas (se solicitado)
- [ ] Código está comentado
- [ ] Funções têm JSDoc

---

## 📝 Histórico de Atualizações

**Versão 1.0 (20/11/2025):**
- Versão inicial do Game Creation Driver
- Fluxo completo de 10 perguntas obrigatórias
- Padrões de pontuação e validação
- Integração com sistema existente

---

## 🔗 Referências

- Sistema de jogos: `lib/games.ts`
- Validadores: `lib/game-validators/`
- Exemplos de jogos: `lib/games/*/game-logic.ts`
- Componentes: `components/games/*/`
- Páginas: `app/jogos/*/page.tsx`
- Token Management: `docs/DRIVERS/TOKEN_MANAGEMENT.md`

---

## 🚀 Conclusão

Este driver garante que todos os jogos criados no Compile & Chill:

- ✅ Seguem padrões de qualidade
- ✅ Integram corretamente com o sistema
- ✅ Têm pontuação balanceada
- ✅ Têm validação anti-cheat
- ✅ São temáticos e consistentes
- ✅ Estão bem documentados

**Lembre-se:**
- O agente DEVE fazer TODAS as perguntas antes de criar
- O agente DEVE avaliar viabilidade
- O agente DEVE seguir padrões de pontuação
- O agente DEVE gerar relatório completo ao final

**Localização deste arquivo:**
- `/docs/DRIVERS/GAME_CREATION/GAME_CREATION_DRIVER.md`
- Linkar no README principal

