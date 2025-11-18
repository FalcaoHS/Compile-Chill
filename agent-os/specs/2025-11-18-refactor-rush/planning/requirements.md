# Spec Requirements: Refactor Rush

## Initial Description

"Eighth Game: Refactor Rush — Implement puzzle game where players reorganize 'code blocks' to clean files, with particle effects on moves, theme integration, and score tracking `M`"

## Requirements Discussion

### First Round Questions

**Q1:** I'm assuming players reorganize code blocks by dragging and dropping them into the correct order, similar to a sorting/arrangement puzzle. Is that correct, or should it be a swap-based puzzle (click two blocks to swap), or a sliding puzzle (move blocks into empty spaces)?

**Answer:** 
- ✅ Drag-and-drop for desktop
- ✅ Tap → select → tap → place for mobile
- → Intuitive, fast, consistent with other games
- ❌ Do not use sliding puzzle (15-puzzle style) — too frustrating
- ❌ Do not use select-two-to-swap — less natural for "refactoring" theme
- This mechanic reinforces that the player is literally "dragging code snippets" to reorganize
- ⚠️ Ensure grid + clickable area fit perfectly on screen (no scroll)

**Q2:** I'm assuming the blocks represent code elements like functions, classes, imports, variables, etc., with visual indicators (icons, colors, or labels). Is that correct, or should they represent something else (like file structure, code quality metrics, etc.)?

**Answer:**
- ✅ Blocks represent real code elements:
  - `import {...}`
  - `const variable`
  - `function method()`
  - `class Something {}`
  - `// comments`
  - `return …`
- Each type gets:
  - Thematic icon
  - Specific color/texture
  - Style adapted to active theme (pixel / neon / cyber)
- ❌ Do not use in MVP:
  - Quality metrics
  - File structures
  - Complex dependencies
- These come in future versions
- ⚠️ Blocks must be same size to avoid vertical growth that creates scroll

**Q3:** I'm assuming a grid-based layout (e.g., 3x3, 4x4, or 5x5) where blocks need to be arranged in a specific order or pattern. Is that correct, or should it be a linear arrangement (single row/column) or a more freeform layout?

**Answer:**
- ✅ Grid-based (3×3, 4×4, 5×5) according to difficulty
- → Clean visual
- → Extremely compatible with rest of portal
- → Excellent UX on desktop and mobile
- ❌ Do not use in MVP:
  - Linear puzzles
  - Free layouts
  - Irregular matrices
- Already integrated with grid system used in Hack Grid and Byte Match
- ⚠️ Grid needs to scale with screen size without exceeding viewport

**Q4:** I'm assuming "clean files" means arranging blocks in a logical order (e.g., imports first, then functions, then classes) or matching a target pattern. Is that correct, or is there a different win condition (like grouping related blocks, achieving a code quality score, etc.)?

**Answer:**
- ✅ Player must organize code blocks in correct order, following level rules
- Examples of rules per level:
  - imports → constants → functions → classes
  - comments at top
  - grouping by type
  - alphabetical order of variables
  - matching a target layout (ghost image)
- Game compares:
  - Current grid position
  - with
  - Correct model for that level
- If everything matches → puzzle complete
- ⚠️ Show minimal UI of "expected order" without taking up too much space

**Q5:** I'm assuming particles trigger on each move/reorganization, with theme-aware colors and styles (glow for Cyber Hacker, pixel particles for Pixel Lab, neon trails for Neon Future). Is that correct, or should particles only appear on successful moves or completion?

**Answer:**
- ✅ Particles ONLY when there's a valid action:
  - Block dropped in correct position
  - Block placed different from final position → light particles
  - Puzzle complete → strong thematic animation
- Theme-aware:
  - Cyber Hacker → green particles style "data packets"
  - Pixel Lab → 8-bit square particles
  - Neon Future → streaks and small glows
  - Blueprint → strokes drawing in air
  - Terminal → ASCII characters '+' '#' ':'
