# Raw Idea - Fase 1: Canvas Foundation

## Descrição Original do Usuário

Quero criar a Fase 1 do meu portal, 100% usando Canvas + CSS, sem nenhuma imagem externa.

Apenas formas geométricas, texto, gradientes, glow, sombras e efeitos procedurais.

As 4 features são: Drops, Física da Home + Shake, Emotes Dev, Painel Hacker Realtime.

## 1. DROPS — Procedural Shapes (sem imagens)

### Objetivo
Criar objetos que caem da tela com física e o usuário pode clicar para ganhar recompensas.

### Requisitos:
- Sem imagens externas
- Cada drop deve ser desenhado com formas geométricas neon:
  - círculos
  - quadrados
  - triângulos
  - hexágonos
- O estilo visual depende do tema (Neon, Hacker, Pixel etc)
- Glow usando shadowBlur e shadowColor
- Raridades determinam cor, tamanho e brilho
- Cada drop cai com gravidade usando geometria própria (canvas + pseudo física simples)
- Bounce leve quando colide com chão
- Clique gera explosão animada no canvas
- Desaparece após timeout de 12s
- Apenas 1 drop ativo por vez
- Frequência: 40–90s, random
- Após clique, chamar grantReward(drop.type)

### Implementação:
- Criar uma classe Drop com métodos: spawn(), update(dt), draw(ctx), onClick()
- Usar requestAnimationFrame
- Drops precisam ficar acima da física da Home

## 2. Física da Home + Shake

### Objetivo
Manter a física existente da Home (DevOrbs) e adicionar funcionalidade de Shake.

### Requisitos:
- Integrar com sistema de física existente
- Shake deve afetar todos os orbs ativos
- Efeitos visuais de shake (vibração, glow)

## 3. EMOTES DEV — Procedural (sem PNG/SVG)

### Objetivo
Criar emotes exclusivos para chat/jogos, sem imagens externas, usando apenas texto estilizado.

### Modelo:
- Emote é um texto estilizado: </rage>, :segfault:, 404_face_not_found, rm -rf lol, etc.
- Renderizar em canvas:
  - fonte JetBrains Mono
  - glow neon
  - duplicação para efeito glitch
  - scanlines opcionais
  - pixelation em temas Pixel
- Ao enviar no chat:
  - aumenta o tamanho do texto
  - surge um "bubble" animado
  - desaparece em 1.5s
- No multiplayer:
  - emotes aparecem acima do jogador por 1.2s

### Implementação:
- Classe EmoteRenderer com: draw(ctx, text, x, y, theme), drawGlitch(), drawPixel(), drawNeon()

## 4. Painel Hacker Real-Time — Canvas + CSS

### Objetivo
Criar um painel estilo terminal hacker com logs reais + logs fake.

### Visual:
- Cor primária neon/hacker
- Fonte monoespaçada
- Cursor piscando
- Scanlines CSS (pseudo-element:before)
- Glitch de texto duplicado (offset 1–2px)
- Borda neon com glow

### Conteúdo real:
- quantos usuários online
- jogos ativos
- últimos logins
- últimos scores

### Conteúdo fake:
- [INFO] Bug localizado no setor 7
- [WARN] Commit suspeito detectado
- [DEBUG] Packet 0xFFE1 retransmitido

### Comportamento:
- nova linha a cada 1–3s
- auto-scroll interno (sem scroll da página)
- fade-out de linhas antigas

### Implementação:
- Componente React <HackerPanel />
- Canvas para fundo animado (scanline e glitch)
- Texto HTML para logs
- Estados: panel = { logs: [], online, activeGames, lastUpdate }

## REGRAS GERAIS DO PROJETO

- Nada pode causar scroll no desktop
- Tudo deve respeitar tema (Neon, Pixel, Hacker, Terminal)
- Tudo procedural: nenhuma imagem externa
- Canvas principal sempre usa double buffering
- Tema-aware sempre: cores, glow, pixelation, animações
- Zero lag: otimizar loops
- Fallback mobile: reduzir partículas/glow

