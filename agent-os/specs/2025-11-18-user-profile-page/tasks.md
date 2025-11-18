# Task Breakdown: User Profile Page

## Overview
Total Tasks: 4 task groups, ~35 sub-tasks

## Task List

### Database Layer

#### Task Group 1: Data Models and Migrations
**Dependencies:** None

- [x] 1.0 Complete database layer
  - [ ] 1.1 Write 2-8 focused tests for User model privacy functionality
    - Test privacy setting default value (should default to true for public history)
    - Test privacy setting can be updated
    - Test privacy setting affects public profile visibility
    - Limit to 2-8 highly focused tests maximum
    - Test only critical model behaviors
    - Skip exhaustive coverage of all methods and edge cases
    - **Note:** Skipped per project instruction (no test framework configured)
  - [x] 1.2 Add privacy field to User model
    - Add `showPublicHistory` Boolean field with default `true`
    - Add validation to ensure field is always boolean
    - Reuse pattern from existing User model fields (theme field pattern)
  - [x] 1.3 Create migration for adding privacy field
    - Add `showPublicHistory` column to `users` table
    - Set default value to `true` for existing users
    - Add index if needed for query performance
    - Follow migration naming convention
  - [x] 1.4 Verify User model relationships remain intact
    - Ensure User has_many Scores relationship still works
    - Ensure User belongs_to Accounts and Sessions relationships work
    - Verify no breaking changes to existing associations
  - [ ] 1.5 Ensure database layer tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify migration runs successfully
    - Verify User model can be queried with new field
    - Do NOT run the entire test suite at this stage
    - **Note:** Skipped per project instruction (no test framework configured)

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- User model includes `showPublicHistory` field with proper validation
- Migration runs successfully without errors
- Existing User relationships continue to work correctly
- Privacy field defaults to `true` for new and existing users

### API Layer

#### Task Group 2: API Endpoints
**Dependencies:** Task Group 1

- [x] 2.0 Complete API layer
  - [ ] 2.1 Write 2-8 focused tests for API endpoints
    - Test GET /api/users/me returns authenticated user data
    - Test GET /api/users/[id] returns public user data (limited fields)
    - Test GET /api/users/me/stats returns user statistics
    - Test authorization: /api/users/me requires authentication
    - Test privacy: public profile respects showPublicHistory setting
    - Limit to 2-8 highly focused tests maximum
    - Test only critical API operations and auth checks
    - Skip exhaustive testing of all scenarios
    - **Note:** Skipped per project instruction (no test framework configured)
  - [x] 2.2 Create GET /api/users/me endpoint
    - Return user profile data: avatar, name, xId (as handle), createdAt (join date), theme
    - Use `withAuth` utility for authentication
    - Follow pattern from `/api/users/me/theme/route.ts`
    - Use proper error handling with `handleApiError`
    - Return JSON response with status 200
  - [x] 2.3 Create GET /api/users/[id] endpoint
    - Return public user profile data (limited fields)
    - Check `showPublicHistory` field to determine what to return
    - If `showPublicHistory` is false, return only avatar, name, and privacy message
    - If `showPublicHistory` is true, return avatar, name, public scores, achievements
    - Never expose email, private feed, preferences, settings
    - Allow public access (no authentication required)
    - Handle user not found (404)
  - [x] 2.4 Create GET /api/users/me/stats endpoint
    - Calculate and return user statistics: total games played, best score per game, average duration, favorite games, best streak, activity time distribution
    - Use Prisma queries with proper aggregations
    - Use `withAuth` utility for authentication
    - Optimize queries to prevent N+1 problems
    - Return lightweight data structure (no heavy calculations)
  - [x] 2.5 Add API response formatting and error handling
    - Use consistent JSON response format across all endpoints
    - Return appropriate HTTP status codes (200, 401, 404, 500)
    - Use `handleApiError` for error handling
    - Never expose sensitive error details to clients
    - Follow existing API patterns from `/api/scores/me/route.ts`
  - [ ] 2.6 Ensure API layer tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify all endpoints return correct data
    - Verify authentication and authorization work correctly
    - Verify privacy settings are respected
    - Do NOT run the entire test suite at this stage
    - **Note:** Skipped per project instruction (no test framework configured)

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- All three API endpoints work correctly
- Proper authorization enforced (own profile requires auth, public profile is public)
- Privacy settings respected in public profile endpoint
- Consistent response format and error handling across all endpoints

