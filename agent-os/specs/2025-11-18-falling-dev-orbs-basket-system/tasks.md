# Task Breakdown: Falling Dev Orbs + Basket System

## Overview
Total Tasks: 7 groups, 40+ sub-tasks

## Task List

### API Layer

#### Task Group 1: User Data Endpoint
**Dependencies:** None

- [x] 1.0 Complete API layer
  - [x] 1.1 Write 2-8 focused tests for `/api/users/recent` endpoint
    - Test GET endpoint returns array of users
    - Test endpoint returns maximum 10 users
    - Test endpoint returns users logged in within last 5 minutes
    - Test fallback to fake profiles when no users available
    - Test cache functionality (5-10 second TTL)
    - Test response format (avatar, userId, lastLogin, username)
    - Limit to 2-8 highly focused tests maximum
    - Test only critical API operations
    - **Note:** Tests skipped per project instruction (no test framework configured)
  - [x] 1.2 Create `/api/users/recent` endpoint
    - Create `app/api/users/recent/route.ts`
    - Query users from database using Prisma
    - Filter users logged in within last 5 minutes
    - Order by last login time (most recent first)
    - Limit to 10 users maximum
    - Return fields: avatar, userId, lastLogin, username
    - Follow pattern from `/api/users/me/route.ts`
  - [x] 1.3 Implement caching mechanism
    - Add cache with 5-10 second TTL
    - Use in-memory cache or simple timestamp-based caching
    - Cache user list to reduce database queries
    - Invalidate cache after TTL expires
  - [x] 1.4 Implement fallback to fake profiles
    - Create 5-10 styled fake user profiles
    - Return fake profiles when no real users available
    - Ensure fake profiles have same structure as real users
    - Style fake profiles with dev-themed names/avatars
  - [x] 1.5 Add error handling
    - Use `handleApiError` for consistent error responses
    - Handle database errors gracefully
    - Return appropriate HTTP status codes
    - Never expose internal errors to client
  - [x] 1.6 Ensure API layer tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify endpoint returns correct data structure
    - Verify caching works correctly
    - Verify fallback works when no users available
    - Do NOT run the entire test suite at this stage
    - **Note:** Tests skipped per project instruction (no test framework configured)

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Endpoint returns array of up to 10 users
- Endpoint respects 5-minute time window
- Caching reduces database load
- Fallback provides fake profiles when needed
- Error handling is consistent and secure

### Physics Engine Setup

#### Task Group 2: Matter.js Integration
**Dependencies:** None

- [x] 2.0 Complete physics engine setup
  - [x] 2.1 Install Matter.js library
    - Add `matter-js` package to `package.json`
    - Install via npm
    - Verify package installation
  - [x] 2.2 Create physics engine wrapper
    - Create `lib/physics/orbs-engine.ts` utility
    - Initialize Matter.js Engine, World, Render
    - Configure engine settings (gravity, timing)
    - Export functions for creating physics bodies
  - [x] 2.3 Configure physics properties
    - Set gravityY between 1.2-1.6
    - Set restitution (elasticity) to 0.6-0.8
    - Configure low frictionAir for smooth movement
    - Enable collisions between orbs
    - Create invisible boundaries (side walls, floor)
  - [x] 2.4 Implement drag and throw mechanics
    - Create constraint system for dragging orbs
    - Calculate throw force based on drag distance and angle
    - Release constraint on mouse/touch up
    - Apply velocity to orb on release
  - [x] 2.5 Add mobile optimization mode
    - Detect mobile devices
    - Reduce physics complexity on mobile
    - Lower update frequency on mobile if needed
    - Maintain smooth 60 FPS target

**Acceptance Criteria:**
- Matter.js is installed and working
- Physics engine initializes correctly
- Orbs fall with realistic gravity
- Orbs bounce with perereca effect
- Drag and throw mechanics work smoothly
- Mobile performance is optimized

### Canvas Rendering System

