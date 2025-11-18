# Task Breakdown: MVP Stability Patch

## Overview
Total Tasks: 7 groups, 50+ sub-tasks

## Task List

### Core Performance Systems

#### Task Group 1: Mobile Safety Mode (Lite Mode)
**Dependencies:** None

- [x] 1.0 Complete Mobile Safety Mode
  - [x] 1.1 Write 2-8 focused tests for mobile mode detection and activation
    - Test `isMobileDevice()` returns true for mobile user agents
    - Test mobile mode activates when `window.innerWidth < 768px`
    - Test mobile mode disables physics, DevOrbs, drops, fireworks
    - Test mobile mode keeps HUD, scoreboard, static visuals active
    - Test light CSS animations remain active in mobile mode
    - Limit to 2-8 highly focused tests maximum
    - Test only critical mobile mode behaviors
    - **Note:** Tests skipped per project instruction (no test framework configured)
  - [x] 1.2 Extend `isMobileDevice()` function in `lib/physics/orbs-engine.ts`
    - Add return value for mode state (not just boolean)
    - Create `getMobileMode()` function that returns 'lite' | 'full'
    - Ensure function works on both server and client side
    - Follow existing pattern from `isMobileDevice()` function
  - [x] 1.3 Create global mobile mode state system
    - Create `lib/performance/mobile-mode.ts` utility
    - Export global state accessible to all canvas components
    - Use Zustand or similar for state management
    - Persist mode across theme switches and navigation
  - [x] 1.4 Integrate mobile mode with DevOrbsCanvas
    - Disable Matter.js physics when mobile mode active
    - Disable DevOrbs spawning and rendering
    - Keep static basket and court visuals
    - Apply mode on component mount and window resize
  - [x] 1.5 Integrate mobile mode with DropsCanvas
    - Disable drops spawning when mobile mode active
    - Keep canvas element but render static background only
    - Respect mobile mode state from global state
  - [x] 1.6 Integrate mobile mode with EmoteBubble
    - Disable emotes when mobile mode active
    - Keep canvas element for future use
  - [x] 1.7 Add light CSS animations for mobile mode
    - Create utility for light animations (opacity/transform with will-change)
    - Apply to banners, buttons, and UI elements
    - Ensure animations don't impact performance
  - [x] 1.8 Ensure mobile mode tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify mobile mode activates correctly
    - Verify all systems respect mobile mode
    - Do NOT run the entire test suite at this stage
    - **Note:** Tests skipped per project instruction (no test framework configured)

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Mobile mode activates automatically on mobile devices
- Physics, DevOrbs, drops, fireworks are disabled in mobile mode
- HUD, scoreboard, and static visuals remain active
- Light CSS animations work without performance impact
- Mode persists across theme switches and navigation

#### Task Group 2: FPS Guardian (Performance Fallback System)
**Dependencies:** Task Group 1

