# Task Breakdown: Debug Maze

## Overview
Total Tasks: 5 groups, 30+ sub-tasks

## Task List

### Game Logic & State Management

#### Task Group 1: Core Game Logic
**Dependencies:** None

- [ ] 1.0 Complete game logic implementation
  - [ ] 1.1 Write 2-8 focused tests for game logic
    - Test game state initialization
    - Test grid-based movement (4 directions)
    - Test collision detection (wall blocking)
    - Test patch reach detection
    - Test score calculation (time + moves)
    - Skip exhaustive edge cases
  - [ ] 1.2 Create game state management
    - Create `lib/games/debug-maze/game-logic.ts`
    - Define game state interface (bug position, patch position, maze layout, moves, startTime, duration, level, pathTaken)
    - Create initial game state function
    - Track bug position as grid coordinates (row, col)
    - Track patch position as grid coordinates (row, col)
    - Track maze layout (walls array from JSON)
    - Track moves count
    - Track start time and calculate duration
    - Track current level
    - Track path taken (optional, for pathLength)
    - Structure prepared for future server-side validation
  - [ ] 1.3 Implement grid-based movement
    - Create function to move bug up (row - 1)
    - Create function to move bug down (row + 1)
    - Create function to move bug left (col - 1)
    - Create function to move bug right (col + 1)
    - Validate movement is within maze bounds
    - Check collision with walls before moving
    - Update bug position only if move is valid
    - Increment moves count on successful move
    - Track path taken (add position to path array)
  - [ ] 1.4 Implement collision detection
    - Create function to check if cell is a wall
    - Create function to check if cell is within bounds
    - Create function to check if move is valid (not wall, within bounds)
    - Return false if move would hit wall or go out of bounds
  - [ ] 1.5 Implement patch reach detection
    - Check if bug position equals patch position
    - Set game completed flag when patch is reached
    - Calculate final duration when patch is reached
    - Store final score calculation
  - [ ] 1.6 Implement score calculation
    - Calculate time-based score: `max(1, (tempoMax - tempoUsado))`
    - Calculate move bonus: `bonusPorMovimentos` (fewer moves = higher bonus)
    - Combine time score + move bonus
    - Return score, duration, moves, pathLength, level for API submission
  - [ ] 1.7 Create movement animation state
    - Track if bug is currently animating (moving between cells)
    - Prevent new moves during animation
    - Animation duration: 2-4 frames (short hop)
    - Reset animation state after movement completes
  - [ ] 1.8 Ensure game logic tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify movement works in all 4 directions
    - Verify collision detection blocks wall moves
    - Verify patch reach detection works
    - Verify score calculation is accurate
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Grid-based movement works in all 4 directions
- Collision detection prevents moving into walls
- Patch reach detection triggers game completion
- Score calculation combines time and moves correctly
- Animation state prevents input conflicts

### Maze Data System

#### Task Group 2: Maze Data & Loading
**Dependencies:** Task Group 1

- [ ] 2.0 Complete maze data system
  - [ ] 2.1 Write 2-8 focused tests for maze system
    - Test maze loading from JSON
    - Test maze structure validation
    - Test start/patch position validation
    - Test wall array parsing
    - Skip exhaustive maze validation scenarios
  - [ ] 2.2 Create maze data structure
    - Create `lib/games/debug-maze/mazes.json`
    - Define maze structure: `{ level, width, height, walls: number[][], start: {row, col}, patch: {row, col} }`
    - Create 5-10 predefined mazes (small to medium size)
    - Ensure mazes are solvable (path exists from start to patch)
    - Store mazes as array of maze objects
  - [ ] 2.3 Implement maze loading
    - Create function to load maze by level
    - Create function to load all mazes
    - Validate maze structure (width, height, walls, start, patch)
    - Validate start and patch positions are within bounds
    - Validate start and patch are not on walls
    - Return maze object or null if invalid
  - [ ] 2.4 Implement maze validation
    - Check maze dimensions are valid (width > 0, height > 0)
    - Check walls array matches dimensions
    - Check start position is valid (within bounds, not wall)
    - Check patch position is valid (within bounds, not wall)
    - Basic solvability check (optional, can skip for MVP)
  - [ ] 2.5 Create maze utility functions
    - Function to get maze by level number
    - Function to get total number of mazes
    - Function to check if level exists
    - Function to get default maze (level 1)
  - [ ] 2.6 Ensure maze system tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify mazes load correctly from JSON
    - Verify maze structure validation works
    - Verify start/patch positions are valid
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Mazes load correctly from JSON file
- Maze structure validation catches invalid mazes
- Start and patch positions are validated
- Maze utility functions work correctly

### Canvas Rendering

#### Task Group 3: Canvas Rendering & Visual Effects
**Dependencies:** Task Groups 1-2

