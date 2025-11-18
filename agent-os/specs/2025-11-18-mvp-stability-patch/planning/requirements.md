# Spec Requirements: MVP Stability Patch

## Initial Description

Garantir que o portal Compile & Chill rode de forma estável, performática e segura em qualquer dispositivo, especialmente durante o lançamento, onde há risco de:

- FPS baixo
- travamentos em mobile
- perda de score
- loops infinitos de canvas
- consumo excessivo de CPU
- problemas com múltiplas abas
- sessão do usuário expirada enquanto joga

Este patch estabelece regras fundamentais para performance, confiabilidade e resiliência.

## Requirements Discussion

### First Round Questions

**Q1:** Mobile Safety Mode: Assumo que o modo Lite desativa física, DevOrbs, drops, fogos e partículas, mas mantém HUD, scoreboard e elementos estáticos. Isso está correto, ou devemos manter alguma animação leve (ex.: transições simples)?

**Answer:** Sua suposição está correta. Modo Lite deve desativar física, DevOrbs, drops, fogos e partículas, mantendo HUD, scoreboard e elementos estáticos. Recomendação extra: manter animações leves e baratas (transições CSS de opacidade/transform com will-change) para preservar sensação de vida sem custo alto — por exemplo, um fade suave em banners, ou pulso muito sutil do botão "Entrar". Por que: melhora percepção de qualidade sem sacrificar desempenho.

**Q2:** FPS Guardian: Assumo os níveis: Nível 0 (FPS ≥ 50): tudo habilitado; Nível 1 (FPS 35-49): reduzir partículas pela metade, opacidade de efeitos neon, intensidade de glow, fogos para 3 simultâneos; Nível 2 (FPS < 35): desligar física, partículas, drops e fogos; renderizar quadro estático minimalista. Isso está correto, ou devemos ajustar os thresholds?

**Answer:** Sua tabela é boa. Sugiro um ajuste leve nos thresholds para robustez real-world: Nível 0: FPS ≥ 50 — tudo ligado. ✅ Nível 1: 40 ≤ FPS < 50 — degradação suave (reduzir partículas pela metade, diminuir glow/opacidade, fogos → 3). (ajuste para 40 em vez de 35) Nível 2: FPS < 40 — fallback agressivo (desligar física, partículas, drops, fogos; quadro estático). (usar 40 como cut-off evita oscilações frequentes) Hysteresis: aplique um buffer (por ex. só mudar de modo se a média de 60 frames estiver abaixo/ acima por 2s) para evitar "chiar" entre estados. Por que: 40–50 é ponto prático em browsers móveis/desktop integrados; evita thrashing.

**Q3:** Safe Score System: Assumo que salvamos em localStorage.pendingScore antes do envio, exibimos toast em caso de falha, tentamos reenviar ao logar/abrir home, e mostramos mensagem amigável se a sessão expirar durante a partida. Isso está correto, ou queremos um limite de tentativas ou expiração do pendingScore?

**Answer:** Sua ideia cobre o essencial. Complementos recomendados: Salvar em localStorage.pendingScore antes da tentativa de envio. ✅ Retry policy: tente enviar até 5 vezes com backoff exponencial (1s, 2s, 4s, 8s, 16s). Expiration: pendings expiram após 30 dias (removê-los e notificar usuário). Mostrar toast quando falha e outra toast quando o envio pendente for reprocessado com sucesso. Se a fila acumular > 5 itens, avisar usuário e oferecer "baixar/compartilhar" localmente. Por que: evita perda de dados e evita enfileirar lixo indefinidamente.

**Q4:** Multi-Tab Protection: Assumo uso de BroadcastChannel com nome "canvas_control", pausar outras abas quando uma ganha foco, e pausar física própria ao perder foco. Isso está correto, ou queremos sincronização de estado (ex.: score) entre abas?

**Answer:** Sua BroadcastChannel "canvas_control" é adequado. Recomendo: Comportamento: aba ativa = owner, outras abas = paused. Quando owner perde foco, ele envia "relinquish" e próxima aba ativa solicita ownership. Sincronização de estado opcional: sincronizar somente pendências críticas (pendingScore) via localStorage or BroadcastChannel — não é necessário sincronizar score em tempo real entre abas. Extra: usar Page Visibility API para pausar animações quando invisível. Por que: evita duplicação de física e mantém UX consistente.