- [ ] 2.0 Complete FPS Guardian system
  - [ ] 2.1 Write 2-8 focused tests for FPS monitoring and degradation
    - Test FPS calculation and history tracking
    - Test Level 0 (FPS ≥ 50) enables everything
    - Test Level 1 (40 ≤ FPS < 50) applies smooth degradation
    - Test Level 2 (FPS < 40) applies aggressive fallback
    - Test hysteresis buffer prevents thrashing (2-second buffer)
    - Test FPS state is exported globally
    - Limit to 2-8 highly focused tests maximum
    - Test only critical FPS behaviors
  - [ ] 2.2 Extend existing FPS monitor in `DevOrbsCanvas.tsx`
    - Extend FPS monitoring (lines 1556-1601) for multi-threshold behavior
    - Add Level 0, Level 1, Level 2 detection logic
    - Implement 60-frame average calculation with 2-second hysteresis buffer
    - Track FPS history over 60 frames for stable average
  - [ ] 2.3 Create global FPS state system
    - Create `lib/performance/fps-guardian.ts` utility
    - Export FPS level state (0, 1, 2) globally
    - Use Zustand or similar for state management
    - Allow all canvas components to subscribe to FPS state
  - [ ] 2.4 Implement Level 1 degradation logic
    - Reduce particles by half when Level 1 active
    - Decrease neon opacity by 50%
    - Reduce glow intensity by 50%
    - Limit fireworks to 3 simultaneous
    - Apply degradation gradually (not all at once)
  - [ ] 2.5 Implement Level 2 fallback logic
    - Disable physics when Level 2 active
    - Disable particles, drops, fireworks
    - Render minimal static frame with theme background
    - Stop particles first, then physics (gradual degradation)
  - [ ] 2.6 Integrate FPS Guardian with all canvas components
    - Update DevOrbsCanvas to respect FPS levels
    - Update DropsCanvas to respect FPS levels
    - Update EmoteBubble to respect FPS levels
    - Ensure components react to FPS state changes
  - [ ] 2.7 Ensure FPS Guardian tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify FPS levels are detected correctly
    - Verify degradation is applied appropriately
    - Verify hysteresis prevents thrashing
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- FPS monitoring tracks 60-frame average correctly
- Three-tier system (Level 0, 1, 2) works as specified
- Hysteresis buffer (2 seconds) prevents thrashing
- All canvas components respect FPS levels
- Degradation is applied gradually

#### Task Group 3: Global Particle Budget System
**Dependencies:** Task Group 2

- [ ] 3.0 Complete Global Particle Budget system
  - [ ] 3.1 Write 2-8 focused tests for particle budget allocation
    - Test MAX_PARTICLES = 250 total limit
    - Test priority order (UI critical > legendary emotes > fireworks > drops > theme)
    - Test distribution (Fireworks 100, Drops 50, Emotes 50, Theme 50)
    - Test graceful degradation when budget exceeded
    - Test budget allocation functions work correctly
    - Limit to 2-8 highly focused tests maximum
    - Test only critical budget behaviors
  - [ ] 3.2 Create particle budget utility (`lib/canvas/particleBudget.ts`)
    - Create global state for particle budget (250 total)
    - Implement allocation functions for each particle type
    - Implement priority-based allocation system
    - Track current particle usage across all systems
  - [ ] 3.3 Implement priority-based allocation
    - UI critical (score effects): highest priority, never reduced
    - Legendary emotes: high priority, reduce only if necessary
    - Fireworks: medium priority, reduce when budget exceeded
    - Drops: lower priority, reduce before fireworks
    - Theme particles: lowest priority, reduce first
  - [ ] 3.4 Implement graceful degradation logic
    - When budget exceeded, reduce theme particles first
    - Then reduce drops, then fireworks
    - Never reduce UI critical or legendary emotes
    - Provide real-time budget status to FPS Guardian
  - [ ] 3.5 Integrate with DropManager
    - Extend `lib/canvas/drops/DropManager.ts` to check budget before spawning
    - Respect allocated budget for drops (50 particles)
    - Implement particle culling when budget exceeded
  - [ ] 3.6 Integrate with EmoteManager
    - Extend `lib/canvas/emotes/EmoteManager.ts` to check budget before spawning
    - Respect allocated budget for emotes (50 particles)
    - Prioritize legendary emotes over regular emotes
  - [ ] 3.7 Integrate with firework systems
    - Update DevOrbsCanvas fireworks to check budget
    - Respect allocated budget for fireworks (100 particles)
    - Integrate with firework limit system (Task Group 6)
  - [ ] 3.8 Extend hooks to read global particle budget
    - Update `hooks/useDrops.ts` to read budget before spawning
    - Update `hooks/useEmotes.ts` to read budget before spawning
    - Ensure hooks respect budget allocations
  - [ ] 3.9 Ensure particle budget tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify budget allocation works correctly
    - Verify graceful degradation works as specified
    - Verify all systems respect budget limits
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- MAX_PARTICLES = 250 total limit is enforced
- Priority-based allocation works correctly
- Distribution (Fireworks 100, Drops 50, Emotes 50, Theme 50) is respected
- Graceful degradation reduces particles in correct order
- All systems (DropManager, EmoteManager, fireworks) respect budget

