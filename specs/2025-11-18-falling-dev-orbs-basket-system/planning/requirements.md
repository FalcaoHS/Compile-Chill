# Spec Requirements: Falling Dev Orbs + Basket System

## Initial Description

Transformar a Home do Compile & Chill numa experiência divertida e interativa:

as fotos dos últimos usuários aparecem como bolinhas perereca caindo do topo, com física real, colidindo entre si e podendo ser jogadas para dentro de uma cestinha de basquete neon.

Se o usuário acertar uma bolinha na cesta → efeito especial + fogos + animação temática.

Cria sensação de vida, comunidade, diversão e "dev chaos controlado".

## Requirements Discussion

### First Round Questions

**Q1:** Métrica de usuários (Quem vira bolinha) - I'm assuming we'll use "últimos 10 usuários que logaram nos últimos 5 minutos" (fallback para menos se não houver 10). Is that correct, or would you prefer a different metric (e.g., últimos 5 novos usuários, mix de recentes + mais ativos)?

**Answer:**
➡️ Decisão final: Últimos 10 usuários que logaram nos últimos 5 minutos
→ Se houver menos, usar quantos tiver.
→ Se nenhum, fallback para 5–10 perfis fake estilizados para não deixar a home vazia.

Motivos:
- real-time feeling
- mostra atividade
- movimento constante
- evita repetir sempre os mesmos usuários ativos

⚠️ Garantir limite máximo de 10 para não matar performance ou quebrar layout.

**Q2:** Posicionamento da cesta - I'm assuming the basket will be fixed at the top, centered. Is that correct, or would you prefer it in a corner? Should it be above or below the header?

**Answer:**
➡️ Decisão final: Cesta fixada no topo, CENTRALIZADA, logo abaixo do header.

Por quê?
- visual mais equilibrado
- mais intuitivo (jogar pra cima)
- perfeito para telas largas
- não atrapalha o logo nem o menu

❌ NÃO deve ficar acima do header → Senão gera conflito com navegação e responsividade.
❌ Não colocar na lateral no MVP → Mais difícil de acertar, pior visão em mobile.

⚠️ Cesta deve ter hitbox que não toca o header (evita scrolls acidentais!).

**Q3:** Integração com a Home atual - I'm assuming we'll either replace the hero section (logo/title) or add the physics area above the game grid, keeping the grid below. Is that correct, or would you prefer a different approach?

**Answer:**
➡️ Decisão final: Substituir a Hero Section pela área de física
→ Ou seja: o topo da home vira a área jogável.

E o grid de jogos fica logo abaixo, intacto.

Layout final:
[ HEADER FIXO ]
[ CESTA + ÁREA DE FÍSICA (sem scroll) ]  ← hero substituída
[ GRID DE JOGOS ]

Visualmente impacta e vira parte da identidade do site.

⚠️ A área física deve ter ALTURA DINÂMICA = (viewportHeight – headerHeight).

**Q4:** Engine de física - I'm assuming we'll use Matter.js (lightweight, good performance). Is that correct, or would you prefer Planck.js or simplified manual physics?

**Answer:**
➡️ Decisão final: Matter.js

Motivos:
- leve
- estável
- fácil de controlar colisões
- suporte nativo a arrastar e arremessar
- ideal pro estilo "bolinha perereca"

Alternativas rejeitadas:
❌ Planck.js (mais complexo e pesado)
❌ Física manual (difícil de acertar elasticidade + colisões múltiplas)

⚠️ Matter.js deve rodar em low-power mode no mobile.

**Q5:** Spawn das Dev Orbs - I'm assuming sequential spawn (1 per second until completing 10). Is that correct, or would you prefer all at once?

**Answer:**
➡️ Decisão final: Spawn sequencial: 1 por segundo até completar 10.

Motivos:
- cria expectativa
- dá sensação de "vivo"
- evita queda de FPS inicial
- mais bonito visualmente

Futuro: "Mass drop event" (todas de uma vez) para eventos especiais.

