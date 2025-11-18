# Task Breakdown: Fase 1 - Canvas Foundation

## Overview
Total Tasks: 3 major groups, ~25 sub-tasks

## Task List

### Frontend Core - Drops System

#### Task Group 1: Drops System Implementation
**Dependencies:** None
**Priority:** 1 (Highest)

- [x] 1.0 Complete Drops System
  - [ ] 1.1 Write 2-8 focused tests for Drop class functionality
    - Test drop physics (gravity, bounce, rotation)
    - Test drop rendering (all 4 shapes)
    - Test click detection and explosion
    - Test rarity selection and configuration
    - Limit to 2-8 highly focused tests maximum
  - [x] 1.2 Create Drop class (`lib/canvas/drops/Drop.ts`)
    - Implement procedural physics (gravity, bounce, rotation)
    - Support 4 shapes: circle, square, triangle, hexagon
    - Implement explosion particle system
    - Theme-aware color resolution
    - Lifetime management (12s timeout)
    - Reuse patterns from: DevOrbsCanvas physics concepts
  - [x] 1.3 Create DropManager class (`lib/canvas/drops/DropManager.ts`)
    - Spawn timing logic (40-90s random intervals)
    - Maximum 1 active drop enforcement
    - Rarity selection based on probability distribution
    - Shape selection randomization
    - Click handling and reward granting
  - [x] 1.4 Create drop configuration (`lib/canvas/drops/drop-config.ts`)
    - Define 4 rarity tiers with probabilities
    - Configure colors, sizes, glow, rewards per rarity
    - Theme color mapping utilities
  - [x] 1.5 Create useDrops hook (`hooks/useDrops.ts`)
    - Canvas size management
    - Animation loop integration
    - Reward callback handling
    - Theme integration
    - Follow pattern from: existing canvas hooks
  - [x] 1.6 Create DropsCanvas component (`components/DropsCanvas.tsx`)
    - Canvas setup and resize handling
    - Click event handling
    - Integration with useDrops hook
    - Z-index positioning above DevOrbsCanvas
    - Follow structure from: DevOrbsCanvas.tsx
  - [x] 1.7 Integrate DropsCanvas into home page (`app/page.tsx`)
    - Add DropsCanvas layer above DevOrbsCanvas
    - Ensure proper viewport sizing
    - Handle reward display (client state only)
  - [ ] 1.8 Ensure Drops System tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify drop physics works correctly
    - Verify rendering and click detection
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Drops spawn with correct timing and rarity distribution
- All 4 shapes render procedurally with theme-aware colors
- Click detection triggers explosion animation
- Drops positioned correctly above DevOrbsCanvas
- No interference with existing DevOrbs physics

### Frontend Core - Emotes System

#### Task Group 2: Dev Emotes System Implementation
**Dependencies:** Task Group 1 (for integration patterns)
**Priority:** 2

- [x] 2.0 Complete Emotes System
  - [ ] 2.1 Write 2-8 focused tests for EmoteRenderer functionality
    - Test text rendering with different themes
    - Test glow, glitch, pixelation effects
    - Test emote lifecycle (spawn, animate, fade)
    - Limit to 2-8 highly focused tests maximum
  - [x] 2.2 Create EmoteRenderer class (`lib/canvas/emotes/EmoteRenderer.ts`)
    - Procedural text rendering (JetBrains Mono font)
    - Theme-aware rendering (neon, glitch, pixel, terminal)
    - Glow effect implementation
    - Glitch effect (text duplication with offset)
    - Pixelation for pixel theme
    - Scanlines effect (optional)
  - [x] 2.3 Create EmoteManager class (`lib/canvas/emotes/EmoteManager.ts`)
    - Emote lifecycle management
    - Chat emote spawning (scale animation, fade)
    - Multiplayer emote spawning (above player)
    - Animation updates (scale, alpha, glitch offset)
  - [x] 2.4 Create emote types and utilities (`lib/canvas/emotes/emote-types.ts`)
    - Define emote formats: `</rage>`, `:segfault:`, etc.
    - Emote state interface
    - Configuration types
  - [x] 2.5 Create useEmotes hook (`hooks/useEmotes.ts`)
    - Emote spawning API
    - Animation loop integration
    - Theme integration
    - Follow pattern from: useDrops hook
  - [x] 2.6 Create EmoteBubble component (`components/EmoteBubble.tsx`)
    - Canvas rendering wrapper
    - Chat integration point (prepared for future)
    - Multiplayer integration point
    - Follow structure from: DropsCanvas component
  - [ ] 2.7 Ensure Emotes System tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify rendering works for all themes
    - Verify effects (glow, glitch, pixelation) work correctly
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Emotes render procedurally with theme-aware styling
- All visual effects (glow, glitch, pixelation) work correctly
- Emote lifecycle (spawn, animate, fade) functions properly
- Structure prepared for future chat integration

