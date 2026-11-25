/**
 * Aurelle Spaces — Admin Enquiry Notes API Route Handler
 * GET /api/admin/enquiries/[id]/notes
 * POST /api/admin/enquiries/[id]/notes
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/security/auth";
import { hasPermission } from "@/lib/security/rbac";
import { getDatabase } from "@/lib/db/client";
import { enquiryNotesRepository } from "@/lib/db/repositories/enquiry-notes.repository";
import { auditRepository } from "@/lib/db/repositories/audit.repository";
import { logger } from "@/lib/logging/logger";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteProps) {
  const auth = await getAdminSession();
  if (!auth) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  if (!hasPermission(auth.user.role, "enquiries:read")) {
    return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Permission 'enquiries:read' required." } }, { status: 403 });
  }

  const { id } = await params;
  try {
    const db = getDatabase();
    const notes = await enquiryNotesRepository.listByEnquiry(db, id);
    return NextResponse.json({ success: true, notes });
  } catch (error) {
    logger.error("Failed to list enquiry notes", { id }, error);
    return NextResponse.json({ success: false, error: { code: "DATABASE_ERROR", message: "Failed to retrieve notes." } }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: RouteProps) {
  const auth = await getAdminSession();
  if (!auth) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  if (!hasPermission(auth.user.role, "enquiries:write")) {
    return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Permission 'enquiries:write' required." } }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);

  const content = typeof body?.content === "string" ? body.content.trim() : "";
  if (!content || content.length < 2) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Note content cannot be empty." } },
      { status: 400 }
    );
  }

  try {
    const db = getDatabase();
    const note = await enquiryNotesRepository.createNote(db, id, auth.user.id, content);

    await auditRepository.log(db, {
      actorId: auth.user.id,
      action: "enquiry.note_added",
      entityType: "enquiry",
      entityId: id,
    });

    return NextResponse.json({ success: true, note }, { status: 201 });
  } catch (error) {
    logger.error("Failed to add enquiry note", { id }, error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Failed to persist note." } }, { status: 500 });
  }
}

