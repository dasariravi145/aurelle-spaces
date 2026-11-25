import test from "node:test";
import assert from "node:assert/strict";

const ALLOWED_ORIGINS = new Set([
  "https://aurelle.dsecops88.online",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

function validateRequestOrigin(method, originHeader, refererHeader, secFetchSite) {
  const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);
  if (safeMethods.has(method.toUpperCase())) {
    return { allowed: true };
  }

  if (secFetchSite === "cross-site") {
    return { allowed: false, reason: "Blocked by Sec-Fetch-Site cross-site policy." };
  }

  if (originHeader) {
    const cleanOrigin = originHeader.trim().replace(/\/$/, "");
    if (ALLOWED_ORIGINS.has(cleanOrigin)) {
      return { allowed: true, origin: cleanOrigin };
    }
    return { allowed: false, reason: `Unauthorized origin: '${cleanOrigin}'.` };
  }

  if (refererHeader) {
    try {
      const url = new URL(refererHeader);
      const refererOrigin = url.origin.replace(/\/$/, "");
      if (ALLOWED_ORIGINS.has(refererOrigin)) {
        return { allowed: true, origin: refererOrigin };
      }
      return { allowed: false, reason: `Unauthorized referer origin: '${refererOrigin}'.` };
    } catch {
      return { allowed: false, reason: "Malformed referer URL." };
    }
  }

  return { allowed: false, reason: "Missing Origin or Referer header." };
}

test("Safe HTTP methods (GET, HEAD) are allowed unconditionally", () => {
  assert.equal(validateRequestOrigin("GET").allowed, true);
  assert.equal(validateRequestOrigin("HEAD").allowed, true);
  assert.equal(validateRequestOrigin("OPTIONS").allowed, true);
});

test("State-changing requests with authorized origin are permitted", () => {
  const res = validateRequestOrigin("POST", "https://aurelle.dsecops88.online");
  assert.equal(res.allowed, true);

  const localRes = validateRequestOrigin("POST", "http://localhost:3000");
  assert.equal(localRes.allowed, true);
});

test("State-changing requests from malicious cross-origin origins are rejected", () => {
  const res = validateRequestOrigin("POST", "https://malicious-phishing-site.com");
  assert.equal(res.allowed, false);
  assert.match(res.reason, /Unauthorized origin/);
});

test("Requests flagged as cross-site by browser metadata are immediately dropped", () => {
  const res = validateRequestOrigin("POST", "https://aurelle.dsecops88.online", undefined, "cross-site");
  assert.equal(res.allowed, false);
  assert.match(res.reason, /Blocked by Sec-Fetch-Site/);
});

