# Task Breakdown: Theme System Foundation

## Overview
Total Tasks: 4 groups, 18 sub-tasks

## Task List

### Database Layer

#### Task Group 1: User Model Theme Field
**Dependencies:** None

- [x] 1.0 Complete database layer
  - [x] 1.1 Write 2-8 focused tests for User theme field functionality
    - Test theme field is optional (nullable)
    - Test theme field accepts valid theme values (cyber, pixel, neon, terminal, blueprint)
    - Test theme field rejects invalid theme values
    - Test user can update theme field
    - Skip exhaustive edge cases and performance tests
    - **IGNORED: Tests are skipped per project instruction**
  - [x] 1.2 Add theme field to User model in Prisma schema
    - Field: theme (String, optional/nullable)
    - Follow existing field naming conventions
    - Add comment documenting allowed theme values
  - [x] 1.3 Create and run migration
    - Generate migration for theme field addition
    - Verify migration runs successfully
    - Ensure existing users are not affected (field defaults to null)
  - [x] 1.4 Ensure database layer tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify migrations run successfully
    - Verify User model can be updated with theme field
    - Do NOT run the entire test suite at this stage
    - **IGNORED: Tests are skipped per project instruction**

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Theme field is added to User model correctly
- Migration runs successfully without errors
- Theme field accepts valid theme values
- Existing users are not affected by migration

### Theme Configuration & Infrastructure

#### Task Group 2: Theme System Foundation
**Dependencies:** None (can run parallel with Task Group 1)

- [x] 2.0 Complete theme configuration and infrastructure
  - [x] 2.1 Write 2-8 focused tests for theme configuration
    - Test themes.js exports all 5 themes with correct structure
    - Test CSS variables are defined for each theme
    - Test Tailwind config references CSS variables correctly
    - Test theme switching applies CSS vars to document root
    - Skip exhaustive edge cases and performance tests
    - **IGNORED: Tests are skipped per project instruction**
  - [x] 2.2 Create themes.js configuration object
    - Define THEMES object with 5 themes: cyber, pixel, neon, terminal, blueprint
    - Each theme contains: name (display name) and vars (CSS variable definitions)
    - Define comprehensive design tokens: colors (bg, primary, accent, muted, glow), typography (font), effects (opacity, intensity)
    - Export THEMES object for use in components and utilities
    - Structure allows easy extension and documentation
  - [x] 2.3 Create CSS rules for theme application
    - Add CSS rules in globals.css using [data-theme="..."] selectors
    - Define CSS variables for each theme (--color-bg, --color-primary, --color-accent, etc.)
    - Include fallback values in :root selector
    - Apply tokens per theme using data-theme attribute pattern
  - [x] 2.4 Extend Tailwind config to reference CSS variables
    - Extend colors to reference CSS vars (e.g., page: "var(--color-bg)", primary: "var(--color-primary)")
    - Extend boxShadow to reference CSS vars (e.g., glow: "0 6px 30px var(--color-glow)")
    - Avoid compiling tokens per theme (keep as runtime CSS variables)
    - Maintain existing Tailwind config structure
  - [x] 2.5 Create Zustand theme store
    - Create useThemeStore() with Zustand
    - Implement getters/setters for current theme
    - Add persistence effect for localStorage (required for offline/guest users)
    - Store applies CSS vars to document.documentElement.style.setProperty() on theme change
    - Initialize theme from localStorage on mount, fallback to 'cyber' if none exists
    - Implement API sync hooks for authenticated users (debounced)
  - [x] 2.6 Create ThemeProvider wrapper component
    - Create ThemeProvider component following SessionProvider pattern
    - Wrap application with ThemeProvider in Providers component
    - Initialize theme store on mount
    - Handle theme initialization from localStorage and database (for authenticated users)
  - [x] 2.7 Create ThemeEffects component for global effects
    - Create ThemeEffects component for global visual effects (background, overlays, scanlines, etc.)
    - Apply effects via CSS classes reading theme CSS variables
    - Mount in root layout for global application
    - Separate concerns: avoid applying heavy effects on each component
  - [x] 2.8 Create utility functions for games
    - Create helper function applyThemeToCanvas(canvas, theme) for games
    - Provide data-theme hook utility for game components
    - Include CSS classes that games can apply for theme-aware styling
    - Document utilities for future game implementations
  - [x] 2.9 Ensure theme configuration tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify themes.js exports correctly
    - Verify CSS variables are applied correctly
    - Verify Tailwind config references work
    - Do NOT run the entire test suite at this stage
    - **IGNORED: Tests are skipped per project instruction**

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- themes.js contains all 5 themes with complete token definitions
- CSS rules apply tokens correctly using data-theme selectors
- Tailwind config references CSS variables without compilation issues
- Zustand store manages theme state and persistence correctly
- ThemeProvider initializes and wraps application properly
- ThemeEffects component applies global effects correctly
- Utility functions are available for game integration

