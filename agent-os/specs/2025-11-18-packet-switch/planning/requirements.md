# Spec Requirements: Packet Switch

## Initial Description

Tenth Game: Packet Switch — Create routing logic game where players direct packets, with network particle animations, theme integration, and score tracking.

## Requirements Discussion

### First Round Questions

**Q1:** I assume players direct packets by clicking/tapping on network nodes (routers/switches) to route packets from a source to a destination. Is that correct, or should it work differently (e.g., drag packets along paths, configure routing tables, or another method)?

**Answer:**
- ✔ O jogador clica/toca nos nós (routers) para guiar o próximo salto do pacote.
- Fluxo ideal: Pacote nasce em SOURCE → Jogador toca no próximo nó da rota → Pacote percorre automaticamente o link → Jogador toca no próximo nó → Até chegar no DESTINATION
- Justificativa: Simples, direto, compatível com mobile, evita complexidade de routing tables, extremamente visual
- ❌ Dragging manual de pacotes → polui a UX
- ❌ Configurar routing table → avançado demais pro MVP
- ⚠️ Ajuste de UI: nós devem ficar dentro da área visível sem scroll.

**Q2:** I'm thinking the game uses a network topology layout (nodes connected by links) rather than a strict grid. Should we start with a fixed topology (e.g., 6-8 nodes with predefined connections), or support multiple network layouts per level?

**Answer:**
- ➡️ Decisão final: ✔ Começar com um topologia fixa por nível, NÃO grid. ✔ 6–8 nós por puzzle.
- Cada nível tem: nodes com posições XY, links pré-definidos, source, destination, pacotes a enviar
- Por quê não procedural ainda? É difícil balancear layouts válidos com routing real antes de ter UX testado.
- ⚠️ Tamanho e posicionamento dos nodes deve respeitar viewport para não gerar scroll.

**Q3:** I assume scoring is based on successfully routing packets to their destinations, with bonuses for speed, efficiency (fewer hops), and handling multiple packets simultaneously. Should we track: completion time, number of packets routed, average hops per packet, and level difficulty? Or focus on completion time and packet count only?

**Answer:**
- ➡️ Decisão final: Score calculado sobre: ✔ Número de pacotes entregues, ✔ Tempo total, ✔ Eficiência de rota (hops médios), ✔ Dificuldade do nível
- O backend deve armazenar: packetsDelivered, averageHops, duration, moves (toques do usuário), levelId
- Para ranking, usamos: scoreFinal = packetsDelivered * dificuldade / averageHops – durationPenalty
- Simples, elegante, justo.
- ⚠️ HUD de score/time deve caber sem deslocar o canvas (sem scroll).

**Q4:** I'm thinking controls should be mouse/touch for desktop and mobile (click/tap nodes to route packets). Should we also support keyboard navigation (arrow keys to select nodes, Enter/Space to route), or keep it mouse/touch only?

**Answer:**
- ➡️ Decisão final: ✔ Mouse/touch apenas. Clique/tap nos nós para direcionar pacotes.
- ❌ Nada de controles com teclado no MVP. Não é natural nesse tipo de jogo.
- Podemos adicionar mais tarde como acessibilidade.
- ⚠️ Área clicável dos nós não pode ultrapassar bordas da viewport.

**Q5:** I assume the game has predefined levels/scenarios with specific packet routing challenges (e.g., route 5 packets from A to B, handle packet collisions, prioritize certain packets). Should we start with 5-10 fixed levels, or include procedural generation from the start?

**Answer:**
- ➡️ Decisão final: ✔ 5–10 níveis pré-definidos. Cada um ensina e escala algo:
  - Rota simples
  - 2 pacotes
  - Colisão de pacotes
  - Prioridade de pacote
  - Múltiplos destinos
  - Ramificações
  - Gargalo
  - Topologia complexa
  - Pacotes simultâneos
  - Caos final
- Procedural só entra em V3.
- ⚠️ UI de seleção de nível deve evitar scroll.

**Q6:** For network particle animations, I'm thinking: packets as animated particles moving along network paths, glow effects on active nodes, particle trails showing packet routes, and completion animations. Should we include all of these, or focus on packet particles and simple node glows for the initial version?

**Answer:**
- ➡️ Decisão final:
  - ✔ Pacotes como partículas em movimento
  - ✔ Nodes com glow quando ativos
  - ✔ Links iluminam durante transmissão
  - ✔ Ao completar um pacote → pequeno "pop" de luz
  - ✔ Ao completar o nível → animação rápida neon
- Foco do MVP: partículas fluindo, glow básico, animação de chegada
- ⚠️ Partículas precisam ser leves para não romper o layout nem criar scroll extra.

**Q7:** I assume the visual style uses network-themed elements (nodes as routers/switches, links as network connections, packets as data particles) with particle effects that adapt to the current theme (Cyber Hacker, Pixel Lab, Neon Future, etc.). Is that correct, or should we use a different visual metaphor?

