"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { EnquiryRecord, EnquiryStatus, EnquiryNoteRecord, AdminUserRecord } from "@/lib/db/types";
import { ENQUIRY_STATUS_CONFIG } from "@/lib/validation/enquiry-schema";

interface EnquiryDetailManagerProps {
  enquiry: EnquiryRecord;
  notes: EnquiryNoteRecord[];
  admins: AdminUserRecord[];
  auditLogs: Array<{ id: string; action: string; created_at: string; safe_metadata: string | null }>;
}

const STATUS_OPTIONS: Array<{ value: EnquiryStatus; label: string }> = [
  { value: "new", label: "New Lead" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "consultation_scheduled", label: "Consultation Scheduled" },
  { value: "proposal_sent", label: "Proposal Sent" },
  { value: "won", label: "Commission Won" },
  { value: "lost", label: "Lost" },
  { value: "closed", label: "Closed / Archived" },
];

export function EnquiryDetailManager({
  enquiry,
  notes: initialNotes,
  admins,
  auditLogs,
}: EnquiryDetailManagerProps) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<EnquiryStatus>(enquiry.status);
  const [assignedAdminId, setAssignedAdminId] = useState<string | null>(enquiry.assigned_admin_id);
  const [notes, setNotes] = useState<EnquiryNoteRecord[]>(initialNotes);
  const [newNote, setNewNote] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingAssignee, setSavingAssignee] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const statusConfig = ENQUIRY_STATUS_CONFIG[currentStatus] || {
    label: currentStatus,
    badgeBg: "#EDF2F7",
    badgeText: "#4A5568",
    border: "#CBD5E0",
  };

  const handleStatusChange = async (newVal: EnquiryStatus) => {
    setSavingStatus(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/enquiries/${enquiry.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newVal }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setCurrentStatus(newVal);
        setFeedback(`Status updated to ${data.enquiry?.status || newVal}.`);
        router.refresh();
      } else {
        alert(data?.error?.message || "Failed to update status.");
      }
    } finally {
      setSavingStatus(false);
    }
  };

  const handleAssigneeChange = async (newAdminId: string) => {
    setSavingAssignee(true);
    setFeedback(null);

    const val = newAdminId === "" ? null : newAdminId;

    try {
      const res = await fetch(`/api/admin/enquiries/${enquiry.id}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedAdminId: val }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setAssignedAdminId(val);
        setFeedback("Lead assignment updated.");
        router.refresh();
      } else {
        alert(data?.error?.message || "Failed to assign administrator.");
      }
    } finally {
      setSavingAssignee(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setAddingNote(true);

    try {
      const res = await fetch(`/api/admin/enquiries/${enquiry.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote.trim() }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success && data?.note) {
        setNotes((prev) => [...prev, data.note]);
        setNewNote("");
        router.refresh();
      } else {
        alert(data?.error?.message || "Failed to save note.");
      }
    } finally {
      setAddingNote(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Action Bar & Status Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#FFFFFF] border border-[#DCD5CB] p-6 rounded-[2px]">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-xs uppercase tracking-wider text-[#A17C55]">
              Ref: {enquiry.id}
            </span>
            {(enquiry.enquiry_source === "ai_chatbot" || enquiry.enquiry_source === "chatbot") && (
              <span className="px-2 py-0.5 text-[0.65rem] font-mono uppercase bg-[#F2EAE0] text-[#A17C55] border border-[#A17C55]/40 rounded-xs">
                Source: AI Chatbot
              </span>
            )}
            <span
              className="px-2.5 py-0.5 text-[0.68rem] font-mono uppercase tracking-wider rounded-[2px] border"
              style={{
                backgroundColor: statusConfig.badgeBg,
                color: statusConfig.badgeText,
                borderColor: statusConfig.border,
              }}
            >
              {statusConfig.label}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#242522]">
            {enquiry.full_name}
          </h1>
          <p className="text-xs text-[#6B6C67]">
            {enquiry.city} · Submitted on {new Date(enquiry.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/admin/enquiries"
            className="px-4 py-2 border border-[#DCD5CB] text-xs font-mono uppercase tracking-wider text-[#6B6C67] hover:text-[#242522] rounded-[2px]"
          >
            ← Back to Enquiries
          </Link>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-[#F2F7F2] border-l-2 border-[#4A7C59] text-xs text-[#4A7C59] rounded-[2px]">
          {feedback}
        </div>
      )}

      {/* Main Grid: Details + Triage Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Contact & Spatial Brief */}
        <div className="lg:col-span-8 space-y-6">
          {/* Customer Contact Details */}
          <div className="bg-[#FFFFFF] border border-[#DCD5CB] p-6 rounded-[2px] space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A17C55] block">
              01 / Client Profile
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#6B6C67] uppercase font-mono text-[0.68rem] block">Full Name</span>
                <p className="text-sm font-medium text-[#242522]">{enquiry.full_name}</p>
              </div>
              <div>
                <span className="text-[#6B6C67] uppercase font-mono text-[0.68rem] block">Email Address</span>
                <a
                  href={`mailto:${enquiry.email}`}
                  className="text-sm text-[#A17C55] hover:underline"
                >
                  {enquiry.email} ↗
                </a>
              </div>
              <div>
                <span className="text-[#6B6C67] uppercase font-mono text-[0.68rem] block">Mobile Contact</span>
                {enquiry.phone ? (
                  <a href={`tel:${enquiry.phone}`} className="text-sm text-[#242522] hover:text-[#A17C55]">
                    {enquiry.phone} ↗
                  </a>
                ) : (
                  <p className="text-sm text-[#6B6C67] italic">Not provided</p>
                )}
              </div>
              <div>
                <span className="text-[#6B6C67] uppercase font-mono text-[0.68rem] block">Location / City</span>
                <p className="text-sm text-[#242522]">{enquiry.city}</p>
              </div>
            </div>
          </div>

          {/* Spatial Requirements & Narrative */}
          <div className="bg-[#FFFFFF] border border-[#DCD5CB] p-6 rounded-[2px] space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A17C55] block">
              02 / Architectural Scope
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-b border-[#DCD5CB] pb-4">
              <div>
                <span className="text-[#6B6C67] uppercase font-mono text-[0.68rem] block">Discipline</span>
                <p className="font-medium text-[#242522]">{enquiry.project_type}</p>
              </div>
              <div>
                <span className="text-[#6B6C67] uppercase font-mono text-[0.68rem] block">Typology</span>
                <p className="text-[#242522]">{enquiry.property_type || "—"}</p>
              </div>
              <div>
                <span className="text-[#6B6C67] uppercase font-mono text-[0.68rem] block">Approx Area</span>
                <p className="text-[#242522]">{enquiry.approximate_area || "—"}</p>
              </div>
              <div>
                <span className="text-[#6B6C67] uppercase font-mono text-[0.68rem] block">Budget Bracket</span>
                <p className="text-[#A17C55] font-mono">{enquiry.budget_range || "—"}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[#6B6C67] uppercase font-mono text-[0.68rem] block">
                Project Narrative &amp; Client Objectives
              </span>
              <div className="p-4 bg-[#F7F4EF] rounded-[2px] text-xs sm:text-sm text-[#242522] leading-relaxed whitespace-pre-wrap">
                {enquiry.project_description}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[0.7rem] text-[#6B6C67] font-mono">
              <span>Timeline: {enquiry.expected_timeline || "Exploratory"}</span>
              <span>Source: {enquiry.enquiry_source}</span>
              <span>Consent: Verified ({new Date(enquiry.consent_at).toLocaleDateString()})</span>
            </div>
          </div>

          {/* Activity Timeline (Task 11) */}
          <div className="bg-[#FFFFFF] border border-[#DCD5CB] p-6 rounded-[2px] space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A17C55] block">
              03 / Activity &amp; Audit History
            </span>

            <div className="space-y-3">
              {/* Event 1: Creation */}
              <div className="flex items-start gap-3 text-xs border-l-2 border-[#A17C55] pl-3 py-1">
                <div className="space-y-0.5">
                  <p className="font-medium text-[#242522]">Enquiry submitted by client</p>
                  <p className="text-[0.68rem] text-[#6B6C67] font-mono">
                    {new Date(enquiry.created_at).toLocaleString()} · Source: {enquiry.enquiry_source}
                  </p>
                </div>
              </div>

              {/* Audit trail items */}
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-xs border-l-2 border-[#DCD5CB] pl-3 py-1">
                  <div className="space-y-0.5">
                    <p className="font-mono text-[#242522]">{log.action}</p>
                    <p className="text-[0.68rem] text-[#6B6C67] font-mono">
                      {new Date(log.created_at).toLocaleString()}
                      {log.safe_metadata && ` · ${log.safe_metadata}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Lead Triage, Admin Assignment & Notes */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status Management */}
          <div className="bg-[#FFFFFF] border border-[#DCD5CB] p-6 rounded-[2px] space-y-4">
            <h3 className="font-serif text-lg font-normal text-[#242522]">
              Lead Triage Status
            </h3>
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#6B6C67]">
                Current Status
              </label>
              <select
                value={currentStatus}
                disabled={savingStatus}
                onChange={(e) => handleStatusChange(e.target.value as EnquiryStatus)}
                className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:border-[#A17C55] focus:outline-none cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Admin Assignment (Task 9) */}
            <div className="space-y-2 pt-2 border-t border-[#DCD5CB]">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#6B6C67]">
                Assigned Architect / Director
              </label>
              <select
                value={assignedAdminId || ""}
                disabled={savingAssignee}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:border-[#A17C55] focus:outline-none cursor-pointer"
              >
                <option value="">— Unassigned —</option>
                {admins.map((adm) => (
                  <option key={adm.id} value={adm.id}>
                    {adm.display_name} ({adm.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Internal Notes (Task 10) */}
          <div className="bg-[#FFFFFF] border border-[#DCD5CB] p-6 rounded-[2px] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-normal text-[#242522]">
                Internal Notes
              </h3>
              <span className="text-[0.65rem] font-mono text-[#A17C55] uppercase">
                Studio Eyes Only
              </span>
            </div>

            {/* Notes List */}
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <div key={note.id} className="p-3 bg-[#F7F4EF] rounded-[2px] space-y-1 text-xs">
                    <div className="flex justify-between items-center text-[0.65rem] font-mono text-[#6B6C67]">
                      <span className="font-medium text-[#242522]">{note.author_name}</span>
                      <span>{new Date(note.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[#242522] leading-relaxed whitespace-pre-wrap">{note.note_content}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#6B6C67] italic py-2">
                  No internal notes recorded yet.
                </p>
              )}
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-[#DCD5CB]">
              <textarea
                rows={3}
                placeholder="Add confidential scoping note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                disabled={addingNote}
                className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:border-[#A17C55] focus:outline-none leading-relaxed"
              />
              <button
                type="submit"
                disabled={addingNote || !newNote.trim()}
                className="w-full py-2 bg-[#242522] hover:bg-[#3A3B37] text-[#F7F4EF] text-xs font-mono uppercase tracking-wider rounded-[2px] disabled:opacity-50 transition-colors"
              >
                {addingNote ? "Saving Note..." : "+ Add Internal Note"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

