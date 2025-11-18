# Spec Requirements: Hack Grid

## Initial Description

Sixth Game: Hack Grid — Build logic puzzle game where players connect network nodes by illuminating paths, with neon animations, theme integration, and score tracking.

## Requirements Discussion

### First Round Questions

**Q1:** I assume players connect network nodes by clicking/dragging to create paths between them, and "illuminating paths" means the connections light up with neon effects. Is that correct, or should it work differently (e.g., tap nodes in sequence, drag to draw paths, or another method)?

**Answer:** 
- ✔ O jogador clica/toca em um nó e arrasta até outro para formar um caminho.
- ✔ As conexões formadas iluminam com neon.
- ✔ Também é permitido: toque → toque (seleciona nó de origem, depois nó de destino).
- ❌ Não incluir métodos alternativos (gestos complexos ou snapping avançado) no MVP.
- ⚠️ Lembrete: evitar scroll no desktop, ajustar canvas e header fixo.

**Q2:** I'm thinking the game uses a grid layout (e.g., 5x5, 6x6, or 8x8) with nodes at intersections or specific positions. Should we start with a fixed grid size (like 6x6), or support multiple sizes per level?

**Answer:**
- ➡️ Começar com um tamanho fixo: 6×6.
- Motivos: simples de balancear, bom espaço para puzzles inteligentes, ótimo para telas mobile sem precisar zoom.
- Depois, adicionar: 5×5 (fácil), 8×8 (difícil).
- Decisão final: ✔ MVP = grade única 6×6, ❌ múltiplos tamanhos no início.
- ⚠️ Evitar scroll: garantir que o 6×6 caiba na viewport com header fixo.

**Q3:** I assume scoring is based on completing puzzles (connecting all required nodes) with bonuses for speed and efficiency (fewer moves/path length). Should we track: completion time, number of moves/path segments used, and level difficulty? Or focus on completion time only?

**Answer:**
- ➡️ Riqueza visual e jogo de puzzle pedem múltiplos fatores.
- Score deve considerar: ✔ Tempo de conclusão, ✔ Movimentos / segmentos utilizados, ✔ Dificuldade do puzzle, ✔ Bonus por caminhos eficientes (sem sobras).
- Backend registra: duration, moves, segments, levelId, metadata opcional.
- Decisão final: ✔ usar tempo + eficiência + dificuldade, ❌ não usar apenas tempo.
- ⚠️ Lembre: evitar scroll no desktop ao exibir HUD/score.

**Q4:** I'm thinking controls should be mouse/touch for desktop and mobile (click/tap nodes, drag to connect). Should we also support keyboard navigation (arrow keys to select nodes, Enter/Space to connect), or keep it mouse/touch only?

**Answer:**
- ➡️ Mouse e touch são suficientes no MVP.
- Clique/tap para selecionar nó, arrastar para conectar, toque duplo para desfazer caminho (opcional).
- Keyboard navigation: → não implementar no MVP, só adiciona complexidade e é pouco natural neste tipo de jogo.
- ⚠️ Ajustar área interativa para não ultrapassar viewport → evitar scroll.

**Q5:** I assume the game has predefined levels/puzzles with specific node configurations and connection requirements. Should we start with 5-10 fixed levels, or include procedural generation from the start?

**Answer:**
- ➡️ 5–10 níveis pré-definidos com configurações específicas de nodes e conexões obrigatórias.
- Procedural só mais tarde → para um modo "Endless Hacker".
- Decisão final: ✔ 5–10 níveis estáticos, ❌ procedural no MVP.
- ⚠️ Atenção ao layout do selector de níveis para não criar scroll extra.

**Q6:** For neon animations, I'm thinking: path illumination when connected, pulsing nodes, particle effects along active paths, and a completion animation. Should we include all of these, or focus on path illumination and simple node pulses for the initial version?

**Answer:**
- ➡️ Sim, mas com moderação para manter FPS alto.
- MVP inclui: ✔ path iluminando quando conectado, ✔ pulso suave nos nodes ativos, ✔ animação de "concluído" (flash leve + glow).
- Deixar para depois: ❌ partículas avançadas, ❌ data packets andando pela linha, ❌ distorções complexas de shader, ❌ trilhas animadas contínuas.
- ⚠️ Partículas demais podem exigir aumentar canvas → cuidado com scroll.

**Q7:** I assume the visual style uses network-themed elements (nodes as servers/routers, paths as data connections) with neon glow effects that adapt to the current theme (Cyber Hacker, Pixel Lab, Neon Future, etc.). Is that correct, or should we use a different visual metaphor?

