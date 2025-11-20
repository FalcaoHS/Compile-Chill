import { ScoreSubmissionInput } from "@/lib/validations/score"
import { GameValidator, ValidationResult, ValidationContext } from "./types"
import { terminal2048Validator } from "./terminal-2048"
import { devFifteenHexValidator } from "./dev-fifteen-hex"

/**
 * Game validators registry
 * 
 * Maps gameId to its validator implementation.
 * Validators are imported and registered here as they are implemented.
 * 
 * PT: Registro de validadores - mapeia gameId para implementação do validador | EN: Validators registry - maps gameId to validator implementation | ES: Registro de validadores - mapea gameId a implementación del validador | FR: Registre des validateurs - mappe gameId vers implémentation validateur | DE: Validatoren-Register - ordnet gameId Validator-Implementierung zu
 */
const validators: Record<string, GameValidator> = {
  "terminal-2048": terminal2048Validator,
  "dev-fifteen-hex": devFifteenHexValidator,
  // PT: Adicione novos validadores aqui conforme implementados | EN: Add new validators here as implemented | ES: Agregue nuevos validadores aquí según se implementen | FR: Ajoutez nouveaux validateurs ici au fur et à mesure | DE: Neue Validatoren hier hinzufügen, wenn implementiert
}

/**
 * Validate a score submission using the appropriate game validator
 * 
 * @param submission - The score submission to validate
 * @param context - Optional validation context (userId, IP, etc.)
 * @returns ValidationResult indicating if the submission is valid
 * @throws Error if no validator exists for the gameId
 * 
 * @example
 * ```ts
 * const result = validateScore(submission, { userId: 1, ip: "127.0.0.1" })
 * if (!result.valid) {
 *   // Handle validation errors
 *   
 * }
 * ```
 */
export function validateScore(
  submission: ScoreSubmissionInput,
  context?: ValidationContext
): ValidationResult {
  const { gameId } = submission

  // Check if validator exists for this game
  const validator = validators[gameId]

  if (!validator) {
    throw new Error(
      `Validação não implementada para o jogo: ${gameId}. ` +
      `Validators disponíveis: ${Object.keys(validators).join(", ") || "nenhum"}`
    )
  }

  // Delegate to game-specific validator
  return validator.validate(submission, context)
}

/**
 * Register a game validator
 * 
 * @param gameId - The game identifier
 * @param validator - The validator implementation
 * 
 * @internal
 * This function is used internally to register validators.
 * Validators should be imported and registered in this file.
 */
export function registerValidator(gameId: string, validator: GameValidator): void {
  validators[gameId] = validator
}

/**
 * Check if a validator exists for a game
 * 
 * @param gameId - The game identifier
 * @returns true if a validator exists, false otherwise
 */
export function hasValidator(gameId: string): boolean {
  return gameId in validators
}

/**
 * Get list of games with validators
 * 
 * @returns Array of game IDs that have validators
 */
export function getValidatedGames(): string[] {
  return Object.keys(validators)
}

