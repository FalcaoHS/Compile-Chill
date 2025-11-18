# Specification: Refactor Rush

## Goal

Implement a puzzle game where players reorganize code blocks in a grid to match target arrangements, with drag-and-drop controls, theme-aware particle effects, and score tracking based on efficiency.

## User Stories

- As a developer, I want to reorganize code blocks by dragging them into the correct order so that I can practice code organization skills while taking a break
- As a player, I want to see visual feedback with particle effects when I place blocks correctly so that I feel rewarded for good moves
- As a competitive player, I want my score to reflect my efficiency (fewer moves, faster time) so that I can compete on leaderboards

## Specific Requirements

**Drag-and-Drop Puzzle Mechanics**
- Implement drag-and-drop for desktop using HTML5 drag API or pointer events
- Implement tap-select-tap-place for mobile (first tap highlights block, second tap places it)
- Support undo functionality (1 level only) with a visible undo button
- Optional keyboard shortcuts: arrow keys to navigate, space to select, enter to drop
- Ensure grid and clickable area fit perfectly on screen without vertical scroll
- All blocks must be same size to prevent vertical growth
- Grid must scale responsively with screen size without exceeding viewport
- Prevent accidental moves with proper drag boundaries and validation

**Code Block System**
- Create 6 block types representing real code elements: imports, constants, functions, classes, comments, returns
- Each block type has thematic icon, specific color/texture, and theme-adapted styling
- Blocks display code-like text snippets (e.g., "import {...}", "const variable", "function method()")
- All blocks use consistent sizing to maintain grid alignment
- Blocks must be visually distinct but cohesive within each theme
- Theme-aware styling adapts colors, borders, and effects to active theme (Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal, Blueprint Dev)

**Grid-Based Level System**
- Implement 10 fixed levels with progressive difficulty (3×3 → 4×4 → 5×5)
- Each level defines target arrangement/order rules (e.g., imports → constants → functions → classes)
- Level progression unlocks next level on completion
- Store level data with grid size, initial block positions, target positions, and rules
- Show minimal UI indicator of expected order without taking up too much space
- Maximum puzzle size must respect viewport constraints (no scroll on desktop)

**Particle Effects System**
- Trigger particles only on valid actions (block placement, not every movement)
- Light particles when block placed (both correct and incorrect positions)
- Strong thematic animation on puzzle completion
- Theme-aware particle styles: Cyber Hacker (green data packets), Pixel Lab (8-bit squares), Neon Future (streaks/glows), Blueprint (strokes), Terminal (ASCII characters)
- Effects must be light-weight and not expand bounding box (no scroll generation)
- Use Framer Motion or lightweight canvas-based particle system for performance

**Scoring and Validation**
- Calculate score using formula: `score = max(1, 500 - moves*4 - duration*2)` where duration is in seconds
- Track moves, duration, gridSize, correctPlacements, and levelId for backend submission
- Store best scores per level in localStorage
- Submit scores to `/api/scores` endpoint with game metadata
- Include server-side validation structure for score integrity (prepare for validation system)
- Display compact HUD with timer, moves, and score (must not pressure canvas area)

**Game Page Layout**
- Follow UI/UX Guidelines: h-screen layout without vertical scroll on desktop
- Implement stats bar with ScoreDisplay component showing score, time, and moves
- Center game grid area with responsive scaling
- Include optional help panel (lateral, collapsible) following Debug Maze pattern
- Add floating help button when panel is hidden
- Use GameOverModal component for completion screen with stats and next level option

**Theme Integration**
- Apply theme tokens throughout: bg-page, bg-page-secondary, border-border, text-text, text-primary
- Code blocks adapt colors, borders, and effects to active theme
- Particle effects match theme aesthetic
- Score display and modals use theme-aware styling
- Ensure all visual elements respect theme switching without layout shifts

**Controls and Accessibility**
- Implement drag-and-drop with proper ARIA labels for screen readers
- Support keyboard navigation (optional but recommended): arrows to navigate, space to select, enter to drop
- Provide focus management for keyboard users
- Include visual feedback for selected/highlighted blocks
- Ensure touch targets are appropriately sized for mobile (minimum 44×44px)

## Visual Design

No visual assets provided.

## Existing Code to Leverage

**ScoreDisplay Components**
- Reuse `components/games/hack-grid/ScoreDisplay.tsx` pattern showing score, time, and moves
- Adapt to include level indicator if needed
- Follow theme-aware styling with bg-page-secondary, border-border, text-text classes
- Use compact responsive sizing (min-w-[80px] sm:min-w-[100px]) to not pressure canvas

**GameOverModal Component**
- Reuse `components/games/hack-grid/GameOverModal.tsx` structure with AnimatePresence animations
- Include final score, time, moves, and best score display
- Add "Play Again" and "Next Level" buttons following existing patterns
- Use backdrop blur and theme-aware modal styling

**Game Page Layout Pattern**
- Follow `app/jogos/debug-maze/page.tsx` layout: h-screen flex flex-col overflow-hidden
- Implement optional lateral help panel (w-80, collapsible) with floating button when hidden
- Use stats bar pattern (border-b border-border bg-page-secondary flex-shrink-0)
- Center game area with flex-1 overflow-hidden flex items-center justify-center

**Grid-Based Game Logic**
- Reference `lib/games/hack-grid/game-logic.ts` for grid state management patterns
- Use similar GameState interface structure with grid, moves, duration, level tracking
- Follow level loading pattern from `lib/games/debug-maze/game-logic.ts` for fixed level system
- Implement grid validation and completion checking similar to Hack Grid patterns

**Score Submission API**
- Use existing `/api/scores` endpoint following patterns from Terminal 2048 and Bit Runner
- Include metadata structure: moves, duration, gridSize, correctPlacements, levelId
- Follow authentication check pattern for score saving
- Prepare game state structure for future server-side validation

## Out of Scope

- Endless mode with procedural generation (future enhancement)
- Language-specific levels (TypeScript, Python, Go) - future enhancement
- Quality metrics or code analysis features
- File structure representation or complex dependency visualization
- Sliding puzzle mechanics (15-puzzle style)
- Swap-based puzzle mechanics (select-two-to-swap)
- Linear puzzle layouts or freeform arrangements
- Heavy 3D particle effects or performance-intensive animations
- Particles on every movement (only on valid actions)
- Sound effects or audio feedback
- Multiple undo levels (only 1 level in MVP)
- Power-ups or special abilities
- Time limits or pressure mechanics
- Multiplayer or collaborative features
- Code block editing or customization
- Procedural shuffle algorithms
- Achievement system integration (separate feature)

