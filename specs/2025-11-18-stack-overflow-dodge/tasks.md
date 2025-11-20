# Task Breakdown: Stack Overflow Dodge

## Overview
Total Tasks: 5 groups, 40+ sub-tasks

## Task List

### Game Logic & Physics

#### Task Group 1: Core Game Engine
**Dependencies:** None

- [x] 1.0 Complete game engine implementation
  - [x] 1.1 Write 2-8 focused tests for game engine
    - Test game state initialization
    - Test player horizontal movement
    - Test error falling physics
    - Test collision detection (player vs errors)
    - Test score tracking (survival-based)
    - Test game over detection
    - Skip exhaustive physics edge cases
  - [x] 1.2 Create game state management
    - Create `lib/games/stack-overflow-dodge/game-logic.ts`
    - Define game state interface (player position, errors array, power-ups array, score, timing, game state flags)
    - Create initial game state function
    - Track player X position at bottom of screen
    - Track falling errors: array of error objects with position, type, speed
    - Track power-ups: array of power-up objects with position, type
    - Track score: current score, best score, survival time
    - Track game state: game over flag, invincibility timer, slowdown timer
    - Track timing: game start timestamp, current game duration
    - Structure for future server-side validation
  - [x] 1.3 Implement player movement
    - Player moves only horizontally at bottom of screen
    - Smooth horizontal movement with constraints (stay within game bounds)
    - Movement speed constant (no acceleration/deceleration)
    - Position updates each frame
    - Character sprite position tracking
  - [x] 1.4 Implement error falling system
    - Errors spawn from top of screen
    - Errors fall downward with increasing speed over time
    - Error types: TypeError, ReferenceError, SyntaxError, 404 Not Found, NullPointerException, Segmentation Fault, Undefined is not a function, buggy pixelated lines
    - Fixed error size to not expand vertical area
    - Remove errors that pass bottom of screen
    - Error speed increases progressively
  - [x] 1.5 Implement collision detection
    - Player bounding box calculation
    - Error bounding box calculation
    - Collision detection between player and errors
    - Collision response: trigger game over (unless invincible)
    - Handle invincibility state (ignore collisions during invincibility timer)
  - [x] 1.6 Implement scoring system
    - Score increases automatically with time: 1 point per X milliseconds alive (gateway of 10-15 pts per second)
    - Update score in game state each frame
    - Track survival time for score calculation
    - Format score for display
  - [x] 1.7 Implement game over detection
    - Detect collision with any falling error (unless invincible)
    - Set game over flag in state
    - Stop score tracking on game over
    - Store final score
  - [x] 1.8 Ensure game logic tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify player movement works correctly
    - Verify errors fall correctly
    - Verify collision detection works
    - Verify score tracking increments
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Player moves horizontally at bottom of screen
- Errors fall from top with increasing speed
- Collision detection accurately detects hits
- Score tracking increments correctly
- Game over triggers on collision

### Power-up System

#### Task Group 2: Power-ups and Effects
**Dependencies:** Task Group 1

- [x] 2.0 Complete power-up system
  - [x] 2.1 Write 2-8 focused tests for power-up system
    - Test power-up spawning logic
    - Test power-up collection detection
    - Test "resolveu!" effect (clear errors or invincibility)
    - Test "copiou do stackoverflow" effect (slowdown)
    - Test power-up bonuses (+50, +30)
    - Skip exhaustive power-up scenarios
  - [x] 2.2 Create power-up types and definitions
    - Create power-up type definitions
    - Define "resolveu!" power-up: clears nearby errors OR grants 2-3 seconds invincibility, +50 bonus points
    - Define "copiou do stackoverflow" power-up: reduces error speed for 3-5 seconds, +30 bonus points
    - Define power-up properties: position, type, visual properties
    - Create power-up factory functions
  - [x] 2.3 Implement power-up spawning
    - Spawn power-ups from top of screen (less frequent than errors)
    - Power-ups fall downward
    - Balanced spawn rate with errors
    - Remove power-ups that pass bottom of screen
    - Power-ups must be small and not push layout
  - [x] 2.4 Implement power-up collection
    - Detect collision between player and power-ups
    - Remove collected power-up from array
    - Trigger power-up effect based on type
    - Apply bonus points to score
  - [x] 2.5 Implement "resolveu!" effect
    - Option 1: Clear all nearby errors (within radius)
    - Option 2: Grant 2-3 seconds of invincibility
    - Pixel/neon explosion animation trigger
    - Quick effect (not long)
    - Add +50 to score
    - Set invincibility timer if chosen
  - [x] 2.6 Implement "copiou do stackoverflow" effect
    - Reduce error speed for 3-5 seconds
    - Visual effect: "wind" rising or blue glitch
    - Add +30 to score
    - Set slowdown timer
    - Apply speed multiplier to all errors
  - [x] 2.7 Implement timer system
    - Track invincibility timer (countdown from 2-3 seconds)
    - Track slowdown timer (countdown from 3-5 seconds)
    - Update timers each frame
    - Reset timers when effect expires
    - Apply effects while timers active
  - [x] 2.8 Ensure power-up system tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify power-ups spawn correctly
    - Verify collection detection works
    - Verify effects apply correctly
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Power-ups spawn and fall correctly
- Power-up collection triggers effects
- "resolveu!" clears errors or grants invincibility
- "copiou do stackoverflow" slows down errors
- Bonus points added correctly
- Timers work correctly

