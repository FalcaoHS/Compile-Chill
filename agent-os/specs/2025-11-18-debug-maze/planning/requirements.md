# Spec Requirements: Debug Maze

## Initial Description

Seventh Game: Debug Maze — Create maze game where players guide a "bug" to the patch, with retro pixel theme, score tracking, and theme-aware styling.

## Requirements Discussion

### First Round Questions

**Q1:** I assume the player controls a "bug" character that moves through a maze to reach the "patch" goal. Should movement be grid-based (cell-by-cell) or free/smooth movement?

**Answer:** Grid-based movement. Reasons: combines with retro pixel art, simple controls, clear logic for score validation, easy to generate predefined and procedural levels later, maintains high performance. Final decision: ✔ cell-by-cell movement, ✔ short "hop" animation between cells (2-4 frames), ❌ no free/smooth continuous movement in this phase.

**Q2:** Should the maze be procedurally generated each game or have predefined levels?

**Answer:** Start with predefined levels. Flow for MVP: 5-10 fixed mazes (small/medium), layout saved in JSON, progression: always starts at level 1, procedural enters as "infinite mode" in the future. Final decision: ✔ predefined first, ❌ no procedural generation yet.

**Q3:** Should scoring be based on time to complete, number of moves, or both?

**Answer:** Score = combination of time + moves. Simple formula suggested: `score = max(1, (tempoMax - tempoUsado)) + bonusPorMovimentos`. Or even simpler: less time = higher score, fewer moves = bonus. Data sent to backend: duration, moves, pathLength (optional), level. Final decision: ✔ combine time + moves, ❌ don't use only time or only moves.

**Q4:** Should controls be keyboard (arrows/WASD) and touch (swipe) like other games?

**Answer:** Same as other games for consistency. Desktop: ✔ Arrows, ✔ WASD. Mobile: ✔ Swipe (4 directions). Also adds comfort: optional numeric keypad support, "restart level" button with R shortcut.

**Q5:** Should the "bug" and "patch" have pixel art sprites, and the maze have a pixelated look?

**Answer:** Yes — pure pixel art, but influenced by current theme. Characters: Bug (player): sprite 12-16px, 2-3 frame movement animation, pixel eyes blinking, color adapted to theme (e.g., neon blue in Neon Future). Patch (goal): pixel "patch" icon (like an 8-bit correction symbol), micro shine/light glow, looping animation: "pulse". Maze: walls with minimalist pixel texture, color affected by theme (e.g., green-matrix, blue-neon, cyan-terminal), simple floor. Final decision: ✔ 8-bit coherent pixel art, ✔ theme-aware visual, ❌ no 3D, heavy shaders or complex sprites.

**Q6:** Should there be obstacles in the maze (like "errors", "warnings") or just walls?

**Answer:** For initial version: ➡️ Just walls. Nothing else. No "errors", "warnings", traps, rotators, moving walls, doors. Final decision: ✔ walls only, ❌ extra obstacles for now.

**Q7:** Should there be multiple difficulty levels (easy/medium/hard) or automatic progression?

**Answer:** One single medium level for MVP. Later: easy level for onboarding, difficult levels with larger mazes, procedural. Final decision: ✔ single difficulty for now, ❌ difficulty selectors (V2).

**Q8:** Is there anything that should NOT be included in this initial version? For example: multiplayer, power-ups, complex animations, etc.?

**Answer:** Explicitly not included now: ❌ multiplayer, ❌ power-ups, ❌ special abilities, ❌ mobile enemies, ❌ complex animations (advanced shake, heavy particles), ❌ procedural generation, ❌ skin system, ❌ cutscenes, ❌ giant maps, ❌ mazes with doors/keys, ❌ life system or penalty (hit = simple reset). The rule is: Keep retro, clean, fast, fun.

### Existing Code to Reference

**Similar Features Identified:**

Based on codebase analysis, the following patterns and components can be reused:

- **Game Page Structure:**
  - `app/jogos/terminal-2048/page.tsx` - Layout structure: header with back link, title, HUD, game area, instructions footer
  - `app/jogos/dev-pong/page.tsx` - Canvas rendering integration pattern
  - `app/jogos/bit-runner/page.tsx` - Game loop with requestAnimationFrame pattern
  - `app/jogos/crypto-miner-game/page.tsx` - Help panel lateral pattern (UI/UX Guidelines)

- **UI Components:**
  - `components/games/terminal-2048/ScoreDisplay.tsx` - Score HUD component structure, responsive sizing, theme-aware styling
  - `components/games/terminal-2048/GameOverModal.tsx` - Modal component with AnimatePresence, backdrop blur, score display, action buttons (Play Again, Back to Home)
  - `components/games/bit-runner/GameOverModal.tsx` - Similar modal pattern with final score and best score display

- **Game Logic Patterns:**
  - `lib/games/terminal-2048/game-logic.ts` - Game state management pattern, score calculation
  - `lib/games/bit-runner/game-logic.ts` - Grid-based movement patterns, collision detection
  - `lib/games/dev-pong/game-logic.ts` - Game state structure for server-side validation

- **Rendering:**
  - `components/games/bit-runner/BitRunnerCanvas.tsx` - Canvas API rendering with pixel art, theme-aware colors, 60 FPS optimization
  - `components/games/dev-pong/PongCanvas.tsx` - Canvas rendering pattern for simple games

- **Controls:**
  - Keyboard controls pattern from Terminal 2048 (arrow keys)
  - Touch/swipe controls pattern from Bit Runner (swipe detection)
  - Control debouncing patterns

- **Score Submission:**
  - API integration pattern from Bit Runner and Terminal 2048
  - Score metadata structure (duration, moves, level)

- **UI/UX Guidelines:**
  - `agent-os/specs/UI_UX_GUIDELINES.md` - Layout patterns: h-screen without vertical scroll, lateral help panel, floating help button

**Components to potentially reuse:**
- ScoreDisplay component structure
- GameOverModal component structure
- Game page layout template
- Canvas rendering utilities
- Control handling utilities
- Score submission API pattern

**Backend logic to reference:**
- Score submission endpoint pattern
- Game state validation structure (for future feature 5b)

### Follow-up Questions

No follow-up questions needed. All requirements were clearly specified.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
No visual assets to analyze.

## Requirements Summary

### Functional Requirements

**Core Gameplay:**
- Grid-based movement (cell-by-cell)
- Player controls a "bug" character (12-16px sprite)
- Goal is to reach the "patch" (8-bit correction symbol icon)
- 5-10 predefined mazes stored in JSON format
- Always starts at level 1
- Movement animation: short "hop" between cells (2-4 frames)
- Bug sprite: 2-3 frame movement animation, blinking pixel eyes
- Patch sprite: looping "pulse" animation with micro glow

**Scoring System:**
- Score = combination of time + moves
- Formula: `score = max(1, (tempoMax - tempoUsado)) + bonusPorMovimentos`
- Less time = higher score
- Fewer moves = bonus
- Data tracked: duration, moves, pathLength (optional), level

**Controls:**
- Desktop: Arrow keys, WASD, optional numeric keypad
- Mobile: Swipe (4 directions: up, down, left, right)
- Restart level: R key shortcut + button
- Debounce rapid inputs

**Visual Design:**
- 8-bit pixel art style
- Theme-aware colors (bug color adapts to current theme)
- Walls: minimalist pixel texture, color affected by theme
- Floor: simple pixel design
- Bug sprite: 12-16px, theme-adapted colors
- Patch sprite: 8-bit correction symbol with pulse animation
- No 3D, heavy shaders, or complex sprites

