# Task Breakdown: Byte Match

## Overview
Total Tasks: 4 groups, 24 sub-tasks

## Task List

### Game Logic & State Management

#### Task Group 1: Core Game Logic
**Dependencies:** None

- [x] 1.0 Complete game logic implementation
  - [x] 1.1 Create game state management
    - Create `lib/games/byte-match/game-logic.ts`
    - Define game state interface (cards, flippedCards, moves, startTime, duration, matches, gameOver)
    - Create initial game state function with shuffled 4×4 grid (8 pairs)
    - Create card state types: face-down, face-up, matched
    - Track matches sequence for validation
  - [x] 1.2 Implement card grid setup
    - Create function to generate 8 dev-themed pairs
    - Create function to shuffle cards randomly
    - Create function to initialize 4×4 grid with pairs
    - Generate optional seed for reproducible games
  - [x] 1.3 Implement card flip logic
    - Create function to flip card (face-down → face-up)
    - Create function to check if two flipped cards match
    - Create function to handle match (mark both cards as matched)
    - Create function to handle non-match (flip both cards back after delay)
    - Prevent flipping more than two cards simultaneously
  - [x] 1.4 Implement game completion detection
    - Create function to check if all pairs are matched
    - Set gameOver state when all pairs matched
    - Calculate final duration from start time
  - [x] 1.5 Implement scoring system
    - Calculate score: score = max(1, 100 - moves)
    - Track moves count (increment on each pair flip attempt)
    - Track duration (time from start to completion)
    - Save best score to localStorage
    - Structure game state for future server-side validation

**Acceptance Criteria:**
- Game logic functions are pure and testable
- Card grid setup creates 8 pairs correctly
- Card flip logic prevents invalid states
- Game completion detection works correctly
- Scoring formula calculates correctly

### UI Components

#### Task Group 2: Game UI Components
**Dependencies:** Task Group 1

- [x] 2.0 Complete UI components
  - [x] 2.1 Create Card component
    - Create `components/games/byte-match/Card.tsx`
    - Display card face-down state (back design, theme-aware)
    - Display card face-up state (dev-themed icon/pixel art)
    - Display card matched state (highlighted, stays face-up)
    - Simple, elegant flip animation (Framer Motion)
    - Theme-aware styling per theme type
    - Equal size cards to prevent layout expansion
  - [x] 2.2 Create CardGrid component
    - Create `components/games/byte-match/CardGrid.tsx`
    - Render 4×4 grid using CSS Grid
    - Responsive grid that fits without scroll
    - Use theme-aware styling (`bg-page-secondary`, `border-border`)
    - Handle card spacing and sizing
    - Ensure grid never causes desktop scroll
  - [x] 2.3 Create ScoreDisplay component (HUD)
    - Create `components/games/byte-match/ScoreDisplay.tsx`
    - Display current moves count
    - Display timer (duration)
    - Display current score (calculated from moves)
    - Use theme-aware styling
    - Responsive layout that fits at top without pushing canvas
    - Adapt pattern from Terminal 2048 ScoreDisplay
  - [x] 2.4 Create GameOverModal component
    - Create `components/games/byte-match/GameOverModal.tsx`
    - Display "Game Complete" message
    - Display final score
    - Display total moves
    - Display total time
    - "Play Again" button
    - "Back to Home" link
    - "Share Score" placeholder (future)
    - Fixed positioning (not canvas-relative) to prevent scroll
    - Theme-aware styling with Framer Motion animations
    - Adapt pattern from Terminal 2048 GameOverModal
  - [x] 2.5 Create dev-themed pixel art assets
    - Create 8 custom pixel art icons: Git icon, node_modules, package.json, tsconfig.json, CoffeeScript logo, /src folder, .gitignore, README.md
    - Use custom designs (not official logos) to avoid copyright
    - Ensure all assets are equal size
    - Create theme-aware variants or use CSS filters for theme effects

**Acceptance Criteria:**
- Card component flips smoothly with animation
- CardGrid renders 4×4 grid correctly without scroll
- ScoreDisplay shows moves and timer at top
- GameOverModal appears when game completes
- All components are theme-aware
- Pixel art assets are custom and copyright-safe

### Game Page & Integration

#### Task Group 3: Game Page Implementation
**Dependencies:** Task Groups 1-2

