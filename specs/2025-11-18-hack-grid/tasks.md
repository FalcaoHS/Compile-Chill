# Task Breakdown: Hack Grid

## Overview
Total Tasks: 6 groups, 40+ sub-tasks

## Task List

### Game Logic & State Management

#### Task Group 1: Core Game Logic
**Dependencies:** None

- [x] 1.0 Complete game logic implementation
  - [x] 1.1 Write 2-8 focused tests for game logic
    - Test game state initialization
    - Test node connection creation
    - Test connection validation (grid-aligned, straight lines)
    - Test puzzle completion detection
    - Test score calculation (time + efficiency + difficulty)
    - Skip exhaustive edge cases
  - [x] 1.2 Create game state management
    - Create `lib/games/hack-grid/game-logic.ts`
    - Define game state interface (currentLevel, nodes, connections, startTime, duration, moves, segments, completed)
    - Create initial game state function
    - Track current level (number)
    - Track node positions and states (active, connected, completed)
    - Track connections made: array of `{from: nodeId, to: nodeId}` pairs
    - Track game start time and calculate duration
    - Track moves count and segments used
    - Track completion status (all required connections made)
    - Structure prepared for future server-side validation
  - [x] 1.3 Implement node system
    - Create node data structure: `{ id, row, col, type?, state }`
    - Initialize nodes from level data
    - Track node states (idle, active, connected, completed)
    - Handle node selection (source and destination)
    - Validate node positions are within 6×6 grid bounds
  - [x] 1.4 Implement connection mechanics
    - Create function to add connection between two nodes
    - Validate connection is grid-aligned (straight line, horizontal or vertical)
    - Validate connection doesn't already exist
    - Calculate path segments for connection (for scoring)
    - Update node states when connected
    - Store connection in connections array
  - [x] 1.5 Implement connection validation
    - Check if connection follows grid lines (no diagonal, no curves)
    - Check if nodes are in valid positions (within grid)
    - Check if connection path is clear (no obstacles, straight line)
    - Prevent duplicate connections
    - Return validation result (valid/invalid with reason)
  - [x] 1.6 Implement puzzle completion detection
    - Compare made connections with required connections from level
    - Check if all required connections are present
    - Check if no extra unnecessary connections exist (for efficiency bonus)
    - Set completion flag when puzzle is solved
    - Calculate final duration when completed
  - [x] 1.7 Implement score calculation
    - Calculate time bonus: `timeBonus = max(1, (maxTime - duration))`
    - Calculate efficiency bonus: `efficiencyBonus = (requiredSegments / actualSegments) * multiplier`
    - Calculate difficulty multiplier: `difficultyMultiplier = level * baseMultiplier`
    - Combine: `score = timeBonus + efficiencyBonus + difficultyMultiplier`
    - Return score, duration, moves, segments, levelId for API submission
  - [x] 1.8 Implement connection removal (undo)
    - Create function to remove connection by node pair
    - Update node states when connection removed
    - Decrement moves count if undo is used
    - Optional: double-tap to undo (can be disabled)
  - [x] 1.9 Ensure game logic tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify node system works correctly
    - Verify connection validation prevents invalid connections
    - Verify completion detection works
    - Verify score calculation is accurate
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Node system tracks positions and states correctly
- Connection mechanics create valid grid-aligned paths
- Connection validation prevents invalid connections
- Puzzle completion detection triggers when all required connections are made
- Score calculation combines time, efficiency, and difficulty correctly

### Level Data System

#### Task Group 2: Level Data & Loading
**Dependencies:** Task Group 1

- [x] 2.0 Complete level data system
  - [x] 2.1 Write 2-8 focused tests for level system
    - Test level loading from JSON
    - Test level structure validation
    - Test node position validation
    - Test required connections validation
    - Skip exhaustive level validation scenarios
  - [x] 2.2 Create level data structure
    - Create `lib/games/hack-grid/levels.json`
    - Define level structure: `{ level, nodes: [{id, row, col, type?}], requiredConnections: [{from: nodeId, to: nodeId}], difficulty }`
    - Create 5-10 predefined levels with increasing difficulty
    - Ensure levels are solvable (all required connections are possible)
    - Store levels as array of level objects
  - [x] 2.3 Implement level loading
    - Create function to load level by level number
    - Create function to load all levels
    - Validate level structure (nodes, requiredConnections, difficulty)
    - Validate node positions are within 6×6 grid bounds
    - Validate required connections reference valid node IDs
    - Return level object or null if invalid
  - [x] 2.4 Implement level validation
    - Check level number is valid (>= 1)
    - Check nodes array is not empty
    - Check all node positions are within grid (0-5 for 6×6)
    - Check required connections array is not empty
    - Check all required connections reference existing node IDs
    - Basic solvability check (all required connections are possible)
  - [x] 2.5 Create level utility functions
    - Function to get level by level number
    - Function to get total number of levels
    - Function to check if level exists
    - Function to get default level (level 1)
    - Function to get next level (unlock progression)
  - [x] 2.6 Ensure level system tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify levels load correctly from JSON
    - Verify level structure validation works
    - Verify node positions are validated
    - Verify required connections are validated
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Levels load correctly from JSON file
- Level structure validation catches invalid levels
- Node positions and required connections are validated
- Level utility functions work correctly

