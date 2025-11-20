# Task Breakdown: Terminal 2048

## Overview
Total Tasks: 4 groups, 20 sub-tasks

## Task List

### Game Logic & State Management

#### Task Group 1: Core Game Logic
**Dependencies:** None

- [x] 1.0 Complete game logic implementation
  - [x] 1.1 Create game state management
    - Create `lib/games/terminal-2048/game-logic.ts`
    - Define game state interface (board, score, gameOver, moveCount, startTime)
    - Create initial game state function
    - Create game state update functions
  - [x] 1.2 Implement board operations
    - Create function to initialize empty 4x4 board
    - Create function to add random tile (2 or 4)
    - Create function to check if board is full
    - Create function to check if game is over
  - [x] 1.3 Implement move logic
    - Create function to move tiles left
    - Create function to move tiles right
    - Create function to move tiles up
    - Create function to move tiles down
    - Handle tile merging (combine same values)
    - Handle tile movement (slide to edge)
  - [x] 1.4 Implement score calculation
    - Calculate score from merged tiles
    - Update score on each move
    - Track best score in localStorage
  - [x] 1.5 Create tile value system
    - Define tile progression (1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048+)
    - Map tile values to dev-themed labels (.txt, .js, .ts, .py, etc.)
    - Create function to get tile label from value
    - Create function to get tile icon/emoji from value

**Acceptance Criteria:**
- Game logic functions are pure and testable
- Board operations work correctly
- Move logic handles all 4 directions
- Score calculation is accurate
- Tile system maps values to dev-themed labels

### UI Components

#### Task Group 2: Game UI Components
**Dependencies:** Task Group 1

- [x] 2.0 Complete UI components
  - [x] 2.1 Create GameBoard component
    - Create `components/games/terminal-2048/GameBoard.tsx`
    - Render 4x4 grid using CSS Grid
    - Use theme-aware styling (`bg-page-secondary`, `border-border`)
    - Display tiles in grid cells
    - Handle empty cells
  - [x] 2.2 Create Tile component
    - Create `components/games/terminal-2048/Tile.tsx`
    - Display tile value as dev-themed label
    - Display tile icon/emoji
    - Use theme-aware colors and styling
    - Animate tile appearance and movement (Framer Motion)
    - Different styling for different tile values
  - [x] 2.3 Create ScoreDisplay component
    - Create `components/games/terminal-2048/ScoreDisplay.tsx`
    - Display current score
    - Display best score (from localStorage)
    - Use theme-aware styling
    - Responsive layout
  - [x] 2.4 Create GameOverModal component
    - Create `components/games/terminal-2048/GameOverModal.tsx`
    - Display "Game Over" message
    - Display final score
    - Display best score
    - "Play Again" button
    - "Back to Home" link
    - Theme-aware styling
    - Accessible (keyboard navigation, ARIA)

**Acceptance Criteria:**
- GameBoard renders 4x4 grid correctly
- Tiles display dev-themed labels and icons
- Score display shows current and best score
- GameOverModal appears when game ends
- All components are theme-aware
- Components are accessible

### Game Page & Integration

#### Task Group 3: Game Page Implementation
**Dependencies:** Task Groups 1-2

- [x] 3.0 Complete game page
  - [x] 3.1 Create game page route
    - Create `/app/jogos/terminal-2048/page.tsx`
    - Set up page structure
    - Import and use game components
  - [x] 3.2 Integrate game logic with UI
    - Connect game state to GameBoard
    - Connect score to ScoreDisplay
    - Handle game over state
    - Handle restart functionality
  - [x] 3.3 Apply theme-aware styling
    - Use theme tokens for page background
    - Ensure all components use theme colors
    - Test theme switching during gameplay
  - [x] 3.4 Add game instructions
    - Display controls (keyboard/touch)
    - Display game objective
    - Theme-aware styling
  - [x] 3.5 Add navigation
    - Back to home link
    - Breadcrumb or header navigation
    - Theme-aware styling

**Acceptance Criteria:**
- Game page loads and displays correctly
- Game logic is connected to UI
- Theme switching works during gameplay
- Instructions are clear and visible
- Navigation works correctly

### Controls & Interactions

#### Task Group 4: Input Handling
**Dependencies:** Task Groups 1-3

- [x] 4.0 Complete input handling
  - [x] 4.1 Implement keyboard controls
    - Listen for arrow key presses (↑ ↓ ← →)
    - Map keys to move directions
    - Prevent default browser behavior
    - Debounce rapid key presses
  - [x] 4.2 Implement touch controls
    - Detect swipe gestures (up, down, left, right)
    - Use touch event handlers
    - Calculate swipe direction and distance
    - Debounce rapid swipes
  - [x] 4.3 Add visual feedback
    - Show move animation on valid moves
    - Show error/blocked animation on invalid moves
    - Disable controls during animations
    - Show loading state if needed
  - [x] 4.4 Handle edge cases
    - Prevent moves when game is over
    - Prevent moves during tile animations
    - Handle rapid input (debounce)
    - Handle window focus/blur

**Acceptance Criteria:**
- Keyboard controls work correctly
- Touch controls work on mobile devices
- Visual feedback is clear
- Edge cases are handled gracefully
- Controls are responsive and feel good

## Execution Order

Recommended implementation sequence:
1. Game Logic & State Management (Task Group 1) - Core functionality
2. UI Components (Task Group 2) - Visual representation
3. Game Page & Integration (Task Group 3) - Bring everything together
4. Controls & Interactions (Task Group 4) - User input

## Notes

- Game state structure should be prepared for future validation (feature 5b)
- Score tracking uses localStorage for now (database storage is feature 5)
- Full server-side validation is feature 5b (not this feature)
- Focus on making the game fun and playable
- Theme integration is critical for consistency