**Q5:** Canvas Crash Resilience: Assumo que, ao detectar exceção, paramos loops, exibimos "Visual temporariamente indisponível, reiniciando…", reiniciamos após 1 segundo, e após 3 falhas consecutivas carregamos fallback estático. Isso está correto, ou devemos ajustar o número de tentativas ou o tempo de espera?

**Answer:** Plano OK. Pequenas melhorias: Tentativas: reiniciar após 1s, retry até 3 vezes é bom. Backoff e telemetria: depois de 3 falhas, abrir fallback e enviar evento de canvas_crash com stack. UI: botão "Reiniciar visual" para usuário forçar reload do canvas. Proteção: envolver renderFrame() e physics.step() em try/catch e degradar gradualmente (first stop particles, depois physics). Por que: protege contra loops infinitos e oferece recuperação automática.

**Q6:** Firework Limit: Assumo máximo de 6 fogos simultâneos, remover os mais antigos ao atingir o limite, TTL curto para partículas, e nenhuma partícula viva > 3s. Isso está correto, ou devemos ajustar os limites?

**Answer:** 6 fogos simultâneos é razoável para a maioria dos dispositivos. Sugestões: Default: MAX_FIREWORKS = 6 ✅ Mobile: MAX_FIREWORKS = 2 TTL particulas: ≤ 1200–2000 ms (1.2–2s) — 3s é aceitável mas prefira menores para mobile/GPU. Ao atingir limite, fade out dos mais antigos (melhor UX que cortar bruscamente). Por que: mantém espetáculo sem penalizar performance.

**Q7:** Global Particle Budget: Assumo MAX_PARTICLES = 250 com distribuição: drops 40, fogos 120, emotes 50, partículas de tema 40. Isso está correto, ou devemos ajustar os valores ou a prioridade de descarte?

**Answer:** Os números são um bom ponto de partida; recomendo ajustes e política de descarte: MAX_PARTICLES = 250 (ok) Prioridade de uso (alta → baixa): UI critical (score effects) > emotes lendários > fireworks > drops > theme particles Distribuição sugerida (ajustada): Fogos: 100 (was 120) Drops: 50 (was 40) Emotes: 50 Tema: 50 Implementar graceful degrade: quando orçamento ultrapassado, reduzir partículas de tema, depois drops, depois fogos. Por que: balanceia espetáculo com controle; prioriza UX crítico.

**Q8:** Session Stability: Assumo que já temos database session, queremos auto-renew ao detectar expiração, toast de aviso amigável e retry de score. Isso está correto, ou queremos renovação proativa antes da expiração?

**Answer:** Você está com database session — ótimo. Recomendações: Renovação proativa: se session.expires < now + 24h (ou updateAge padrão), tente renovação silenciosa via refresh token ou ping server. Toast aviso: quando session.expires < 2 min durante gameplay, mostrar soft warning e botão "Renovar sessão" (redirect to login flow). Retry de score: integrado ao Safe Score System já recomendado. Por que: evita perda de score e melhora experiência para usuários long sessions.

**Q9:** Logging: Assumo logar apenas eventos de FPS baixo, crashes de canvas, falhas de salvamento de score e avisos de multi-tab, sem rastrear dados do usuário. Isso está correto, ou queremos métricas adicionais (ex.: tempo de sessão, dispositivos)?

**Answer:** Sua lista básica está correta. Recomendo adicionar apenas: session_duration (anonymized buckets: <1m, 1–5m, 5–15m, >15m) device_class (desktop / mobile / tablet) — para priorizar fixes first_paint / time_to_interactive leve para detectar load problems Tudo anonimizado e opcional. Não tracke conteúdo sensível. Por why: ajuda priorizar problemas reais do lançamento.

### Existing Code to Reference

**Similar Features Identified:**

- **Canvas loops / patterns:** `components/DevOrbsCanvas.tsx` (requestAnimationFrame and throttling hooks)
- **Drops logic:** `lib/canvas/drops/DropManager.ts` + `Drop.ts`
- **FPS monitor:** `DevOrbsCanvas.tsx` (linhas 1556-1601) — estender para multi-threshold behavior
- **Particle spawning:** centralizar em util `lib/canvas/particleBudget.ts`
- **Physics config:** `lib/physics/orbs-engine.ts` → add disablePhysics flag + timeScale changes
- **Auth/session:** `auth.config.ts` already database session — hook retry and pro-active refresh here
- **hooks:** `hooks/useDrops.ts`, `hooks/useEmotes.ts` — extend to read global particle budget and mobile mode

