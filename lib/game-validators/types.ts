import { ScoreSubmissionInput } from "@/lib/validations/score"

/**
 * Result of score validation
 * 
 * Contains validation status and any error messages if validation failed
 */
export interface ValidationResult {
  /**
   * Whether the score submission is valid
   */
  valid: boolean

  /**
   * Array of error messages if validation failed
   * Empty array if validation passed
   */
  errors?: string[]
}

/**
 * Context information for validation
 * 
 * Provides additional context that may be used during validation
 * (e.g., for logging, rate limiting, abuse detection)
 */
export interface ValidationContext {
  /**
   * User ID of the user submitting the score
   */
  userId?: number

  /**
   * IP address of the request
   */
  ip?: string

  /**
   * Additional context data
   */
  [key: string]: any
}

/**
 * Game validator interface
 * 
 * Each game must implement a validator that conforms to this interface
 */
export interface GameValidator {
  /**
   * Validate a score submission
   * 
   * @param submission - The score submission to validate
   * @param context - Optional validation context (userId, IP, etc.)
   * @returns ValidationResult indicating if the submission is valid
   */
  validate(
    submission: ScoreSubmissionInput,
    context?: ValidationContext
  ): ValidationResult
}

