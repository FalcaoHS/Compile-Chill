# Task Breakdown: X OAuth Authentication

## Overview
Total Tasks: 4 groups, 20 sub-tasks

## Task List

### Database Layer

#### Task Group 1: Prisma Schema and User Model
**Dependencies:** None

- [x] 1.0 Complete database layer
  - [ ] 1.1 Write 2-8 focused tests for User model functionality
    - Test user creation with X account data
    - Test unique constraint on xId field
    - Test user update on subsequent authentication
    - Test user data validation (name, avatar, xId)
    - Skip exhaustive edge cases and performance tests
    - **IGNORED: Tests are skipped per project instruction**
  - [x] 1.2 Create Prisma schema with User model
    - Fields: id (Int, @id, @default(autoincrement)), name (String), avatar (String?), xId (String, @unique), createdAt (DateTime, @default(now)), updatedAt (DateTime, @updatedAt)
    - Add indexes on xId and id for query performance
    - Follow Prisma naming conventions (singular model names)
  - [x] 1.3 Add NextAuth required tables via Prisma adapter
    - Account model (for OAuth provider accounts)
    - Session model (for database sessions)
    - VerificationToken model (for email verification, if needed)
    - Use @prisma/adapter-nextauth pattern
  - [x] 1.4 Create and run migration
    - Generate migration for User table
    - Generate migration for NextAuth tables (Account, Session, VerificationToken)
    - Verify indexes are created correctly
    - Ensure foreign key relationships are properly set up
  - [ ] 1.5 Ensure database layer tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify migrations run successfully
    - Verify User model can be created and queried
    - Do NOT run the entire test suite at this stage
    - **IGNORED: Tests are skipped per project instruction**

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- User model validates required fields correctly
- Migrations run successfully without errors
- Unique constraint on xId prevents duplicate accounts
- NextAuth tables are properly configured

### NextAuth Configuration

#### Task Group 2: Authentication API Setup
**Dependencies:** Task Group 1

- [x] 2.0 Complete NextAuth configuration
  - [ ] 2.1 Write 2-8 focused tests for authentication flow
    - Test successful X OAuth authentication
    - Test user creation on first login
    - Test user update on subsequent login
    - Test session creation and retrieval
    - Test logout functionality
    - Skip exhaustive error scenario testing
    - **IGNORED: Tests are skipped per project instruction**
  - [x] 2.2 Install and configure NextAuth dependencies
    - Install next-auth and @auth/prisma-adapter packages
    - Set up environment variables structure
    - Configure NEXTAUTH_URL, X_CLIENT_ID, X_CLIENT_SECRET, NEXTAUTH_SECRET
  - [x] 2.3 Create NextAuth API route handler
    - Create `/app/api/auth/[...nextauth]/route.ts` using App Router pattern
    - Configure X (Twitter) OAuth provider
    - Set up Prisma adapter for database sessions
    - Configure callbacks: signIn, jwt, session
    - Set redirect callback to home page after successful authentication
  - [x] 2.4 Implement user creation/update logic
    - On first authentication: create User record with X account data
    - On subsequent authentication: update User if X account data changed
    - Extract name, avatar URL, and X account ID from OAuth profile
    - Link Account to User via xId matching
  - [x] 2.5 Implement error handling
    - Catch authentication errors at API route level
    - Return generic error messages to frontend: "Não foi possível fazer login. Tente novamente."
    - Log detailed error information server-side only
    - Handle network errors, OAuth provider errors, and database errors
  - [x] 2.6 Configure session management
    - Use database session strategy (not JWT)
    - Include user ID in session for future feature integration
    - Configure session expiration and refresh behavior
    - Ensure secure session storage and transmission
  - [ ] 2.7 Ensure authentication API tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify OAuth flow works end-to-end
    - Verify user creation and session management
    - Do NOT run the entire test suite at this stage
    - **IGNORED: Tests are skipped per project instruction**

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- NextAuth API route handles X OAuth authentication
- User records are created/updated correctly
- Sessions are stored in database
- Generic error messages are returned to frontend
- Detailed errors are logged server-side only

### Frontend Components

