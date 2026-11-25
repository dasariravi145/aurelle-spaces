import test from "node:test";
import assert from "node:assert/strict";

function sanitizeFilename(raw) {
  if (!raw || typeof raw !== "string") {
    return "unnamed-asset";
  }
  const basename = raw.replace(/^.*[\\/]/, "");
  const clean = basename
    .normalize("NFKD")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/-+/g, "-");
  return clean || "unnamed-asset";
}

function validateMagicBytes(buffer, mimeType) {
  if (!buffer || buffer.byteLength < 12) {
    return false;
  }

  const bytes = new Uint8Array(buffer.slice(0, 16));

  switch (mimeType) {
    case "image/jpeg":
      return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    case "image/png":
      return (
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47 &&
        bytes[4] === 0x0d &&
        bytes[5] === 0x0a &&
        bytes[6] === 0x1a &&
        bytes[7] === 0x0a
      );
    case "image/webp":
      return (
        bytes[0] === 0x52 &&
        bytes[1] === 0x49 &&
        bytes[2] === 0x46 &&
        bytes[3] === 0x46 &&
        bytes[8] === 0x57 &&
        bytes[9] === 0x45 &&
        bytes[10] === 0x42 &&
        bytes[11] === 0x50
      );
    default:
      return false;
  }
}

test("Filename sanitization strips directory traversal sequences", () => {
  assert.equal(sanitizeFilename("../../../etc/passwd.jpg"), "passwd.jpg");
  assert.equal(sanitizeFilename("..\\..\\windows\\system32\\cmd.exe.png"), "cmd.exe.png");
  assert.equal(sanitizeFilename("Luxury Living Room - Final (1).JPEG"), "luxury-living-room-final-1.jpeg");
});

test("Binary magic byte inspection accepts genuine JPEG headers", () => {
  const jpegHeader = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
  assert.equal(validateMagicBytes(jpegHeader.buffer, "image/jpeg"), true);
  assert.equal(validateMagicBytes(jpegHeader.buffer, "image/png"), false);
});

test("Binary magic byte inspection accepts genuine PNG headers", () => {
  const pngHeader = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
  assert.equal(validateMagicBytes(pngHeader.buffer, "image/png"), true);
  assert.equal(validateMagicBytes(pngHeader.buffer, "image/jpeg"), false);
});

test("Binary magic byte inspection rejects spoofed extension files", () => {
  // An executable text file renamed to .png
  const fakePng = new TextEncoder().encode("#!/bin/bash\necho hacked");
  assert.equal(validateMagicBytes(fakePng.buffer, "image/png"), false);
  assert.equal(validateMagicBytes(fakePng.buffer, "image/jpeg"), false);
});
