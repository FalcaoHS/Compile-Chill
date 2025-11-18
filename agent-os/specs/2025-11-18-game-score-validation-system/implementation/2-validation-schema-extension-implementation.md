# Task Group 2: Validation Schema Extension Implementation

## Summary
Created gameState Zod schema for Terminal 2048 and extended scoreSubmissionSchema to include required gameState field. Implemented game-specific schema factory for extensibility.

## Completed Tasks

### 2.2 Create gameState Zod schema (`lib/validations/game-state.ts`) ✅
- Created `lib/validations/game-state.ts` with Terminal 2048 gameState schema
- Defined `directionSchema` for validating move directions ('up', 'down', 'left', 'right')
- Implemented `terminal2048GameStateSchema` with validation for:
  - `board`: 4x4 grid array of numbers (powers of 2) or null
  - `moveHistory`: array of valid directions (min 0, max 10000 moves)
  - `startTime`: integer timestamp (>= 0)
  - `endTime`: integer timestamp (>= 0, must be > startTime)
  - `seed`: optional string for RNG seed
- Added custom validation functions:
  - `isPowerOfTwoOrNull()`: Validates tile values are powers of 2 or null
  - `isValidBoard()`: Validates board is exactly 4x4 grid with valid tile values
- Schema validates endTime > startTime using refine
- Follows validation patterns from `lib/validations/score.ts`

### 2.3 Extend scoreSubmissionSchema with gameState field ✅
- Extended `scoreSubmissionSchema` in `lib/validations/score.ts` to include required `gameState` field
- Used `superRefine()` to validate gameState after gameId is validated
- gameState validation:
  - Checks if gameState is provided (required field)
  - Gets game-specific schema using `getGameStateSchema(data.gameId)`
  - Validates gameState structure against game-specific schema
  - Propagates validation errors from gameState schema with correct paths
- Maintains type inference with `z.infer<typeof schema>` pattern
- Updated `ScoreSubmissionInput` type to include gameState
- Kept metadata field separate and flexible for future additions

### 2.4 Create game-specific gameState schema factory ✅
- Created `getGameStateSchema(gameId: string)` function in `lib/validations/game-state.ts`
- Function returns appropriate Zod schema based on gameId:
  - `"terminal-2048"`: Returns `terminal2048GameStateSchema`
  - Other gameIds: Throws error indicating validation not implemented
- Follows pattern from `getGame()` in `lib/games.ts` for game registry
- Designed for extensibility: new games can be added by adding cases to switch statement
- Error messages are clear and indicate which game needs validation implementation

## Additional Implementation

### Schema Design
- Terminal 2048 gameState schema validates all required fields for score validation:
  - Board structure (4x4 grid) with power-of-2 tile values
  - Move history with valid directions
  - Timestamps for duration validation
  - Optional seed for future deterministic replay
- Validation ensures data integrity before passing to game-specific validators
- Error messages are user-friendly and in Portuguese (matching existing patterns)

### Type Safety
- Exported `Terminal2048GameState` type for use in validators
- `ScoreSubmissionInput` type automatically includes gameState field
- Type inference works correctly with extended schema

## Files Created/Modified

- `lib/validations/game-state.ts` - New file with Terminal 2048 gameState schema and factory function
- `lib/validations/score.ts` - Extended scoreSubmissionSchema with gameState field

## Next Steps

1. Proceed with Task Group 3: Validator Infrastructure and Router
2. Terminal 2048 validator will use `Terminal2048GameState` type for type safety

## Notes

- Tests (2.1 and 2.5) were skipped per project instruction
- Schema validation happens before game-specific validators run
- gameState is required for all score submissions (no optional/nullable)
- Future games will need their own gameState schemas added to `getGameStateSchema()`

