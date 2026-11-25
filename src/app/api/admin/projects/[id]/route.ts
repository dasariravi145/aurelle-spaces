/**
 * Aurelle Spaces — Admin Single Project API Route Handler
 * GET /api/admin/projects/[id]
 * PUT /api/admin/projects/[id]
 * PATCH /api/admin/projects/[id]
 * DELETE /api/admin/projects/[id]
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/security/auth";
import { hasPermission } from "@/lib/security/rbac";
import { getDatabase } from "@/lib/db/client";
import { projectsRepository } from "@/lib/db/repositories/projects.repository";
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
  const project = await projectsRepository.findById(db, id);

  if (!project) {
    return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Project not found." } }, { status: 404 });
  }

  return NextResponse.json({ success: true, project });
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

  if (!body || typeof body !== "object") {
    return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Invalid payload." } }, { status: 400 });
  }

  try {
    const updated = await projectsRepository.update(db, id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Project not found." } }, { status: 404 });
    }

    await auditRepository.log(db, {
      actorId: auth.user.id,
      action: "project.update",
      entityType: "project",
      entityId: id,
      metadata: { slug: updated.slug, title: updated.title },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    logger.error("Failed to update project", { id }, error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Failed to update project." } }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const auth = await getAdminSession();
  if (!auth) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  if (!hasPermission(auth.user.role, "cms:publish")) {
    return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Permission 'cms:publish' required." } }, { status: 403 });
  }

  const { id } = await params;
  const db = getDatabase();
  const body = await request.json().catch(() => null);

  if (body?.status) {
    await projectsRepository.updateStatus(db, id, body.status);
    await auditRepository.log(db, {
      actorId: auth.user.id,
      action: body.status === "published" ? "project.publish" : "project.unpublish",
      entityType: "project",
      entityId: id,
      metadata: { status: body.status },
    });
  }

  if (body?.featured !== undefined) {
    await projectsRepository.toggleFeatured(db, id, Boolean(body.featured));
  }

  const updated = await projectsRepository.findById(db, id);
  return NextResponse.json({ success: true, project: updated });
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
  await projectsRepository.delete(db, id);

  await auditRepository.log(db, {
    actorId: auth.user.id,
    action: "project.delete",
    entityType: "project",
    entityId: id,
  });

  return NextResponse.json({ success: true, message: "Project deleted." });
}