- [ ] 3.0 Complete rendering system
  - [ ] 3.1 Write 2-8 focused tests for rendering
    - Test canvas initialization
    - Test maze rendering
    - Test bug rendering
    - Test patch rendering
    - Test theme integration
    - Skip exhaustive rendering scenarios
  - [ ] 3.2 Create Canvas component
    - Create `components/games/debug-maze/DebugMazeCanvas.tsx`
    - Set up Canvas element and context
    - Handle canvas resizing for responsiveness
    - Calculate cell size based on canvas dimensions and maze size
    - Maintain 60 FPS performance
  - [ ] 3.3 Implement maze rendering
    - Draw grid-based maze with walls
    - Render walls with minimalist pixel texture
    - Render floor cells (simple pixel design)
    - Wall colors affected by current theme
    - Floor colors use theme background
    - Calculate cell positions for rendering
  - [ ] 3.4 Implement bug character rendering
    - Draw bug sprite (12-16px pixel art)
    - Render bug at current grid position
    - 2-3 frame movement animation (short hop between cells)
    - Blinking pixel eyes animation
    - Bug color adapts to current theme
    - Smooth animation during cell transition
    - High contrast for visibility
  - [ ] 3.5 Implement patch goal rendering
    - Draw patch sprite (8-bit correction symbol icon)
    - Render patch at goal grid position
    - Looping "pulse" animation
    - Micro glow effect matching current theme
    - Theme-aware glow color
  - [ ] 3.6 Implement theme integration
    - Apply theme colors to walls (use theme border color)
    - Apply theme colors to bug (use theme primary color)
    - Apply theme glow to patch (use theme glow color)
    - Apply theme-specific effects (neon glow, pixel grain, scanlines)
    - Respond to theme changes in real-time
    - Re-render on theme change
  - [ ] 3.7 Optimize rendering performance
    - Only redraw changed cells (optimization)
    - Cache cell positions
    - Minimize canvas operations
    - Ensure 60 FPS on all devices
  - [ ] 3.8 Ensure rendering tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify canvas initializes correctly
    - Verify maze renders with walls
    - Verify bug and patch render at correct positions
    - Verify theme colors apply correctly
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- Maze renders correctly with walls and floor
- Bug sprite renders with movement animation
- Patch sprite renders with pulse animation
- Theme colors apply correctly to all elements
- Rendering maintains 60 FPS

### UI Components

#### Task Group 4: Game UI Components
**Dependencies:** Task Groups 1-3

- [ ] 4.0 Complete UI components
  - [ ] 4.1 Write 2-8 focused tests for UI components
    - Test ScoreDisplay rendering
    - Test GameOverModal rendering
    - Test component props handling
    - Skip exhaustive component state testing
  - [ ] 4.2 Create ScoreDisplay component
    - Create `components/games/debug-maze/ScoreDisplay.tsx`
    - Display current score (time + moves combined)
    - Display best score (from localStorage, per level)
    - Display moves count
    - Display elapsed time
    - Use theme-aware styling
    - Responsive layout (mobile and desktop)
    - Reuse pattern from Terminal 2048 ScoreDisplay
  - [ ] 4.3 Create GameOverModal component
    - Create `components/games/debug-maze/GameOverModal.tsx`
    - Display "Maze Completed!" message
    - Display final score (time + moves)
    - Display best score for level
    - Display moves count and time taken
    - "Play Again" button (restart current level)
    - "Back to Home" link
    - Theme-aware styling with bg-page-secondary, border-border
    - Framer Motion animations (scale, opacity)
    - Accessible (keyboard navigation, ARIA)
    - Reuse pattern from Terminal 2048 GameOverModal
  - [ ] 4.4 Ensure UI component tests pass
    - Run ONLY the 2-8 tests written in 4.1
    - Verify ScoreDisplay shows correct values
    - Verify GameOverModal appears on completion
    - Verify components are theme-aware
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 4.1 pass
- ScoreDisplay shows score, moves, and time correctly
- GameOverModal appears when maze is completed
- All components are theme-aware
- Components are accessible

### Game Page & Integration

#### Task Group 5: Game Page Implementation
**Dependencies:** Task Groups 1-4

