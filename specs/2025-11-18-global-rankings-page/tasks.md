# Task Breakdown: Global Rankings Page

## Overview
Total Tasks: 3 task groups, 20+ sub-tasks

## Task List

### API Layer

#### Task Group 1: Global Rankings API Endpoint
**Dependencies:** None

- [x] 1.0 Complete global rankings API endpoint
  - [ ] 1.1 Write 2-8 focused tests for global rankings endpoint
    - ⚠️ Skipped: No test framework configured in project (no Jest/Vitest setup)
    - Tests should be added when test framework is set up
    - Test endpoint returns best scores from all games combined
    - Test pagination works correctly (page, limit parameters)
    - Test sorting by score (highest to lowest)
    - Test only `isBestScore = true` scores are returned
    - Test response format matches existing leaderboard endpoint
    - Skip exhaustive edge case testing
  - [x] 1.2 Create or extend API endpoint for global rankings
    - Create `GET /api/scores/global-leaderboard` endpoint or extend existing endpoint
    - Query all scores where `isBestScore = true` across all games
    - Order by `score` descending (highest to lowest)
    - Support pagination with `page` and `limit` query parameters (default: page 1, limit 20)
    - Use Prisma query with `isBestScore = true` filter
    - Include user information (id, name, avatar) for each entry
    - Return response format matching `/api/scores/leaderboard` structure
  - [x] 1.3 Add Zod validation for query parameters
    - Use existing `paginationQuerySchema` from `lib/validations/query.ts`
    - Validate `page >= 1` and `limit` between 1-100
    - Follow validation pattern from existing leaderboard endpoint
  - [x] 1.4 Implement error handling
    - Use centralized error handler from `lib/api-errors.ts`
    - Return generic error messages to users
    - Log detailed errors server-side only
    - Follow error handling pattern from `app/api/scores/leaderboard/route.ts`
  - [x] 1.5 Optimize query performance
    - Consider database indexes on `isBestScore` and `score` fields
    - Use efficient Prisma queries to avoid N+1 problems
    - Include only necessary fields in response
    - Consider caching strategy if needed for performance
  - [ ] 1.6 Ensure API endpoint tests pass
    - ⚠️ Skipped: No test framework configured
    - Tests should be added when test framework is set up
    - Run ONLY the 2-8 tests written in 1.1
    - Verify pagination works correctly
    - Verify sorting by score works
    - Verify response format matches existing patterns
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Global rankings endpoint returns best scores from all games
- Pagination works correctly with page and limit parameters
- Response format matches existing leaderboard endpoint structure
- Error handling follows centralized error handler patterns
- Query performance is optimized

### Frontend Components

#### Task Group 2: Rankings UI Components
**Dependencies:** Task Group 1

- [x] 2.0 Complete rankings UI components
  - [ ] 2.1 Write 2-8 focused tests for UI components
    - ⚠️ Skipped: No test framework configured in project
    - Tests should be added when test framework is set up
    - Test tab navigation switches between Global and Per Game views
    - Test ranking entries display correctly (position, avatar, name, score)
    - Test pagination controls work correctly
    - Test user position highlighting when logged in
    - Skip exhaustive component state testing
  - [x] 2.2 Create RankingsTabs component
    - Tabs to switch between "Global" and "Per Game" views
    - Use navigation pattern from `components/profile/ProfileNavigation.tsx`
    - Active tab highlighted with theme-aware styling
    - Accessible with keyboard navigation (Tab, Arrow keys)
    - Theme-aware styling using CSS variables
    - Responsive design for mobile and desktop
  - [x] 2.3 Create GameSelector component
    - Dropdown/selector to choose game for Per Game view
    - Show all 10 games from `lib/games.ts` using `getAllGames()`
    - Display game icon and name for each option
    - Theme-aware styling
    - Touch-friendly for mobile devices
    - Accessible with keyboard navigation
  - [x] 2.4 Create RankingEntry component
    - Display position/rank, user avatar, user name, score value
    - Optionally display duration and moves if available
    - Highlight current user's entry if logged in (visual indicator or badge)
    - Theme-aware styling following `StatisticsPanel` and `ScoreCard` patterns
    - Responsive layout for mobile and desktop
    - Sanitize user data (name, avatar) before display
  - [x] 2.5 Create RankingsList component
    - Display list of RankingEntry components
    - Handle empty state when no scores exist
    - Show loading state while fetching data
    - Theme-aware styling
    - Responsive grid/list layout
    - Use Framer Motion for smooth animations
  - [x] 2.6 Create PaginationControls component
    - Previous/Next buttons
    - Page number display
    - Show total pages and current page information
    - Disable Previous button on first page
    - Disable Next button on last page
    - Theme-aware styling
    - Touch-friendly for mobile devices
    - Accessible with keyboard navigation
  - [x] 2.7 Create EmptyState component
    - Display when no scores exist for selected game
    - User-friendly message encouraging users to play games
    - Theme-aware styling
    - Consistent with application design patterns
  - [ ] 2.8 Ensure UI component tests pass
    - ⚠️ Skipped: No test framework configured
    - Tests should be added when test framework is set up
    - Run ONLY the 2-8 tests written in 2.1
    - Verify components render correctly
    - Verify tab navigation works
    - Verify pagination controls work
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- All UI components render correctly
- Tab navigation switches between views
- Ranking entries display all required information
- Pagination controls work correctly
- User position highlighting works when logged in
- Components are theme-aware and responsive

