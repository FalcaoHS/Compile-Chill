/**
 * Password hashing and validation utilities
 * 
 * Uses bcrypt for secure password hashing with automatic salt generation.
 * Implements simple password rules: 6-100 characters, no special requirements.
 */

import bcrypt from "bcrypt"

const SALT_ROUNDS = 12 // Higher rounds = more secure but slower

/**
 * Validate password strength
 * 
 * Rules:
 * - Minimum 6 characters
 * - Maximum 100 characters
 * - No special requirements (accepts any characters)
 * 
 * @param password - The password to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export function validatePassword(password: string): {
  isValid: boolean
  error?: string
} {
  if (!password) {
    return {
      isValid: false,
      error: "Senha é obrigatória",
    }
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: "Senha deve ter no mínimo 6 caracteres",
    }
  }

  if (password.length > 100) {
    return {
      isValid: false,
      error: "Senha deve ter no máximo 100 caracteres",
    }
  }

  return { isValid: true }
}

/**
 * Hash a password using bcrypt
 * 
 * @param password - The plain text password to hash
 * @returns Promise resolving to the hashed password
 * @throws Error if hashing fails
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password) {
    throw new Error("Password is required")
  }

  // Validate password before hashing
  const validation = validatePassword(password)
  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid password")
  }

  try {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS)
    return hashed
  } catch (error) {
    console.error("❌ [PASSWORD] Failed to hash password:", error)
    throw new Error("Password hashing failed")
  }
}

/**
 * Compare a plain text password with a hashed password
 * 
 * @param password - The plain text password to check
 * @param hash - The hashed password to compare against
 * @returns Promise resolving to true if passwords match, false otherwise
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  if (!password || !hash) {
    return false
  }

  try {
    const match = await bcrypt.compare(password, hash)
    return match
  } catch (error) {
    console.error("❌ [PASSWORD] Failed to compare password:", error)
    return false
  }
}