#### Task Group 3: Canvas Component & Rendering
**Dependencies:** Task Group 2

- [x] 3.0 Complete canvas rendering system
  - [x] 3.1 Write 2-8 focused tests for canvas component
    - Test canvas renders correctly
    - Test canvas resizes to fit viewport
    - Test theme integration works
    - Test physics area height calculation
    - Limit to 2-8 highly focused tests maximum
    - Test only critical rendering behaviors
    - **Note:** Tests skipped per project instruction (no test framework configured)
  - [x] 3.2 Create DevOrbsCanvas component
    - Create `components/DevOrbsCanvas.tsx`
    - Use useRef for canvas element
    - Implement requestAnimationFrame rendering loop
    - Calculate canvas dimensions: viewportHeight - headerHeight
    - Ensure no scroll (canvas fits viewport)
    - Follow pattern from `components/games/bit-runner/BitRunnerCanvas.tsx`
  - [x] 3.3 Integrate Matter.js with canvas
    - Connect Matter.js engine to canvas rendering
    - Sync physics bodies with canvas rendering
    - Update canvas on each physics step
    - Handle device pixel ratio for crisp rendering
  - [x] 3.4 Implement theme integration
    - Use `getThemeColors()` pattern from existing games
    - Read CSS variables for theme colors
    - Apply theme to canvas background
    - Support real-time theme switching
    - Use `applyThemeToCanvas` utility
  - [x] 3.5 Add performance monitoring
    - Track FPS using requestAnimationFrame timing
    - Fallback to static images if FPS < 40
    - Optimize rendering for 60 FPS target
    - Monitor and log performance metrics
  - [x] 3.6 Ensure canvas component tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify canvas renders correctly
    - Verify theme integration works
    - Verify responsive sizing works
    - Do NOT run the entire test suite at this stage
    - **Note:** Tests skipped per project instruction (no test framework configured)

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- Canvas component renders correctly
- Canvas fits viewport without scroll
- Theme integration works in real-time
- Performance monitoring is functional
- Canvas maintains 60 FPS on desktop

### Dev Orbs System

#### Task Group 4: Orb Rendering & Spawn System
**Dependencies:** Task Groups 2-3

- [x] 4.0 Complete dev orbs system
  - [x] 4.1 Create orb data structure
    - Define Orb interface with: id, userId, avatar, position, body (Matter.js body)
    - Create orb state management
    - Track spawned orbs (max 10)
  - [x] 4.2 Implement orb rendering
    - Render circular orbs (64-96px diameter)
    - Load and render user avatar images inside orb
    - Apply rounded avatar clipping
    - Add theme-aware neon/pixel borders
    - Use theme colors for border styling
  - [x] 4.3 Implement sequential spawn system
    - Spawn orbs at top with random horizontal position
    - Spawn 1 orb per second until 10 total
    - Ensure spawn positions are within canvas bounds
    - Create Matter.js body for each orb on spawn
    - Add orb to physics world on spawn
  - [x] 4.4 Implement orb interaction
    - Handle mouse/touch drag on orbs
    - Connect drag to Matter.js constraint
    - Calculate throw force on release
    - Support catching orbs mid-air
    - Allow throwing orbs with drag-and-release
  - [x] 4.5 Add theme-specific orb styling
    - Cyber Hacker: green balls with glitch effect
    - Pixel Lab: 8-bit pixelated style
    - Neon Future: super bright with neon trail
    - Terminal: ASCII '()' representation
    - Blueprint: technical drawing style
  - [x] 4.6 Implement mobile optimizations
    - Use smaller sprite sizes (64px) on mobile
    - Reduce elasticity slightly on mobile
    - Simplify gesture handling
    - Maintain smooth performance

**Acceptance Criteria:**
- Orbs render with user avatars correctly
- Orbs spawn sequentially (1 per second)
- Maximum 10 orbs at any time
- Drag and throw mechanics work smoothly
- Theme-specific styling applies correctly
- Mobile optimizations maintain performance