### Page Integration

#### Task Group 3: Rankings Page Implementation
**Dependencies:** Task Groups 1, 2

- [x] 3.0 Complete rankings page
  - [ ] 3.1 Write 2-8 focused tests for rankings page
    - ⚠️ Skipped: No test framework configured in project
    - Tests should be added when test framework is set up
    - Test page loads and displays rankings correctly
    - Test switching between Global and Per Game views
    - Test game selector changes Per Game view
    - Test pagination navigation works
    - Skip exhaustive page interaction testing
  - [x] 3.2 Create `/ranking` page route
    - Create `app/ranking/page.tsx` following Next.js App Router pattern
    - Public page (no authentication required)
    - Use Server Component pattern where possible
    - Integrate with NextAuth for session detection (to highlight user position)
  - [x] 3.3 Implement Global Rankings view
    - Fetch data from global rankings API endpoint
    - Display RankingsList with RankingEntry components
    - Show PaginationControls
    - Handle loading and error states
    - Highlight logged-in user's position if present
    - Use existing error handling patterns
  - [x] 3.4 Implement Per Game Rankings view
    - Fetch data from `/api/scores/leaderboard` endpoint with selected gameId
    - Display RankingsList with RankingEntry components
    - Show GameSelector component
    - Show PaginationControls
    - Handle empty state when game has no scores
    - Handle loading and error states
    - Highlight logged-in user's position if present
  - [x] 3.5 Integrate RankingsTabs component
    - Switch between Global and Per Game views
    - Maintain state for active tab
    - Update URL query parameters when switching tabs (optional)
    - Preserve game selection when switching tabs
  - [x] 3.6 Apply theme-aware styling
    - Use `useThemeStore` hook for theme management
    - Apply theme CSS variables throughout page
    - Ensure page works with all 5 visual themes
    - Use Framer Motion for smooth transitions
    - Follow styling patterns from existing pages
  - [x] 3.7 Implement responsive design
    - Mobile-first approach using TailwindCSS
    - Rankings list adapts to different screen sizes
    - Pagination controls work well on mobile
    - Game selector is touch-friendly
    - Test on mobile (320px-768px), tablet (768px-1024px), desktop (1024px+)
  - [x] 3.8 Add data sanitization
    - Sanitize all user data (names, avatars) before display
    - Use React's built-in XSS protection
    - Validate API responses before rendering
    - Follow security best practices
  - [ ] 3.9 Ensure rankings page tests pass
    - ⚠️ Skipped: No test framework configured
    - Tests should be added when test framework is set up
    - Run ONLY the 2-8 tests written in 3.1
    - Verify page loads correctly
    - Verify tab switching works
    - Verify pagination works
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- Rankings page loads and displays correctly
- Global and Per Game views work correctly
- Tab navigation functions properly
- Pagination works in both views
- User position highlighting works when logged in
- Page is theme-aware and responsive
- All data is properly sanitized

### Testing

#### Task Group 4: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-3

- [ ] 4.0 Review existing tests and fill critical gaps only
  - [ ] 4.1 Review tests from Task Groups 1-3
    - Review the 2-8 tests written by api-engineer (Task 1.1)
    - Review the 2-8 tests written by ui-designer (Task 2.1)
    - Review the 2-8 tests written by page-engineer (Task 3.1)
    - Total existing tests: approximately 6-24 tests
  - [ ] 4.2 Analyze test coverage gaps for THIS feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to rankings page requirements
    - Do NOT assess entire application test coverage
    - Prioritize end-to-end workflows (fetch rankings → display → paginate → switch views)
  - [ ] 4.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on integration points (API → components → page)
    - Test user position highlighting workflow
    - Test empty state handling
    - Do NOT write comprehensive coverage for all scenarios
    - Skip edge cases and performance tests unless critical
  - [ ] 4.4 Run feature-specific tests only
    - Run ONLY tests related to this spec's feature (tests from 1.1, 2.1, 3.1, and 4.3)
    - Expected total: approximately 16-34 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical rankings workflows pass

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 16-34 tests total)
- Critical user workflows for rankings page are covered
- No more than 10 additional tests added when filling in testing gaps
- Testing focused exclusively on this spec's rankings page requirements

## Execution Order

Recommended implementation sequence:
1. API Layer (Task Group 1) - Foundation for data fetching
2. Frontend Components (Task Group 2) - Reusable UI components
3. Page Integration (Task Group 3) - Combines API and components into complete page
4. Test Review & Gap Analysis (Task Group 4) - Final validation after all implementation

