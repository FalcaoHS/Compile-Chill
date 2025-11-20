# Task Breakdown: Packet Switch

## Overview
Total Tasks: 6 groups, 50+ sub-tasks

## Task List

### Game Logic & State Management

#### Task Group 1: Core Game Logic
**Dependencies:** None

- [x] 1.0 Complete game logic implementation
  - [x] 1.1 Write 2-8 focused tests for game logic
    - Test game state initialization
    - Test packet spawning and routing
    - Test node selection and packet movement
    - Test packet completion detection
    - Test score calculation (packets delivered + time + hops + difficulty)
    - Skip exhaustive edge cases
  - [x] 1.2 Create game state management
    - Create `lib/games/packet-switch/game-logic.ts`
    - Define game state interface (currentLevel, nodes, links, activePackets, completedPackets, startTime, duration, moves, averageHops)
    - Create initial game state function
    - Track current level (number)
    - Track nodes array with XY positions, types (source, destination, router), and states
    - Track links array with connections between nodes
    - Track active packets array: each packet has {id, sourceNodeId, currentNodeId, targetNodeId, progress (0-1), hops}
    - Track completed packets count
    - Track game start time and calculate duration
    - Track moves count (user taps)
    - Track average hops per packet
    - Structure prepared for future server-side validation
  - [x] 1.3 Implement node system
    - Create node data structure: `{ id, x, y, type: 'source' | 'destination' | 'router', state: 'idle' | 'active' }`
    - Initialize nodes from level data
    - Track node states (idle when not in use, active when player can interact)
    - Handle node selection for packet routing
    - Validate node positions are within viewport bounds
  - [x] 1.4 Implement link system
    - Create link data structure: `{ from: nodeId, to: nodeId }`
    - Initialize links from level data
    - Validate links connect valid nodes
    - Calculate link distance for packet travel time
    - Store bidirectional link relationships
  - [x] 1.5 Implement packet system
    - Create packet data structure: `{ id, sourceNodeId, destinationNodeId, currentNodeId, targetNodeId, progress, hops }`
    - Spawn packet at source node when level starts
    - Track packet position along link (progress: 0-1)
    - Update packet position each frame during travel
    - Track hops count (number of nodes visited)
    - Handle multiple packets simultaneously
  - [x] 1.6 Implement packet routing logic
    - When player clicks/taps node, set it as target for active packet
    - Validate target node is reachable from current node (link exists)
    - Move packet along link from current node to target node
    - Update packet progress (0 to 1) during travel
    - When packet reaches target node, increment hops and wait for next target
    - When packet reaches destination, mark as completed
  - [x] 1.7 Implement game completion detection
    - Check if all packets have reached their destinations
    - Calculate final duration when all packets completed
    - Calculate average hops per packet
    - Set completion flag when all packets delivered
    - Trigger completion animation
  - [x] 1.8 Implement score calculation
    - Calculate packets delivered count
    - Calculate average hops per packet
    - Calculate duration penalty: `durationPenalty = duration / 1000` (seconds)
    - Calculate final score: `scoreFinal = packetsDelivered * difficulty / averageHops – durationPenalty`
    - Return score data: {score, packetsDelivered, averageHops, duration, moves, levelId} for API submission
  - [x] 1.9 Ensure game logic tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify packet spawning works correctly
    - Verify packet routing logic works
    - Verify completion detection triggers correctly
    - Verify score calculation is accurate
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Packet system spawns and tracks packets correctly
- Packet routing moves packets along links correctly
- Game completion detection triggers when all packets delivered
- Score calculation combines packets delivered, time, hops, and difficulty correctly

### Level Data System

#### Task Group 2: Level Data & Loading
**Dependencies:** Task Group 1

- [x] 2.0 Complete level data system
  - [x] 2.1 Write 2-8 focused tests for level system
    - Test level loading from JSON
    - Test level structure validation
    - Test node position validation (within viewport)
    - Test link validation (connects valid nodes)
    - Skip exhaustive level validation scenarios
  - [x] 2.2 Create level data structure
    - Create `lib/games/packet-switch/levels.json`
    - Define level structure: `{ level, nodes: [{id, x, y, type}], links: [{from: nodeId, to: nodeId}], sourceNodeId, destinationNodeId, packetsToSend, difficulty }`
    - Create 5-10 predefined levels with progressive difficulty:
      - Level 1: Simple route (1 packet, 2-3 nodes)
      - Level 2: 2 packets (2 packets, 3-4 nodes)
      - Level 3: Packet collisions (2 packets, same path, 4-5 nodes)
      - Level 4: Packet priority (multiple packets, different destinations, 5-6 nodes)
      - Level 5: Multiple destinations (1 packet, multiple possible destinations, 5-6 nodes)
      - Level 6: Branches (multiple paths, 6-7 nodes)
      - Level 7: Bottleneck (all packets through one node, 6-7 nodes)
      - Level 8: Complex topology (multiple paths, 7-8 nodes)
      - Level 9: Simultaneous packets (many packets at once, 7-8 nodes)
      - Level 10: Final chaos (complex topology + many packets, 8 nodes)
    - Ensure levels are solvable (all packets can reach destinations)
    - Store levels as array of level objects
  - [x] 2.3 Implement level loading
    - Create function to load level by level number
    - Create function to load all levels
    - Validate level structure (nodes, links, sourceNodeId, destinationNodeId, packetsToSend, difficulty)
    - Validate node positions are within viewport bounds (0 to canvas width/height)
    - Validate links reference valid node IDs
    - Validate source and destination nodes exist
    - Return level object or null if invalid
  - [x] 2.4 Implement level validation
    - Check level number is valid (>= 1)
    - Check nodes array is not empty (6-8 nodes)
    - Check all node positions are within viewport
    - Check links array is not empty
    - Check all links reference existing node IDs
    - Check source and destination nodes are defined
    - Basic solvability check (path exists from source to destination)
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
    - Verify links are validated
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Levels load correctly from JSON file
- Level structure validation catches invalid levels
- Node positions and links are validated
- Level utility functions work correctly

