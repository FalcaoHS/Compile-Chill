# Specification: Fase 1 - Canvas Foundation

## Goal

Implement 3 canvas-based systems using 100% procedural rendering (no external images): Drops system with simple physics, Dev Emotes visual system, and Hacker Panel real-time component. Shake functionality is already implemented. All systems must be theme-aware and integrate seamlessly with the existing portal.

## User Stories

- As a developer, I want to see procedural drops falling on the home page that I can click for rewards, so that I have engaging visual feedback and gamification without leaving the dev environment
- As a user, I want to see dev-themed emotes rendered procedurally in the canvas, so that I can express myself with developer humor that matches the platform aesthetic

## Specific Requirements

**Drops System - Procedural Physics**

- Canvas layer positioned above DevOrbsCanvas in same viewport area
- Simple procedural physics (gravity, bounce, rotation) - NO Matter.js dependency
- Four geometric shapes: circle, square, triangle, hexagon - all rendered procedurally
- Four rarity tiers with probability distribution: Common (70%), Uncommon (20%), Rare (8%), Epic (2%)
- Each rarity determines color, size range, glow intensity, and reward value
- Spawn timing: random interval between 40-90 seconds
- Maximum 1 active drop at a time
- Drop lifetime: 12 seconds timeout if not clicked
- Click detection triggers explosion animation with 20-30 particles
- Rewards stored only in client state (no backend persistence)
- Theme-aware colors and glow effects based on active theme

**Home Physics Integration and Shake**

- ✅ Shake functionality already implemented - no development needed
- Verify shake applies Matter.js forces to DevOrbs only (does not affect Drops when Drops are added)
- Ensure shake visual effects (rim vibration, backboard shake) work correctly
- Maintain separation: shake affects DevOrbs physics, Drops remain independent
- ShakeButton component already exists and functional

**Dev Emotes System**

- Canvas-only visual rendering system (no backend or chat integration yet)
- Procedural text rendering with theme-aware styling
- Support emote formats: `</rage>`, `:segfault:`, `404_face_not_found`, `rm -rf lol`, etc.
- Render effects: neon glow, glitch (text duplication with offset), pixelation (for pixel theme), scanlines (optional)
- Font: JetBrains Mono for all emotes
- Structure prepared for future WebSocket chat integration (no actual chat functionality now)
- No message sending or persistence in this phase

**Hacker Panel Real-Time Component**

- Standalone React component `<HackerPanel />` that can be embedded anywhere
- Canvas background layer with animated scanlines, glitch effects, and neon border
- HTML text layer for logs (better performance than canvas text)
- Mix of real logs (from API) and procedural fake logs
- Real log sources: users online count, active games count, recent logins, recent scores
- Fake log generator creates procedural messages like "[INFO] Bug localizado no setor 7"
- New API endpoints: GET `/api/stats/online`, GET `/api/stats/recent-logins`, GET `/api/stats/active-games`
- Endpoints can return mocked data or partial real data from sessions
- Fallback to fake data if API endpoints fail
- Auto-scroll to latest log entry
- Fade-out animation for old log entries (after 30 seconds)
- Blinking cursor indicator
- Available on home page via toggle (hidden by default)
- Maximum 50 log entries (remove oldest when limit reached)

**Canvas Stacking and Integration**

- DevOrbsCanvas: bottom layer (existing Matter.js physics)
- DropsCanvas: middle layer (procedural physics, above DevOrbs)
- HackerPanel: overlay layer (can be toggled, positioned as needed)
- All canvas layers share same viewport dimensions
- No scroll on desktop - everything fits within viewport
- Proper z-index management for layer ordering

**Theme Integration**

- All systems read active theme from ThemeStore
- Colors adapt automatically: primary, accent, text, glow based on theme
- Pixel theme enables pixelation effects (imageSmoothingEnabled: false)
- Neon/Cyber themes use intense glow effects
- Terminal theme uses minimal styling
- Theme changes update all canvas systems in real-time

**Performance Optimization**

- Use requestAnimationFrame for all animation loops
- Double buffering for main canvas layers
- Mobile fallback: reduce particle count by 50%, reduce glow intensity by 50%
- Culling: don't render objects outside viewport
- Cleanup animation frames on component unmount
- Throttle expensive operations (log generation, API calls)

## Visual Design

No visual assets provided. Implementation will follow existing visual patterns from DevOrbsCanvas and game canvases, ensuring consistency with current portal aesthetic.

## Existing Code to Leverage

**DevOrbsCanvas component (`components/DevOrbsCanvas.tsx`)**

- Reference structure for canvas setup, resize handling, and layer management
- Pattern for requestAnimationFrame loop with delta time calculation
- Theme integration using useThemeStore hook
- Avatar clipping and procedural rendering techniques
- Canvas stacking and z-index management approach

**ShakeButton component (`components/ShakeButton.tsx`)**

- ✅ Already implemented - verify integration with DevOrbs works correctly
- Ensure shake does not interfere with Drops system when implemented
- Component is functional and theme-aware

**Canvas animation patterns (game components)**

- Follow requestAnimationFrame pattern from `PongCanvas.tsx`, `StackOverflowDodgeCanvas.tsx`, `BitRunnerCanvas.tsx`
- Use delta time calculation for smooth animations
- Implement proper cleanup in useEffect return functions
- Follow resize handling patterns for responsive canvas

**Theme system (`lib/themes.ts`, `lib/theme-store.ts`)**

- Use getThemeColors() pattern for reading CSS variables
- Apply theme colors to all canvas rendering (neonColor, pixelColor, glitchColor)
- Adapt shadow, glow, and particle effects based on active theme
- Follow existing theme-aware component patterns

**API route patterns (`app/api/users/recent/route.ts`)**

- Follow Next.js API route structure with GET handlers
- Use handleApiError for consistent error handling
- Implement caching strategy (in-memory with TTL) for stats endpoints
- Include fallback data (fake/mocked) when real data unavailable
- Return consistent JSON response format

## Out of Scope

- Backend persistence of drop rewards (client state only)
- Real chat system with WebSocket (only emote rendering infrastructure)
- Drop ranking or leaderboard integration
- Drop sharing functionality
- Real economy or currency system
- Store or inventory management
- Complex sound effects or audio integration
- AI image generation
- Full mobile support (mobile gets simplified fallback only)
- Any functionality beyond Canvas Foundation scope