### Score Protection System

#### Task Group 4: Safe Score System
**Dependencies:** None (can run parallel with Task Groups 1-3)

- [ ] 4.0 Complete Safe Score System
  - [ ] 4.1 Write 2-8 focused tests for score protection
    - Test score is saved to localStorage before sending
    - Test retry policy (5 attempts with exponential backoff)
    - Test pending scores expire after 30 days
    - Test toast notifications on failure and success
    - Test pending scores are sent on login/home load
    - Test queue warning when > 5 items
    - Limit to 2-8 highly focused tests maximum
    - Test only critical score protection behaviors
  - [ ] 4.2 Create score protection utility (`lib/score-protection.ts`)
    - Create functions for saving to `localStorage.pendingScore` (as array)
    - Store metadata: gameId, score, timestamp, attempt count
    - Implement retry policy with exponential backoff (1s, 2s, 4s, 8s, 16s)
    - Implement expiration check (30 days)
  - [ ] 4.3 Integrate with existing score submission (`app/api/scores/route.ts`)
    - Save to localStorage before sending attempt
    - Retry on failure with exponential backoff
    - Remove from localStorage on success
    - Track attempt count for retry logic
  - [ ] 4.4 Create toast notification system
    - Create toast component or use existing pattern
    - Show toast on failure: "Sua pontuação será enviada quando você entrar novamente."
    - Show toast on success: "Pontuação pendente enviada com sucesso!"
    - Use theme-aware styling for toasts
  - [ ] 4.5 Implement pending score processing on login/home
    - Check for pending scores on home page load
    - Attempt to send pending scores automatically
    - Process queue in order (FIFO)
    - Show success toast when pending score is sent
  - [ ] 4.6 Implement queue management
    - Check if queue accumulates > 5 items
    - Warn user when queue is full
    - Offer "baixar/compartilhar" locally as JSON
    - Implement expiration cleanup (remove expired after 30 days)
  - [ ] 4.7 Add session expiry handling
    - Detect session expiry during gameplay
    - Display friendly message: "Sua sessão expirou. Seu score está seguro e será enviado automaticamente quando você fizer login."
    - Ensure score is saved to localStorage before session expires
  - [ ] 4.8 Ensure Safe Score System tests pass
    - Run ONLY the 2-8 tests written in 4.1
    - Verify scores are saved to localStorage
    - Verify retry policy works correctly
    - Verify expiration and cleanup work
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 4.1 pass
- Scores are saved to localStorage before sending
- Retry policy (5 attempts, exponential backoff) works correctly
- Pending scores expire after 30 days
- Toast notifications appear on failure and success
- Pending scores are processed on login/home load
- Queue warning appears when > 5 items

### Multi-Tab Protection

#### Task Group 5: Multi-Tab Protection System
**Dependencies:** Task Groups 1-2

- [ ] 5.0 Complete Multi-Tab Protection system
  - [ ] 5.1 Write 2-8 focused tests for multi-tab coordination
    - Test BroadcastChannel "canvas_control" is created
    - Test active tab becomes owner
    - Test other tabs pause when owner is active
    - Test ownership transfer when owner loses focus
    - Test Page Visibility API pauses animations
    - Test pending scores sync via localStorage
    - Limit to 2-8 highly focused tests maximum
    - Test only critical multi-tab behaviors
  - [ ] 5.2 Create BroadcastChannel system (`lib/performance/multi-tab.ts`)
    - Create BroadcastChannel named "canvas_control"
    - Implement ownership model (active tab = owner)
    - Implement "relinquish" message when owner loses focus
    - Implement "request_ownership" message for next active tab
    - Ensure atomic ownership transfer (prevent race conditions)
  - [ ] 5.3 Integrate Page Visibility API
    - Use `document.visibilityState` to detect tab visibility
    - Pause animations when tab is invisible
    - Resume animations when tab becomes visible
    - Integrate with BroadcastChannel ownership system
  - [ ] 5.4 Integrate with DevOrbsCanvas
    - Pause canvas rendering loops when tab is not owner
    - Pause physics updates when tab is not owner
    - Respect tab ownership state
  - [ ] 5.5 Integrate with DropsCanvas
    - Pause drops system when tab is not owner
    - Pause particle updates when tab is not owner
  - [ ] 5.6 Integrate with EmoteBubble
    - Pause emotes when tab is not owner
    - Pause emote animations when tab is not owner
  - [ ] 5.7 Implement pending score sync
    - Sync pending scores via localStorage (already shared)
    - Optionally sync via BroadcastChannel for real-time updates
    - Do NOT sync real-time game state between tabs
  - [ ] 5.8 Ensure Multi-Tab Protection tests pass
    - Run ONLY the 2-8 tests written in 5.1
    - Verify ownership model works correctly
    - Verify tabs pause/resume appropriately
    - Verify no race conditions in ownership transfer
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 5.1 pass
- BroadcastChannel "canvas_control" coordinates tabs correctly
- Active tab becomes owner and runs physics/canvas
- Other tabs pause when owner is active
- Ownership transfers correctly when owner loses focus
- Page Visibility API pauses animations when tab is invisible
- Pending scores sync via localStorage

