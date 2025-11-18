# Specification: Packet Switch

## Goal
Create a routing logic game where players direct packets through a network by clicking/tapping nodes, featuring network particle animations, theme integration, and score tracking.

## User Stories
- As a developer, I want to route packets through network nodes by clicking on routers so that I can solve routing puzzles and compete on leaderboards
- As a user, I want to see animated particles representing packets moving along network paths so that the game feels dynamic and engaging

## Specific Requirements

**Core Game Mechanics**
- Players click/tap on network nodes (routers) to guide packets from SOURCE to DESTINATION
- Flow: Packet spawns at SOURCE → Player taps next node → Packet automatically travels link → Player taps next node → Until reaching DESTINATION
- Fixed network topology per level (6-8 nodes), NOT grid-based
- Each level has: nodes with XY positions, predefined links, source node, destination node, packets to send
- 5-10 predefined levels with progressive difficulty (simple route, multiple packets, collisions, priority, multiple destinations, branches, bottleneck, complex topology, simultaneous packets, final chaos)

**Game State Management**
- Track game state: current level, nodes array, active packets array, completed packets count, start time, duration, moves (user taps), average hops per packet
- Each packet tracks: current node position, target node, progress along link (0-1), hops count
- Level progression: start at level 1, unlock next level on completion
- Game completion detection when all packets reach destinations

**Scoring System**
- Score formula: scoreFinal = packetsDelivered * difficulty / averageHops – durationPenalty
- Backend stores: packetsDelivered, averageHops, duration, moves, levelId in metadata
- Submit scores to POST /api/scores with gameId="packet-switch"
- Store best scores locally (localStorage) and in database
- Score calculation considers: packets delivered, total time, route efficiency (average hops), level difficulty

**Visual Rendering**
- Canvas API rendering with 60 FPS optimization
- Nodes rendered as routers/switches (pixelated, neon, or glitch style based on theme)
- Links rendered as cables/connector lights between nodes
- Packets rendered as animated particles moving along network paths
- Nodes glow when active (player can interact)
- Links illuminate during packet transmission
- Completion animation: small "pop" of light when packet arrives at destination
- Level completion: quick neon animation overlay
- Theme-aware styling using CSS variables (all 5 themes: Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal, Blueprint Dev)

**Particle Animation System**
- Lightweight particle system for packet movement (performance optimized)
- Particles move along link paths from source node to destination node
- Particle trail effects fade over time
- Maximum particle count limited to prevent performance issues
- Particles adapt to current theme colors

**Input Handling**
- Mouse: click on nodes to route packets
- Touch: tap on nodes to route packets
- Click coordinate remapping to find nodes at canvas position
- Node clickable areas must not exceed viewport boundaries
- No keyboard navigation in MVP (future: accessibility feature)

**UI Components**
- Fixed header with back link, title, and current level indicator
- Score display HUD showing: current score, best score, time (MM:SS), moves count, packets delivered
- Centered game canvas area (responsive, fits viewport)
- Game over modal with final score, time, moves, packets delivered, "Play Again" button, "Next Level" button (if available), "Back to Home" link
- Level selector UI (must not cause scroll)
- All components theme-aware and responsive

**Layout Constraints**
- Zero scroll on desktop (critical requirement)
- Fixed header must be accounted for in layout calculations
- Network topology (6-8 nodes) must fit in viewport
- HUD/score display must not cause canvas displacement or overflow
- Canvas size must be responsive and fit mobile/desktop viewports
- Node size and positioning must respect viewport to prevent scroll

## Visual Design

No visual assets provided.

## Existing Code to Leverage

**Game Page Structure (`app/jogos/hack-grid/page.tsx`, `app/jogos/debug-maze/page.tsx`)**
- Layout pattern: fixed header, HUD bar, centered canvas area, instructions footer
- h-screen flex layout without vertical scroll
- Theme-aware container styling
- Game over modal integration with Framer Motion
- Score submission API integration pattern

**Canvas Rendering (`components/games/hack-grid/HackGridCanvas.tsx`, `components/games/dev-pong/PongCanvas.tsx`)**
- Canvas API rendering with requestAnimationFrame loop
- Theme color system using CSS variables (getThemeColors function)
- 60 FPS optimization patterns
- Responsive canvas sizing with device pixel ratio handling
- Coordinate conversion utilities (gridToCanvas, canvasToGrid, findNodeAtPosition)

**Glow and Illuminated Line Effects (`components/games/hack-grid/HackGridCanvas.tsx`)**
- Node glow effects using ctx.shadowBlur and ctx.shadowColor
- Illuminated connection lines with neon glow (shadowBlur: 8-15, shadowColor from theme)
- Pulse animation for active nodes using sine wave calculations
- Completion animation overlay with globalAlpha

**Particle System (`components/games/dev-pong/PongCanvas.tsx`)**
- Particle array management with lifecycle (life, maxLife, size)
- Particle trail rendering with fading opacity
- Particle limit (max 30) for performance
- Particle culling (remove when life <= 0)

**Game Logic Patterns (`lib/games/hack-grid/game-logic.ts`, `lib/games/terminal-2048/game-logic.ts`)**
- Game state interface structure with level, nodes, timing, metrics
- createInitialGameState function pattern
- Score calculation functions
- Level loading from JSON data
- Game completion detection logic

**Score Submission (`app/api/scores/route.ts`)**
- POST /api/scores endpoint with authentication and rate limiting
- Score validation with Zod schemas (scoreSubmissionSchema)
- Metadata structure for game-specific data (packetsDelivered, averageHops, duration, moves, levelId)
- Best score tracking with isBestScore flag

**UI Components (`components/games/terminal-2048/ScoreDisplay.tsx`, `components/games/terminal-2048/GameOverModal.tsx`)**
- ScoreDisplay component structure with responsive layout
- GameOverModal component with AnimatePresence, backdrop blur, score display, action buttons
- Theme-aware styling using TailwindCSS classes

**Input Handlers (`components/games/dev-pong/PongCanvas.tsx`, `components/games/bit-runner/BitRunnerCanvas.tsx`)**
- Mouse click handlers with coordinate remapping
- Touch event handlers for mobile
- Control debouncing patterns
- Click/tap detection on canvas elements

**Theme System (`lib/theme-store.ts`, CSS variables)**
- Theme store using Zustand
- CSS variables for theme colors (--color-primary, --color-accent, --color-glow, etc.)
- Theme effects: glow, pulse, scanline, pixel dithering
- Global pulse function based on theme

**Game Configuration (`lib/games.ts`)**
- Game entry already exists in GAMES array with id="packet-switch"
- Route: `/jogos/packet-switch`
- Icon: 📡, Category: puzzle

## Out of Scope
- Multiplayer functionality
- Power-ups or special abilities
- Special packet types (priority packets, encrypted packets)
- Advanced physics-based collisions
- Real routing algorithms (Dijkstra, OSPF, etc.)
- Dynamic congestion mechanics
- Customizable routing tables
- Procedural level generation (future: V3)
- Keyboard navigation (future: accessibility feature)
- Manual packet dragging
- Routing table configuration interface
- Complex particle systems that break layout
- Physical metaphors (boxes, cars, pipes, etc.)
- Grid-based layout
- Features that affect playable area size (must prevent scroll)