- [ ] 5.0 Complete game page
  - [ ] 5.1 Create game page route
    - Create `/app/jogos/debug-maze/page.tsx`
    - Set up page structure following UI/UX Guidelines
    - Use h-screen layout without vertical scroll
    - Import and use game components
    - Add metadata (title, description)
  - [ ] 5.2 Integrate game logic with UI
    - Create React state for game state
    - Connect DebugMazeCanvas to game state
    - Connect ScoreDisplay to game state
    - Connect GameOverModal to game completion
    - Handle state updates immutably
    - Load maze on component mount
  - [ ] 5.3 Implement game loop
    - Use requestAnimationFrame for smooth rendering
    - Update canvas on each frame
    - Handle animation frames for bug movement
    - Handle animation frames for patch pulse
    - Clear interval on component unmount
  - [ ] 5.4 Implement keyboard controls
    - Listen for arrow key presses (↑ ↓ ← →)
    - Listen for WASD key presses
    - Optional: numeric keypad support (8, 2, 4, 6)
    - Map keys to movement directions
    - Prevent default browser behavior
    - Debounce rapid key presses
    - R key for restart level
    - Prevent movement during animation
  - [ ] 5.5 Implement touch controls
    - Detect swipe gestures (up, down, left, right)
    - Use touch event handlers
    - Calculate swipe direction and distance
    - 30px threshold for swipe detection (like Bit Runner)
    - Debounce rapid swipes
    - Prevent movement during animation
  - [ ] 5.6 Implement restart functionality
    - Restart button in UI
    - R key shortcut
    - Reset game state to initial state
    - Reload current level maze
    - Reset score, moves, time
    - Close game over modal if open
  - [ ] 5.7 Implement help panel (UI/UX Guidelines)
    - Create lateral help panel (left side, 320px width)
    - Panel visible by default on desktop
    - Collapsible with close button (✕)
    - Floating help button when panel is hidden (bottom-left)
    - Help content: instructions, controls, tips
    - Scroll internal content if needed
    - Reuse pattern from Crypto Miner game
  - [ ] 5.8 Implement score persistence
    - Save best score per level to localStorage
    - Load best score on level start
    - Update best score if new record
    - Format: `debug-maze-best-level-${level}`
  - [ ] 5.9 Implement score submission
    - Submit score to API when authenticated
    - Send: `{ duration, moves, pathLength?, level }`
    - Handle API errors gracefully
    - Show success/error feedback (optional)
    - Reuse pattern from Terminal 2048/Bit Runner
  - [ ] 5.10 Apply theme-aware styling
    - Use theme tokens throughout page
    - Ensure all components use theme colors
    - Test theme switching during gameplay
    - Add theme-specific effects
  - [ ] 5.11 Add navigation and instructions
    - Back to home link/button
    - Game instructions in help panel
    - Explain controls (keyboard/touch)
    - Explain game objective
    - Theme-aware styling
  - [ ] 5.12 Ensure responsive design
    - Mobile: help panel hidden by default, scroll allowed
    - Desktop: help panel visible, no vertical scroll
    - Touch-friendly controls on mobile
    - Proper spacing and padding on all screen sizes
    - Follow UI/UX Guidelines

**Acceptance Criteria:**
- Game page loads and displays correctly
- Game logic is connected to UI components
- Keyboard and touch controls work correctly
- Help panel follows UI/UX Guidelines
- Theme switching works seamlessly during gameplay
- Score persistence and submission work correctly
- Responsive design works on all devices

## Execution Order

Recommended implementation sequence:
1. **Game Logic & State Management (Task Group 1)** - Core functionality
2. **Maze Data System (Task Group 2)** - Maze definitions and loading
3. **Canvas Rendering (Task Group 3)** - Visual representation
4. **UI Components (Task Group 4)** - Score display and modals
5. **Game Page & Integration (Task Group 5)** - Bring everything together

## Notes

- Game balance (maze difficulty, scoring formula) should be playtested and adjusted
- Maze generation procedural is a future feature (not in this spec)
- Server-side validation is a future feature (not in this spec)
- Focus on making the game fun and playable
- Theme integration is critical for consistency
- Follow UI/UX Guidelines for layout (h-screen, lateral help panel)
- Reuse patterns from Terminal 2048, Bit Runner, and Crypto Miner games

## Testing Checklist

- [ ] Grid-based movement works in all 4 directions
- [ ] Collision detection prevents moving into walls
- [ ] Patch reach detection triggers game completion
- [ ] Score calculation combines time and moves correctly
- [ ] Mazes load correctly from JSON
- [ ] Canvas renders maze, bug, and patch correctly
- [ ] Theme colors apply correctly
- [ ] Keyboard controls work (arrows, WASD, R)
- [ ] Touch controls work (swipe 4 directions)
- [ ] Help panel can be shown/hidden
- [ ] Score persists in localStorage
- [ ] Score submits to API when authenticated
- [ ] Game over modal appears on completion
- [ ] Responsive design works on mobile and desktop
- [ ] Theme switching works during gameplay
- [ ] No console errors or warnings
- [ ] Performance is smooth (60fps)

## Future Enhancements (Out of Scope)

- Procedural maze generation ("infinite mode")
- Multiple difficulty levels
- Obstacles beyond walls (errors, warnings, traps)
- Power-ups and special abilities
- Mobile enemies
- Complex animations
- Skin system
- Cutscenes
- Giant maps
- Mazes with doors/keys
- Life system
- Multiplayer
- Advanced visual effects

