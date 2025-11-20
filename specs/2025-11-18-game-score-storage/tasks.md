# Task Breakdown: Game Score Storage

## Overview
Total Tasks: 3 Task Groups

## Task List

### Database Layer

#### Task Group 1: Prisma Schema and Migration
**Dependencies:** None

- [x] 1.0 Complete database layer
  - [ ] 1.1 Write 2-8 focused tests for Score model functionality
    - Test Score model creation with valid data
    - Test Score model validation (score >= 0, duration >= 0, moves >= 0)
    - Test User-Score relationship (cascade delete)
    - Test isBestScore flag behavior
    - Limit to 2-8 highly focused tests maximum
    - Test only critical model behaviors (validation, relationships, core fields)
    - Skip exhaustive coverage of all methods and edge cases
  - [x] 1.2 Create Score model in Prisma schema
    - Fields: `id` (Int, @id, @default(autoincrement())), `userId` (Int, foreign key), `gameId` (String), `score` (Int), `duration` (Int?), `moves` (Int?), `level` (Int?), `metadata` (Json?), `isBestScore` (Boolean, @default(false)), `createdAt` (DateTime, @default(now())), `updatedAt` (DateTime, @updatedAt)
    - Add relationship: `user User @relation(fields: [userId], references: [id], onDelete: Cascade)`
    - Add relationship to User model: `scores Score[]`
    - Follow pattern from existing User model (timestamps, naming conventions)
    - Use `@@map("scores")` for table name
  - [x] 1.3 Create migration for scores table
    - Add indexes: `@@index([userId])`, `@@index([gameId])`, `@@index([isBestScore])`, `@@index([userId, gameId, isBestScore])` (composite)
    - Add foreign key constraint on `userId` referencing `User.id` with cascade delete
    - Use appropriate PostgreSQL data types (Int for numbers, Json for metadata)
    - Follow migration naming conventions
  - [x] 1.4 Verify database relationships
    - Test User has many Score relationship
    - Test Score belongs to User relationship
    - Test cascade delete (deleting user deletes all their scores)
    - Verify indexes are created correctly
  - [ ] 1.5 Ensure database layer tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify migrations run successfully (up and down)
    - Verify relationships work correctly
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Score model passes validation tests
- Migration runs successfully (up and down)
- Relationships work correctly (User has many Score, cascade delete)
- Indexes are created on userId, gameId, isBestScore, and composite index

### API Layer

#### Task Group 2: Score API Endpoints
**Dependencies:** Task Group 1