**Answer:**
- ➡️ Decisão final: ✔ visual de rede digital:
  - nodes = routers/switches estilizados (pixel, neon ou glitch)
  - links = cabos/luzes conectores
  - pacotes = partículas brilhantes
  - estética adaptada ao tema corrente (Neon, Cyber, Pixel, Terminal)
- ❌ Não usar metáforas físicas (caixas, carros, tubulações etc.)
- ⚠️ Layout responsivo precisa impedir scroll no desktop (header fixo).

**Q8:** Is there anything that should NOT be included in this initial version? For example: multiplayer, power-ups, special packet types (priority packets, encrypted packets), complex routing algorithms, or other advanced features?

**Answer:**
- Para manter o jogo simples e focado:
  - ❌ multiplayer
  - ❌ power-ups
  - ❌ pacotes especiais (prioridade, encriptados)
  - ❌ colisões avançadas baseadas em física
  - ❌ algoritmos de roteamento real (Dijkstra, OSPF, etc.)
  - ❌ congestão dinâmica
  - ❌ tabelas de rotas customizáveis
  - ❌ geração procedural
- Só entra o núcleo do puzzle manual.
- ⚠️ Evitar features que afetem o tamanho da área jogável → sem scroll.

### Existing Code to Reference

**Similar Features Identified:**

Based on user input, the following patterns and components can be reused:

- **Game Page Structure:**
  - Layout de jogo (igual Hack Grid, Labirinto, Terminal 2048)
  - HUD no topo
  - Canvas central
  - Modal de conclusão
  - Botões fixos
  - Container theme-aware
  - Já responsivo e sem scroll

- **UI Components:**
  - HUD components: ScoreBox, Timer, Moves, Melhor Score
  - GameOverModal component pattern (from Terminal 2048, Dev Pong, Bit Runner)
  - ScoreDisplay component structure

- **Game Logic Patterns:**
  - Game state management pattern from Terminal 2048
  - Score calculation patterns
  - Level progression system

- **Rendering:**
  - Canvas API rendering pattern from Bit Runner/Dev Pong
  - Theme-aware color system using CSS variables
  - 60 FPS optimization patterns
  - Glow effects and particle animations (reuse from Hack Grid)

- **Controls:**
  - Mouse/touch handler
  - Remapeamento de clicks por coordenadas
  - Input handling pattern from Dev Pong/Bit Runner

- **Theme System:**
  - Glows, neon, pixel-filter, scanline, blueprints
  - Theme effects: glow, pulse, linha iluminada (reuse do Hack Grid)
  - CSS variables for theme-aware styling

- **Score Submission:**
  - POST /api/scores endpoint (already exists)
  - Score validation with Zod schemas
  - Metadata structure for game-specific data (packetsDelivered, averageHops, duration, moves, levelId)

**Components to potentially reuse:**
- ScoreDisplay component structure
- GameOverModal component structure
- Game page layout template
- Canvas rendering utilities
- Theme-aware styling patterns
- Input handlers (touch and mouse)
- Particle animation utilities from Hack Grid

**Backend logic to reference:**
- POST /api/scores endpoint
- Score validation with Zod
- Metadata structure for game-specific data

### Follow-up Questions

No follow-up questions needed. All requirements were clearly specified.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
No visual assets to analyze.

## Requirements Summary

### Functional Requirements

- **Core Gameplay:**
  - Routing logic game where players direct packets through a network
  - Click/tap on nodes (routers) to guide the next hop of the packet
  - Flow: Packet spawns at SOURCE → Player taps next node in route → Packet automatically travels the link → Player taps next node → Until reaching DESTINATION
  - Fixed topology per level (6-8 nodes), NOT grid-based
  - Each level has: nodes with XY positions, predefined links, source, destination, packets to send
  - 5-10 predefined levels with progressive difficulty:
    - Simple route
    - 2 packets
    - Packet collisions
    - Packet priority
    - Multiple destinations
    - Branches
    - Bottleneck
    - Complex topology
    - Simultaneous packets
    - Final chaos

- **Scoring System:**
  - Score calculation based on: packets delivered, total time, route efficiency (average hops), level difficulty
  - Formula: scoreFinal = packetsDelivered * dificuldade / averageHops – durationPenalty
  - Backend stores: packetsDelivered, averageHops, duration, moves (user taps), levelId
  - Submit scores to POST /api/scores endpoint
  - Store best scores locally and in database

- **Visual Effects:**
  - Packets as animated particles moving along network paths
  - Nodes with glow when active
  - Links illuminate during transmission
  - Completion animation: small "pop" of light when packet arrives
  - Level completion: quick neon animation
  - Theme-aware particle effects that adapt to current theme (Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal, Blueprint Dev)
  - Network-themed visual style: nodes as routers/switches (pixelated, neon, or glitch), links as cables/connector lights, packets as bright particles

