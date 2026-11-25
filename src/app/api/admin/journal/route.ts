/**
 * Aurelle Spaces — Admin Journal Articles API Route Handler
 * GET /api/admin/journal
 * POST /api/admin/journal
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/security/auth";
import { hasPermission } from "@/lib/security/rbac";
import { getDatabase } from "@/lib/db/client";
import { articlesRepository } from "@/lib/db/repositories/articles.repository";
import { auditRepository } from "@/lib/db/repositories/audit.repository";
import { validateCreateArticle } from "@/lib/validation/article-schema";
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
    const result = await articlesRepository.listAll(db, { page, limit });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    logger.error("Failed to list journal articles", {}, error);
    return NextResponse.json({ success: false, error: { code: "DATABASE_ERROR", message: "Failed to retrieve articles." } }, { status: 500 });
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
    const validated = validateCreateArticle(body);

    const db = getDatabase();
    const existing = await articlesRepository.findBySlug(db, validated.slug);
    if (existing) {
      return NextResponse.json({ success: false, error: { code: "CONFLICT", message: `An article with slug '${validated.slug}' already exists.` } }, { status: 409 });
    }

    const created = await articlesRepository.create(db, validated);

    await auditRepository.log(db, {
      actorId: auth.user.id,
      action: "article.create",
      entityType: "article",
      entityId: created.id,
      metadata: { slug: created.slug, title: created.title },
    });

    return NextResponse.json({ success: true, article: created }, { status: 201 });
  } catch (error) {
    logger.error("Failed to create article", {}, error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: (error as Error).message || "Failed to create article." } }, { status: 400 });
  }
}

