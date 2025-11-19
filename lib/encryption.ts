/**
 * Encryption utilities for sensitive user data
 * 
 * Uses AES-256-GCM encryption for user names to ensure privacy.
 * Each encryption uses a unique IV (initialization vector) for security.
 */

import crypto from "crypto"

const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 16 // 16 bytes for GCM
const SALT_LENGTH = 64 // 64 bytes for key derivation
const TAG_LENGTH = 16 // 16 bytes for authentication tag
const KEY_LENGTH = 32 // 32 bytes for AES-256

/**
 * Get encryption key from environment variable
 * Falls back to a default key in development (should be set in production)
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY

  if (!key) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "ENCRYPTION_KEY environment variable is required in production"
      )
    }
    // Development fallback - should be replaced with actual key
    console.warn(
      "⚠️  ENCRYPTION_KEY not set. Using development fallback. Set ENCRYPTION_KEY in production!"
    )
    return crypto.scryptSync("development-key-fallback", "salt", KEY_LENGTH)
  }

  // Convert key to buffer (expects 32-byte hex string or base64)
  if (key.length === 64) {
    // Hex string (32 bytes = 64 hex chars)
    return Buffer.from(key, "hex")
  } else if (key.length === 44) {
    // Base64 string (32 bytes = 44 base64 chars)
    return Buffer.from(key, "base64")
  } else {
    // Derive key from string using scrypt
    return crypto.scryptSync(key, "salt", KEY_LENGTH)
  }
}

/**
 * Encrypt a string (e.g., user name) using AES-256-GCM
 * 
 * @param plaintext - The string to encrypt
 * @returns Encrypted string with IV prepended (format: iv:tag:encrypted)
 * @throws Error if encryption fails
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) {
    return ""
  }

  try {
    const key = getEncryptionKey()
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    let encrypted = cipher.update(plaintext, "utf8", "hex")
    encrypted += cipher.final("hex")

    const tag = cipher.getAuthTag()

    // Format: iv:tag:encrypted (all in hex)
    return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted}`
  } catch (error) {
    console.error("❌ [ENCRYPTION] Failed to encrypt:", error)
    throw new Error("Encryption failed")
  }
}

/**
 * Decrypt a string (e.g., user name) using AES-256-GCM
 * 
 * @param encryptedData - The encrypted string (format: iv:tag:encrypted)
 * @returns Decrypted plaintext string
 * @throws Error if decryption fails
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) {
    return ""
  }

  try {
    const key = getEncryptionKey()
    const parts = encryptedData.split(":")

    if (parts.length !== 3) {
      throw new Error("Invalid encrypted data format")
    }

    const [ivHex, tagHex, encrypted] = parts
    const iv = Buffer.from(ivHex, "hex")
    const tag = Buffer.from(tagHex, "hex")

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(tag)

    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  } catch (error) {
    console.error("❌ [ENCRYPTION] Failed to decrypt:", error)
    throw new Error("Decryption failed")
  }
}