### Difficulty & Error Patterns

#### Task Group 3: Difficulty Progression and Error Spawning
**Dependencies:** Task Group 1

- [x] 3.0 Complete difficulty system
  - [x] 3.1 Write 2-8 focused tests for difficulty system
    - Test error speed progression
    - Test spawn rate increases
    - Test pattern spawning (2-3 simultaneous)
    - Test "chaos" events
    - Test adaptive difficulty
    - Skip exhaustive difficulty scenarios
  - [x] 3.2 Implement error speed progression
    - Error fall speed increases gradually over time
    - Speed multiplier based on game duration
    - Smooth speed transitions
    - Apply slowdown multiplier when "copiou do stackoverflow" active
  - [x] 3.3 Implement spawn rate progression
    - Spawn rate increases as game progresses
    - Calculate spawn intervals based on game duration
    - Spawn errors more frequently over time
    - Maintain balanced difficulty curve
  - [x] 3.4 Implement pattern spawning
    - Spawn errors in patterns (2-3 simultaneous)
    - Pattern selection algorithm
    - Spacing between errors in patterns
    - More complex patterns appear as difficulty increases
    - Random variation in patterns
  - [x] 3.5 Implement "chaos" events
    - After certain time: trigger "chaos" event
    - Intense error rain for 2-3 seconds
    - Increased spawn rate during chaos
    - Return to normal after chaos ends
    - Visual feedback for chaos state
  - [x] 3.6 Implement adaptive difficulty
    - Track player performance (early failures vs success)
    - If player fails early: spawns more spaced for recovery period
    - If doing well: gradually tighten spacing
    - Smooth difficulty transitions
    - Adjust spawn patterns based on performance
  - [x] 3.7 Ensure difficulty system tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify speed progression works
    - Verify spawn rate increases
    - Verify patterns spawn correctly
    - Verify chaos events trigger
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- Error speed increases progressively
- Spawn rate increases over time
- Patterns spawn correctly (2-3 simultaneous)
- Chaos events trigger and end correctly
- Adaptive difficulty adjusts based on performance

### Game Rendering

#### Task Group 4: Canvas Rendering & Visual Effects
**Dependencies:** Task Groups 1-3

