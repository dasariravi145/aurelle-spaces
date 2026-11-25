/**
 * Aurelle Spaces — Webhook Cryptographic Signing (HMAC-SHA256)
 * 
 * Implements HMAC-SHA256 request signing using standard Web Crypto API (crypto.subtle)
 * natively supported across Cloudflare Workers and modern Edge runtimes.
 */

/**
 * Signs raw request body bytes using HMAC-SHA256.
 * Returns lowercase hex-encoded signature.
 */
export async function signWebhookPayload(
  secret: string,
  bodyBytes: Uint8Array
): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, bodyBytes as unknown as BufferSource);
  const signatureBytes = new Uint8Array(signatureBuffer);

  return Array.from(signatureBytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verifies an incoming webhook signature against raw request body bytes.
 * Uses constant-time comparison to prevent timing attacks.
 */
export async function verifyWebhookSignature(
  secret: string,
  bodyBytes: Uint8Array,
  signatureHex: string
): Promise<boolean> {
  try {
    const expectedSignature = await signWebhookPayload(secret, bodyBytes);

    if (expectedSignature.length !== signatureHex.length) {
      return false;
    }

    let mismatch = 0;
    for (let i = 0; i < expectedSignature.length; i++) {
      mismatch |= expectedSignature.charCodeAt(i) ^ signatureHex.charCodeAt(i);
    }

    return mismatch === 0;
  } catch {
    return false;
  }
}