- ❌ Do not use:
  - Particles on every movement (too cluttered)
  - Heavy 3D effects
- ⚠️ Effects must be light and not expand bounding box (no scroll generation!)

**Q6:** I'm assuming score is based on moves (fewer moves = higher score), time taken, and possibly bonus points for perfect arrangement or efficiency. Is that correct, or should scoring follow a different formula?

**Answer:**
- ✅ Based on:
  - moves (fewer = better)
  - total time
  - difficulty
  - bonus if player gets it right without undoing many blocks
- Backend stores:
  - moves
  - duration
  - gridSize
  - correctPlacements
  - levelId
- Suggested simple formula:
  - `score = max(1, 500 - moves*4 - duration*2)`
- ⚠️ HUD of timers/moves must be compact to not pressure canvas

**Q7:** I'm assuming drag-and-drop for desktop and tap-to-select then tap-to-place for mobile, with optional keyboard navigation (arrow keys to select, space to swap). Is that correct, or should controls work differently?

**Answer:**
- ✅ Desktop: drag-and-drop
- ✅ Mobile: tap → highlight → tap target
- ✅ "Undo" button (1 level)
- ✅ Optional keyboard shortcuts:
  - Arrows → navigate blocks
  - Space → select
  - Enter → drop
- Not required in MVP, but easy to include
- ⚠️ Grid cannot push anything down (no scroll on desktop)

**Q8:** I'm assuming multiple levels with increasing complexity (more blocks, more complex arrangements, time limits). Is that correct, or should it be a single endless mode with progressive difficulty?

**Answer:**
- ✅ 10 initial levels, growing like this:
  1. 3×3 with 3 blocks out of order
  2. 3×3 with wrong block in middle
  3. 4×4 shuffled
  4. 4×4 with patterns
  5. 5×5 simple
  6. 5×5 with type mix
  7. Code with imports and functions
  8. Code with classes and returns
  9. Long code 5×5 complex
  10. Final puzzle — full refactor
- Later:
  - Endless mode
  - Procedural shuffle
  - "Language-specific" levels (TS, Python, Go)
- ⚠️ Maximum puzzle size must respect viewport

### Existing Code to Reference

**Similar Features Identified:**

- **UI/Layout Components:**
  - HUD used in 2048/Pong/Bit Runner
  - Central game container
  - Victory modal
  - Theme system buttons
  - No-scroll system used in other games

- **Reusable Components:**
  - `components/games/terminal-2048/ScoreDisplay.tsx` - Score HUD component structure, responsive sizing, theme-aware styling
  - `components/games/hack-grid/ScoreDisplay.tsx` - Score display with time and moves
  - `components/games/byte-match/ScoreDisplay.tsx` - Score display with moves, timer, and score
  - `components/games/terminal-2048/GameOverModal.tsx` - Modal component with AnimatePresence, backdrop blur, score display, action buttons (Play Again, Back to Home)
  - `components/games/hack-grid/GameOverModal.tsx` - Similar modal pattern with final score, time, moves, and best score display
  - `components/games/debug-maze/ScoreDisplay.tsx` - Score display with moves, duration, and level
  - `components/games/debug-maze/GameOverModal.tsx` - Game over modal pattern
  - GameCanvas container patterns from existing games
  - Theme-aware classes from theme system

- **Game Page Structure:**
  - `app/jogos/terminal-2048/page.tsx` - Layout structure: header with back link, title, HUD, game area, instructions footer
  - `app/jogos/hack-grid/page.tsx` - Grid-based game layout pattern
  - `app/jogos/debug-maze/page.tsx` - Layout with help panel, stats bar, game area (follows UI/UX Guidelines)
  - `app/jogos/crypto-miner-game/page.tsx` - Help panel lateral pattern (UI/UX Guidelines)

- **Game Logic Patterns:**
  - `lib/games/terminal-2048/game-logic.ts` - Game state management pattern, score calculation
  - `lib/games/hack-grid/game-logic.ts` - Grid-based game logic, validation patterns
  - `lib/games/dev-pong/game-logic.ts` - Game state structure for server-side validation
  - `lib/games/debug-maze/game-logic.ts` - Level-based game logic

