/**
 * Aurelle Spaces — Admin Chat API Route Handler
 * GET /api/admin/chat
 * 
 * Provides authorized administrators (super_admin, editor) with access to
 * conversation metadata and volume statistics without exposing visitor privacy.
 */

import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/security/auth";
import { getDatabase } from "@/lib/db/client";
import { chatRepository } from "@/lib/db/repositories/chat.repository";
import { logger } from "@/lib/logging/logger";

export async function GET(request: Request) {
  try {
    // 1. Authenticate administrative session
    await requireAdminSession();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    let db;
    try {
      db = getDatabase();
    } catch {
      return NextResponse.json({
        data: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 1,
        stats: { total: 0, active: 0, qualified: 0, resolved: 0 },
      });
    }

    const conversations = await chatRepository.listRecentConversations(db, {
      page,
      limit,
    });

    const stats = await chatRepository.getConversationStats(db);

    return NextResponse.json({
      ...conversations,
      stats,
    });
  } catch (err: unknown) {
    logger.error("Error in GET /api/admin/chat", {}, err);
    return NextResponse.json(
      { error: "Failed to fetch chat conversations." },
      { status: 500 }
    );
  }
}

