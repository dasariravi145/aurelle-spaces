/**
 * Aurelle Spaces — Current Admin Session Route Handler
 * GET /api/admin/auth/me
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/security/auth";

export async function GET() {
  const authContext = await getAdminSession();

  if (!authContext) {
    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: authContext.user.id,
      email: authContext.user.email,
      displayName: authContext.user.display_name,
      role: authContext.user.role,
    },
  });
}

