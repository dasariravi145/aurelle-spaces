/**
 * Aurelle Spaces — Machine Integration API: Webhook & Downstream Delivery Callback
 * POST /api/automations/callback
 * 
 * Ingests execution outcomes from n8n workflows and downstream notification providers
 * (e.g. Resend, SMTP) to maintain real delivery statuses and enforce idempotency.
 */

import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/client";
import { automationRepository } from "@/lib/db/repositories/automation.repository";
import { authenticateMachineRequest } from "@/lib/security/machine-auth";
import { AutomationDeliveryCallbackPayload } from "@/lib/automation/types";
import { logger } from "@/lib/logging/logger";

export async function POST(request: Request) {
  // Read raw bytes for HMAC signature or bearer verification
  const rawBodyBytes = new Uint8Array(await request.arrayBuffer());

  const auth = await authenticateMachineRequest(request, rawBodyBytes);
  if (!auth.isAuthenticated) {
    return NextResponse.json(
      { success: false, error: auth.error || "Machine authentication required." },
      { status: auth.statusCode || 401 }
    );
  }

  let body: AutomationDeliveryCallbackPayload | null = null;
  try {
    const text = new TextDecoder().decode(rawBodyBytes);
    body = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { success: false, error: "Malformed JSON payload." },
      { status: 400 }
    );
  }

  if (!body || !body.idempotency_key || !body.entity_id || !body.status) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing required fields: idempotency_key, entity_id, and status are mandatory.",
      },
      { status: 400 }
    );
  }

  try {
    const db = getDatabase();

    // Check if client just requested an idempotency check (pre-flight check)
    const { searchParams } = new URL(request.url);
    if (searchParams.get("check_only") === "true") {
      const alreadyDelivered = await automationRepository.checkIdempotencyKey(
        db,
        body.idempotency_key
      );
      return NextResponse.json({
        success: true,
        alreadyDelivered,
        idempotencyKey: body.idempotency_key,
      });
    }

    // Persist real delivery outcome
    const recorded = await automationRepository.recordDeliveryRecord(db, body);

    logger.info("Automation delivery outcome recorded", {
      workflow: body.workflow_name,
      purpose: body.purpose,
      entityId: body.entity_id,
      status: body.status,
    });

    return NextResponse.json({
      success: true,
      recorded,
      message: "Delivery record updated successfully.",
    });
  } catch (err) {
    logger.error("Failed to record delivery outcome callback", {}, err);
    return NextResponse.json(
      { success: false, error: "Failed to persist delivery outcome." },
      { status: 500 }
    );
  }
}

