# Spec Requirements: Game Score Validation System

## Initial Description
Game Score Validation System

## Requirements Discussion

### First Round Questions

**Q1:** I assume we should validate game state transitions by replaying moves from the submitted game state (e.g., for Terminal 2048, replay the moveHistory to verify the final score). Is that correct, or should we use a different approach?

**Answer:** Sim. Para Terminal 2048, a validação correta e segura é: Receber moveHistory, recriar o jogo do zero no servidor, reaplicar os movimentos exatamente na mesma ordem, verificar se: board final == board enviado, score calculado == score enviado, número de movimentos bate, merges batem, RNG deterministic (seed) opcional. Essa é a forma mais confiável contra cheats.

**Q2:** I'm thinking we should start with Terminal 2048 validation since it's the only implemented game, then extend to other games as they're built. Should we build a generic validation framework that works for all games, or game-specific validators?

**Answer:** Use game-specific validators, mas dentro de uma arquitetura padrão: /lib/game-validators/ com terminal-2048.ts, bit-runner.ts, hack-grid.ts, etc. E um router genérico: import validators from "@/lib/game-validators"; validators[gameId].validate(submission); Não tente criar um "validador universal" - cada jogo tem regras diferentes, genérico vira fraco.

**Q3:** For Terminal 2048, I assume we'll validate: moveHistory replay matches the final score, duration is reasonable (e.g., minimum time per move), and board state transitions are valid. Should we also check for impossible scores (e.g., scores that can't be achieved with the reported moves)?

**Answer:** Sim, deve validar tudo isso: Replaying do moveHistory, Score final corresponde à soma dos merges, Transições válidas de tiles, Nenhum merge impossível, Tempo razoável por movimento. Exemplo: mínimo 100ms por movimento é bom, máximo 5s entre movimentos também é bom, durations absurdos (ex.: 10h jogando) = rejeitar, score incoerente com número de merges = rejeitar. Scores impossíveis: 2048 com 4 movimentos, 4096 sem merges suficientes, grid com tiles não permitidos (ex.: 3, 6, 12 fora da lógica original).

**Q4:** I'm thinking the client should send game state data (board state, moveHistory, startTime, endTime) in the `metadata` field of the score submission. Should we extend the score submission schema to include a required `gameState` field, or keep it in metadata?

**Answer:** Recomendação final: Criar campo separado: gameState obrigatório. Não coloque dentro de metadata. Por quê? padroniza, validação fica fácil, metadata continua flexível para adições futuras, evita bagunça estrutural. gameState deve conter: { "board": [...], "moveHistory": [...], "startTime": "...", "endTime": "...", "seed": "optional" }.

**Q5:** For duration validation, I assume we'll check that the reported duration matches the difference between startTime and endTime, and that the duration is reasonable for the number of moves (e.g., minimum 100ms per move). Is that correct, or should we use different thresholds?

**Answer:** Sim, exatamente isso: duration ≈ endTime - startTime, duration >= moveHistory.length * minimumTimePerMove. Ideal: mínimo 100–150ms por movimento, máximo 10s por movimento, limite global: < 1h. Isso elimina bots que disparam 200 movimentos instantâneos.

**Q6:** When validation fails, I assume we should reject the score submission with a generic error message (e.g., "Score inválido") and log detailed validation errors server-side. Should we also track failed validation attempts for potential abuse detection?

**Answer:** Sim: Resposta ao cliente: "Score inválido" (curto e genérico). Log interno: motivo da falha, score enviado, userId, gameId, IP. Além disso: Sim, trackear tentativas inválidas. Crie uma tabela simples: ScoreValidationFail { id, userId, gameId, count, lastAttempt, details JSON }. Isso ajuda a detectar BOTTERS e BAN waves controladas.

**Q7:** I'm thinking we should validate scores synchronously during the POST /api/scores request. Should we validate all scores this way, or only scores above a certain threshold (e.g., top 10% of scores)?

**Answer:** Decisão ideal: Validar todos os scores — MAS: Scores baixíssimos (ex.: < 500) podem ter validação mais leve (sem replay completo). Scores medianos e altos → validação full. Scores próximo do TOP → validação especial (replay + limites + seed + anti-cheat completo). Estratégia recomendada: score < 200 => validação leve, 200–2000 => validação normal, 2000+ (top tier) => validação completa + auditoria.

**Q8:** What should be out of scope for this initial validation system? For example, should we defer validation for games that aren't implemented yet, or skip validation for very low scores?

**Answer:** Para a primeira fase do sistema: ❌ Fora do escopo: Validação de jogos que ainda não existem, Sistema anti-cheat ativo (monitoramento de padrão), Detecção automática de bots por timing (fase futura), Seed RNG criptografado, Replay visual para auditoria, Score challenge system (anti-fake por hash), Verificação criptográfica de integridade do cliente. ✔ Dentro do escopo: Validação de Terminal 2048, Estrutura de validators, Campo gameState obrigatório, rate-limit, logging, mensagens genéricas.

### Existing Code to Reference

