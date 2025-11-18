# Fase 1 - Canvas Foundation

## Visão Geral

Esta spec define a implementação completa de 4 sistemas principais usando 100% Canvas + CSS, sem imagens externas:

1. **Drops System** - Objetos procedurais que caem com física
2. **Home Physics + Shake** - Integração com física existente
3. **Dev Emotes** - Emotes procedurais para chat/jogos
4. **Hacker Panel** - Painel terminal hacker em tempo real

## Estrutura da Spec

```
2025-11-18-phase1-canvas-foundation/
├── planning/
│   ├── raw-idea.md              # Ideia original do usuário
│   ├── spec.md                  # Spec técnica completa
│   ├── architecture.md          # Arquitetura detalhada
│   ├── interfaces.ts            # Interfaces TypeScript
│   ├── fluxos.md                # Diagramas de fluxo
│   ├── code-base/               # Código base completo
│   │   ├── drops/
│   │   │   ├── Drop.ts
│   │   │   ├── DropManager.ts
│   │   │   └── drop-config.ts
│   │   ├── emotes/
│   │   │   ├── EmoteRenderer.ts
│   │   │   └── EmoteManager.ts
│   │   ├── hacker-panel/
│   │   │   ├── HackerPanel.tsx
│   │   │   ├── HackerCanvas.tsx
│   │   │   └── log-generator.ts
│   │   ├── hooks/
│   │   │   └── useDrops.ts
│   │   ├── components/
│   │   │   └── DropsCanvas.tsx
│   │   └── theme-utils.ts
│   └── visuals/                 # Mockups e screenshots (futuro)
└── implementation/              # Documentação de implementação (futuro)
```

## Princípios Fundamentais

### Zero Imagens Externas
- Tudo renderizado proceduralmente no Canvas
- Formas geométricas, gradientes, glow, sombras
- Texto estilizado para emotes
- CSS para efeitos visuais

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

## Sistemas

### 1. Drops System

**Objetivo:** Objetos que caem da tela com física, usuário clica para ganhar recompensas.

**Características:**
- 4 formas geométricas: círculo, quadrado, triângulo, hexágono
- 4 raridades: Common (70%), Uncommon (20%), Rare (8%), Epic (2%)
- Física procedural simples (gravidade, bounce)
- Explosão animada ao clicar
- 1 drop ativo por vez
- Spawn: 40-90s random
- Timeout: 12s

**Arquivos:**
- `code-base/drops/Drop.ts` - Classe principal
- `code-base/drops/DropManager.ts` - Gerenciador
- `code-base/drops/drop-config.ts` - Configurações

### 2. Home Physics + Shake

**Objetivo:** Integrar com física existente e adicionar funcionalidade de shake.

**Características:**
- Usa física existente (Matter.js)
- Shake aplica força em todos os orbs
- Efeitos visuais de vibração

**Integração:**
- Funcionalidade já existe em `DevOrbsCanvas.tsx`
- Apenas documentação e melhorias

### 3. Dev Emotes System

**Objetivo:** Emotes procedurais para chat/jogos sem imagens.

**Características:**
- Texto estilizado: `</rage>`, `:segfault:`, `404_face_not_found`, etc.
- Renderização procedural com glow, glitch, pixelation
- Animação no chat (escala + fade)
- Multiplayer: aparece acima do jogador

**Arquivos:**
- `code-base/emotes/EmoteRenderer.ts` - Renderização
- `code-base/emotes/EmoteManager.ts` - Gerenciador

### 4. Hacker Panel System

**Objetivo:** Painel terminal hacker com logs reais e fake.

**Características:**
- Canvas para fundo animado (scanlines, glitch, borda neon)
- HTML para logs (melhor performance)
- Logs reais: users online, games ativos, últimos logins/scores
- Logs fake: gerados proceduralmente
- Auto-scroll interno
- Fade-out de linhas antigas

**Arquivos:**
- `code-base/hacker-panel/HackerPanel.tsx` - Componente React
- `code-base/hacker-panel/HackerCanvas.tsx` - Canvas background
- `code-base/hacker-panel/log-generator.ts` - Gerador de logs fake

## Integração com Tema

Todos os sistemas são tema-aware e usam:

- **Cyber Hacker**: #7ef9ff (primary), #7dd3fc (accent)
- **Pixel Lab**: #ff6b9d (primary), #c44569 (accent), pixelation enabled
- **Neon Future**: #00f5ff (primary), #ff00ff (accent)
- **Terminal Minimal**: #4ec9b0 (primary), #569cd6 (accent)
- **Blueprint Dev**: #4a9eff (primary), #5bb3ff (accent)

## Performance

### Otimizações

1. **Double Buffering** - Canvas offscreen
2. **Culling** - Não renderizar fora da tela
3. **Mobile Fallback** - Reduzir partículas/glow
4. **Request Animation Frame** - Sempre usar RAF

### Métricas Esperadas

- Desktop: 60 FPS constante
- Mobile: 30-60 FPS
- Memory: < 50MB
- CPU: < 10% idle, < 30% animações

## Próximos Passos

1. **Implementação Fase 1.1**: Drops System
   - Integrar código base
   - Testar física
   - Integrar com tema

2. **Implementação Fase 1.2**: Emotes System
   - Integrar código base
   - Testar renderização
   - Integrar com chat

3. **Implementação Fase 1.3**: Hacker Panel
   - Integrar código base
   - Conectar com API
   - Testar logs

4. **Implementação Fase 1.4**: Integração Final
   - Todos os sistemas juntos
   - Otimizações
   - Testes finais

## Documentação Adicional

- `spec.md` - Spec técnica completa
- `architecture.md` - Arquitetura detalhada
- `fluxos.md` - Diagramas de fluxo
- `interfaces.ts` - Interfaces TypeScript
- `code-base/` - Código base completo

## Notas de Implementação

- Todo código está em `code-base/` e pode ser copiado diretamente para o projeto
- Interfaces estão em `interfaces.ts` e devem ser movidas para `types/` ou `lib/`
- Hooks devem ser movidos para `hooks/`
- Componentes devem ser movidos para `components/`
- Classes core devem ser movidas para `lib/canvas/`

## Contato

Para dúvidas sobre esta spec, consulte:
- `raw-idea.md` - Ideia original
- `spec.md` - Detalhes técnicos
- `architecture.md` - Arquitetura

