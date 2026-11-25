/**
 * Aurelle Spaces — Chatbot-to-Enquiry Conversion API
 * POST /api/chat/enquiry
 * 
 * Safely converts an AI-qualified conversation into a formal studio enquiry with
 * explicit affirmative consent, session ownership verification, duplicate prevention,
 * and Cloudflare D1 persistence.
 */

import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/client";
import { chatRepository } from "@/lib/db/repositories/chat.repository";
import { enquiriesRepository } from "@/lib/db/repositories/enquiries.repository";
import { automationRepository } from "@/lib/db/repositories/automation.repository";
import { auditRepository } from "@/lib/db/repositories/audit.repository";
import { validateServerEnquiry } from "@/lib/validation/enquiry-schema";
import { CHAT_SESSION_COOKIE } from "@/lib/chat/session";
import { CreateChatEnquiryRequest } from "@/lib/chat/types";
import { validateRequestOrigin } from "@/lib/security/origin";
import { logger } from "@/lib/logging/logger";

const SUCCESS_MESSAGE =
  "Thank you. Your project enquiry has been received. The team can review the details you shared and contact you using the information provided.";

export async function POST(request: Request) {
  try {
    // 0. Enforce origin & CSRF guard
    const originCheck = validateRequestOrigin(request);
    if (!originCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: originCheck.reason || "Forbidden origin.",
        },
        { status: 403 }
      );
    }

    // 1. Payload size guard (max 32KB)
    const contentLength = parseInt(
      request.headers.get("content-length") || "0",
      10
    );
    if (contentLength > 32 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: "Payload exceeds maximum permitted size of 32KB.",
        },
        { status: 413 }
      );
    }

    const body = (await request.json().catch(() => null)) as CreateChatEnquiryRequest | null;

    if (!body || !body.conversationId || !body.leadData) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required conversation or lead qualification data.",
        },
        { status: 400 }
      );
    }

    // 2. Explicit Privacy Consent Check (Mandatory Affirmative Consent)
    if (!body.consentGiven) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Explicit privacy consent is required before saving your project enquiry.",
        },
        { status: 400 }
      );
    }

    // 3. Verify Session Ownership
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader
        .split(";")
        .map((c) => c.trim().split("="))
        .filter(([k]) => Boolean(k))
    );
    const sessionToken = cookies[CHAT_SESSION_COOKIE];

    if (!sessionToken) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Chat session has expired or is invalid. Please start a new conversation.",
        },
        { status: 401 }
      );
    }

    let db;
    try {
      db = getDatabase();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Database service is currently unavailable. Please use our direct contact page.",
        },
        { status: 503 }
      );
    }

    // 4. Verify conversation exists and belongs to the active session
    const conversation = await chatRepository.findConversationBySession(
      db,
      sessionToken
    );

    if (!conversation || conversation.id !== body.conversationId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Conversation ownership verification failed. You may only convert your own chat session.",
        },
        { status: 403 }
      );
    }

    // Check if conversation was already converted to an enquiry
    if (conversation.linked_enquiry_id) {
      const existingEnquiry = await enquiriesRepository.findById(
        db,
        conversation.linked_enquiry_id
      );
      if (existingEnquiry) {
        return NextResponse.json({
          success: true,
          enquiryId: existingEnquiry.id,
          referenceCode: `AUR-${existingEnquiry.id.slice(-6).toUpperCase()}`,
          message: SUCCESS_MESSAGE,
        });
      }
    }

    // 5. Server-Side Validation using canonical enquiry contract
    const serverValidation = validateServerEnquiry({
      fullName: body.leadData.fullName,
      email: body.leadData.email,
      mobileNumber: body.leadData.mobileNumber,
      city: body.leadData.city,
      projectType: body.leadData.projectType,
      propertyType: body.leadData.propertyType,
      approximateArea: body.leadData.approximateArea,
      budgetRange: body.leadData.budgetRange,
      expectedTimeline: body.leadData.expectedTimeline,
      projectDescription: body.leadData.projectDescription,
      privacyConsent: true,
      idempotencyKey: body.idempotencyKey,
    });

    if (!serverValidation.isValid || !serverValidation.data) {
      return NextResponse.json(
        {
          success: false,
          error: "Please review the highlighted project details.",
          details: serverValidation.errors,
        },
        { status: 400 }
      );
    }

    // 6. Idempotency & Duplicate Protection Check
    if (body.idempotencyKey) {
      const existingByIdempotency = await enquiriesRepository.findByIdempotencyKey(
        db,
        body.idempotencyKey
      );
      if (existingByIdempotency) {
        return NextResponse.json({
          success: true,
          enquiryId: existingByIdempotency.id,
          referenceCode: `AUR-${existingByIdempotency.id.slice(-6).toUpperCase()}`,
          message: SUCCESS_MESSAGE,
        });
      }
    }

    const recentDuplicate = await enquiriesRepository.findRecentDuplicate(
      db,
      serverValidation.data.email,
      serverValidation.data.projectType,
      5 // 5-minute sliding deduplication window
    );

    if (recentDuplicate) {
      return NextResponse.json({
        success: true,
        enquiryId: recentDuplicate.id,
        referenceCode: `AUR-${recentDuplicate.id.slice(-6).toUpperCase()}`,
        message: SUCCESS_MESSAGE,
      });
    }

    // 7. Persist Enquiry to Cloudflare D1
    const enquiry = await enquiriesRepository.create(db, {
      ...serverValidation.data,
      source: "chatbot",
      idempotencyKey: body.idempotencyKey || null,
    });

    // 8. Link Enquiry to Chat Conversation
    await db
      .prepare(
        `UPDATE chat_conversations 
         SET linked_enquiry_id = ?, 
             conversation_status = 'qualified_lead', 
             consent_state = 1,
             lead_state = ?, 
             updated_at = datetime('now')
         WHERE id = ?`
      )
      .bind(
        enquiry.id,
        JSON.stringify({
          ...body.leadData,
          stage: "submitted",
          linkedEnquiryId: enquiry.id,
          submittedAt: new Date().toISOString(),
        }),
        conversation.id
      )
      .run()
      .catch((err) => {
        logger.error("Failed to link chat conversation to enquiry", { conversationId: conversation.id }, err);
      });

    // Also update enquiries with conversation_id
    await db
      .prepare(`UPDATE enquiries SET conversation_id = ? WHERE id = ?`)
      .bind(conversation.id, enquiry.id)
      .run()
      .catch(() => {});

    // Record system notification message inside chat thread
    await chatRepository.addMessage(
      db,
      conversation.id,
      "system",
      `Project enquiry created successfully. Reference: AUR-${enquiry.id.slice(-6).toUpperCase()}`
    );

    // 9. Enqueue Automation Event for Downstream Workflows (Prompt 14)
    try {
      await automationRepository.createEvent(db, {
        eventType: "enquiry.created",
        relatedEntityId: enquiry.id,
        payloadReference: JSON.stringify({
          enquiryId: enquiry.id,
          referenceCode: `AUR-${enquiry.id.slice(-6).toUpperCase()}`,
          source: "ai_chatbot",
          fullName: enquiry.full_name,
          email: enquiry.email,
          city: enquiry.city,
          projectType: enquiry.project_type,
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch (err) {
      logger.warn("Non-fatal: failed to enqueue automation event for chatbot enquiry", { id: enquiry.id }, err);
    }

    // 10. Record Immutable Audit Log
    try {
      await auditRepository.log(db, {
        actorId: "chatbot_visitor",
        action: "enquiry.created_from_chat",
        entityType: "enquiry",
        entityId: enquiry.id,
        metadata: {
          conversationId: conversation.id,
          source: "ai_chatbot",
          city: enquiry.city,
          projectType: enquiry.project_type,
        },
      });
    } catch {
      // Non-fatal
    }

    const referenceCode = `AUR-${enquiry.id.slice(-6).toUpperCase()}`;

    return NextResponse.json(
      {
        success: true,
        enquiryId: enquiry.id,
        referenceCode,
        message: SUCCESS_MESSAGE,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    logger.error("Unhandled error in POST /api/chat/enquiry", {}, error);
    return NextResponse.json(
      {
        success: false,
        error:
          "An unexpected error occurred while saving your enquiry. Please use our contact page or try again.",
      },
      { status: 500 }
    );
  }
}

