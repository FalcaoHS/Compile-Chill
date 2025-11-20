# Specification: Byte Match

## Goal
Implement a classic memory matching game with 4×4 grid (8 dev-themed pairs), theme-aware styling, move-based scoring, and responsive layout that prevents desktop scroll for quick 1-2 minute decompression breaks.

## User Stories
- As a player, I want to play a memory matching game with dev-themed pairs so that it feels relevant to my developer identity
- As a player, I want the game to fit on screen without scrolling so that I can play quickly on any device
- As a player, I want to see my score based on moves and time so that I can track my performance

## Specific Requirements

**Game Mechanics**
- Classic memory matching: cards face-down, flip two at a time, matching pairs stay face-up
- 4×4 grid layout (8 pairs total) for 1-2 minute gameplay
- Fixed header: grid must never cause scroll on desktop
- Cards must be equal size to prevent vertical expansion
- Game ends when all pairs are matched

**Dev-Themed Pairs**
- 8 custom pixel art pairs: Git icon, node_modules, package.json, tsconfig.json, CoffeeScript logo, /src folder, .gitignore, README.md
- Use custom pixel art versions (not official logos) to avoid copyright issues
- All cards equal size to maintain grid layout
- Future additions: Dockerfile, yarn.lock, env vars, código bugado (out of scope for MVP)

**Scoring System**
- Score formula: score = max(1, 100 - moves) where fewer moves = better score
- Track moves count and duration (time) for future advanced rankings
- Score submission includes: moves, duration, gridSize, seed (optional), matches sequence (optional for validation)
- HUD displays current moves and timer at top without pushing canvas down

**Controls**
- Click/tap to flip cards
- Short delay (300-600ms) before auto-flipping non-matching pairs back
- Prevent flipping more than two cards simultaneously (prevents validation issues and UX bugs)
- Delay uses invisible overlay to avoid layout expansion
- Touch support for mobile devices

**Game Over State**
- Trigger when all pairs matched
- Modal with smooth animation (Framer Motion, similar to Terminal 2048)
- Display: final score, total moves, total time
- Action buttons: "Play Again", "Back to Home", "Share Score" (future placeholder)
- Modal uses fixed positioning (not canvas-relative) to prevent scroll

**Visual Feedback**
- Simple, elegant flip animation for card reveals
- Glow/pulse effect when matching pair found
- Theme-aware effects per theme: neon (fluid glow), pixel (quick dithering), terminal (ASCII flip), hacker (light glitch), blueprint (technical lines + blue pulse)
- No heavy particles, 3D effects, or anything that breaks 60 FPS on mobile
- Effects must not increase grid size (prevents scroll)

**Layout & Responsiveness**
- Fixed header with back link and title
- HUD at top: moves counter and timer (must fit without pushing canvas)
- Centered 4×4 grid that fits responsively without scroll
- Instructions footer with controls info
- Responsive design for mobile and desktop
- All layout elements use theme-aware styling

**Theme Integration**
- Use existing theme system from `lib/themes.ts`
- Apply theme tokens to cards, grid, HUD, modal, and all UI elements
- Theme-aware visual effects per theme type
- All components respond to theme changes in real-time
- Follow existing theme patterns from Terminal 2048 and other games

**Score Submission**
- Follow existing score submission pattern from Terminal 2048
- Submit to `/api/scores` endpoint with gameId: 'byte-match'
- Include moves, duration, gridSize, seed (optional), matches sequence (optional)
- Save best score to localStorage for display
- Structure game state for future server-side validation

**Game State Management**
- Track card states: face-down, face-up, matched
- Track flipped cards: first card, second card, delay timer
- Track game metrics: moves count, start time, duration, matches sequence
- Track completion state: all pairs matched
- Structure ready for future server-side validation

## Visual Design

No visual assets provided.

## Existing Code to Leverage

**`app/jogos/terminal-2048/page.tsx` and `components/games/terminal-2048/`**
- Layout structure: header with back link, title, HUD at top, centered game area, instructions footer
- Game Over modal component pattern with Framer Motion animations
- Score display component pattern (adapt for moves + timer)
- Score submission function pattern to `/api/scores`
- Theme-aware container and styling patterns
- Responsive layout that prevents scroll

**`components/games/terminal-2048/GameOverModal.tsx`**
- Modal component with AnimatePresence and backdrop blur
- Fixed positioning pattern (not canvas-relative)
- Score display layout and action buttons structure
- Theme-aware styling with bg-page-secondary, border-border
- Adapt for moves and time display instead of just score

**`components/games/terminal-2048/ScoreDisplay.tsx`**
- HUD component structure with responsive sizing
- Theme-aware styling with primary colors
- Adapt to show moves count and timer instead of score/best score

**`app/jogos/dev-pong/page.tsx` and `app/jogos/bit-runner/page.tsx`**
- Touch input handling patterns for mobile
- Game timing and loop system using requestAnimationFrame
- Theme-aware visual effects (neon/pixel patterns)
- Score submission pattern with metadata

**`app/jogos/hack-grid/page.tsx` and `app/jogos/debug-maze/page.tsx`**
- Grid container patterns with responsive design
- Small screen responsive layout patterns
- Pixelized asset rendering patterns

## Out of Scope
- Multiple difficulty levels (4×6, 6×6 grids - future enhancement)
- Timer pressure mode or time-based challenges
- Power-ups (reveal, shuffle, freeze, etc.)
- Multiplayer or competitive modes
- Extra thematic decks or card sets
- Advanced sound effects or music
- Competitive/tournament mode
- Large cards that would cause scroll
- Any vertical expansion that creates scroll on desktop
- Full server-side validation (feature 5b - future)