### API Layer

#### Task Group 3: Theme Sync API
**Dependencies:** Task Group 1

- [x] 3.0 Complete API layer
  - [x] 3.1 Write 2-8 focused tests for theme sync API
    - Test PATCH /api/users/me/theme updates user theme in database
    - Test API requires authentication (returns 401 if not authenticated)
    - Test API validates theme value against allowed themes
    - Test API returns generic error messages (no technical details)
    - Skip exhaustive error scenario testing
    - **IGNORED: Tests are skipped per project instruction**
  - [x] 3.2 Create PATCH /api/users/me/theme endpoint
    - Create route at `/app/api/users/me/theme/route.ts` using Next.js App Router pattern
    - Use NextAuth session for authentication (getSession from next-auth)
    - Validate theme value against allowed themes (cyber, pixel, neon, terminal, blueprint)
    - Update User model theme field via Prisma
    - Return success response with updated theme
  - [x] 3.3 Implement error handling
    - Return generic error messages to frontend (no technical details)
    - Log detailed errors server-side only
    - Handle authentication errors (401)
    - Handle validation errors (400)
    - Handle database errors (500)
    - Follow existing API route error handling patterns
  - [x] 3.4 Integrate theme sync on login
    - On user login: check if user has theme preference in DB
    - If theme exists in DB: apply it (override localStorage)
    - Update theme store with user's saved preference
    - Handle case where user has no saved theme (use localStorage or default)
  - [x] 3.5 Ensure API layer tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify theme sync endpoint works end-to-end
    - Verify authentication and validation work correctly
    - Do NOT run the entire test suite at this stage
    - **IGNORED: Tests are skipped per project instruction**

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- Theme sync API endpoint handles PATCH requests correctly
- Authentication is enforced (401 for unauthenticated requests)
- Theme validation works (rejects invalid themes)
- User theme preference is saved and retrieved correctly
- Generic error messages are returned to frontend
- Detailed errors are logged server-side only
- Theme sync on login works correctly

### Frontend Components

#### Task Group 4: UI Components and Integration
**Dependencies:** Task Group 2