### Canvas Rendering

#### Task Group 3: Canvas Rendering & Visual Effects
**Dependencies:** Task Groups 1-2

- [x] 3.0 Complete rendering system
  - [x] 3.1 Write 2-8 focused tests for rendering
    - Test canvas initialization
    - Test grid rendering
    - Test node rendering
    - Test connection rendering
    - Test theme integration
    - Skip exhaustive rendering scenarios
  - [x] 3.2 Create Canvas component
    - Create `components/games/hack-grid/HackGridCanvas.tsx`
    - Set up Canvas element and context
    - Handle canvas resizing for responsiveness
    - Calculate cell size based on canvas dimensions and 6×6 grid
    - Maintain 60 FPS performance
    - Ensure canvas fits viewport without scroll
  - [x] 3.3 Implement grid rendering
    - Draw 6×6 grid background
    - Render grid lines (subtle, theme-aware)
    - Apply theme-specific grid styling (scanlines, pixel grain, etc.)
    - Calculate grid cell positions and sizes
    - Ensure grid fits within viewport
  - [x] 3.4 Implement node rendering
    - Render nodes as pixelated servers/routers (8-bit aesthetic)
    - Apply theme-aware colors to nodes
    - Render node pulse animation (smooth pulsing on active nodes)
    - Render different node states (idle, active, connected, completed)
    - Position nodes at grid intersections or cell centers
  - [x] 3.5 Implement connection rendering
    - Render connections as illuminated lines between nodes
    - Apply neon glow effect to active connections (theme-aware)
    - Render path illumination when connection is established
    - Draw straight lines following grid alignment
    - Apply theme-specific connection styling (neon, pixel, ASCII, blueprint)
  - [x] 3.6 Implement visual effects
    - Path illumination animation (glow effect when connected)
    - Node pulse animation (smooth pulsing on active nodes)
    - Completion animation (light flash + glow when puzzle solved)
    - Theme-specific effects: neon glow (Neon Future), pixel grain (Pixel Lab), scanlines (Cyber Hacker), ASCII lines (Terminal), blueprint lines (Blueprint)
    - Optimize effects to maintain 60 FPS
  - [x] 3.7 Implement theme integration
    - Use CSS variables for theme-aware colors
    - Apply theme colors to nodes, connections, and grid
    - Respond to theme changes in real-time
    - Use theme effects (glow, scanline, pixel dithering)
    - Apply global pulse function based on theme
  - [x] 3.8 Ensure rendering tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify canvas renders correctly
    - Verify grid and nodes render
    - Verify connections render with glow
    - Verify theme integration works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- Canvas renders 6×6 grid correctly
- Nodes render as pixelated servers/routers with pulse animation
- Connections render as illuminated lines with neon glow
- Visual effects maintain 60 FPS performance
- Theme integration works for all 5 themes

### Controls Implementation

#### Task Group 4: Input Handling & Controls
**Dependencies:** Task Groups 1-3

- [x] 4.0 Complete controls implementation
  - [x] 4.1 Write 2-8 focused tests for controls
    - Test mouse click and drag
    - Test touch tap and drag
    - Test tap-to-tap selection
    - Test connection creation via controls
    - Skip exhaustive input scenarios
  - [x] 4.2 Implement mouse controls
    - Handle mouse down on source node (select node)
    - Handle mouse move while dragging (track destination)
    - Handle mouse up on destination node (create connection)
    - Calculate node position from mouse coordinates
    - Validate mouse interactions are within canvas bounds
    - Debounce rapid mouse inputs to prevent accidental connections
  - [x] 4.3 Implement touch controls
    - Handle touch start on source node (select node)
    - Handle touch move while dragging (track destination)
    - Handle touch end on destination node (create connection)
    - Alternative: handle tap-to-tap (tap source, then tap destination)
    - Calculate node position from touch coordinates
    - Validate touch interactions are within canvas bounds
    - Prevent default touch behaviors (scroll, zoom)
  - [x] 4.4 Implement connection creation via controls
    - Detect when source and destination nodes are selected
    - Validate connection is possible (grid-aligned, valid)
    - Create connection in game state
    - Update visual feedback (node states, connection glow)
    - Increment moves count
    - Play connection sound/feedback (optional, minimal)
  - [x] 4.5 Implement undo functionality (optional)
    - Detect double-tap/double-click gesture
    - Remove last connection made
    - Update node states
    - Update visual rendering
    - Can be disabled if too complex for MVP
  - [x] 4.6 Implement input debouncing
    - Prevent rapid repeated connections
    - Add small delay between connection attempts
    - Prevent accidental connections from rapid clicks/taps
    - Ensure smooth interaction feel
  - [x] 4.7 Ensure controls tests pass
    - Run ONLY the 2-8 tests written in 4.1
    - Verify mouse controls work correctly
    - Verify touch controls work correctly
    - Verify connection creation via controls works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 4.1 pass
