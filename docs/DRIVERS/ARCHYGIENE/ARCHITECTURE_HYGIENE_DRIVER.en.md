🧼 Architecture Maintenance & Hygiene — Official Guide

Author: Hudson "Shuk" Falcão
Date: November 19, 2025
Version: 2.0
Purpose: Ensure all implemented and planned features are organized, documented, and consistent with the project's overall architecture — preparing the ground for contributors, new themes, optimizations, and future expansion.

🎯 How it works

This document is a DRIVER to maintain and organize the Compile & Chill architecture using AI or manual review.
Simply provide this complete document to an AI agent.
The agent will:

✅ Review entire folder and file structure
✅ Identify files in wrong locations or with incorrect names
✅ Check and fix broken references
✅ Organize modules according to recommended architecture
✅ Create/update technical documentation
✅ Standardize names and conventions
✅ Validate that everything is aligned

🤖 IMPORTANT: Instructions for AI Agent

**⚠️ MANDATORY RULES - AGENT MUST FOLLOW EXACTLY:**

1. **The agent MUST ask questions before moving/reorganizing files!**
   - NEVER move files without asking first
   - NEVER assume what the user wants
   - ALWAYS ask before executing any reorganization action

2. **The agent MUST analyze completely before acting!**
   - ALWAYS map all files first
   - ALWAYS identify problems before fixing
   - NEVER make changes without understanding full context

3. **The agent MUST check references before moving files!**
   - ALWAYS check imports and references
   - ALWAYS update broken references
   - NEVER move files without updating references

4. **The agent MUST follow complete flow!**
   - Don't skip any step
   - Don't assume answers
   - Always wait for user confirmation
   - Always generate report of changes

**The agent should NEVER:**
- ❌ Move files without asking first
- ❌ Reorganize without complete analysis
- ❌ Break references when moving files
- ❌ Skip validation steps
- ❌ Assume what the user wants
- ❌ Make changes without generating report

**Expected flow (MANDATORY to follow):**
1. Agent analyzes current structure completely
2. Agent identifies problems and files in wrong locations
3. Agent asks user about proposed changes
4. Agent reorganizes files (if authorized)
5. Agent updates broken references
6. Agent creates/updates documentation
7. Agent validates everything is aligned
8. Agent generates complete report of changes

---

When processing this driver, the agent MUST:

1. **Analyze current structure**:
   - Map all files and folders
   - Identify files in wrong locations
   - Detect incorrect or inconsistent names
   - Check for broken references

2. **Reorganize files** (if necessary):
   - Move files to correct folders
   - Fix file names (kebab-case)
   - Remove empty folders
   - Consolidate duplicated code

3. **Create/update documentation**:
   - Create missing technical docs
   - Update READMEs
   - Add JSDoc comments where needed
   - Ensure docs are up to date

4. **Validate structure**:
   - Verify all modules are organized
   - Confirm conventions are being followed
   - Ensure no broken references
   - Validate architecture is coherent

5. **Generate report**:
   - List changes made
   - Document organization decisions
   - Create validation checklist

🔍 1. Folder Structure — Diagnosis & Recommendation

### ✅ Current Structure Detected

```
app/
  api/
    auth/
    scores/
    users/
    stats/
  jogos/
  profile/
components/
  games/
  profile/
  rankings/
  hacker-panel/
lib/
  canvas/
    drops/
    emotes/
    hacker-panel/
  performance/
  physics/
  games/
  game-validators/
hooks/
```

### ❗ Common Problems After Many Features

- Canvas files mixed in different locations
- Engines and managers separated (physics, drops, emotes) in inconsistent folders
- Light logic duplication
- Theme models scattered
- Missing docs per folder
- Some files grew too large (DevOrbsCanvas.tsx)

### ✅ Suggested Reorganization (doesn't break anything)

