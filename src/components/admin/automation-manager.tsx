"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AutomationEventRecord, ProcessingStatus } from "@/lib/db/types";
import type { StudioNotificationSettings } from "@/lib/automation/types";

export interface AutomationManagerProps {
  initialEvents: AutomationEventRecord[];
  initialMetrics: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    retrying: number;
    deadLetter: number;
  };
  initialSettings?: StudioNotificationSettings;
  userRole?: string;
  config: {
    isConfigured: boolean;
    isEnabled: boolean;
    maxRetries: number;
  };
}

const STATUS_BADGES: Record<
  ProcessingStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  pending: { label: "Pending", bg: "#F2EAE0", text: "#A17C55", border: "#A17C55]/40" },
  processing: { label: "In Flight", bg: "#EBF8FF", text: "#2B6CB0", border: "#BEE3F8" },
  completed: { label: "Delivered", bg: "#E6F4EA", text: "#3B6E4C", border: "#3B6E4C]/40" },
  retrying: { label: "Retry Scheduled", bg: "#FFFAF0", text: "#C05621", border: "#FBD38D" },
  dead_letter: { label: "Permanently Failed", bg: "#FFF5F5", text: "#A83E3E", border: "#A83E3E]/40" },
  failed: { label: "Failed", bg: "#FFF5F5", text: "#A83E3E", border: "#A83E3E]/40" },
};

const WORKFLOW_MAP: Record<string, { name: string; description: string; tagBg: string; tagText: string }> = {
  "enquiry.created": {
    name: "New Enquiry Notification & Client Ack",
    description: "Dispatches studio team alert and respectful client confirmation",
    tagBg: "#FAF0E6",
    tagText: "#8C5835",
  },
  "enquiry.assigned": {
    name: "Lead Assignment Notification",
    description: "Alerts the assigned architect of new consultation brief",
    tagBg: "#EDF2F7",
    tagText: "#2B6CB0",
  },
  "enquiry.followup_due": {
    name: "Pending Enquiry Follow-up Reminder",
    description: "Scheduled reminder for uncontacted triage items",
    tagBg: "#FEFCBF",
    tagText: "#744210",
  },
  "automation.delivery_failed": {
    name: "Automation Failure Alert",
    description: "Critical alert when outbox reaches dead letter status",
    tagBg: "#FED7D7",
    tagText: "#9B2C2C",
  },
};