### Frontend Components

#### Task Group 3: UI Components and Pages
**Dependencies:** Task Group 2

- [x] 3.0 Complete UI components
  - [ ] 3.1 Write 2-8 focused tests for UI components
    - Test ProfilePage component renders user information correctly
    - Test ScoreCard component displays score data correctly
    - Test ScoreDetailsModal opens and closes correctly
    - Test theme switching works on profile page
    - Limit to 2-8 highly focused tests maximum
    - Test only critical component behaviors
    - Skip exhaustive testing of all component states
    - **Note:** Skipped per project instruction (no test framework configured)
  - [x] 3.2 Create ProfileHeader component
    - Display user avatar (with fallback to initial letter)
    - Display user name and @handle/username
    - Show auto-generated short bio (optional, fun element)
    - Display join date formatted nicely
    - Show current theme with visual theme switcher button
    - Use sci-fi HUD/blueprint/cyber UI aesthetic based on active theme
    - Reuse avatar display pattern from `ProfileButton.tsx`
    - Make component responsive (mobile, tablet, desktop)
  - [x] 3.3 Create StatisticsPanel component
    - Create dense sci-fi panel style blocks for statistics
    - Display total games played, best score per game, average duration
    - Show basic achievements/badges (simple display)
    - Include lightweight visual elements: sparklines, mini polar graph, horizontal bars with theme effects
    - Use theme-aware styling (`bg-page-secondary`, `border-border`, theme-specific effects)
    - Reuse styling patterns from `ScoreDisplay.tsx`
    - Make panels responsive and accessible
  - [x] 3.4 Create ScoreCard component (Cinematic Score Cards)
    - Display game name, score value, duration, moves count, date
    - Generate mini oscillation graph via Canvas API
    - Apply theme-specific visual effects (pixel effects, neon glow, hacker scanline, etc.)
    - Include action buttons: "Share on X" and "View details"
    - Use Framer Motion for animations (`initial`, `animate`, `whileHover`)
    - Reuse card styling patterns from `GameCard.tsx`
    - Make cards responsive and accessible
    - Order cards from most recent to most epic
  - [x] 3.5 Create ScoreDetailsModal component
    - Display final board state, seeds, replay information
    - Use Framer Motion `AnimatePresence` for animations
    - Include backdrop blur effect
    - Use theme-aware styling (`bg-page-secondary`, `border-border`, `shadow-glow`)
    - Implement keyboard navigation and focus management
    - Reuse modal pattern from `GameOverModal.tsx`
    - Make modal accessible (ARIA labels, focus trap, Escape key to close)
  - [x] 3.6 Create Canvas image generation utilities
    - Implement Canvas API functionality to generate score card images
    - Create mini oscillation graphs using Canvas
    - Generate shareable images with game name, score, theme-specific styling
    - Optimize generated images for X sharing
    - Ensure images follow theme aesthetics
  - [x] 3.7 Create ProfileNavigation component
    - Add navigation bar: Back (to home), Games, Feed, Ranking, Settings (only on `/profile`), Theme (visual grid dropdown)
    - Keep navigation simple and direct
    - Use existing navigation patterns from game pages
    - Make navigation responsive and accessible
    - Add link to profile page from existing ProfileButton dropdown menu
  - [x] 3.8 Build /profile page (own profile)
    - Create `app/profile/page.tsx`
    - Implement authentication check using NextAuth session
    - Redirect to login if not authenticated
    - Display ProfileHeader, StatisticsPanel, and ScoreCard components
    - Apply 100% theme-aware styling with theme-specific effects layers
    - Use existing theme store hooks (`useThemeStore`)
    - Make page responsive (mobile-first approach)
    - Follow layout patterns from existing game pages
  - [x] 3.9 Build /u/[user] page (public profile)
    - Create `app/u/[user]/page.tsx` with dynamic route
    - Fetch public user data from API
    - Check privacy settings and display appropriate content
    - If `showPublicHistory` is false, show only avatar, name, and privacy message card
    - If `showPublicHistory` is true, show public profile with limited data
    - Never expose sensitive information
    - Handle user not found (404 page)
    - Apply theme-aware styling (use viewer's theme, not profile owner's theme)
  - [x] 3.10 Apply theme-specific effects layers
    - Implement Cyber Hacker effects: scanlines + digital noise
    - Implement Pixel Lab effects: dithering + micro sprites
    - Implement Neon Future effects: strong glow + reflections
    - Implement Blueprint effects: grids + drawn annotations
    - Implement Terminal Minimal effects: ASCII, monospace borders
    - Ensure all backgrounds, glows, shadows, typography follow active theme
    - Make profile page a visual showcase of the selected theme
  - [x] 3.11 Implement responsive design
    - Mobile: 320px - 768px (stack components vertically, optimize touch targets)
    - Tablet: 768px - 1024px (adjust grid layouts, maintain readability)
    - Desktop: 1024px+ (full layout with all features)
    - Test across multiple screen sizes
    - Ensure readable typography at all breakpoints
    - Use TailwindCSS responsive utilities
  - [x] 3.12 Add interactions and animations
    - Add hover states to interactive elements
    - Add Framer Motion transitions for page loads and component appearances
    - Add loading states for API data fetching
    - Add smooth theme transition effects
    - Ensure animations are performant and don't block interactions
  - [ ] 3.13 Ensure UI component tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify critical component behaviors work
    - Verify responsive design works across breakpoints
    - Verify theme integration works correctly
    - Do NOT run the entire test suite at this stage
    - **Note:** Skipped per project instruction (no test framework configured)

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- All components render correctly with theme-aware styling
- Profile pages (own and public) display correct data
- Score cards are animated and responsive
- Modal opens and closes correctly with proper accessibility
- Canvas image generation works for score sharing
- Navigation is functional and accessible
- Responsive design works across all breakpoints
- Theme-specific effects are applied correctly

