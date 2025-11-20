# Specification: Hack Grid

## Goal
Build a logic puzzle game where players connect network nodes by illuminating paths on a 6×6 grid, featuring neon animations, theme-aware styling, and score tracking based on completion time, efficiency, and difficulty.

## User Stories
- As a player, I want to connect network nodes by clicking and dragging to form paths so that I can solve logic puzzles with intuitive controls
- As a player, I want my score to reflect both speed and efficiency so that I'm rewarded for completing puzzles quickly with minimal wasted moves
- As a player, I want neon-illuminated paths and pulsing nodes so that the game feels visually engaging and maintains the developer aesthetic

## Specific Requirements

**Grid Layout and Node System**
- Fixed 6×6 grid layout for MVP (fits viewport without scroll)
- Nodes positioned at grid intersections or specific cell positions
- Each node represents a server/router with pixelated visual style
- Grid must fit within viewport accounting for fixed header
- Responsive sizing for mobile and desktop screens

**Connection Mechanics**
- Click/tap on source node and drag to destination node to create path
- Alternative: tap source node, then tap destination node (two-tap selection)
- Paths illuminate with neon glow effect when connection is made
- Only straight-line connections allowed (grid-aligned, no curves)
- Optional: double-tap to undo/remove a path connection
- Prevent connections that don't follow grid lines

**Level System**
- 5-10 predefined static levels stored in JSON format
- Each level defines: node positions, required connections, level difficulty
- Level structure: `{ level, nodes: [{row, col, type?}], requiredConnections: [{from, to}], difficulty }`
- Store levels in `lib/games/hack-grid/levels.json`
- Always start at level 1, unlock next level on completion
- Level selector UI must not cause scroll (compact design)

**Scoring System**
- Score calculation: combines completion time, moves/segments used, level difficulty, efficiency bonus
- Formula: `score = (timeBonus) + (efficiencyBonus) + (difficultyMultiplier)`
- Track: duration (ms), moves (count), segments (path segments used), levelId (number)
- Efficiency bonus: reward for minimal wasted paths (no unnecessary connections)
- Submit to API: `{ gameId: "hack-grid", score, duration, moves, level: levelId, metadata: { segments } }`
- Store best score per level in localStorage and database

**Visual Effects and Animations**
- Path illumination: neon glow effect when connection is established (theme-aware color)
- Node pulse: smooth pulsing animation on active/selected nodes
- Completion animation: light flash + glow effect when puzzle is solved
- Theme-specific effects: neon glow (Neon Future), pixel grain (Pixel Lab), scanlines (Cyber Hacker), ASCII lines (Terminal), blueprint lines (Blueprint)
- Maintain 60 FPS performance (limit effects to avoid lag)
- No advanced particles, animated data packets, or complex shaders in MVP

**Network-Themed Visual Style**
- Nodes styled as pixelated servers/routers (8-bit aesthetic)
- Connections styled as illuminated data links (neon lines)
- Theme-aware colors: adapt node and path colors to current theme
- Visual metaphor: digital network infrastructure (no non-tech metaphors like pipes, rails, water)
- Grid background: subtle network pattern or minimal design

**Controls Implementation**
- Mouse: click and drag to connect nodes (primary desktop control)
- Touch: tap and drag, or tap-to-tap selection (mobile control)
- Optional: double-tap to undo path (can be disabled if too complex)
- No keyboard navigation in MVP (mouse/touch only)
- Input area must fit viewport without causing scroll
- Debounce rapid inputs to prevent accidental connections

**Game State Management**
- Track current level (number)
- Track node positions and states (active, connected, completed)
- Track connections made: array of `{from: nodeId, to: nodeId}` pairs
- Track game start time and duration
- Track moves count and segments used
- Track completion status (all required connections made)
- Structure prepared for future server-side validation

**Canvas Rendering**
- Use Canvas API for rendering (lighter than Pixi.js for this game)
- Render 6×6 grid with nodes at positions
- Render connections as illuminated lines between nodes
- Render node pulse animations and path glow effects
- Maintain 60 FPS with optimized rendering
- Theme-aware color application using CSS variables
- Responsive canvas sizing (fit viewport with header)

**Game Flow and UI**
- Initialize at level 1 on game start
- Player connects nodes to solve puzzle
- Game ends when all required connections are completed
- Show completion animation (flash + glow)
- Display game over modal with final score, time, moves, efficiency
- Option to play again (restart current level) or go to next level
- Submit score to API when authenticated
- Store best score per level in localStorage
- Level selector UI (compact, no scroll)

**Layout and Page Structure**
- Route: `/app/jogos/hack-grid/page.tsx`
- Follow UI/UX Guidelines: h-screen layout without vertical scroll
- Header with back link and title (fixed)
- Score display HUD: current score, best score, time, moves (compact)
- Centered game canvas area (fits viewport)
- Game over modal with score display and actions
- Theme-aware styling throughout
- Responsive layout for mobile and desktop

## Visual Design
No visual assets provided.

## Existing Code to Leverage

**`app/jogos/terminal-2048/page.tsx`**
- Game page layout structure: header with back link, title, HUD, game area
- Score tracking and display pattern
- Game over detection and modal triggering
- Score submission to API pattern
- Theme-aware container and styling

**`components/games/terminal-2048/ScoreDisplay.tsx`**
- Score HUD component structure with responsive sizing
- Theme-aware styling using CSS variables
- Best score display pattern
- Adapt to show time, moves, and efficiency metrics

**`components/games/terminal-2048/GameOverModal.tsx`**
- Modal component structure with AnimatePresence
- Backdrop blur and click-to-close behavior
- Score display layout (final score, best score)
- Action buttons: "Play Again", "Back to Home"
- Theme-aware styling with bg-page-secondary, border-border
- Framer Motion animations

**`lib/games/debug-maze/mazes.json` and `lib/games/debug-maze/game-logic.ts`**
- Predefined level storage pattern (JSON format)
- Level loading functions: `loadMazeByLevel()`, `loadDefaultMaze()`, `getTotalMazes()`
- Level data structure pattern for storing node positions and requirements
- Adapt pattern for Hack Grid levels with nodes and required connections

**`components/games/bit-runner/BitRunnerCanvas.tsx`**
- Canvas API rendering pattern with pixel art
- Theme-aware color application
- 60 FPS optimization techniques
- Animation frame management
- Grid-based rendering patterns

**`app/jogos/dev-pong/page.tsx`**
- Mouse and touch input handling patterns
- Click and drag interaction implementation
- Canvas container ref and event handling
- Control debouncing patterns

**`app/api/scores/route.ts`**
- POST endpoint for score submission
- Score validation with Zod schemas
- Metadata structure for game-specific data (segments, levelId)
- Authentication and rate limiting patterns

## Out of Scope
- Multiplayer functionality
- Power-ups or special abilities
- Special node types (firewalls, switches, teleporters)
- Complex particle systems or advanced shader effects
- Animated data packets moving along paths
- Continuous animated trails or volumetric lighting
- Procedural level generation (future "Endless Hacker" mode)
- Multiple grid sizes (5×5, 8×8) - future enhancement
- Keyboard navigation (mouse/touch only in MVP)
- Complex gestures or advanced snapping mechanics
- Curved lines (only straight grid-aligned connections)
- Zoom/scroll functionality
- Individual node animations beyond pulse
- Large levels that break layout or require scrolling

