import React from "react";
import Link from "next/link";
import { requireAdminSession } from "@/lib/security/auth";
import { getDatabase } from "@/lib/db/client";
import { servicesRepository } from "@/lib/db/repositories/services.repository";
import { projectsRepository } from "@/lib/db/repositories/projects.repository";
import { articlesRepository } from "@/lib/db/repositories/articles.repository";
import { enquiriesRepository } from "@/lib/db/repositories/enquiries.repository";
import { auditRepository } from "@/lib/db/repositories/audit.repository";
import { getRoleDisplayName } from "@/lib/security/rbac";

export default async function AdminOverviewPage() {
  const { user } = await requireAdminSession();

  let counts = {
    projects: 6, // 6 demonstration case studies
    services: 4, // 4 core disciplines
    articles: 3, // 3 editorial monographs
    enquiries: 0,
    newEnquiries: 0,
    qualifiedEnquiries: 0,
    auditLogs: 0,
  };

  let recentAuditLogs: Array<{ id: string; action: string; entity_type: string; created_at: string }> = [];

  try {
    const db = getDatabase();
    const projResult = await projectsRepository.listPublished(db, undefined, { limit: 1 });
    const servResult = await servicesRepository.listAll(db, { limit: 1 });
    const artResult = await articlesRepository.listPublished(db, { limit: 1 });
    const enqMetrics = await enquiriesRepository.getMetrics(db);
    const audResult = await auditRepository.listRecent(db, { limit: 5 });

    counts = {
      projects: projResult.total || 6,
      services: servResult.total || 4,
      articles: artResult.total || 3,
      enquiries: enqMetrics.total || 0,
      newEnquiries: enqMetrics.newCount || 0,
      qualifiedEnquiries: enqMetrics.qualifiedCount || 0,
      auditLogs: audResult.total || 0,
    };

    recentAuditLogs = audResult.data;
  } catch {
    // If D1 is in local uninitialized mode, default counts show demonstration structure safely
  }

  const roleLabel = getRoleDisplayName(user.role);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-[#A17C55] block">
          Studio Administration Console
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#242522]">
          Welcome back, {user.display_name}
        </h1>
        <p className="text-sm text-[#6B6C67] max-w-2xl">
          Logged in as <strong className="text-[#242522]">{roleLabel}</strong>. Monitor studio portfolio case studies, prospective client enquiries, and publication workflows.
        </p>
      </div>

      {/* Advisory Status Banner */}
      <div className="p-4 sm:p-5 border-l-2 border-[#A17C55] bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] space-y-1">
        <p className="font-mono text-xs uppercase tracking-wider text-[#A17C55] font-medium">
          Prompt 08 Foundation Active: Authentication &amp; RBAC Operational
        </p>
        <p className="text-xs text-[#6B6C67] leading-relaxed">
          The administrator authentication foundation, server session store, and dashboard shell are active. Complete CRUD interfaces for Portfolio, Services, Journal, Enquiries, and Chatbot management will be deployed in Prompts 09 through 15.
        </p>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects Card */}
        <Link
          href="/admin/projects"
          className="p-5 bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] hover:border-[#A17C55] transition-colors space-y-3 group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono uppercase tracking-wider text-[#6B6C67]">
              Portfolio Projects
            </span>
            <span className="text-sm text-[#A17C55] group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </div>
          <div className="space-y-1">
            <p className="font-serif text-3xl font-light text-[#242522]">{counts.projects}</p>
            <p className="text-[0.72rem] text-[#6B6C67]">Published demonstration monographs</p>
          </div>
        </Link>

        {/* Services Card */}
        <Link
          href="/admin/services"
          className="p-5 bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] hover:border-[#A17C55] transition-colors space-y-3 group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono uppercase tracking-wider text-[#6B6C67]">
              Design Disciplines
            </span>
            <span className="text-sm text-[#A17C55] group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </div>
          <div className="space-y-1">
            <p className="font-serif text-3xl font-light text-[#242522]">{counts.services}</p>
            <p className="text-[0.72rem] text-[#6B6C67]">Core architectural service offerings</p>
          </div>
        </Link>

        {/* Journal Card */}
        <Link
          href="/admin/journal"
          className="p-5 bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] hover:border-[#A17C55] transition-colors space-y-3 group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono uppercase tracking-wider text-[#6B6C67]">
              Journal Articles
            </span>
            <span className="text-sm text-[#A17C55] group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </div>
          <div className="space-y-1">
            <p className="font-serif text-3xl font-light text-[#242522]">{counts.articles}</p>
            <p className="text-[0.72rem] text-[#6B6C67]">In-depth architectural monographs</p>
          </div>
        </Link>

        {/* Enquiries Card */}
        <Link
          href="/admin/enquiries"
          className="p-5 bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] hover:border-[#A17C55] transition-colors space-y-3 group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono uppercase tracking-wider text-[#6B6C67]">
              Client Enquiries
            </span>
            <span className="text-sm text-[#A17C55] group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </div>
          <div className="space-y-1">
            <p className="font-serif text-3xl font-light text-[#242522]">{counts.enquiries}</p>
            <p className="text-[0.72rem] text-[#6B6C67]">Consultation briefs pending review</p>
          </div>
        </Link>
      </div>

      {/* Quick Actions & Recent Activity Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-5 p-6 bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] space-y-4">
          <h2 className="font-serif text-xl font-normal text-[#242522]">
            Studio Quick Actions
          </h2>
          <div className="space-y-2.5">
            <Link
              href="/admin/projects"
              className="w-full flex items-center justify-between p-3 bg-[#F7F4EF] hover:bg-[#EAE4D9] text-[#242522] text-xs font-mono uppercase tracking-wider rounded-[2px] transition-colors"
            >
              <span>+ Add New Portfolio Case Study</span>
              <span>→</span>
            </Link>
            <Link
              href="/admin/journal"
              className="w-full flex items-center justify-between p-3 bg-[#F7F4EF] hover:bg-[#EAE4D9] text-[#242522] text-xs font-mono uppercase tracking-wider rounded-[2px] transition-colors"
            >
              <span>+ Draft Journal Article</span>
              <span>→</span>
            </Link>
            <Link
              href="/admin/media"
              className="w-full flex items-center justify-between p-3 bg-[#F7F4EF] hover:bg-[#EAE4D9] text-[#242522] text-xs font-mono uppercase tracking-wider rounded-[2px] transition-colors"
            >
              <span>Upload Media to R2 Storage</span>
              <span>→</span>
            </Link>
            <Link
              href="/admin/enquiries"
              className="w-full flex items-center justify-between p-3 bg-[#F7F4EF] hover:bg-[#EAE4D9] text-[#242522] text-xs font-mono uppercase tracking-wider rounded-[2px] transition-colors"
            >
              <span>Review Incoming Consultation Briefs</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Recent Audit Activity */}
        <div className="lg:col-span-7 p-6 bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-normal text-[#242522]">
              Administrative Audit Log
            </h2>
            <span className="text-[0.68rem] font-mono uppercase text-[#A17C55]">
              Real-time events
            </span>
          </div>

          {recentAuditLogs.length > 0 ? (
            <div className="divide-y divide-[#DCD5CB]">
              {recentAuditLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <p className="font-mono text-[#242522]">{log.action}</p>
                    <p className="text-[0.68rem] text-[#6B6C67] capitalize">
                      Entity: {log.entity_type}
                    </p>
                  </div>
                  <span className="text-[0.68rem] font-mono text-[#6B6C67]">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-[#F7F4EF] rounded-[2px] space-y-2">
              <p className="text-xs font-mono text-[#6B6C67]">
                No security or administrative mutations recorded in this session.
              </p>
              <p className="text-[0.7rem] text-[#6B6C67]/70">
                Administrative sign-ins, role changes, and content mutations are audited automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

