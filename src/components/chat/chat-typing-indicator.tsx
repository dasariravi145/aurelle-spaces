"use client";

import React from "react";

/**
 * Architectural Typing & Loading Indicator
 * An understated, minimalist 3-dot pulse in Muted Bronze that fits the luxury aesthetic.
 */
export function ChatTypingIndicator() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-2 px-3 py-2 bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm max-w-[120px] shadow-xs"
    >
      <div className="flex items-center space-x-1.5" aria-hidden="true">
        <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55] animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55] animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55] animate-bounce" />
      </div>
      <span className="text-[0.65rem] font-mono uppercase tracking-[0.14em] text-[#6B6C67]">
        Thinking
      </span>
      <span className="sr-only">Studio assistant is preparing a response...</span>
    </div>
  );
}

