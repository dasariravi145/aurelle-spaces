/**
 * Aurelle Spaces — Admin Media Upload API Route Handler
 * POST /api/admin/media/upload
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/security/auth";
import { hasPermission } from "@/lib/security/rbac";
import { getDatabase } from "@/lib/db/client";
import { mediaRepository } from "@/lib/db/repositories/media.repository";
import { auditRepository } from "@/lib/db/repositories/audit.repository";
import { getMediaBucket, generateObjectKey, putMediaObject, getPublicMediaUrl } from "@/lib/storage/r2";
import { validateMediaUpload, validateMagicBytes } from "@/lib/storage/validation";
import { validateRequestOrigin } from "@/lib/security/origin";
import { logger } from "@/lib/logging/logger";

export async function POST(request: Request) {
  // 0. Enforce origin & CSRF guard
  const originCheck = validateRequestOrigin(request);
  if (!originCheck.allowed) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN_ORIGIN", message: originCheck.reason || "Forbidden origin." } },
      { status: 403 }
    );
  }

  const auth = await getAdminSession();
  if (!auth) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  if (!hasPermission(auth.user.role, "media:upload")) {
    return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Permission 'media:upload' required." } }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as "projects" | "journal" | "general" | "private") || "general";
    const slug = (formData.get("slug") as string) || undefined;
    const altText = (formData.get("altText") as string) || "";

    if (!file || typeof file === "string") {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "No file uploaded." } }, { status: 400 });
    }

    // 1. Validate file metadata and MIME constraints
    const validation = validateMediaUpload({
      filename: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    });

    // 2. Validate binary magic bytes to prevent MIME/extension spoofing
    const fileBuffer = await file.arrayBuffer();
    if (!validateMagicBytes(fileBuffer, validation.normalizedMime)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_FILE_SIGNATURE",
            message: "Binary file header does not match declared image format.",
          },
        },
        { status: 400 }
      );
    }

    // 3. Obtain R2 bucket and D1 database bindings
    const bucket = getMediaBucket();
    const db = getDatabase();

    // 4. Generate safe partitioned object key
    const objectKey = generateObjectKey({
      filename: validation.sanitizedFilename,
      mimeType: validation.normalizedMime,
      sizeBytes: file.size,
      category,
      slug,
    });

    // 5. Stream upload into Cloudflare R2
    await putMediaObject(bucket, objectKey, fileBuffer, {
      mimeType: validation.normalizedMime,
      customMetadata: {
        originalFilename: file.name,
        uploadedBy: auth.user.id,
      },
    });

    // 5. Insert record into D1 media_assets catalog
    let asset;
    try {
      asset = await mediaRepository.create(db, {
        r2ObjectKey: objectKey,
        originalFilename: file.name,
        mimeType: validation.normalizedMime,
        fileSize: file.size,
        altText,
        uploadingAdminId: auth.user.id,
      });
    } catch (dbError) {
      // Rollback orphaned R2 object if D1 record insertion fails
      logger.error("D1 media catalog insert failed, rolling back R2 object", { objectKey }, dbError);
      try {
        await bucket.delete(objectKey);
      } catch {
        // Rollback attempt
      }
      throw dbError;
    }

    // 6. Record audit log
    await auditRepository.log(db, {
      actorId: auth.user.id,
      action: "media.upload",
      entityType: "media",
      entityId: asset.id,
      metadata: { key: objectKey, filename: file.name, size: file.size },
    });

    return NextResponse.json({
      success: true,
      asset: {
        ...asset,
        publicUrl: getPublicMediaUrl(asset.r2_object_key),
      },
    }, { status: 201 });
  } catch (error) {
    logger.error("Media upload handler error", {}, error);
    return NextResponse.json(
      { success: false, error: { code: "UPLOAD_ERROR", message: (error as Error).message || "Media upload failed." } },
      { status: 400 }
    );
  }
}

