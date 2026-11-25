/**
 * Aurelle Spaces — Admin Single Media Asset API Route Handler
 * PATCH /api/admin/media/[id]
 * DELETE /api/admin/media/[id]
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/security/auth";
import { hasPermission } from "@/lib/security/rbac";
import { getDatabase } from "@/lib/db/client";
import { mediaRepository } from "@/lib/db/repositories/media.repository";
import { auditRepository } from "@/lib/db/repositories/audit.repository";
import { getMediaBucket, deleteMediaObject } from "@/lib/storage/r2";
import { logger } from "@/lib/logging/logger";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const auth = await getAdminSession();
  if (!auth) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  const { id } = await params;
  const db = getDatabase();
  const body = await request.json().catch(() => null);

  if (typeof body?.altText === "string") {
    await mediaRepository.updateAltText(db, id, body.altText);
    await auditRepository.log(db, {
      actorId: auth.user.id,
      action: "media.update_alt",
      entityType: "media",
      entityId: id,
    });
  }

  const updated = await mediaRepository.findById(db, id);
  return NextResponse.json({ success: true, asset: updated });
}

export async function DELETE(request: Request, { params }: RouteProps) {
  const auth = await getAdminSession();
  if (!auth) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  if (!hasPermission(auth.user.role, "media:delete")) {
    return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Permission 'media:delete' required." } }, { status: 403 });
  }

  const { id } = await params;
  const db = getDatabase();
  const asset = await mediaRepository.findById(db, id);

  if (!asset) {
    return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Media asset not found." } }, { status: 404 });
  }

  // Safety check: ensure asset is not referenced by published projects or articles
  const referenceCount = await mediaRepository.checkReferenceCount(db, id);
  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") === "true";

  if (referenceCount > 0 && !force) {
    return NextResponse.json({
      success: false,
      error: {
        code: "CONFLICT",
        message: `Asset is referenced by ${referenceCount} project(s) or article(s). Pass force=true to delete anyway.`,
      },
    }, { status: 409 });
  }

  try {
    const bucket = getMediaBucket();
    await deleteMediaObject(bucket, asset.r2_object_key);
  } catch (storageError) {
    logger.warn("R2 deletion warning while removing media asset", { key: asset.r2_object_key }, storageError);
  }

  await mediaRepository.delete(db, id);

  await auditRepository.log(db, {
    actorId: auth.user.id,
    action: "media.delete",
    entityType: "media",
    entityId: id,
    metadata: { key: asset.r2_object_key },
  });

  return NextResponse.json({ success: true, message: "Media asset deleted successfully." });
}

