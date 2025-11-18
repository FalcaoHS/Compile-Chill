# Spec Técnica: Fase 1 - Canvas Foundation

## Visão Geral

Esta spec define a implementação de 4 sistemas principais usando 100% Canvas + CSS, sem imagens externas:

1. **Drops System** - Objetos procedurais que caem com física
2. **Home Physics + Shake** - Integração com física existente
3. **Dev Emotes** - Emotes procedurais para chat/jogos
4. **Hacker Panel** - Painel terminal hacker em tempo real

## Princípios Fundamentais

### Zero Imagens Externas
- Tudo renderizado proceduralmente no Canvas
- Formas geométricas, gradientes, glow, sombras
- Texto estilizado para emotes
- CSS para efeitos visuais (scanlines, glitch)

### Tema-Aware
- Todos os sistemas respeitam o tema ativo
- Cores, glow, pixelation adaptam-se ao tema
- Animações ajustadas por tema

### Performance
- Double buffering no canvas principal
- Otimização de loops (zero lag)
- Fallback mobile (reduzir partículas/glow)
- requestAnimationFrame para animações

### Zero Scroll Desktop
- Tudo dentro do viewport
- Auto-scroll interno quando necessário
- Layout responsivo sem causar scroll

## Arquitetura de Pastas

```
lib/
  canvas/
    drops/
      Drop.ts              # Classe principal Drop
      DropManager.ts        # Gerenciador de drops
      DropRenderer.ts       # Renderização procedural
      drop-types.ts         # Tipos e raridades
    emotes/
      EmoteRenderer.ts     # Renderização de emotes
      EmoteManager.ts       # Gerenciador de emotes
      emote-types.ts        # Tipos de emotes
    hacker-panel/
      HackerPanel.tsx       # Componente React
      HackerCanvas.ts       # Canvas para fundo animado
      log-generator.ts      # Gerador de logs fake
components/
  DropsCanvas.tsx          # Canvas para drops
  EmoteBubble.tsx          # Bubble de emote no chat
  HackerPanel.tsx          # Painel hacker (wrapper)
hooks/
  useDrops.ts              # Hook para gerenciar drops
  useEmotes.ts             # Hook para gerenciar emotes
  useHackerPanel.ts        # Hook para painel hacker
  useCanvasAnimation.ts    # Hook para animação canvas
```

## Sistema 1: Drops

### Arquitetura

```
Drop (classe)
  ├── spawn() - Cria novo drop
  ├── update(dt) - Atualiza física
  ├── draw(ctx) - Renderiza no canvas
  └── onClick() - Handler de clique

DropManager
  ├── spawnNext() - Agenda próximo drop
  ├── updateAll() - Atualiza todos os drops
  ├── drawAll() - Renderiza todos
  └── handleClick() - Detecta cliques

DropRenderer
  ├── drawCircle() - Renderiza círculo
  ├── drawSquare() - Renderiza quadrado
  ├── drawTriangle() - Renderiza triângulo
  └── drawHexagon() - Renderiza hexágono
```

### Física

- Gravidade: 0.5-0.8 (baseado em raridade)
- Velocidade inicial: 0
- Bounce: 0.3-0.5 (baseado em raridade)
- Timeout: 12s após spawn

### Raridades

1. **Common** (70%)
   - Cores: tema primary
   - Tamanho: 24-32px
   - Glow: 8px
   - Recompensa: 1 ponto

2. **Uncommon** (20%)
   - Cores: tema accent
   - Tamanho: 32-40px
   - Glow: 12px
   - Recompensa: 3 pontos

3. **Rare** (8%)
   - Cores: gradiente primary+accent
   - Tamanho: 40-48px
   - Glow: 16px
   - Recompensa: 10 pontos

4. **Epic** (2%)
   - Cores: gradiente multi-color
   - Tamanho: 48-56px
   - Glow: 24px
   - Recompensa: 50 pontos

### Formas Geométricas

- **Círculo**: arc() com glow
- **Quadrado**: rect() com cantos arredondados
- **Triângulo**: path() com 3 vértices
- **Hexágono**: path() com 6 vértices

### Explosão ao Clicar

- 20-30 partículas
- Velocidade radial
- Fade-out gradual
- Cores baseadas no drop
- Duração: 0.8-1.2s

## Sistema 2: Home Physics + Shake

### Integração

- Usa física existente (Matter.js)
- Shake aplica força em todos os orbs
- Efeitos visuais de vibração

### Shake Implementation

```typescript
handleShake() {
  // Aplica força para cima em todos os orbs
  orbs.forEach(orb => {
    applyForce(orb, { x: random(-5, 5), y: -20 })
  })
  
  // Efeitos visuais
  triggerShakeAnimation()
}
```

## Sistema 3: Dev Emotes

### Arquitetura

```
EmoteRenderer
  ├── draw(ctx, text, x, y, theme)
  ├── drawGlitch() - Efeito glitch
  ├── drawPixel() - Pixelation para tema Pixel
  └── drawNeon() - Glow neon

EmoteManager
  ├── spawn(text, x, y) - Cria emote
  ├── updateAll() - Atualiza animações
  └── drawAll() - Renderiza todos
```

