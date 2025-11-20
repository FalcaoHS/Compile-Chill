# Task Breakdown: Home Page with Game List

## Overview
Total Tasks: 3 groups, 12 sub-tasks

## Task List

### Games Configuration

#### Task Group 1: Games Data Structure
**Dependencies:** None

- [x] 1.0 Complete games configuration
  - [x] 1.1 Create games configuration file
    - Create `lib/games.ts` file
    - Define `Game` interface/type with: id, name, description, route, icon, category
    - Export `GAMES` array with all 10 games
    - Include proper TypeScript types
  - [x] 1.2 Define all 10 games
    - Terminal 2048: Puzzle game with dev-themed tiles
    - Byte Match: Memory matching game with dev-themed pairs
    - Dev Pong: Minimal Pong game with futuristic aesthetics
    - Bit Runner: Endless runner with pixel character
    - Stack Overflow Dodge: Dodge game avoiding falling "errors"
    - Hack Grid: Logic puzzle connecting network nodes
    - Debug Maze: Maze game guiding a "bug" to the patch
    - Refactor Rush: Puzzle reorganizing "code blocks"
    - Crypto Miner Game: Idle clicker mining blocks
    - Packet Switch: Routing logic game directing packets
    - Each game should have: unique id (slug), name, description, route path, icon/emoji
  - [x] 1.3 Export utility functions
    - Export `getGame(id)` function to get game by ID
    - Export `getAllGames()` function to get all games
    - Export `getGamesByCategory()` function (for future use)

**Acceptance Criteria:**
- `lib/games.ts` file exists with proper TypeScript types
- All 10 games are defined with complete information
- Utility functions are exported and typed correctly
- Games can be easily extended in the future

### Game Card Component

#### Task Group 2: Game Card Component
**Dependencies:** Task Group 1

- [x] 2.0 Complete game card component
  - [x] 2.1 Create GameCard component
    - Create `components/GameCard.tsx`
    - Accept game object as prop
    - Display game name, description, icon
    - Use theme-aware Tailwind classes
    - Make card clickable (Link to game route)
  - [x] 2.2 Implement theme-aware styling
    - Use `bg-page-secondary` for card background
    - Use `border-border` for card border
    - Use `text-text` and `text-text-secondary` for text
    - Apply theme-specific hover effects (`hover:bg-page`, `hover:border-primary`, `shadow-glow-sm`)
    - Ensure cards respond to theme changes
  - [x] 2.3 Add hover animations
    - Use Framer Motion for smooth hover effects
    - Implement scale transform on hover
    - Add glow effect on hover (theme-aware)
    - Smooth transitions (200-300ms)
  - [x] 2.4 Implement accessibility
    - Add proper ARIA labels
    - Support keyboard navigation (Enter/Space to activate)
    - Ensure focus states are visible
    - Add role="button" or role="link" as appropriate

**Acceptance Criteria:**
- GameCard component renders correctly with game data
- Cards are theme-aware and respond to theme changes
- Hover animations are smooth and visually appealing
- Cards are accessible via keyboard and screen readers
- Cards navigate to correct game routes

### Home Page Layout

#### Task Group 3: Home Page Implementation
**Dependencies:** Task Groups 1-2

- [x] 3.0 Complete home page implementation
  - [x] 3.1 Update home page layout
    - Modify `app/page.tsx` to include hero section and game grid
    - Keep existing logo, title, and tagline in hero
    - Maintain existing authentication UI (login button, session buttons)
    - Add game grid below hero section
  - [x] 3.2 Implement responsive grid
    - Use Tailwind grid classes
    - 1 column on mobile (sm)
    - 2 columns on tablet (md)
    - 3 columns on desktop (lg)
    - 4 columns on large desktop (xl)
    - Proper gap spacing between cards
  - [x] 3.3 Integrate GameCard components
    - Map over GAMES array to render GameCard for each game
    - Ensure proper key props
    - Handle empty state (if no games)
  - [x] 3.4 Apply theme-aware styling
    - Use theme tokens for page background (`bg-page`)
    - Ensure hero section uses theme colors
    - Maintain consistency with existing theme-aware components
  - [x] 3.5 Test responsive design
    - Verify layout on mobile (320px+)
    - Verify layout on tablet (768px+)
    - Verify layout on desktop (1024px+)
    - Verify layout on large desktop (1280px+)
    - Ensure cards maintain aspect ratio
    - Ensure touch targets are adequate (44x44px minimum)

**Acceptance Criteria:**
- Home page displays hero section and game grid correctly
- Grid is responsive across all breakpoints
- All 10 games are displayed as cards
- Cards are clickable and navigate to game routes
- Page maintains existing authentication functionality
- Page is theme-aware and responds to theme changes
- Layout is accessible and mobile-friendly

## Execution Order

Recommended implementation sequence:
1. Games Configuration (Task Group 1) - Foundation for game data
2. Game Card Component (Task Group 2) - Reusable card component
3. Home Page Layout (Task Group 3) - Integrate everything into home page

## Notes

- Game pages don't exist yet, so links can be placeholders or show "Coming Soon"
- Icons/emojis are temporary until game assets are created
- Future enhancements: search, filter, categories, statistics