export function AutomationManager({
  initialEvents,
  initialMetrics,
  initialSettings,
  userRole,
  config,
}: AutomationManagerProps) {
  const router = useRouter();
  const [events, setEvents] = useState<AutomationEventRecord[]>(initialEvents);
  const [metrics] = useState(initialMetrics);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<AutomationEventRecord | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  // Settings State & Modal
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settings, setSettings] = useState<StudioNotificationSettings>(
    initialSettings || {
      studioNotificationEmail: "studio@aurelle.dsecops88.online",
      customerAckEnabled: true,
      assignmentNotificationEnabled: true,
      followupReminderHours: 24,
      failureAlertEmail: "alerts@aurelle.dsecops88.online",
      automationMasterEnabled: true,
    }
  );

  const isSuperAdmin = userRole === "super_admin" || userRole === "studio_director";

  // Filter events client-side for immediate responsive interactions
  const filteredEvents = events.filter((ev) => {
    if (statusFilter !== "all" && ev.processing_status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      const workflow = WORKFLOW_MAP[ev.event_type]?.name?.toLowerCase() || "";
      return (
        ev.id.toLowerCase().includes(q) ||
        ev.related_entity_id.toLowerCase().includes(q) ||
        ev.event_type.toLowerCase().includes(q) ||
        workflow.includes(q)
      );
    }
    return true;
  });

  const handleManualRetry = async (eventId: string) => {
    setRetryingId(eventId);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/automations/${eventId}/retry`, {
        method: "POST",
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setFeedback({
          type: "success",
          message: data.message || "Event delivered successfully to n8n.",
        });
        setEvents((prev) =>
          prev.map((e) =>
            e.id === eventId
              ? {
                  ...e,
                  processing_status: "completed" as ProcessingStatus,
                  last_error_summary: null,
                  updated_at: new Date().toISOString(),
                }
              : e
          )
        );
        router.refresh();
      } else {
        setFeedback({
          type: "error",
          message: data?.error?.message || "Manual retry failed to reach n8n target.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Network failure while initiating event retry.",
      });
    } finally {
      setRetryingId(null);
    }
  };

  const handleProcessQueue = async () => {
    setIsProcessingQueue(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/automations/process", {
        method: "POST",
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setFeedback({
          type: "success",
          message: `Queue processed: ${data.summary.processed} claimed, ${data.summary.succeeded} delivered, ${data.summary.failed} failed.`,
        });
        router.refresh();
      } else {
        setFeedback({
          type: "error",
          message: data?.error?.message || "Failed to trigger queue processing worker.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to connect to outbox worker endpoint.",
      });
    } finally {
      setIsProcessingQueue(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;

    setIsSavingSettings(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/settings/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setSettings(data.settings);
        setIsSettingsOpen(false);
        setFeedback({
          type: "success",
          message: "Notification settings updated and saved to Cloudflare D1.",
        });
        router.refresh();
      } else {
        setFeedback({
          type: "error",
          message: data?.error || "Failed to update notification settings.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Network error saving notification settings.",
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCD5CB]">
        <div>
          <span className="text-[0.65rem] font-mono uppercase tracking-widest text-[#A17C55] font-semibold">
            Operational Outbox & Integrations
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#242522] tracking-tight">
            n8n Automation Monitor
          </h1>
          <p className="text-xs text-[#6B6C67] mt-1">
            Transactional outbox processor, Web Crypto HMAC-SHA256 delivery, and real-time event status triage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Settings Button */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider text-[#242522] bg-[#FFFFFF] border border-[#DCD5CB] hover:border-[#A17C55] rounded-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>⚙️</span>
            <span>Settings</span>
          </button>

          {/* Webhook Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFFFFF] border border-[#DCD5CB] rounded-xs text-xs font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                config.isConfigured ? "bg-[#3B6E4C]" : "bg-[#A83E3E]"
              }`}
            />
            <span className="text-[#6B6C67]">Webhook:</span>
            <span className="font-semibold text-[#242522]">
              {config.isConfigured ? "Configured" : "Unconfigured"}
            </span>
          </div>

          {/* Flush Queue Action Button */}
          <button
            type="button"
            onClick={handleProcessQueue}
            disabled={isProcessingQueue}
            className="px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider text-[#FAF8F5] bg-[#242522] hover:bg-[#A17C55] rounded-xs disabled:opacity-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            {isProcessingQueue ? (
              <span>Processing Queue...</span>
            ) : (
              <>
                <span>⚡</span>
                <span>Process Outbox</span>
              </>
            )}
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3 text-xs rounded-sm border ${
            feedback.type === "success"
              ? "bg-[#E6F4EA] text-[#3B6E4C] border-[#3B6E4C]/40"
              : "bg-[#FFF5F5] text-[#A83E3E] border-[#A83E3E]/40"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="p-4 bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm">
          <span className="text-[0.65rem] font-mono uppercase tracking-wider text-[#6B6C67]">
            Total Events
          </span>
          <div className="font-serif text-2xl text-[#242522] mt-1 font-normal">
            {metrics.total}
          </div>
        </div>

        <div className="p-4 bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm">
          <span className="text-[0.65rem] font-mono uppercase tracking-wider text-[#A17C55]">
            Pending / In Flight
          </span>
          <div className="font-serif text-2xl text-[#A17C55] mt-1 font-normal">
            {metrics.pending + metrics.processing}
          </div>
        </div>

        <div className="p-4 bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm">
          <span className="text-[0.65rem] font-mono uppercase tracking-wider text-[#3B6E4C]">
            Delivered
          </span>
          <div className="font-serif text-2xl text-[#3B6E4C] mt-1 font-normal">
            {metrics.completed}
          </div>
        </div>

        <div className="p-4 bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm">
          <span className="text-[0.65rem] font-mono uppercase tracking-wider text-[#C05621]">
            Retry Backoff
          </span>
          <div className="font-serif text-2xl text-[#C05621] mt-1 font-normal">
            {metrics.retrying}
          </div>
        </div>

        <div className="p-4 bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm">
          <span className="text-[0.65rem] font-mono uppercase tracking-wider text-[#A83E3E]">
            Dead Letter
          </span>
          <div className="font-serif text-2xl text-[#A83E3E] mt-1 font-normal">
            {metrics.deadLetter}
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-[#FFFFFF] border border-[#DCD5CB] p-3.5 rounded-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Events" },
            { id: "pending", label: "Pending" },
            { id: "completed", label: "Delivered" },
            { id: "retrying", label: "Retrying" },
            { id: "dead_letter", label: "Dead Letter" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#242522] text-[#FAF8F5]"
                  : "text-[#6B6C67] hover:text-[#242522] hover:bg-[#F7F4EF]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Event, Workflow or Entity..."
            className="w-full pl-3 pr-8 py-1.5 bg-[#F7F4EF] border border-[#DCD5CB] focus:border-[#A17C55] rounded-xs text-xs text-[#242522] focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6B6C67] hover:text-[#242522] text-xs cursor-pointer"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Events Data Table */}
      <div className="bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm overflow-hidden shadow-2xs">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#F7F4EF] flex items-center justify-center text-[#A17C55]">
              ⚡
            </div>
            <h3 className="font-serif text-base text-[#242522]">
              No automation events match current criteria
            </h3>
            <p className="text-xs text-[#6B6C67] max-w-sm mx-auto">
              Events are generated when prospective clients submit consultation briefs, assignments are updated, or scheduled follow-ups trigger.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F4EF] border-b border-[#DCD5CB] text-[0.68rem] font-mono uppercase tracking-wider text-[#6B6C67]">
                <tr>
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Workflow & Event</th>
                  <th className="py-3 px-4">Related Entity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Attempts</th>
                  <th className="py-3 px-4">Last Error Summary</th>
                  <th className="py-3 px-4">Created At</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCD5CB]/60">
                {filteredEvents.map((ev) => {
                  const badge = STATUS_BADGES[ev.processing_status] || {
                    label: ev.processing_status,
                    bg: "#F7F4EF",
                    text: "#6B6C67",
                    border: "#DCD5CB",
                  };
                  const workflow = WORKFLOW_MAP[ev.event_type] || {
                    name: "General Outbox Dispatch",
                    description: ev.event_type,
                    tagBg: "#F7F4EF",
                    tagText: "#6B6C67",
                  };
                  const isEligibleForRetry =
                    ev.processing_status === "retrying" ||
                    ev.processing_status === "dead_letter" ||
                    ev.processing_status === "failed";

                  return (
                    <tr key={ev.id} className="hover:bg-[#F7F4EF]/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-[0.7rem] text-[#242522]">
                        {ev.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#242522]">{workflow.name}</div>
                        <span className="font-mono text-[0.65rem] text-[#6B6C67] inline-block mt-0.5">
                          {ev.event_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[0.7rem]">
                        {ev.event_type.startsWith("enquiry.") ? (
                          <Link
                            href={`/admin/enquiries/${ev.related_entity_id}`}
                            className="text-[#A17C55] underline hover:text-[#242522] font-medium"
                          >
                            AUR-{ev.related_entity_id.slice(-6).toUpperCase()}
                          </Link>
                        ) : (
                          <span>{ev.related_entity_id}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="inline-block px-2 py-0.5 text-[0.62rem] font-mono uppercase tracking-wider rounded-xs border"
                          style={{
                            backgroundColor: badge.bg,
                            color: badge.text,
                            borderColor: badge.border,
                          }}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[0.7rem] text-[#242522]">
                        {ev.attempt_count}/{config.maxRetries}
                      </td>
                      <td className="py-3 px-4 text-[#6B6C67] max-w-xs truncate text-[0.7rem]">
                        {ev.last_error_summary || "—"}
                      </td>
                      <td className="py-3 px-4 font-mono text-[0.68rem] text-[#6B6C67]">
                        {new Date(ev.created_at).toLocaleString([], {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {isEligibleForRetry && (
                          <button
                            type="button"
                            onClick={() => handleManualRetry(ev.id)}
                            disabled={retryingId === ev.id}
                            className="px-2.5 py-1 text-[0.65rem] font-mono uppercase tracking-wider text-[#FAF8F5] bg-[#242522] hover:bg-[#A17C55] rounded-xs disabled:opacity-50 transition-colors cursor-pointer"
                          >
                            {retryingId === ev.id ? "Retrying..." : "Retry"}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedEvent(ev)}
                          className="px-2 py-1 text-[0.65rem] font-mono uppercase tracking-wider text-[#6B6C67] hover:text-[#242522] border border-[#DCD5CB] rounded-xs transition-colors cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Event Details Drawer/Modal */}
      {selectedEvent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#242522]/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="w-full max-w-lg bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DCD5CB] pb-3">
              <div>
                <span className="text-[0.65rem] font-mono uppercase tracking-widest text-[#A17C55] font-semibold block">
                  Outbox Event Inspector
                </span>
                <h3 className="font-serif text-lg text-[#242522]">
                  {WORKFLOW_MAP[selectedEvent.event_type]?.name || selectedEvent.event_type}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="text-[#6B6C67] hover:text-[#242522] text-xl p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 text-[0.7rem] font-mono bg-[#FAF8F5] p-3 rounded-xs border border-[#DCD5CB]">
                <div>
                  <span className="text-[#6B6C67] block">Event ID:</span>
                  <span className="text-[#242522] font-semibold">{selectedEvent.id}</span>
                </div>
                <div>
                  <span className="text-[#6B6C67] block">Status:</span>
                  <span className="text-[#242522] font-semibold uppercase">{selectedEvent.processing_status}</span>
                </div>
                <div>
                  <span className="text-[#6B6C67] block">Attempts:</span>
                  <span className="text-[#242522]">{selectedEvent.attempt_count} / {config.maxRetries}</span>
                </div>
                <div>
                  <span className="text-[#6B6C67] block">Next Scheduled Retry:</span>
                  <span className="text-[#242522]">
                    {selectedEvent.next_retry_at ? new Date(selectedEvent.next_retry_at).toLocaleString() : "None"}
                  </span>
                </div>
              </div>

              {selectedEvent.last_error_summary && (
                <div className="p-2.5 bg-[#FFF5F5] border border-[#A83E3E]/40 text-[#A83E3E] text-xs rounded-xs">
                  <span className="font-semibold block font-mono text-[0.65rem] uppercase">Last Error:</span>
                  <span className="font-mono text-[0.7rem]">{selectedEvent.last_error_summary}</span>
                </div>
              )}

              <div>
                <span className="text-[0.68rem] font-mono uppercase text-[#6B6C67] block mb-1">
                  Stored Payload Reference:
                </span>
                <pre className="p-3 bg-[#F7F4EF] border border-[#DCD5CB] rounded-xs font-mono text-[0.7rem] text-[#242522] overflow-x-auto whitespace-pre-wrap max-h-48">
                  {selectedEvent.payload_reference
                    ? JSON.stringify(JSON.parse(selectedEvent.payload_reference), null, 2)
                    : "No payload reference stored."}
                </pre>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#DCD5CB]">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider text-[#242522] border border-[#DCD5CB] rounded-xs hover:bg-[#F7F4EF] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings Modal (Super Admin / Studio Director) */}
      {isSettingsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#242522]/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DCD5CB] pb-3">
              <div>
                <span className="text-[0.65rem] font-mono uppercase tracking-widest text-[#A17C55] font-semibold block">
                  Studio Settings
                </span>
                <h3 className="font-serif text-lg text-[#242522]">
                  Notification & Automation Preferences
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="text-[#6B6C67] hover:text-[#242522] text-xl p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block text-[0.7rem] font-mono uppercase tracking-wider text-[#6B6C67] mb-1">
                  Studio Notification Recipient
                </label>
                <input
                  type="email"
                  value={settings.studioNotificationEmail}
                  onChange={(e) => setSettings({ ...settings, studioNotificationEmail: e.target.value })}
                  disabled={!isSuperAdmin}
                  required
                  className="w-full p-2 bg-[#F7F4EF] border border-[#DCD5CB] focus:border-[#A17C55] rounded-xs text-xs text-[#242522]"
                />
                <span className="text-[0.65rem] text-[#6B6C67] mt-0.5 block">
                  Internal address for team notifications on new client submissions.
                </span>
              </div>

              <div>
                <label className="block text-[0.7rem] font-mono uppercase tracking-wider text-[#6B6C67] mb-1">
                  Technical Failure Alert Email
                </label>
                <input
                  type="email"
                  value={settings.failureAlertEmail}
                  onChange={(e) => setSettings({ ...settings, failureAlertEmail: e.target.value })}
                  disabled={!isSuperAdmin}
                  required
                  className="w-full p-2 bg-[#F7F4EF] border border-[#DCD5CB] focus:border-[#A17C55] rounded-xs text-xs text-[#242522]"
                />
                <span className="text-[0.65rem] text-[#6B6C67] mt-0.5 block">
                  Recipient for dead letter outbox failures and critical webhook drops.
                </span>
              </div>

              <div>
                <label className="block text-[0.7rem] font-mono uppercase tracking-wider text-[#6B6C67] mb-1">
                  Follow-up Reminder Interval (Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={settings.followupReminderHours}
                  onChange={(e) => setSettings({ ...settings, followupReminderHours: parseInt(e.target.value, 10) || 24 })}
                  disabled={!isSuperAdmin}
                  required
                  className="w-full p-2 bg-[#F7F4EF] border border-[#DCD5CB] focus:border-[#A17C55] rounded-xs text-xs text-[#242522]"
                />
                <span className="text-[0.65rem] text-[#6B6C67] mt-0.5 block">
                  Enquiries in New status beyond this threshold trigger scheduled follow-up alerts.
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#DCD5CB]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.customerAckEnabled}
                    onChange={(e) => setSettings({ ...settings, customerAckEnabled: e.target.checked })}
                    disabled={!isSuperAdmin}
                    className="accent-[#A17C55]"
                  />
                  <span className="text-xs text-[#242522]">Customer Acknowledgement Emails Active</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.assignmentNotificationEnabled}
                    onChange={(e) => setSettings({ ...settings, assignmentNotificationEnabled: e.target.checked })}
                    disabled={!isSuperAdmin}
                    className="accent-[#A17C55]"
                  />
                  <span className="text-xs text-[#242522]">Lead Assignment Team Alerts Active</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.automationMasterEnabled}
                    onChange={(e) => setSettings({ ...settings, automationMasterEnabled: e.target.checked })}
                    disabled={!isSuperAdmin}
                    className="accent-[#A17C55]"
                  />
                  <span className="text-xs font-semibold text-[#242522]">Master Outbox Dispatch Enabled</span>
                </label>
              </div>

              {!isSuperAdmin && (
                <div className="p-2 bg-[#F7F4EF] text-[#6B6C67] text-[0.68rem] rounded-xs italic">
                  Read-only view. Only Super Admins and Studio Directors may adjust notification settings.
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DCD5CB]">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-[#242522] border border-[#DCD5CB] rounded-xs hover:bg-[#F7F4EF] cursor-pointer"
                >
                  Cancel
                </button>
                {isSuperAdmin && (
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider text-[#FAF8F5] bg-[#242522] hover:bg-[#A17C55] rounded-xs disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {isSavingSettings ? "Saving..." : "Save Preferences"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