**Answer:**
- ➡️ Usar rede digital + neon é perfeito.
- É 100% coerente com os temas já definidos: Cyber Hacker → verde matrix + scanlines, Pixel Lab → neon pixelado 8-bit, Neon Future → luzes pulsantes, Terminal Minimal → linhas ASCII, Blueprint → traços de engenharia.
- Decisão final: ✔ nodes = "servidores" / "routers" pixelados, ✔ conexões = "links de dados" iluminados, ❌ não usar metáforas não-tech (ex.: canos, trilhos, água).
- ⚠️ O grid deve caber na tela SEM rolagem.

**Q8:** Is there anything that should NOT be included in this initial version? For example: multiplayer, power-ups, special node types (firewalls, switches), complex particle systems, or other advanced features?

**Answer:**
- Para deixar simples, elegante e rápido:
- ❌ multiplayer, ❌ power-ups, ❌ firewalls, switches, teletransportes, ❌ níveis enormes que quebram o layout, ❌ partículas complexas, ❌ zoom/scroll, ❌ nodes animados individualmente demais, ❌ linha curva (somente linhas retas no grid).
- ⚠️ Lembrete final: manter zero scroll no desktop.

### Existing Code to Reference

**Similar Features Identified:**

Based on codebase analysis and user input, the following patterns and components can be reused:

- **Game Page Structure:**
  - `app/jogos/terminal-2048/page.tsx` - Layout structure: header with back link, title, HUD, game area, instructions footer
  - `app/jogos/dev-pong/page.tsx` - Canvas rendering integration pattern
  - `app/jogos/bit-runner/page.tsx` - Game loop with requestAnimationFrame pattern
  - `app/jogos/debug-maze/page.tsx` - Layout with fixed header, stats bar, game area, no scroll pattern

- **UI Components:**
  - `components/games/terminal-2048/ScoreDisplay.tsx` - Score HUD component structure, responsive sizing, theme-aware styling
  - `components/games/terminal-2048/GameOverModal.tsx` - Modal component with AnimatePresence, backdrop blur, score display, action buttons (Play Again, Back to Home)
  - `components/games/dev-pong/GameOverModal.tsx` - Similar modal pattern with final score and best score display
  - `components/games/bit-runner/GameOverModal.tsx` - Modal pattern for game completion

- **Game Logic Patterns:**
  - `lib/games/terminal-2048/game-logic.ts` - Game state management pattern, score calculation
  - `lib/games/bit-runner/game-logic.ts` - Grid-based movement patterns, collision detection
  - `lib/games/dev-pong/game-logic.ts` - Game state structure for server-side validation

- **Rendering:**
  - `components/games/bit-runner/BitRunnerCanvas.tsx` - Canvas API rendering with pixel art, theme-aware colors, 60 FPS optimization
  - `components/games/dev-pong/PongCanvas.tsx` - Canvas rendering pattern for simple games

- **Controls:**
  - Touch/swipe controls pattern from Bit Runner (swipe detection)
  - Mouse controls pattern from Dev Pong (click and drag)
  - Control debouncing patterns

- **Score Submission:**
  - `app/api/scores/route.ts` - POST endpoint for score submission
  - API integration pattern from Bit Runner and Terminal 2048
  - Score metadata structure (duration, moves, level, segments)
  - Validation with Zod schemas

- **Theme System:**
  - CSS variables for theme-aware styling
  - Theme effects: glow, scanline, pixel dithering
  - Global "pulse" function based on theme
  - Theme integration patterns from Dev Pong and Bit Runner

- **UI/UX Guidelines:**
  - `agent-os/specs/UI_UX_GUIDELINES.md` - Layout patterns: h-screen without vertical scroll, lateral help panel, floating help button

**Components to potentially reuse:**
- ScoreDisplay component structure
- GameOverModal component structure
- Game page layout template
- Canvas rendering utilities
- Theme-aware styling patterns
- Input handlers (touch and mouse)

**Backend logic to reference:**
- POST /api/scores endpoint
- Score validation with Zod
- Metadata structure for game-specific data

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
No visual assets to analyze.

## Requirements Summary

### Functional Requirements
- **Core Gameplay:**
  - Logic puzzle game where players connect network nodes by illuminating paths
  - Click/tap and drag to connect nodes (or tap-to-tap selection)
  - 6×6 fixed grid layout for MVP
  - 5-10 predefined levels with specific node configurations and required connections
  - Path illumination with neon effects when connections are made
  - Puzzle completion detection when all required connections are made

