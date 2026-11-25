/**
 * Aurelle Spaces — Admin Media List API Route Handler
 * GET /api/admin/media
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/security/auth";
import { getDatabase } from "@/lib/db/client";
import { mediaRepository } from "@/lib/db/repositories/media.repository";
import { getPublicMediaUrl } from "@/lib/storage/r2";
import { logger } from "@/lib/logging/logger";

export async function GET(request: Request) {
  const auth = await getAdminSession();
  if (!auth) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "24", 10);

  try {
    const db = getDatabase();
    const result = await mediaRepository.list(db, { page, limit });

    const enrichedData = result.data.map((item) => ({
      ...item,
      publicUrl: getPublicMediaUrl(item.r2_object_key),
    }));

    return NextResponse.json({ success: true, ...result, data: enrichedData });
  } catch (error) {
    logger.error("Failed to list media assets", {}, error);
    return NextResponse.json({ success: false, error: { code: "DATABASE_ERROR", message: "Failed to list media." } }, { status: 500 });
  }
}