- Mouse click and drag creates connections correctly
- Touch tap and drag creates connections correctly
- Tap-to-tap selection works as alternative
- Input debouncing prevents accidental connections
- Controls work smoothly on both desktop and mobile

### Game Page & UI Components

#### Task Group 5: Game Page and UI
**Dependencies:** Task Groups 1-4

- [x] 5.0 Complete game page and UI
  - [x] 5.1 Write 2-8 focused tests for game page
    - Test page renders correctly
    - Test score display updates
    - Test game over modal triggers
    - Test score submission
    - Skip exhaustive UI scenarios
  - [x] 5.2 Create ScoreDisplay component
    - Create `components/games/hack-grid/ScoreDisplay.tsx`
    - Display current score, best score, time, moves
    - Reuse pattern from `components/games/terminal-2048/ScoreDisplay.tsx`
    - Theme-aware styling using CSS variables
    - Responsive sizing (mobile and desktop)
    - Compact design (no scroll)
  - [x] 5.3 Create GameOverModal component
    - Create `components/games/hack-grid/GameOverModal.tsx`
    - Reuse pattern from `components/games/terminal-2048/GameOverModal.tsx`
    - Display final score, time, moves, efficiency
    - Show "Play Again" and "Next Level" buttons
    - Show "Back to Home" link
    - Theme-aware styling with AnimatePresence
    - Backdrop blur effect
  - [x] 5.4 Create game page
    - Create `app/jogos/hack-grid/page.tsx`
    - Follow layout pattern from `app/jogos/terminal-2048/page.tsx`
    - Header with back link and title (fixed)
    - Score display HUD (compact, no scroll)
    - Centered game canvas area (fits viewport)
    - Game over modal integration
    - Theme-aware container and styling
    - h-screen layout without vertical scroll
  - [x] 5.5 Implement game flow
    - Initialize game at level 1 on page load
    - Load level data and initialize nodes
    - Handle connection creation from controls
    - Detect puzzle completion
    - Show completion animation
    - Display game over modal
    - Handle "Play Again" (restart current level)
    - Handle "Next Level" (unlock and load next level)
    - Submit score to API when authenticated
  - [x] 5.6 Implement score submission
    - Submit score to POST /api/scores endpoint
    - Include: gameId="hack-grid", score, duration, moves, level, metadata={segments}
    - Handle authentication (only logged-in users)
    - Handle API errors gracefully
    - Store best score per level in localStorage
    - Update best score display after submission
  - [x] 5.7 Implement level progression
    - Start at level 1
    - Unlock next level on completion
    - Store unlocked levels in localStorage
    - Level selector UI (compact, no scroll)
    - Allow selecting unlocked levels
  - [x] 5.8 Ensure game page tests pass
    - Run ONLY the 2-8 tests written in 5.1
    - Verify page renders correctly
    - Verify score display updates
    - Verify game over modal works
    - Verify score submission works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 5.1 pass
- Game page renders with correct layout (no scroll)
- Score display shows current score, best score, time, moves
- Game over modal displays correctly with actions
- Score submission works for authenticated users
- Level progression unlocks correctly
- All UI components are theme-aware and responsive

### Testing

#### Task Group 6: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-5

- [ ] 6.0 Review existing tests and fill critical gaps only
  - [ ] 6.1 Review tests from Task Groups 1-5
    - Review the 2-8 tests written by game-logic-engineer (Task 1.1)
    - Review the 2-8 tests written by level-system-engineer (Task 2.1)
    - Review the 2-8 tests written by rendering-engineer (Task 3.1)
    - Review the 2-8 tests written by controls-engineer (Task 4.1)
    - Review the 2-8 tests written by ui-engineer (Task 5.1)
    - Total existing tests: approximately 10-40 tests
  - [ ] 6.2 Analyze test coverage gaps for THIS feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to Hack Grid game requirements
    - Do NOT assess entire application test coverage
    - Prioritize end-to-end workflows over unit test gaps
    - Examples: full game flow (start to completion), score calculation accuracy, level progression
  - [ ] 6.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on integration points and end-to-end workflows
    - Examples: complete puzzle solving flow, score submission integration, theme switching during gameplay
    - Do NOT write comprehensive coverage for all scenarios
    - Skip edge cases, performance tests, and accessibility tests unless business-critical
  - [ ] 6.4 Run feature-specific tests only
    - Run ONLY tests related to Hack Grid feature (tests from 1.1, 2.1, 3.1, 4.1, 5.1, and 6.3)
    - Expected total: approximately 20-50 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical workflows pass
    - Verify all game mechanics work correctly

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 20-50 tests total)
- Critical user workflows for Hack Grid are covered
- No more than 10 additional tests added when filling in testing gaps
- Testing focused exclusively on Hack Grid feature requirements
- End-to-end game flow is tested

## Execution Order

Recommended implementation sequence:
1. Game Logic & State Management (Task Group 1)
2. Level Data System (Task Group 2)
3. Canvas Rendering & Visual Effects (Task Group 3)
4. Input Handling & Controls (Task Group 4)
5. Game Page & UI Components (Task Group 5)
6. Test Review & Gap Analysis (Task Group 6)

