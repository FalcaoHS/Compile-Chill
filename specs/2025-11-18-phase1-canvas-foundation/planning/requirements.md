# Spec Requirements: Fase 1 - Canvas Foundation

## Initial Description

Quero criar a Fase 1 do meu portal, 100% usando Canvas + CSS, sem nenhuma imagem externa.

Apenas formas geométricas, texto, gradientes, glow, sombras e efeitos procedurais.

As 4 features são: Drops, Física da Home + Shake, Emotes Dev, Painel Hacker Realtime.

## Requirements Discussion

### First Round Questions

**Q1:** Sistema de Drops - Integração com Física Existente: Vejo que você já tem `DevOrbsCanvas` com física Matter.js. Os drops devem usar a mesma engine Matter.js ou uma física procedural simples (apenas gravidade/bounce)? Assumo que devem ficar em um canvas separado acima do DevOrbs, mas renderizados no mesmo viewport. Está correto?

**Answer:** Os Drops NÃO devem usar Matter.js. Eles devem usar física procedural simples, independente da física das DevOrbs. Por quê? Mais leves, mais fáceis de controlar, drops não precisam de colisão precisa, não interferem com a engine Matter já em uso no DevOrbsCanvas. Estrutura correta: Canvas separado, renderizado por cima do DevOrbsCanvas, mesmo viewport (mesma área da Home), física própria (gravidade, bounce simples, rotação, timeout, clique).

**Q2:** Sistema de Recompensas: Quando o usuário clica em um drop e `grantReward(drop.type)` é chamado, onde essas recompensas devem ser armazenadas? Assumo que devem ser apenas pontos visuais (sem persistência no banco) por enquanto, mas você quer que sejam salvas no perfil do usuário ou apenas exibidas temporariamente?

**Answer:** Por enquanto, NENHUMA persistência no banco. Recompensas dos drops devem ser: armazenadas somente no estado do cliente, exibidas visualmente (UI, animações), opcionais para desbloquear emotes locais, NÃO salvas no backend por enquanto, futuramente integradas ao perfil do usuário (fase 3 ou 4).

**Q3:** Emotes Dev - Contexto de Uso: Os emotes serão usados apenas em um chat futuro ou também devem aparecer durante os jogos? Assumo que inicialmente serão apenas visuais no canvas (sem backend de chat), mas você quer que já preparem a estrutura para integração futura com chat?

**Answer:** Os Emotes Dev devem ser implementados como: Sistema visual canvas-only, sem backend, sem chat por enquanto, estrutura interna preparada para futuro chat WebSocket. Ou seja: Criar a infra de emotes, renderização procedural (neon, glitch, pixel), componente que futuramente será usado pelo chat, sem enviar mensagens, sem persistir nada ainda.

**Q4:** Hacker Panel - Dados Reais: Para os logs reais (usuários online, jogos ativos), você já tem endpoints de API (`/api/users/online`, `/api/games/active`) ou preciso criar esses endpoints como parte desta spec? Assumo que preciso criar esses endpoints se não existirem.

**Answer:** Ainda não existem endpoints reais, então: Você deve criar os endpoints necessários: GET /api/stats/online, GET /api/stats/recent-logins, GET /api/stats/active-games. Os dados podem ser: mockados ou gerados parcialmente a partir dos dados existentes (ex: sessions). O painel hacker deve funcionar mesmo com dados fake: logs fake + dados reais, fallback caso endpoint falhe.

**Q5:** Hacker Panel - Posicionamento: Onde o painel hacker deve aparecer? Assumo que pode ser um componente opcional que pode ser exibido na home page ou em uma página dedicada, mas você tem uma preferência específica de onde ele deve ficar?

**Answer:** O painel hacker deve ser implementado como: Um componente standalone: `<HackerPanel />`, que possa ser embutido onde quisermos: home page, página dedicada /live, dentro da aba "experimentos" futuramente. Prioridade: Disponível na Home via toggle, mas não visível por padrão.

**Q6:** Priorização das Features: Das 4 features (Drops, Física+Shake, Emotes, Hacker Panel), há alguma ordem de prioridade? Assumo que todas têm a mesma prioridade, mas se houver uma ordem específica, isso ajudaria na implementação.

