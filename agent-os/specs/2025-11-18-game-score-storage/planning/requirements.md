# Spec Requirements: Game Score Storage

## Initial Description

Create Prisma schema for game scores, API routes to save scores, and database models for users, games, and scores with proper relationships.

## Requirements Discussion

### First Round Questions

**Q1:** I assume the Score model will have fields like `id`, `userId`, `gameId`, `score` (numeric value), `createdAt`. Should we also include fields like `duration` (game time in seconds), `moves` (number of moves), `level` (level reached), or other game-specific metadata? Or keep it simple with just basic score for now?

**Answer:** Include complete data from the start. For a legendary portal, minimalism here hinders — because each game will have different dynamics.

**Final recommended model:**
- `id`
- `userId`
- `gameId`
- `score` (universal numeric value)
- `duration` (seconds of the run)
- `moves` (for games with movements)
- `level` (for games with progression)
- `metadata` (flexible JSON for unique game data)
- `createdAt`
- `updatedAt`

**Why?** This enables:
- Specific and dynamic rankings
- Epic sharing cards with run details
- Broad statistics (e.g., % of perfect runs, average speed, etc.)
- Rich social feed content — no "dry scores"

**Q2:** I assume `gameId` will be a string (e.g., `'terminal-2048'`) that references the `id` from `lib/games.ts`. Should we create a `Game` model in Prisma to validate references, or just use string and validate in code? Do you prefer keeping games as TypeScript config only or creating a database table?

**Answer:** Do NOT create Game table. The game catalog is extremely stylized, with visual identity, animations, hacker/pixel/neon aesthetics... this lives better in TypeScript, not in the database.

**Use:**
- `gameId: string`
- Validated via config `lib/games.ts`

**Why avoid Game table?**
- Avoids bureaucracy
- Keeps system agile
- Games change constantly, can receive skins, modes, events — all of this is dev config, not DB
- Database only needs to store what's dynamic: score, user, feed

**Q3:** I assume we'll store all scores (complete history) to enable future rankings and statistics. Or do you prefer storing only the best score per user/game? Or both (best score + history)?

**Answer:** Store EVERYTHING (complete history) + also mark the best ones.

**Final decision:**
- Complete history: necessary for analytics, progress, feed, badges, seasonal events
- `isBestScore` flag: useful for quick queries
- Query for "best score per user/game" becomes trivial

This enables generating majestic cards like:
"💥 NEW RECORD! You destroyed your previous PR by 22%."

We don't want a normal site. We want an epic experience.

**Q4:** I assume scores will always require authentication (logged-in user). Or should we allow anonymous/guest scores? If allowing guest, how to uniquely identify (session ID, cookie, etc.)?

**Answer:** Scores ONLY for logged-in users.

Guest doesn't combine with:
- global ranking
- social feed
- shareable images
- badges
- progression system

But if wanted in the future: guest score local using key in localStorage and without leaderboard.

**For now:**
- ✔ Only logged-in users
- ✔ Reduces fraud
- ✔ More social identity
- ✔ Perfect integration with X OAuth

**Q5:** I assume we'll create `POST /api/scores` to save a new score and `GET /api/scores` (with query params to filter by game, user, etc.) to fetch scores. Do we also need endpoints like `GET /api/scores/me` (current user's scores) and `GET /api/scores/:gameId/leaderboard` (ranking by game)? Or start with just POST?

**Answer:** Implement in the first phase:

- **POST /api/scores** - Saves score (with basic validation)
- **GET /api/scores?gameId=xxx** - Lists filtered scores (feed/analytics mode for future)
- **GET /api/scores/leaderboard?gameId=xxx** - Global ranking of the game
- **GET /api/scores/me?gameId=xxx** - Scores of logged-in user

This already enables:
- game page with leaderboard
- profile showing achievements
- social feed
- score sharing card

**Q6:** I assume basic validation (score >= 0, valid gameId, authenticated userId) will be done in this phase, and advanced validation (manipulation prevention, game state verification) will be done in features 5a and 5b. Is that correct, or should we include some additional validation already in this phase?

**Answer:** Basic validation now. Advanced validation later.

**Include now:**
- `score >= 0`
- `duration >= 0`
- `moves >= 0`
- valid `gameId`
- authenticated user
- safe JSON payload

Advanced validation (anti-cheat, game state verification) comes later.

**Q7:** I assume each score will have `id`, `userId`, `gameId`, `score`, `createdAt`, `updatedAt`. Do we need fields like `isBestScore` (flag), `metadata` (JSON for game-specific data), or others?

**Answer:** Yes, essential:

**isBestScore** - Flag for quick query in personal leaderboard.

**metadata (JSON)** - Infinite power for the future:
- map seed
- game mode
- character used
- applied skin
- actions per second
- special statistics

**Visual representations (majestic):**

As requested: escape the obvious. Nothing generic icons like golden trophy, little star, DALL·E rockets, etc.

Instead, the score image will be built with:
- 🎛 Oscilloscope signals of player reaction time
- 📡 Electromagnetic wave representing the run curve
- 🧩 Pixelated fragments of the original board
- 📟 Progress bars in Sci-fi HUD style
- 🔺 Fractal patterns derived from score values