**Components to potentially reuse:**
- DevOrbsCanvas patterns for canvas rendering and FPS monitoring
- DropManager and Drop classes for particle management
- orbs-engine for physics configuration and mobile detection
- Existing hooks (useDrops, useEmotes) for extending with budget controls

**Backend logic to reference:**
- Score saving logic in `app/api/scores/route.ts` for retry integration
- Session management in `auth.config.ts` for proactive renewal
- Error handling patterns in API routes for graceful degradation

### Follow-up Questions

No follow-up questions were needed. All questions were answered comprehensively with detailed recommendations.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
No visual assets to analyze.

## Requirements Summary

### Functional Requirements

**1. Mobile Safety Mode ("Modo Lite Automático")**
- Detect mobile devices via `isMobileDevice()` or `window.innerWidth < 768px`
- Automatically disable: Matter.js physics, DevOrbs, drops, fireworks, thematic particles, heavy glow, animated neon effects
- Keep active: HUD, scoreboard, score display, minimal interaction, static visual parts (court, basket)
- Allow light CSS animations (opacity/transform with will-change) for quality perception without performance cost

**2. FPS Guardian (Intelligent Performance Fallback)**
- Three-tier system with hysteresis to prevent thrashing:
  - **Level 0 (FPS ≥ 50):** Everything enabled
  - **Level 1 (40 ≤ FPS < 50):** Smooth degradation (reduce particles by half, decrease neon opacity, reduce glow intensity, limit fireworks to 3)
  - **Level 2 (FPS < 40):** Aggressive fallback (disable physics, particles, drops, fireworks; render minimal static frame)
- Apply buffer: only change mode if 60-frame average is below/above threshold for 2 seconds
- Extend existing FPS monitor in DevOrbsCanvas.tsx (lines 1556-1601) for multi-threshold behavior

**3. Safe Score System (Score Loss Protection)**
- Save to `localStorage.pendingScore` before sending attempt
- Retry policy: up to 5 attempts with exponential backoff (1s, 2s, 4s, 8s, 16s)
- Expiration: pending scores expire after 30 days (remove and notify user)
- Show toast on failure and another toast when pending score is successfully reprocessed
- If queue accumulates > 5 items, warn user and offer "download/share" locally
- Display friendly message if session expires during gameplay: "Sua sessão expirou. Seu score está seguro e será enviado automaticamente quando você fizer login."
- Attempt to send pending scores on login/home page load

**4. Multi-Tab Protection (CPU Protection and Tab Synchronization)**
- Create exclusive BroadcastChannel: "canvas_control"
- Behavior: active tab = owner, other tabs = paused
- When owner loses focus, send "relinquish" message; next active tab requests ownership
- Optional state sync: only sync critical pending scores (pendingScore) via localStorage or BroadcastChannel
- Use Page Visibility API to pause animations when tab is invisible
- Pause canvas, physics, and loops in non-active tabs

**5. Canvas Crash Resilience (Fallback when Canvas Fails)**
- Wrap `renderFrame()` and `physics.step()` in try/catch
- On exception: stop loops, display message "Visual temporariamente indisponível, reiniciando…", restart canvas after 1 second
- Retry up to 3 times with backoff
- After 3 failures: load fully static fallback and send `canvas_crash` event with stack trace
- UI: add "Reiniciar visual" button for user to force canvas reload
- Gradual degradation: first stop particles, then physics

**6. Firework Limit (Firework Particle Control)**
- Default: MAX_FIREWORKS = 6 simultaneous
- Mobile: MAX_FIREWORKS = 2
- Particle TTL: ≤ 1200–2000 ms (1.2–2s) — prefer smaller for mobile/GPU
- When limit reached, fade out oldest fireworks (better UX than abrupt cut)
- Remove oldest when limit exceeded

**7. Global Particle Budget (Particle Budget)**
- MAX_PARTICLES = 250 total
- Priority order (high → low): UI critical (score effects) > legendary emotes > fireworks > drops > theme particles
- Distribution:
  - Fireworks: 100
  - Drops: 50
  - Emotes: 50
  - Theme: 50
- Graceful degradation: when budget exceeded, reduce theme particles first, then drops, then fireworks
- Centralize in utility: `lib/canvas/particleBudget.ts`