### Canvas Rendering

#### Task Group 3: Canvas Rendering & Visual Effects
**Dependencies:** Task Groups 1-2

- [x] 3.0 Complete rendering system
  - [x] 3.1 Write 2-8 focused tests for rendering
    - Test canvas initialization
    - Test node rendering
    - Test link rendering
    - Test packet particle rendering
    - Test theme integration
    - Skip exhaustive rendering scenarios
  - [x] 3.2 Create Canvas component
    - Create `components/games/packet-switch/PacketSwitchCanvas.tsx`
    - Set up Canvas element and context
    - Handle canvas resizing for responsiveness
    - Calculate viewport bounds for node positioning
    - Maintain 60 FPS performance
    - Ensure canvas fits viewport without scroll
    - Handle device pixel ratio for crisp rendering
  - [x] 3.3 Implement node rendering
    - Render nodes as routers/switches (pixelated, neon, or glitch style based on theme)
    - Apply theme-aware colors to nodes
    - Render node glow when active (player can interact)
    - Render different node types (source, destination, router) with visual distinction
    - Position nodes at XY coordinates from level data
    - Render node pulse animation for active nodes
    - Ensure nodes fit within viewport bounds
  - [x] 3.4 Implement link rendering
    - Render links as cables/connector lights between nodes
    - Draw lines connecting linked nodes
    - Apply theme-aware colors to links
    - Illuminate links during packet transmission (glow effect)
    - Render link glow effect when packet is traveling
    - Apply theme-specific link styling (neon, pixel, ASCII, blueprint)
  - [x] 3.5 Implement packet particle rendering
    - Render packets as animated particles moving along network paths
    - Particles move along link from source node to target node
    - Calculate particle position based on packet progress (0-1)
    - Render particle trail effects (fade over time)
    - Limit maximum particle count (max 30) for performance
    - Particles adapt to current theme colors
    - Lightweight particle system (performance optimized)
  - [x] 3.6 Implement visual effects
    - Node glow when active (player can interact)
    - Link illumination during packet transmission
    - Packet arrival animation: small "pop" of light when packet reaches destination
    - Level completion animation: quick neon animation overlay
    - Theme-specific effects: neon glow (Neon Future), pixel grain (Pixel Lab), scanlines (Cyber Hacker), ASCII lines (Terminal), blueprint lines (Blueprint)
    - Optimize effects to maintain 60 FPS
  - [x] 3.7 Implement theme integration
    - Use CSS variables for theme-aware colors (getThemeColors function)
    - Apply theme colors to nodes, links, and particles
    - Respond to theme changes in real-time
    - Use theme effects (glow, scanline, pixel dithering)
    - Apply global pulse function based on theme
  - [x] 3.8 Ensure rendering tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify canvas renders correctly
    - Verify nodes and links render
    - Verify packet particles render and move
    - Verify theme integration works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- Canvas renders network topology correctly
- Nodes render as routers/switches with glow effects
- Links render as connector lights with illumination
- Packet particles move along paths correctly
- Visual effects maintain 60 FPS performance
- Theme integration works for all 5 themes

### Controls Implementation

#### Task Group 4: Input Handling & Controls
**Dependencies:** Task Groups 1-3