- [x] 3.0 Complete game page
  - [x] 3.1 Create game page route
    - Create `/app/jogos/byte-match/page.tsx`
    - Set up page structure with fixed header
    - Import and use game components
    - Follow layout pattern from Terminal 2048
  - [x] 3.2 Implement page layout
    - Fixed header with back link and title
    - HUD at top (ScoreDisplay with moves + timer)
    - Centered game area (CardGrid)
    - Instructions footer with controls info
    - Responsive design for mobile and desktop
    - Ensure no scroll on desktop (critical requirement)
  - [x] 3.3 Implement click/tap controls
    - Handle card click to flip
    - Prevent clicking already flipped or matched cards
    - Prevent clicking more than two cards at once
    - Use invisible overlay during delay to prevent layout expansion
    - Touch support for mobile devices
  - [x] 3.4 Implement flip delay logic
    - Show both flipped cards for 300-600ms
    - Auto-flip non-matching pairs back after delay
    - Keep matching pairs face-up
    - Disable controls during delay
  - [x] 3.5 Implement game timing
    - Start timer when game begins
    - Update timer display in real-time
    - Calculate duration on game completion
    - Use requestAnimationFrame or similar for smooth updates
  - [x] 3.6 Implement theme-aware visual effects
    - Apply theme-specific effects on card flip: neon (fluid glow), pixel (quick dithering), terminal (ASCII flip), hacker (light glitch), blueprint (technical lines + blue pulse)
    - Apply glow/pulse effect when matching pair found
    - Ensure effects don't break 60 FPS on mobile
    - Ensure effects don't increase grid size
  - [x] 3.7 Implement score submission
    - Save best score to localStorage
    - Submit score to `/api/scores` endpoint when game completes
    - Include: gameId: 'byte-match', score, moves, duration, gridSize: 4, seed (optional), matches sequence (optional)
    - Follow pattern from Terminal 2048 score submission
    - Handle authentication (only submit if user logged in)
    - Handle errors gracefully
  - [x] 3.8 Implement play again functionality
    - Reset game state on "Play Again" button click
    - Shuffle cards for new game
    - Reset moves and timer
    - Close modal and start new game

**Acceptance Criteria:**
- Game page renders correctly with no desktop scroll
- Click/tap controls work smoothly
- Flip delay works correctly (300-600ms)
- Timer updates in real-time
- Theme effects apply correctly per theme
- Score submits to API correctly
- Play again resets game properly

### Testing

#### Task Group 4: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-3

- [x] 4.0 Review existing tests and fill critical gaps only
  - [x] 4.1 Review tests from Task Groups 1-3
    - Review any tests written during game logic implementation
    - Review any tests written during UI component development
    - Review any tests written during game page integration
    - Total existing tests: approximately 0-24 tests
  - [x] 4.2 Analyze test coverage gaps for THIS feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to Byte Match game requirements
    - Do NOT assess entire application test coverage
    - Prioritize end-to-end workflows: game start → card flip → match detection → game completion → score submission
  - [x] 4.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on integration points: card matching logic, score calculation, game completion, score submission
    - Do NOT write comprehensive coverage for all scenarios
    - Skip edge cases, performance tests, and accessibility tests unless business-critical
  - [x] 4.4 Run feature-specific tests only
    - Run ONLY tests related to Byte Match feature
    - Expected total: approximately 0-34 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical workflows pass: game logic, card matching, scoring, completion

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 0-34 tests total)
- Critical user workflows for Byte Match are covered
- No more than 10 additional tests added when filling in testing gaps
- Testing focused exclusively on Byte Match feature requirements

## Execution Order

Recommended implementation sequence:
1. Game Logic & State Management (Task Group 1)
2. UI Components (Task Group 2)
3. Game Page & Integration (Task Group 3)
4. Test Review & Gap Analysis (Task Group 4)

## Notes

- **Critical Requirement**: Grid must never cause scroll on desktop - test thoroughly
- **Asset Creation**: Custom pixel art assets needed - ensure copyright-safe designs
- **Theme Integration**: All components must respond to theme changes in real-time
- **Performance**: Maintain 60 FPS on mobile - optimize animations and effects
- **Score Validation**: Structure game state for future server-side validation (feature 5b)

