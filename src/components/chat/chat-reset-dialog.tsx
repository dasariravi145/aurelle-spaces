"use client";

import React, { useEffect, useRef } from "react";

export interface ChatResetDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Chat Reset Confirmation Dialog
 * Prevents accidental loss of active conversation history with an accessible modal dialog.
 */
export function ChatResetDialog({
  isOpen,
  onConfirm,
  onCancel,
}: ChatResetDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      cancelBtnRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-dialog-title"
      aria-describedby="reset-dialog-desc"
      className="absolute inset-0 z-50 bg-[#242522]/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-xs bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm p-5 shadow-xl space-y-4 text-center animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="w-10 h-10 rounded-full bg-[#F2EAE0] text-[#A17C55] mx-auto flex items-center justify-center">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </div>

        <div>
          <h4
            id="reset-dialog-title"
            className="font-serif text-base text-[#242522] font-normal"
          >
            Start a new conversation?
          </h4>
          <p
            id="reset-dialog-desc"
            className="text-xs text-[#6B6C67] mt-1.5 leading-relaxed"
          >
            This will clear your current conversation history in this window. Ready to begin afresh?
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider text-[#242522] border border-[#DCD5CB] hover:bg-[#F7F4EF] rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55]"
          >
            Continue Chat
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider text-[#FFFFFF] bg-[#242522] hover:bg-[#A17C55] rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55]"
          >
            Start New
          </button>
        </div>
      </div>
    </div>
  );
}

