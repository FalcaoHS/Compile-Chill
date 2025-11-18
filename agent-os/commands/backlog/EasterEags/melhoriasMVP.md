Objetivo Geral

Garantir que o portal Compile & Chill rode de forma estável, performática e segura em qualquer dispositivo, especialmente durante o lançamento, onde há risco de:

FPS baixo

travamentos em mobile

perda de score

loops infinitos de canvas

consumo excessivo de CPU

problemas com múltiplas abas

sessão do usuário expirada enquanto joga

Este patch estabelece regras fundamentais para performance, confiabilidade e resiliência.

🟣 1. Mobile Safety Mode (“Modo Lite Automático”)
Problema

O mobile não aguenta física pesada, fogos, drops e partículas.
Atualmente, detectamos mobile mas não desligamos os efeitos.

Solução Raw Idea

Criar um modo “Lite” ativado automaticamente quando:

isMobileDevice() === true

ou window.innerWidth < 768px

Modo Lite desativa:

física Matter.js

DevOrbs

drops

fogos

partículas temáticas

glow pesado

efeitos neon animados

Modo Lite deixa ativo:

HUD

scoreboard

placar

interação mínima

parte visual estática (quadra, cesta)

Nada mais.

🔵 2. FPS Guardian (Fallback de Performance Inteligente)
Problema

Quando FPS cai, hoje ou desliga tudo ou continua sofrendo.

Solução Raw Idea

Um sistema de 3 níveis:

Nível 0 — Normal

FPS ≥ 50
Tudo habilitado.

Nível 1 — Degradação suave

FPS entre 35 e 49
Reduzir:

partículas pela metade

opacidade de efeitos neon

intensidade de glow

número de fogos simultâneos para 3

Nível 2 — Fallback total

FPS < 35
Desligar:

física

partículas

drops

fogos
Renderizar quadro estático minimalista.

🔥 3. Safe Score System (Proteção contra Perda de Score)
Problema

Se a sessão expira, você perde o score.
Hoje há apenas um console.error.

Solução Raw Idea

Um pipeline resiliente:

1. Antes de enviar score:

Salvar em: localStorage.pendingScore.

2. Se envio falhar:

Exibir toast:

“Sua pontuação será enviada quando você entrar novamente.”

3. Ao logar / ao abrir a home:

Se existir pendingScore
→ tentar enviar
→ se sucesso, remover

4. Sessão expirada durante a partida:

UI deve mostrar:

“Sua sessão expirou. Seu score está seguro e será enviado automaticamente quando você fizer login.”

Isso evita frustração.

🧲 4. Multi-Tab Protection (Proteger CPU e Sincronizar Abas)
Problema

2–3 abas abertas = 2–3 engines rodando = CPU explode.

Solução Raw Idea

Criar um BroadcastChannel exclusivo:

"canvas_control"

Regras:
Quando uma aba ganha foco:

enviar mensagem "pause" para todas as outras

outras abas pausam canvas, física e loops

Quando perder foco:

pausar a própria física

congelar animações complexas

manter apenas UI

evitar loops ocultos

Benefício:

Carga cai para 1/3 imediatamente.

💥 5. Canvas Crash Resilience (Fallback quando Canvas falhar)
Problema

Qualquer erro no canvas derruba a página toda.

Solução Raw Idea

Criar um modo “crash-safe” para canvas.

Regras:

Se qualquer exceção for detectada:

parar loops

exibir mensagem discreta:

“Visual temporariamente indisponível, reiniciando…”

reiniciar canvas após 1 segundo

Se falhar 3 vezes seguidas:
→ carregar fallback totalmente estático.

Isso garante que o usuário NUNCA veja um site quebrado.

🟡 6. Firework Limit (Controle de Partículas dos Fogos)
Problema

Fogos acumulam e não têm limite global.

Solução Raw Idea

máximo de 6 fogos simultâneos

se chegar no limite, apagar os mais antigos

partículas dos fogos com TTL curto

nenhuma partícula viva > 3s

🟢 7. Global Particle Budget (Orçamento de Partículas)
Problema

Somatória de partículas de drops + fogos + emotes pode explodir GPU.

Solução Raw Idea

Criar um “particle budget” fixo:

MAX_PARTICLES = 250

Regras:

drops usam no máximo 40

fogos no máximo 120

emotes no máximo 50

partículas de tema no máximo 40

Se o orçamento ultrapassar → descartar partículas de menor prioridade.

⚙️ 8. Session Stability (NextAuth)
Problema

Sessão expira e quebra fluxo.

Solução Raw Idea

Database session ✔ (já tem)

Auto-renew ao detectar expiração

Toast de aviso amigável

Retry de score

Nada pesado.

🧩 9. Full Logging (modo leve)
Problema

Necessário para o dia do lançamento

Solução Raw Idea

Logar apenas:

FPS low events

canvas crash events

score save failures

multi-tab warnings

Sem rastrear dados do usuário.

🧨 10. Ordem de Execução do Patch
1. Mobile Lite Mode
2. FPS Guardian
3. Safe Score System
4. Multi-Tab Control
5. Canvas Crash Fallback
6. Limites de partículas e fogos
7. Logging

Essa é a ordem correta para implementação.