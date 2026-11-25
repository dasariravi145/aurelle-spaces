import React from "react";
import Link from "next/link";
import { requireAdminSession } from "@/lib/security/auth";
import { getDatabase } from "@/lib/db/client";
import { enquiriesRepository } from "@/lib/db/repositories/enquiries.repository";
import { adminUsersRepository } from "@/lib/db/repositories/admin-users.repository";
import { ENQUIRY_STATUS_CONFIG, projectTypeOptions } from "@/lib/validation/enquiry-schema";
import type { EnquiryRecord, EnquiryStatus } from "@/lib/db/types";

interface EnquiriesPageProps {
  searchParams: Promise<{
    status?: string;
    projectType?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function AdminEnquiriesPage({ searchParams }: EnquiriesPageProps) {
  await requireAdminSession();
  const params = await searchParams;

  const currentStatus = (params.status as EnquiryStatus | "all" | undefined) || "all";
  const currentProjectType = params.projectType || "all";
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);

  let enquiries: EnquiryRecord[] = [];
  let metrics = { total: 0, newCount: 0, qualifiedCount: 0, unassignedCount: 0 };
  const adminMap: Record<string, string> = {};

  try {
    const db = getDatabase();
    const result = await enquiriesRepository.list(
      db,
      {
        status: currentStatus !== "all" ? currentStatus : undefined,
        projectType: currentProjectType !== "all" ? currentProjectType : undefined,
        search,
      },
      { page, limit: 15 }
    );

    enquiries = result.data;
    metrics = await enquiriesRepository.getMetrics(db);

    const adminsList = await adminUsersRepository.list(db, { limit: 50 });
    for (const a of adminsList.data) {
      adminMap[a.id] = a.display_name;
    }
  } catch {
    // If D1 empty or local preview mode
  }

  const STATUS_TABS: Array<{ value: string; label: string }> = [
    { value: "all", label: "All Enquiries" },
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "qualified", label: "Qualified" },
    { value: "consultation_scheduled", label: "Scheduled" },
    { value: "proposal_sent", label: "Proposal Sent" },
    { value: "won", label: "Won" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#A17C55] block">
            Client Consultation Pipeline
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#242522]">
            Consultation Enquiries
          </h1>
          <p className="text-xs text-[#6B6C67] pt-1">
            Review prospective commissions, triage project briefs, and assign lead architects.
          </p>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] space-y-1">
          <span className="text-[0.68rem] font-mono uppercase tracking-wider text-[#6B6C67] block">
            Total Pipeline
          </span>
          <p className="font-serif text-2xl font-light text-[#242522]">{metrics.total}</p>
        </div>
        <div className="p-4 bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] space-y-1">
          <span className="text-[0.68rem] font-mono uppercase tracking-wider text-[#2B6CB0] block">
            New Leads
          </span>
          <p className="font-serif text-2xl font-light text-[#242522]">{metrics.newCount}</p>
        </div>
        <div className="p-4 bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] space-y-1">
          <span className="text-[0.68rem] font-mono uppercase tracking-wider text-[#285E61] block">
            Qualified Projects
          </span>
          <p className="font-serif text-2xl font-light text-[#242522]">{metrics.qualifiedCount}</p>
        </div>
        <div className="p-4 bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] space-y-1">
          <span className="text-[0.68rem] font-mono uppercase tracking-wider text-[#A17C55] block">
            Unassigned
          </span>
          <p className="font-serif text-2xl font-light text-[#242522]">{metrics.unassignedCount}</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-[#FFFFFF] border border-[#DCD5CB] p-4 rounded-[2px] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {STATUS_TABS.map((tab) => {
              const active = currentStatus === tab.value;
              return (
                <Link
                  key={tab.value}
                  href={`/admin/enquiries?status=${tab.value}&projectType=${currentProjectType}&search=${search}`}
                  className={`px-3 py-1.5 rounded-[2px] text-xs font-mono uppercase tracking-wider transition-colors ${
                    active
                      ? "bg-[#242522] text-[#F7F4EF]"
                      : "text-[#6B6C67] hover:bg-[#F7F4EF] hover:text-[#242522]"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Search & Discipline Filter Bar */}
        <form method="GET" action="/admin/enquiries" className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-[#DCD5CB]">
          <input type="hidden" name="status" value={currentStatus} />
          <div className="sm:col-span-7">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by client name, email or city..."
              className="w-full px-3 py-2 text-xs bg-[#F7F4EF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:outline-none focus:border-[#A17C55]"
            />
          </div>
          <div className="sm:col-span-3">
            <select
              name="projectType"
              defaultValue={currentProjectType}
              className="w-full px-3 py-2 text-xs bg-[#F7F4EF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:outline-none focus:border-[#A17C55]"
            >
              <option value="all">All Disciplines</option>
              {projectTypeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2 bg-[#242522] text-[#F7F4EF] text-xs font-mono uppercase tracking-wider rounded-[2px]"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Enquiries Data Table */}
      <div className="p-4 bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px]">
        {enquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#DCD5CB] text-[#6B6C67] font-mono uppercase tracking-wider">
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Discipline</th>
                  <th className="py-3 px-4">Budget / Area</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCD5CB]">
                {enquiries.map((enq) => {
                  const cfg = ENQUIRY_STATUS_CONFIG[enq.status] || {
                    label: enq.status,
                    badgeBg: "#EDF2F7",
                    badgeText: "#4A5568",
                    border: "#CBD5E0",
                  };
                  const assignedName = enq.assigned_admin_id ? adminMap[enq.assigned_admin_id] || "Assigned" : "Unassigned";

                  return (
                    <tr key={enq.id} className="hover:bg-[#F7F4EF] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-medium text-[#242522]">{enq.full_name}</p>
                          {(enq.enquiry_source === "ai_chatbot" || enq.enquiry_source === "chatbot") && (
                            <span className="px-1.5 py-0.5 text-[0.58rem] font-mono uppercase bg-[#F2EAE0] text-[#A17C55] border border-[#A17C55]/40 rounded-2xs">
                              AI Chatbot
                            </span>
                          )}
                        </div>
                        <p className="text-[0.68rem] text-[#6B6C67]">{enq.city}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-[#242522]">{enq.project_type}</p>
                        <p className="text-[0.68rem] text-[#6B6C67]">{enq.property_type || "—"}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[0.7rem]">
                        <p className="text-[#A17C55]">{enq.budget_range || "—"}</p>
                        <p className="text-[#6B6C67]">{enq.approximate_area || "—"}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className="inline-block px-2 py-0.5 text-[0.65rem] font-mono uppercase tracking-wider rounded-[2px] border"
                          style={{
                            backgroundColor: cfg.badgeBg,
                            color: cfg.badgeText,
                            borderColor: cfg.border,
                          }}
                        >
                          {cfg.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[0.7rem] text-[#6B6C67]">
                        {assignedName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[0.7rem] text-[#6B6C67]">
                        {new Date(enq.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/enquiries/${enq.id}`}
                          className="text-[#A17C55] hover:text-[#242522] font-mono text-[0.7rem] font-medium"
                        >
                          Review Brief →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center bg-[#F7F4EF] rounded-[2px] space-y-2">
            <p className="text-xs font-mono text-[#6B6C67]">No consultation briefs matching current filters.</p>
            <p className="text-[0.7rem] text-[#6B6C67]/70">
              When prospective clients submit scoping briefs via the website or conversational assistant, they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
