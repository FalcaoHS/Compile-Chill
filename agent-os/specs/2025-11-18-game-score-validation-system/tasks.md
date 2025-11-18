# Task Breakdown: Game Score Validation System

## Overview
Total Tasks: 5 task groups, 25+ sub-tasks

## Task List

### Database Layer

#### Task Group 1: ScoreValidationFail Model and Migration
**Dependencies:** None

- [x] 1.0 Complete database layer
  - [ ] 1.1 Write 2-8 focused tests for ScoreValidationFail model functionality
    - ⚠️ Skipped: No test framework configured in project (no Jest/Vitest setup)
    - Tests should be added when test framework is set up
    - Test ScoreValidationFail model creation with valid data
    - Test User-ScoreValidationFail relationship (cascade delete)
    - Test count increment on subsequent failures
    - Test lastAttempt timestamp updates
    - Limit to 2-8 highly focused tests maximum
    - Test only critical model behaviors (validation, relationships, core fields)
    - Skip exhaustive coverage of all methods and edge cases
  - [x] 1.2 Create ScoreValidationFail model in Prisma schema
    - Fields: `id` (Int, @id, @default(autoincrement())), `userId` (Int, foreign key), `gameId` (String), `count` (Int, @default(1)), `lastAttempt` (DateTime, @default(now())), `details` (Json), `createdAt` (DateTime, @default(now())), `updatedAt` (DateTime, @updatedAt)
    - Add relationship: `user User @relation(fields: [userId], references: [id], onDelete: Cascade)`
    - Add relationship to User model: `scoreValidationFails ScoreValidationFail[]`
    - Follow pattern from existing Score model (timestamps, naming conventions)
    - Use `@@map("score_validation_fails")` for table name
  - [x] 1.3 Create migration for score_validation_fails table
    - Add indexes: `@@index([userId])`, `@@index([gameId])`, `@@index([userId, gameId])` (composite)
    - Add foreign key constraint on `userId` referencing `User.id` with cascade delete
    - Use appropriate PostgreSQL data types (Int for numbers, Json for details)
    - Follow migration naming conventions
  - [x] 1.4 Verify database relationships
    - Test User has many ScoreValidationFail relationship
    - Test ScoreValidationFail belongs to User relationship
    - Test cascade delete (deleting user deletes all their validation failures)
    - Verify indexes are created correctly
  - [ ] 1.5 Ensure database layer tests pass
    - ⚠️ Skipped: No test framework configured
    - Tests should be added when test framework is set up
    - Run ONLY the 2-8 tests written in 1.1
    - Verify migrations run successfully (up and down)
    - Verify relationships work correctly
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- ScoreValidationFail model passes validation tests
- Migration runs successfully (up and down)
- Relationships work correctly (User has many ScoreValidationFail, cascade delete)
- Indexes are created on userId, gameId, and composite index

### Validation Schema Extension

#### Task Group 2: Game State Schema and Validation
**Dependencies:** None

