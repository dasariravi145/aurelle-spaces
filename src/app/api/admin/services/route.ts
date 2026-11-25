/**
 * Aurelle Spaces — Admin Services API Route Handler
 * GET /api/admin/services
 * POST /api/admin/services
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/security/auth";
import { hasPermission } from "@/lib/security/rbac";
import { getDatabase } from "@/lib/db/client";
import { servicesRepository } from "@/lib/db/repositories/services.repository";
import { auditRepository } from "@/lib/db/repositories/audit.repository";
import { validateCreateService } from "@/lib/validation/service-schema";
import { logger } from "@/lib/logging/logger";

export async function GET() {
  const auth = await getAdminSession();
  if (!auth) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  try {
    const db = getDatabase();
    const result = await servicesRepository.listAll(db);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    logger.error("Failed to list services", {}, error);
    return NextResponse.json({ success: false, error: { code: "DATABASE_ERROR", message: "Failed to retrieve services." } }, { status: 500 });
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
    const body = await request.json().catch(() => null);
    const validated = validateCreateService(body);

    const db = getDatabase();
    const existing = await servicesRepository.findBySlug(db, validated.slug);
    if (existing) {
      return NextResponse.json({ success: false, error: { code: "CONFLICT", message: `Service with slug '${validated.slug}' already exists.` } }, { status: 409 });
    }

    const created = await servicesRepository.create(db, validated);

    await auditRepository.log(db, {
      actorId: auth.user.id,
      action: "service.create",
      entityType: "service",
      entityId: created.id,
      metadata: { slug: created.slug, title: created.title },
    });

    return NextResponse.json({ success: true, service: created }, { status: 201 });
  } catch (error) {
    logger.error("Failed to create service", {}, error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: (error as Error).message || "Failed to create service." } }, { status: 400 });
  }
}