**Answer:** Sim, existe ordem de prioridade clara na Fase 1: 1. Física da Home + Shake (É base da experiência do portal, já existe, só precisa reforço e integração), 2. Drops (Retenção + diversão, depende do Canvas Foundation da Home), 3. Emotes Dev (Sistema visual que será usado em chat futuramente), 4. Hacker Panel (Isolado e independente, pode vir por último). Ordem recomendada para desenvolvimento: DevOrbsCanvas + Shake, DropsCanvas, EmotesRenderer, HackerPanel.

**Q7:** Shake Button - Integração: Vejo que já existe um `ShakeButton` no código. A funcionalidade de shake já está implementada no `DevOrbsCanvas` ou preciso adicionar/melhorar? Assumo que preciso apenas documentar e garantir que está funcionando corretamente.

**Answer:** O ShakeButton já existe, mas: A função de shake precisa ser documentada, revisada e padronizada, ele deve aplicar força real nas DevOrbs via Matter.js, Shake NÃO deve afetar Drops, Shake deve ter cooldown documentado (3s recomendado). Então: Reutilizar o componente, garantir funcionamento, documentar APIs internas (applyShakeForce()).

**Q8:** Exclusões e Limitações: Há algo que definitivamente NÃO deve ser incluído nesta fase? Por exemplo, persistência de dados dos drops, sistema de chat completo, ou qualquer outra funcionalidade que deve ser deixada para fases futuras?

**Answer:** Nada disso entra agora: Persistência de recompensas de drops, sistema de chat real (apenas preparação de emotes), ranking integrado aos drops, compartilhamento de drops, economia real, store / inventário, sons complexos, qualquer IA geração de imagem, suporte mobile completo (mobile = fallback simples). A Fase 1 é Canvas Foundation, nada mais.

### Existing Code to Reference

**Similar Features Identified:**

- **Feature: DevOrbsCanvas** - Path: `components/DevOrbsCanvas.tsx`
  - Referência principal de estrutura
  - Loop de animação (requestAnimationFrame)
  - Engine de física (Matter.js)
  - Resize handling
  - Clipping do avatar
  - Gerenciamento de canvas stacking (layers)
  - Padrão de renderização procedural
  - Integração com tema (useThemeStore)

- **Feature: ShakeButton** - Path: `components/ShakeButton.tsx`
  - UI base
  - Integração com DevOrbs
  - Deve apenas ser documentado e refinado

- **Feature: Canvas Animation Patterns** - Paths: 
  - `components/games/dev-pong/PongCanvas.tsx`
  - `components/games/stack-overflow-dodge/StackOverflowDodgeCanvas.tsx`
  - `components/games/bit-runner/BitRunnerCanvas.tsx`
  - `components/games/debug-maze/MazeCanvas.tsx`
  - Padrões de requestAnimationFrame
  - Abstração de draw/update
  - Delta time calculation
  - Cleanup de animation frames

- **Feature: Theme-Aware Rendering** - Path: `lib/themes.ts`, `lib/theme-store.ts`
  - Todos os efeitos canvas precisam ler theme
  - neonColor, pixelColor, glitchColor
  - Sombra, brilho e partículas dependem do tema
  - Padrão de getThemeColors() usado em vários componentes

- **Feature: Overlay Components** - Paths:
  - `app/jogos/byte-match/page.tsx` (help panel pattern)
  - `app/jogos/debug-maze/page.tsx` (help panel pattern)
  - Painel hacker pode reutilizar estrutura de overlays existentes
  - Padrão de toggle/visibility

### Follow-up Questions

Nenhuma follow-up necessária - todas as respostas foram completas e claras.

## Visual Assets

### Files Provided:

Nenhum arquivo visual fornecido (verificação via bash: nenhum arquivo encontrado em `planning/visuals/`).

### Visual Insights:

Nenhum asset visual para análise. A implementação seguirá as especificações textuais fornecidas e os padrões visuais existentes no codebase (DevOrbsCanvas, jogos existentes).

## Requirements Summary

### Functional Requirements