- **Controls:**
  - Mouse: click on nodes to route packets
  - Touch: tap on nodes to route packets
  - No keyboard navigation in MVP (can be added later for accessibility)

- **Level System:**
  - 5-10 predefined static levels
  - Each level teaches and scales something different
  - Level progression: start at level 1, unlock next on completion
  - Level selector UI (must not cause scroll)

### Reusability Opportunities

- **Layout Components:**
  - Game page structure from Hack Grid, Debug Maze, Terminal 2048
  - HUD at top, canvas in center, completion modal, fixed buttons
  - Theme-aware container, already responsive and no-scroll

- **Rendering:**
  - Canvas API rendering pattern from Bit Runner/Dev Pong
  - Theme-aware color system using CSS variables
  - 60 FPS optimization patterns
  - Glow effects and particle animations (reuse from Hack Grid)
  - Illuminated line effects (reuse from Hack Grid)

- **Backend:**
  - POST /api/scores endpoint (already exists)
  - Score validation with Zod schemas
  - Metadata structure for game-specific data (packetsDelivered, averageHops, duration, moves, levelId)

- **Input Handling:**
  - Touch and mouse handlers from Bit Runner/Dev Pong
  - Click coordinate remapping
  - Control debouncing patterns

- **Visual Systems:**
  - Theme effects: glow, pulse, scanline, pixel dithering
  - Global pulse function based on theme
  - Theme integration patterns from all existing games

- **UI Components:**
  - ScoreDisplay component structure
  - GameOverModal component structure
  - HUD components: ScoreBox, Timer, Moves, Best Score

### Scope Boundaries

**In Scope:**
- Fixed topology per level (6-8 nodes)
- 5-10 predefined levels
- Click/tap on nodes to route packets
- Packet particles moving along paths
- Node glow when active
- Links illuminate during transmission
- Completion animations (packet arrival pop, level completion neon)
- Score tracking (packets delivered + time + hops + difficulty)
- Theme-aware styling (all 5 themes)
- Network-themed visual style (routers/switches, connector lights, bright particles)
- Score submission to API
- Game over modal with score display
- No scroll layout (fits viewport with fixed header)
- Light particle effects (performance optimized)

**Out of Scope:**
- Multiplayer functionality
- Power-ups or special abilities
- Special packet types (priority, encrypted)
- Advanced physics-based collisions
- Real routing algorithms (Dijkstra, OSPF, etc.)
- Dynamic congestion
- Customizable routing tables
- Procedural generation (future: V3)
- Keyboard navigation (future: accessibility feature)
- Manual packet dragging
- Routing table configuration
- Complex particle systems that break layout
- Physical metaphors (boxes, cars, pipes, etc.)
- Grid-based layout
- Features that affect playable area size (must prevent scroll)

### Technical Considerations

- **Integration Points:**
  - Theme system: use CSS variables and theme tokens
  - Score API: POST /api/scores with gameId="packet-switch"
  - Game configuration: add to `lib/games.ts` (already exists)
  - Route: `/app/jogos/packet-switch/page.tsx`

- **Existing System Constraints:**
  - Must fit viewport without scroll (fixed header consideration)
  - Canvas size must be responsive and fit mobile/desktop
  - Theme system integration required (all 5 themes)
  - Score validation follows existing Zod schema patterns
  - Authentication required for score submission
  - Node clickable areas must not exceed viewport boundaries
  - HUD/score display must not cause canvas displacement or scroll

- **Technology Preferences:**
  - Canvas API for rendering (lighter than Pixi.js for this game)
  - Framer Motion for UI animations (modals, transitions)
  - TailwindCSS for styling
  - React hooks for state management
  - TypeScript for type safety
  - Light particle system (performance optimized)

- **Similar Code Patterns to Follow:**
  - Game state management pattern from Terminal 2048
  - Canvas rendering pattern from Bit Runner/Dev Pong
  - Input handling pattern from Dev Pong/Bit Runner
  - Score submission pattern from Terminal 2048/Bit Runner
  - Modal component pattern from Terminal 2048/Dev Pong
  - Theme integration pattern from all existing games
  - Particle animation pattern from Hack Grid
  - Illuminated line effects from Hack Grid

- **Performance Considerations:**
  - Maintain 60 FPS with particle animations
  - Optimize canvas rendering
  - Keep particle effects light to avoid performance issues and layout problems
  - Ensure smooth animations without lag
  - Prevent particle system from breaking layout or creating extra scroll

- **Layout Constraints:**
  - Zero scroll on desktop (critical requirement)
  - Fixed header must be accounted for in layout
  - Network topology (6-8 nodes) must fit in viewport
  - HUD/score display must not cause overflow
  - Level selector must not create scroll
  - Node clickable areas must not exceed viewport boundaries
  - Node size and positioning must respect viewport to prevent scroll