**Maze Structure:**
- Only walls (no obstacles, traps, moving elements)
- Predefined layouts in JSON
- Small to medium size for MVP
- Simple collision detection (wall = can't move)

**Difficulty:**
- Single medium difficulty level for MVP
- No difficulty selector in initial version

**Game Flow:**
- Start at level 1
- Complete maze by reaching patch
- Show score (time + moves)
- Option to restart level (R key)
- Game over modal with final score
- Submit score to API when authenticated

### Reusability Opportunities

**Components to Reuse:**
- `ScoreDisplay` component pattern from Terminal 2048
- `GameOverModal` component pattern from Terminal 2048/Bit Runner
- Game page layout structure from existing games
- Canvas rendering utilities from Bit Runner
- Control handling patterns (keyboard + touch) from Bit Runner
- Score submission API integration pattern

**Backend Patterns:**
- Score submission endpoint structure
- Game state structure for future validation
- Metadata tracking (duration, moves, level)

**UI/UX Patterns:**
- Layout: h-screen without vertical scroll (UI/UX Guidelines)
- Lateral help panel (from Crypto Miner)
- Floating help button pattern
- Theme-aware styling throughout

**Code Structure:**
- Game logic in `lib/games/debug-maze/game-logic.ts`
- Canvas component in `components/games/debug-maze/DebugMazeCanvas.tsx`
- UI components in `components/games/debug-maze/`
- Game page in `app/jogos/debug-maze/page.tsx`

### Scope Boundaries

**In Scope:**
- Grid-based maze navigation
- 5-10 predefined mazes (JSON format)
- Bug character with pixel art sprite (12-16px)
- Patch goal with pixel art sprite
- Movement animation (2-4 frame hop)
- Theme-aware visual styling
- Score calculation (time + moves)
- Keyboard controls (arrows, WASD, R for restart)
- Touch controls (swipe 4 directions)
- Game over modal with score display
- Score submission to API
- Help panel lateral (following UI/UX Guidelines)
- Responsive layout (mobile and desktop)
- LocalStorage for best score per level

**Out of Scope:**
- Procedural maze generation (future feature)
- Multiple difficulty levels (future feature)
- Obstacles beyond walls (errors, warnings, traps)
- Power-ups
- Special abilities
- Mobile enemies
- Complex animations (advanced shake, heavy particles)
- Skin system
- Cutscenes
- Giant maps
- Mazes with doors/keys
- Life system or penalties
- Multiplayer
- Advanced visual effects (3D, heavy shaders)
- Complex sprites

### Technical Considerations

**Rendering:**
- Use Canvas API (lighter than Pixi.js for this simple game)
- Maintain 60 FPS performance
- Pixel art style with theme-aware colors
- Simple animations (2-4 frames for movement)

**Game State:**
- Track bug position (grid coordinates: row, col)
- Track patch position (grid coordinates)
- Track maze layout (walls array from JSON)
- Track moves count
- Track start time and duration
- Track current level
- Track path taken (optional, for pathLength)
- Structure for future server-side validation

**Maze Data Structure:**
- JSON format for predefined mazes
- Structure: `{ level: number, width: number, height: number, walls: number[][], start: {row, col}, patch: {row, col} }`
- Store in `lib/games/debug-maze/mazes.json` or similar

**Controls:**
- Keyboard: Arrow keys, WASD for movement, R for restart
- Touch: Swipe detection (30px threshold like Bit Runner)
- Debounce rapid inputs
- Prevent movement during animation

**Theme Integration:**
- Use theme tokens for colors
- Bug sprite color adapts to current theme
- Wall colors affected by theme
- Patch glow color matches theme
- Apply theme-specific effects (neon glow for Neon Future, pixel grain for Pixel Lab, etc.)
- Respond to theme changes in real-time

**Score Calculation:**
- Formula: `score = max(1, (tempoMax - tempoUsado)) + bonusPorMovimentos`
- Or simpler: time-based score + move bonus
- Send to API: `{ duration, moves, pathLength?, level }`

**Performance:**
- Optimize canvas rendering
- Efficient collision detection (simple grid check)
- Minimal animation frames (2-4)
- No heavy particle systems

**Similar Code Patterns:**
- Follow game page structure from Terminal 2048/Dev Pong/Bit Runner
- Reuse modal components and patterns
- Maintain consistent HUD/score display style
- Follow existing control handling patterns
- Use same score submission endpoint
- Follow UI/UX Guidelines for layout (h-screen, lateral help panel)