- [x] 4.0 Complete rendering system
  - [x] 4.1 Write 2-8 focused tests for rendering
    - Test canvas initialization
    - Test player rendering
    - Test error rendering
    - Test power-up rendering
    - Test theme integration
    - Skip exhaustive rendering scenarios
  - [x] 4.2 Create Canvas component
    - Create `components/games/stack-overflow-dodge/StackOverflowDodgeCanvas.tsx`
    - Set up Canvas element and context
    - Implement requestAnimationFrame game loop
    - Handle canvas resizing for responsiveness
    - Maintain 60 FPS performance
    - h-screen layout without vertical scroll
  - [x] 4.3 Implement player rendering
    - Draw pixel character at bottom of screen
    - Character sprite with simple pixel art style
    - Character colors adapt to current theme
    - High contrast for readability
    - Position at player X coordinate
  - [x] 4.4 Implement error rendering
    - Draw errors as pixel boxes with neon glow
    - Render each error type with appropriate visual style
    - Short text in center ("TypeError" etc.)
    - Error colors use theme palette
    - Light neon border (theme-aware)
    - Fixed error size
    - Clear visual distinction between error types
  - [x] 4.5 Implement power-up rendering
    - Draw "resolveu!" power-up with distinct visual
    - Draw "copiou do stackoverflow" power-up with distinct visual
    - Power-up colors use theme palette
    - Small size (not push layout)
    - Clear visual distinction from errors
  - [x] 4.6 Implement visual effects
    - Small falling particles
    - "resolveu!" explosion animation (pixel/neon)
    - "copiou do stackoverflow" visual effect (wind rising or blue glitch)
    - Light effects to not require expanding canvas
    - Performance-optimized effects
  - [x] 4.7 Implement background rendering
    - Draw background with theme colors
    - Theme-aware background elements
    - Subtle effects (non-distracting)
    - Maintain performance
  - [x] 4.8 Implement theme integration
    - Apply theme tokens to player, errors, power-ups, background
    - Theme-aware colors: Neon Future → purple+blue, Cyber Hacker → matrix green, Pixel Lab → vibrant colors and dithering, Terminal → ASCII errors X and !!!
    - Real-time theme switching support
    - All visual elements respond to theme changes
    - Apply theme-specific effects
  - [x] 4.9 Ensure rendering tests pass
    - Run ONLY the 2-8 tests written in 4.1
    - Verify canvas renders correctly
    - Verify player and errors display
    - Verify power-ups display
    - Verify theme integration works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 4.1 pass
- Canvas maintains 60 FPS
- Player renders correctly at bottom
- Errors render with pixel art and neon glow
- Power-ups render distinctly
- Visual effects work correctly
- All elements are theme-aware

### Game Page & Controls

#### Task Group 5: Game Page and Controls
**Dependencies:** Task Groups 1-4

