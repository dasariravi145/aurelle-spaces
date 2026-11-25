/**
 * Aurelle Spaces — Admin Projects API Route Handler
 * GET /api/admin/projects
 * POST /api/admin/projects
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/security/auth";
import { hasPermission } from "@/lib/security/rbac";
import { getDatabase } from "@/lib/db/client";
import { projectsRepository } from "@/lib/db/repositories/projects.repository";
import { auditRepository } from "@/lib/db/repositories/audit.repository";
import { validateCreateProject } from "@/lib/validation/project-schema";
import { logger } from "@/lib/logging/logger";

export async function GET(request: Request) {
  const auth = await getAdminSession();
  if (!auth) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  try {
    const db = getDatabase();
    const result = await projectsRepository.listAll(db, { page, limit });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    logger.error("Failed to list admin projects", {}, error);
    return NextResponse.json({ success: false, error: { code: "DATABASE_ERROR", message: "Failed to retrieve projects." } }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await getAdminSession();
  if (!auth) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  if (!hasPermission(auth.user.role, "cms:write")) {
    return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Permission 'cms:write' required." } }, { status: 403 });
  }

  try {
    const payload = await request.json().catch(() => null);
    const validated = validateCreateProject(payload);

    const db = getDatabase();

    // Check slug uniqueness
    const existing = await projectsRepository.findBySlug(db, validated.slug);
    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: "CONFLICT", message: `A project with slug '${validated.slug}' already exists.` } },
        { status: 409 }
      );
    }

    const created = await projectsRepository.create(db, validated);

    await auditRepository.log(db, {
      actorId: auth.user.id,
      action: "project.create",
      entityType: "project",
      entityId: created.id,
      metadata: { slug: created.slug, title: created.title },
    });

    return NextResponse.json({ success: true, project: created }, { status: 201 });
  } catch (error) {
    logger.error("Failed to create project", {}, error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: (error as Error).message || "Failed to create project." } },
      { status: 400 }
    );
  }
}

