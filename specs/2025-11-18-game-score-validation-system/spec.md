# Specification: Game Score Validation System

## Goal
Implement server-side validation system that verifies game scores are legitimate by replaying game state transitions, checking for impossible scores, validating timing constraints, and rejecting manipulated submissions to prevent cheating.

## User Stories
- As a developer, I want game score submissions to be validated server-side so that only legitimate scores are accepted and stored
- As a user, I want fair competition so that cheaters cannot manipulate scores and rankings remain accurate

## Specific Requirements

**Game-Specific Validator Architecture**
- Create `/lib/game-validators/` directory with individual validator files per game (starting with `terminal-2048.ts`)
- Implement generic validator router/dispatcher that imports validators and calls `validators[gameId].validate(submission)`
- Each validator exports a `validate()` function that accepts score submission and returns validation result
- Validators are isolated and maintainable, allowing game-specific validation logic without generic universal validator

**Game State Schema Extension**
- Extend `scoreSubmissionSchema` in `lib/validations/score.ts` to include required `gameState` field (separate from metadata)
- `gameState` contains: `board` (4x4 grid array), `moveHistory` (array of directions), `startTime` (timestamp), `endTime` (timestamp), `seed` (optional string)
- Validate gameState structure with Zod schema before passing to game-specific validators
- Keep metadata field flexible for future additions unrelated to validation

**Terminal 2048 Validator Implementation**
- Receive moveHistory from gameState and recreate game from scratch on server using `createInitialGameState()` from game logic
- Reapply moves in exact same order using `executeMove()` function from Terminal 2048 game logic
- Validate final board matches submitted board exactly (tile positions and values)
- Validate calculated score matches submitted score (sum of all merges during replay)
- Validate move count matches moveHistory.length
- Validate merges are possible (no impossible tile transitions, no invalid tile values like 3, 6, 12)
- Validate score is achievable (e.g., cannot reach 2048 with only 4 moves, cannot reach 4096 without sufficient merges)
- Validate timing constraints: minimum 100-150ms per move, maximum 10s per move, global limit < 1h
- Validate duration matches endTime - startTime (within reasonable tolerance)
- Validate duration >= moveHistory.length * minimumTimePerMove to prevent bot submissions

**Tiered Validation Strategy**
- Score < 200: Light validation (basic schema checks, no full replay)
- Score 200-2000: Normal validation (full move replay, board/score verification)
- Score 2000+: Complete validation (full replay + timing audit + stricter checks)
- Apply validation tier before executing validation logic to optimize performance

**Validation Failure Handling**
- Return generic error message "Score inválido" to client (no technical details exposed)
- Log detailed validation failure server-side including: failure reason, submitted score, userId, gameId, IP address, timestamp
- Use `handleApiError()` from `lib/api-errors.ts` for consistent error response format
- Throw validation errors that integrate with existing error handling infrastructure

**ScoreValidationFail Database Table**
- Create Prisma model `ScoreValidationFail` with fields: `id` (Int, auto-increment), `userId` (Int, foreign key), `gameId` (String), `count` (Int, default 1), `lastAttempt` (DateTime), `details` (Json for failure details)
- Add indexes on `userId`, `gameId`, and composite `(userId, gameId)` for query performance
- Track failed validation attempts to detect patterns and potential abuse
- Update count and lastAttempt on subsequent failures for same user/game combination

**Integration with Score Submission Endpoint**
- Integrate validation into existing POST `/api/scores` endpoint in `app/api/scores/route.ts`
- Run validation after Zod schema validation but before database transaction
- If validation fails, reject request before any database writes occur
- Maintain existing error handling patterns and response structure
- Validation runs synchronously during POST request (no async validation queue)

## Visual Design
No visual assets provided.

## Existing Code to Leverage

**Terminal 2048 Game Logic (`lib/games/terminal-2048/game-logic.ts`)**
- Reuse `executeMove()` function to replay moves during validation
- Reuse `moveBoard()` function to validate board transitions
- Reuse `createInitialGameState()` to initialize game state for replay
- Reuse `GameState` interface structure for type safety
- Reuse board operations and merge logic to ensure server-side replay matches client-side exactly

**Score Submission Schema (`lib/validations/score.ts`)**
- Extend existing `scoreSubmissionSchema` with required `gameState` field
- Follow existing Zod validation patterns and error formatting
- Maintain type inference with `z.infer<typeof schema>` pattern
- Use existing `getGame()` validation for gameId verification

**Validation Helper (`lib/validations/validate.ts`)**
- Use existing `validate()` helper function pattern for schema validation
- Follow existing error extraction and formatting from Zod's `error.issues` array
- Integrate with existing validation error handling flow

**Error Handling (`lib/api-errors.ts`)**
- Use `handleApiError()` for consistent error response format
- Use `ApiErrors.badRequest()` for validation failures
- Follow existing error logging patterns (detailed server-side, generic client-side)
- Maintain error code and message consistency

**Score API Endpoint (`app/api/scores/route.ts`)**
- Integrate validation into existing POST handler structure
- Maintain existing authentication and rate limiting via `withAuthAndRateLimit()`
- Follow existing transaction pattern for database operations
- Preserve existing response structure and status codes

## Out of Scope
- Validation for games that don't exist yet (only Terminal 2048 in scope)
- Active anti-cheat system with pattern monitoring and automated bot detection
- Automatic bot detection by timing analysis (deferred to future phase)
- Encrypted RNG seed validation (seed is optional and not validated)
- Visual replay interface for manual auditing of suspicious scores
- Score challenge system using cryptographic hashes for anti-fake verification
- Cryptographic client integrity verification or code signing
- Asynchronous validation queue (validation must be synchronous)
- Full validation for very low scores (< 200) - uses light validation instead
- Validation for games with different mechanics than Terminal 2048 (future games will have separate validators)

