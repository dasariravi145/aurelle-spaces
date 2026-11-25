"use client";

import React from "react";
import Link from "next/link";
import { ChatMessage } from "@/lib/chat/types";
import { useChat } from "./chat-context";

export interface ChatMessageItemProps {
  message: ChatMessage;
  onRetry?: () => void;
}

/**
 * Chat Message Presentation Component
 * Renders visitor messages, studio assistant messages, system announcements, and error notices.
 * Never executes raw or untrusted HTML.
 * Includes optional on-demand speech playback for assistant messages.
 */
export function ChatMessageItem({ message, onRetry }: ChatMessageItemProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  const {
    isVoiceSupported,
    isSpeaking,
    speakingMessageId,
    speak,
    stopSpeaking,
  } = useChat();

  const isCurrentMessageSpeaking = isSpeaking && speakingMessageId === message.id;

  // System announcement
  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-[#FFFFFF]/80 border border-[#DCD5CB] rounded-sm px-3 py-1.5 text-[0.7rem] font-sans text-[#6B6C67] text-center max-w-[85%] shadow-2xs">
          {message.content}
        </div>
      </div>
    );
  }

  // Format readable time (e.g. 10:45 AM)
  const formattedTime = (() => {
    try {
      const d = new Date(message.timestamp);
      return isNaN(d.getTime())
        ? ""
        : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  })();

  const handleToggleSpeech = () => {
    if (isCurrentMessageSpeaking) {
      stopSpeaking();
    } else {
      speak(message.content, message.id);
    }
  };

  return (
    <div
      className={`flex flex-col ${
        isUser ? "items-end" : "items-start"
      } my-2.5 max-w-full`}
    >
      <div className="flex items-end gap-1.5 max-w-[90%] sm:max-w-[82%]">
        {!isUser && (
          <div
            className="w-6 h-6 rounded-[2px] bg-[#242522] text-[#F7F4EF] flex items-center justify-center font-serif text-[0.65rem] shrink-0 mb-1 border border-[#3A3B37]"
            aria-hidden="true"
            title="Aurelle Spaces Studio Concierge"
          >
            AS
          </div>
        )}

        <div
          className={`p-3.5 rounded-sm text-xs leading-relaxed transition-colors ${
            isUser
              ? "bg-[#242522] text-[#F7F4EF] rounded-br-none border border-[#242522]"
              : "bg-[#FFFFFF] text-[#242522] rounded-bl-none border border-[#DCD5CB] shadow-xs"
          } ${message.status === "error" ? "border-[#A83E3E] bg-[#FFF5F5]" : ""}`}
        >
          {/* Safe message text rendering */}
          <div className="whitespace-pre-wrap break-words font-sans selection:bg-[#A17C55] selection:text-[#FFFFFF]">
            {message.content}
          </div>

          {/* Action links if error mentions contact page or consultation */}
          {message.status === "error" && (
            <div className="mt-2.5 pt-2 border-t border-[#DCD5CB]/80 flex flex-wrap items-center gap-2">
              <Link
                href="/contact"
                className="inline-flex items-center text-[0.7rem] font-mono uppercase tracking-wider text-[#A17C55] hover:text-[#242522] font-semibold underline underline-offset-2"
              >
                Go to Contact Page &rarr;
              </Link>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="text-[0.7rem] font-mono uppercase tracking-wider text-[#6B6C67] hover:text-[#242522] cursor-pointer"
                >
                  Retry Sending
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Timestamp, Status Metadata, and Speech Trigger */}
      <div
        className={`flex items-center gap-2 mt-1 px-1 text-[0.62rem] font-mono ${
          isUser ? "text-[#6B6C67] flex-row-reverse" : "text-[#8E8F8A] ml-7"
        }`}
      >
        {formattedTime && <span>{formattedTime}</span>}
        {isUser && message.status === "sending" && (
          <span className="text-[#A17C55]">Sending...</span>
        )}
        {isUser && message.status === "error" && (
          <span className="text-[#A83E3E]">Failed to send</span>
        )}

        {/* Listen Button for Assistant Messages */}
        {!isUser && isVoiceSupported && message.status === "sent" && (
          <button
            type="button"
            onClick={handleToggleSpeech}
            aria-label={
              isCurrentMessageSpeaking
                ? "Stop speech playback"
                : "Listen to this response (English voice)"
            }
            title={
              isCurrentMessageSpeaking
                ? "Stop speaking"
                : "Listen to response"
            }
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs transition-colors hover:text-[#242522] ${
              isCurrentMessageSpeaking
                ? "text-[#A17C55] bg-[#EAE6DE] font-semibold"
                : "text-[#8E8F8A] hover:bg-[#F2EFE9]"
            }`}
          >
            <svg
              className={`w-3 h-3 ${isCurrentMessageSpeaking ? "animate-pulse" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isCurrentMessageSpeaking ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
                />
              )}
            </svg>
            <span>{isCurrentMessageSpeaking ? "Stop" : "Listen"}</span>
          </button>
        )}
      </div>
    </div>
  );
}