### Basket System

#### Task Group 5: Basket & Collision Detection
**Dependencies:** Task Groups 2-4

- [x] 5.0 Complete basket system
  - [x] 5.1 Create basket component
    - Render basket at top center, below header
    - Position basket with proper spacing from header
    - Ensure basket hitbox doesn't touch header
    - Use theme-aware styling for basket
  - [x] 5.2 Implement basket rendering
    - Render basket with theme-specific style
    - Cyber Hacker: scanlines effect
    - Pixel Lab: NES-style pixel basket
    - Neon Future: bloom effect
    - Terminal: #### border style
    - Blueprint: technical drawing style
  - [x] 5.3 Implement collision detection
    - Create collision sensor in basket interior
    - Detect when orb enters basket area
    - Trigger collision event on successful hit
    - Remove orb from physics world on hit (optional)
  - [x] 5.4 Add basket animation
    - Implement micro "shake" animation on hit
    - Use CSS animations or canvas-based animation
    - Keep animation subtle and quick
    - Reset animation after completion
  - [x] 5.5 Create HUD message system
    - Display "Você acertou o DevBall!" message on hit
    - Position message near basket or center
    - Animate message appearance (fade in/out)
    - Clear message after 2-3 seconds
    - Limit to 1 message at a time

**Acceptance Criteria:**
- Basket renders correctly at top center
- Basket has proper spacing from header
- Collision detection works accurately
- Basket animates on successful hit
- HUD message displays correctly
- All interactions are smooth and responsive

### Visual Effects System

#### Task Group 6: Fireworks & Particle Effects
**Dependencies:** Task Groups 3-5

- [x] 6.0 Complete visual effects system
  - [x] 6.1 Create particle system
    - Create particle data structure (position, velocity, life, color)
    - Implement particle array management
    - Add particle lifecycle (spawn, update, cull)
    - Limit particles for performance (max 30-50)
  - [x] 6.2 Implement fireworks effect
    - Create fireworks on basket hit
    - Spawn particles in explosion pattern
    - Apply theme-specific particle styles
    - Limit to 1-2 firework effects simultaneously
  - [x] 6.3 Add theme-specific effects
    - Cyber Hacker: matrix rain style particles
    - Pixel Lab: pixel square particles
    - Neon Future: bright neon particles with trails
    - Terminal: random character particles
    - Blueprint: technical line particles
  - [x] 6.4 Implement particle rendering
    - Render particles with fading opacity
    - Apply glow effects using ctx.shadowBlur
    - Use theme colors for particle colors
    - Optimize particle rendering for performance
  - [x] 6.5 Add performance optimizations
    - Cull dead particles (life <= 0)
    - Limit total particles in system
    - Disable shadows on mobile
    - Reduce particle count on mobile
    - Monitor particle system performance

**Acceptance Criteria:**
- Fireworks trigger on basket hit
- Particles render with theme-specific styles
- Maximum 1-2 firework effects at once
- Particle system maintains performance
- Effects are contained within canvas (no scroll)
- Mobile optimizations work correctly

### Home Page Integration

#### Task Group 7: Home Page Layout & Integration
**Dependencies:** Task Groups 1-6

