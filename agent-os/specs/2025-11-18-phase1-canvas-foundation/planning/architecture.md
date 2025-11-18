# Arquitetura - Fase 1 Canvas Foundation

## Visão Geral da Arquitetura

A arquitetura é modular e escalável, seguindo princípios de separação de responsabilidades:

```
┌─────────────────────────────────────────────────────────────┐
│                      React Components                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ DropsCanvas   │  │ EmoteBubble  │  │ HackerPanel  │     │
│  └──────┬────────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                         React Hooks                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  useDrops    │  │  useEmotes   │  │useHackerPanel│     │
│  └──────┬────────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Core Classes (Canvas)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ DropManager  │  │ EmoteManager │  │ HackerCanvas │     │
│  │   + Drop     │  │ + Renderer   │  │ + LogGen     │     │
│  └──────┬────────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Theme Integration                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           getThemeColors() / ThemeStore               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Camadas da Arquitetura

### 1. Camada de Apresentação (React Components)

**Responsabilidades:**
- Renderizar UI
- Gerenciar estado local
- Interagir com hooks

**Componentes:**
- `DropsCanvas.tsx` - Canvas para drops
- `EmoteBubble.tsx` - Bubble de emote no chat
- `HackerPanel.tsx` - Painel hacker completo

### 2. Camada de Lógica (React Hooks)

**Responsabilidades:**
- Gerenciar ciclo de vida
- Coordenar entre componentes e classes
- Expor API simplificada

**Hooks:**
- `useDrops.ts` - Gerencia drops
- `useEmotes.ts` - Gerencia emotes
- `useHackerPanel.ts` - Gerencia painel hacker
- `useCanvasAnimation.ts` - Loop de animação

### 3. Camada de Negócio (Core Classes)

**Responsabilidades:**
- Lógica de negócio
- Física e animações
- Renderização procedural

**Classes:**
- `Drop` / `DropManager` - Sistema de drops
- `EmoteRenderer` / `EmoteManager` - Sistema de emotes
- `HackerCanvas` / `log-generator` - Sistema de painel

### 4. Camada de Integração (Theme)

**Responsabilidades:**
- Integração com sistema de temas
- Resolução de cores
- Efeitos por tema

**Utilitários:**
- `theme-utils.ts` - Funções de tema
- `ThemeStore` (existente) - Estado global de tema

## Padrões de Design

### 1. Manager Pattern

Cada sistema tem um Manager que coordena múltiplas instâncias:

```typescript
DropManager
  ├── Gerencia múltiplos Drops
  ├── Controla spawn timing
  └── Coordena renderização

EmoteManager
  ├── Gerencia múltiplos Emotes
  ├── Controla lifetime
  └── Coordena renderização
```

### 2. Renderer Pattern

Renderizadores separados da lógica de negócio:

```typescript
EmoteRenderer
  ├── draw() - Renderização base
  ├── drawNeon() - Renderização neon
  ├── drawPixel() - Renderização pixel
  └── drawGlitch() - Efeito glitch
```

### 3. Factory Pattern

Configurações centralizadas:

```typescript
getDropRarityConfigs() - Retorna configs de raridade
getRandomRarity() - Escolhe raridade aleatória
getRandomShape() - Escolhe forma aleatória
```

### 4. Observer Pattern

Hooks observam mudanças de tema:

```typescript
useThemeStore() - Observa mudanças de tema
useEffect() - Reage a mudanças
```

## Estrutura de Dados

### Drop State

```typescript
{
  id: string
  x: number
  y: number
  vx: number
  vy: number
  shape: DropShape
  rarity: DropRarity
  size: number
  rotation: number
  spawnTime: number
  lifetime: number
  isActive: boolean
  hasExploded: boolean
}
```

### Emote State

```typescript
{
  id: string
  text: string
  x: number
  y: number
  scale: number
  alpha: number
  life: number
  maxLife: number
  isActive: boolean
  theme: ThemeId
  glitchOffset: number
}
```

### Hacker Panel State

```typescript
{
  logs: LogEntry[]
  onlineUsers: number
  activeGames: number
  lastLogin: { username: string, timestamp: number } | null
  lastScore: { game: string, score: number, username: string } | null
  lastUpdate: number
}
```

## Fluxo de Dados

### Drops

```
User Click → DropsCanvas → useDrops → DropManager → Drop.onClick()
                                                      ↓
                                              Grant Reward
```

### Emotes

```
Chat Event → EmoteBubble → useEmotes → EmoteManager → EmoteRenderer
                                                          ↓
                                                    Canvas Draw
```

### Hacker Panel

```
Timer → HackerPanel → generateFakeLog() → State Update → Render
```

## Performance

### Otimizações Implementadas

1. **Double Buffering**
   - Canvas offscreen para pré-renderização
   - Swap no final do frame

2. **Culling**
   - Não renderizar objetos fora da tela
   - Remover objetos inativos

3. **Throttling**
   - Limitar FPS a 60
   - Throttle em eventos de mouse/touch

4. **Mobile Optimization**
   - Reduzir partículas
   - Reduzir glow
   - Desabilitar efeitos pesados

### Métricas Esperadas

- **Desktop**: 60 FPS constante
- **Mobile**: 30-60 FPS (dependendo do dispositivo)
- **Memory**: < 50MB para todos os sistemas
- **CPU**: < 10% em idle, < 30% durante animações

## Escalabilidade

### Adicionar Novo Sistema

1. Criar classe Manager
2. Criar classe Renderer (se necessário)
3. Criar hook React
4. Criar componente React
5. Integrar com tema

### Adicionar Novo Tema

1. Adicionar cores em `themes.ts`
2. Atualizar `getThemeColors()` se necessário
3. Testar todos os sistemas

### Adicionar Novo Drop Shape

1. Adicionar forma em `DROP_SHAPES`
2. Implementar método `drawShape()` em `Drop`
3. Testar renderização

## Testabilidade

### Unit Tests

- Classes isoladas (Drop, EmoteRenderer, etc.)
- Funções puras (getRandomRarity, generateFakeLog)
- Configurações (rarity configs)

### Integration Tests

- Hooks com classes
- Componentes com hooks
- Integração com tema

### E2E Tests

- Fluxo completo de drops
- Fluxo completo de emotes
- Fluxo completo de painel hacker

## Segurança

### Validação de Input

- Validar coordenadas de clique
- Validar texto de emotes
- Sanitizar logs fake

### Rate Limiting

- Limitar spawn de drops
- Limitar criação de emotes
- Limitar logs por segundo

## Manutenibilidade

### Código Limpo

- Funções pequenas e focadas
- Nomes descritivos
- Comentários onde necessário

### Documentação

- JSDoc em todas as funções públicas
- README para cada sistema
- Exemplos de uso

### Versionamento

- Sempre quebrar mudanças em versões
- Changelog detalhado
- Migration guides quando necessário