### Canvas Crash Resilience

#### Task Group 6: Canvas Crash Resilience System
**Dependencies:** Task Groups 1-2

- [ ] 6.0 Complete Canvas Crash Resilience system
  - [ ] 6.1 Write 2-8 focused tests for canvas crash handling
    - Test try/catch wraps renderFrame() and physics.step()
    - Test exception stops animation loops
    - Test error message is displayed
    - Test canvas restarts after 1 second delay
    - Test retry logic (3 attempts with backoff)
    - Test static fallback after 3 failures
    - Limit to 2-8 highly focused tests maximum
    - Test only critical crash handling behaviors
  - [ ] 6.2 Wrap renderFrame() in try/catch for all canvas components
    - Update DevOrbsCanvas renderFrame() with try/catch
    - Update DropsCanvas renderFrame() with try/catch
    - Update EmoteBubble renderFrame() with try/catch
    - Ensure errors are caught and handled gracefully
  - [ ] 6.3 Wrap physics.step() in try/catch
    - Update physics update calls in DevOrbsCanvas
    - Ensure physics errors don't crash canvas
    - Implement gradual degradation (stop particles first, then physics)
  - [ ] 6.4 Implement error handling and restart logic
    - Stop all animation loops on exception
    - Display message: "Visual temporariamente indisponível, reiniciando…"
    - Restart canvas after 1 second delay
    - Retry up to 3 times with exponential backoff (1s, 2s, 4s)
  - [ ] 6.5 Implement static fallback
    - After 3 failures, load fully static fallback (theme background only)
    - Send `canvas_crash` event with stack trace to logging system
    - Ensure user interaction (HUD, buttons) remains functional
  - [ ] 6.6 Add "Reiniciar visual" button
    - Create UI button for user to force canvas reload
    - Position button in accessible location
    - Use theme-aware styling
    - Reset canvas state on button click
  - [ ] 6.7 Implement error boundaries
    - Ensure error boundaries prevent page crashes
    - Maintain user interaction (HUD, buttons) even if canvas fails
    - Display fallback UI when canvas is unavailable
  - [ ] 6.8 Ensure Canvas Crash Resilience tests pass
    - Run ONLY the 2-8 tests written in 6.1
    - Verify try/catch blocks work correctly
    - Verify restart logic works as specified
    - Verify static fallback loads after 3 failures
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 6.1 pass
- renderFrame() and physics.step() are wrapped in try/catch
- Exceptions stop animation loops and display error message
- Canvas restarts after 1 second delay
- Retry logic (3 attempts, exponential backoff) works correctly
- Static fallback loads after 3 failures
- "Reiniciar visual" button allows manual canvas reload
- Error boundaries prevent page crashes

### Particle Limits

#### Task Group 7: Firework and Particle Limits
**Dependencies:** Task Group 3

