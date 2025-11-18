# Specification: MVP Stability Patch

## Goal
Ensure Compile & Chill runs stably, performantly, and securely on any device, especially during launch, by implementing performance monitoring, graceful degradation, score protection, multi-tab coordination, and crash resilience systems.

## User Stories
- As a user, I want the platform to automatically optimize performance on my device so that I can enjoy games without lag or crashes
- As a user, I want my scores to be protected from loss even if my session expires or the network fails so that my achievements are never lost
- As a user, I want the platform to handle errors gracefully so that I never see a broken page even if canvas or physics systems fail

## Specific Requirements

**Mobile Safety Mode (Automatic Lite Mode)**
- Automatically activate when `isMobileDevice()` returns true or `window.innerWidth < 768px`
- Disable Matter.js physics, DevOrbs, drops, fireworks, thematic particles, heavy glow, and animated neon effects
- Keep active: HUD, scoreboard, score display, minimal interaction, static visual parts (court, basket)
- Allow light CSS animations (opacity/transform with will-change) for quality perception without performance cost
- Extend existing `isMobileDevice()` function in `lib/physics/orbs-engine.ts` to return mode state
- Create global mobile mode state accessible to all canvas components and hooks
- Apply mode automatically on component mount and window resize events
- Ensure mode persists across theme switches and page navigation

**FPS Guardian (Intelligent Performance Fallback)**
- Implement three-tier system with hysteresis buffer: Level 0 (FPS ≥ 50) everything enabled, Level 1 (40 ≤ FPS < 50) smooth degradation, Level 2 (FPS < 40) aggressive fallback
- Apply buffer: only change mode if 60-frame average is below/above threshold for 2 seconds to prevent thrashing
- Extend existing FPS monitor in `DevOrbsCanvas.tsx` (lines 1556-1601) for multi-threshold behavior
- Level 1 degradation: reduce particles by half, decrease neon opacity by 50%, reduce glow intensity by 50%, limit fireworks to 3 simultaneous
- Level 2 fallback: disable physics, particles, drops, fireworks; render minimal static frame with theme background
- Export FPS state globally so all canvas components can react to performance levels
- Track FPS history over 60 frames for stable average calculation
- Apply degradation gradually (stop particles first, then physics) rather than all at once

**Safe Score System (Score Loss Protection)**
- Save to `localStorage.pendingScore` as array before sending attempt, with metadata (gameId, score, timestamp, attempt count)
- Retry policy: up to 5 attempts with exponential backoff (1s, 2s, 4s, 8s, 16s) before giving up
- Expiration: pending scores expire after 30 days (remove and notify user via toast)
- Show toast on failure: "Sua pontuação será enviada quando você entrar novamente."
- Show toast on success when pending score is reprocessed: "Pontuação pendente enviada com sucesso!"
- If queue accumulates > 5 items, warn user and offer "baixar/compartilhar" locally as JSON
- Display friendly message if session expires during gameplay: "Sua sessão expirou. Seu score está seguro e será enviado automaticamente quando você fizer login."
- Attempt to send pending scores on login/home page load, integrated with existing score submission in `app/api/scores/route.ts`

**Multi-Tab Protection (CPU Protection and Tab Synchronization)**
- Create exclusive BroadcastChannel named "canvas_control" for cross-tab communication
- Behavior: active tab = owner (runs physics/canvas), other tabs = paused (no physics/canvas loops)
- When owner loses focus, send "relinquish" message; next active tab requests ownership via "request_ownership"
- Optional state sync: only sync critical pending scores (pendingScore) via localStorage or BroadcastChannel, not real-time game state
- Use Page Visibility API (`document.visibilityState`) to pause animations when tab is invisible
- Pause canvas rendering loops, physics updates, and particle systems in non-active tabs
- Integrate with existing canvas components (DevOrbsCanvas, DropsCanvas, EmoteBubble) to respect tab ownership
- Ensure ownership transfer is atomic and prevents race conditions between tabs

**Canvas Crash Resilience (Fallback when Canvas Fails)**
- Wrap `renderFrame()` and `physics.step()` in try/catch blocks in all canvas components
- On exception: stop all animation loops, display message "Visual temporariamente indisponível, reiniciando…", restart canvas after 1 second delay
- Retry up to 3 times with exponential backoff (1s, 2s, 4s) before giving up
- After 3 failures: load fully static fallback (theme background only) and send `canvas_crash` event with stack trace to logging system
- UI: add "Reiniciar visual" button for user to force canvas reload manually
- Gradual degradation: first stop particles, then physics, then entire canvas if needed
- Ensure error boundaries prevent page crashes and maintain user interaction (HUD, buttons) even if canvas fails

