# Task Breakdown: Dev Pong

## Overview
Total Tasks: 5 groups, 30+ sub-tasks

## Task List

### Game Logic & Physics

#### Task Group 1: Core Game Engine
**Dependencies:** None

- [x] 1.0 Complete game engine implementation
  - [x] 1.1 Write 2-8 focused tests for game engine
    - Test game state initialization
    - Test ball physics (velocity, collision detection)
    - Test paddle movement boundaries
    - Test scoring logic
    - Test win condition detection
    - Skip exhaustive physics edge cases
  - [x] 1.2 Create game state management
    - Create `lib/games/dev-pong/game-logic.ts`
    - Define game state interface (paddles, ball, scores, timing)
    - Create initial game state function
    - Track player paddle Y position
    - Track AI paddle Y position
    - Track ball position (x, y) and velocity (vx, vy)
    - Track scores (player: 0-7, AI: 0-7)
    - Track match start time and duration
    - Track metrics (hit count, ball speed, AI difficulty level)
  - [x] 1.3 Implement ball physics
    - Ball movement with constant velocity
    - Ball collision with top/bottom walls (reflect)
    - Ball collision with paddles (reflect with angle change)
    - Angle calculation based on paddle hit position
    - Ball reset after point scored
    - Ball speed tracking for effects
  - [x] 1.4 Implement paddle physics
    - Paddle movement constraints (stay within game area)
    - Smooth paddle movement interpolation
    - Paddle collision detection with ball
    - Calculate hit position on paddle (for angle variation)
  - [x] 1.5 Implement scoring system
    - Detect when ball passes left paddle (AI scores)
    - Detect when ball passes right paddle (player scores)
    - Award point to appropriate side
    - Reset ball after point
    - Check win condition (first to 7 points)
    - Track match duration
    - Track total hit count
  - [x] 1.6 Ensure game logic tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify game state updates correctly
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Ball physics work correctly with proper collision detection
- Paddles move smoothly within boundaries
- Scoring system accurately awards points
- Win condition triggers at 7 points

### AI Opponent System

#### Task Group 2: Adaptive AI Implementation
**Dependencies:** Task Group 1

- [x] 2.0 Complete AI opponent system
  - [x] 2.1 Write 2-8 focused tests for AI system
    - Test AI paddle movement logic
    - Test AI difficulty scaling
    - Test AI reaction to player skill
    - Test AI never becomes perfect
    - Skip exhaustive AI behavior scenarios
  - [x] 2.2 Create basic AI logic
    - Create `lib/games/dev-pong/ai-logic.ts`
    - AI tracks ball position
    - AI moves paddle toward ball Y position
    - AI has reaction delay (not instant)
    - AI has movement speed limit
  - [x] 2.3 Implement adaptive difficulty
    - Start with slow AI reaction time
    - Track player's average error/skill
    - Calculate player success rate
    - Gradually increase AI speed per player point
    - Scale AI reaction time and movement speed
    - Ensure AI never reaches perfect accuracy
  - [x] 2.4 Add AI personality traits
    - Occasional intentional miss (stays beatable)
    - Slight randomness in positioning
    - Smooth difficulty transitions (invisible to player)
    - Track AI difficulty level in game state
  - [x] 2.5 Ensure AI tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify AI responds appropriately to ball
    - Verify difficulty scales correctly
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- AI opponent provides appropriate challenge
- Difficulty adapts smoothly during match
- AI is always beatable (never perfect)
- Player feels sense of progression

### Canvas Rendering & Visual Effects

#### Task Group 3: Game Rendering
**Dependencies:** Task Groups 1-2