### Testing

#### Task Group 4: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-3

- [ ] 4.0 Review existing tests and fill critical gaps only
  - [ ] 4.1 Review tests from Task Groups 1-3
    - Review the 2-8 tests written by database-engineer (Task 1.1)
    - Review the 2-8 tests written by api-engineer (Task 2.1)
    - Review the 2-8 tests written by ui-designer (Task 3.1)
    - Total existing tests: approximately 6-24 tests
  - [ ] 4.2 Analyze test coverage gaps for THIS feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to user profile page feature requirements
    - Do NOT assess entire application test coverage
    - Prioritize end-to-end workflows over unit test gaps
    - Examples: end-to-end profile viewing flow, privacy settings workflow, score card sharing flow
  - [ ] 4.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on integration points and end-to-end workflows
    - Examples: test complete profile page load, test public profile privacy, test score card interaction, test theme switching on profile
    - Do NOT write comprehensive coverage for all scenarios
    - Skip edge cases, performance tests, and accessibility tests unless business-critical
  - [ ] 4.4 Run feature-specific tests only
    - Run ONLY tests related to this spec's feature (tests from 1.1, 2.1, 3.1, and 4.3)
    - Expected total: approximately 16-34 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical workflows pass
    - Verify all user stories from spec are covered by tests

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 16-34 tests total)
- Critical user workflows for this feature are covered
- No more than 10 additional tests added when filling in testing gaps
- Testing focused exclusively on this spec's feature requirements
- All user stories from spec have test coverage

## Execution Order

Recommended implementation sequence:
1. Database Layer (Task Group 1) - Add privacy field to User model
2. API Layer (Task Group 2) - Create endpoints for profile data and statistics
3. Frontend Components (Task Group 3) - Build UI components and pages
4. Test Review & Gap Analysis (Task Group 4) - Review and fill critical test gaps

## Notes

- This feature builds on existing authentication, theme system, and score storage infrastructure
- Reuse existing patterns from GameCard, ScoreDisplay, GameOverModal, and API routes
- Focus on theme-aware styling throughout all components
- Ensure privacy settings are respected in both API and UI layers
- Canvas image generation should be optimized for performance
- All components must be responsive and accessible

