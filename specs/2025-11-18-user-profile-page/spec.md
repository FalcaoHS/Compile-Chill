# Specification: User Profile Page

## Goal
Build a theme-aware user profile page that displays user information, game statistics, and cinematic score cards with sci-fi HUD aesthetics, supporting both own profile (`/profile`) and public profiles (`/u/[user]`).

## User Stories
- As an authenticated user, I want to view my profile page with all my game statistics and history so that I can track my progress and share my achievements
- As a user, I want to view other users' public profiles so that I can see their achievements and compare scores
- As a user, I want to change my theme directly from my profile page so that I can customize my visual experience

## Specific Requirements

**Profile Routes and Authorization**
- Create two route structures: `/profile` for authenticated user's own profile and `/u/[username]` or `/u/[id]` for public profiles
- Implement authentication check for `/profile` route using NextAuth session validation
- Allow public access to `/u/[user]` routes without authentication
- Enforce authorization rules: own profile shows all data, public profiles show limited data (no email, private feed, preferences, settings)
- Handle privacy setting: if user disables "show public history", public profile shows only avatar, name, and privacy message card

**User Information Display**
- Display user avatar from X OAuth (required, with fallback to initial letter)
- Display user name and @handle/username from X account
- Show auto-generated short bio (optional, fun element)
- Display join date (when user entered the portal) from `createdAt` field
- Show current theme with visual theme switcher button
- Use sci-fi HUD/blueprint/cyber UI aesthetic based on active theme, not generic layouts

**Statistics Panel**
- Create dense sci-fi panel style blocks for statistics display
- Display total games played across all games
- Show best score per game in organized layout
- Calculate and display average duration per game
- Show basic achievements/badges (simple display, not complex system)
- Display personal score feed listed from most recent to most epic
- Include additional stats: total matches, average duration, highest global score, favorite games (most played), best streak, activity time distribution, badge progress
- Use lightweight visual elements: sparklines of history, mini polar graph of habits, horizontal bars with theme effects (no heavy graphs)

**Cinematic Score Cards**
- Create "Score Cards Cinemáticos" component for game history display
- Each card displays: game name, score value, duration, moves count, date
- Generate mini oscillation graph via Canvas API for each card
- Apply theme-specific visual effects: pixel effects for Pixel Lab, neon glow for Neon Future, hacker scanline for Cyber Hacker, etc.
- Include action buttons: "Share on X" (generates image via canvas) and "View details" (opens modal)
- Make cards responsive, animated with Framer Motion, and unique per theme
- Order cards from most recent to most epic (highest scores)

**Theme Integration**
- Make entire profile page 100% theme-aware following existing theme system
- Apply theme-specific effects layers: Cyber Hacker (scanlines + digital noise), Pixel Lab (dithering + micro sprites), Neon Future (strong glow + reflections), Blueprint (grids + drawn annotations), Terminal Minimal (ASCII, monospace borders)
- Ensure all backgrounds, glows, shadows, and typography follow active theme
- Use existing theme store (Zustand/Jotai) and theme utilities
- Make profile page a visual showcase of the selected theme

**Navigation and Layout**
- Add navigation bar at top of profile page: Back (to home), Games, Feed, Ranking, Settings (only visible on `/profile`), Theme (visual grid dropdown)
- Keep navigation simple, direct, without redundant links
- Add link to profile page from existing ProfileButton dropdown menu
- Follow existing navigation patterns from game pages for consistency

**API Endpoints**
- Create `GET /api/users/me` endpoint to fetch authenticated user's profile data (avatar, name, handle, join date, theme, statistics)
- Create `GET /api/users/[id]` endpoint to fetch public user profile data (limited fields based on privacy settings)
- Create `GET /api/users/me/stats` endpoint to fetch user statistics (total games, best scores, averages, streaks, activity distribution)
- Reuse existing `/api/scores/me` endpoint pattern for fetching user scores with authentication
- Use `withAuth` utility for protected routes, follow existing API route patterns and error handling

**Score Details Modal**
- Create modal component for viewing score details (reuse GameOverModal pattern)
- Display final board state, seeds, replay information
- Include theme-aware styling and Framer Motion animations
- Make modal accessible with keyboard navigation and focus management
- Use backdrop blur effect similar to existing modal implementations

**Canvas Image Generation**
- Implement Canvas API functionality to generate score card images for X sharing
- Create mini oscillation graphs using Canvas for score card visuals
- Generate shareable images that include game name, score, theme-specific styling
- Ensure generated images are optimized and follow theme aesthetics

**Privacy and Data Management**
- Implement privacy setting to control public visibility of game history
- Store privacy preference in user model or separate settings table
- Respect privacy settings when displaying public profiles
- Show appropriate message when user has private history enabled
- Ensure sensitive data (email, preferences, settings) never exposed in public profiles

## Visual Design
No visual assets provided.

## Existing Code to Leverage

**GameCard Component (`components/GameCard.tsx`)**
- Reuse card styling patterns with `bg-page-secondary`, `border-border`, hover effects
- Follow theme-aware styling approach with `hover:border-primary`, `hover:shadow-glow-sm`
- Use Framer Motion animation patterns (`initial`, `animate`, `whileHover`) for card interactions
- Apply responsive layout patterns and focus states for accessibility

**ScoreDisplay Component (`components/games/terminal-2048/ScoreDisplay.tsx`)**
- Reuse score formatting patterns with `toLocaleString()` for number display
- Follow theme-aware styling for statistics display (`bg-page-secondary`, `border-border`, `text-text`, `font-theme`)
- Use responsive layout patterns with conditional rendering for optional data
- Apply consistent spacing and typography patterns

**GameOverModal Component (`components/games/terminal-2048/GameOverModal.tsx`)**
- Reuse modal implementation pattern with Framer Motion `AnimatePresence`
- Follow backdrop blur and overlay patterns for modal display
- Use theme-aware styling (`bg-page-secondary`, `border-border`, `shadow-glow`)
- Apply accessibility patterns: keyboard navigation, focus management, click-outside-to-close

**User Scores API (`app/api/scores/me/route.ts`)**
- Follow authentication pattern using `withAuth` utility wrapper
- Reuse error handling approach with `handleApiError` function
- Apply query parameter filtering pattern (e.g., `gameId` filtering)
- Use Prisma query patterns with proper select statements and ordering

**Theme System (`components/ThemeProvider.tsx`, `lib/theme-store.ts`, `lib/themes.ts`)**
- Reuse theme store hooks (`useThemeStore`) for theme state management
- Follow theme switching logic and database sync patterns
- Use existing theme utilities and theme-aware CSS class patterns
- Apply theme persistence API endpoint pattern from `/api/users/me/theme/route.ts`

## Out of Scope
- Manual profile editing (bio manual editing functionality)
- Complex badges/achievements system with detailed unlock mechanics
- 3D animations or heavy visual effects
- Complete replay visualization with full game state playback
- Advanced per-game statistics with deep analytics
- Infinite pagination or virtual scrolling for game history
- Comments system on profile pages
- Detailed achievements page with full badge gallery
- Advanced privacy settings configuration UI
- Profile customization beyond theme switching