**Similar Features Identified:**
- Score submission validation: `lib/validations/score.ts` - Existing Zod schema for score submission
- Validation helper: `lib/validations/validate.ts` - Centralized validation utility with error handling
- Game logic: `lib/games/terminal-2048/game-logic.ts` - Terminal 2048 game logic with moveHistory, board state, and executeMove function that can be reused for validation replay
- Error handling: `lib/api-errors.ts` - Centralized error handling utility from Security Foundation spec
- Score API endpoint: `app/api/scores/route.ts` - Existing POST endpoint that will need to integrate validation

**Components to potentially reuse:**
- Terminal 2048 game logic functions (`executeMove`, `moveBoard`, `createInitialGameState`) for replaying moves during validation
- Existing validation patterns from `lib/validations/validate.ts` for schema validation
- Error handling patterns from `lib/api-errors.ts` for consistent error responses

**Backend logic to reference:**
- Score submission endpoint structure from `app/api/scores/route.ts`
- Zod validation patterns from `lib/validations/score.ts`
- Game state structure from `lib/games/terminal-2048/game-logic.ts` (GameState interface with board, moveHistory, startTime)

### Follow-up Questions
No follow-up questions needed - all requirements are clear.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
No visual assets to analyze.

## Requirements Summary

### Functional Requirements
- Create game-specific validators architecture in `/lib/game-validators/` with individual validators per game (starting with `terminal-2048.ts`)
- Implement generic validator router that dispatches to game-specific validators: `validators[gameId].validate(submission)`
- Add required `gameState` field to score submission schema (separate from metadata) containing: board, moveHistory, startTime, endTime, seed (optional)
- Implement Terminal 2048 validator that:
  - Receives moveHistory from gameState
  - Recreates game from scratch on server
  - Reapplies moves in exact same order
  - Validates: final board == submitted board, calculated score == submitted score, move count matches, merges match
  - Validates score corresponds to sum of merges
  - Validates valid tile transitions (no impossible merges)
  - Validates no impossible scores (e.g., 2048 with 4 moves, 4096 without sufficient merges, invalid tile values like 3, 6, 12)
  - Validates reasonable timing: minimum 100-150ms per move, maximum 10s per move, global limit < 1h
  - Validates duration matches endTime - startTime
  - Validates duration >= moveHistory.length * minimumTimePerMove
- Implement tiered validation strategy:
  - Score < 200: Light validation (no full replay)
  - Score 200-2000: Normal validation (full replay)
  - Score 2000+: Complete validation + audit
- Reject invalid scores with generic error message "Score inválido" to client
- Log detailed validation failures server-side including: failure reason, submitted score, userId, gameId, IP
- Create ScoreValidationFail database table to track failed validation attempts: id, userId, gameId, count, lastAttempt, details (JSON)
- Integrate validation into existing POST /api/scores endpoint
- Reuse existing Terminal 2048 game logic functions for move replay during validation

### Reusability Opportunities
- Terminal 2048 game logic from `lib/games/terminal-2048/game-logic.ts`:
  - `executeMove()` function for replaying moves
  - `moveBoard()` function for validating board transitions
  - `createInitialGameState()` for starting validation replay
  - GameState interface structure
- Validation utilities from `lib/validations/validate.ts`:
  - `validate()` helper function pattern
  - Error formatting patterns
- Error handling from `lib/api-errors.ts`:
  - `handleApiError()` for consistent error responses
  - Error code and message patterns
- Score submission schema from `lib/validations/score.ts`:
  - Existing Zod schema structure to extend with gameState field

### Scope Boundaries
**In Scope:**
- Terminal 2048 validation system
- Game-specific validator architecture (`/lib/game-validators/`)
- Generic validator router/dispatcher
- Required `gameState` field in score submission
- Move replay validation for Terminal 2048
- Score, board, merge, and timing validation
- Tiered validation strategy (light/normal/complete based on score)
- Generic error messages to clients
- Detailed server-side logging
- ScoreValidationFail table for tracking failed attempts
- Integration with existing POST /api/scores endpoint

**Out of Scope:**
- Validation for games that don't exist yet
- Active anti-cheat system (pattern monitoring)
- Automatic bot detection by timing (future phase)
- Encrypted RNG seed
- Visual replay for auditing
- Score challenge system (anti-fake by hash)
- Cryptographic client integrity verification
- Full validation for very low scores (< 200) - uses light validation instead

### Technical Considerations
- Integration with existing score submission endpoint (`app/api/scores/route.ts`)
- Extension of existing Zod schema (`lib/validations/score.ts`) to include required `gameState` field
- Reuse of Terminal 2048 game logic (`lib/games/terminal-2048/game-logic.ts`) for move replay
- Integration with existing error handling (`lib/api-errors.ts`) for consistent error responses
- Database schema extension for ScoreValidationFail table (Prisma)
- Validation must be synchronous during POST request
- Game-specific validators must be isolated and maintainable
- Validation should not significantly impact API response time
- Server-side game logic replay must match client-side game logic exactly
- Timing validation thresholds: 100-150ms minimum per move, 10s maximum per move, 1h global limit

