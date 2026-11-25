"use client";

import React, { useState, useEffect } from "react";

export interface WelcomePopupProps {
  onOpenChat: (initialQuery?: string, enableVoice?: boolean) => void;
  isOpen: boolean;
}

const STORAGE_KEY = "aurelle_welcome_popup_shown";

/**
 * Architectural Welcome Popup
 * Appears subtly ~2 seconds after page load once per tab session.
 * Features:
 * - Studio Concierge greeting
 * - One-click quick actions to explore projects, services, or consultations
 * - Opt-in voice interaction button (activates browser speech)
 * - Dismissible, zero-network, zero-audio autoplay
 * - Respects prefers-reduced-motion
 */
export function WelcomePopup({ onOpenChat, isOpen }: WelcomePopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // If chat dialog is already open or already dismissed, do not show
    if (isOpen) {
      setIsVisible(false);
      return;
    }

    try {
      const shown = sessionStorage.getItem(STORAGE_KEY);
      if (shown === "true") {
        setIsDismissed(true);
        return;
      }
    } catch {
      // In private browsing or storage-disabled environments
    }

    // 2-second polite delay before rendering the subtle greeting
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Safe fallback
    }
  };

  const handleAction = (query: string, voice: boolean = false) => {
    handleDismiss();
    onOpenChat(query, voice);
  };

  const handleStartVoice = () => {
    handleDismiss();
    onOpenChat(undefined, true);
  };

  if (!isVisible || isDismissed || isOpen) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Studio Assistant Welcome"
      className="fixed z-40 bottom-24 right-5 sm:right-6 w-[340px] max-w-[calc(100vw-2.5rem)] bg-[#FFFFFF] border border-[#DCD5CB] rounded-lg shadow-[0_12px_32px_rgba(36,37,34,0.14)] p-4.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 motion-reduce:animate-none"
      style={{
        bottom: "max(5.5rem, calc(env(safe-area-inset-bottom, 1.25rem) + 4.25rem))",
        right: "max(1.25rem, env(safe-area-inset-right, 1.25rem))",
      }}
    >
      {/* Header bar with icon and dismiss button */}
      <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-[#EAE6DE]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#242522] text-[#F7F4EF] flex items-center justify-center text-xs font-serif shadow-xs">
            A
          </div>
          <div>
            <span className="text-xs font-medium text-[#242522] block font-serif tracking-tight">
              Aurelle Spaces
            </span>
            <span className="text-[0.625rem] font-mono uppercase tracking-widest text-[#A17C55] font-semibold block">
              Studio Concierge
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss assistant welcome"
          className="text-[#8E8F8A] hover:text-[#242522] p-1 rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Welcome Message */}
      <p className="text-xs text-[#62615D] leading-relaxed mt-2.5">
        &ldquo;Welcome to Aurelle Spaces. I&apos;m your AI design assistant. How can I help you today?&rdquo;
      </p>

      {/* Quick Actions */}
      <div className="mt-3 space-y-1.5">
        <button
          type="button"
          onClick={() => handleAction("Explore our projects")}
          className="w-full text-left px-2.5 py-1.5 text-xs text-[#242522] hover:text-[#A17C55] bg-[#F7F5F1] hover:bg-[#EFECE6] rounded-xs border border-[#E6E0D8] transition-colors flex items-center justify-between group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55]"
        >
          <span>Explore Our Projects</span>
          <span className="text-[#A17C55] text-[0.6875rem] font-mono group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
            →
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleAction("Discover our services")}
          className="w-full text-left px-2.5 py-1.5 text-xs text-[#242522] hover:text-[#A17C55] bg-[#F7F5F1] hover:bg-[#EFECE6] rounded-xs border border-[#E6E0D8] transition-colors flex items-center justify-between group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55]"
        >
          <span>Discover Our Services</span>
          <span className="text-[#A17C55] text-[0.6875rem] font-mono group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
            →
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleAction("Plan a consultation")}
          className="w-full text-left px-2.5 py-1.5 text-xs text-[#242522] hover:text-[#A17C55] bg-[#F7F5F1] hover:bg-[#EFECE6] rounded-xs border border-[#E6E0D8] transition-colors flex items-center justify-between group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55]"
        >
          <span>Plan a Consultation</span>
          <span className="text-[#A17C55] text-[0.6875rem] font-mono group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
            →
          </span>
        </button>
      </div>

      {/* Voice Interaction Trigger CTA */}
      <div className="mt-3 pt-2.5 border-t border-[#EAE6DE] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleStartVoice}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.6875rem] font-medium uppercase tracking-wider bg-[#242522] text-[#F7F4EF] hover:bg-[#383935] rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55]"
        >
          <svg className="w-3.5 h-3.5 text-[#A17C55]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
          <span>Start Voice Interaction</span>
        </button>

        <button
          type="button"
          onClick={() => handleAction("Hello")}
          className="text-[0.6875rem] font-medium text-[#62615D] hover:text-[#242522] px-2 py-1 rounded-xs transition-colors"
        >
          Text Chat
        </button>
      </div>
    </div>
  );
}