⚠️ Orbs devem nascer dentro dos limites horizontais do canvas para não causar overflow.

**Q6:** Recompensas no MVP - I'm assuming we'll only have visual effects (fireworks, animations) in the MVP, leaving XP/badges/leaderboard for later. Is that correct, or should we include rewards in the MVP?

**Answer:**
➡️ Decisão final: Apenas efeitos visuais (fogos, pop, glow).

Nada de:
❌ XP
❌ badges
❌ leaderboards

Esses entram na V2 quando o perfil do usuário estiver mais forte.

Por quê? → MVP deve ser divertido e leve, sem dependências extras de backend.

⚠️ Fogos e partículas devem ser leves e limitados para não expandir canvas (sem scroll).

**Q7:** Endpoint de usuários - I'm assuming we'll create a new `/api/users/recent` endpoint that returns the last 10 logged-in users (with light caching). Is that correct, or should we use an existing endpoint?

**Answer:**
➡️ Decisão final: Criar /api/users/recent com:
- avatar
- userId
- lastLogin
- username

✔ Cache de 5–10 segundos
✔ Limite de 10 usuários

Fácil, limpo, isolado.

Reutilizável para:
- feed
- ranking
- home
- eventos

⚠️ Endpoint deve retornar sempre <=10 para não quebrar o layout.

**Q8:** Responsividade no Mobile - I'm assuming we'll maintain physics and interactivity on mobile, with performance adjustments (disable shadows, reduce particles). Is that correct, or would you prefer a simplified version on mobile?

**Answer:**
➡️ Decisão final: Física e interatividade mantidas

✔ Ajustes automáticos:
- desabilitar sombras
- reduzir partículas
- limitar FPS
- usar sprites menores
- diminuir elasticidade para reduzir caos da física
- gestos simplificados (drag = puxar para lançar)

❌ Não criar uma "versão simplificada da home"

Manter a mesma experiência, só mais leve.

⚠️ No mobile, a área física deve caber entre header e grid, sem scroll.

### Existing Code to Reference

**Similar Features Identified:**

Based on codebase analysis, the following patterns and components can be reused:

- **Game Page Structure:**
  - Canvas rendering patterns from Bit Runner, Dev Pong, Hack Grid
  - Theme-aware color system using CSS variables
  - 60 FPS optimization patterns
  - Responsive canvas sizing (fits viewport without scroll)

- **UI Components:**
  - Theme system integration (`lib/theme-store.ts`, `lib/themes.ts`)
  - Theme-aware styling using Tailwind tokens
  - CSS variable system for theme colors

- **Backend Patterns:**
  - API route structure from `/api/users/me/route.ts` and `/api/users/[id]/route.ts`
  - Authentication patterns using `withAuth` utility
  - Error handling with `handleApiError`
  - Prisma query patterns for user data

- **Rendering:**
  - Canvas API rendering patterns from existing games
  - Theme integration using `applyThemeToCanvas` utility
  - Particle effects patterns (from Dev Pong, Hack Grid)

**Components to potentially reuse:**
- Canvas rendering structure from `components/games/bit-runner/BitRunnerCanvas.tsx`
- Theme utilities from `lib/theme-utils.ts`
- Theme store from `lib/theme-store.ts`

**Backend logic to reference:**
- User API patterns from `app/api/users/me/route.ts`
- Prisma user queries from existing endpoints

### Follow-up Questions

No follow-up questions needed - all requirements are clear and well-defined.

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

N/A - No visual files found in the visuals folder.

## Requirements Summary

### Functional Requirements

**Core Functionality:**
- Display up to 10 Dev Orbs (representing recently logged-in users) falling from the top with physics
- Orbs can be dragged and thrown by the user
- Basketball basket fixed at top center, below header
- Collision detection when orb enters basket triggers visual effects (fireworks, particles, glow)
- Physics engine (Matter.js) with gravity, bounce, friction, and collision between orbs
- Theme-aware visual styling (Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal, Blueprint Dev)
- Sequential spawn: 1 orb per second until 10 total
- No scroll - physics area fits within viewport (viewportHeight - headerHeight)