### Emotes Disponíveis

- `</rage>`
- `:segfault:`
- `404_face_not_found`
- `rm -rf lol`
- `:compile:`
- `:deploy:`
- `:merge_conflict:`
- `:stack_overflow:`

### Renderização

1. **Texto Base**
   - Fonte: JetBrains Mono
   - Tamanho: 16-24px (baseado em animação)
   - Cor: tema primary

2. **Glow Neon**
   - shadowBlur: 8-16px
   - shadowColor: tema primary
   - Múltiplas camadas para intensidade

3. **Glitch Effect**
   - Duplicação com offset 1-2px
   - Cores alternadas (primary/accent)
   - Opacidade variável

4. **Pixelation** (tema Pixel)
   - imageSmoothingEnabled: false
   - Escala reduzida e ampliada

5. **Scanlines** (opcional)
   - Linhas horizontais semi-transparentes
   - Espaçamento: 4-6px

### Animação no Chat

- Tamanho inicial: 16px
- Tamanho máximo: 32px (0.3s)
- Fade-out: 1.5s total
- Bubble aparece e desaparece suavemente

### Multiplayer

- Aparece acima do jogador
- Duração: 1.2s
- Offset Y: -40px do jogador
- Segue movimento do jogador

## Sistema 4: Hacker Panel

### Arquitetura

```
HackerPanel (React Component)
  ├── HackerCanvas (fundo animado)
  │   ├── drawScanlines()
  │   ├── drawGlitch()
  │   └── drawBorder()
  └── LogContainer (HTML)
      ├── renderRealLogs()
      └── renderFakeLogs()
```

### Canvas Background

- Scanlines animadas (CSS + Canvas)
- Glitch effect (offset duplicado)
- Borda neon com glow
- Gradiente de fundo

### Logs Reais

Atualizados via API:
- `[STATUS] Users online: ${count}`
- `[GAME] Active games: ${count}`
- `[AUTH] Last login: ${username} at ${time}`
- `[SCORE] New high score: ${game} - ${score}`

### Logs Fake

Gerados proceduralmente:
- `[INFO] Bug localizado no setor ${sector}`
- `[WARN] Commit suspeito detectado`
- `[DEBUG] Packet 0x${hex} retransmitido`
- `[SYSTEM] Memory leak em ${module}`
- `[NETWORK] Connection timeout: ${ip}`

### Comportamento

- Nova linha: 1-3s (random)
- Auto-scroll: mantém última linha visível
- Fade-out: linhas antigas desaparecem após 30s
- Máximo: 50 linhas (remove mais antigas)

### Estilo Visual

- Fonte: monoespaçada (JetBrains Mono)
- Cursor piscando: `|` (opacity 0-1, 500ms)
- Cores: tema primary/accent
- Background: tema bg-secondary com transparência

## Integração com Tema

### Cores por Tema

**Cyber Hacker:**
- Primary: #7ef9ff
- Accent: #7dd3fc
- Glow: rgba(126, 249, 255, 0.45)

**Pixel Lab:**
- Primary: #ff6b9d
- Accent: #c44569
- Glow: rgba(255, 107, 157, 0.4)
- Pixelation: enabled

**Neon Future:**
- Primary: #00f5ff
- Accent: #ff00ff
- Glow: rgba(0, 245, 255, 0.6)

**Terminal Minimal:**
- Primary: #4ec9b0
- Accent: #569cd6
- Glow: rgba(78, 201, 176, 0.3)

**Blueprint Dev:**
- Primary: #4a9eff
- Accent: #5bb3ff
- Glow: rgba(74, 158, 255, 0.4)

## Performance

### Otimizações

1. **Double Buffering**
   - Canvas offscreen para pré-renderização
   - Swap buffers no final do frame

2. **Culling**
   - Não renderizar objetos fora da tela
   - Pausar animações quando inativo

3. **Mobile Fallback**
   - Reduzir partículas (50%)
   - Reduzir glow (50%)
   - Desabilitar efeitos pesados

4. **Request Animation Frame**
   - Usar sempre RAF para animações
   - Throttle em 60fps máximo

## Testes

### Unit Tests

- Drop physics
- Emote rendering
- Log generation
- Theme integration

### Integration Tests

- Drops + Home Physics
- Emotes + Chat
- Hacker Panel + API

### Performance Tests

- FPS em diferentes dispositivos
- Memory usage
- CPU usage

## Roadmap de Implementação

1. **Fase 1.1**: Drops System
   - Classes base
   - Renderização procedural
   - Física simples
   - Integração com tema

2. **Fase 1.2**: Emotes System
   - Renderização de texto
   - Efeitos visuais
   - Integração com chat

3. **Fase 1.3**: Hacker Panel
   - Canvas background
   - Log system
   - API integration

4. **Fase 1.4**: Integração Final
   - Todos os sistemas juntos
   - Otimizações
   - Testes finais