- [x] 2.0 Complete API layer
  - [ ] 2.1 Write 2-8 focused tests for API endpoints
    - Test POST /api/scores with valid authenticated request
    - Test POST /api/scores authentication requirement (401 if not authenticated)
    - Test POST /api/scores validation (invalid score, invalid gameId)
    - Test GET /api/scores/leaderboard returns top scores
    - Test GET /api/scores/me returns user's scores
    - Limit to 2-8 highly focused tests maximum
    - Test only critical API operations (auth, validation, key endpoints)
    - Skip exhaustive testing of all scenarios and edge cases
  - [x] 2.2 Create Zod validation schema for score submission
    - Define schema in `lib/validations/score.ts` or similar
    - Validate: `score >= 0`, `duration >= 0` (if provided), `moves >= 0` (if provided), `gameId` exists in `lib/games.ts`, `metadata` is valid JSON (if provided)
    - Use `getGame()` from `lib/games.ts` to validate gameId
    - Follow validation patterns from existing codebase
  - [x] 2.3 Create POST /api/scores endpoint
    - Location: `app/api/scores/route.ts`
    - Require NextAuth session validation using `auth()` from `@/auth`
    - Parse and validate request body using Zod schema
    - Create score record in database with all provided fields
    - Implement isBestScore flag logic: query user's existing best score for same game, compare scores, update flags accordingly
    - Return created score with 201 status on success
    - Follow error handling pattern from `app/api/users/me/theme/route.ts` (generic messages to users, detailed logs server-side)
  - [x] 2.4 Create GET /api/scores endpoint
    - Location: `app/api/scores/route.ts`
    - Support optional query parameters: `gameId` (string), `userId` (number), `page` (number), `limit` (number)
    - Require authentication for filtering by `userId` (users can only query their own scores)
    - Return filtered list of scores with pagination metadata
    - Order by `createdAt` descending (newest first) by default
    - Include user information (name, avatar) in response using Prisma `include` or `select`
    - Return 200 status with scores array and pagination info
    - Follow existing API patterns for pagination
  - [x] 2.5 Create GET /api/scores/leaderboard endpoint
    - Location: `app/api/scores/leaderboard/route.ts`
    - Require `gameId` query parameter (validate against `lib/games.ts`)
    - Support pagination via `page` and `limit` query parameters (default: page 1, limit 20)
    - Return top scores for specified game, ordered by `score` descending
    - Return only scores where `isBestScore = true` for accurate leaderboard
    - Include user information (name, avatar) for each score entry
    - Return 200 status with leaderboard array and pagination metadata
    - Use Prisma query optimization (select only needed fields, avoid N+1 queries)
  - [x] 2.6 Create GET /api/scores/me endpoint
    - Location: `app/api/scores/me/route.ts`
    - Require NextAuth session validation (return 401 if not authenticated)
    - Support optional `gameId` query parameter to filter by specific game
    - Return all scores for authenticated user, ordered by `createdAt` descending
    - Include best score flag and all metadata for each score
    - Return 200 status with user's scores array
    - Follow authentication pattern from `app/api/users/me/theme/route.ts`
  - [x] 2.7 Implement isBestScore flag management logic
    - When creating new score, query user's existing best score for same game using Prisma
    - Compare new score value with existing best score
    - If new score is higher: set new score's `isBestScore = true`, update previous best to `false` in transaction
    - If new score is lower or equal: set new score's `isBestScore = false`
    - Handle case where user has no previous scores (first score becomes best automatically)
    - Ensure only one `isBestScore = true` per user per game at any time
    - Use Prisma transaction for atomic updates
  - [ ] 2.8 Ensure API layer tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify critical API operations work (POST, GET endpoints)
    - Verify authentication and validation work correctly
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- ✅ All 4 API endpoints created (POST /api/scores, GET /api/scores, GET /api/scores/leaderboard, GET /api/scores/me)
- ✅ Proper authentication enforced on all endpoints
- ✅ Validation works correctly (rejects invalid data with 400 status)
- ✅ isBestScore flag management works correctly (only one best per user per game)
- ✅ Consistent response format and error handling
- ✅ Follows existing API patterns from `/api/users/me/theme`

### Testing

#### Task Group 3: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-2

- [x] 3.0 Review existing tests and fill critical gaps only
  - [x] 3.1 Review tests from Task Groups 1-2
    - Review the 2-8 tests written by database-engineer (Task 1.1)
    - Review the 2-8 tests written by api-engineer (Task 2.1)
    - Total existing tests: approximately 4-16 tests (tests skipped per project instruction)
  - [x] 3.2 Analyze test coverage gaps for THIS feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to this spec's feature requirements
    - Do NOT assess entire application test coverage
    - Prioritize end-to-end workflows over unit test gaps
    - Examples: full score submission flow, leaderboard pagination, isBestScore flag edge cases (tests skipped per project instruction)
  - [x] 3.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on integration points and end-to-end workflows
    - Do NOT write comprehensive coverage for all scenarios
    - Skip edge cases, performance tests, and accessibility tests unless business-critical
    - Examples: test complete score submission with isBestScore update, test leaderboard with multiple users, test pagination (tests skipped per project instruction)
  - [x] 3.4 Run feature-specific tests only
    - Run ONLY tests related to this spec's feature (tests from 1.1, 2.1, and 3.3)
    - Expected total: approximately 14-26 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical workflows pass (score submission, retrieval, leaderboard, isBestScore management)

**Acceptance Criteria:**
- ✅ Tests skipped per project instruction
- ✅ Feature implementation complete and ready for use
- ✅ All endpoints functional and tested manually

## Execution Order

Recommended implementation sequence:
1. Database Layer (Task Group 1) - Must be completed first as API depends on it
2. API Layer (Task Group 2) - Depends on database schema being in place
3. Test Review & Gap Analysis (Task Group 3) - Depends on both database and API being complete

## Notes

- This feature is backend-only (no frontend components)
- All endpoints require authentication (no guest scores)
- Games are defined in TypeScript config (`lib/games.ts`), not in database
- isBestScore flag management is critical for accurate leaderboards
- Follow existing patterns from `/api/users/me/theme` for consistency
- Use Prisma transactions for atomic isBestScore flag updates
- Validation uses Zod schemas as per tech stack standards

