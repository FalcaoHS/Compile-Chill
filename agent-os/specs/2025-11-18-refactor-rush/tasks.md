# Task Breakdown: Refactor Rush

## Overview
Total Tasks: 6 groups, 50+ sub-tasks

## Task List

### Game Logic & State Management

#### Task Group 1: Core Game Logic
**Dependencies:** None

- [x] 1.0 Complete game logic implementation
  - [x] 1.1 Write 2-8 focused tests for game logic
    - Test game state initialization
    - Test grid creation and block placement
    - Test drag-and-drop position updates
    - Test puzzle completion detection
    - Test score calculation (moves + time + difficulty)
    - Skip exhaustive edge cases
    - [x] 1.2 Create game state management
    - Create `lib/games/refactor-rush/game-logic.ts`
    - Define game state interface (grid, targetGrid, moves, startTime, duration, level, completed, gameOver)
    - Create initial game state function
    - Track current grid arrangement (2D array of block IDs or null)
    - Track target grid arrangement for level
    - Track moves count and game start time
    - Track completion status (grid matches target)
    - Structure prepared for future server-side validation
    - [x] 1.3 Implement grid system
    - Create grid data structure (3×3, 4×4, 5×5 based on level)
    - Initialize grid with block positions from level data
    - Track empty cells (null) and occupied cells (block ID)
    - Validate grid bounds for all operations
    - Ensure grid fits within viewport constraints
    - [x] 1.4 Implement block movement logic
    - Create function to move block from source to destination
    - Validate move is within grid bounds
    - Handle swapping blocks (if destination occupied)
    - Update grid state after move
    - Track move history for undo functionality
    - Increment moves counter on valid move
    - [x] 1.5 Implement puzzle completion detection
    - Compare current grid with target grid
    - Check if all blocks are in correct positions
    - Set completion flag when puzzle is solved
    - Calculate final duration when completed
    - Calculate correct placements count for scoring
    - [x] 1.6 Implement score calculation
    - Calculate score: `score = max(1, 500 - moves*4 - duration*2)` where duration is in seconds
    - Track moves, duration, gridSize, correctPlacements, levelId
    - Return score data for API submission
    - Store best scores per level in localStorage
    - [x] 1.7 Implement undo functionality
    - Create function to undo last move (1 level only)
    - Restore previous grid state from move history
    - Decrement moves count when undo is used
    - Prevent undo when no moves available
    - [x] 1.8 Ensure game logic tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify grid system works correctly
    - Verify block movement updates grid correctly
    - Verify completion detection works
    - Verify score calculation is accurate
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Grid system tracks block positions correctly
- Block movement updates grid state correctly
- Puzzle completion detection triggers when grid matches target
- Score calculation combines moves, time, and difficulty correctly
- Undo functionality restores previous state

### Level Data System

#### Task Group 2: Level Data & Loading
**Dependencies:** Task Group 1

- [x] 2.0 Complete level data system
  - [x] 2.1 Write 2-8 focused tests for level system
    - Test level loading from JSON
    - Test level structure validation
    - Test grid size validation
    - Test target arrangement validation
    - Skip exhaustive level validation scenarios
    - [x] 2.2 Create level data structure
    - Create `lib/games/refactor-rush/levels.json`
    - Define level structure: `{ level, gridSize, initialBlocks: [{id, type, row, col}], targetBlocks: [{id, type, row, col}], rules: string }`
    - Create 10 predefined levels with progressive difficulty (3×3 → 4×4 → 5×5)
    - Ensure levels are solvable (target arrangement is reachable)
    - Store levels as array of level objects
    - [x] 2.3 Implement level loading
    - Create function to load level by level number
    - Create function to load all levels
    - Validate level structure (gridSize, initialBlocks, targetBlocks, rules)
    - Validate grid size is 3, 4, or 5
    - Validate block positions are within grid bounds
    - Validate target arrangement matches initial block count
    - Return level object or null if invalid
    - [x] 2.4 Implement level validation
    - Check level number is valid (1-10)
    - Check grid size is valid (3, 4, or 5)
    - Check initial blocks array is not empty
    - Check all block positions are within grid bounds
    - Check target blocks match initial blocks (same IDs and types)
    - Basic solvability check (target is reachable)
    - [x] 2.5 Create level utility functions
    - Function to get level by level number
    - Function to get total number of levels (10)
    - Function to check if level exists
    - Function to get default level (level 1)
    - Function to get next level (unlock progression)
    - [x] 2.6 Ensure level system tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify levels load correctly from JSON
    - Verify level structure validation works
    - Verify grid size and block positions are validated
    - Verify target arrangement validation works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Levels load correctly from JSON file