```
/lib
  /auth
    auth.ts
    auth-adapter.ts
    auth-env-validation.ts
    middleware-auth.ts
  /canvas
    /core
      render-loop.ts
      background-renderer.ts
      orb-renderer.ts
    /physics
      orbs-engine.ts
      collisions.ts
    /decorative-objects
      theme-objects.ts
      object-renderer.ts
    /orb-renderers
      theme-orb-variations.ts
      indiana-jones-orb.ts
      star-wars-orb.ts
    /effects
      fireworks.ts
      particles.ts
    /drops
      Drop.ts
      DropManager.ts
      drop-config.ts
    /emotes
      EmoteRenderer.ts
      EmoteManager.ts
      emote-types.ts
    /hacker-panel
      log-generator.ts
  /performance
    fps-guardian.ts
    mobile-mode.ts
    particle-budget.ts
    canvas-crash-resilience.ts
    multi-tab.ts
    session-stability.ts
  /theme
    themes.ts
    theme-store.ts
    theme-utils.ts
    /themes (if needed to separate by file)
  /games
    (keep current structure)
  /game-validators
    (keep current structure)
  /utils
    rate-limit.ts
    api-errors.ts
    api-rate-limit.ts

/components
  /canvas
    DevOrbsCanvas.tsx
    DropsCanvas.tsx
  /ui
    ThemeSwitcher.tsx
    Toast.tsx
    GameCard.tsx
  /profile
    (keep current structure)
  /games
    (keep current structure)
  /layout
    Header.tsx
    Footer.tsx

/hooks
  useDrops.ts
  useEmotes.ts
  useSafeScore.ts
  useHackerPanel.ts
```

### Benefits

- New contributor → understands everything in 10 min
- New theme → only touches `/lib/theme` and `/lib/canvas`
- Orbs, objects, particles → organized
- DevOrbsCanvas can stay clean (delegate to handlers)

⚙️ 2. Documentation that Needs to be Created/Adjusted

### ☑ Create in `/docs/`

- [ ] `docs/architecture/canvas-architecture.md` - Canvas system architecture
- [ ] `docs/architecture/performance-engine.md` - Performance system
- [ ] `docs/architecture/physics-system.md` - Physics system
- [ ] `docs/architecture/auth-flow.md` - Authentication flow
- [ ] `docs/architecture/scores-anti-cheat.md` - Scores and anti-cheat system
- [ ] `docs/architecture/mobile-modes.md` - Mobile modes (lite/full)
- [ ] `docs/contributing.md` - Contribution guide (update)
- [ ] `docs/theme-style-guide.md` - Theme style guide

### Missing Technical Explanations for:

- FPS Guardian
- Mobile Mode (lite/full)
- Particle Budget (global)
- Fireworks Manager
- Decorative Objects System
- Orb Variations System
- Drops Engine
- Emotes Bubble Engine
- Easter Egg System
- Multi-tab Protection
- Safe Score System
- Canvas Crash Resilience

**These docs are essential for contributors.**

🧮 3. Modules that Need Alignment or Cleanup

### 🔥 Canvas (most complex)

**Problem**: `DevOrbsCanvas.tsx` is too large

**Solution**: Separate into submodules:

- Render loop → `/lib/canvas/core/render-loop.ts`
- Physics update → `/lib/canvas/physics/orbs-engine.ts`
- Background decorator → `/lib/canvas/core/background-renderer.ts`
- Orb renderer → `/lib/canvas/core/orb-renderer.ts`
- Fireworks → `/lib/canvas/effects/fireworks.ts`
- Drops → already organized in `/lib/canvas/drops/`
- Emotes → already organized in `/lib/canvas/emotes/`
- Theme objects → `/lib/canvas/decorative-objects/theme-objects.ts`
- Event triggers → `/lib/canvas/core/event-triggers.ts`

### 🧠 Themes

**Standardization needed**:

- All themes should be in `/lib/theme/themes.ts` (or separated in `/lib/theme/themes/*.ts`)
- Standardize structure:
  - `id` (kebab-case)
  - `colors` (standardized object)
  - `orb variations` (if applicable)
  - `objects` (decorative objects)
  - `effects` (special effects)
  - `easter eggs` (if applicable)

### 🚀 Drops & Emotes

**Status**: Already organized, but verify:

- [ ] Classes are in `/lib/canvas/drops/` and `/lib/canvas/emotes/`
- [ ] Documentation is complete
- [ ] Types are exported correctly

### 👤 Auth

**Necessary actions**:

- [ ] Create doc with callback flow
- [ ] Review signIn callback
- [ ] Implement failure logging (if it doesn't exist)

### 🏅 Scores

**Necessary documentation**:

- [ ] Explain safe-score-system
- [ ] Document retry logic
- [ ] Explain local fallback
- [ ] Document anti-cheat rules

### ⚡ Performance

**Necessary actions**:

- [ ] Create single doc for mobile-mode + fps-guardian + particle-budget
- [ ] Standardize thresholds
- [ ] Ensure they're being called in the right place

🛡️ 4. Points that Should be Reviewed in Code

### 🔧 1. Rate Limiting

**Action**: Ensure all sensitive endpoints use rate limiter:

- [ ] `/api/scores` - use rate limiter
- [ ] `/api/auth` - use rate limiter
- [ ] `/api/users/recent` - use rate limiter
- [ ] `/api/stats` - use rate limiter

**Solution**: Create centralized `/lib/rate-limit.ts` (already exists, verify usage)

### 🔧 2. Session Stability

**Status**: NextAuth database sessions → ok

**Suggested improvements**:

- [ ] Implement auto-renew
- [ ] Toast warning if expires
- [ ] Automatic retry

### 🔧 3. Multi-tab Protection

**Verify**: If BroadcastChannel is integrated in:

- [ ] DevOrbsCanvas
- [ ] Drops
- [ ] Emotes

**File**: `/lib/performance/multi-tab.ts` (already exists, verify integration)

### 🔧 4. Canvas Crash Resilience

**Ensure**:

- [ ] try/catch in all render loops
- [ ] Static fallback if canvas fails
- [ ] Failure counter

**File**: `/lib/performance/canvas-crash-resilience.ts` (already exists, verify usage)

⭐ 5. Recommended Adjustments to Current Documentation

### You should update:

#### `/README.md`

**Add**:

- Main features
- How to run
- How to contribute
- Links to docs

#### `/docs/contributing.md`

**Needs**:

- How to create themes
- How to create games
- How to add Easter Eggs
- How to make organized commits

🧭 6. Files that Should be Moved

### To `/lib/canvas/core/`:

- [ ] Main loop from DevOrbsCanvas
- [ ] Render functions (drawBackground, drawOrbs, etc.)
- [ ] Event triggers (baskets, rim hits, ground hits)

### To `/lib/canvas/physics/`:

- [ ] `orbs-engine.ts` (already exists, verify if complete)
- [ ] `collisions.ts` (create if doesn't exist)

### To `/lib/canvas/decorative-objects/`:

- [ ] Objects by theme
- [ ] Functions `drawXThemeObject`

### To `/lib/canvas/orb-renderers/`:

- [ ] Functions `drawThemeOrb`
- [ ] Orb variations by theme
- [ ] Special orb effects

### To `/lib/performance/`:

- [ ] `fps-guardian.ts` (already exists)
- [ ] `mobile-mode.ts` (already exists)
- [ ] `particle-budget.ts` (already exists)
- [ ] Verify if there are throttle/utilities functions that should be here

🧼 7. Things that Should be Standardized

### Naming Conventions

- [ ] **Themes**: kebab-case (`indiana-jones`, `star-wars`)
- [ ] **Functions**: camelCase (`drawThemeOrb`, `handleCollision`)
- [ ] **Files**: kebab-case (`theme-utils.ts`, `fps-guardian.ts`)
- [ ] **Components**: PascalCase (`DevOrbsCanvas.tsx`, `ThemeSwitcher.tsx`)
- [ ] **Exports**: Use named exports (avoid default exports)
- [ ] **Comments**: JSDoc for public functions

### Code Structure

- [ ] Organized imports (external → internal → relative)
- [ ] Well-defined TypeScript types
- [ ] Documented interfaces
- [ ] Small, focused functions

🚀 8. Post-Organization Validation Checklist

After the agent organizes the architecture, verify:

- [ ] All files are in correct folders
- [ ] File names follow kebab-case pattern
- [ ] Function names follow camelCase pattern
- [ ] Components follow PascalCase pattern
- [ ] No broken references
- [ ] Documentation is updated
- [ ] READMEs are complete
- [ ] Imports are correct
- [ ] TypeScript types are defined
- [ ] No duplicated code
- [ ] Empty folders were removed
- [ ] Conventions are being followed

🔗 Useful References

- Current structure: `lib/`, `components/`, `hooks/`
- Theme documentation: `docs/DRIVERS/THEME_CREATION/THEME_CREATION_DRIVER.en.md`
- Specifications: `agent-os/specs/`
- Performance: `lib/performance/`
- Canvas: `lib/canvas/`

📋 Conclusion

The Compile & Chill architecture is on the right track.

But now, with:
- 10+ games
- 12+ themes
- Advanced canvas
- Physics
- Drops
- Emotes
- Easter eggs
- Mobile mode
- FPS guardian
- Score system
- Performance engine

…the project needs:

✅ **Organization** - Files in the right place
✅ **Docs** - Complete technical documentation
✅ **Standardization** - Consistent conventions

This driver ensures everything stays organized and ready for future growth.