**1. Sistema de Drops:**
- Canvas separado acima do DevOrbsCanvas
- Física procedural simples (gravidade, bounce, rotação)
- 4 formas geométricas: círculo, quadrado, triângulo, hexágono
- 4 raridades com probabilidades diferentes
- Explosão animada ao clicar
- 1 drop ativo por vez
- Spawn: 40-90s random
- Timeout: 12s
- Recompensas apenas no estado do cliente (sem persistência)

**2. Física da Home + Shake:**
- ✅ Shake já implementado - apenas verificar funcionamento
- Shake aplica força via Matter.js nas DevOrbs
- Shake NÃO afeta Drops (verificar quando Drops forem adicionados)
- Garantir que efeitos visuais funcionam corretamente

**3. Emotes Dev:**
- Sistema visual canvas-only
- Renderização procedural (neon, glitch, pixel)
- Preparar estrutura para chat futuro (sem backend agora)
- Texto estilizado: `</rage>`, `:segfault:`, etc.
- Efeitos: glow, glitch, pixelation, scanlines

**4. Hacker Panel:**
- Componente standalone `<HackerPanel />`
- Canvas para fundo animado (scanlines, glitch, borda neon)
- HTML para logs (melhor performance)
- Logs reais (via API) + logs fake (procedurais)
- Endpoints a criar: `/api/stats/online`, `/api/stats/recent-logins`, `/api/stats/active-games`
- Disponível na Home via toggle (não visível por padrão)
- Auto-scroll interno
- Fade-out de linhas antigas

### Reusability Opportunities

**Componentes para Reutilizar:**
- `DevOrbsCanvas.tsx` - Estrutura de canvas, loop de animação, resize handling
- `ShakeButton.tsx` - UI base e integração
- Padrões de canvas de jogos existentes - requestAnimationFrame, delta time, cleanup
- Help panel patterns - Para estrutura de overlay do Hacker Panel

**Backend Patterns:**
- Padrões de API routes existentes (Next.js API routes)
- Estrutura de endpoints similar a `/api/users/*`

**Frontend Patterns:**
- Theme-aware rendering (getThemeColors pattern)
- Canvas animation loops (requestAnimationFrame pattern)
- Resize handling para canvas
- Toggle/visibility patterns para overlays

### Scope Boundaries

**In Scope:**
- Sistema de Drops com física procedural
- Sistema de Emotes Dev (canvas-only, preparação para chat)
- Painel Hacker Real-Time (componente standalone)
- Integração e documentação do Shake (DevOrbs)
- Endpoints de stats para Hacker Panel
- Renderização 100% procedural (sem imagens externas)
- Integração com sistema de temas existente

**Out of Scope:**
- Persistência de recompensas de drops no banco
- Sistema de chat real (apenas preparação de emotes)
- Ranking integrado aos drops
- Compartilhamento de drops
- Economia real
- Store / inventário
- Sons complexos
- Geração de imagem por IA
- Suporte mobile completo (mobile = fallback simples)
- Qualquer funcionalidade além de Canvas Foundation

### Technical Considerations

**Integração:**
- Drops em canvas separado acima do DevOrbsCanvas
- Mesmo viewport (mesma área da Home)
- Shake não interfere com Drops
- Emotes preparados para integração futura com chat WebSocket

**Performance:**
- Física procedural simples (mais leve que Matter.js)
- Double buffering no canvas principal
- Mobile fallback (reduzir partículas/glow)
- requestAnimationFrame para todas as animações

**Tecnologias:**
- Canvas API (nativo)
- CSS para efeitos visuais (scanlines, glitch)
- React para componentes
- Next.js API routes para endpoints de stats
- Sistema de temas existente (Zustand/ThemeStore)

**Padrões a Seguir:**
- Estrutura similar a DevOrbsCanvas
- Loop de animação como nos jogos existentes
- Theme-aware como todos os componentes
- Resize handling como nos canvas de jogos
- Cleanup adequado de animation frames

**Ordem de Implementação:**
1. DropsCanvas (sistema completo) - prioridade 1
2. EmotesRenderer (sistema visual) - prioridade 2
3. HackerPanel (componente standalone + endpoints) - prioridade 3
4. Verificação de integração: garantir que Shake não interfere com Drops
