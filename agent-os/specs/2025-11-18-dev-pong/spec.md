# Specification: Dev Pong

## Goal
Implement a single-player Pong game with adaptive AI opponent, dev-themed aesthetics (bracket paddles, pixel ball with particle trail), theme-aware visual effects, and responsive controls for quick 1-3 minute decompression breaks.

## User Stories
- As a player, I want to play Pong against an AI opponent with dev-themed aesthetics so that it feels relevant to my developer identity
- As a player, I want the game to adapt to my skill level so that I feel challenged without frustration
- As a player, I want smooth controls across keyboard, mouse, and touch so that I can play on any device

## Specific Requirements

**Game Mechanics**
- Single-player gameplay: player controls left paddle, AI controls right paddle
- First to 7 points wins the match (score range: 0-7)
- Match duration: designed for 1-3 minutes of gameplay
- Ball physics: constant velocity with angle changes based on paddle hit position
- Wall bounces: ball reflects off top and bottom walls
- Point scoring: point awarded when ball passes opponent's paddle

**AI Opponent System**
- Adaptive difficulty: AI starts slow and gradually increases speed based on player performance
- Skill tracking: calculate player's average error/reaction time to adjust AI behavior
- Progressive scaling: AI speed increases slightly each time player scores a point
- Always beatable: AI never reaches perfect accuracy (always leave room for player victory)
- Smooth difficulty curve: changes should be subtle and invisible to player

**Dev-Themed Aesthetics**
- Left paddle: styled as `[` bracket character with theme-aware thickness and glow
- Right paddle: styled as `]` bracket character with theme-aware thickness and glow
- Ball: bright pixel dot "•" with particle trail effect
- Ball collision effect: micro glitch distortion (1 frame) on paddle/wall hits
- Background elements: floating code symbols, scanlines, terminal-style horizontal lines (subtle, non-distracting)
- Theme colors: apply current theme's color palette to all visual elements

**Visual Effects (Performance-Conscious)**
- Paddle glow: theme-based glow effect on both paddles
- Particle system: trailing particles behind ball (neon/pixel/glitch style based on theme)
- Wall hit particles: brief particle burst when ball hits top/bottom walls
- High-velocity shake: micro screen shake effect on fast collisions
- Background parallax: light parallax scrolling for background elements (theme-dependent)
- Optimize all effects to maintain 60 FPS on all devices

**Controls Implementation**
- Keyboard primary: W/S keys and Arrow Up/Down keys for paddle movement
- Mouse optional: paddle Y position follows cursor Y position (can be disabled on mobile)
- Touch mobile: vertical touch/drag gesture on left side of screen moves paddle
- Input smoothing: debounce rapid inputs to prevent jittery movement
- Movement bounds: constrain paddle within game area boundaries

**Score Tracking and Submission**
- Display current score for both player and AI during match
- Track match duration (start time to end time)
- Track total ball hits count (for analytics)
- Submit to database: player's final score (0-7), match duration, hit count
- Store in metadata: AI difficulty progression data, final ball speed
- Follow existing score submission pattern from Terminal 2048

**Game Over State**
- Trigger: display modal when either player or AI reaches 7 points
- Modal content: match result (Win/Loss), final score, player points earned
- Action buttons: "Play Again", "Share" (future), "Back to Home"
- Animation: smooth modal entrance with backdrop blur
- Theme-aware: use theme colors and styling for modal
- Reuse GameOverModal pattern from Terminal 2048

**Game Page Structure**
- Route: `/app/jogos/dev-pong/page.tsx`
- Layout: header with back link and title, score display HUD, centered canvas area, instructions footer
- Canvas rendering: use Canvas API (lighter than Pixi.js for simple Pong)
- Responsive: mobile-friendly layout with touch controls
- Theme integration: respond to theme changes in real-time

**Game State Management**
- Track paddle positions: player Y position, AI Y position
- Track ball state: X position, Y position, X velocity, Y velocity
- Track scores: player points (0-7), AI points (0-7)
- Track timing: match start timestamp, current match duration
- Track metrics: total hits, current ball speed, AI difficulty level
- Structure for future server-side validation (similar to Terminal 2048)

## Visual Design
- Clean, minimal Pong layout with dev aesthetic overlay
- Bracket-styled paddles with theme-based colors and glow
- Pixel ball with smooth particle trail
- Subtle background effects (floating code, scanlines) that don't distract from gameplay
- Theme-aware color scheme throughout (use theme tokens)
- Smooth animations for all game elements
- Performance-optimized visual effects maintaining 60 FPS

## Existing Code to Leverage

**`app/jogos/terminal-2048/page.tsx`**
- Game page layout structure: header with back link, title, HUD, canvas area, instructions footer
- Score tracking and display pattern
- Game over detection and modal triggering
- Score submission to API pattern (adapt for Dev Pong scoring)
- Theme-aware container and styling

**`components/games/terminal-2048/GameOverModal.tsx`**
- Modal component structure with AnimatePresence
- Backdrop blur and click-to-close behavior
- Score display layout (final score, best score)
- Action buttons: "Play Again", "Back to Home" (add "Share" placeholder)
- Theme-aware styling with bg-page-secondary, border-border
- Framer Motion animations

**`components/games/terminal-2048/ScoreDisplay.tsx`**
- Score HUD component structure
- Responsive sizing (mobile and desktop)
- Theme-aware styling with primary colors
- Number formatting with toLocaleString()
- Adapt to show both player and AI scores

**`lib/games/terminal-2048/game-logic.ts`**
- Game state structure and management patterns
- localStorage integration for best scores
- Move history tracking approach
- Timestamp tracking for duration calculations
- Follow similar patterns for Dev Pong game logic

**`lib/themes.ts`**
- Theme token system for colors, borders, shadows
- CSS variable structure
- Apply theme tokens to paddles, ball, background effects

**`lib/games.ts`**
- Game configuration already includes Dev Pong entry
- Use game ID 'dev-pong' for all references
- Follow existing game metadata structure

## Out of Scope
- Local 2-player multiplayer (future "Modo Caos" feature)
- Power-ups or special abilities
- Multiple game modes or difficulty settings (AI adapts automatically)
- Advanced sound effects (minimal "bip" sounds acceptable but not required)
- Replay or game recording functionality
- Paddle/ball skins or customization
- Cumulative scoring across multiple matches
- Advanced physics (ball spin, irregular bounce patterns)
- Heavy visual effects (explosions, volumetric lighting, excessive particles)
- Online multiplayer or real-time matchmaking