- **Scoring System:**
  - Score calculation based on: completion time, number of moves/segments used, level difficulty, bonus for efficient paths (no waste)
  - Track: duration, moves, segments, levelId, metadata (optional)
  - Submit scores to POST /api/scores endpoint
  - Store best scores locally and in database

- **Visual Effects:**
  - Path illumination when connected (neon glow)
  - Smooth pulse animation on active nodes
  - Completion animation (light flash + glow)
  - Theme-aware neon effects that adapt to current theme (Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal, Blueprint Dev)
  - Network-themed visual style: nodes as servers/routers (pixelated), connections as data links (illuminated)

- **Controls:**
  - Mouse: click and drag to connect nodes
  - Touch: tap and drag, or tap-to-tap selection
  - Optional: double-tap to undo path
  - No keyboard navigation in MVP

- **Level System:**
  - 5-10 predefined static levels
  - Each level has specific node positions and required connections
  - Level progression: start at level 1, unlock next on completion
  - Level selector UI (must not cause scroll)

### Reusability Opportunities
- **Layout Components:**
  - Game page structure from Terminal 2048/Dev Pong/Bit Runner
  - ScoreDisplay component pattern
  - GameOverModal component pattern
  - Fixed header with back link and title

- **Rendering:**
  - Canvas API rendering pattern from Bit Runner/Dev Pong
  - Theme-aware color system using CSS variables
  - 60 FPS optimization patterns

- **Backend:**
  - POST /api/scores endpoint (already exists)
  - Score validation with Zod schemas
  - Metadata structure for game-specific data (segments, levelId)

- **Input Handling:**
  - Touch and mouse handlers from Bit Runner/Dev Pong
  - Control debouncing patterns

- **Visual Systems:**
  - Theme effects: glow, scanline, pixel dithering
  - Global pulse function based on theme
  - Theme integration patterns

### Scope Boundaries

**In Scope:**
- 6×6 fixed grid layout
- 5-10 predefined levels
- Click/tap and drag connection mechanics
- Path illumination with neon effects
- Node pulse animations
- Completion animation
- Score tracking (time + efficiency + difficulty)
- Theme-aware styling (all 5 themes)
- Network-themed visual style (servers/routers, data links)
- Straight-line connections only (grid-based)
- Score submission to API
- Game over modal with score display
- No scroll layout (fits viewport with fixed header)

**Out of Scope:**
- Multiplayer functionality
- Power-ups or special abilities
- Special node types (firewalls, switches, teleporters)
- Complex particle systems
- Advanced shader effects
- Animated data packets moving along paths
- Continuous animated trails
- Procedural level generation (future: "Endless Hacker" mode)
- Multiple grid sizes (5×5, 8×8) - future enhancement
- Keyboard navigation
- Complex gestures or advanced snapping
- Curved lines (only straight grid lines)
- Zoom/scroll functionality
- Individual node animations beyond pulse
- Large levels that break layout

### Technical Considerations

- **Integration Points:**
  - Theme system: use CSS variables and theme tokens
  - Score API: POST /api/scores with gameId="hack-grid"
  - Game configuration: add to `lib/games.ts` (already exists)
  - Route: `/app/jogos/hack-grid/page.tsx`

- **Existing System Constraints:**
  - Must fit viewport without scroll (fixed header consideration)
  - Canvas size must be responsive and fit mobile/desktop
  - Theme system integration required (all 5 themes)
  - Score validation follows existing Zod schema patterns
  - Authentication required for score submission

- **Technology Preferences:**
  - Canvas API for rendering (lighter than Pixi.js for this game)
  - Framer Motion for UI animations (modals, transitions)
  - TailwindCSS for styling
  - React hooks for state management
  - TypeScript for type safety

- **Similar Code Patterns to Follow:**
  - Game state management pattern from Terminal 2048
  - Canvas rendering pattern from Bit Runner/Dev Pong
  - Input handling pattern from Dev Pong/Bit Runner
  - Score submission pattern from Terminal 2048/Bit Runner
  - Modal component pattern from Terminal 2048/Dev Pong
  - Theme integration pattern from all existing games

- **Performance Considerations:**
  - Maintain 60 FPS with neon animations
  - Optimize canvas rendering
  - Limit particle effects to avoid performance issues
  - Ensure smooth animations without lag

- **Layout Constraints:**
  - Zero scroll on desktop (critical requirement)
  - Fixed header must be accounted for in layout
  - 6×6 grid must fit in viewport
  - HUD/score display must not cause overflow
  - Level selector must not create scroll