**8. Session Stability (NextAuth)**
- Database session already exists ✅
- Proactive renewal: if `session.expires < now + 24h` (or default updateAge), attempt silent renewal via refresh token or server ping
- Toast warning: when `session.expires < 2 min` during gameplay, show soft warning with "Renovar sessão" button (redirect to login flow)
- Score retry: integrated with Safe Score System
- Hook retry and proactive refresh in auth.config.ts

**9. Full Logging (Light Mode)**
- Log only: FPS low events, canvas crash events, score save failures, multi-tab warnings
- Additional metrics (anonymized):
  - `session_duration` (buckets: <1m, 1–5m, 5–15m, >15m)
  - `device_class` (desktop / mobile / tablet)
  - `first_paint` / `time_to_interactive` (lightweight, for load problem detection)
- All anonymized and optional; no sensitive user data tracking

**10. Implementation Order**
1. Mobile Lite Mode
2. FPS Guardian
3. Safe Score System
4. Multi-Tab Control
5. Canvas Crash Fallback
6. Particle and firework limits
7. Logging

### Reusability Opportunities

- **Canvas patterns:** Reuse `components/DevOrbsCanvas.tsx` for requestAnimationFrame and throttling hooks
- **Drops system:** Extend `lib/canvas/drops/DropManager.ts` and `Drop.ts` for particle management
- **FPS monitoring:** Extend existing FPS monitor in `DevOrbsCanvas.tsx` (lines 1556-1601) for multi-threshold behavior
- **Particle budget:** Create centralized utility `lib/canvas/particleBudget.ts` for global particle management
- **Physics config:** Extend `lib/physics/orbs-engine.ts` to add `disablePhysics` flag and `timeScale` changes
- **Auth/session:** Use existing `auth.config.ts` database session; add retry and proactive refresh hooks
- **Hooks:** Extend `hooks/useDrops.ts` and `hooks/useEmotes.ts` to read global particle budget and mobile mode

### Scope Boundaries

**In Scope:**
- Mobile detection and automatic Lite mode activation
- FPS monitoring with 3-tier degradation system (thresholds: 50, 40)
- Safe score system with localStorage fallback, retry policy (5 attempts, exponential backoff), and 30-day expiration
- Multi-tab protection via BroadcastChannel with ownership model
- Canvas crash resilience with try/catch, retry (3 attempts), and static fallback
- Firework limits (6 default, 2 mobile) with fade-out behavior
- Global particle budget (250 total) with priority-based distribution and graceful degradation
- Session stability with proactive renewal and warning system
- Lightweight logging for performance events (FPS, crashes, score failures, multi-tab warnings) plus anonymized metrics

**Out of Scope:**
- Real-time score synchronization between tabs (only pending scores synced)
- Complex analytics dashboard (logging is lightweight, anonymized)
- User-facing performance metrics display (internal only)
- Automatic device performance profiling beyond FPS monitoring
- Cross-device session synchronization
- Advanced particle effects beyond budget management

### Technical Considerations

**Integration Points:**
- Extend existing `isMobileDevice()` in `lib/physics/orbs-engine.ts`
- Integrate with existing FPS monitor in `DevOrbsCanvas.tsx`
- Hook into existing score submission in `app/api/scores/route.ts`
- Extend session management in `auth.config.ts`
- Integrate with existing canvas components (DevOrbsCanvas, DropsCanvas, EmoteBubble)

**Existing System Constraints:**
- Must work with existing Matter.js physics engine
- Must not break existing game score submission flow
- Must maintain compatibility with NextAuth database sessions
- Must preserve existing theme system and visual effects
- Must not interfere with existing canvas rendering loops

**Technology Preferences Stated:**
- Use BroadcastChannel for multi-tab communication
- Use Page Visibility API for tab focus detection
- Use localStorage for pending score storage
- Use CSS animations (opacity/transform with will-change) for light animations in Lite mode
- Use exponential backoff for retry policies
- Use try/catch for canvas error handling

**Similar Code Patterns to Follow:**
- Canvas rendering patterns from `DevOrbsCanvas.tsx`
- Particle management patterns from `DropManager.ts`
- FPS monitoring patterns from `DevOrbsCanvas.tsx` (lines 1556-1601)
- Physics configuration patterns from `orbs-engine.ts`
- Error handling patterns from API routes
- Session management patterns from `auth.config.ts`