- [x] 3.0 Complete Canvas rendering
  - [x] 3.1 Write 2-8 focused tests for rendering components
    - Test Canvas component initialization
    - Test paddle rendering with bracket style
    - Test ball rendering with particle system
    - Test theme application to colors
    - Skip exhaustive rendering scenarios
  - [x] 3.2 Create Canvas game renderer
    - Create `components/games/dev-pong/PongCanvas.tsx`
    - Set up Canvas element with proper sizing
    - Implement game loop with requestAnimationFrame
    - Maintain 60 FPS performance
    - Handle canvas resize for responsive layout
  - [x] 3.3 Implement paddle rendering
    - Render left paddle as `[` bracket
    - Render right paddle as `]` bracket
    - Apply theme-based colors and glow effect
    - Draw with appropriate thickness (neon/pixel style)
    - Apply paddle glow based on current theme
  - [x] 3.4 Implement ball rendering
    - Render ball as bright pixel dot "•"
    - Create particle trail system behind ball
    - Trail style adapts to theme (neon/pixel/glitch)
    - Micro glitch effect on collision (1 frame distort)
    - Optimize particle system for performance
  - [x] 3.5 Implement background effects
    - Floating code symbols (subtle, non-distracting)
    - Scanlines or terminal horizontal lines
    - Light parallax scrolling (theme-dependent)
    - Ensure effects don't impact gameplay visibility
  - [x] 3.6 Implement collision effects
    - Particle burst on wall hits
    - Micro screen shake on high-velocity collisions
    - Flash effect on paddle hits
    - All effects respect current theme
  - [x] 3.7 Apply theme integration
    - Use theme tokens from `lib/themes.ts`
    - Update colors when theme changes
    - Apply theme-specific effect styles
    - Test all 5 themes (Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal, Blueprint Dev)
  - [x] 3.8 Ensure rendering tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify rendering performance (60 FPS)
    - Verify theme switching works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- Canvas maintains 60 FPS on all devices
- Paddles render as bracket characters with theme styling
- Ball has particle trail effect
- Background effects are subtle and non-distracting
- All visual elements respond to theme changes

### UI Components & Controls

#### Task Group 4: Game Page and Controls
**Dependencies:** Task Groups 1-3

- [x] 4.0 Complete UI components and controls
  - [x] 4.1 Write 2-8 focused tests for UI components
    - Test score display updates
    - Test game over modal triggers
    - Test control input handling
    - Test page layout rendering
    - Skip exhaustive UI interaction scenarios
  - [x] 4.2 Create game page route
    - Create `/app/jogos/dev-pong/page.tsx`
    - Follow layout pattern from Terminal 2048
    - Header with back link and title
    - Score display HUD at top
    - Canvas in center
    - Instructions footer
    - Theme-aware page styling
  - [x] 4.3 Create score display component
    - Create `components/games/dev-pong/ScoreDisplay.tsx`
    - Reuse pattern from Terminal 2048 ScoreDisplay
    - Show player score (left) and AI score (right)
    - Display scores prominently during match
    - Theme-aware styling
    - Responsive layout (mobile and desktop)
  - [x] 4.4 Create game over modal
    - Create `components/games/dev-pong/GameOverModal.tsx`
    - Reuse pattern from Terminal 2048 GameOverModal
    - Display match result (Win/Loss)
    - Display final scores (player vs AI)
    - Display player's earned points (0-7)
    - "Play Again" button
    - "Share" button (placeholder for future)
    - "Back to Home" button
    - Theme-aware styling with backdrop blur
    - Framer Motion animations
  - [x] 4.5 Implement keyboard controls
    - Listen for W/S keys
    - Listen for Arrow Up/Down keys
    - Map to player paddle Y movement
    - Smooth paddle movement
    - Debounce rapid key presses
    - Prevent default browser behavior
  - [x] 4.6 Implement mouse controls
    - Track mouse Y position on canvas
    - Move player paddle to follow cursor Y
    - Option to disable on mobile
    - Smooth paddle following
    - Constrain within game bounds
  - [x] 4.7 Implement touch controls
    - Detect touch/drag on left side of screen
    - Track touch Y position
    - Move player paddle to touch Y position
    - Smooth movement
    - Handle touch start, move, and end
  - [x] 4.8 Add instructions section
    - Display control instructions
    - Keyboard: W/S or Arrow keys
    - Mouse: follow cursor
    - Touch: drag on screen
    - Theme-aware styling
  - [x] 4.9 Ensure UI and controls tests pass
    - Run ONLY the 2-8 tests written in 4.1
    - Verify all control methods work
    - Verify modal triggers correctly
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 4.1 pass
- Game page layout matches Terminal 2048 pattern
- Score display shows both player and AI scores
- Game over modal appears when match ends
- Keyboard, mouse, and touch controls all work
- Controls feel smooth and responsive
- Instructions are clear