- Level structure validation catches invalid levels
- Grid size and block positions are validated
- Level utility functions work correctly

### Code Block System

#### Task Group 3: Code Block Types & Styling
**Dependencies:** Task Groups 1-2

- [x] 3.0 Complete code block system
  - [x] 3.1 Write 2-8 focused tests for block system
    - Test block type definitions
    - Test block styling per theme
    - Test block icon/emoji rendering
    - Test block text content
    - Skip exhaustive styling scenarios
    - [x] 3.2 Create block type definitions
    - Create `lib/games/refactor-rush/block-types.ts`
    - Define 6 block types: imports, constants, functions, classes, comments, returns
    - Each type has: id, label, icon/emoji, default color
    - Create block type constants and type definitions
    - [x] 3.3 Implement block styling system
    - Create theme-aware color mapping for each block type
    - Map block types to theme tokens (bg-page-secondary, border-border, text-text)
    - Create styling function that returns classes based on block type and active theme
    - Ensure all blocks use consistent sizing (same height/width)
    - Prevent vertical growth with fixed block dimensions
    - [x] 3.4 Create block content system
    - Generate code-like text snippets for each block type
    - Examples: "import {...}", "const variable", "function method()", "class Something {}", "// comments", "return …"
    - Create function to get block text content by type
    - Ensure text is readable and theme-appropriate
    - [x] 3.5 Implement block icon system
    - Create icon/emoji mapping for each block type
    - Icons should be theme-appropriate (can be emoji or SVG)
    - Create function to get block icon by type
    - Ensure icons are visible in all themes
    - [x] 3.6 Ensure block system tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify block types are defined correctly
    - Verify styling adapts to active theme
    - Verify block content and icons render correctly
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- All 6 block types are defined with proper labels and icons
- Block styling adapts correctly to all 5 themes
- All blocks use consistent sizing
- Block content displays correctly

### Drag-and-Drop & Controls

#### Task Group 4: Interaction System
**Dependencies:** Task Groups 1-3

- [x] 4.0 Complete interaction system
  - [x] 4.1 Write 2-8 focused tests for controls
    - Test drag-and-drop on desktop
    - Test tap-select-tap on mobile
    - Test keyboard navigation
    - Test undo functionality
    - Skip exhaustive interaction scenarios
  - [x] 4.2 Implement drag-and-drop for desktop
    - Use HTML5 drag API or pointer events
    - Handle drag start (block selection)
    - Handle drag over (target cell highlighting)
    - Handle drop (block placement)
    - Validate drag boundaries (within grid)
    - Prevent accidental moves with proper validation
    - Add ARIA labels for accessibility
  - [x] 4.3 Implement tap-select-tap for mobile
    - Handle first tap (block selection/highlighting)
    - Handle second tap (block placement at target)
    - Visual feedback for selected block
    - Visual feedback for target cell
    - Ensure touch targets are minimum 44×44px
  - [x] 4.4 Implement keyboard navigation (optional)
    - Arrow keys to navigate between blocks
    - Space key to select block
    - Enter key to place block at target
    - Tab key to navigate between interactive elements
    - Focus management for keyboard users
  - [x] 4.5 Implement visual feedback
    - Highlight selected block (border, glow, or background change)
    - Highlight target cell on drag over or tap
    - Show drop zone indicators
    - Visual feedback for invalid moves
    - Ensure feedback is theme-aware
  - [x] 4.6 Integrate undo button
    - Create undo button component
    - Connect to undo functionality from game logic
    - Disable button when no moves to undo
    - Visual feedback when undo is used
    - Position button in accessible location (not blocking grid)
  - [x] 4.7 Ensure interaction tests pass
    - Run ONLY the 2-8 tests written in 4.1
    - Verify drag-and-drop works on desktop
    - Verify tap-select-tap works on mobile
    - Verify keyboard navigation works (if implemented)
    - Verify undo functionality works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 4.1 pass
- Drag-and-drop works smoothly on desktop
- Tap-select-tap works correctly on mobile
- Keyboard navigation works (if implemented)
- Visual feedback is clear and theme-aware
- Undo button functions correctly

### Particle Effects System

#### Task Group 5: Visual Effects
**Dependencies:** Task Groups 1-4