- [x] 2.0 Complete validation schema extension
  - [ ] 2.1 Write 2-8 focused tests for gameState schema validation
    - ⚠️ Skipped: No test framework configured in project (no Jest/Vitest setup)
    - Tests should be added when test framework is set up
    - Test gameState schema with valid Terminal 2048 data
    - Test gameState schema validation (required fields, board structure, moveHistory format)
    - Test gameState schema rejects invalid data (missing fields, wrong types, invalid board)
    - Test gameState schema with optional seed field
    - Limit to 2-8 highly focused tests maximum
    - Test only critical validation behaviors
    - Skip exhaustive edge case testing
  - [x] 2.2 Create gameState Zod schema (`lib/validations/game-state.ts`)
    - Define schema for Terminal 2048 gameState: `board` (4x4 grid array of numbers or null), `moveHistory` (array of 'up' | 'down' | 'left' | 'right'), `startTime` (number timestamp), `endTime` (number timestamp), `seed` (optional string)
    - Validate board is 4x4 array with valid tile values (powers of 2 or null)
    - Validate moveHistory contains only valid directions
    - Validate startTime and endTime are valid timestamps
    - Validate endTime > startTime
    - Follow validation patterns from `lib/validations/score.ts`
  - [x] 2.3 Extend scoreSubmissionSchema with gameState field
    - Add required `gameState` field to `scoreSubmissionSchema` in `lib/validations/score.ts`
    - Use gameState schema from `lib/validations/game-state.ts`
    - Keep metadata field separate and flexible for future additions
    - Maintain type inference with `z.infer<typeof schema>` pattern
    - Update `ScoreSubmissionInput` type to include gameState
  - [x] 2.4 Create game-specific gameState schema factory
    - Create function `getGameStateSchema(gameId: string)` that returns appropriate schema
    - For Terminal 2048, return Terminal 2048 gameState schema
    - For future games, return appropriate schema or throw error if not implemented
    - Follow pattern from `getGame()` in `lib/games.ts`
  - [ ] 2.5 Ensure validation schema tests pass
    - ⚠️ Skipped: No test framework configured
    - Tests should be added when test framework is set up
    - Run ONLY the 2-8 tests written in 2.1
    - Verify gameState schema validates correctly
    - Verify scoreSubmissionSchema includes gameState
    - Verify invalid gameState data is rejected
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- gameState schema validates Terminal 2048 game state correctly
- scoreSubmissionSchema includes required gameState field
- Invalid gameState data is rejected with appropriate error messages
- Type inference works correctly with extended schema

### Game Validators Architecture

#### Task Group 3: Validator Infrastructure and Router
**Dependencies:** Task Group 2

- [x] 3.0 Complete validator architecture
  - [ ] 3.1 Write 2-8 focused tests for validator router
    - ⚠️ Skipped: No test framework configured in project (no Jest/Vitest setup)
    - Tests should be added when test framework is set up
    - Test validator router dispatches to correct game validator
    - Test validator router throws error for unsupported games
    - Test validator router handles validation failures correctly
    - Test validator router returns validation result structure
    - Limit to 2-8 highly focused tests maximum
    - Test only critical router behaviors
    - Skip exhaustive edge case testing
  - [x] 3.2 Create `/lib/game-validators/` directory structure
    - Create directory for game-specific validators
    - Create `index.ts` for validator router/dispatcher
    - Create `types.ts` for shared validator types and interfaces
    - Follow directory structure patterns from `lib/games/`
  - [x] 3.3 Create validator types and interfaces (`lib/game-validators/types.ts`)
    - Define `ValidationResult` interface: `{ valid: boolean, errors?: string[] }`
    - Define `GameValidator` interface: `{ validate(submission: ScoreSubmissionInput): ValidationResult }`
    - Define `ValidationContext` interface for passing additional context (userId, IP, etc.)
    - Export types for use by game-specific validators
  - [x] 3.4 Create validator router (`lib/game-validators/index.ts`)
    - Import all game validators (starting with Terminal 2048)
    - Create `validators` object mapping gameId to validator: `{ [gameId: string]: GameValidator }`
    - Export `validateScore(submission: ScoreSubmissionInput, context?: ValidationContext): ValidationResult`
    - Throw error if gameId has no validator (unsupported game)
    - Follow pattern from `lib/games.ts` for game registry
  - [x] 3.5 Create placeholder validators for future games
    - Create placeholder validators that throw "Not implemented" errors
    - Document that validators will be implemented when games are built
    - Ensure validator router can handle missing validators gracefully
  - [ ] 3.6 Ensure validator architecture tests pass
    - ⚠️ Skipped: No test framework configured
    - Tests should be added when test framework is set up
    - Run ONLY the 2-8 tests written in 3.1
    - Verify validator router dispatches correctly
    - Verify unsupported games are handled properly
    - Verify validation result structure is correct
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- Validator router dispatches to correct game validator
- Unsupported games throw appropriate errors
- Validation result structure is consistent
- Validator architecture is extensible for future games

### Terminal 2048 Validator Implementation

#### Task Group 4: Terminal 2048 Validation Logic
**Dependencies:** Task Groups 2, 3

