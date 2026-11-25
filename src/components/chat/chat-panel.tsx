"use client";

import React, { useRef, useEffect } from "react";
import { useChat } from "./chat-context";
import { ChatHeader } from "./chat-header";
import { ChatMessageItem } from "./chat-message-item";
import { ChatTypingIndicator } from "./chat-typing-indicator";
import { ChatStarters } from "./chat-starters";
import { ChatPrivacyNotice } from "./chat-privacy-notice";
import { ChatComposer } from "./chat-composer";
import { ChatResetDialog } from "./chat-reset-dialog";
import { LeadQualificationCard } from "./lead-qualification-card";

export interface ChatPanelProps {
  className?: string;
}

/**
 * Premium Chat Panel Window
 * Features:
 * - Desktop: Refined floating card with subtle shadows and architectural borders
 * - Mobile: Full-screen responsive layout with safe-area padding and zero horizontal overflow
 * - Welcoming opening state with privacy disclosure and suggested conversation starters
 * - Accessible dialog semantics and keyboard navigation
 */
export function ChatPanel({ className = "" }: ChatPanelProps) {
  const {
    isOpen,
    isMinimized,
    status,
    messages,
    conversationId,
    leadState,
    showLeadCard,
    handleLeadSuccess,
    handleLeadDecline,
    closeChat,
    minimizeChat,
    sendMessage,
    retryLastMessage,
    handleResetClick,
    confirmReset,
    cancelReset,
    isResetConfirmOpen,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation feed on new message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, status, isOpen, isMinimized]);

  if (!isOpen) return null;

  const isInitialState = messages.length <= 1;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-heading"
      className={`fixed z-50 flex flex-col bg-[#F7F4EF] border border-[#DCD5CB] shadow-[0_20px_50px_rgba(36,37,34,0.22)] overflow-hidden transition-all duration-300 ${
        isMinimized
          ? "sm:bottom-24 sm:right-6 sm:w-[360px] sm:h-16 rounded-xl"
          : "inset-0 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[420px] sm:max-w-[calc(100vw-2rem)] sm:h-[620px] sm:max-h-[calc(100vh-8rem)] sm:rounded-xl"
      } ${className}`}
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* Header */}
      <ChatHeader
        onClose={closeChat}
        onReset={handleResetClick}
        onMinimize={minimizeChat}
      />

      {/* Main Panel Content (Hidden if minimized on desktop) */}
      {!isMinimized && (
        <>
          {/* Scrollable Conversation Stream */}
          <div
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            className="flex-1 overflow-y-auto px-4 py-4 space-y-2 selection:bg-[#A17C55] selection:text-[#FFFFFF] scroll-smooth"
          >
            {/* Initial Welcome & Studio Guidance Card */}
            {isInitialState && (
              <div className="space-y-3 pb-2 animate-in fade-in duration-200">
                <div className="p-4 bg-[#FFFFFF] border border-[#DCD5CB] rounded-sm shadow-2xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A17C55]" aria-hidden="true" />
                    <span className="text-[0.65rem] font-mono uppercase tracking-[0.2em] text-[#A17C55] font-semibold">
                      DRK Architectural Studio
                    </span>
                  </div>
                  <h3 className="font-serif text-base text-[#242522]">
                    Welcome to Aurelle Spaces
                  </h3>
                  <p className="text-xs text-[#6B6C67] leading-relaxed">
                    Our studio crafts bespoke residential architecture, luxury interiors, and turnkey developments. You can ask questions about our methodology, portfolio, or consultation procedures.
                  </p>
                </div>

                {/* Privacy Notice */}
                <ChatPrivacyNotice />

                {/* Suggested Conversation Starters */}
                <ChatStarters
                  onSelect={(query) => sendMessage(query)}
                  disabled={status === "sending" || status === "typing"}
                />
              </div>
            )}

            {/* Conversation Messages */}
            {!isInitialState && (
              <div className="space-y-1">
                {messages.map((msg) => (
                  <ChatMessageItem
                    key={msg.id}
                    message={msg}
                    onRetry={retryLastMessage}
                  />
                ))}
              </div>
            )}

            {/* Interactive Lead Qualification & Consent Card */}
            {showLeadCard && (
              <LeadQualificationCard
                conversationId={conversationId}
                initialLeadState={leadState}
                onSuccess={handleLeadSuccess}
                onDecline={handleLeadDecline}
              />
            )}

            {/* Typing / Loading Indicator */}
            {status === "typing" && (
              <div className="py-2 pl-7">
                <ChatTypingIndicator />
              </div>
            )}

            <div ref={messagesEndRef} aria-hidden="true" />
          </div>

          {/* Composer Form */}
          <ChatComposer
            onSendMessage={sendMessage}
            disabled={status === "sending" || status === "typing"}
            isSending={status === "sending" || status === "typing"}
          />

          {/* Reset Confirmation Modal */}
          <ChatResetDialog
            isOpen={isResetConfirmOpen}
            onConfirm={confirmReset}
            onCancel={cancelReset}
          />
        </>
      )}
    </div>
  );
}

