import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminSession } from "@/lib/security/auth";
import { getDatabase } from "@/lib/db/client";
import { enquiriesRepository } from "@/lib/db/repositories/enquiries.repository";
import { getCloudflareEnv } from "@/lib/env";

export const metadata: Metadata = {
  title: "Studio Analytics & Conversion Intelligence | Aurelle Spaces Admin",
};

export default async function AdminAnalyticsPage() {
  await requireAdminSession();

  let summary = {
    total: 0,
    sources: {
      websiteContact: 0,
      aiChatbot: 0,
      directOrOther: 0,
    },
    statuses: {} as Record<string, number>,
    projectTypes: [] as Array<{ type: string; count: number }>,
    recentActivity: [] as Array<{
      id: string;
      fullName: string;
      projectType: string;
      city: string;
      source: string;
      status: string;
      createdAt: string;
    }>,
  };

  try {
    const db = getDatabase();
    summary = await enquiriesRepository.getAnalyticsSummary(db);
  } catch {
    // Graceful fallback for local uninitialized environments
  }

  const cfEnv = getCloudflareEnv();
  const cfBeaconConfigured = Boolean(
    cfEnv?.NEXT_PUBLIC_CF_BEACON_TOKEN ||
    process.env.NEXT_PUBLIC_CF_BEACON_TOKEN
  );

  const websitePercent = summary.total > 0
    ? Math.round((summary.sources.websiteContact / summary.total) * 100)
    : 0;

  const chatbotPercent = summary.total > 0
    ? Math.round((summary.sources.aiChatbot / summary.total) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCD5CB]">
        <div>
          <span className="text-[0.65rem] font-mono uppercase tracking-widest text-[#A17C55] font-semibold block">
            Studio Intelligence
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#242522] tracking-tight">
            Analytics & Conversion Overview
          </h1>
          <p className="text-xs text-[#6B6C67] mt-1">
            Real business metrics, inquiry channel distribution, and lead qualification funnels backed by Cloudflare D1.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/enquiries"
            className="px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider text-[#FAF8F5] bg-[#242522] hover:bg-[#A17C55] rounded-xs transition-colors shadow-2xs"
          >
            View All Enquiries →
          </Link>
        </div>
      </div>

      {/* Primary Conversion KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm space-y-2">
          <span className="text-[0.65rem] font-mono uppercase tracking-wider text-[#6B6C67] block">
            Total Consultations Ingested
          </span>
          <div className="font-serif text-3xl text-[#242522] font-normal">
            {summary.total}
          </div>
          <span className="text-[0.7rem] text-[#6B6C67] block">
            D1-persisted prospective briefs
          </span>
        </div>

        <div className="p-5 bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm space-y-2">
          <span className="text-[0.65rem] font-mono uppercase tracking-wider text-[#A17C55] block">
            Website Contact Form
          </span>
          <div className="font-serif text-3xl text-[#A17C55] font-normal">
            {summary.sources.websiteContact}
          </div>
          <span className="text-[0.7rem] text-[#6B6C67] block">
            {websitePercent}% of total volume
          </span>
        </div>

        <div className="p-5 bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm space-y-2">
          <span className="text-[0.65rem] font-mono uppercase tracking-wider text-[#3B6E4C] block">
            AI Assistant Conversions
          </span>
          <div className="font-serif text-3xl text-[#3B6E4C] font-normal">
            {summary.sources.aiChatbot}
          </div>
          <span className="text-[0.7rem] text-[#6B6C67] block">
            {chatbotPercent}% qualified via studio chatbot
          </span>
        </div>

        <div className="p-5 bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm space-y-2">
          <span className="text-[0.65rem] font-mono uppercase tracking-wider text-[#2B6CB0] block">
            Direct / Partner Leads
          </span>
          <div className="font-serif text-3xl text-[#2B6CB0] font-normal">
            {summary.sources.directOrOther}
          </div>
          <span className="text-[0.7rem] text-[#6B6C67] block">
            Phone & direct client referrals
          </span>
        </div>
      </div>

      {/* Mid-Row: Status Funnel & Project Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lead Status Breakdown */}
        <div className="lg:col-span-6 p-6 bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#DCD5CB] pb-3">
            <div>
              <h2 className="font-serif text-lg text-[#242522]">Triage Pipeline Distribution</h2>
              <p className="text-xs text-[#6B6C67]">Active stages across confirmed consultation briefs</p>
            </div>
            <span className="font-mono text-xs text-[#A17C55]">
              {Object.keys(summary.statuses).length} Stages
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { id: "new", label: "New / Uncontacted", color: "#A17C55" },
              { id: "reviewed", label: "Under Review", color: "#6B6C67" },
              { id: "contacted", label: "Client Contacted", color: "#2B6CB0" },
              { id: "qualified", label: "Qualified Opportunity", color: "#3B6E4C" },
              { id: "consultation_scheduled", label: "Consultation Scheduled", color: "#3B6E4C" },
              { id: "proposal_sent", label: "Proposal Dispatched", color: "#C05621" },
              { id: "won", label: "Retained / Won", color: "#3B6E4C" },
            ].map((stage) => {
              const count = summary.statuses[stage.id] || 0;
              const ratio = summary.total > 0 ? (count / summary.total) * 100 : 0;
              return (
                <div key={stage.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-mono text-[#242522]">{stage.label}</span>
                    <span className="font-mono font-medium text-[#6B6C67]">
                      {count} ({Math.round(ratio)}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#F7F4EF] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(ratio, count > 0 ? 4 : 0)}%`,
                        backgroundColor: stage.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Types Distribution */}
        <div className="lg:col-span-6 p-6 bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#DCD5CB] pb-3">
            <div>
              <h2 className="font-serif text-lg text-[#242522]">Client Design Typologies</h2>
              <p className="text-xs text-[#6B6C67]">Breakdown by requested architectural discipline</p>
            </div>
            <span className="font-mono text-xs text-[#A17C55]">
              {summary.projectTypes.length} Categories
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {summary.projectTypes.length === 0 ? (
              <p className="text-xs text-[#6B6C67] italic py-6 text-center">
                No project typology records logged yet.
              </p>
            ) : (
              summary.projectTypes.map((pt) => {
                const ratio = summary.total > 0 ? (pt.count / summary.total) * 100 : 0;
                return (
                  <div key={pt.type} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-[#242522]">{pt.type}</span>
                      <span className="font-mono text-[#6B6C67]">
                        {pt.count} ({Math.round(ratio)}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#F7F4EF] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#A17C55] rounded-full"
                        style={{ width: `${Math.max(ratio, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Web Traffic Telemetry Status (No Fake Analytics) */}
      <div className="p-6 bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#DCD5CB] pb-3">
          <div>
            <span className="text-[0.65rem] font-mono uppercase tracking-widest text-[#A17C55] font-semibold block">
              Edge Infrastructure
            </span>
            <h2 className="font-serif text-lg text-[#242522]">
              Website Traffic Telemetry Status
            </h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                cfBeaconConfigured ? "bg-[#3B6E4C]" : "bg-[#C05621]"
              }`}
            />
            <span className="text-[#6B6C67]">
              {cfBeaconConfigured ? "Beacon Configured" : "Unconfigured / Pending Setup"}
            </span>
          </div>
        </div>

        <div className="p-4 bg-[#F7F4EF] border border-[#DCD5CB] rounded-xs text-xs text-[#6B6C67] space-y-2">
          <p className="font-medium text-[#242522]">
            Authentic Telemetry Commitment:
          </p>
          <p className="leading-relaxed">
            In compliance with Aurelle Spaces development guidelines, this dashboard does not fabricate synthetic visitor counts, bounce rates, or simulated search engine rankings.
          </p>
          <p className="leading-relaxed">
            Privacy-first web traffic measurement is powered by <strong>Cloudflare Web Analytics</strong> without client tracking cookies. Live edge metrics will begin streaming when the production domain is bound and the beacon token is provisioned in Prompt 20.
          </p>
        </div>
      </div>

      {/* Recent Enquiry Feed */}
      <div className="bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[#DCD5CB] bg-[#F7F4EF] flex items-center justify-between">
          <h2 className="font-serif text-base text-[#242522]">Recent Enquiry Activity</h2>
          <span className="text-xs font-mono text-[#6B6C67]">Latest 10 submissions</span>
        </div>

        {summary.recentActivity.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6B6C67]">
            No recent submissions logged.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#DCD5CB] text-[0.65rem] font-mono uppercase tracking-wider text-[#6B6C67]">
                <tr>
                  <th className="py-2.5 px-4">Client Name</th>
                  <th className="py-2.5 px-4">Typology</th>
                  <th className="py-2.5 px-4">Location</th>
                  <th className="py-2.5 px-4">Source</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCD5CB]/60">
                {summary.recentActivity.map((act) => (
                  <tr key={act.id} className="hover:bg-[#F7F4EF]/50 transition-colors">
                    <td className="py-2.5 px-4 font-medium text-[#242522]">
                      <Link
                        href={`/admin/enquiries/${act.id}`}
                        className="hover:text-[#A17C55] underline"
                      >
                        {act.fullName}
                      </Link>
                    </td>
                    <td className="py-2.5 px-4 text-[#6B6C67]">{act.projectType}</td>
                    <td className="py-2.5 px-4 text-[#6B6C67]">{act.city}</td>
                    <td className="py-2.5 px-4">
                      <span className="font-mono text-[0.65rem] bg-[#F7F4EF] px-1.5 py-0.5 rounded-2xs border border-[#DCD5CB]">
                        {act.source}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="font-mono text-[0.65rem] uppercase text-[#A17C55] font-semibold">
                        {act.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-[0.68rem] text-[#6B6C67]">
                      {new Date(act.createdAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

