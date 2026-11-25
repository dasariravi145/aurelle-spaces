"use client";

import React from "react";
import { ChatStarter } from "@/lib/chat/types";

export const DEFAULT_CHAT_STARTERS: ChatStarter[] = [
  {
    id: "services",
    label: "What services do you offer?",
    query: "What services do you offer?",
    category: "services",
  },
  {
    id: "process",
    label: "Tell me about your design process",
    query: "Tell me about your design process",
    category: "process",
  },
  {
    id: "residential",
    label: "I want to plan my home interiors",
    query: "I want to plan my home interiors",
    category: "residential",
  },
  {
    id: "consultation",
    label: "How can I discuss my project?",
    query: "How can I discuss my project?",
    category: "consultation",
  },
];

export interface ChatStartersProps {
  onSelect: (query: string) => void;
  disabled?: boolean;
}

/**
 * Suggested Conversation Starters
 * Elegant, accessible suggestion chips styled according to the studio's architectural identity.
 */
export function ChatStarters({ onSelect, disabled = false }: ChatStartersProps) {
  return (
    <div className="space-y-2.5 pt-2">
      <p className="text-[0.68rem] font-mono uppercase tracking-[0.18em] text-[#6B6C67]">
        Suggested Inquiries
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {DEFAULT_CHAT_STARTERS.map((starter) => (
          <button
            key={starter.id}
            type="button"
            onClick={() => onSelect(starter.query)}
            disabled={disabled}
            className="text-left p-2.5 text-xs font-sans text-[#242522] bg-[#FFFFFF] hover:bg-[#F2EAE0] border border-[#DCD5CB] hover:border-[#A17C55] rounded-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55] disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-between"
          >
            <span className="leading-relaxed line-clamp-2">{starter.label}</span>
            <span
              className="text-[#A17C55] opacity-0 group-hover:opacity-100 transition-opacity ml-1.5 shrink-0 text-sm"
              aria-hidden="true"
            >
              &rarr;
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