### Backend API - Hacker Panel

#### Task Group 3: Hacker Panel API Endpoints
**Dependencies:** None (can work in parallel with frontend)
**Priority:** 3

- [ ] 3.0 Complete Hacker Panel API layer
  - [ ] 3.1 Write 2-8 focused tests for stats API endpoints
    - Test GET /api/stats/online endpoint
    - Test GET /api/stats/recent-logins endpoint
    - Test GET /api/stats/active-games endpoint
    - Test caching behavior
    - Test fallback to mocked data
    - Limit to 2-8 highly focused tests maximum
  - [ ] 3.2 Create GET /api/stats/online endpoint (`app/api/stats/online/route.ts`)
    - Count active sessions or users
    - Implement in-memory caching with TTL (7-10 seconds)
    - Fallback to mocked count if no data available
    - Follow pattern from: `app/api/users/recent/route.ts`
    - Use handleApiError for error handling
  - [ ] 3.3 Create GET /api/stats/recent-logins endpoint (`app/api/stats/recent-logins/route.ts`)
    - Query recent user logins from sessions
    - Return last 5-10 login entries with username and timestamp
    - Implement caching strategy
    - Fallback to mocked logins if needed
    - Follow pattern from: `app/api/users/recent/route.ts`
  - [ ] 3.4 Create GET /api/stats/active-games endpoint (`app/api/stats/active-games/route.ts`)
    - Count active game sessions (can be mocked initially)
    - Return count of currently active games
    - Implement caching strategy
    - Fallback to mocked count if needed
    - Follow pattern from: `app/api/users/recent/route.ts`
  - [ ] 3.5 Ensure API layer tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify all endpoints return correct JSON format
    - Verify caching works correctly
    - Verify fallback data is used when appropriate
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- All three endpoints return consistent JSON format
- Caching reduces database load appropriately
- Fallback data works when real data unavailable
- Error handling follows existing patterns

### Frontend UI - Hacker Panel

#### Task Group 4: Hacker Panel Component
**Dependencies:** Task Group 3 (API endpoints)
**Priority:** 3

- [ ] 4.0 Complete Hacker Panel UI
  - [ ] 4.1 Write 2-8 focused tests for HackerPanel component
    - Test log rendering (real + fake)
    - Test auto-scroll behavior
    - Test fade-out animation
    - Test API integration and fallback
    - Limit to 2-8 highly focused tests maximum
  - [ ] 4.2 Create log generator (`lib/canvas/hacker-panel/log-generator.ts`)
    - Procedural fake log generation
    - Template-based message creation
    - Random placeholder replacement
    - Log type classification (INFO, WARN, DEBUG, etc.)
  - [ ] 4.3 Create HackerCanvas component (`components/hacker-panel/HackerCanvas.tsx`)
    - Canvas background with animated scanlines
    - Glitch effect implementation
    - Neon border with glow
    - Theme-aware styling
    - Follow pattern from: game canvas components
  - [ ] 4.4 Create HackerPanel component (`components/hacker-panel/HackerPanel.tsx`)
    - HTML text layer for logs (better performance)
    - Real log integration (from API endpoints)
    - Fake log integration (from generator)
    - Auto-scroll to latest entry
    - Fade-out animation for old entries (30s threshold)
    - Blinking cursor indicator
    - Maximum 50 log entries management
    - Follow structure from: overlay components in games
  - [ ] 4.5 Create useHackerPanel hook (`hooks/useHackerPanel.ts`)
    - API data fetching
    - Log state management
    - Auto-scroll logic
    - Fade-out timing
    - Follow pattern from: useDrops hook
  - [ ] 4.6 Integrate HackerPanel into home page (`app/page.tsx`)
    - Add toggle button for visibility
    - Hidden by default
    - Position as overlay layer
    - Ensure proper z-index management
  - [ ] 4.7 Ensure Hacker Panel tests pass
    - Run ONLY the 2-8 tests written in 4.1
    - Verify log rendering works correctly
    - Verify API integration and fallback
    - Verify animations work properly
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 4.1 pass
- HackerPanel renders with animated background
- Real and fake logs display correctly
- Auto-scroll and fade-out animations work
- Toggle functionality works on home page
- API integration with fallback works correctly

