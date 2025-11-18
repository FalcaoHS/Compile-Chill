# Task Group 4: Terminal 2048 Validator Implementation

## Summary
Implemented Terminal 2048 validator with move replay, board/score validation, timing constraints, impossible score detection, and tiered validation strategy. Validator is registered in the router and ready for API integration.

## Completed Tasks

### 4.2 Create Terminal 2048 validator (`lib/game-validators/terminal-2048.ts`) ✅
- Created `lib/game-validators/terminal-2048.ts` with Terminal 2048 validator
- Imported game logic functions: `createInitialGameState()`, `executeMove()`, `Direction`, `Board`
- Implemented `validate()` function that accepts `ScoreSubmissionInput` and optional `ValidationContext`
- Recreates game from scratch using `createInitialGameState(0)`
- Reapplies moves in order using `executeMove()` for each move in `moveHistory`
- Compares calculated score with submitted score
- Validates move count matches `moveHistory.length`
- Registered validator in `lib/game-validators/index.ts`

### 4.3 Implement board and score validation ✅
- Validates final board structure: 4x4 grid with powers of 2 or null
- Validates calculated score matches submitted score (from move replay)
- Validates no invalid tile values using `isPowerOfTwo()` helper
- Validates board structure using `isValidBoardStructure()` helper
- Returns detailed error messages for each validation failure:
  - Board structure errors
  - Score mismatch errors
  - Move count mismatch errors
- Note: Exact board match requires deterministic RNG seed (optional in spec), so we validate structure and score calculation

### 4.4 Implement timing validation ✅
- Validates duration matches `endTime - startTime` (within 1 second tolerance)
- Validates duration >= `moveHistory.length * 100` (minimum 100ms per move)
- Validates duration <= `moveHistory.length * 10000` (maximum 10s per move)
- Validates global duration limit < 3600000ms (1 hour)
- Rejects submissions with impossible timing:
  - Too fast (bot-like behavior)
  - Too slow (unrealistic delays)
  - Duration mismatch with timestamps
- Returns detailed error messages with specific values

### 4.5 Implement impossible score detection ✅
- Validates score is achievable based on move count:
  - Rough heuristic: max reasonable score ≈ `moveCount * 8`
  - 2048 tile requires at least 11 moves
  - 4096 tile requires at least 12 moves
- Validates high scores require sufficient merges
- Validates score progression is reasonable (allows 10% variance for RNG differences)
- Returns detailed error messages for impossible score combinations
- Only runs for complete validation tier (score >= 2000)

### 4.6 Implement tiered validation strategy ✅
- Score < 200: Light validation
  - Basic schema checks (already done by Zod)
  - Board structure validation
  - Basic timing checks
  - No expensive move replay
- Score 200-2000: Normal validation
  - Full move replay
  - Board/score verification
  - Timing validation
  - No impossible score detection
- Score 2000+: Complete validation
  - Full move replay
  - Board/score verification
  - Timing validation
  - Impossible score detection
  - Stricter checks
- Validation tier determined before executing expensive replay logic
- Optimizes performance for low scores

## Additional Implementation

### Move Replay Logic
- `replayMoves()` function recreates game state and replays all moves
- Handles invalid moves gracefully with error messages
- Tracks calculated score from move replay
- Note: Without deterministic RNG seed, exact board match isn't possible, but score calculation is validated

### Error Handling
- All validation errors are collected in array
- Detailed error messages include specific values (scores, durations, move counts)
- Errors are in Portuguese matching existing patterns
- Validation continues through all checks to collect all errors

### Helper Functions
- `isValidBoardStructure()`: Validates 4x4 board with powers of 2 or null
- `isPowerOfTwo()`: Checks if number is power of 2
- `getValidationTier()`: Determines validation tier based on score
- `validateTiming()`: Comprehensive timing validation
- `validateImpossibleScores()`: Detects impossible score combinations
- `replayMoves()`: Replays moves and calculates score

## Files Created/Modified

- `lib/game-validators/terminal-2048.ts` - Terminal 2048 validator implementation
- `lib/game-validators/index.ts` - Registered Terminal 2048 validator

## Next Steps

1. Proceed with Task Group 5: Score Submission Endpoint Integration
2. Validator will be called from POST /api/scores endpoint
3. Validation failures will be logged and tracked in ScoreValidationFail table

## Notes

- Tests (4.1 and 4.7) were skipped per project instruction
- Validator handles non-deterministic RNG by validating score calculation rather than exact board match
- Tiered validation optimizes performance for low scores
- Impossible score detection helps catch obvious cheats
- Timing validation prevents bot submissions
- Error messages are detailed and helpful for debugging

