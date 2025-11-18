# Spec Requirements: Terminal 2048

## Initial Description

"First Game: Terminal 2048 — Implement Terminal 2048 game with dev-themed tiles (files, folders, extensions), theme-aware styling, score tracking, and game over state. Include server-side game state validation to prevent score manipulation"

## Requirements Discussion

### Key Decisions

**1. Game Mechanics:**
- Classic 2048 gameplay: 4x4 grid, combine tiles with same value
- Tiles move in 4 directions (up, down, left, right)
- New tile spawns after each move (2 or 4, with 2 being more common)
- Goal: reach the highest tile possible (traditionally 2048, but can be higher)
- Game over when grid is full and no moves are possible

**2. Dev-Themed Tiles:**
- Instead of numbers, use dev concepts:
  - Level 1: `.txt` (text file)
  - Level 2: `.js` (JavaScript)
  - Level 3: `.ts` (TypeScript)
  - Level 4: `.py` (Python)
  - Level 5: `.json` (JSON)
  - Level 6: `.md` (Markdown)
  - Level 7: `folder` (Folder)
  - Level 8: `package.json` (Package)
  - Level 9: `node_modules` (Node Modules)
  - Level 10: `src/` (Source folder)
  - Level 11: `dist/` (Distribution)
  - And so on...
- Each tile should have visual representation (icon/emoji + text)
- Tiles should be theme-aware (colors, styling)

**3. Theme Integration:**
- Use theme tokens for grid background, tile colors, text
- Tiles should adapt to current theme
- Animations should respect theme (glow effects, shadows)
- Score display should use theme colors

**4. Score Tracking:**
- Track current score (sum of merged tiles)
- Display score prominently
- Track best score (localStorage for now, database later)
- Score calculation: when two tiles merge, add their value to score

**5. Game Over State:**
- Detect when no moves are possible
- Show game over modal/overlay
- Display final score
- Option to restart game
- Option to share score (future feature)

**6. Controls:**
- Keyboard: Arrow keys (↑ ↓ ← →)
- Touch: Swipe gestures (up, down, left, right)
- Prevent accidental moves (debounce)
- Visual feedback on moves

**7. Server-Side Validation:**
- Note: Full validation system is in feature 5b
- For this feature: prepare game state structure for validation
- Track move history (for future validation)
- Track game duration (for future validation)
- Don't implement full validation yet (that's feature 5b)

**8. Game Page Structure:**
- Create `/app/jogos/terminal-2048/page.tsx`
- Game canvas/area in center
- Score display at top
- Controls/instructions
- Theme-aware styling throughout

## Technical Approach

- Use React state for game board
- Use Framer Motion for tile animations
- Use CSS Grid for 4x4 board layout
- Use localStorage for best score (temporary)
- Prepare game state structure for future validation
- Use Next.js App Router

## Out of Scope

- Full server-side validation (feature 5b)
- Score submission to database (feature 5)
- Leaderboards (feature 7)
- Share functionality (feature 14)
- Sound effects (future enhancement)
- Undo functionality (future enhancement)

