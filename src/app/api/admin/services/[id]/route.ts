/**
 * Aurelle Spaces — Admin Single Service API Route Handler
 * GET /api/admin/services/[id]
 * PUT /api/admin/services/[id]
 * DELETE /api/admin/services/[id]
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/security/auth";
import { hasPermission } from "@/lib/security/rbac";
import { getDatabase } from "@/lib/db/client";
import { servicesRepository } from "@/lib/db/repositories/services.repository";
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

  const { id } = await params;
  const db = getDatabase();
  const service = await servicesRepository.findById(db, id);

  if (!service) {
    return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Service not found." } }, { status: 404 });
  }

  return NextResponse.json({ success: true, service });
}

export async function PUT(request: Request, { params }: RouteProps) {
  const auth = await getAdminSession();
  if (!auth) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  if (!hasPermission(auth.user.role, "cms:write")) {
    return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Permission 'cms:write' required." } }, { status: 403 });
  }

  const { id } = await params;
  const db = getDatabase();
  const body = await request.json().catch(() => null);

  try {
    const updated = await servicesRepository.update(db, id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Service not found." } }, { status: 404 });
    }

    await auditRepository.log(db, {
      actorId: auth.user.id,
      action: "service.update",
      entityType: "service",
      entityId: id,
      metadata: { slug: updated.slug, title: updated.title },
    });

    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    logger.error("Failed to update service", { id }, error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Failed to update service." } }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteProps) {
  const auth = await getAdminSession();
  if (!auth) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  if (!hasPermission(auth.user.role, "cms:delete")) {
    return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Permission 'cms:delete' required." } }, { status: 403 });
  }

  const { id } = await params;
  const db = getDatabase();
  await servicesRepository.delete(db, id);

  await auditRepository.log(db, {
    actorId: auth.user.id,
    action: "service.delete",
    entityType: "service",
    entityId: id,
  });

  return NextResponse.json({ success: true, message: "Service deleted." });
}