- [ ] 7.0 Complete Firework and Particle Limits
  - [ ] 7.1 Write 2-8 focused tests for firework limits
    - Test MAX_FIREWORKS = 6 (default) and 2 (mobile)
    - Test oldest fireworks are removed when limit exceeded
    - Test fade-out animation (200ms) when removing fireworks
    - Test particle TTL ≤ 1200–2000 ms
    - Test integration with global particle budget
    - Limit to 2-8 highly focused tests maximum
    - Test only critical firework limit behaviors
  - [ ] 7.2 Implement firework limits in DevOrbsCanvas
    - Set MAX_FIREWORKS = 6 (default) and 2 (mobile)
    - Implement FIFO queue for fireworks
    - Remove oldest firework when limit exceeded
    - Implement fade-out animation (opacity transition over 200ms)
  - [ ] 7.3 Implement particle TTL limits
    - Set particle TTL ≤ 1200–2000 ms (1.2–2s)
    - Prefer smaller TTL for mobile/GPU performance
    - Remove particles when TTL expires
    - Ensure no particle lives > 3s (fallback limit)
  - [ ] 7.4 Integrate with global particle budget
    - Ensure firework limits respect particle budget (100 particles)
    - Coordinate with particle budget system from Task Group 3
    - Apply limits in DevOrbsCanvas and any other firework implementations
  - [ ] 7.5 Ensure Firework Limits tests pass
    - Run ONLY the 2-8 tests written in 7.1
    - Verify firework limits are enforced correctly
    - Verify fade-out animation works
    - Verify TTL limits are respected
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 7.1 pass
- MAX_FIREWORKS = 6 (default) and 2 (mobile) are enforced
- Oldest fireworks are removed when limit exceeded
- Fade-out animation (200ms) works smoothly
- Particle TTL ≤ 1200–2000 ms is respected
- Integration with global particle budget works correctly

### Session Stability

#### Task Group 8: Session Stability (NextAuth)
**Dependencies:** Task Group 4

- [ ] 8.0 Complete Session Stability system
  - [ ] 8.1 Write 2-8 focused tests for session renewal
    - Test proactive renewal when session.expires < now + 24h
    - Test silent renewal doesn't interrupt gameplay
    - Test toast warning when session.expires < 2 min
    - Test "Renovar sessão" button redirects to login
    - Test pending scores are retried after session renewal
    - Limit to 2-8 highly focused tests maximum
    - Test only critical session behaviors
  - [ ] 8.2 Implement proactive session renewal
    - Check if `session.expires < now + 24h` (or default updateAge)
    - Attempt silent renewal via refresh token or server ping
    - Ensure renewal doesn't interrupt gameplay or cause UI flicker
    - Hook into `auth.config.ts` session callbacks
  - [ ] 8.3 Implement session expiry warning
    - Detect when `session.expires < 2 min` during gameplay
    - Show soft warning toast with "Renovar sessão" button
    - Redirect to login flow when button clicked
    - Use theme-aware styling for toast
  - [ ] 8.4 Integrate with Safe Score System
    - Retry pending scores after session renewal
    - Ensure scores are sent when session is renewed
    - Show success toast when pending scores are sent
  - [ ] 8.5 Add logging for session renewal
    - Log session renewal attempts to monitoring system
    - Log session renewal failures
    - Use structured JSON format
  - [ ] 8.6 Ensure Session Stability tests pass
    - Run ONLY the 2-8 tests written in 8.1
    - Verify proactive renewal works correctly
    - Verify toast warning appears at correct time
    - Verify pending scores are retried after renewal
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 8.1 pass
- Proactive renewal works when session.expires < now + 24h
- Silent renewal doesn't interrupt gameplay
- Toast warning appears when session.expires < 2 min
- "Renovar sessão" button redirects to login
- Pending scores are retried after session renewal
- Session renewal attempts are logged

### Logging System

#### Task Group 9: Full Logging (Light Mode)
**Dependencies:** Task Groups 2, 4, 5, 6