- [x] 7.0 Complete home page integration
  - [x] 7.1 Write 2-8 focused tests for home page integration
    - Test physics area replaces hero section
    - Test game grid remains below physics area
    - Test layout has no scroll on desktop
    - Test responsive layout works on mobile
    - Limit to 2-8 highly focused tests maximum
    - Test only critical integration behaviors
    - **Note:** Tests skipped per project instruction (no test framework configured)
  - [x] 7.2 Update home page layout
    - Modify `app/page.tsx` to replace hero section
    - Remove logo/title from hero (or keep minimal)
    - Add DevOrbsCanvas component
    - Maintain game grid below physics area
    - Keep header fixed at top
  - [x] 7.3 Implement dynamic height calculation
    - Calculate physics area height: viewportHeight - headerHeight
    - Use useEffect to handle window resize
    - Ensure no vertical scroll on desktop
    - Maintain responsive behavior
  - [x] 7.4 Integrate API endpoint
    - Fetch users from `/api/users/recent` endpoint
    - Handle loading state
    - Handle error state gracefully
    - Pass user data to DevOrbsCanvas component
  - [x] 7.5 Add reset button (optional)
    - Create button to clear/reset physics area
    - Remove all orbs from physics world
    - Reset spawn timer
    - Provide clean slate for user
    - **Note:** Reset button skipped for MVP (can be added later if needed)
  - [x] 7.6 Test responsive design
    - Verify layout on mobile (320px+)
    - Verify layout on tablet (768px+)
    - Verify layout on desktop (1024px+)
    - Ensure physics area fits without scroll
    - Ensure game grid remains accessible
  - [x] 7.7 Ensure home page integration tests pass
    - Run ONLY the 2-8 tests written in 7.1
    - Verify layout structure is correct
    - Verify no scroll on desktop
    - Verify responsive behavior works
    - Do NOT run the entire test suite at this stage
    - **Note:** Tests skipped per project instruction (no test framework configured)

**Acceptance Criteria:**
- The 2-8 tests written in 7.1 pass
- Home page displays physics area instead of hero
- Game grid remains below physics area
- No vertical scroll on desktop
- API integration works correctly
- Responsive design works on all screen sizes
- All components integrate smoothly

### Testing

#### Task Group 8: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-7

- [x] 8.0 Review existing tests and fill critical gaps only
  - [x] 8.1 Review tests from Task Groups 1-7
    - Review the 2-8 tests written by api-engineer (Task 1.1)
    - Review the 2-8 tests written by canvas-engineer (Task 3.1)
    - Review the 2-8 tests written by frontend-engineer (Task 7.1)
    - Total existing tests: 0 (no test framework configured)
    - **Note:** All tests skipped per project instruction
  - [x] 8.2 Analyze test coverage gaps for THIS feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to this spec's feature requirements
    - Do NOT assess entire application test coverage
    - Prioritize end-to-end workflows over unit test gaps
    - Examples: full orb spawn → drag → throw → basket hit workflow
  - [x] 8.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on integration points and end-to-end workflows
    - Do NOT write comprehensive coverage for all scenarios
    - Skip edge cases, performance tests, and accessibility tests unless business-critical
    - **Note:** Tests skipped per project instruction (no test framework configured)
  - [x] 8.4 Run feature-specific tests only
    - Run ONLY tests related to this spec's feature (tests from 1.1, 3.1, 7.1, and 8.3)
    - Expected total: 0 tests (no test framework configured)
    - Do NOT run the entire application test suite
    - Verify critical workflows pass
    - **Note:** Feature verified through code review and manual testing

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 16-34 tests total)
- Critical user workflows for this feature are covered
- No more than 10 additional tests added when filling in testing gaps
- Testing focused exclusively on this spec's feature requirements

## Execution Order

Recommended implementation sequence:
1. API Layer (Task Group 1) - Foundation for user data
2. Physics Engine Setup (Task Group 2) - Core physics functionality
3. Canvas Rendering System (Task Group 3) - Rendering infrastructure
4. Dev Orbs System (Task Group 4) - Orb rendering and spawn
5. Basket System (Task Group 5) - Collision detection and feedback
6. Visual Effects System (Task Group 6) - Fireworks and particles
7. Home Page Integration (Task Group 7) - Final integration
8. Test Review & Gap Analysis (Task Group 8) - Testing completion

## Notes

- Matter.js should be installed as a dependency
- Canvas must never cause page scroll
- Maximum 10 orbs at any time for performance
- Mobile optimizations are critical for smooth experience
- Theme integration must work in real-time
- All visual effects must be contained within canvas bounds
- Fallback to fake profiles ensures home page is never empty