- **Rendering:**
  - `components/games/bit-runner/BitRunnerCanvas.tsx` - Canvas API rendering with pixel art, theme-aware colors, 60 FPS optimization
  - `components/games/dev-pong/PongCanvas.tsx` - Canvas rendering pattern for simple games
  - Grid-based rendering patterns from Hack Grid and Byte Match

- **Controls:**
  - Keyboard controls pattern from Terminal 2048 (arrow keys)
  - Touch/swipe controls pattern from Bit Runner (swipe detection)
  - Drag-and-drop patterns to be implemented (new for this game)
  - Control debouncing patterns

- **Score Submission:**
  - API integration pattern from Bit Runner and Terminal 2048
  - Score metadata structure (duration, moves, level)
  - `app/api/scores/route.ts` - Same endpoint `/api/scores`
  - Basic validation patterns

- **Responsiveness:**
  - Layout from Hack Grid and Byte Match is perfect to copy
  - Same logic of responsive grid by fractions
  - UI/UX Guidelines: `agent-os/specs/UI_UX_GUIDELINES.md` - Layout patterns: h-screen without vertical scroll, lateral help panel, floating help button

**Components to potentially reuse:**
- ScoreDisplay component structure (multiple variants available)
- GameOverModal component structure
- Game page layout template
- Grid container patterns
- Theme-aware styling utilities

**Backend logic to reference:**
- Score submission API endpoint
- Basic validation patterns
- Metadata structure with state final and moves

### Follow-up Questions

No follow-up questions needed. All requirements were comprehensively answered.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
No visual assets to analyze.

## Requirements Summary

### Functional Requirements

- **Core Gameplay:**
  - Puzzle game where players reorganize code blocks to match target arrangement
  - Grid-based layout (3×3, 4×4, 5×5) scaling with difficulty
  - Drag-and-drop controls for desktop
  - Tap-select-tap-place controls for mobile
  - 10 fixed levels with progressive difficulty
  - Win condition: match target layout/order for the level

- **Code Block System:**
  - Blocks represent real code elements: imports, constants, functions, classes, comments, returns
  - Each block type has thematic icon, specific color/texture, theme-adapted styling
  - All blocks same size to prevent vertical growth
  - Blocks must fit within viewport without scroll

- **Particle Effects:**
  - Particles trigger on valid actions only (not every move)
  - Light particles when block placed (correct or incorrect position)
  - Strong thematic animation on puzzle completion
  - Theme-aware particle styles:
    - Cyber Hacker: green "data packet" particles
    - Pixel Lab: 8-bit square particles
    - Neon Future: streaks and glows
    - Blueprint: strokes drawing in air
    - Terminal: ASCII characters
  - Effects must be light and not expand bounding box

- **Scoring System:**
  - Score based on: moves (fewer = better), total time, difficulty, efficiency bonus
  - Formula: `score = max(1, 500 - moves*4 - duration*2)`
  - Backend stores: moves, duration, gridSize, correctPlacements, levelId
  - Compact HUD display (timer/moves/score)

- **Controls:**
  - Desktop: drag-and-drop
  - Mobile: tap → highlight → tap target
  - Undo button (1 level)
  - Optional keyboard shortcuts: arrows (navigate), space (select), enter (drop)

- **Level System:**
  - 10 fixed levels with increasing complexity
  - Progression: 3×3 simple → 5×5 complex
  - Each level has target arrangement/order rules
  - Level completion unlocks next level

- **User Actions:**
  - Reorganize blocks to match target
  - Undo last move
  - View level rules/expected order (minimal UI)
  - Complete puzzle to advance

- **Data to be Managed:**
  - Game state: current grid arrangement, target arrangement, moves, time, level
  - Score data: moves, duration, gridSize, correctPlacements, levelId
  - Level progression state
  - Best scores per level (localStorage)

