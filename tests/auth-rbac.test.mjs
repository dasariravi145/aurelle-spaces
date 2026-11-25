import test from "node:test";
import assert from "node:assert/strict";

// Direct testing of cryptographic utilities
async function hashSessionToken(token) {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateSessionToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// RBAC logic simulation
const ALL_PERMISSIONS = [
  "cms:read",
  "cms:write",
  "cms:publish",
  "cms:delete",
  "media:read",
  "media:upload",
  "media:delete",
  "enquiries:read",
  "enquiries:write",
  "enquiries:assign",
  "chat:read",
  "automations:read",
  "automations:manage",
  "admin_users:manage",
  "audit:read",
  "settings:manage",
];

const ROLE_PERMISSIONS = {
  super_admin: ALL_PERMISSIONS,
  studio_director: ALL_PERMISSIONS,
  editor: [
    "cms:read",
    "cms:write",
    "cms:publish",
    "media:read",
    "media:upload",
    "enquiries:read",
    "enquiries:write",
    "chat:read",
  ],
  viewer: [
    "cms:read",
    "media:read",
    "enquiries:read",
    "chat:read",
  ],
};

function hasPermission(role, permission) {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

test("Session token generation produces 64-character hex strings", () => {
  const token = generateSessionToken();
  assert.equal(typeof token, "string");
  assert.equal(token.length, 64);
  assert.match(token, /^[0-9a-f]{64}$/);
});

test("Session token hashing is deterministic and irreversible", async () => {
  const token = generateSessionToken();
  const hash1 = await hashSessionToken(token);
  const hash2 = await hashSessionToken(token);
  assert.equal(hash1, hash2);
  assert.equal(hash1.length, 64);
  assert.notEqual(token, hash1);
});

test("RBAC: super_admin possesses all permissions", () => {
  for (const perm of ALL_PERMISSIONS) {
    assert.equal(hasPermission("super_admin", perm), true, `super_admin must have ${perm}`);
  }
});

test("RBAC: editor cannot manage admin users or delete cms", () => {
  assert.equal(hasPermission("editor", "cms:read"), true);
  assert.equal(hasPermission("editor", "cms:write"), true);
  assert.equal(hasPermission("editor", "cms:delete"), false);
  assert.equal(hasPermission("editor", "admin_users:manage"), false);
  assert.equal(hasPermission("editor", "settings:manage"), false);
});

test("RBAC: viewer has only read permissions", () => {
  assert.equal(hasPermission("viewer", "cms:read"), true);
  assert.equal(hasPermission("viewer", "cms:write"), false);
  assert.equal(hasPermission("viewer", "media:upload"), false);
  assert.equal(hasPermission("viewer", "enquiries:write"), false);
  assert.equal(hasPermission("viewer", "automations:manage"), false);
});

test("RBAC: invalid or empty roles are denied by default", () => {
  assert.equal(hasPermission(null, "cms:read"), false);
  assert.equal(hasPermission(undefined, "cms:read"), false);
  assert.equal(hasPermission("unauthorized_guest", "cms:read"), false);
});

