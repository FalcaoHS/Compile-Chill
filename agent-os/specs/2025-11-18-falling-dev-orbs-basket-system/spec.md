# Specification: Falling Dev Orbs + Basket System

## Goal
Transform the Compile & Chill home page into an interactive, playful experience where recently logged-in users appear as physics-based "Dev Orbs" that fall from the top, can be dragged and thrown, and can be scored into a neon basketball basket at the top center. The feature creates a sense of community, activity, and controlled "dev chaos" while maintaining theme-aware styling across all 5 visual themes.

## User Stories
- As a user, I want to see recently active users as interactive orbs on the home page so that I feel the platform is alive and active
- As a user, I want to interact with the orbs by dragging and throwing them so that I can have fun and attempt to score them in the basket
- As a user, I want visual feedback when I score an orb in the basket so that I feel rewarded for my interaction

## Specific Requirements

**Physics Engine Integration**
- Use Matter.js library for physics simulation (gravity, bounce, friction, collisions)
- Configure gravityY between 1.2-1.6 for natural falling motion
- Set restitution (elasticity) to 0.6-0.8 for "perereca" (bouncy ball) effect
- Enable collisions between orbs for realistic interactions
- Create invisible side walls and bottom floor boundaries
- Implement low-power mode for mobile devices to maintain performance
- Support drag and throw mechanics with angle and force calculation
- Ensure physics area fits within viewport (viewportHeight - headerHeight) with no scroll

**Dev Orbs Rendering**
- Display up to 10 circular orbs (64-96px diameter) with user avatars
- Render rounded avatar images inside each orb
- Apply theme-aware neon/pixel borders based on current theme
- Spawn orbs sequentially: 1 per second until 10 total
- Spawn at top with random horizontal position within canvas bounds
- Orbs fall smoothly with physics and can interact immediately on spawn
- Support catching orbs mid-air and throwing them with drag-and-release gesture
- Limit maximum orbs to 10 to maintain performance

**Basket System**
- Position basket fixed at top center, below header (not above)
- Ensure basket hitbox does not touch header to prevent accidental scrolling
- Render basket with theme-aware styling (pixel/neon depending on theme)
- Detect collision when orb enters basket interior area
- Trigger visual effects on successful basket hit (fireworks, particles, glow)
- Display HUD message "Você acertou o DevBall!" on successful hit
- Animate basket with micro "shake" animation on hit
- Limit to 1-2 firework effects simultaneously for performance

**Visual Effects System**
- Create theme-aware fireworks/particles on basket hit
- Cyber Hacker theme: green balls with glitch, scanlines on basket, matrix rain fireworks
- Pixel Lab theme: 8-bit balls, pixel square fireworks, NES-style basket
- Neon Future theme: super bright balls, neon trail, basket with bloom effect
- Terminal theme: ASCII '()' balls, basket with #### border, random character fireworks
- Keep effects lightweight and contained within canvas (no scroll expansion)
- Disable shadows on mobile devices for performance
- Fallback to static images if FPS drops below 40

**Home Page Integration**
- Replace hero section (logo/title) with physics area
- Maintain game grid below physics area, intact
- Calculate physics area height dynamically: viewportHeight - headerHeight
- Ensure no vertical scroll on desktop
- Keep header fixed at top
- Layout structure: [Header] → [Basket + Physics Area] → [Game Grid]

**User Data Endpoint**
- Create `/api/users/recent` endpoint returning last 10 users logged in within 5 minutes
- Return fields: avatar, userId, lastLogin, username
- Implement cache with 5-10 second TTL to reduce database load
- Always return maximum 10 users (never more to prevent layout issues)
- Fallback to 5-10 fake styled profiles if no real users available
- Use Prisma to query users ordered by last login time
- Follow existing API patterns from `/api/users/me/route.ts`
- Use `handleApiError` for consistent error handling

**Mobile Optimizations**
- Maintain physics and interactivity on mobile (no simplified version)
- Automatically disable shadows on mobile devices
- Reduce particle count for firework effects
- Limit FPS to maintain smooth performance
- Use smaller sprite sizes (64px instead of 96px)
- Reduce elasticity slightly to reduce physics chaos
- Simplify gestures: drag = pull to throw (no complex multi-touch)
- Ensure physics area fits between header and grid without scroll

**Theme Integration**
- Use existing theme system (`lib/theme-store.ts`, `lib/themes.ts`)
- Apply theme colors via CSS variables for all visual elements
- Use `applyThemeToCanvas` utility for canvas theme application
- Support real-time theme switching without physics reset
- Apply theme-specific visual variants for orbs, basket, and effects
- Use Tailwind theme tokens for container styling

**Performance & Constraints**
- Maximum 10 orbs at any time
- Maximum 1-2 firework effects simultaneously
- Monitor FPS and fallback to static images if FPS < 40
- Use requestAnimationFrame for rendering loop (60 FPS target)
- Optimize particle systems with culling (remove dead particles)
- Ensure canvas never causes page scroll
- Use responsive canvas sizing that adapts to viewport

## Visual Design

No visual assets provided. Design should follow theme-aware styling patterns from existing games, with orbs representing user avatars in circular containers with neon/pixel borders, and basket positioned prominently at top center.

## Existing Code to Leverage

**Canvas Rendering Patterns (`components/games/bit-runner/BitRunnerCanvas.tsx`, `components/games/dev-pong/PongCanvas.tsx`)**
- Canvas component structure with useRef, requestAnimationFrame loop, and theme color system
- Theme color extraction from CSS variables using `getThemeColors()` pattern
- Responsive canvas sizing with device pixel ratio handling
- 60 FPS optimization patterns and performance monitoring
- Particle system management with lifecycle (life, maxLife, size) and culling

**Theme System (`lib/theme-store.ts`, `lib/themes.ts`, `lib/theme-utils.ts`)**
- Theme store using Zustand for global theme state
- CSS variable system for theme colors
- `applyThemeToCanvas` utility for canvas theme application
- `getThemeColor` function for accessing theme color values
- Real-time theme switching support

**API Route Patterns (`app/api/users/me/route.ts`, `app/api/users/[id]/route.ts`)**
- API route structure with Next.js App Router
- Authentication patterns using `withAuth` utility
- Error handling with `handleApiError` for consistent responses
- Prisma query patterns for user data retrieval
- Response formatting with proper status codes

**Particle Effects (`components/games/dev-pong/PongCanvas.tsx`, `components/games/hack-grid/HackGridCanvas.tsx`)**
- Particle array management with lifecycle tracking
- Particle rendering with fading opacity
- Performance-optimized particle limits (max 30)
- Particle culling for dead particles
- Glow effects using ctx.shadowBlur and ctx.shadowColor

**Home Page Structure (`app/page.tsx`)**
- Current home page layout with hero section and game grid
- Theme-aware styling using Tailwind tokens
- Responsive design patterns
- Integration with Header component

## Out of Scope
- XP system or experience points for basket hits
- Badge system or achievement unlocks
- Leaderboards for basket scoring
- Sound effects (optional, muted by default - not implementing audio system)
- Zoom functionality for canvas
- User-controlled canvas resizing
- Vertical viewport movement or scrolling
- Multiple basket positions or basket customization
- Mass drop events (all orbs at once - future feature)
- Advanced reward system with coins, rare drops, or emotes (V2 feature)
- Backend endpoint for registering basket hits (optional feature mentioned but not in MVP)
- User profile integration for tracking basket scores

