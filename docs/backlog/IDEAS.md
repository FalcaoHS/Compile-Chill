🎮 Social / Interação (faltantes / necessários)

 Chat: moderação & segurança

fila de moderação automática (AI + heurísticas)

report/ban UI para moderadores

rate limit por usuário (Upstash)

blocklist de palavras/regex

sanitização e escaping de mensagens (XSS)

 Persistência & histórico

store de mensagens (Postgres) + TTL para efêmeras

paginação + fetch incremental (only last N on open)

 Emotes: infra & integração

API de emotes (catalog, raridade, ownership)

endpoint para usar emote no chat (rate-limited)

 Mensagens efêmeras

job para deletar (cron/Lambda) ou TTL DB

 Salas temáticas

criação/room metadata, permissões, limite de membros

 Anti-spam

Captcha challenge / rate-limit escalonável

heurísticas: messages/sec, similarity, new-account limits

 Audio messages

upload/streaming: WebRTC or MediaRecorder + signed upload to S3

transcription (optional) + moderation (speech-to-text + AI)

storage + TTL & quota

 Privacy / opt-out for chat data (GDPR)

♟️ Xadrez Dev Edition (faltantes)

 Matchmaking / multiplayer

lobby, invites, sockets (WebSocket / Pusher)

reconnection handling

 Anti-cheat / replay validation

store PGN / moves history

server-side validation against legal moves

 Elo-like rating system (DLO)

formula + DB migration + UI

 Spectator mode

watch games w/ limited events

 Match chat moderation & emotes

 No-scroll guarantee: QA + CSS locked layout

📚 FunWiki (faltantes)

 Moderation pipeline

auto-tagging + human review queue

abuse reports + admin dashboard

 Content model

WYSIWYG editor or Markdown + sanitization

 Search / tags

full-text search (Postgres or Elastic) + tagging suggestions

 Anonymous posting

rate limits, stricter moderation, captcha

 Versioning / edits / rollback

🏠 Home Page Lendária (faltantes)

 Performance guardrails

server-side endpoint /api/users/recent (cached)

fallback if <N users

 Mobile behavior

static fallback or lightweight physics (already discussed)

 Accessibility

keyboard drag fallback, aria labels for orbs

 Consent & privacy

opt-out for showing user avatar in orbs

 Easter egg telemetry

track triggers (opt-in)

🔨 Extravasar a Raiva (faltantes)

 Asset management

library of icons for techs (copyright safe)

 Interaction & persistence

save preference in profile + local override

 Moderation

ensure hammer animations don't allow harassment; restrict content to tech logos only

 Accessibility & UX

provide alternative non-violent interaction (e.g., "squeeze stress ball")

🎭 Features extras (6.x) — backlog técnico

 Perfil Dev Cinemático

metrics store, charting lib config (recharts), export PNG

 Drops (in-game rewards)

signed URLs for asset claims, rate-limited claim endpoint, rarity RNG

 Sala Secreta

route protection, secret token generation

 Terminal Oculto

command whitelist + rate-limit + audit log

 Eventos Semanais

feature flags + scheduling UI

 Laboratório Experimental

A/B testing / feature flags toggles + telemetry

 Painel Hacker Real-Time

endpoints: /api/metrics/online, /api/games/active; caching + websockets for live updates

 Cartões de Score Cinematográficos

server-side canvas render (html-to-image on backend) + signed URL for share image

🔒 Segurança & Compliance (faltantes críticos)

 CORS allowlist e revisão de políticas

 CSP configurada (prod + staging)

 CSRF tokens para rotas mutáveis (se fora NextAuth)

 Sanitização completa (user input mostrado no canvas/DOM)

 Env validation (Zod) consolidada e fail-fast

 Audit logs básicos (login fails, score fails, canvas crashes)

 Session renewal strategy (silent refresh / warning)

 SRI para recursos externos (fonts)

 HSTS / Security headers completos

 Dependency audit & fix high CVEs

📈 Observability & Ops (faltantes)

 Metrics

request latency, errors, FPS incidents count, particle budget breaches

 Error tracking

Sentry setup for frontend + backend (canvas errors, crashes)

 Log retention & rotation

 Health checks & uptime alerts

 Backups for DB & critical data

 Rate-limit monitoring (Upstash dashboard + alerts)

♿ Acessibilidade & Internacionalização (faltantes)

 WCAG checks basics: color contrast, keyboard nav, aria labels

 Captions/transcripts for audio messages

 i18n framework + strings file (pt-BR first, en-US)

 Screen-reader friendly fallback for canvas interactions

🧪 QA / Testing (faltantes)

 E2E tests (Playwright) para flows críticos (login, save score, chat)

 Unit tests para validation (Zod) + score validation

 Load testing (k6) on score endpoints + /api/users/recent

 Security scanning in CI (Snyk/npm audit)

 Visual regression checks for no-scroll UI across resolutions

🔁 Infra / CI-CD (faltantes)

 CI pipeline (lint, test, build, audit)

 Staging environment mirror of prod

 Feature flags (LaunchDarkly / simple DB flags)

 Deploy rollback plan + DB migration backups

💸 Monetização / Payments (se for futuro)

 Stripe setup safe (if needed)

 Free tier / paid perks design (emotes, skins)

 Receipts & tax compliance

📣 Social / Virality (faltantes)

 Share image generator (server-side) for OG + X share (PNG)

 Deep-linking to share specific runs

 Prebuilt tweet templates with hashtags and @shuktv

🧾 Doc & Product (faltantes)

 README / developer onboarding (how to run, envs, migrations)

 API docs (OpenAPI) for /api/* endpoints

 Moderation guide for community managers

 Roadmap public page (short bullets + status)

✅ Prioridade sugerida (p/ backlog)

Crítico (implementar antes do pentest / launch):
CORS, CSP, CSRF, sanitização, env validation, SRI, HSTS, audit logs, session renewal, dependency fixes.

Alto: Chat moderation infra, score fail-safe, multi-tab protection, Upstash limits monitoring, observability (Sentry), load tests.

Médio: Audio moderation/transcription, drops infra, features do xadrez/multiplayer, cartoes share server-side.

Baixo: Gamification extras, secret rooms, advanced analytics, monetização.