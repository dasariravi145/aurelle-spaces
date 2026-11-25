/**
 * Aurelle Spaces — Admin Enquiry Assignment API Route Handler
 * PATCH /api/admin/enquiries/[id]/assign
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/security/auth";
import { hasPermission } from "@/lib/security/rbac";
import { getDatabase } from "@/lib/db/client";
import { enquiriesRepository } from "@/lib/db/repositories/enquiries.repository";
import { adminUsersRepository } from "@/lib/db/repositories/admin-users.repository";
import { automationRepository } from "@/lib/db/repositories/automation.repository";
import { auditRepository } from "@/lib/db/repositories/audit.repository";
import { logger } from "@/lib/logging/logger";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const auth = await getAdminSession();
  if (!auth) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  if (!hasPermission(auth.user.role, "enquiries:assign") && !hasPermission(auth.user.role, "enquiries:write")) {
    return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Permission to assign enquiries is required." } }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);

  const assignedAdminId = body?.assignedAdminId === null || body?.assignedAdminId === ""
    ? null
    : (body?.assignedAdminId as string);

  try {
    const db = getDatabase();
    const existing = await enquiriesRepository.findById(db, id);
    if (!existing) {
      return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Enquiry not found." } }, { status: 404 });
    }

    // If assigning to a user, verify the target admin exists and is active
    if (assignedAdminId) {
      const targetUser = await adminUsersRepository.findById(db, assignedAdminId);
      if (!targetUser || targetUser.account_status !== "active") {
        return NextResponse.json(
          { success: false, error: { code: "VALIDATION_ERROR", message: "Target administrator account does not exist or is inactive." } },
          { status: 400 }
        );
      }
    }

    await enquiriesRepository.assignAdmin(db, id, assignedAdminId);

    // Enqueue enquiry.assigned automation event if a new administrator was assigned
    if (assignedAdminId && assignedAdminId !== existing.assigned_admin_id) {
      try {
        const targetUser = await adminUsersRepository.findById(db, assignedAdminId);
        if (targetUser) {
          await automationRepository.createEvent(db, {
            eventType: "enquiry.assigned",
            relatedEntityId: id,
            payloadReference: JSON.stringify({
              enquiryId: id,
              referenceCode: `AUR-${id.slice(-6).toUpperCase()}`,
              assignedAdminId: targetUser.id,
              assignedAdminName: targetUser.display_name,
              assignedAdminEmail: targetUser.email,
              assignedById: auth.user.id,
              assignedByName: auth.user.display_name,
              projectType: existing.project_type,
              city: existing.city,
              assignedAt: new Date().toISOString(),
            }),
          });
        }
      } catch (eventErr) {
        logger.warn("Non-fatal: failed to enqueue enquiry.assigned event", { id }, eventErr);
      }
    }

    await auditRepository.log(db, {
      actorId: auth.user.id,
      action: "enquiry.assigned",
      entityType: "enquiry",
      entityId: id,
      metadata: { previousAssignee: existing.assigned_admin_id, newAssignee: assignedAdminId },
    });

    const updated = await enquiriesRepository.findById(db, id);
    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error) {
    logger.error("Failed to assign enquiry", { id }, error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Failed to assign administrator." } }, { status: 500 });
  }
}

