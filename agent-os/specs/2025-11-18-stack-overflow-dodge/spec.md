# Specification: Stack Overflow Dodge

## Goal
Implement a dodge game where players move horizontally at the bottom of the screen to avoid falling dev-themed "errors" from the top, collect power-ups ("resolveu!", "copiou do stackoverflow"), track survival-based scores, and integrate with theme system for quick 1-3 minute decompression breaks.

## User Stories
- As a player, I want to dodge falling dev-themed errors so that it feels relevant to my developer identity
- As a player, I want to collect power-ups that help me survive longer so that I can achieve higher scores
- As a player, I want simple horizontal movement controls so that I can play quickly on any device

## Specific Requirements

**Player Movement**
- Character/cursor moves only horizontally at the bottom of the screen
- Classic dodge game style, extremely intuitive
- Simple, fast, works on mobile and desktop
- No vertical space issues (important to avoid scroll)
- Bottom bar + canvas must fit without forcing scroll
- No free movement across entire screen, no teleport, no lateral dash

**Falling Errors System**
- Dev-themed error messages: TypeError, ReferenceError, SyntaxError, 404 Not Found, NullPointerException, Segmentation Fault, Undefined is not a function, buggy pixelated lines
- Visual form: pixel boxes with neon glow (theme-aware), short text in center ("TypeError" etc.), speed increases over time
- Fixed error size to not expand vertical area
- No official logos, no very long text (player can't read it)
- Errors spawn from top of screen in patterns (2-3 simultaneous as difficulty increases)

**Power-up System**
- "resolveu!": clears all nearby errors OR grants 2-3 seconds of invincibility, pixel/neon explosion animation, quick effect (not long), +50 bonus points
- "copiou do stackoverflow": reduces error speed for 3-5 seconds, small point bonus (+30), visual effect: "wind" rising or blue glitch
- No permanent power-ups, no cumulative upgrades, no energy bar
- Power-ups must be small and not push layout
- Spawn rate balanced with errors (less frequent than errors)

**Scoring System**
- Survival-based + power-up bonuses
- Score increases automatically with time: 1 point per X milliseconds alive (gateway of 10-15 pts per second)
- Bonuses: +50 when collecting "resolveu!", +30 when collecting "copiou do stackoverflow"
- Optional combos for future (not in MVP)
- No points per error dodged (hard to measure), no advanced multipliers in MVP
- HUD must be compact, horizontal, right at top of canvas
- Best score tracked in localStorage and displayed

**Difficulty Progression**
- Progressive increase by: error speed increasing, higher spawn rate, errors spawning in more complex patterns (2-3 simultaneous)
- After certain time: "chaos" events with intense rain for 2-3 seconds, then returns to normal
- No phases, just endless increasing difficulty
- All difficulty must fit within same canvas without expanding height
- Adaptive difficulty: if player fails early, spawns more spaced; if doing well, gradually tightens

**Visual Design**
- Pixel + neon style, mix Pixel Runner + Pong but minimalist
- Pixel character at bottom
- Errors with light neon border, theme-aware colors
- Small falling particles
- Theme-aware: Neon Future → purple+blue, Cyber Hacker → matrix green, Pixel Lab → vibrant colors and dithering, Terminal → ASCII errors X and !!!
- No exaggerated particles, 3D animations, heavy sprites
- Light effects to not require expanding canvas (avoid scroll)
- Performance-optimized to maintain 60 FPS

**Controls Implementation**
- Desktop: Arrow keys (←/→), A/D, optional mouse move (light horizontal tracking)
- Mobile: Left/right swipe, optional virtual buttons (small, don't interfere with canvas)
- No touches at top of screen, no vertical movement, no advanced multitouch
- Touch buttons must be outside area that can cause scroll
- Debounce rapid inputs to prevent jittery movement

**Game Over Detection**
- Game ends when player collides with any falling error
- Show game over modal with final score
- Display best score if applicable
- "Play Again" button to restart immediately
- "Back to Home" link to return to game list
- Modal is theme-aware and accessible

**Game Page Layout**
- Create `/app/jogos/stack-overflow-dodge/page.tsx`
- Header with back link and title
- Score display HUD at top (current score, best score)
- Canvas game area in center (h-screen layout without vertical scroll)
- Instructions footer with controls
- Responsive layout (mobile and desktop)
- Theme-aware container styling

**Game State Management**
- Track player position: X coordinate at bottom of screen
- Track falling errors: array of error objects with position, type, speed
- Track power-ups: array of power-up objects with position, type
- Track score: current score, best score, survival time
- Track game state: game over flag, invincibility timer, slowdown timer
- Track timing: game start timestamp, current game duration
- Structure for future server-side validation

## Visual Design
- Pixel art aesthetic throughout with neon glow effects
- Character and errors use pixel-perfect rendering
- Theme-aware color palette applied to all elements
- Clear visual feedback on power-up collection
- High contrast for readability during fast gameplay
- Performance-optimized to maintain 60 FPS

## Existing Code to Leverage

**`app/jogos/bit-runner/page.tsx`**
- Game page layout structure: header with back link, title, HUD, canvas area
- Canvas rendering with pixel art, theme-aware colors, 60 FPS optimization
- Game loop with requestAnimationFrame pattern
- Input handling (keyboard and touch/swipe)
- Score submission to API pattern
- h-screen layout without vertical scroll pattern

**`components/games/bit-runner/ScoreDisplay.tsx`**
- Score HUD component structure
- Responsive sizing (mobile and desktop)
- Theme-aware styling with primary colors
- Number formatting with toLocaleString()
- Adapt to show score instead of distance

**`components/games/bit-runner/GameOverModal.tsx`**
- Modal component structure with AnimatePresence
- Backdrop blur and click-to-close behavior
- Score display layout (final score, best score)
- Action buttons: "Play Again", "Back to Home"
- Theme-aware styling with bg-page-secondary, border-border
- Framer Motion animations

**`lib/games/bit-runner/game-logic.ts`**
- Game state structure and management patterns
- localStorage integration for best scores
- Timestamp tracking for duration calculations
- Follow similar patterns for Stack Overflow Dodge game logic

**`app/jogos/dev-pong/page.tsx`**
- Canvas rendering integration pattern
- Minimalist arcade style
- Mouse controls pattern (optional horizontal tracking)

**`app/jogos/terminal-2048/page.tsx`**
- Layout structure: header with back link, title, HUD, game area, instructions footer
- Score tracking and display pattern
- Theme system integration

**`lib/themes.ts`**
- Theme token system for colors, borders, shadows
- CSS variable structure
- Apply theme tokens to character, errors, power-ups, background

**`lib/games.ts`**
- Game configuration already includes Stack Overflow Dodge entry
- Use game ID 'stack-overflow-dodge' for all references
- Follow existing game metadata structure

## Out of Scope
- Multiple characters or character selection
- Skins or character customization
- Special abilities beyond the 2 power-ups
- Extra game modes (campaign, boss)
- Collectible items beyond the 2 power-ups
- Advanced physics
- Real StackOverflow integration
- Giant random events
- Screens larger than viewport
- Free movement across entire screen
- Teleport mechanics
- Lateral dash (power for another version)
- Permanent power-ups
- Cumulative upgrades
- Energy bar
- Points per error dodged
- Advanced multipliers in MVP
- Multiple difficulty levels
- Phases or levels
- Exaggerated particles
- 3D animations
- Heavy sprites
- Moving or interactive errors
- Boss-style complex animations
- Time limits or distance goals