### Reusability Opportunities

- **UI Components:**
  - ScoreDisplay components (multiple variants available in codebase)
  - GameOverModal components (multiple variants available)
  - Game page layout templates (h-screen, no-scroll pattern)
  - Theme-aware styling utilities

- **Backend Patterns:**
  - Score submission API endpoint (`/api/scores`)
  - Basic validation patterns
  - Metadata structure for game state

- **Layout Patterns:**
  - Grid-based responsive layout from Hack Grid and Byte Match
  - Help panel lateral pattern from Debug Maze and Crypto Miner
  - No-scroll viewport pattern from UI/UX Guidelines
  - Stats bar pattern from existing games

- **Game Logic Patterns:**
  - Game state management from Terminal 2048
  - Grid-based game logic from Hack Grid
  - Level-based progression from Debug Maze
  - Score calculation patterns from multiple games

- **Rendering:**
  - Canvas API patterns from Bit Runner and Dev Pong
  - Theme-aware color application
  - 60 FPS optimization patterns

### Scope Boundaries

**In Scope:**
- Drag-and-drop puzzle mechanics
- 10 fixed levels with progressive difficulty
- Code block types: imports, constants, functions, classes, comments, returns
- Grid-based layout (3×3 to 5×5)
- Theme-aware particle effects (light, on valid actions only)
- Score calculation based on moves, time, difficulty
- Desktop drag-and-drop and mobile tap-select-tap controls
- Undo functionality (1 level)
- Optional keyboard shortcuts
- Score submission to API
- Level progression system
- Game over modal with stats
- Responsive design (no scroll on desktop)
- Theme integration throughout

**Out of Scope:**
- Endless mode (future enhancement)
- Procedural shuffle (future enhancement)
- Language-specific levels (future enhancement)
- Quality metrics (future enhancement)
- File structure representation (future enhancement)
- Complex dependencies (future enhancement)
- Sliding puzzle mechanics
- Swap-based mechanics
- Linear puzzle layouts
- Freeform layouts
- Heavy 3D particle effects
- Particles on every movement
- Sound effects (future enhancement)
- Multiple undo levels (only 1 level in MVP)
- Power-ups (future enhancement)

### Technical Considerations

- **Integration Points:**
  - Theme system (5 themes: Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal, Blueprint Dev)
  - Score submission API (`/api/scores`)
  - Authentication system (for score saving)
  - Game validation system (for score integrity)

- **Existing System Constraints:**
  - Must follow UI/UX Guidelines: no vertical scroll on desktop
  - Must use h-screen layout pattern
  - Grid must scale responsively without exceeding viewport
  - All blocks must be same size
  - Particle effects must not expand bounding box
  - HUD must be compact

- **Technology Preferences:**
  - Next.js 14 App Router
  - React with TypeScript
  - TailwindCSS for styling
  - Framer Motion for animations
  - Canvas API for game rendering (if needed) or React components
  - Zustand/Jotai for local state (if needed)
  - Prisma for database (score storage)
  - Zod for validation

- **Similar Code Patterns to Follow:**
  - Game state management from `lib/games/terminal-2048/game-logic.ts`
  - Grid-based logic from `lib/games/hack-grid/game-logic.ts`
  - Score display from `components/games/hack-grid/ScoreDisplay.tsx`
  - Game over modal from `components/games/hack-grid/GameOverModal.tsx`
  - Game page layout from `app/jogos/debug-maze/page.tsx` (follows UI/UX Guidelines)
  - Responsive grid patterns from Hack Grid and Byte Match
  - Theme-aware styling patterns from all existing games

- **Performance Requirements:**
  - 60 FPS for smooth gameplay
  - Light particle effects (not performance-heavy)
  - Responsive grid scaling
  - No scroll on desktop viewport
  - Optimized rendering

- **Accessibility:**
  - Keyboard navigation support (optional but recommended)
  - ARIA labels for drag-and-drop
  - Focus management
  - Screen reader support for game state

