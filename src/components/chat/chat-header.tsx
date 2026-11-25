"use client";

import React, { useState } from "react";
import { useChat } from "./chat-context";

export interface ChatHeaderProps {
  onClose: () => void;
  onReset: () => void;
  onMinimize?: () => void;
}

/**
 * Chat Header Component
 * Displays studio brand identity, transparent AI assistant disclosure,
 * opt-in male voice assistant toggle, voice selector, and accessible navigation actions.
 */
export function ChatHeader({ onClose, onReset, onMinimize }: ChatHeaderProps) {
  const {
    voiceEnabled,
    toggleVoice,
    isVoiceSupported,
    isSpeaking,
    selectedVoice,
    availableVoices,
    setSelectedVoice,
  } = useChat();

  const [isVoiceMenuOpen, setIsVoiceMenuOpen] = useState(false);

  return (
    <div className="bg-[#242522] text-[#F7F4EF] p-4 border-b border-[#3A3B37] shrink-0">
      <div className="flex items-start justify-between gap-3">
        {/* Brand & Assistant Identity */}
        <div>
          <div className="flex items-center gap-2">
            <span
              id="chat-heading"
              className="font-serif text-lg text-[#F7F4EF] tracking-wide"
            >
              Aurelle Spaces
            </span>
            <span className="text-[0.62rem] font-mono uppercase tracking-wider px-2 py-0.5 bg-[#3A3B37] text-[#DCD5CB] rounded-xs border border-[#4E504A]">
              AI Assistant
            </span>
          </div>
          <span className="text-[0.68rem] font-mono uppercase tracking-[0.18em] text-[#A17C55] font-semibold block mt-0.5">
            Studio Concierge
          </span>
          <p className="text-[0.72rem] text-[#DCD5CB]/90 mt-1 leading-snug">
            Ask about our design services or share what you are planning.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Voice Assistant Toggle */}
          {isVoiceSupported && (
            <div className="relative">
              <button
                type="button"
                onClick={toggleVoice}
                aria-label={
                  voiceEnabled
                    ? "Disable voice assistant audio"
                    : "Enable voice assistant (English male voice)"
                }
                title={
                  voiceEnabled
                    ? "Voice audio enabled (Click to mute)"
                    : "Voice audio muted (Click to enable)"
                }
                className={`p-1.5 rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55] ${
                  voiceEnabled
                    ? "text-[#A17C55] bg-[#3A3B37] ring-1 ring-[#A17C55]/60"
                    : "text-[#DCD5CB] hover:text-[#FFFFFF] hover:bg-[#3A3B37]"
                }`}
              >
                {voiceEnabled ? (
                  <svg
                    className={`w-4 h-4 ${isSpeaking ? "animate-pulse text-[#D4AF37]" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 opacity-75"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-1.5l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
                    />
                  </svg>
                )}
              </button>

              {/* Voice Selector Dropdown (when voice is active & multiple voices are available) */}
              {voiceEnabled && availableVoices.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsVoiceMenuOpen((prev) => !prev)}
                    aria-label="Select voice"
                    title="Change assistant voice"
                    className="p-0.5 text-[0.55rem] font-mono text-[#DCD5CB] hover:text-[#FFFFFF] ml-0.5"
                  >
                    ▼
                  </button>
                  {isVoiceMenuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-full mt-1.5 w-52 bg-[#2D2E2B] border border-[#4E504A] rounded-xs shadow-lg py-1 z-50 text-xs"
                    >
                      <div className="px-2.5 py-1 text-[0.6rem] font-mono uppercase text-[#A17C55] font-semibold border-b border-[#3A3B37]">
                        Assistant Voice
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {availableVoices.slice(0, 8).map((v) => {
                          const isSelected = selectedVoice?.name === v.name;
                          return (
                            <button
                              key={v.name}
                              type="button"
                              onClick={() => {
                                setSelectedVoice(v);
                                setIsVoiceMenuOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 text-[0.7rem] truncate flex items-center justify-between ${
                                isSelected
                                  ? "bg-[#3A3B37] text-[#A17C55] font-medium"
                                  : "text-[#DCD5CB] hover:bg-[#383935] hover:text-[#FFFFFF]"
                              }`}
                            >
                              <span className="truncate">{v.name}</span>
                              {isSelected && <span className="ml-1 text-[#A17C55]">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Start New Conversation */}
          <button
            type="button"
            onClick={onReset}
            aria-label="Start new conversation"
            title="Start new conversation"
            className="p-1.5 text-[#DCD5CB] hover:text-[#FFFFFF] hover:bg-[#3A3B37] rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55]"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>

          {/* Minimize (Desktop only) */}
          {onMinimize && (
            <button
              type="button"
              onClick={onMinimize}
              aria-label="Minimize chat"
              title="Minimize chat"
              className="hidden sm:inline-flex p-1.5 text-[#DCD5CB] hover:text-[#FFFFFF] hover:bg-[#3A3B37] rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55]"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
              </svg>
            </button>
          )}

          {/* Close Window */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat window"
            title="Close chat window"
            className="p-1.5 text-[#DCD5CB] hover:text-[#FFFFFF] hover:bg-[#3A3B37] rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55]"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}