# Game Validators

This directory contains game-specific score validation logic.

## Structure

- `types.ts` - Shared types and interfaces for validators
- `index.ts` - Validator router/dispatcher
- `terminal-2048.ts` - Terminal 2048 validator (to be implemented in Task Group 4)
- Future game validators will be added here as games are implemented

## Adding a New Validator

1. Create a new file: `lib/game-validators/[game-id].ts`
2. Implement the `GameValidator` interface from `types.ts`
3. Import and register the validator in `index.ts`:

```ts
import { terminal2048Validator } from "./terminal-2048"

const validators: Record<string, GameValidator> = {
  "terminal-2048": terminal2048Validator,
  // Add more validators here
}
```

## Validator Requirements

Each validator must:
- Implement the `GameValidator` interface
- Accept `ScoreSubmissionInput` and optional `ValidationContext`
- Return `ValidationResult` with `valid: boolean` and optional `errors: string[]`
- Validate game-specific logic (board state, moves, timing, etc.)
- Return detailed error messages for debugging

