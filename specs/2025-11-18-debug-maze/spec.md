# Specification: Debug Maze

## Goal
Build a grid-based maze game where players guide a "bug" character to reach the "patch" goal, featuring retro pixel art aesthetics, theme-aware styling, and score tracking based on time and moves.

## User Stories
- As a player, I want to navigate a maze by moving a bug character cell-by-cell so that I can solve puzzles with clear, retro-style controls
- As a player, I want my score to reflect both speed and efficiency so that I'm rewarded for completing mazes quickly with fewer moves

## Specific Requirements

**Grid-Based Movement System**
- Cell-by-cell movement (no smooth/continuous movement)
- Short "hop" animation between cells (2-4 frames)
- Movement in 4 directions (up, down, left, right)
- Prevent movement during animation to avoid input conflicts
- Simple collision detection: wall = cannot move to that cell

**Maze Data & Levels**
- 5-10 predefined mazes stored in JSON format
- Maze structure: `{ level, width, height, walls: number[][], start: {row, col}, patch: {row, col} }`
- Always start at level 1 for MVP
- Store mazes in `lib/games/debug-maze/mazes.json`
- Small to medium maze sizes for initial version

**Bug Character (Player)**
- 12-16px pixel art sprite
- 2-3 frame movement animation
- Blinking pixel eyes animation
- Color adapts to current theme (e.g., neon blue in Neon Future, cyan in Terminal)
- Position tracked as grid coordinates (row, col)

**Patch Goal**
- 8-bit correction symbol icon (pixel art)
- Looping "pulse" animation
- Micro glow effect matching current theme
- Position tracked as grid coordinates (row, col)

**Scoring System**
- Score = combination of time + moves
- Formula: `score = max(1, (tempoMax - tempoUsado)) + bonusPorMovimentos`
- Less time = higher score component
- Fewer moves = bonus points
- Track: duration (ms), moves (count), pathLength (optional), level (number)
- Submit to API: `{ duration, moves, pathLength?, level }`

**Controls**
- Desktop: Arrow keys, WASD for movement, R key for restart level
- Mobile: Swipe detection (4 directions, 30px threshold like Bit Runner)
- Optional: numeric keypad support
- Debounce rapid inputs to prevent spam
- Restart button visible in UI with R shortcut

**Visual Design & Theme Integration**
- 8-bit pixel art style throughout
- Walls: minimalist pixel texture, color affected by theme
- Floor: simple pixel design
- Bug sprite color adapts to current theme
- Patch glow color matches theme
- Theme-specific effects: neon glow (Neon Future), pixel grain (Pixel Lab), scanlines (Cyber Hacker)
- No 3D, heavy shaders, or complex sprites
- Respond to theme changes in real-time

**Game State Management**
- Track bug position (row, col)
- Track patch position (row, col)
- Track maze layout (walls array from JSON)
- Track moves count
- Track start time and duration
- Track current level
- Track path taken (optional, for pathLength calculation)
- Structure prepared for future server-side validation

**Canvas Rendering**
- Use Canvas API (lighter than Pixi.js)
- Maintain 60 FPS performance
- Render grid-based maze with walls
- Render bug sprite with movement animation
- Render patch sprite with pulse animation
- Optimize rendering for performance

**Game Flow**
- Initialize at level 1
- Player moves bug through maze
- Game ends when bug reaches patch
- Show final score (time + moves)
- Display game over modal with score
- Option to restart level (R key or button)
- Submit score to API when authenticated
- Store best score per level in localStorage

**Layout & UI Components**
- Follow UI/UX Guidelines: h-screen layout without vertical scroll
- Lateral help panel (left side, 320px width, collapsible)
- Floating help button when panel is hidden
- Score display HUD (current score, best score, moves, time)
- Game over modal with final score and actions
- Responsive layout for mobile and desktop
- Theme-aware styling throughout

## Visual Design
No visual assets provided.

## Existing Code to Leverage

**`app/jogos/terminal-2048/page.tsx`**
- Game page layout structure: header with back link, title, HUD, game area, instructions footer
- Score tracking and display pattern
- Game over detection and modal triggering
- Score submission to API pattern
- Theme-aware container and styling

**`components/games/terminal-2048/ScoreDisplay.tsx`**
- Score HUD component structure with responsive sizing
- Theme-aware styling using CSS variables
- Best score display pattern
- Can be adapted to show moves and time in addition to score

**`components/games/terminal-2048/GameOverModal.tsx`**
- Modal component structure with AnimatePresence
- Backdrop blur and click-to-close behavior
- Score display layout (final score, best score)
- Action buttons: "Play Again", "Back to Home"
- Theme-aware styling with bg-page-secondary, border-border
- Framer Motion animations

**`components/games/bit-runner/BitRunnerCanvas.tsx`**
- Canvas API rendering pattern with pixel art
- Theme-aware color application
- 60 FPS optimization techniques
- Animation frame management
- Grid-based rendering patterns

**`lib/games/bit-runner/game-logic.ts`**
- Grid-based movement patterns
- Collision detection logic
- Game state management structure
- Position tracking (can adapt for row/col instead of x/y)

**`app/jogos/crypto-miner-game/page.tsx`**
- Lateral help panel implementation (UI/UX Guidelines)
- Floating help button pattern
- h-screen layout without vertical scroll
- Help panel content structure

## Out of Scope
- Procedural maze generation (future "infinite mode" feature)
- Multiple difficulty levels or difficulty selector
- Obstacles beyond walls (errors, warnings, traps, rotators, moving walls, doors)
- Power-ups or special abilities
- Mobile enemies or dynamic obstacles
- Complex animations (advanced shake, heavy particles, volumetric effects)
- Skin system or character customization
- Cutscenes or story elements
- Giant maps or extremely large mazes
- Mazes with doors, keys, or interactive elements
- Life system or penalties (hit = simple reset)
- Multiplayer functionality
- Advanced visual effects (3D rendering, heavy shaders, complex sprites)
- Sound effects or music (keep minimal or none)