- [x] 5.0 Complete particle effects system
  - [x] 5.1 Write 2-8 focused tests for particle system
    - Test particle triggering on block placement
    - Test particle triggering on completion
    - Test theme-aware particle styles
    - Test particle performance (light-weight)
    - Skip exhaustive particle scenarios
  - [x] 5.2 Create particle system foundation
    - Create `lib/games/refactor-rush/particles.ts` or use Framer Motion
    - Define particle types per theme
    - Create lightweight particle engine (or use Framer Motion animations)
    - Ensure particles don't expand bounding box (no scroll generation)
  - [x] 5.3 Implement block placement particles
    - Trigger light particles when block is placed (correct or incorrect)
    - Particles appear at block placement location
    - Particles fade out quickly (1-2 seconds max)
    - Light-weight animation (not performance-intensive)
  - [x] 5.4 Implement completion animation
    - Strong thematic animation when puzzle completes
    - Animation matches active theme aesthetic
    - Duration: 2-3 seconds
    - Can use Framer Motion for smooth animations
  - [x] 5.5 Implement theme-aware particle styles
    - Cyber Hacker: green "data packet" particles (small squares with glow)
    - Pixel Lab: 8-bit square particles (pixelated squares)
    - Neon Future: streaks and small glows (neon lines)
    - Blueprint: strokes drawing in air (line animations)
    - Terminal: ASCII characters ('+', '#', ':')
  - [x] 5.6 Ensure particle system tests pass
    - Run ONLY the 2-8 tests written in 5.1
    - Verify particles trigger on block placement
    - Verify completion animation plays
    - Verify theme-aware styles apply correctly
    - Verify particles don't cause performance issues
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 5.1 pass
- Particles trigger on valid actions only (not every movement)
- Completion animation is strong and thematic
- Particle styles adapt to active theme
- Particles are light-weight and don't expand bounding box

### UI Components

#### Task Group 6: Game UI Components
**Dependencies:** Task Groups 1-5

- [x] 6.0 Complete UI components
  - [x] 6.1 Write 2-8 focused tests for UI components
    - Test ScoreDisplay rendering
    - Test GameOverModal rendering
    - Test CodeBlock component rendering
    - Test Grid component rendering
    - Skip exhaustive component scenarios
  - [x] 6.2 Create CodeBlock component
    - Create `components/games/refactor-rush/CodeBlock.tsx`
    - Display block type icon/emoji
    - Display block text content
    - Apply theme-aware styling from block system
    - Support drag-and-drop props
    - Support tap-select-tap props
    - Ensure consistent sizing (same height/width)
    - Accessible (ARIA labels, keyboard support)
  - [x] 6.3 Create Grid component
    - Create `components/games/refactor-rush/RefactorGrid.tsx`
    - Render grid using CSS Grid (3×3, 4×4, or 5×5)
    - Display blocks in grid cells
    - Handle empty cells (null)
    - Support drag-and-drop interactions
    - Support tap-select-tap interactions
    - Responsive scaling (fits viewport without scroll)
    - Theme-aware styling (bg-page-secondary, border-border)
  - [x] 6.4 Create ScoreDisplay component
    - Reuse pattern from `components/games/hack-grid/ScoreDisplay.tsx`
    - Display score, time (MM:SS), and moves
    - Compact responsive sizing (min-w-[80px] sm:min-w-[100px])
    - Theme-aware styling (bg-page-secondary, border-border, text-text)
    - Must not pressure canvas area (compact layout)
  - [x] 6.5 Create GameOverModal component
    - Reuse pattern from `components/games/hack-grid/GameOverModal.tsx`
    - Display final score, time, moves, and best score
    - "Play Again" button
    - "Next Level" button (if available)
    - "Back to Home" link
    - AnimatePresence animations
    - Backdrop blur and theme-aware styling
    - Accessible (keyboard navigation, ARIA)
  - [x] 6.6 Create UndoButton component
    - Create `components/games/refactor-rush/UndoButton.tsx`
    - Display undo icon/button
    - Disable when no moves to undo
    - Theme-aware styling
    - Accessible (ARIA label, keyboard support)
  - [x] 6.7 Ensure UI component tests pass
    - Run ONLY the 2-8 tests written in 6.1
    - Verify CodeBlock renders correctly
    - Verify Grid renders correctly
    - Verify ScoreDisplay shows correct data
    - Verify GameOverModal appears on completion
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 6.1 pass
- CodeBlock component displays block content and icons correctly
- Grid component renders blocks in correct positions
- ScoreDisplay shows score, time, and moves
- GameOverModal appears when puzzle completes
- All components are theme-aware and accessible

### Game Page & Integration

#### Task Group 7: Game Page Implementation
**Dependencies:** Task Groups 1-6