- [x] 4.0 Complete controls implementation
  - [x] 4.1 Write 2-8 focused tests for controls
    - Test mouse click on nodes
    - Test touch tap on nodes
    - Test packet routing via controls
    - Test node selection feedback
    - Skip exhaustive input scenarios
  - [x] 4.2 Implement mouse controls
    - Handle mouse click on canvas
    - Calculate click coordinates relative to canvas
    - Find node at click position (with tolerance for easier clicking)
    - Validate click is within node bounds
    - Set clicked node as target for active packet
    - Update node state to active when clicked
    - Visual feedback on node click (glow, pulse)
  - [x] 4.3 Implement touch controls
    - Handle touch start on canvas
    - Calculate touch coordinates relative to canvas
    - Find node at touch position (with tolerance)
    - Validate touch is within node bounds
    - Set touched node as target for active packet
    - Update node state to active when touched
    - Prevent default touch behaviors (scroll, zoom)
    - Visual feedback on node touch
  - [x] 4.4 Implement packet routing via controls
    - Detect when node is clicked/tapped
    - Validate node is reachable from current packet position (link exists)
    - Set target node for active packet
    - Start packet movement along link
    - Update packet progress each frame
    - Increment moves count when node selected
    - Handle multiple packets (route next available packet)
  - [x] 4.5 Implement coordinate remapping
    - Convert mouse/touch coordinates to canvas coordinates
    - Account for device pixel ratio
    - Account for canvas scaling and positioning
    - Calculate node positions relative to canvas
    - Find nearest node within tolerance radius
  - [x] 4.6 Implement input debouncing
    - Prevent rapid repeated node selections
    - Add small delay between selections
    - Prevent accidental selections from rapid clicks/taps
    - Ensure smooth interaction feel
  - [x] 4.7 Ensure controls tests pass
    - Run ONLY the 2-8 tests written in 4.1
    - Verify mouse controls work correctly
    - Verify touch controls work correctly
    - Verify packet routing via controls works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 4.1 pass
- Mouse click on nodes routes packets correctly
- Touch tap on nodes routes packets correctly
- Node clickable areas don't exceed viewport boundaries
- Input debouncing prevents accidental selections
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
    - Create `components/games/packet-switch/ScoreDisplay.tsx`
    - Display current score, best score, time (MM:SS), moves count, packets delivered
    - Reuse pattern from `components/games/terminal-2048/ScoreDisplay.tsx`
    - Theme-aware styling using CSS variables
    - Responsive sizing (mobile and desktop)
    - Compact design (no scroll, fits in HUD)
  - [x] 5.3 Create GameOverModal component
    - Create `components/games/packet-switch/GameOverModal.tsx`
    - Reuse pattern from `components/games/terminal-2048/GameOverModal.tsx`
    - Display final score, time, moves, packets delivered, average hops
    - Show "Play Again" and "Next Level" buttons (if available)
    - Show "Back to Home" link
    - Theme-aware styling with AnimatePresence
    - Backdrop blur effect
  - [x] 5.4 Create game page
    - Create `app/jogos/packet-switch/page.tsx`
    - Follow layout pattern from `app/jogos/hack-grid/page.tsx`
    - Header with back link and title (fixed)
    - Score display HUD (compact, no scroll)
    - Centered game canvas area (fits viewport)
    - Game over modal integration
    - Theme-aware container and styling
    - h-screen layout without vertical scroll
  - [x] 5.5 Implement game flow
    - Initialize game at level 1 on page load
    - Load level data and initialize nodes/links
    - Spawn packets at source nodes
    - Handle node clicks/taps for packet routing
    - Detect when all packets reach destinations
    - Show completion animation
    - Display game over modal
    - Handle "Play Again" (restart current level)
    - Handle "Next Level" (unlock and load next level)
    - Submit score to API when authenticated
  - [x] 5.6 Implement score submission
    - Submit score to POST /api/scores endpoint
    - Include: gameId="packet-switch", score, duration, moves, level, metadata={packetsDelivered, averageHops, levelId}
    - Handle authentication (only logged-in users)
    - Handle API errors gracefully
    - Store best score per level in localStorage
    - Update best score display after submission
  - [x] 5.7 Implement level progression
    - Start at level 1
    - Unlock next level on completion
    - Store unlocked levels in localStorage
    - Level selector UI (compact, no scroll, must not cause overflow)
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
- Score display shows current score, best score, time, moves, packets delivered
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
    - Focus ONLY on gaps related to Packet Switch game requirements
    - Do NOT assess entire application test coverage
    - Prioritize end-to-end workflows over unit test gaps
    - Examples: full game flow (start to completion), packet routing accuracy, score calculation, level progression
  - [ ] 6.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on integration points and end-to-end workflows
    - Examples: complete packet routing flow, multiple packets simultaneously, score submission integration, theme switching during gameplay
    - Do NOT write comprehensive coverage for all scenarios
    - Skip edge cases, performance tests, and accessibility tests unless business-critical
  - [ ] 6.4 Run feature-specific tests only
    - Run ONLY tests related to Packet Switch feature (tests from 1.1, 2.1, 3.1, 4.1, 5.1, and 6.3)
    - Expected total: approximately 20-50 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical workflows pass
    - Verify all game mechanics work correctly

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 20-50 tests total)
- Critical user workflows for Packet Switch are covered
- No more than 10 additional tests added when filling in testing gaps
- Testing focused exclusively on Packet Switch feature requirements
- End-to-end game flow is tested

## Execution Order

Recommended implementation sequence:
1. Game Logic & State Management (Task Group 1) - Core game mechanics
2. Level Data System (Task Group 2) - Predefined levels with network topologies
3. Canvas Rendering & Visual Effects (Task Group 3) - Visual rendering and animations
4. Input Handling & Controls (Task Group 4) - Mouse/touch controls
5. Game Page & UI Components (Task Group 5) - Page layout and UI
6. Test Review & Gap Analysis (Task Group 6) - Testing and verification

