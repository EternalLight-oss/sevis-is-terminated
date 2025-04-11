import crypto from "crypto"

/**
 * Hashes an email address using SHA-256
 * @param email The email address to hash
 * @returns A SHA-256 hash of the email address
 */
export function hashEmail(email: string): string {
  // Convert email to lowercase for consistency
  const normalizedEmail = email.trim().toLowerCase()

  // Create a SHA-256 hash
  return crypto.createHash("sha256").update(normalizedEmail).digest("hex")
}

/**
 * Shortens a hash for display purposes
 * @param hash The full hash string
 * @param length The desired length of the shortened hash (default: 8)
 * @returns A shortened version of the hash
 */
export function shortenHash(hash: string, length = 8): string {
  return `${hash.substring(0, length)}...${hash.substring(hash.length - 4)}`
}