- [x] 7.0 Complete game page
  - [x] 7.1 Write 2-8 focused tests for game page
    - Test page renders correctly
    - Test game initialization
    - Test score submission
    - Test level progression
    - Skip exhaustive page scenarios
  - [x] 7.2 Create game page route
    - Create `app/jogos/refactor-rush/page.tsx`
    - Follow layout pattern from `app/jogos/debug-maze/page.tsx`
    - Use h-screen flex flex-col overflow-hidden (no vertical scroll on desktop)
    - Import and use all game components
  - [x] 7.3 Implement page layout structure
    - Fixed header with back link and title
    - Optional lateral help panel (w-80, collapsible) following Debug Maze pattern
    - Floating help button when panel is hidden
    - Stats bar (border-b border-border bg-page-secondary flex-shrink-0) with ScoreDisplay
    - Centered game area (flex-1 overflow-hidden flex items-center justify-center)
    - Game grid container with responsive scaling
  - [x] 7.4 Integrate game logic
    - Initialize game state on page load (level 1)
    - Connect drag-and-drop to game logic
    - Connect tap-select-tap to game logic
    - Connect keyboard navigation (if implemented)
    - Connect undo button to game logic
    - Update game state on moves
    - Detect completion and show modal
  - [x] 7.5 Implement level progression
    - Load level data on initialization
    - Unlock next level on completion
    - Track level completion in localStorage
    - Handle "Next Level" button in modal
    - Handle "Play Again" button (restart current level)
  - [x] 7.6 Implement score submission
    - Submit scores to `/api/scores` endpoint
    - Include metadata: moves, duration, gridSize, correctPlacements, levelId
    - Only submit for authenticated users
    - Handle submission errors gracefully
    - Store best scores per level in localStorage
  - [x] 7.7 Implement responsive design
    - Mobile: help panel hidden by default, tap-select-tap controls
    - Tablet: help panel optional, both control methods
    - Desktop: help panel visible by default, drag-and-drop controls
    - Ensure grid scales responsively without exceeding viewport
    - No vertical scroll on desktop (h-screen constraint)
  - [x] 7.8 Add help panel content
    - Instructions on how to play (drag-and-drop, tap-select-tap)
    - Level rules/expected order (minimal UI)
    - Keyboard shortcuts (if implemented)
    - Tips and strategies
    - Theme-aware styling
  - [x] 7.9 Ensure game page tests pass
    - Run ONLY the 2-8 tests written in 7.1
    - Verify page renders correctly
    - Verify game initializes correctly
    - Verify score submission works
    - Verify level progression works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 7.1 pass
- Page follows UI/UX Guidelines (h-screen, no scroll on desktop)
- Game initializes with level 1
- Drag-and-drop and tap-select-tap work correctly
- Score submission works for authenticated users
- Level progression unlocks next level on completion
- Help panel is accessible and informative

### Testing

#### Task Group 8: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-7

- [ ] 8.0 Review existing tests and fill critical gaps only
  - [ ] 8.1 Review tests from Task Groups 1-7
    - Review the 2-8 tests written by game-logic-engineer (Task 1.1)
    - Review the 2-8 tests written by level-system-engineer (Task 2.1)
    - Review the 2-8 tests written by block-system-engineer (Task 3.1)
    - Review the 2-8 tests written by controls-engineer (Task 4.1)
    - Review the 2-8 tests written by particles-engineer (Task 5.1)
    - Review the 2-8 tests written by ui-engineer (Task 6.1)
    - Review the 2-8 tests written by page-engineer (Task 7.1)
    - Total existing tests: approximately 14-56 tests
  - [ ] 8.2 Analyze test coverage gaps for THIS feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to Refactor Rush feature requirements
    - Do NOT assess entire application test coverage
    - Prioritize end-to-end workflows over unit test gaps
    - Examples: full game flow (start → play → complete → submit score), level progression, theme switching
  - [ ] 8.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on integration points and end-to-end workflows
    - Do NOT write comprehensive coverage for all scenarios
    - Skip edge cases, performance tests, and accessibility tests unless business-critical
    - Examples: end-to-end game completion flow, score submission integration, level unlock progression
  - [ ] 8.4 Run feature-specific tests only
    - Run ONLY tests related to Refactor Rush feature (tests from 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, and 8.3)
    - Expected total: approximately 24-66 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 24-66 tests total)
- Critical user workflows for Refactor Rush are covered
- No more than 10 additional tests added when filling in testing gaps
- Testing focused exclusively on Refactor Rush feature requirements

## Execution Order

Recommended implementation sequence:
1. Game Logic & State Management (Task Group 1)
2. Level Data System (Task Group 2)
3. Code Block System (Task Group 3)
4. Drag-and-Drop & Controls (Task Group 4)
5. Particle Effects System (Task Group 5)
6. UI Components (Task Group 6)
7. Game Page & Integration (Task Group 7)
8. Test Review & Gap Analysis (Task Group 8)

