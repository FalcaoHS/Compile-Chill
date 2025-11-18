# Spec Requirements: Global Rankings Page

## Initial Description

Global Rankings Page — Create rankings page showing top players globally and per-game leaderboards with pagination, sorting, and theme-aware UI. Ensure all ranking data is read-only and properly sanitized `M`

## Requirements Discussion

### First Round Questions

**Q1:** I assume the page will have two views: "Global" (best scores from all games combined) and "Per Game" (specific ranking for each game). Should it be a single page with tabs to switch between views, or separate pages?

**Answer:** Single page with tabs/abas to switch between "Global" and "Per Game" views.

**Q2:** I assume the "Per Game" view will have a selector/dropdown to choose the game. Should it show all 10 games or only those that have registered scores?

**Answer:** Show all 10 games in the selector (even if some don't have scores yet - they'll show empty state).

**Q3:** I assume the default sorting will be by score (highest to lowest). Should we also allow sorting by date (most recent), duration, or moves? Or keep it score-only?

**Answer:** Default sorting by score (highest to lowest). Keep it score-only for simplicity.

**Q4:** I assume pagination of 20 items per page (matching current endpoint default). Should we allow users to choose (10, 20, 50) or keep it fixed?

**Answer:** Keep pagination fixed at 20 items per page.

**Q5:** I assume that if the user is logged in, we'll highlight their position in the ranking (with highlight or badge). If not logged in, the page remains public and accessible. Is that correct?

**Answer:** Yes, correct. Highlight logged-in user's position. Page is public and accessible to all.

**Q6:** I assume we'll show only best scores (`isBestScore = true`) to keep rankings fair. Or should we allow viewing complete score history as well?

**Answer:** Show only best scores (`isBestScore = true`) to keep rankings fair and clean.

**Q7:** I assume each ranking entry will show: position, user avatar, name, score, and optionally duration/moves if available. Should we include more information (score date, level reached, etc.)?

**Answer:** Show position, user avatar, name, score. Optionally show duration/moves if available. Keep it simple - no need for score date or level in the main list.

**Q8:** Is there any additional functionality you'd like to include in this rankings page, or should we keep it simple and focused only on displaying rankings with pagination and sorting?

**Answer:** Keep it simple and focused only on displaying rankings with pagination and sorting.

### Existing Code to Reference

**Similar Features Identified:**
- Feature: Leaderboard API Endpoint - Path: `app/api/scores/leaderboard/route.ts`
  - Backend logic to reference: Existing leaderboard endpoint that returns top scores per game with pagination
  - Returns only `isBestScore = true` scores
  - Includes user information (name, avatar) for each entry
  - Supports pagination with `page` and `limit` query parameters

- Feature: Scores API Endpoint - Path: `app/api/scores/route.ts`
  - Backend logic to reference: General scores endpoint with filtering capabilities
  - Includes user information in responses
  - Supports pagination

- Feature: Profile Page Statistics - Path: `components/profile/StatisticsPanel.tsx`
  - Components to potentially reuse: Score display patterns, card layouts
  - Shows best scores per game in a grid layout
  - Theme-aware styling patterns

- Feature: Score Card Component - Path: `components/profile/ScoreCard.tsx`
  - Components to potentially reuse: Score display component patterns
  - Shows score information with game context

- Feature: Games Configuration - Path: `lib/games.ts`
  - Backend logic to reference: Game configuration and validation
  - Used to validate gameId and get game information

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
No visual assets provided.

## Requirements Summary

### Functional Requirements
- Single page with tabs/abas to switch between "Global" and "Per Game" views
- Global view: Shows best scores from all games combined, ordered by score (highest to lowest)
- Per Game view: Shows ranking for a specific game selected via dropdown/selector
- Game selector shows all 10 games (even if some don't have scores - shows empty state)
- Display only best scores (`isBestScore = true`) for fair rankings
- Pagination: Fixed at 20 items per page
- Sorting: By score only (highest to lowest) - no additional sorting options
- Each ranking entry shows:
  - Position/rank
  - User avatar
  - User name
  - Score value
  - Optionally: duration and moves if available
- If user is logged in: Highlight their position in the ranking (with highlight or badge)
- Page is public and accessible to all users (no authentication required)
- Theme-aware UI that matches the application's 5 visual themes
- All ranking data is read-only and properly sanitized

### Reusability Opportunities
- Reuse leaderboard API endpoint pattern from `app/api/scores/leaderboard/route.ts`
- Reference score display components from profile page (`components/profile/StatisticsPanel.tsx`, `components/profile/ScoreCard.tsx`)
- Use game configuration from `lib/games.ts` for game validation and information
- Follow existing pagination patterns from API endpoints
- Apply theme-aware styling patterns from existing components

### Scope Boundaries
**In Scope:**
- Single rankings page with Global and Per Game views (tabs)
- Game selector dropdown for Per Game view
- Display of best scores only (`isBestScore = true`)
- Fixed pagination (20 items per page)
- Score-based sorting (highest to lowest)
- User position highlighting for logged-in users
- Theme-aware UI styling
- Public access (no authentication required)
- Read-only data display with proper sanitization

**Out of Scope:**
- Additional sorting options (by date, duration, moves)
- Configurable pagination (10, 20, 50 options)
- Complete score history view
- Score date or level information in main list
- Additional functionality beyond displaying rankings
- Authentication requirements
- Write operations (all data is read-only)

### Technical Considerations
- Use existing `/api/scores/leaderboard` endpoint for per-game rankings
- May need new endpoint or extend existing endpoint for global rankings (all games combined)
- Integrate with NextAuth for user session detection (to highlight user's position)
- Use Prisma queries with `isBestScore = true` filter
- Follow existing error handling patterns (centralized error handler)
- Apply theme-aware styling using existing theme system
- Ensure all user data (names, avatars) is properly sanitized before display
- Use existing pagination query parameter patterns (`page`, `limit`)
- Follow existing API response formats for consistency
- Consider performance: Global ranking may require aggregating across all games