- [x] 4.0 Complete UI components
  - [x] 4.1 Write 2-8 focused tests for UI components
    - Test ThemeSwitcher renders and opens dropdown correctly
    - Test theme switching updates UI correctly
    - Test theme transitions work smoothly
    - Test ThemeSwitcher keyboard navigation works
    - Skip exhaustive UI state testing
    - **IGNORED: Tests are skipped per project instruction**
  - [x] 4.2 Create ThemeSwitcher component
    - Location: Fixed Header component, accessible from all pages
    - UI Pattern: Mini visual preview grid (3×2 tiles) within dropdown menu
    - Each tile displays: theme preview (background + sample text + small animated accent)
    - Hover interaction: Tiles animate on hover (hover preview effect)
    - Icon: Palette icon in header opens dropdown
    - Optional keyboard shortcut: T key to open switcher
    - Authenticated users: Show "Salvar no perfil" button in dropdown (only when logged in)
    - Follow ProfileButton dropdown pattern for accessibility (keyboard navigation, click outside to close, Escape to close)
    - Use Framer Motion for smooth dropdown animations
  - [x] 4.3 Implement theme transitions
    - Use short animations (not instant): 300-450ms duration
    - Default transition: fade-out overlay → swap CSS vars → fade-in overlay (300ms)
    - Use CSS transitions for color changes (performant)
    - Use Framer Motion for overlay/preview effects when switching themes
    - Theme-specific micro effects: scanline slide-in for Cyber Hacker, pixel glitch flash for Pixel Lab
    - Apply transitions to root element for smooth color transitions across all components
  - [x] 4.4 Integrate ThemeSwitcher into Header component
    - Add ThemeSwitcher to Header component in auth section area
    - Maintain existing header structure and responsive design
    - Ensure ThemeSwitcher is accessible on all pages (header is fixed)
    - Follow existing header component patterns
  - [x] 4.5 Adapt existing components to use theme tokens
    - Update LoginButton to use theme-aware Tailwind classes (replace hardcoded colors)
    - Update ProfileButton to use theme-aware Tailwind classes (replace hardcoded colors)
    - Update Header to use theme-aware classes where applicable
    - Ensure all components respond to theme changes via CSS variable updates
    - Use theme tokens: bg-page, text-primary, bg-primary, etc.
  - [x] 4.6 Mount ThemeEffects in root layout
    - Add ThemeEffects component to root layout for global effects
    - Follow existing layout structure and organization
    - Ensure global effects apply correctly across all pages
  - [x] 4.7 Ensure UI component tests pass
    - Run ONLY the 2-8 tests written in 4.1
    - Verify ThemeSwitcher renders and functions correctly
    - Verify theme switching works from UI
    - Verify transitions work smoothly
    - Do NOT run the entire test suite at this stage
    - **IGNORED: Tests are skipped per project instruction**

**Acceptance Criteria:**
- The 2-8 tests written in 4.1 pass
- ThemeSwitcher component displays and functions correctly
- Theme switching updates UI instantly with smooth transitions
- ThemeSwitcher is accessible via keyboard and mouse
- Header shows ThemeSwitcher on all pages
- Existing components (LoginButton, ProfileButton, Header) use theme tokens
- ThemeEffects component applies global effects correctly
- All components respond to theme changes via CSS variable updates

### Testing

IMPORTANTE - Não pergunte, apenas ignore os Testes por enquanto neste projeto.

#### Task Group 5: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-4

- [x] 5.0 Review existing tests and fill critical gaps only
  - [x] 5.1 Review tests from Task Groups 1-4
    - Review the 2-8 tests written by database-engineer (Task 1.1)
    - Review the 2-8 tests written by theme-engineer (Task 2.1)
    - Review the 2-8 tests written by api-engineer (Task 3.1)
    - Review the 2-8 tests written by ui-designer (Task 4.1)
    - Total existing tests: approximately 8-32 tests
  - [x] 5.2 Analyze test coverage gaps for THIS feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to theme system foundation
    - Prioritize end-to-end theme switching workflow
    - Check integration between database, API, and UI layers
    - Do NOT assess entire application test coverage
  - [x] 5.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on end-to-end theme switching workflow
    - Test theme persistence across page refreshes
    - Test theme sync between localStorage and database
    - Test theme transitions and animations
    - Skip edge cases, performance tests, and accessibility tests unless business-critical
  - [x] 5.4 Run feature-specific tests only
    - Run ONLY tests related to theme system foundation (tests from 1.1, 2.1, 3.1, 4.1, and 5.3)
    - Expected total: approximately 18-42 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical theme workflows pass
    - **IGNORED: Tests are skipped per project instruction**

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 18-42 tests total)
- Critical theme switching workflows are covered
- No more than 10 additional tests added when filling in testing gaps
- Testing focused exclusively on theme system foundation feature

## Execution Order

Recommended implementation sequence:
1. Database Layer (Task Group 1) - Foundation for theme persistence
2. Theme Configuration & Infrastructure (Task Group 2) - Core theme system (can run parallel with Task Group 1)
3. API Layer (Task Group 3) - Theme sync for authenticated users (depends on Task Group 1)
4. Frontend Components (Task Group 4) - User-facing theme UI (depends on Task Group 2)
5. Test Review & Gap Analysis (Task Group 5) - Ensure comprehensive coverage (depends on Task Groups 1-4)

