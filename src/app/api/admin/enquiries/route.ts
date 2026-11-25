/**
 * Aurelle Spaces — Admin Enquiries List API Route Handler
 * GET /api/admin/enquiries
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/security/auth";
import { hasPermission } from "@/lib/security/rbac";
import { getDatabase } from "@/lib/db/client";
import { enquiriesRepository } from "@/lib/db/repositories/enquiries.repository";
import type { EnquiryStatus } from "@/lib/db/types";
import { logger } from "@/lib/logging/logger";

export async function GET(request: Request) {
  const auth = await getAdminSession();
  if (!auth) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  if (!hasPermission(auth.user.role, "enquiries:read")) {
    return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Permission 'enquiries:read' required." } }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as EnquiryStatus | "all" | null;
  const projectType = searchParams.get("projectType") || undefined;
  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  try {
    const db = getDatabase();
    const result = await enquiriesRepository.list(
      db,
      {
        status: status || undefined,
        projectType: projectType !== "all" ? projectType : undefined,
        search,
      },
      { page, limit }
    );

    const metrics = await enquiriesRepository.getMetrics(db);

    return NextResponse.json({ success: true, ...result, metrics });
  } catch (error) {
    logger.error("Failed to list enquiries", {}, error);
    return NextResponse.json(
      { success: false, error: { code: "DATABASE_ERROR", message: "Failed to retrieve enquiries." } },
      { status: 500 }
    );
  }
}

