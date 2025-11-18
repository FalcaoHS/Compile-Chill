# Task Breakdown: Bit Runner

## Overview
Total Tasks: 5 groups, 40+ sub-tasks

## Task List

### Game Logic & Physics

#### Task Group 1: Core Game Engine
**Dependencies:** None

- [x] 1.0 Complete game engine implementation
  - [x] 1.1 Write 2-8 focused tests for game engine
    - Test game state initialization
    - Test character movement and state transitions
    - Test collision detection (character vs obstacles)
    - Test distance tracking
    - Test game over detection
    - Skip exhaustive physics edge cases
  - [x] 1.2 Create game state management
    - Create `lib/games/bit-runner/game-logic.ts`
    - Define game state interface (character position, state, obstacles, distance, speed, timing)
    - Create initial game state function
    - Track character position (x, y) and state (running, jumping, ducking)
    - Track character animation frame
    - Track distance traveled (score)
    - Track game speed (increases over time)
    - Track obstacle positions and types
    - Track game start time and duration
    - Track spawn patterns for validation
  - [x] 1.3 Implement character movement
    - Character runs automatically from left to right
    - Character states: running (default), jumping, ducking)
    - Jump physics: fixed jump height and duration
    - Duck physics: character compresses downward
    - Smooth state transitions between states
    - Character position constraints (stay within game bounds)
    - Animation frame tracking for sprite rendering
  - [x] 1.4 Implement collision detection
    - Character bounding box calculation
    - Obstacle bounding box calculation
    - Collision detection between character and obstacles
    - Collision response: trigger game over
    - Handle collision during jump and duck states
  - [x] 1.5 Implement distance tracking
    - Distance increments continuously while character is alive
    - Distance calculation based on game speed and time
    - Update distance in game state each frame
    - Format distance for display (meters or pixels)
  - [x] 1.6 Implement game over detection
    - Detect collision with any obstacle
    - Set game over flag in state
    - Stop distance tracking on game over
    - Store final distance as score
  - [x] 1.7 Ensure game logic tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify character movement works correctly
    - Verify collision detection works
    - Verify distance tracking increments
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Character moves automatically and responds to jump/duck controls
- Collision detection accurately detects hits
- Distance tracking increments correctly
- Game over triggers on collision

### Obstacle System

#### Task Group 2: Obstacle Spawning & Patterns
**Dependencies:** Task Group 1

- [x] 2.0 Complete obstacle system
  - [x] 2.1 Write 2-8 focused tests for obstacle system
    - Test obstacle spawning logic
    - Test pattern selection and variation
    - Test adaptive difficulty algorithm
    - Test obstacle types and properties
    - Skip exhaustive pattern combinations
  - [x] 2.2 Create obstacle types and definitions
    - Create `lib/games/bit-runner/obstacles.ts`
    - Define obstacle types: Compiler (low), Bug (high), Brackets (medium), node_modules (large), ERROR (suspended), Stack Overflow flame (high), Warning (medium)
    - Define obstacle properties: height, width, position, type, collision box
    - Define obstacle visual properties (colors, pixel art style)
    - Create obstacle factory functions
  - [x] 2.3 Implement pattern-based spawning
    - Create predefined patterns (2-4 obstacles each)
    - Pattern selection algorithm
    - Light randomization between patterns (20-30% variation)
    - Obstacle spacing calculation
    - Spawn obstacles ahead of character
    - Remove obstacles that pass behind character
  - [x] 2.4 Implement adaptive difficulty
    - Track player performance (early failures vs success)
    - Adjust spawn spacing based on performance
    - If player fails early: more spaced spawns for 15-20s
    - If doing well: gradually tighten spacing
    - Smooth difficulty transitions
  - [x] 2.5 Implement difficulty progression
    - Ground scroll speed increases gradually over time
    - Obstacle spacing decreases as game progresses
    - More complex patterns appear (pair combos, double obstacles, high-low combinations)
    - Slight random variation in spawn velocity (20-30%)
    - Update game speed in state
  - [x] 2.6 Ensure obstacle system tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify obstacles spawn correctly
    - Verify patterns work as expected
    - Verify adaptive difficulty adjusts appropriately
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Obstacles spawn in patterns with proper spacing
- Adaptive difficulty adjusts based on player performance
- Difficulty progresses smoothly over time
- All obstacle types are properly defined

### Game Rendering

#### Task Group 3: Canvas Rendering & Visual Effects
**Dependencies:** Task Groups 1-2