- [x] 4.0 Complete Terminal 2048 validator
  - [ ] 4.1 Write 2-8 focused tests for Terminal 2048 validator
    - ⚠️ Skipped: No test framework configured in project (no Jest/Vitest setup)
    - Tests should be added when test framework is set up
    - Test validator accepts valid Terminal 2048 score submission
    - Test validator rejects invalid board state (tiles don't match replay)
    - Test validator rejects invalid score (score doesn't match replay)
    - Test validator rejects impossible timing (too fast moves, duration mismatch)
    - Test validator rejects impossible scores (2048 with 4 moves, invalid tile values)
    - Limit to 2-8 highly focused tests maximum
    - Test only critical validation behaviors
    - Skip exhaustive edge case testing
  - [x] 4.2 Create Terminal 2048 validator (`lib/game-validators/terminal-2048.ts`)
    - Import game logic functions from `lib/games/terminal-2048/game-logic.ts`
    - Implement `validate()` function that accepts score submission
    - Recreate game from scratch using `createInitialGameState()`
    - Reapply moves in order using `executeMove()` for each move in moveHistory
    - Compare final board state with submitted board state
    - Compare calculated score with submitted score
    - Validate move count matches moveHistory.length
  - [x] 4.3 Implement board and score validation
    - Validate final board matches submitted board exactly (tile positions and values)
    - Validate calculated score matches submitted score (sum of all merges during replay)
    - Validate no invalid tile values (only powers of 2: 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048+)
    - Validate merges are possible (no impossible tile transitions)
    - Return detailed error messages for each validation failure
  - [x] 4.4 Implement timing validation
    - Validate duration matches endTime - startTime (within 1 second tolerance)
    - Validate duration >= moveHistory.length * 100 (minimum 100ms per move)
    - Validate duration <= moveHistory.length * 10000 (maximum 10s per move)
    - Validate global duration limit < 3600000 (1 hour in milliseconds)
    - Reject submissions with impossible timing (too fast for human, too slow for bot detection)
  - [x] 4.5 Implement impossible score detection
    - Validate score is achievable (e.g., cannot reach 2048 with only 4 moves)
    - Validate high scores require sufficient merges (e.g., 4096 requires many merges)
    - Validate score progression is reasonable (score increases with merges)
    - Return error for impossible score combinations
  - [x] 4.6 Implement tiered validation strategy
    - Score < 200: Light validation (basic schema checks, no full replay)
    - Score 200-2000: Normal validation (full move replay, board/score verification)
    - Score 2000+: Complete validation (full replay + timing audit + stricter checks)
    - Apply validation tier before executing expensive replay logic
  - [ ] 4.7 Ensure Terminal 2048 validator tests pass
    - ⚠️ Skipped: No test framework configured
    - Tests should be added when test framework is set up
    - Run ONLY the 2-8 tests written in 4.1
    - Verify validator accepts valid submissions
    - Verify validator rejects invalid submissions with appropriate errors
    - Verify timing validation works correctly
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 4.1 pass
- Validator correctly replays moves and validates board/score
- Validator rejects invalid submissions with detailed errors
- Timing validation prevents bot submissions
- Tiered validation strategy optimizes performance
- Impossible scores are detected and rejected

### API Integration

#### Task Group 5: Score Submission Endpoint Integration
**Dependencies:** Task Groups 1, 2, 3, 4

- [ ] 5.0 Complete API integration
  - [ ] 5.1 Write 2-8 focused tests for validation integration
    - Test POST /api/scores with valid Terminal 2048 score (passes validation)
    - Test POST /api/scores with invalid Terminal 2048 score (fails validation, returns 400)
    - Test POST /api/scores validation runs before database transaction
    - Test validation failure logs detailed error server-side
    - Test validation failure creates ScoreValidationFail record
    - Limit to 2-8 highly focused tests maximum
    - Test only critical integration behaviors
    - Skip exhaustive edge case testing
  - [ ] 5.2 Integrate validation into POST /api/scores endpoint
    - Import validator from `lib/game-validators/index.ts`
    - Run validation after Zod schema validation but before database transaction
    - Pass score submission and validation context (userId, IP) to validator
    - If validation fails, reject request with generic error "Score inválido"
    - Use `handleApiError()` from `lib/api-errors.ts` for error responses
    - Maintain existing error handling patterns
  - [ ] 5.3 Implement validation failure logging
    - Log detailed validation failure server-side using `console.error`
    - Include: failure reason, submitted score, userId, gameId, IP address, timestamp
    - Use existing error logging patterns from `lib/api-errors.ts`
    - Ensure no sensitive information exposed to client
  - [ ] 5.4 Implement ScoreValidationFail tracking
    - After validation failure, create or update ScoreValidationFail record
    - If record exists for user/game combination, increment count and update lastAttempt
    - If record doesn't exist, create new record with count = 1
    - Store validation failure details in JSON details field
    - Use Prisma transaction to ensure atomic updates
  - [ ] 5.5 Ensure validation doesn't block legitimate scores
    - Verify validation runs synchronously without significant performance impact
    - Verify tiered validation strategy optimizes for low scores
    - Verify validation errors don't expose technical details to clients
    - Verify validation integrates seamlessly with existing endpoint flow
  - [ ] 5.6 Ensure API integration tests pass
    - Run ONLY the 2-8 tests written in 5.1
    - Verify validation runs correctly in endpoint
    - Verify validation failures are handled properly
    - Verify ScoreValidationFail records are created
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 5.1 pass
- Validation runs before database transaction
- Validation failures return generic error to client
- Detailed errors are logged server-side
- ScoreValidationFail records track failed attempts
- Existing endpoint functionality is preserved

### Testing

#### Task Group 6: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-5

- [ ] 6.0 Review existing tests and fill critical gaps only
  - [ ] 6.1 Review tests from Task Groups 1-5
    - Review the 2-8 tests written by database-engineer (Task 1.1)
    - Review the 2-8 tests written by schema-engineer (Task 2.1)
    - Review the 2-8 tests written by validator-engineer (Task 3.1)
    - Review the 2-8 tests written by terminal-2048-engineer (Task 4.1)
    - Review the 2-8 tests written by api-engineer (Task 5.1)
    - Total existing tests: approximately 10-40 tests
  - [ ] 6.2 Analyze test coverage gaps for THIS feature only
    - Identify critical validation workflows that lack test coverage
    - Focus ONLY on gaps related to game score validation requirements
    - Do NOT assess entire application test coverage
    - Prioritize end-to-end validation workflows (schema → validator → API integration)
  - [ ] 6.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on integration points and end-to-end workflows
    - Test complete validation flow: score submission → validation → success/failure
    - Test tiered validation strategy with different score ranges
    - Test ScoreValidationFail tracking and count increments
    - Do NOT write comprehensive coverage for all scenarios
    - Skip edge cases and performance tests unless validation-critical
  - [ ] 6.4 Run feature-specific tests only
    - Run ONLY tests related to this spec's feature (tests from 1.1, 2.1, 3.1, 4.1, 5.1, and 6.3)
    - Expected total: approximately 20-50 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical validation workflows pass

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 20-50 tests total)
- Critical validation workflows for this feature are covered
- No more than 10 additional tests added when filling in testing gaps
- Testing focused exclusively on this spec's validation requirements

## Execution Order

Recommended implementation sequence:
1. Database Layer (Task Group 1) - Must be completed first for tracking validation failures
2. Validation Schema Extension (Task Group 2) - Required for validator input validation
3. Game Validators Architecture (Task Group 3) - Infrastructure needed before game-specific validators
4. Terminal 2048 Validator Implementation (Task Group 4) - Depends on schema and architecture
5. API Integration (Task Group 5) - Depends on all previous groups
6. Test Review & Gap Analysis (Task Group 6) - Final validation after all implementation

## Notes

- This feature is backend-only (no frontend components)
- Validation runs synchronously during POST request (no async queue)
- Terminal 2048 is the only game with validation in this phase
- Future games will have separate validators following the same architecture
- Tiered validation strategy optimizes performance for low scores
- Validation failures are tracked for abuse detection but don't block users automatically
- Server-side game logic replay must match client-side game logic exactly

