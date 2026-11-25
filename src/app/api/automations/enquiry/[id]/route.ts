/**
 * Aurelle Spaces — Machine Integration API: Minimal Enquiry Reader
 * GET /api/automations/enquiry/[id]
 * 
 * Securely retrieves minimal authorised enquiry metadata for verified n8n automation workers.
 * Enforces machine bearer authentication or HMAC signature.
 * Never leaks internal system credentials or private chat histories.
 */

import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/client";
import { enquiriesRepository } from "@/lib/db/repositories/enquiries.repository";
import { authenticateMachineRequest } from "@/lib/security/machine-auth";
import { logger } from "@/lib/logging/logger";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteProps) {
  // 1. Authenticate machine client
  const auth = await authenticateMachineRequest(request);
  if (!auth.isAuthenticated) {
    return NextResponse.json(
      { success: false, error: auth.error || "Machine authentication required." },
      { status: auth.statusCode || 401 }
    );
  }

  const { id } = await params;
  if (!id || typeof id !== "string" || id.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: "Missing required enquiry ID parameter." },
      { status: 400 }
    );
  }

  try {
    const db = getDatabase();
    const enquiry = await enquiriesRepository.findByIdWithAssignee(db, id);

    if (!enquiry) {
      return NextResponse.json(
        { success: false, error: "Enquiry not found." },
        { status: 404 }
      );
    }

    // 2. Data minimisation: Return strictly necessary fields for automation workflows
    const safePayload = {
      enquiry_id: enquiry.id,
      reference_code: `AUR-${enquiry.id.slice(-6).toUpperCase()}`,
      client_name: enquiry.full_name,
      client_email: enquiry.email,
      client_phone: enquiry.phone || null,
      city: enquiry.city,
      project_type: enquiry.project_type,
      property_type: enquiry.property_type || null,
      approximate_area: enquiry.approximate_area || null,
      budget_range: enquiry.budget_range || null,
      expected_timeline: enquiry.expected_timeline || null,
      project_description: enquiry.project_description,
      status: enquiry.status,
      assigned_admin_id: enquiry.assigned_admin_id || null,
      assigned_admin_name: enquiry.assigned_admin_name || null,
      assigned_admin_email: enquiry.assigned_admin_email || null,
      submitted_at: enquiry.created_at,
    };

    return NextResponse.json({
      success: true,
      enquiry: safePayload,
    });
  } catch (error) {
    logger.error("Failed to retrieve enquiry for machine automation", { id }, error);
    return NextResponse.json(
      { success: false, error: "Database error retrieving enquiry details." },
      { status: 500 }
    );
  }
}