### Integration & Polish

#### Task Group 5: Score Submission and Final Polish
**Dependencies:** Task Groups 1-4

- [x] 5.0 Complete integration and polish
  - [x] 5.1 Write 2-8 focused tests for integration
    - Test score submission to API
    - Test game state persistence
    - Test theme integration
    - Test complete game workflow
    - Skip exhaustive integration scenarios
  - [x] 5.2 Integrate score submission
    - Submit score when match ends
    - Follow pattern from Terminal 2048 page.tsx
    - POST to `/api/scores` endpoint
    - Send player's earned points (0-7)
    - Send match duration in seconds
    - Send hit count
    - Send metadata (AI difficulty progression, final ball speed)
    - Send game state for validation (future feature 5b)
    - Handle submission errors gracefully
    - Require user authentication (session check)
  - [x] 5.3 Add game to navigation
    - Verify Dev Pong entry exists in `lib/games.ts`
    - Ensure game appears on home page
    - Test navigation to/from game page
    - Verify game card displays correctly
  - [x] 5.4 Test theme integration
    - Test all 5 themes during gameplay
    - Verify theme switching works in real-time
    - Ensure all colors update correctly
    - Test visual effects adapt to theme
  - [x] 5.5 Performance optimization
    - Profile Canvas rendering (maintain 60 FPS)
    - Optimize particle system
    - Minimize re-renders
    - Test on mobile devices
    - Ensure no memory leaks
  - [x] 5.6 Responsive design testing
    - Test on mobile (320px - 768px)
    - Test on tablet (768px - 1024px)
    - Test on desktop (1024px+)
    - Verify controls work on all sizes
    - Adjust canvas sizing for screens
  - [x] 5.7 Accessibility review
    - Add ARIA labels where needed
    - Ensure keyboard navigation works
    - Test focus management
    - Verify modal accessibility
    - Add skip-to-game link if needed
  - [x] 5.8 Cross-browser testing
    - Test on Chrome/Edge
    - Test on Firefox
    - Test on Safari
    - Verify Canvas API compatibility
    - Fix any browser-specific issues
  - [x] 5.9 Ensure integration tests pass
    - Run ONLY the 2-8 tests written in 5.1
    - Verify complete game workflow
    - Verify score submission works
    - Do NOT run entire test suite
  - [x] 5.10 Final verification
    - Play full match and verify all features work
    - Test win and loss scenarios
    - Verify scores save correctly
    - Test play again functionality
    - Verify all UI elements display correctly

**Acceptance Criteria:**
- The 2-8 tests written in 5.1 pass
- Scores submit successfully to API
- Game appears in navigation
- All 5 themes work correctly
- Performance is 60 FPS on all devices
- Responsive design works across screen sizes
- Accessibility standards met
- Cross-browser compatibility confirmed

## Execution Order

Recommended implementation sequence:
1. Game Logic & Physics (Task Group 1) - Core game mechanics
2. AI Opponent System (Task Group 2) - Intelligent opponent
3. Canvas Rendering & Visual Effects (Task Group 3) - Visual representation
4. UI Components & Controls (Task Group 4) - User interface and input
5. Integration & Polish (Task Group 5) - Complete the feature

## Notes

- Use Canvas API for rendering (lighter than Pixi.js for simple Pong)
- Follow Terminal 2048 patterns for page layout, modal, and score display
- Reuse existing components where possible (GameOverModal, ScoreDisplay patterns)
- Game state structure should be prepared for future server-side validation (feature 5b)
- Focus on smooth gameplay and responsive controls
- Theme integration is critical - test all 5 themes thoroughly
- Optimize for 60 FPS performance on all devices
- Keep match duration short (1-3 minutes) for "decompression break" model
- AI should provide appropriate challenge without being frustrating

