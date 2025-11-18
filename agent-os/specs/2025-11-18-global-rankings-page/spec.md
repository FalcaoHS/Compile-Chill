# Specification: Global Rankings Page

## Goal
Create a public rankings page that displays top players globally and per-game leaderboards with pagination, sorting, and theme-aware UI, ensuring all ranking data is read-only and properly sanitized.

## User Stories
- As a user, I want to view global rankings across all games so that I can see who has the highest scores overall
- As a user, I want to view per-game leaderboards so that I can see top players for specific games
- As a logged-in user, I want my position highlighted in rankings so that I can easily see where I rank

## Specific Requirements

**Tab-Based Navigation**
- Single page with tabs/abas to switch between "Global" and "Per Game" views
- Use existing navigation patterns similar to ProfileNavigation component
- Active tab should be visually highlighted with theme-aware styling
- Tabs should be accessible with keyboard navigation

**Global Rankings View**
- Display best scores from all games combined, ordered by score (highest to lowest)
- Show only scores where `isBestScore = true` for fair rankings
- Each entry displays: position/rank, user avatar, user name, score value
- Optionally display duration and moves if available for each score
- Fixed pagination of 20 items per page
- May require new API endpoint or extend existing endpoint to aggregate across all games

**Per Game Rankings View**
- Display ranking for a specific game selected via dropdown/selector
- Game selector shows all 10 games from `lib/games.ts` (even if some don't have scores - show empty state)
- Use existing `/api/scores/leaderboard` endpoint with `gameId` query parameter
- Same display format as Global view: position, avatar, name, score, optional duration/moves
- Fixed pagination of 20 items per page
- Show empty state message when selected game has no scores

**User Position Highlighting**
- If user is logged in, highlight their position in the ranking with visual indicator (highlight or badge)
- Use NextAuth session detection to identify logged-in user
- Highlight should be theme-aware and clearly visible
- Works in both Global and Per Game views

**Pagination Controls**
- Fixed pagination at 20 items per page (no user-configurable options)
- Display pagination controls: Previous/Next buttons and page numbers
- Show total pages and current page information
- Disable Previous button on first page, Next button on last page
- Follow existing pagination patterns from API endpoints

**Theme-Aware UI Styling**
- Apply theme-aware styling using existing theme system (`useThemeStore` hook)
- Use theme CSS variables for colors, borders, and effects
- Follow existing component styling patterns from StatisticsPanel and ScoreCard
- Ensure rankings page works with all 5 visual themes (Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal, Blueprint Dev)
- Use Framer Motion for smooth transitions and animations

**Data Sanitization and Security**
- All ranking data is read-only (no write operations)
- Sanitize all user data (names, avatars) before display to prevent XSS
- Use existing error handling patterns (centralized error handler from `lib/api-errors.ts`)
- Page is public and accessible to all users (no authentication required)
- Validate all API query parameters using Zod schemas

**API Integration**
- Use existing `/api/scores/leaderboard` endpoint for per-game rankings
- Create or extend endpoint for global rankings (all games combined)
- Use Prisma queries with `isBestScore = true` filter
- Follow existing API response formats for consistency
- Use existing pagination query parameter patterns (`page`, `limit`)
- Consider performance optimization for global ranking aggregation

**Empty States**
- Show appropriate empty state when no scores exist for selected game
- Display user-friendly message encouraging users to play games
- Empty state should be theme-aware and visually consistent

**Responsive Design**
- Mobile-first responsive layout using TailwindCSS
- Rankings table/list should adapt to different screen sizes
- Pagination controls should work well on mobile devices
- Game selector dropdown should be touch-friendly

## Visual Design
No visual assets provided.

## Existing Code to Leverage

**Leaderboard API Endpoint (`app/api/scores/leaderboard/route.ts`)**
- Returns top scores per game with pagination
- Filters by `isBestScore = true` for accurate leaderboards
- Includes user information (name, avatar) for each entry
- Supports pagination with `page` and `limit` query parameters
- Validates gameId using `getGame()` helper from `lib/games.ts`
- Follow error handling pattern: generic messages to users, detailed logs server-side

**Statistics Panel Component (`components/profile/StatisticsPanel.tsx`)**
- Score display patterns and card layouts
- Shows best scores per game in grid layout
- Theme-aware styling patterns using CSS variables
- Uses Framer Motion for animations
- Responsive design with TailwindCSS

**Score Card Component (`components/profile/ScoreCard.tsx`)**
- Score display component patterns
- Shows score information with game context
- Theme-aware styling
- Can be referenced for ranking entry display patterns

**Games Configuration (`lib/games.ts`)**
- Game configuration and validation utilities
- `getGame()` function validates gameId and returns game information
- `getAllGames()` returns all 10 games for selector dropdown
- Game interface includes id, name, description, route, icon

**Profile Navigation Component (`components/profile/ProfileNavigation.tsx`)**
- Tab/navigation pattern with active state highlighting
- Theme-aware styling for navigation items
- Responsive and accessible navigation
- Can be referenced for tab implementation pattern

## Out of Scope
- Additional sorting options (by date, duration, moves) - keeping score-only sorting for simplicity
- Configurable pagination (10, 20, 50 options) - fixed at 20 items per page
- Complete score history view - only showing best scores
- Score date or level information in main ranking list - keeping display simple
- Authentication requirements - page is public and accessible to all
- Write operations - all data is read-only
- User profile links from ranking entries - keeping focus on rankings display
- Social sharing features from rankings page - deferred to future specs
- Real-time ranking updates - static data fetched on page load
- Advanced filtering or search functionality - basic pagination only

