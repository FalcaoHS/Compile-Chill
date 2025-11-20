# 📋 Backlog de Ideias - Compile & Chill

Este documento contém ideias, features e melhorias planejadas para o projeto, organizadas por categoria e prioridade.

---

## ✅ Já Implementado

### Segurança
- ✅ Validação de env com Zod (`lib/auth-env-validation.ts`)
- ✅ Security headers básicos (`lib/security-headers.ts`)
- ✅ Audit logs básicos (`lib/session-monitor.ts`)
- ✅ Session renewal strategy
- ✅ CSRF protection (via NextAuth)

### Rate Limiting & Performance
- ✅ Rate limiting com Upstash (`lib/rate-limit.ts`, `lib/api-rate-limit.ts`)
- ✅ Multi-tab protection (`lib/performance/multi-tab.ts`)
- ✅ Endpoint `/api/users/recent` com cache e fallback

### Validação & Anti-Cheat
- ✅ Score validation server-side (`lib/validations/score.ts`)
- ✅ Game-specific validators (`lib/game-validators/`)
- ✅ Anti-cheat logging

### Session & Auth
- ✅ Session isolation (`lib/session-monitor.ts`)
- ✅ Session monitoring queries e testes (`__tests__/integration/`)

### Stats & Monitoring
- ✅ Endpoint `/api/stats/online`
- ✅ Endpoint `/api/stats/active-games`

### Documentação
- ✅ README completo com guias de setup
- ✅ Roadmap público (`app/sobre/page.tsx`)

---

## 🔒 Segurança & Compliance (Crítico - Antes do Launch)

### CORS e Políticas de Segurança
- [ ] Configurar CORS allowlist e revisar políticas
- [ ] Configurar CSP (Content Security Policy) para produção e staging
- [x] Implementar CSRF tokens para rotas mutáveis (se fora NextAuth) - ✅ NextAuth já protege
- [x] Configurar HSTS e security headers completos - ✅ Headers básicos implementados (`lib/security-headers.ts`)

### Sanitização e Validação
- [ ] Sanitização completa de user input mostrado no canvas/DOM
- [x] Validação de env com Zod consolidada e fail-fast - ✅ Implementado (`lib/auth-env-validation.ts`)
- [ ] SRI (Subresource Integrity) para recursos externos (fonts)

### Auditoria e Monitoramento
- [x] Audit logs básicos (login fails, score fails, canvas crashes) - ✅ Implementado (`lib/session-monitor.ts`)
- [x] Session renewal strategy (silent refresh / warning) - ✅ Implementado
- [ ] Dependency audit e correção de CVEs altos

---

## 🎮 Social / Interação

### Chat: Moderação & Segurança
- [ ] Fila de moderação automática (AI + heurísticas)
- [ ] UI de report/ban para moderadores
- [x] Rate limit por usuário (Upstash) - ✅ Implementado (`lib/rate-limit.ts`, `lib/api-rate-limit.ts`)
- [ ] Blocklist de palavras/regex
- [ ] Sanitização e escaping de mensagens (XSS)

### Persistência & Histórico
- [ ] Store de mensagens (Postgres) + TTL para efêmeras
- [ ] Paginação + fetch incremental (only last N on open)

### Emotes: Infra & Integração
- [ ] API de emotes (catalog, raridade, ownership)
- [ ] Endpoint para usar emote no chat (rate-limited)

### Mensagens Efêmeras
- [ ] Job para deletar (cron/Lambda) ou TTL DB

### Salas Temáticas
- [ ] Criação/room metadata, permissões, limite de membros

### Anti-Spam
- [ ] Captcha challenge / rate-limit escalonável
- [ ] Heurísticas: messages/sec, similarity, new-account limits

### Audio Messages
- [ ] Upload/streaming: WebRTC or MediaRecorder + signed upload to S3
- [ ] Transcription (optional) + moderation (speech-to-text + AI)
- [ ] Storage + TTL & quota

### Privacy / GDPR
- [ ] Opt-out para chat data (GDPR compliance)

---

## ♟️ Xadrez Dev Edition

### Matchmaking / Multiplayer
- [ ] Lobby, invites, sockets (WebSocket / Pusher)
- [ ] Reconnection handling

### Anti-Cheat / Validação
- [ ] Store PGN / moves history
- [ ] Server-side validation contra movimentos legais

### Sistema de Rating
- [ ] Elo-like rating system (DLO)
- [ ] Fórmula + DB migration + UI

### Spectator Mode
- [ ] Watch games com eventos limitados

### Chat e Moderação
- [ ] Match chat moderation & emotes

### UX
- [ ] No-scroll guarantee: QA + CSS locked layout

---

## 📚 FunWiki

### Moderação
- [ ] Moderation pipeline
- [ ] Auto-tagging + human review queue
- [ ] Abuse reports + admin dashboard

### Content Model
- [ ] WYSIWYG editor ou Markdown + sanitization

### Busca e Tags
- [ ] Full-text search (Postgres ou Elastic) + tagging suggestions

### Postagem Anônima
- [ ] Rate limits, stricter moderation, captcha

### Versionamento
- [ ] Versioning / edits / rollback

---

## 🏠 Home Page Lendária

### Performance
- [x] Server-side endpoint `/api/users/recent` (cached) - ✅ Implementado com cache de 3s e fallback
- [x] Fallback se <N users - ✅ Implementado (fake profiles)

