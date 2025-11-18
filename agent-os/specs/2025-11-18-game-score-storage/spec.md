# Specification: Game Score Storage

## Goal

Create Prisma schema for game scores, API routes to save and retrieve scores, and establish database relationships between users and scores to enable score tracking, rankings, and future social features.

## User Stories

- As a logged-in user, I want to save my game scores to the database so that my progress is tracked across sessions and devices
- As a logged-in user, I want to view my score history and best scores so that I can track my improvement over time
- As a developer, I want a complete score storage system with flexible metadata so that future features like leaderboards, achievements, and social sharing can be built on this foundation

## Specific Requirements

**Prisma Score Model Schema**
- Create `Score` model with `id` (Int, auto-increment primary key), `userId` (Int, foreign key to User), `gameId` (String, validated against `lib/games.ts`)
- Include numeric fields: `score` (Int, >= 0), `duration` (Int?, >= 0, nullable), `moves` (Int?, >= 0, nullable), `level` (Int?, nullable)
- Add `metadata` field (Json type) for flexible game-specific data (map seed, game mode, character, skin, actions per second, special stats)
- Include `isBestScore` (Boolean, default false) flag for quick best score queries
- Add standard timestamps: `createdAt` (DateTime, default now), `updatedAt` (DateTime, auto-updated)
- Establish relationship: `User` has many `Score` with cascade delete
- Add indexes on `userId`, `gameId`, `isBestScore`, and composite index on `(userId, gameId, isBestScore)` for performance
- Do NOT create `Game` model (games live in TypeScript config `lib/games.ts`)

**POST /api/scores Endpoint**
- Require NextAuth session validation (return 401 if not authenticated)
- Validate request body: `score >= 0`, `duration >= 0` (if provided), `moves >= 0` (if provided), `gameId` exists in `lib/games.ts`
- Validate JSON payload structure and sanitize input
- Create new score record in database with all provided fields
- Check if new score is better than user's previous best for same game
- Update `isBestScore` flag: set new score to `true`, set previous best to `false` if new score is higher
- Return created score object with 201 status on success
- Follow error handling pattern: generic messages to users, detailed logs server-side only

**GET /api/scores Endpoint**
- Support optional query parameters: `gameId` (string), `userId` (number), pagination (`page`, `limit`)
- Require authentication for filtering by `userId` (users can only query their own scores)
- Return filtered list of scores with pagination metadata
- Order by `createdAt` descending (newest first) by default
- Include user information (name, avatar) in response for leaderboard display
- Return 200 status with scores array and pagination info

**GET /api/scores/leaderboard Endpoint**
- Require `gameId` query parameter (validated against `lib/games.ts`)
- Return top scores for specified game, ordered by `score` descending
- Support pagination via `page` and `limit` query parameters (default: page 1, limit 20)
- Include user information (name, avatar) for each score entry
- Return only scores where `isBestScore = true` for accurate leaderboard
- Return 200 status with leaderboard array and pagination metadata

**GET /api/scores/me Endpoint**
- Require NextAuth session validation (return 401 if not authenticated)
- Support optional `gameId` query parameter to filter by specific game
- Return all scores for authenticated user, ordered by `createdAt` descending
- Include best score flag and all metadata for each score
- Return 200 status with user's scores array

**Score Validation Logic**
- Validate `score` is non-negative integer
- Validate `duration` is non-negative integer if provided (nullable)
- Validate `moves` is non-negative integer if provided (nullable)
- Validate `gameId` exists in `GAMES` array from `lib/games.ts` using `getGame()` helper
- Validate `metadata` is valid JSON object if provided
- Reject invalid data with 400 status and clear error message
- Use Zod schema for type-safe validation (as per tech stack standards)

**isBestScore Flag Management**
- When creating new score, query user's existing best score for same game
- Compare new score value with existing best score
- If new score is higher: set new score's `isBestScore = true`, update previous best to `false`
- If new score is lower or equal: set new score's `isBestScore = false`
- Handle case where user has no previous scores (first score becomes best automatically)
- Ensure only one `isBestScore = true` per user per game at any time

**Database Migration**
- Create migration file with descriptive name following Prisma conventions
- Add `Score` table with all specified fields and constraints
- Add foreign key constraint on `userId` referencing `User.id` with cascade delete
- Create indexes on `userId`, `gameId`, `isBestScore`, and composite `(userId, gameId, isBestScore)`
- Use appropriate PostgreSQL data types (Int for numbers, Json for metadata)
- Test migration up and down to ensure reversibility

## Visual Design

No visual assets provided.

## Existing Code to Leverage

**app/api/users/me/theme/route.ts**
- Follow authentication pattern using `auth()` from `@/auth` to get session
- Replicate error handling approach: generic user messages, detailed server logs
- Use same response structure with `NextResponse.json()` and appropriate status codes
- Follow validation pattern: check session exists, parse request body, validate input, update database

**components/games/terminal-2048/ScoreDisplay.tsx**
- Reference theme-aware styling pattern for displaying scores
- Use similar component structure for future leaderboard displays
- Apply `bg-page-secondary`, `border-border`, `text-primary` classes for consistency

**lib/games.ts**
- Use `getGame(gameId)` function to validate `gameId` exists in games configuration
- Reference `Game` interface structure for type safety
- Use `GAMES` array as source of truth for valid game IDs

**prisma/schema.prisma**
- Follow existing model patterns: singular model name, plural table mapping with `@@map()`
- Include standard timestamps (`createdAt`, `updatedAt`) like User model
- Use `Int` for `id` to match User model's `userId` foreign key type
- Follow relationship pattern: `user Score[]` in User model, `user User @relation` in Score model

**lib/games/terminal-2048/game-logic.ts**
- Reference score tracking logic currently using localStorage
- Understand game state structure for future validation (Feature 5b)
- Note how scores are calculated and tracked during gameplay

## Out of Scope

- Advanced score validation (anti-cheat, game state verification) - deferred to Feature 5b
- Security middleware and rate limiting - deferred to Feature 5a
- Leaderboard UI components and visual displays - deferred to Feature 7
- User profile page with score statistics - deferred to Feature 6
- Social feed integration and score sharing - deferred to Features 12-13
- Image generation for score sharing cards - deferred to Feature 14
- Guest/anonymous score support - future consideration, not needed now
- Score deletion or modification endpoints - not required for MVP
- Score aggregation or analytics calculations - can be added later as needed
- Real-time score updates or WebSocket integration - out of scope for this feature