- [x] 5.0 Complete game page and controls
  - [x] 5.1 Write 2-8 focused tests for game page
    - Test page renders correctly
    - Test controls respond to input
    - Test score display updates
    - Test game over modal appears
    - Skip exhaustive UI scenarios
  - [x] 5.2 Create game page layout
    - Create `app/jogos/stack-overflow-dodge/page.tsx`
    - Header with back link and title
    - Score display HUD at top (current score, best score)
    - Canvas game area in center (h-screen layout without vertical scroll)
    - Instructions footer with controls
    - Responsive layout (mobile and desktop)
    - Theme-aware container styling
  - [x] 5.3 Create score display component
    - Create `components/games/stack-overflow-dodge/ScoreDisplay.tsx`
    - Display current score
    - Display best score (from localStorage)
    - Reuse pattern from Bit Runner ScoreDisplay
    - Adapt to show score instead of distance
    - Theme-aware styling
    - Responsive design
    - Compact, horizontal, right at top of canvas
  - [x] 5.4 Create game over modal
    - Create `components/games/stack-overflow-dodge/GameOverModal.tsx`
    - Reuse pattern from Bit Runner GameOverModal
    - Display final score
    - Display best score if applicable
    - "Play Again" button
    - "Back to Home" link
    - Theme-aware styling with Framer Motion animations
  - [x] 5.5 Implement keyboard controls
    - Arrow keys (←/→) for horizontal movement
    - A/D keys for horizontal movement
    - Debounce rapid inputs
    - Smooth movement
    - Disable controls during game over state
    - Prevent default browser behavior
  - [x] 5.6 Implement mouse controls (optional)
    - Mouse move tracking (light horizontal tracking)
    - Move player to follow cursor X position
    - Smooth movement
    - Constrain within game bounds
    - Option to disable on mobile
  - [x] 5.7 Implement touch controls
    - Left/right swipe detection
    - Move player based on swipe direction
    - Optional virtual buttons (small, don't interfere with canvas)
    - Touch buttons outside area that can cause scroll
    - Debounce rapid swipes
    - Works on mobile devices
  - [x] 5.8 Integrate game loop
    - Connect game logic to rendering
    - Update game state each frame
    - Handle player movement
    - Update error positions
    - Update power-up positions
    - Update score tracking
    - Check for collisions
    - Apply power-up effects
    - Update timers
    - Trigger game over on collision
  - [x] 5.9 Implement localStorage for best score
    - Load best score on page load
    - Save best score when game ends (if new record)
    - Persist across sessions
    - Follow pattern from Bit Runner
  - [x] 5.10 Ensure game page tests pass
    - Run ONLY the 2-8 tests written in 5.1
    - Verify page renders correctly
    - Verify controls work
    - Verify score display updates
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 5.1 pass
- Game page layout matches design
- Score display shows current and best score
- Keyboard, mouse, and touch controls work correctly
- Game over modal appears when player hits error
- Best score saves to localStorage

### Integration & Polish

#### Task Group 6: Score Submission and Final Polish
**Dependencies:** Task Groups 1-5

- [x] 6.0 Complete integration and polish
  - [x] 6.1 Write 2-8 focused tests for integration
    - Test score submission to API
    - Test game state persistence
    - Test theme integration
    - Test complete game workflow
    - Skip exhaustive integration scenarios
  - [x] 6.2 Integrate score submission
    - Submit score when game ends
    - Follow pattern from Bit Runner page.tsx
    - POST to `/api/scores` endpoint
    - Send survival score
    - Send match duration in seconds
    - Send metadata (power-ups collected, errors avoided, final speed)
    - Send game state for validation (future feature)
    - Handle submission errors gracefully
    - Require user authentication (session check)
  - [x] 6.3 Add game to navigation
    - Verify Stack Overflow Dodge entry exists in `lib/games.ts`
    - Ensure game appears on home page
    - Test navigation to/from game page
    - Verify game card displays correctly
  - [x] 6.4 Test theme integration
    - Test all 5 themes during gameplay
    - Verify theme switching works in real-time
    - Ensure all colors update correctly
    - Test visual effects adapt to theme
    - Verify Terminal theme shows ASCII errors
  - [x] 6.5 Performance optimization
    - Profile Canvas rendering (maintain 60 FPS)
    - Optimize error and power-up rendering
    - Minimize re-renders
    - Test on mobile devices
    - Ensure no memory leaks
    - Optimize particle effects
  - [x] 6.6 Responsive design testing
    - Test on mobile (320px - 768px)
    - Test on tablet (768px - 1024px)
    - Test on desktop (1024px+)
    - Verify controls work on all sizes
    - Adjust canvas sizing for screens
    - Ensure no vertical scroll
  - [x] 6.7 Accessibility review
    - Add ARIA labels where needed
    - Ensure keyboard navigation works
    - Test focus management
    - Verify modal accessibility
    - Add skip-to-game link if needed
  - [x] 6.8 Cross-browser testing
    - Test on Chrome/Edge
    - Test on Firefox
    - Test on Safari
    - Verify Canvas API compatibility
    - Fix any browser-specific issues
  - [x] 6.9 Ensure integration tests pass
    - Run ONLY the 2-8 tests written in 6.1
    - Verify complete game workflow
    - Verify score submission works
    - Do NOT run entire test suite
  - [x] 6.10 Final verification
    - Play full game and verify all features work
    - Test power-up collection and effects
    - Test difficulty progression
    - Test chaos events
    - Verify scores save correctly
    - Test play again functionality
    - Verify all UI elements display correctly
    - Verify no vertical scroll on desktop

**Acceptance Criteria:**
- The 2-8 tests written in 6.1 pass
- Scores submit successfully to API
- Game appears in navigation
- All 5 themes work correctly
- Performance is 60 FPS on all devices
- Responsive design works across screen sizes
- No vertical scroll on desktop
- Accessibility standards met
- Cross-browser compatibility confirmed

## Execution Order

Recommended implementation sequence:
1. Game Logic & Physics (Task Group 1) - Core game mechanics
2. Power-up System (Task Group 2) - Power-ups and effects
3. Difficulty & Error Patterns (Task Group 3) - Difficulty progression
4. Game Rendering (Task Group 4) - Canvas rendering and visuals
5. Game Page and Controls (Task Group 5) - UI and input handling
6. Integration & Polish (Task Group 6) - Score submission and final touches

## Notes

- Use Canvas API for rendering (like Bit Runner, Dev Pong)
- Follow Bit Runner patterns for page layout, modal, and score display
- Reuse existing components where possible (GameOverModal, ScoreDisplay patterns)
- Game state structure should be prepared for future server-side validation
- Focus on smooth gameplay and responsive controls
- Theme integration is critical - test all 5 themes thoroughly
- Optimize for 60 FPS performance on all devices
- Keep game duration short (1-3 minutes) for "decompression break" model
- Ensure no vertical scroll - h-screen layout is critical
- Power-ups must be small and not push layout
- All elements must fit within viewport without expanding

