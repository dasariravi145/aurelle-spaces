/**
 * Aurelle Spaces — Edge-Compatible Cryptographic Utilities
 * 
 * Uses standard Web Crypto API (crypto.subtle) natively supported in Cloudflare Workers
 * and modern JavaScript runtimes without Node.js native binary dependencies (e.g. bcrypt).
 */

const PBKDF2_ITERATIONS = 100_000;
const SALT_BYTE_LENGTH = 16;
const KEY_BYTE_LENGTH = 32;

/**
 * Generate a cryptographically secure random identifier.
 * Uses URL-safe hex encoding with an optional semantic prefix (e.g. 'usr_', 'ses_').
 */
export function generateSecureId(prefix?: string): string {
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  const hex = Array.from(randomBytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return prefix ? `${prefix}${hex}` : hex;
}

/**
 * Generate a cryptographically secure 256-bit random session token.
 */
export function generateSessionToken(): string {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Compute the SHA-256 hash of a session token for secure database storage.
 * Storing only token hashes ensures that even with read access to the database,
 * active sessions cannot be hijacked.
 */
export async function hashSessionToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Convert an ArrayBuffer or Uint8Array to a hex string.
 */
function toHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Convert a hex string to a Uint8Array.
 */
function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

/**
 * Hash a password using PBKDF2-SHA256 with 100,000 iterations and a cryptographically secure salt.
 * Format: `pbkdf2:sha256:100000:<salt_hex>:<hash_hex>`
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = new Uint8Array(SALT_BYTE_LENGTH);
  crypto.getRandomValues(salt);

  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    passwordKey,
    KEY_BYTE_LENGTH * 8
  );

  const saltHex = toHex(salt);
  const hashHex = toHex(derivedBits);

  return `pbkdf2:sha256:${PBKDF2_ITERATIONS}:${saltHex}:${hashHex}`;
}

/**
 * Verify a candidate password against a stored PBKDF2 hash using constant-time comparison.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split(":");
  if (parts.length !== 5 || parts[0] !== "pbkdf2" || parts[1] !== "sha256") {
    return false;
  }

  const iterations = parseInt(parts[2], 10);
  const salt = fromHex(parts[3]);
  const expectedHashHex = parts[4];

  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as unknown as BufferSource,
      iterations,
      hash: "SHA-256",
    },
    passwordKey,
    KEY_BYTE_LENGTH * 8
  );

  const derivedHex = toHex(derivedBits);
  return timingSafeEqual(derivedHex, expectedHashHex);
}

/**
 * Constant-time string equality check to mitigate timing attacks.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
