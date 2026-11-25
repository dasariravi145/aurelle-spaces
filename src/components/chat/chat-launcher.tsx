"use client";

import React, { forwardRef } from "react";

export interface ChatLauncherProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

/**
 * Floating Studio Chat Launcher Button
 * Understated, luxury architectural floating trigger positioned at bottom-right corner.
 * Touch target >= 56px, high contrast focus rings, safe-area padding.
 */
export const ChatLauncher = forwardRef<HTMLButtonElement, ChatLauncherProps>(
  function ChatLauncher({ isOpen, onClick, className = "" }, ref) {
    return (
      <div
        className={`fixed z-40 transition-all duration-300 ${
          isOpen ? "sm:bottom-6 sm:right-6" : "bottom-5 right-5 sm:bottom-6 sm:right-6"
        } ${className}`}
        style={{
          bottom: "max(1.25rem, env(safe-area-inset-bottom, 1.25rem))",
          right: "max(1.25rem, env(safe-area-inset-right, 1.25rem))",
        }}
      >
        <button
          ref={ref}
          type="button"
          onClick={onClick}
          aria-label={isOpen ? "Close studio chat" : "Chat with Aurelle Spaces"}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#242522] text-[#F7F4EF] hover:bg-[#343531] border border-[#A17C55]/60 shadow-[0_8px_30px_rgba(36,37,34,0.18)] hover:shadow-[0_12px_36px_rgba(36,37,34,0.26)] transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A17C55] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F4EF] select-none"
        >
          {isOpen ? (
            /* Close glyph */
            <svg
              className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            /* Architectural Chat glyph */
            <div className="flex flex-col items-center justify-center">
              <svg
                className="w-6 h-6 text-[#F7F4EF] group-hover:text-[#F2EAE0] transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.898-.897c.217-.89.479-1.84.773-2.73C3.844 15.86 3 14.03 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
            </div>
          )}

          {/* Discreet branding dot */}
          <span
            className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#A17C55] ring-2 ring-[#242522]"
            aria-hidden="true"
          />
        </button>
      </div>
    );
  }
);

