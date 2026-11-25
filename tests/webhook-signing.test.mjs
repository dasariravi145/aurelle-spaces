import test from "node:test";
import assert from "node:assert/strict";

async function signWebhookPayload(payload, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );

  return Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = await signWebhookPayload(payload, secret);
  if (signature.length !== expectedSignature.length) return false;

  // Constant-time comparison
  let mismatch = 0;
  for (let i = 0; i < signature.length; i++) {
    mismatch |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
  }
  return mismatch === 0;
}

function calculateNextRetry(attemptCount, baseDelaySeconds = 30, maxBackoffMinutes = 60) {
  const backoffSeconds = Math.min(
    baseDelaySeconds * Math.pow(2, attemptCount - 1),
    maxBackoffMinutes * 60
  );
  return backoffSeconds;
}

test("Webhook HMAC-SHA256 signing produces valid signature and verifies", async () => {
  const secret = "test_super_secret_signing_key_32_characters";
  const payload = JSON.stringify({ event: "enquiry.created", id: "enq_12345" });

  const signature = await signWebhookPayload(payload, secret);
  assert.equal(typeof signature, "string");
  assert.equal(signature.length, 64);

  const isValid = await verifyWebhookSignature(payload, signature, secret);
  assert.equal(isValid, true);
});

test("Webhook verification fails when payload is tampered with", async () => {
  const secret = "test_super_secret_signing_key_32_characters";
  const payload = JSON.stringify({ event: "enquiry.created", id: "enq_12345" });
  const tampered = JSON.stringify({ event: "enquiry.created", id: "enq_tampered" });

  const signature = await signWebhookPayload(payload, secret);
  const isValid = await verifyWebhookSignature(tampered, signature, secret);
  assert.equal(isValid, false);
});

test("Retry backoff calculation scales exponentially and caps at maximum", () => {
  assert.equal(calculateNextRetry(1, 30, 60), 30);      // attempt 1: 30s
  assert.equal(calculateNextRetry(2, 30, 60), 60);      // attempt 2: 60s
  assert.equal(calculateNextRetry(3, 30, 60), 120);     // attempt 3: 120s
  assert.equal(calculateNextRetry(4, 30, 60), 240);     // attempt 4: 240s
  assert.equal(calculateNextRetry(10, 30, 60), 3600);   // capped at 60 mins (3600s)
});

