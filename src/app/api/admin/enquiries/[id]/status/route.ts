/**
 * Aurelle Spaces — Admin Enquiry Status Update API Route Handler
 * PATCH /api/admin/enquiries/[id]/status
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/security/auth";
import { hasPermission } from "@/lib/security/rbac";
import { getDatabase } from "@/lib/db/client";
import { enquiriesRepository } from "@/lib/db/repositories/enquiries.repository";
import { auditRepository } from "@/lib/db/repositories/audit.repository";
import type { EnquiryStatus } from "@/lib/db/types";
import { logger } from "@/lib/logging/logger";

interface RouteProps {
  params: Promise<{ id: string }>;
}

const VALID_STATUSES: readonly EnquiryStatus[] = [
  "new",
  "reviewed",
  "contacted",
  "qualified",
  "consultation_scheduled",
  "proposal_sent",
  "won",
  "lost",
  "in_progress",
  "closed",
  "archived",
];

export async function PATCH(request: Request, { params }: RouteProps) {
  const auth = await getAdminSession();
  if (!auth) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  if (!hasPermission(auth.user.role, "enquiries:write")) {
    return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Permission 'enquiries:write' required." } }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);

  const status = body?.status as EnquiryStatus;
  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: `Invalid status '${status}'.` } },
      { status: 400 }
    );
  }

  try {
    const db = getDatabase();
    const existing = await enquiriesRepository.findById(db, id);
    if (!existing) {
      return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Enquiry not found." } }, { status: 404 });
    }

    const previousStatus = existing.status;
    await enquiriesRepository.updateStatus(db, id, status);

    await auditRepository.log(db, {
      actorId: auth.user.id,
      action: "enquiry.status_changed",
      entityType: "enquiry",
      entityId: id,
      metadata: { previousStatus, newStatus: status, clientName: existing.full_name },
    });

    const updated = await enquiriesRepository.findById(db, id);
    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error) {
    logger.error("Failed to update enquiry status", { id }, error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Failed to update enquiry status." } }, { status: 500 });
  }
}

