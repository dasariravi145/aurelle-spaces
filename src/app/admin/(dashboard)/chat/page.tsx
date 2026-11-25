import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminSession } from "@/lib/security/auth";
import { getDatabase } from "@/lib/db/client";
import { chatRepository } from "@/lib/db/repositories/chat.repository";
import { getAIConfig } from "@/lib/chat/config";

export const metadata: Metadata = {
  title: "Studio Chatbot Sessions | Aurelle Spaces Admin",
};

export default async function AdminChatPage() {
  await requireAdminSession();

  const aiConfig = getAIConfig();

  let conversations: Array<{
    id: string;
    session_id: string;
    conversation_status: string;
    linked_enquiry_id?: string | null;
    created_at: string;
    updated_at: string;
    message_count: number;
    last_message?: string;
  }> = [];

  let stats = {
    total: 0,
    active: 0,
    qualified: 0,
    resolved: 0,
  };

  try {
    const db = getDatabase();
    const result = await chatRepository.listRecentConversations(db, { limit: 25 });
    conversations = result.data;
    stats = await chatRepository.getConversationStats(db);
  } catch {
    // If D1 is in local uninitialized mode
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCD5CB]">
        <div>
          <span className="text-[0.65rem] font-mono uppercase tracking-[0.2em] text-[#A17C55] font-semibold block">
            Conversational Intelligence
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#242522]">
            Studio Assistant Sessions
          </h1>
          <p className="text-xs text-[#6B6C67] pt-1">
            Monitor anonymous conversation sessions, AI-qualified lead progression, and knowledge inquiries.
          </p>
        </div>

        {/* AI Provider Status Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto p-2.5 bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              aiConfig.isAvailable ? "bg-[#3B6E4C]" : "bg-[#A17C55]"
            }`}
            aria-hidden="true"
          />
          <div>
            <div className="font-mono text-[0.65rem] uppercase text-[#6B6C67]">
              Provider Status
            </div>
            <div className="font-medium text-[#242522]">
              {aiConfig.isAvailable
                ? `${aiConfig.provider} (${aiConfig.model})`
                : "Unconfigured (Missing API Key)"}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm">
          <span className="text-[0.65rem] font-mono uppercase tracking-wider text-[#6B6C67]">
            Total Sessions
          </span>
          <div className="font-serif text-2xl text-[#242522] mt-1 font-normal">
            {stats.total}
          </div>
        </div>

        <div className="p-4 bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm">
          <span className="text-[0.65rem] font-mono uppercase tracking-wider text-[#6B6C67]">
            Active
          </span>
          <div className="font-serif text-2xl text-[#A17C55] mt-1 font-normal">
            {stats.active}
          </div>
        </div>

        <div className="p-4 bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm">
          <span className="text-[0.65rem] font-mono uppercase tracking-wider text-[#6B6C67]">
            AI Qualified Leads
          </span>
          <div className="font-serif text-2xl text-[#3B6E4C] mt-1 font-normal">
            {stats.qualified}
          </div>
        </div>

        <div className="p-4 bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm">
          <span className="text-[0.65rem] font-mono uppercase tracking-wider text-[#6B6C67]">
            Resolved / Archived
          </span>
          <div className="font-serif text-2xl text-[#6B6C67] mt-1 font-normal">
            {stats.resolved}
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[#DCD5CB] bg-[#F7F4EF]/60 flex items-center justify-between">
          <h2 className="font-serif text-base text-[#242522]">
            Recent Client Conversations
          </h2>
          <span className="text-[0.65rem] font-mono uppercase text-[#6B6C67]">
            Showing up to 25 recent sessions
          </span>
        </div>

        {conversations.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#F7F4EF] flex items-center justify-center text-[#A17C55]">
              💬
            </div>
            <h3 className="font-serif text-base text-[#242522]">
              No conversation sessions recorded yet
            </h3>
            <p className="text-xs text-[#6B6C67] max-w-sm mx-auto">
              Conversations initiated by prospective clients via the floating studio assistant will be logged here with unguessable anonymous session tokens.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F4EF] border-b border-[#DCD5CB] text-[0.68rem] font-mono uppercase tracking-wider text-[#6B6C67]">
                <tr>
                  <th className="py-3 px-4">Session Token</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Messages</th>
                  <th className="py-3 px-4">Linked Enquiry</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4">Latest Inquiry Excerpt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCD5CB]/60">
                {conversations.map((conv) => (
                  <tr key={conv.id} className="hover:bg-[#F7F4EF]/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-[0.7rem] text-[#242522]">
                      {conv.session_id.slice(0, 16)}...
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[0.65rem] font-mono uppercase rounded-xs ${
                          conv.conversation_status === "active"
                            ? "bg-[#F2EAE0] text-[#A17C55] border border-[#A17C55]/40"
                            : conv.conversation_status === "qualified_lead"
                            ? "bg-[#E6F4EA] text-[#3B6E4C] border border-[#3B6E4C]/40"
                            : "bg-[#F7F4EF] text-[#6B6C67] border border-[#DCD5CB]"
                        }`}
                      >
                        {conv.conversation_status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#242522]">
                      {conv.message_count}
                    </td>
                    <td className="py-3 px-4 font-mono text-[0.7rem]">
                      {conv.linked_enquiry_id ? (
                        <Link
                          href={`/admin/enquiries/${conv.linked_enquiry_id}`}
                          className="text-[#A17C55] hover:text-[#242522] underline font-medium"
                        >
                          AUR-{conv.linked_enquiry_id.slice(-6).toUpperCase()}
                        </Link>
                      ) : (
                        <span className="text-[#8E8F8A]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[0.7rem] text-[#6B6C67]">
                      {new Date(conv.updated_at).toLocaleString([], {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="py-3 px-4 text-[#6B6C67] max-w-xs truncate">
                      {conv.last_message || "—"}
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
