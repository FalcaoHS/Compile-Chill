/**
 * Email validation utilities
 * 
 * Validates email format and verifies domain existence via DNS lookup.
 * Implements caching to avoid repeated DNS queries for the same domain.
 */

import dns from "dns/promises"

// Email format regex (RFC 5322 simplified)
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

// Cache for domain validation results (24 hour TTL)
interface CacheEntry {
  valid: boolean
  timestamp: number
}

const domainCache = new Map<string, CacheEntry>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
const DNS_TIMEOUT = 5000 // 5 seconds

/**
 * Validate email format using regex
 * 
 * @param email - The email address to validate
 * @returns true if format is valid, false otherwise
 */
export function validateEmailFormat(email: string): boolean {
  if (!email || typeof email !== "string") {
    return false
  }

  return EMAIL_REGEX.test(email.trim())
}

/**
 * Extract domain from email address
 * 
 * @param email - The email address
 * @returns The domain part of the email, or null if invalid
 */
export function extractDomain(email: string): string | null {
  if (!email || typeof email !== "string") {
    return null
  }

  const parts = email.trim().split("@")
  if (parts.length !== 2) {
    return null
  }

  return parts[1].toLowerCase()
}

/**
 * Check if domain has valid DNS records (MX or A)
 * 
 * @param domain - The domain to check
 * @returns Promise resolving to true if domain has valid DNS records, false otherwise
 */
async function checkDomainDNS(domain: string): Promise<boolean> {
  try {
    // Try to resolve MX records first (mail exchange)
    const mxRecords = await Promise.race([
      dns.resolveMx(domain),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("DNS timeout")), DNS_TIMEOUT)
      ),
    ])

    if (mxRecords && mxRecords.length > 0) {
      return true
    }
  } catch (error) {
    // MX lookup failed, try A record
  }

  try {
    // Fallback: check A record (IPv4 address)
    const aRecords = await Promise.race([
      dns.resolve4(domain),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("DNS timeout")), DNS_TIMEOUT)
      ),
    ])

    if (aRecords && aRecords.length > 0) {
      return true
    }
  } catch (error) {
    // A record lookup also failed
  }

  // If both fail, return false (domain doesn't exist)
  return false
}

/**
 * Validate email domain via DNS lookup (with caching)
 * 
 * @param domain - The domain to validate
 * @returns Promise resolving to true if domain is valid, false otherwise
 */
async function validateDomainDNS(domain: string): Promise<boolean> {
  // Check cache first
  const cached = domainCache.get(domain)
  if (cached) {
    const age = Date.now() - cached.timestamp
    if (age < CACHE_TTL) {
      return cached.valid
    }
    // Cache expired, remove it
    domainCache.delete(domain)
  }

  // Perform DNS lookup
  let isValid = false
  try {
    isValid = await checkDomainDNS(domain)
  } catch (error) {
    // DNS lookup failed or timed out
    // Accept the email anyway (don't block users)
    console.warn(
      `⚠️  [EMAIL-VALIDATION] DNS lookup failed for ${domain}:`,
      error instanceof Error ? error.message : "Unknown error"
    )
    isValid = true // Fail open - don't block users
  }

  // Cache the result
  domainCache.set(domain, {
    valid: isValid,
    timestamp: Date.now(),
  })

  return isValid
}

/**
 * Validate email address (format + domain)
 * 
 * @param email - The email address to validate
 * @returns Promise resolving to validation result with error message if invalid
 */
export async function validateEmail(email: string): Promise<{
  isValid: boolean
  error?: string
}> {
  if (!email || typeof email !== "string") {
    return {
      isValid: false,
      error: "Email é obrigatório",
    }
  }

  const trimmedEmail = email.trim().toLowerCase()

  // Validate format
  if (!validateEmailFormat(trimmedEmail)) {
    return {
      isValid: false,
      error: "Formato de email inválido",
    }
  }

  // Extract domain
  const domain = extractDomain(trimmedEmail)
  if (!domain) {
    return {
      isValid: false,
      error: "Domínio de email inválido",
    }
  }

  // Validate domain via DNS (with timeout and caching)
  const domainValid = await validateDomainDNS(domain)
  if (!domainValid) {
    return {
      isValid: false,
      error: "Domínio de email não existe ou não está acessível",
    }
  }

  return { isValid: true }
}

/**
 * Clear domain validation cache (useful for testing)
 */
export function clearDomainCache(): void {
  domainCache.clear()
}

