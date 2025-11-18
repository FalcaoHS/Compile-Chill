# Diagramas de Fluxo - Fase 1 Canvas Foundation

## 1. Fluxo do Sistema de Drops

```
┌─────────────────┐
│  App Inicia     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ DropManager      │
│ Inicializa      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Agenda Spawn    │
│ (40-90s random) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Timer Expira    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Verifica Drop   │
│ Ativo?          │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
   Sim       Não
    │         │
    │         ▼
    │    ┌─────────────────┐
    │    │ Cria Novo Drop   │
    │    │ - Escolhe        │
    │    │   Raridade       │
    │    │ - Escolhe Forma  │
    │    │ - Define Cores   │
    │    └────────┬─────────┘
    │             │
    └─────────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ Loop Animação   │
         │ (requestAF)     │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ Update Física   │
         │ - Gravidade     │
         │ - Velocidade    │
         │ - Colisão Chão  │
         │ - Lifetime      │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ Render Drop      │
         │ - Forma Geom.    │
         │ - Glow           │
         │ - Gradiente      │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ Usuário Clica?  │
         └────────┬────────┘
                  │
         ┌────────┴────────┐
         │                  │
        Sim                Não
         │                  │
         ▼                  │
┌─────────────────┐         │
│ Detecta Clique  │         │
│ Dentro do Drop? │         │
└────────┬────────┘         │
         │                  │
    ┌────┴────┐             │
    │         │             │
   Sim       Não            │
    │         │             │
    │         └─────────────┘
    │
    ▼
┌─────────────────┐
│ Cria Explosão   │
│ - Partículas    │
│ - Animação      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Grant Reward    │
│ - Tipo          │
│ - Valor         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Remove Drop     │
└─────────────────┘
```

## 2. Fluxo do Sistema de Emotes

```
┌─────────────────┐
│ Evento Trigger  │
│ (Chat/Multi)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ EmoteManager    │
│ spawnChat() ou  │
│ spawnMulti()    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cria EmoteState │
│ - Texto         │
│ - Posição       │
│ - Tema          │
│ - Lifetime      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Loop Animação   │
│ (requestAF)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Update Emote    │
│ - Escala        │
│ - Alpha         │
│ - Lifetime      │
│ - Glitch Offset │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ EmoteRenderer   │
│ draw()          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Render Baseado  │
│ no Tema         │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
  Pixel    Neon/Cyber
    │         │
    │         ▼
    │    ┌─────────────────┐
    │    │ drawNeon()      │
    │    │ - Múltiplas     │
    │    │   Camadas       │
    │    │ - Glow Intenso  │
    │    └────────┬────────┘
    │             │
    ▼             │
┌─────────────────┐
│ drawPixel()     │
│ - Desabilita    │
│   Smoothing     │
│ - Escala        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Aplica Efeitos  │
│ - Glitch        │
│ - Scanlines     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Lifetime <= 0? │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
   Sim       Não
    │         │
    │         └─────────────┐
    │                      │
    ▼                      │
┌─────────────────┐        │
│ Remove Emote    │        │
└─────────────────┘        │
                           │
                           └──┐
                              │
                              ▼
```

## 3. Fluxo do Hacker Panel

```
┌─────────────────┐
│ Component Mount │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Inicializa      │
│ HackerCanvas    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Busca Dados     │
│ Reais (API)     │
│ - Users Online  │
│ - Games Ativos  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Agenda Logs     │
│ (1-3s random)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Timer Expira    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Escolhe Tipo    │
│ (70% fake,      │
│  30% real)      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
  Real      Fake
    │         │
    │         ▼
    │    ┌─────────────────┐
    │    │ generateFakeLog │
    │    │ - Template       │
    │    │ - Placeholders   │
    │    └────────┬─────────┘
    │             │
    ▼             │
┌─────────────────┐
│ Cria Log Real   │
│ - Status        │
│ - Game          │
│ - Auth          │
│ - Score         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Adiciona Log    │
│ ao State        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Renderiza Log   │
│ - HTML Text     │
│ - Cor por Tipo  │
│ - Alpha Fade    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ HackerCanvas    │
│ Renderiza Fundo │
│ - Scanlines     │
│ - Glitch        │
│ - Borda Neon    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Auto-scroll     │
│ (se habilitado) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Fade-out        │
│ Logs Antigos    │
│ (>30s)          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Remove Logs     │
│ (alpha <= 0)    │
└─────────────────┘
```

## 4. Fluxo de Integração com Tema

```
┌─────────────────┐
│ Tema Muda       │
│ (ThemeStore)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ getThemeColors  │
│ (themeId)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Obtém CSS Vars  │
│ - primary       │
│ - accent        │
│ - text          │
│ - bg            │
│ - glow          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Propaga Cores   │
│ para Sistemas   │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬──────────┐
    │         │          │          │
    ▼         ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Drops  │ │ Emotes │ │ Hacker │ │ Home   │
│ Update │ │ Update │ │ Update │ │ Update │
│ Colors │ │ Colors │ │ Colors │ │ Colors │
└────────┘ └────────┘ └────────┘ └────────┘
```

## 5. Fluxo de Performance (Double Buffering)

```
┌─────────────────┐
│ Frame Start     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cria Offscreen  │
│ Canvas          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Renderiza Tudo  │
│ no Offscreen    │
│ - Drops         │
│ - Emotes        │
│ - Background    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Swap Buffers    │
│ drawImage()     │
│ offscreen ->    │
│ visible         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Frame Complete  │
└─────────────────┘
```

## 6. Fluxo de Shake (Home Physics)

```
┌─────────────────┐
│ Usuário Clica   │
│ Shake Button    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ handleShake()   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Itera Todos     │
│ Orbs            │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Aplica Força    │
│ - Horizontal    │
│   (random)      │
│ - Vertical      │
│   (upward)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Trigger Visual  │
│ Effects         │
│ - Rim Shake     │
│ - Backboard     │
│   Shake         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Reset após      │
│ 0.8s            │
└─────────────────┘
```

