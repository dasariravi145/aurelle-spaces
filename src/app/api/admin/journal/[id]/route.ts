/**
 * Aurelle Spaces — Admin Single Journal Article API Route Handler
 * GET /api/admin/journal/[id]
 * PUT /api/admin/journal/[id]
 * PATCH /api/admin/journal/[id]
 * DELETE /api/admin/journal/[id]
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/security/auth";
import { hasPermission } from "@/lib/security/rbac";
import { getDatabase } from "@/lib/db/client";
import { articlesRepository } from "@/lib/db/repositories/articles.repository";
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
  const article = await articlesRepository.findById(db, id);

  if (!article) {
    return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Article not found." } }, { status: 404 });
  }

  return NextResponse.json({ success: true, article });
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
    const updated = await articlesRepository.update(db, id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Article not found." } }, { status: 404 });
    }

    await auditRepository.log(db, {
      actorId: auth.user.id,
      action: "article.update",
      entityType: "article",
      entityId: id,
      metadata: { slug: updated.slug, title: updated.title },
    });

    return NextResponse.json({ success: true, article: updated });
  } catch (error) {
    logger.error("Failed to update article", { id }, error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Failed to update article." } }, { status: 500 });
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
    await articlesRepository.updateStatus(db, id, body.status);
    await auditRepository.log(db, {
      actorId: auth.user.id,
      action: body.status === "published" ? "article.publish" : "article.unpublish",
      entityType: "article",
      entityId: id,
      metadata: { status: body.status },
    });
  }

  const updated = await articlesRepository.findById(db, id);
  return NextResponse.json({ success: true, article: updated });
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
  await articlesRepository.delete(db, id);

  await auditRepository.log(db, {
    actorId: auth.user.id,
    action: "article.delete",
    entityType: "article",
    entityId: id,
  });

  return NextResponse.json({ success: true, message: "Article deleted." });
}