- [ ] 9.0 Complete Logging system
  - [ ] 9.1 Write 2-8 focused tests for logging
    - Test FPS low events are logged
    - Test canvas crash events are logged with stack traces
    - Test score save failures are logged
    - Test multi-tab warnings are logged
    - Test anonymized metrics (session_duration, device_class, first_paint, time_to_interactive)
    - Test logs are structured JSON format
    - Limit to 2-8 highly focused tests maximum
    - Test only critical logging behaviors
  - [ ] 9.2 Create logging utility (`lib/performance/logging.ts`)
    - Create structured JSON log format
    - Include event type, timestamp, device class, relevant metrics
    - Ensure all logging is anonymized (no user data, personal information, game content)
    - Send logs to console in development
    - Prepare for future analytics service integration
  - [ ] 9.3 Implement FPS low event logging
    - Log when FPS drops below thresholds (Level 1 or Level 2)
    - Include FPS value, device class, timestamp
    - Integrate with FPS Guardian system
  - [ ] 9.4 Implement canvas crash event logging
    - Log canvas crashes with stack traces
    - Include device class, timestamp, canvas component name
    - Integrate with Canvas Crash Resilience system
  - [ ] 9.5 Implement score save failure logging
    - Log score save failures
    - Include gameId, error type, timestamp
    - Integrate with Safe Score System
  - [ ] 9.6 Implement multi-tab warning logging
    - Log when multiple tabs are detected
    - Include number of tabs, timestamp
    - Integrate with Multi-Tab Protection system
  - [ ] 9.7 Implement anonymized metrics logging
    - Log `session_duration` in buckets (<1m, 1–5m, 5–15m, >15m)
    - Log `device_class` (desktop / mobile / tablet)
    - Log `first_paint` / `time_to_interactive` (lightweight, for load problem detection)
    - Ensure all metrics are anonymized
  - [ ] 9.8 Ensure Logging tests pass
    - Run ONLY the 2-8 tests written in 9.1
    - Verify all events are logged correctly
    - Verify logs are structured JSON format
    - Verify no sensitive data is logged
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 9.1 pass
- FPS low events are logged with correct data
- Canvas crash events are logged with stack traces
- Score save failures are logged
- Multi-tab warnings are logged
- Anonymized metrics (session_duration, device_class, first_paint, time_to_interactive) are logged
- All logs are structured JSON format
- No sensitive user data is logged

### Testing

#### Task Group 10: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-9

- [ ] 10.0 Review existing tests and fill critical gaps only
  - [ ] 10.1 Review tests from Task Groups 1-9
    - Review the 2-8 tests written by each task group (1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1)
    - Total existing tests: approximately 18-72 tests
  - [ ] 10.2 Analyze test coverage gaps for THIS feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to this spec's feature requirements
    - Do NOT assess entire application test coverage
    - Prioritize end-to-end workflows over unit test gaps
  - [ ] 10.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on integration points and end-to-end workflows
    - Do NOT write comprehensive coverage for all scenarios
    - Skip edge cases, performance tests, and accessibility tests unless business-critical
  - [ ] 10.4 Run feature-specific tests only
    - Run ONLY tests related to this spec's feature (tests from 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, and 10.3)
    - Expected total: approximately 28-82 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 28-82 tests total)
- Critical user workflows for this feature are covered
- No more than 10 additional tests added when filling in testing gaps
- Testing focused exclusively on this spec's feature requirements

## Execution Order

Recommended implementation sequence (following order from raw-idea.md):
1. Mobile Safety Mode (Task Group 1)
2. FPS Guardian (Task Group 2)
3. Safe Score System (Task Group 4) - can run parallel with Task Group 3
4. Global Particle Budget System (Task Group 3) - can run parallel with Task Group 4
5. Multi-Tab Protection (Task Group 5)
6. Canvas Crash Resilience (Task Group 6)
7. Firework and Particle Limits (Task Group 7)
8. Session Stability (Task Group 8)
9. Full Logging (Task Group 9)
10. Test Review & Gap Analysis (Task Group 10)

**Note:** Task Groups 3 and 4 can run in parallel as they don't have dependencies on each other. Task Groups 7-9 can also run in parallel after their dependencies are met.

