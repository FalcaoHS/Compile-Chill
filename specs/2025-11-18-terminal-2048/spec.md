# Specification: Terminal 2048

## Goal
Implement a 2048-style puzzle game with dev-themed tiles (files, folders, extensions), theme-aware styling, score tracking, and game over state. Prepare game state structure for future server-side validation.

## User Stories
- As a player, I want to play a 2048-style game with dev-themed tiles so that it feels relevant to my developer identity
- As a player, I want the game to look good with my selected theme so that it matches my preferences
- As a player, I want to see my score and best score so that I can track my progress
- As a player, I want to control the game with keyboard or touch so that I can play on any device
- As a developer, I want game state to be structured for validation so that we can prevent cheating in the future

## Specific Requirements

### Game Mechanics
- 4x4 grid game board
- Tiles move in 4 directions (up, down, left, right)
- Tiles with same value merge when they collide
- New tile (value 2 or 4) spawns after each move
- Game over when grid is full and no moves possible
- Win condition: reach high-value tiles (no hard limit, keep playing)

### Dev-Themed Tiles
- Tile progression system:
  - Level 1-2: `.txt`, `.js`
  - Level 3-4: `.ts`, `.py`
  - Level 5-6: `.json`, `.md`
  - Level 7-8: `folder`, `package.json`
  - Level 9-10: `node_modules`, `src/`
  - Level 11+: `dist/`, `build/`, etc.
- Each tile displays: icon/emoji + text label
- Tiles have theme-aware colors and styling
- Visual hierarchy (higher tiles are more prominent)

### Theme Integration
- Grid background uses `bg-page-secondary`
- Tiles use theme colors for backgrounds and borders
- Score display uses theme text colors
- Game over modal uses theme styling
- All components respond to theme changes

### Score Tracking
- Current score displayed prominently
- Score increases when tiles merge (add merged tile value)
- Best score tracked in localStorage
- Best score displayed if higher than current
- Score persists across sessions (localStorage)

### Game Over State
- Detect game over condition
- Show modal/overlay with:
  - "Game Over" message
  - Final score
  - Best score (if applicable)
  - "Play Again" button
  - "Back to Home" link
- Modal is theme-aware and accessible

### Controls
- Keyboard: Arrow keys (↑ ↓ ← →)
- Touch: Swipe gestures (up, down, left, right)
- Debounce to prevent accidental rapid moves
- Visual feedback on valid moves
- Disable controls during animations

### Game State Structure
- Track game board state (4x4 grid)
- Track current score
- Track move count
- Track game start time (for future duration validation)
- Track move history (for future validation)
- Structure ready for server-side validation (feature 5b)

### Game Page Layout
- Create `/app/jogos/terminal-2048/page.tsx`
- Header with score display
- Game board in center
- Instructions/controls info
- Responsive layout (mobile and desktop)
- Navigation back to home

## Visual Design
- Clean, modern game board
- Smooth tile animations
- Clear visual feedback
- Theme-aware throughout
- Accessible color contrasts

## Existing Code to Leverage
- `lib/themes.ts` - Theme tokens
- `lib/games.ts` - Game configuration
- `components/GameCard.tsx` - Navigation patterns
- Theme system infrastructure

## Out of Scope
- Full server-side validation (feature 5b)
- Score submission to database (feature 5)
- Leaderboards (feature 7)
- Share functionality (feature 14)
- Sound effects
- Undo functionality
- Multiple game modes