**Firework Limit (Firework Particle Control)**
- Default: MAX_FIREWORKS = 6 simultaneous fireworks
- Mobile: MAX_FIREWORKS = 2 simultaneous fireworks
- Particle TTL: ≤ 1200–2000 ms (1.2–2s) — prefer smaller for mobile/GPU performance
- When limit reached, fade out oldest fireworks (opacity transition over 200ms) rather than abrupt removal
- Remove oldest firework when limit exceeded, maintaining FIFO queue
- Integrate with global particle budget system to respect overall limits
- Apply limits in DevOrbsCanvas fireworks system and any other firework implementations

**Global Particle Budget (Particle Budget System)**
- MAX_PARTICLES = 250 total across all systems (fireworks, drops, emotes, theme particles)
- Priority order (high → low): UI critical (score effects) > legendary emotes > fireworks > drops > theme particles
- Distribution: Fireworks 100, Drops 50, Emotes 50, Theme 50
- Graceful degradation: when budget exceeded, reduce theme particles first, then drops, then fireworks (never reduce UI critical or legendary emotes)
- Centralize in utility: `lib/canvas/particleBudget.ts` with global state and allocation functions
- Extend existing hooks (`hooks/useDrops.ts`, `hooks/useEmotes.ts`) to read global particle budget before spawning
- Integrate with DropManager, EmoteManager, and firework systems to respect budget allocations
- Provide real-time budget status to FPS Guardian for performance decisions

**Session Stability (NextAuth)**
- Database session already exists ✅ — extend with proactive renewal logic
- Proactive renewal: if `session.expires < now + 24h` (or default updateAge), attempt silent renewal via refresh token or server ping
- Toast warning: when `session.expires < 2 min` during gameplay, show soft warning with "Renovar sessão" button (redirect to login flow)
- Score retry: integrated with Safe Score System to retry pending scores after session renewal
- Hook retry and proactive refresh in `auth.config.ts` session callbacks
- Ensure renewal attempts don't interrupt gameplay or cause visible UI flicker
- Log session renewal attempts and failures to monitoring system

**Full Logging (Light Mode)**
- Log only critical events: FPS low events (when dropping below thresholds), canvas crash events (with stack traces), score save failures, multi-tab warnings
- Additional metrics (anonymized, no user data): `session_duration` (buckets: <1m, 1–5m, 5–15m, >15m), `device_class` (desktop / mobile / tablet), `first_paint` / `time_to_interactive` (lightweight, for load problem detection)
- All logging anonymized and optional; never track sensitive user data, personal information, or game content
- Send logs to console in development, prepare for future analytics service integration
- Log format: structured JSON with event type, timestamp, device class, and relevant metrics only

## Visual Design

No visual assets provided. UI elements should follow existing theme-aware styling patterns. Toast notifications should use existing TailwindCSS components with theme colors. Error messages and fallback states should maintain visual consistency with the rest of the application.

## Existing Code to Leverage

**Canvas Rendering Patterns (`components/DevOrbsCanvas.tsx`)**
- requestAnimationFrame loop structure and cleanup patterns
- FPS monitoring implementation (lines 1556-1601) with history tracking and average calculation
- Theme color extraction from CSS variables using `getThemeColors()` pattern
- Canvas error handling and fallback rendering patterns
- Mobile detection and responsive sizing logic

**Physics Configuration (`lib/physics/orbs-engine.ts`)**
- `isMobileDevice()` function for mobile detection (extend to return mode state)
- `getPhysicsConfig()` function for device-based configuration (extend with disablePhysics flag)
- Physics engine creation and update patterns
- Mobile optimization patterns (timeScale, reduced gravity, friction adjustments)

**Particle Management (`lib/canvas/drops/DropManager.ts`, `lib/canvas/drops/Drop.ts`)**
- Particle lifecycle management (spawn, update, cull)
- Particle array management and limits
- Theme-aware particle rendering patterns
- Performance optimization patterns (particle limits, culling)

**Score Submission (`app/api/scores/route.ts`)**
- Score submission API endpoint structure
- Error handling patterns with `handleApiError`
- Rate limiting integration
- Prisma transaction patterns for score storage

**Session Management (`auth.config.ts`, `lib/auth-adapter.ts`)**
- NextAuth database session configuration
- Session callback patterns for user data
- Session expiration and renewal logic
- Error handling for authentication failures

## Out of Scope
- Real-time score synchronization between tabs (only pending scores synced via localStorage)
- Complex analytics dashboard or user-facing performance metrics display (logging is internal only)
- Automatic device performance profiling beyond FPS monitoring (no CPU/GPU profiling)
- Cross-device session synchronization (sessions are device-specific)
- Advanced particle effects beyond budget management (no new particle types)
- Sound effects or audio system integration
- User-controlled performance mode selection (automatic only)
- Performance metrics export or download functionality
- Real-time multiplayer features or cross-tab game state sync
- Advanced error recovery beyond canvas fallback (no automatic code updates or hot-reloading)