### Mobile Behavior
- [ ] Static fallback ou lightweight physics (já discutido)

### Acessibilidade
- [ ] Keyboard drag fallback, aria labels para orbs

### Consent & Privacy
- [ ] Opt-out para mostrar user avatar em orbs

### Easter Egg Telemetry
- [ ] Track triggers (opt-in)

---

## 🔨 Extravasar a Raiva

### Asset Management
- [ ] Library de ícones para techs (copyright safe)

### Interação & Persistência
- [ ] Save preference no profile + local override

### Moderação
- [ ] Garantir que animações de martelo não permitam assédio
- [ ] Restringir conteúdo apenas para logos de tech

### Acessibilidade & UX
- [ ] Fornecer alternativa não-violenta (ex: "squeeze stress ball")

---

## 🎭 Features Extras (6.x) — Backlog Técnico

### Perfil Dev Cinemático
- [ ] Metrics store, charting lib config (recharts), export PNG

### Drops (In-Game Rewards)
- [ ] Signed URLs para asset claims
- [ ] Rate-limited claim endpoint
- [ ] Rarity RNG

### Sala Secreta
- [ ] Route protection, secret token generation

### Terminal Oculto
- [ ] Command whitelist + rate-limit + audit log

### Eventos Semanais
- [ ] Feature flags + scheduling UI

### Laboratório Experimental
- [ ] A/B testing / feature flags toggles + telemetry

### Painel Hacker Real-Time
- [x] Endpoints: `/api/metrics/online`, `/api/games/active` - ✅ Implementado (`app/api/stats/online/route.ts`, `app/api/stats/active-games/route.ts`)
- [ ] Caching + websockets para live updates

### Cartões de Score Cinematográficos
- [ ] Server-side canvas render (html-to-image no backend)
- [ ] Signed URL para share image

---

## 📈 Observability & Ops

### Metrics
- [ ] Request latency, errors, FPS incidents count
- [ ] Particle budget breaches

### Error Tracking
- [ ] Sentry setup para frontend + backend (canvas errors, crashes)

### Logs
- [ ] Log retention & rotation

### Health Checks
- [ ] Health checks & uptime alerts

### Backups
- [ ] Backups para DB & critical data

### Rate-Limit Monitoring
- [ ] Upstash dashboard + alerts

---

## ♿ Acessibilidade & Internacionalização

- [ ] WCAG checks básicos: color contrast, keyboard nav, aria labels
- [ ] Captions/transcripts para audio messages
- [ ] i18n framework + strings file (pt-BR primeiro, en-US)
- [ ] Screen-reader friendly fallback para canvas interactions

---

## 🧪 QA / Testing

- [ ] E2E tests (Playwright) para flows críticos (login, save score, chat)
- [ ] Unit tests para validation (Zod) + score validation
- [ ] Load testing (k6) em score endpoints + `/api/users/recent`
- [ ] Security scanning no CI (Snyk/npm audit)
- [ ] Visual regression checks para no-scroll UI across resolutions

---

## 🔁 Infra / CI-CD

- [ ] CI pipeline (lint, test, build, audit)
- [ ] Staging environment mirror de prod
- [ ] Feature flags (LaunchDarkly / simple DB flags)
- [ ] Deploy rollback plan + DB migration backups

---

## 📣 Social / Virality

- [ ] Share image generator (server-side) para OG + X share (PNG)
- [ ] Deep-linking para compartilhar runs específicos
- [ ] Prebuilt tweet templates com hashtags e @shuktv

---

## 🧾 Doc & Product

- [x] README / developer onboarding (how to run, envs, migrations) - ✅ Implementado (README.md com guias completos)
- [ ] API docs (OpenAPI) para endpoints `/api/*`
- [ ] Moderation guide para community managers
- [x] Roadmap public page (short bullets + status) - ✅ Implementado (`app/sobre/page.tsx` - aba Roadmap)

---

## ✅ Prioridade Sugerida

### 🔴 Crítico (Implementar antes do pentest / launch)
- [x] Env validation - ✅ Implementado
- [x] Security headers básicos - ✅ Implementado (HSTS pendente)
- [x] Audit logs básicos - ✅ Implementado
- [x] Session renewal - ✅ Implementado
- [ ] CORS allowlist
- [ ] CSP completo
- [ ] Sanitização completa
- [ ] SRI
- [ ] Dependency fixes

### 🟡 Alto
- [x] Score fail-safe - ✅ Implementado (validação server-side com `lib/game-validators/`)
- [x] Multi-tab protection - ✅ Implementado (`lib/performance/multi-tab.ts`)
- [x] Rate limiting (Upstash) - ✅ Implementado (`lib/rate-limit.ts`, `lib/api-rate-limit.ts`)
- [x] Session isolation - ✅ Implementado (`lib/session-monitor.ts`, testes em `__tests__/integration/`)
- [ ] Chat moderation infra
- [ ] Upstash limits monitoring
- [ ] Observability (Sentry)
- [ ] Load tests

### 🟢 Médio
Audio moderation/transcription, drops infra, features do xadrez/multiplayer, cartões share server-side.

### ⚪ Baixo
Gamification extras, secret rooms, advanced analytics.

---

**Nota:** Este backlog é um documento vivo e será atualizado conforme o projeto evolui.