All generated via canvas to avoid "generic AI" aesthetics.

This creativity comes from the data — that's why we need metadata.

### Existing Code to Reference

**Similar Features Identified:**
- **Score Display Component**: `components/games/terminal-2048/ScoreDisplay.tsx` - Shows score and bestScore with theme-aware styling
- **API Route Pattern**: `app/api/users/me/theme/route.ts` - Reference for authentication, validation, and error handling patterns
- **Game Logic**: `lib/games/terminal-2048/game-logic.ts` - Contains score tracking logic currently using localStorage
- **Games Configuration**: `lib/games.ts` - Contains game definitions with `id` field that will be used for `gameId` validation

**Components to potentially reuse:**
- ScoreDisplay component pattern for displaying scores in leaderboards
- Theme-aware styling patterns from existing components

**Backend logic to reference:**
- NextAuth session validation pattern from `/api/users/me/theme`
- Prisma query patterns from existing User model operations
- Error handling and validation patterns from theme API

### Follow-up Questions

No follow-up questions needed. All requirements are clear and comprehensive.

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

N/A - No visual files found in the visuals folder.

## Requirements Summary

### Functional Requirements

**Database Schema:**
- Create `Score` model in Prisma with:
  - `id` (auto-increment primary key)
  - `userId` (foreign key to User, Int)
  - `gameId` (string, validated against `lib/games.ts`)
  - `score` (numeric value, >= 0)
  - `duration` (seconds, >= 0, nullable)
  - `moves` (number, >= 0, nullable)
  - `level` (number, nullable)
  - `metadata` (JSON field for flexible game-specific data)
  - `isBestScore` (boolean flag for quick queries)
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)
- Establish relationship: `User` has many `Score`
- No `Game` model in database (games live in TypeScript config)

**API Endpoints:**
- **POST /api/scores** - Save new score
  - Requires authentication
  - Validates: score >= 0, duration >= 0, moves >= 0, valid gameId, authenticated user, safe JSON
  - Updates `isBestScore` flag if new score is better than previous best
- **GET /api/scores?gameId=xxx** - List filtered scores
  - Optional query params: `gameId`, `userId`, pagination
  - Returns filtered score list
- **GET /api/scores/leaderboard?gameId=xxx** - Global game ranking
  - Returns top scores for a game
  - Supports pagination
- **GET /api/scores/me?gameId=xxx** - Current user's scores
  - Returns scores for authenticated user
  - Optional `gameId` filter
  - Returns best score and history

**Data Storage:**
- Store complete score history (all scores, not just best)
- Mark best scores with `isBestScore` flag for quick queries
- Enable analytics, progress tracking, feed, badges, seasonal events

**Authentication:**
- Scores only for logged-in users (no guest scores)
- All endpoints require NextAuth session validation
- Reduces fraud and enables social features

### Reusability Opportunities

- **ScoreDisplay Component**: Pattern can be reused for leaderboard displays
- **API Route Pattern**: Follow `/api/users/me/theme` pattern for auth, validation, error handling
- **Theme-aware Styling**: Apply existing theme system to score displays and leaderboards
- **Game Configuration**: Use `lib/games.ts` for gameId validation

### Scope Boundaries

**In Scope:**
- Prisma schema for Score model with all specified fields
- API endpoints: POST /api/scores, GET /api/scores, GET /api/scores/leaderboard, GET /api/scores/me
- Basic validation (score >= 0, duration >= 0, moves >= 0, valid gameId, authenticated user)
- Complete score history storage
- `isBestScore` flag management
- Relationship between User and Score models
- Integration with existing authentication system

**Out of Scope:**
- Advanced score validation (anti-cheat, game state verification) - Feature 5b
- Security middleware and rate limiting - Feature 5a
- Leaderboard UI components - Feature 7
- User profile page with score display - Feature 6
- Social feed integration - Feature 12-13
- Image generation for score sharing - Feature 14
- Guest/anonymous score support (future consideration)

### Technical Considerations

**Integration Points:**
- NextAuth session validation for all endpoints
- Prisma ORM for database operations
- `lib/games.ts` for gameId validation
- Existing User model relationship

**Existing System Constraints:**
- User model uses `Int` for `id` (not String)
- Games are defined in TypeScript config, not database
- Follow existing API route patterns from `/api/users/me/theme`

**Technology Preferences:**
- Use Zod for input validation (as per tech stack)
- Follow error handling patterns (generic messages to users, detailed logs server-side)
- Use Prisma for all database operations (no raw SQL)
- Follow RESTful API design principles

**Similar Code Patterns to Follow:**
- Authentication pattern from `app/api/users/me/theme/route.ts`
- Error handling pattern (generic user messages, detailed server logs)
- Prisma query patterns from existing User operations
- TypeScript type safety throughout

**Metadata JSON Structure:**
- Flexible JSON field to support game-specific data:
  - Map seed
  - Game mode
  - Character used
  - Applied skin
  - Actions per second
  - Special statistics
  - Any other game-specific data needed for future features

**Visual Generation (Future Reference):**
- Score images will use canvas-based generation (not generic AI)
- Elements: oscilloscope signals, electromagnetic waves, pixelated fragments, Sci-fi HUD bars, fractal patterns
- All derived from score metadata and game data

