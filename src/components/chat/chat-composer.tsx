"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "./chat-context";

export interface ChatComposerProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  isSending?: boolean;
  maxLength?: number;
}

/**
 * Studio Chat Message Composer
 * Multiline textarea with Enter-to-send, Shift+Enter for newline, character limit check,
 * and integrated browser speech recognition (Speech-to-Text).
 */
export function ChatComposer({
  onSendMessage,
  disabled = false,
  isSending = false,
  maxLength = 1000,
}: ChatComposerProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    isRecognitionSupported,
    isListening,
    startListening,
    stopListening,
    transcript,
    clearTranscript,
    recognitionError,
  } = useChat();

  // Populate textarea with incoming speech recognition transcript
  useEffect(() => {
    if (transcript) {
      setText((prev) => {
        const separator = prev && !prev.endsWith(" ") ? " " : "";
        return `${prev}${separator}${transcript}`;
      });
      clearTranscript();
    }
  }, [transcript, clearTranscript]);

  // Auto-resize textarea height to accommodate multiline entry
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [text]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled || isSending) return;

    if (isListening) {
      stopListening();
    }

    onSendMessage(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const isOverLimit = text.length > maxLength;
  const canSubmit = text.trim().length > 0 && !isOverLimit && !disabled && !isSending;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 border-t border-[#DCD5CB] bg-[#FFFFFF] relative"
    >
      {/* Speech Recognition Error Notice */}
      {recognitionError && (
        <div className="mb-2 px-2.5 py-1 text-[0.68rem] bg-[#FFF5F5] border border-[#F5C2C2] text-[#A83E3E] rounded-xs flex items-center justify-between">
          <span>{recognitionError}</span>
        </div>
      )}

      {/* Live Voice Recording Status Banner */}
      {isListening && (
        <div className="mb-2 px-2.5 py-1 text-[0.68rem] bg-[#F7F4EF] border border-[#A17C55] text-[#242522] rounded-xs flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#A83E3E] animate-ping" />
            <span className="font-mono font-medium">Listening in English... Speak clearly.</span>
          </div>
          <button
            type="button"
            onClick={stopListening}
            className="text-[0.625rem] font-mono uppercase text-[#A17C55] font-semibold hover:underline"
          >
            Done
          </button>
        </div>
      )}

      <div className="relative flex items-end gap-1.5 bg-[#F7F4EF] border border-[#DCD5CB] focus-within:border-[#A17C55] rounded-sm p-1.5 transition-colors">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about our services or share what you are planning..."
          rows={1}
          disabled={disabled || isSending}
          maxLength={maxLength + 50}
          aria-label="Type your message"
          className="flex-1 bg-transparent border-0 resize-none text-xs text-[#242522] placeholder-[#8E8F8A] focus:outline-none focus:ring-0 px-2 py-1.5 min-h-[36px] max-h-[120px] leading-relaxed disabled:opacity-50"
        />

        {/* Browser Speech Recognition Microphone Button */}
        {isRecognitionSupported && (
          <button
            type="button"
            onClick={handleMicClick}
            disabled={disabled || isSending}
            aria-label={isListening ? "Stop listening" : "Voice input (English speech recognition)"}
            title={isListening ? "Stop recording" : "Voice input (Microphone)"}
            className={`h-8 w-8 shrink-0 rounded-sm flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55] ${
              isListening
                ? "bg-[#A83E3E] text-[#FFFFFF] shadow-sm animate-pulse"
                : "text-[#6B6C67] hover:text-[#242522] hover:bg-[#EAE6DE]"
            }`}
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
                d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15a3 3 0 003-3V6a3 3 0 00-3-3 3 3 0 00-3 3v6a3 3 0 003 3z"
              />
            </svg>
          </button>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!canSubmit}
          aria-label="Send message"
          className="h-8 w-8 shrink-0 rounded-sm bg-[#242522] text-[#F7F4EF] hover:bg-[#A17C55] disabled:bg-[#DCD5CB] disabled:text-[#8E8F8A] disabled:cursor-not-allowed flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55]"
        >
          {isSending ? (
            <svg
              className="animate-spin h-3.5 w-3.5 text-current"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between mt-1.5 px-1 text-[0.62rem] font-mono text-[#8E8F8A]">
        <span>Enter to send • Shift+Enter for new line</span>
        <span className={isOverLimit ? "text-[#A83E3E] font-bold" : ""}>
          {text.length}/{maxLength}
        </span>
      </div>
    </form>
  );
}