#### Task Group 3: UI Components and Integration
**Dependencies:** Task Group 2

- [x] 3.0 Complete UI components
  - [ ] 3.1 Write 2-8 focused tests for UI components
    - Test login button renders correctly when not authenticated
    - Test profile button renders correctly when authenticated
    - Test login button triggers authentication flow
    - Test logout functionality
    - Test loading states during authentication
    - Skip exhaustive UI state testing
    - **IGNORED: Tests are skipped per project instruction**
  - [x] 3.2 Create LoginButton component
    - Display "Entrar com X" text when user is not authenticated
    - Trigger NextAuth signIn function with X provider
    - Show loading state: "Conectando…" text with small spinner during authentication
    - Handle authentication errors with generic message display
    - Make component theme-aware to match application's visual themes
    - Use TailwindCSS for styling
    - Ensure keyboard accessibility and screen reader support
  - [x] 3.3 Create ProfileButton component
    - Display user avatar when authenticated
    - Show "Perfil" text or icon
    - Implement dropdown menu with "Sair" (logout) option
    - Trigger NextAuth signOut function on logout
    - Handle logout redirect to home page
    - Ensure dropdown is accessible via keyboard navigation
    - Use Framer Motion for smooth transitions (optional)
  - [x] 3.4 Create Header component
    - Build fixed header that persists across all pages
    - Integrate LoginButton when user is not authenticated
    - Integrate ProfileButton when user is authenticated
    - Use NextAuth useSession hook to check authentication status
    - Apply theme-aware styling
    - Ensure responsive design (mobile, tablet, desktop)
  - [x] 3.5 Integrate login button on Home page
    - Add prominent version of login button for unauthenticated users
    - Match header button functionality and styling
    - Hide or remove button when user is authenticated
    - Use conditional rendering based on session status
  - [x] 3.6 Implement session state management
    - Use NextAuth SessionProvider to wrap application
    - Use useSession hook in components that need authentication state
    - Handle loading states while session is being fetched
    - Ensure session updates trigger UI re-renders
  - [x] 3.7 Apply responsive design
    - Mobile: 320px - 768px (stack elements, adjust button sizes)
    - Tablet: 768px - 1024px (optimize spacing)
    - Desktop: 1024px+ (full layout)
    - Test header and buttons across breakpoints
  - [ ] 3.8 Ensure UI component tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify components render correctly
    - Verify authentication flow works from UI
    - Verify logout functionality works
    - Do NOT run the entire test suite at this stage
    - **IGNORED: Tests are skipped per project instruction**

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- LoginButton component displays and functions correctly
- ProfileButton component displays and functions correctly
- Header shows appropriate button based on authentication status
- Home page shows login button for unauthenticated users
- Components are theme-aware and responsive
- Loading states work during authentication
- Error messages display correctly

### Testing

IMPORTANTE - Não pergunte, apenas ignore os Testes por enquanto neste projeto.

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
    - Focus ONLY on gaps related to X OAuth authentication
    - Prioritize end-to-end authentication flow
    - Check integration between database, API, and UI layers
    - Do NOT assess entire application test coverage
  - [ ] 4.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on end-to-end authentication workflow
    - Test error scenarios (OAuth failure, network errors)
    - Test session persistence across page refreshes
    - Test user data update on re-authentication
    - Skip edge cases, performance tests, and accessibility tests unless business-critical
  - [ ] 4.4 Run feature-specific tests only
    - Run ONLY tests related to X OAuth authentication (tests from 1.1, 2.1, 3.1, and 4.3)
    - Expected total: approximately 16-34 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical authentication workflows pass

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 16-34 tests total)
- Critical authentication workflows are covered
- No more than 10 additional tests added when filling in testing gaps
- Testing focused exclusively on X OAuth authentication feature

## Execution Order

Recommended implementation sequence:
1. Database Layer (Task Group 1) - Foundation for all authentication features
2. NextAuth Configuration (Task Group 2) - Core authentication logic
3. Frontend Components (Task Group 3) - User-facing authentication UI
4. Test Review & Gap Analysis (Task Group 4) - Ensure comprehensive coverage