### Integration and Verification

#### Task Group 5: Integration Testing and Shake Verification
**Dependencies:** Task Groups 1, 2, 4
**Priority:** 4 (Final verification)
**Status:** ✅ Complete

- [x] 5.0 Complete integration verification
  - [x] 5.1 Verify Shake does not interfere with Drops
    - Test shake button while drops are active
    - Verify drops continue normal physics during shake
    - Verify drops are not affected by Matter.js forces
    - Document separation of physics systems
  - [x] 5.2 Verify canvas layer stacking
    - DevOrbsCanvas: bottom layer (z-index lowest)
    - DropsCanvas: middle layer (z-index medium)
    - HackerPanel: overlay layer (z-index highest when visible)
    - Verify no visual conflicts or rendering issues
  - [x] 5.3 Verify theme integration across all systems
    - Test theme switching with all systems active
    - Verify colors update in real-time
    - Verify effects adapt correctly (pixelation, glow, etc.)
    - Test all 5 themes: cyber, pixel, neon, terminal, blueprint
  - [x] 5.4 Verify performance optimizations
    - Test requestAnimationFrame usage in all systems
    - Verify mobile fallback (reduced particles/glow)
    - Test cleanup on component unmount
    - Verify no memory leaks
  - [x] 5.5 Verify viewport and scroll behavior
    - Ensure no scroll on desktop
    - Verify all systems fit within viewport
    - Test responsive behavior (mobile fallback)
    - Verify canvas resize handling

**Acceptance Criteria:**
- Shake does not affect Drops system
- All canvas layers stack correctly without conflicts
- Theme switching works seamlessly across all systems
- Performance is acceptable (60fps on desktop, 30-60fps on mobile)
- No scroll issues on desktop
- All systems integrate properly

### Testing

#### Task Group 6: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-5
**Priority:** 5 (Final)

- [ ] 6.0 Review existing tests and fill critical gaps only
  - [ ] 6.1 Review tests from Task Groups 1-5
    - Review the 2-8 tests written by frontend-engineer (Task 1.1)
    - Review the 2-8 tests written by frontend-engineer (Task 2.1)
    - Review the 2-8 tests written by backend-engineer (Task 3.1)
    - Review the 2-8 tests written by frontend-engineer (Task 4.1)
    - Total existing tests: approximately 8-32 tests
  - [ ] 6.2 Analyze test coverage gaps for THIS feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to Canvas Foundation requirements
    - Do NOT assess entire application test coverage
    - Prioritize end-to-end workflows over unit test gaps
  - [ ] 6.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on integration points: Drops + DevOrbs, Emotes + themes, HackerPanel + API
    - Test end-to-end workflows: drop spawn → click → reward, emote render → fade, panel toggle → logs
    - Do NOT write comprehensive coverage for all scenarios
    - Skip edge cases, performance tests, and accessibility tests unless business-critical
  - [ ] 6.4 Run feature-specific tests only
    - Run ONLY tests related to Canvas Foundation (tests from 1.1, 2.1, 3.1, 4.1, and 6.3)
    - Expected total: approximately 18-42 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 18-42 tests total)
- Critical user workflows for Canvas Foundation are covered
- No more than 10 additional tests added when filling in testing gaps
- Testing focused exclusively on Canvas Foundation requirements

## Execution Order

Recommended implementation sequence:
1. **Frontend Core - Drops System** (Task Group 1) - Priority 1
2. **Frontend Core - Emotes System** (Task Group 2) - Priority 2 (can start after 1.0)
3. **Backend API - Hacker Panel** (Task Group 3) - Priority 3 (can work in parallel)
4. **Frontend UI - Hacker Panel** (Task Group 4) - Priority 3 (depends on Group 3)
5. **Integration and Verification** (Task Group 5) - Priority 4 (after all systems complete)
6. **Test Review & Gap Analysis** (Task Group 6) - Priority 5 (final step)

## Notes

- **Shake functionality**: Already implemented - only verification needed (Task 5.1)
- **No database changes**: All systems use client state or existing database structure
- **Theme integration**: All systems must read from ThemeStore and adapt in real-time
- **Performance**: Mobile fallback reduces complexity (50% particles, 50% glow)
- **Canvas stacking**: Critical to maintain proper z-index order for visual correctness

