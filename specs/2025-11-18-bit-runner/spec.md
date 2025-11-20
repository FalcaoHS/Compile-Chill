# Specification: Bit Runner

## Goal
Implement an endless runner game with a pixel character that runs automatically, dev-themed obstacles (compilers, bugs, brackets), distance-based scoring, and theme-aware visuals for quick 1-3 minute decompression breaks.

## User Stories
- As a player, I want to play an endless runner with dev-themed obstacles so that it feels relevant to my developer identity
- As a player, I want simple jump and duck controls so that I can play quickly without learning complex mechanics
- As a player, I want my distance traveled to be my score so that I can track my progress intuitively

## Specific Requirements

**Character Movement**
- Character runs automatically from left to right at constant speed
- Jump control: Spacebar or Up Arrow key
- Duck control: Down Arrow key
- Character states: running (default), jumping, ducking
- No sliding or double-jump actions (keeps it dev-clean)
- Smooth state transitions between running, jumping, and ducking
- Character physics remain constant (no variable jump or momentum changes)
- Future enhancement: jump buffer + coyote time for smoother inputs

**Dev-Themed Obstacles**
- Main obstacles (MVP): Compilers (low, must jump), Bugs (high, must duck), Brackets {} [] () (medium, can jump or duck)
- Additional obstacles: node_modules/ (large block, must jump), ERROR: Unexpected Token (suspended sign, must duck), Stack Overflow flame (pixelated effect, high), Warnings (yellow, medium)
- All obstacles are pixel art style, theme-aware colors, and static (no movement or position changes)
- Avoid excessive text on obstacles (confusing during fast movement)
- Obstacles spawn ahead of character with proper spacing

**Difficulty Progression**
- Ground scroll speed increases gradually over time
- Obstacle spacing decreases as game progresses
- More complex patterns appear: pair combos, double obstacles, high-low combinations
- Slight random variation in spawn velocity (20-30% variation)
- No changes to character physics during gameplay
- No instant unfair hits (player always has time to react)

**Pattern-Based Obstacle Spawning**
- Predefined patterns of 2-4 obstacles each
- Light randomization between patterns (20-30% variation)
- Adaptive algorithm: if player fails early, spawns more spaced for 15-20s; if doing well, gradually tightens spacing
- Creates flow state without feeling unfair or like cheating
- Patterns stored in game state for validation

**Distance-Based Scoring**
- Score equals distance traveled (in pixels/meters)
- Distance increments continuously while character is alive
- Score displayed prominently in HUD
- Best score tracked in localStorage
- Score persists across sessions
- Optional bonuses for V2: perfect survival (no hits), obstacle avoidance combos (10 consecutive = bonus)

**Pixel Character Design**
- Minimalist pixel character (12-16px) with dev identity
- Options: silhouette with glowing glasses, stylized running pose
- Dev touches: backpack with stickers, pixelated hat, shirt with </> or { }
- Simple, readable, high contrast, theme-aware colors
- Animations: 2-4 frame running loop, compressed duck animation, 2-frame jump animation
- No complex characters with visual weight

**Game Over Detection**
- Game ends when character collides with any obstacle
- Show game over modal with final distance score
- Display best score if applicable
- "Play Again" button to restart immediately
- "Back to Home" link to return to game list
- Modal is theme-aware and accessible

**Controls Implementation**
- Keyboard: Spacebar or Up Arrow for jump, Down Arrow for duck
- Touch: Swipe up for jump, swipe down for duck
- Debounce rapid inputs to prevent accidental actions
- Visual feedback on character state changes
- Disable controls during game over state

**Theme Integration**
- Character colors adapt to current theme
- Obstacle colors use theme palette
- Background elements theme-aware (ground, sky, effects)
- Apply theme-specific effects: neon glow, scanlines, pixel grain, glitch artifacts
- All visual elements respond to theme changes in real-time

**Game Page Layout**
- Create `/app/jogos/bit-runner/page.tsx`
- Header with back link and title
- Score display HUD at top (current distance, best distance)
- Canvas game area in center
- Instructions footer with controls
- Responsive layout (mobile and desktop)
- Theme-aware container styling

## Visual Design
- Pixel art aesthetic throughout
- Character and obstacles use pixel-perfect rendering
- Theme-aware color palette applied to all elements
- Smooth scrolling ground with parallax effect
- Clear visual feedback on character actions
- High contrast for readability during fast gameplay
- Performance-optimized to maintain 60 FPS

## Existing Code to Leverage

**`app/jogos/terminal-2048/page.tsx`**
- Game page layout structure: header with back link, title, HUD, canvas area, instructions footer
- Score tracking and display pattern
- Game over detection and modal triggering
- Score submission to API pattern (adapt for distance-based scoring)
- Theme-aware container and styling

**`components/games/terminal-2048/ScoreDisplay.tsx`**
- Score HUD component structure
- Responsive sizing (mobile and desktop)
- Theme-aware styling with primary colors
- Number formatting with toLocaleString()
- Adapt to show distance instead of score

**`components/games/terminal-2048/GameOverModal.tsx`**
- Modal component structure with AnimatePresence
- Backdrop blur and click-to-close behavior
- Score display layout (final score, best score)
- Action buttons: "Play Again", "Back to Home"
- Theme-aware styling with bg-page-secondary, border-border
- Framer Motion animations

**`lib/games/terminal-2048/game-logic.ts`**
- Game state structure and management patterns
- localStorage integration for best scores
- Timestamp tracking for duration calculations
- Follow similar patterns for Bit Runner game logic

**`lib/themes.ts`**
- Theme token system for colors, borders, shadows
- CSS variable structure
- Apply theme tokens to character, obstacles, background

**`lib/games.ts`**
- Game configuration already includes Bit Runner entry
- Use game ID 'bit-runner' for all references
- Follow existing game metadata structure

## Out of Scope
- Power-ups or special abilities
- Multiple characters or character selection
- Collectible items or coins
- Different backgrounds or scenarios
- Skin system or character customization
- Extra game modes (time trial, hardcore)
- Complex achievement system
- Advanced music or sound effects
- Advanced physics (variable jump, deep momentum)
- Sliding action or double-jump
- Moving or interactive obstacles
- Boss-style complex animations
- Obstacles that change position dynamically
- Time limits or distance goals
- Level system or phase timelines
- Jump buffer or coyote time (V2 feature)

