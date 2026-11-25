"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ChatProvider, useChat } from "./chat-context";
import { ChatLauncher } from "./chat-launcher";
import { ChatPanel } from "./chat-panel";
import { WelcomePopup } from "./welcome-popup";
import { trackEvent } from "@/lib/analytics/events";

/**
 * Inner Chat Controller
 * Connects the floating launcher, welcome popup, and chat context.
 */
function ChatbotController() {
  const { isOpen, openChat, toggleChat, launcherRef, sendMessage, setVoiceEnabled } = useChat();

  const handleToggle = () => {
    if (!isOpen) {
      trackEvent("chatbot_opened", { triggerSource: "launcher" });
    }
    toggleChat();
  };

  const handleOpenWithQuery = (query?: string, enableVoice?: boolean) => {
    openChat();
    trackEvent("chatbot_opened", { triggerSource: "cta" });
    if (enableVoice) {
      setVoiceEnabled(true);
    }
    if (query) {
      sendMessage(query);
    }
  };

  return (
    <>
      <WelcomePopup onOpenChat={handleOpenWithQuery} isOpen={isOpen} />
      <ChatLauncher
        ref={launcherRef}
        isOpen={isOpen}
        onClick={handleToggle}
      />
      <ChatPanel />
    </>
  );
}

/**
 * Studio Chatbot Root Component
 * Dynamically mounts the conversational studio assistant on public pages.
 * Suppressed automatically on:
 * - Admin login & dashboard (/admin/*)
 * - Internal design system specification (/design-system)
 */
export function StudioChatbot() {
  const pathname = usePathname();

  // Suppress chatbot on admin surfaces and internal design-system documentation
  if (
    pathname?.startsWith("/admin") ||
    pathname === "/design-system" ||
    pathname?.startsWith("/design-system")
  ) {
    return null;
  }

  return (
    <ChatProvider>
      <ChatbotController />
    </ChatProvider>
  );
}