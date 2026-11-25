import React from "react";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/security/auth";
import { getDatabase } from "@/lib/db/client";
import { enquiriesRepository } from "@/lib/db/repositories/enquiries.repository";
import { enquiryNotesRepository } from "@/lib/db/repositories/enquiry-notes.repository";
import { adminUsersRepository } from "@/lib/db/repositories/admin-users.repository";
import { auditRepository } from "@/lib/db/repositories/audit.repository";
import { EnquiryDetailManager } from "@/components/admin/enquiry-detail-manager";
import type { EnquiryRecord, EnquiryNoteRecord, AdminUserRecord, AuditLogRecord } from "@/lib/db/types";

interface EnquiryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEnquiryDetailPage({ params }: EnquiryDetailPageProps) {
  await requireAdminSession();
  const { id } = await params;

  let enquiry: EnquiryRecord | null = null;
  let notes: EnquiryNoteRecord[] = [];
  let admins: AdminUserRecord[] = [];
  let auditLogs: AuditLogRecord[] = [];

  try {
    const db = getDatabase();
    enquiry = await enquiriesRepository.findById(db, id);

    if (enquiry) {
      notes = await enquiryNotesRepository.listByEnquiry(db, id);
      const adminsList = await adminUsersRepository.list(db, { limit: 50 });
      admins = adminsList.data.filter((a) => a.account_status === "active");
      auditLogs = await auditRepository.listByEntity(db, "enquiry", id);
    }
  } catch {
    // If D1 uninitialized
  }

  if (!enquiry) {
    notFound();
  }

  return (
    <EnquiryDetailManager
      enquiry={enquiry}
      notes={notes}
      admins={admins}
      auditLogs={auditLogs}
    />
  );
}