**User Actions:**
- Drag orbs with mouse/touch
- Throw orbs by dragging and releasing
- Catch orbs mid-air
- Attempt trick shots
- Reset area (button to clear)

**Backend Requirements:**
- Create `/api/users/recent` endpoint returning last 10 users logged in within 5 minutes
- Include: avatar, userId, lastLogin, username
- Cache for 5-10 seconds
- Fallback to 5-10 fake styled profiles if no users available
- Always return <=10 users

**Visual Effects:**
- Fireworks/particles on basket hit (theme-aware)
- Optional sound (muted by default)
- Explosive neon/pixel particles
- Micro animation of basket "shaking"
- HUD message: "Você acertou o DevBall!"

**Performance:**
- Maximum 10 orbs
- Maximum 1-2 firework effects simultaneously
- Disable shadows on mobile
- Fallback to static images if FPS < 40
- Low-power mode for Matter.js on mobile

### Reusability Opportunities

- Canvas rendering patterns from existing games (Bit Runner, Dev Pong, Hack Grid)
- Theme system integration (`lib/theme-store.ts`, `lib/themes.ts`, `lib/theme-utils.ts`)
- API route patterns from existing user endpoints
- Prisma query patterns for user data
- Particle effects patterns from existing games
- Responsive canvas sizing patterns

### Scope Boundaries

**In Scope:**
- Physics-based Dev Orbs with user avatars
- Basketball basket with collision detection
- Visual effects on basket hit (fireworks, particles, animations)
- Theme-aware styling for all visual elements
- Drag and throw mechanics
- Sequential spawn system
- `/api/users/recent` endpoint
- Mobile optimizations (shadows off, reduced particles, lower FPS, smaller sprites, reduced elasticity)
- Fallback to fake profiles if no users available

**Out of Scope:**
- XP system
- Badge system
- Leaderboards
- Sound effects (optional, muted by default)
- Zoom functionality
- Canvas resizing by user
- Vertical viewport movement
- Multiple basket positions
- Mass drop events (future feature)
- Advanced reward system (V2)

### Technical Considerations

**Integration Points:**
- Replace hero section on home page (`app/page.tsx`)
- Integrate with existing theme system
- Use existing header component
- Maintain game grid below physics area

**Technology Stack:**
- Matter.js for physics engine
- Canvas API for rendering
- Next.js 14 App Router
- React with client components
- TailwindCSS for styling
- Theme system (Zustand store + CSS variables)
- Prisma for database queries

**Performance Constraints:**
- Physics area must fit within viewport (no scroll)
- Maximum 10 orbs to maintain performance
- Mobile optimizations required
- FPS monitoring and fallback to static images if needed

**Similar Code Patterns to Follow:**
- Canvas rendering from `components/games/bit-runner/BitRunnerCanvas.tsx`
- Theme integration from existing games
- API route structure from `/api/users/me/route.ts`
- Error handling patterns from existing endpoints
- Responsive design patterns from existing game pages

**Layout Structure:**
```
[ HEADER FIXO ]
[ CESTA + ÁREA DE FÍSICA (viewportHeight - headerHeight, sem scroll) ]
[ GRID DE JOGOS ]
```

**Physics Properties:**
- gravityY = 1.2–1.6
- restitution (elasticity) = 0.6–0.8 (perereca effect)
- frictionAir = low
- Collisions between orbs enabled
- Invisible side walls
- Bottom limit (floor)

**Spawn Behavior:**
- Spawn at top, random horizontal position
- Falls smoothly with physics
- Can hit basket if falls on same side
- User can interact immediately on spawn
- Sequential: 1 per second until 10 total

**Theme Variants:**
- Cyber Hacker: green balls with glitch, basket with scanlines, matrix rain fireworks
- Pixel Lab: 8-bit balls, pixel square fireworks, NES-style basket
- Neon Future: super bright balls, neon trail, basket with bloom effect
- Terminal: ASCII '()' balls, basket with #### border, random character fireworks