- [x] 3.0 Complete rendering system
  - [x] 3.1 Write 2-8 focused tests for rendering
    - Test canvas initialization
    - Test character rendering
    - Test obstacle rendering
    - Test theme integration
    - Skip exhaustive rendering scenarios
  - [x] 3.2 Create Canvas component
    - Create `components/games/bit-runner/BitRunnerCanvas.tsx`
    - Set up Canvas element and context
    - Implement requestAnimationFrame game loop
    - Handle canvas resizing for responsiveness
    - Maintain 60 FPS performance
  - [x] 3.3 Implement character rendering
    - Draw pixel character (12-16px) with dev identity
    - Character sprite with 2-4 frame running animation
    - Jump animation (2 frames in air)
    - Duck animation (compressed sprite)
    - Character colors adapt to current theme
    - High contrast for readability
  - [x] 3.4 Implement obstacle rendering
    - Draw obstacles as pixel art
    - Render each obstacle type with appropriate visual style
    - Obstacle colors use theme palette
    - Avoid excessive text on obstacles
    - Static obstacles (no movement animations)
    - Clear visual distinction between obstacle types
  - [x] 3.5 Implement background rendering
    - Draw scrolling ground
    - Parallax effect for depth
    - Sky/background elements
    - Theme-aware background colors
    - Smooth scrolling animation
  - [x] 3.6 Implement theme integration
    - Apply theme tokens to character, obstacles, background
    - Apply theme-specific effects: neon glow, scanlines, pixel grain, glitch artifacts
    - Real-time theme switching support
    - All visual elements respond to theme changes
  - [x] 3.7 Ensure rendering tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify canvas renders correctly
    - Verify character and obstacles display
    - Verify theme integration works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- Canvas maintains 60 FPS
- Character renders with proper animations
- Obstacles render correctly with theme colors
- Background scrolls smoothly
- All elements are theme-aware

### Game Page & Controls

#### Task Group 4: Game Page and Controls
**Dependencies:** Task Groups 1-3

- [x] 4.0 Complete game page and controls
  - [x] 4.1 Write 2-8 focused tests for game page
    - Test page renders correctly
    - Test controls respond to input
    - Test score display updates
    - Test game over modal appears
    - Skip exhaustive UI scenarios
  - [x] 4.2 Create game page layout
    - Create `app/jogos/bit-runner/page.tsx`
    - Header with back link and title
    - Score display HUD at top (current distance, best distance)
    - Canvas game area in center
    - Instructions footer with controls
    - Responsive layout (mobile and desktop)
    - Theme-aware container styling
  - [x] 4.3 Create score display component
    - Create `components/games/bit-runner/ScoreDisplay.tsx`
    - Display current distance traveled
    - Display best distance (from localStorage)
    - Reuse pattern from Terminal 2048 ScoreDisplay
    - Adapt to show distance instead of score
    - Theme-aware styling
    - Responsive design
  - [x] 4.4 Create game over modal
    - Create `components/games/bit-runner/GameOverModal.tsx`
    - Reuse pattern from Terminal 2048 GameOverModal
    - Display final distance score
    - Display best distance if applicable
    - "Play Again" button
    - "Back to Home" link
    - Theme-aware styling with Framer Motion animations
  - [x] 4.5 Implement keyboard controls
    - Spacebar or Up Arrow for jump
    - Down Arrow for duck
    - Debounce rapid inputs
    - Visual feedback on character state changes
    - Disable controls during game over state
    - Prevent default browser behavior
  - [x] 4.6 Implement touch controls
    - Swipe up for jump
    - Swipe down for duck
    - Touch gesture detection
    - Debounce rapid swipes
    - Works on mobile devices
    - Visual feedback on touch
  - [x] 4.7 Integrate game loop
    - Connect game logic to rendering
    - Update game state each frame
    - Handle character state changes
    - Update obstacle positions
    - Update distance tracking
    - Check for collisions
    - Trigger game over on collision
  - [x] 4.8 Implement localStorage for best score
    - Load best score on page load
    - Save best score when game ends (if new record)
    - Persist across sessions
    - Follow pattern from Terminal 2048
  - [x] 4.9 Ensure game page tests pass
    - Run ONLY the 2-8 tests written in 4.1
    - Verify page renders correctly
    - Verify controls work
    - Verify score display updates
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 4.1 pass
- Game page layout matches design
- Score display shows current and best distance
- Keyboard and touch controls work correctly
- Game over modal appears when character hits obstacle
- Best score saves to localStorage

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
    - Submit score when game ends
    - Follow pattern from Terminal 2048 page.tsx
    - POST to `/api/scores` endpoint
    - Send distance traveled as score
    - Send match duration in seconds
    - Send metadata (final speed, obstacles avoided, patterns encountered)
    - Send game state for validation (future feature)
    - Handle submission errors gracefully
    - Require user authentication (session check)
  - [x] 5.3 Add game to navigation
    - Verify Bit Runner entry exists in `lib/games.ts`
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
    - Optimize obstacle rendering
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
    - Play full game and verify all features work
    - Test jump and duck controls
    - Verify obstacles spawn correctly
    - Test game over detection
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
2. Obstacle System (Task Group 2) - Obstacle spawning and patterns
3. Game Rendering (Task Group 3) - Canvas rendering and visuals
4. Game Page and Controls (Task Group 4) - UI and input handling
5. Integration & Polish (Task Group 5) - Score submission and final touches

