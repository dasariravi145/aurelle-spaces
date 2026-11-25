"use client";

import React from "react";
import Link from "next/link";

/**
 * Chat Privacy and Consent Notice
 * Displays a concise, transparent privacy reminder near the welcome screen.
 */
export function ChatPrivacyNotice() {
  return (
    <div className="bg-[#FFFFFF]/70 border border-[#DCD5CB] rounded-sm p-3 my-2 text-[0.72rem] leading-relaxed text-[#6B6C67]">
      <div className="flex items-start gap-2">
        <svg
          className="w-4 h-4 text-[#A17C55] shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
        <div>
          <span>
            Please avoid sharing sensitive personal information in chat. If you choose to submit an enquiry, we will ask for your consent before saving your contact details.{" "}
          </span>
          <Link
            href="/privacy-policy"
            className="text-[#A17C55] underline hover:text-[#242522] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55]"
          >
            Read Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

