"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  ChatMessage,
  ChatFlowStatus,
  ChatLeadState,
} from "@/lib/chat/types";
import {
  sendChatMessage,
  generateClientChatId,
  UNAVAILABLE_MESSAGE,
} from "@/lib/chat/chat-service";
import { useVoiceAssistant } from "./use-voice-assistant";

export interface ChatContextValue {
  isOpen: boolean;
  isMinimized: boolean;
  status: ChatFlowStatus;
  error: string | null;
  messages: ChatMessage[];
  conversationId: string;
  isResetConfirmOpen: boolean;
  leadState: ChatLeadState;
  showLeadCard: boolean;
  setShowLeadCard: (show: boolean) => void;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  minimizeChat: () => void;
  sendMessage: (text: string) => Promise<void>;
  retryLastMessage: () => Promise<void>;
  handleResetClick: () => void;
  confirmReset: () => void;
  cancelReset: () => void;
  handleLeadSuccess: (enquiryId: string, referenceCode: string) => void;
  handleLeadDecline: () => void;
  launcherRef: React.RefObject<HTMLButtonElement | null>;
  // Voice Assistant
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  toggleVoice: () => void;
  isSpeaking: boolean;
  speakingMessageId: string | null;
  speak: (text: string, messageId?: string) => void;
  stopSpeaking: () => void;
  selectedVoice: SpeechSynthesisVoice | null;
  availableVoices: SpeechSynthesisVoice[];
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  clearTranscript: () => void;
  recognitionError: string | null;
  isVoiceSupported: boolean;
  isRecognitionSupported: boolean;
}

const ChatContext = createContext<ChatContextValue | null>(null);

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: "msg_welcome",
  role: "assistant",
  content:
    "Hello! Welcome to Aurelle Spaces. I can help you explore our services, understand our design approach or guide you towards a project enquiry.",
  timestamp: new Date().toISOString(),
  status: "sent",
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversationId, setConversationId] = useState<string>(() =>
    generateClientChatId("conv")
  );
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [status, setStatus] = useState<ChatFlowStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [leadState, setLeadState] = useState<ChatLeadState>({ stage: "not_started" });
  const [showLeadCard, setShowLeadCard] = useState(false);

  // Initialize Voice Assistant hook
  const voice = useVoiceAssistant();

  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const lastUserMessageRef = useRef<string | null>(null);

  const openChat = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
    setIsResetConfirmOpen(false);
    // Cancel any active speech synthesis and recognition upon closing chat
    voice.stopSpeaking();
    voice.stopListening();
    // Return focus to launcher button
    setTimeout(() => {
      launcherRef.current?.focus();
    }, 50);
  }, [voice]);

  const toggleChat = useCallback(() => {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }, [isOpen, closeChat, openChat]);

  const minimizeChat = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  // Lock body scroll on mobile viewports when chat is open
  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle global Escape key to close chat window
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (isResetConfirmOpen) {
          setIsResetConfirmOpen(false);
        } else {
          closeChat();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isResetConfirmOpen, closeChat]);

  // Send message flow
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || status === "sending" || status === "typing") return;

      lastUserMessageRef.current = trimmed;
      setError(null);

      // Stop any ongoing speech when user sends a new message
      voice.stopSpeaking();
      voice.stopListening();

      const userMsgId = generateClientChatId("msg");
      const userMsg: ChatMessage = {
        id: userMsgId,
        role: "user",
        content: trimmed,
        timestamp: new Date().toISOString(),
        status: "sent",
      };

      setMessages((prev) => [...prev, userMsg]);
      setStatus("typing");

      // Dispatch to chat service
      const response = await sendChatMessage({
        conversationId,
        message: trimmed,
        safeContext: {
          pageUrl: typeof window !== "undefined" ? window.location.pathname : undefined,
          timestamp: new Date().toISOString(),
        },
      });

      if (response.success && response.message) {
        if (response.conversationId) {
          setConversationId(response.conversationId);
        }
        if (response.leadState) {
          setLeadState(response.leadState);
          // If the visitor expressed intent or reached qualification stages, show the lead card
          if (
            response.leadState.stage === "consent_review" ||
            response.leadState.stage === "contact_details" ||
            response.leadState.stage === "discovering" ||
            response.leadState.projectType
          ) {
            setShowLeadCard(true);
          }
        }
        // Backend successfully responded
        const assistantMsgId = response.messageId || generateClientChatId("msg");
        const assistantMsg: ChatMessage = {
          id: assistantMsgId,
          role: "assistant",
          content: response.message,
          timestamp: response.timestamp || new Date().toISOString(),
          status: "sent",
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setStatus("idle");

        // If voice assistant is enabled, automatically speak the assistant's reply
        if (voice.voiceEnabled) {
          voice.speak(response.message, assistantMsgId);
        }
      } else {
        // Backend unavailable or error returned
        const errorContent = response.error || UNAVAILABLE_MESSAGE;
        setError(errorContent);

        const errorMsg: ChatMessage = {
          id: generateClientChatId("msg"),
          role: "assistant",
          content: errorContent,
          timestamp: new Date().toISOString(),
          status: "error",
          error: errorContent,
        };

        setMessages((prev) => [...prev, errorMsg]);
        setStatus("error");
      }
    },
    [conversationId, status, voice]
  );

  const retryLastMessage = useCallback(async () => {
    if (lastUserMessageRef.current) {
      await sendMessage(lastUserMessageRef.current);
    }
  }, [sendMessage]);

  // Lead qualification lifecycle actions
  const handleLeadSuccess = useCallback((enquiryId: string, referenceCode: string) => {
    setLeadState((prev) => ({
      ...prev,
      stage: "submitted",
      linkedEnquiryId: enquiryId,
      referenceCode,
      submittedAt: new Date().toISOString(),
    }));
    setShowLeadCard(false);
    const replyText = `Thank you. Your project enquiry has been received (Reference: ${referenceCode}). Our studio principal will review your spatial brief and reach out using the details provided.`;
    const replyId = generateClientChatId("msg");
    setMessages((prev) => [
      ...prev,
      {
        id: replyId,
        role: "assistant",
        content: replyText,
        timestamp: new Date().toISOString(),
        status: "sent",
      },
    ]);
    if (voice.voiceEnabled) {
      voice.speak(replyText, replyId);
    }
  }, [voice]);

  const handleLeadDecline = useCallback(() => {
    setLeadState((prev) => ({ ...prev, stage: "declined" }));
    setShowLeadCard(false);
    const declineText =
      "Understood. We respect your choice. Feel free to continue exploring our portfolio, services, or ask any architectural questions. If you ever wish to discuss a project in the future, you can visit our Contact page at any time.";
    const declineId = generateClientChatId("msg");
    setMessages((prev) => [
      ...prev,
      {
        id: declineId,
        role: "assistant",
        content: declineText,
        timestamp: new Date().toISOString(),
        status: "sent",
      },
    ]);
    if (voice.voiceEnabled) {
      voice.speak(declineText, declineId);
    }
  }, [voice]);

  // Reset conversation handler
  const handleResetClick = useCallback(() => {
    // If only welcome message is present, reset silently
    if (messages.length <= 1) {
      voice.stopSpeaking();
      voice.stopListening();
      setConversationId(generateClientChatId("conv"));
      setMessages([INITIAL_WELCOME_MESSAGE]);
      setLeadState({ stage: "not_started" });
      setShowLeadCard(false);
      setError(null);
      setStatus("idle");
      return;
    }
    setIsResetConfirmOpen(true);
  }, [messages.length, voice]);

  const confirmReset = useCallback(() => {
    voice.stopSpeaking();
    voice.stopListening();
    setConversationId(generateClientChatId("conv"));
    setMessages([
      {
        ...INITIAL_WELCOME_MESSAGE,
        timestamp: new Date().toISOString(),
      },
    ]);
    setLeadState({ stage: "not_started" });
    setShowLeadCard(false);
    setError(null);
    setStatus("idle");
    setIsResetConfirmOpen(false);
  }, [voice]);

  const cancelReset = useCallback(() => {
    setIsResetConfirmOpen(false);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        isMinimized,
        status,
        error,
        messages,
        conversationId,
        isResetConfirmOpen,
        leadState,
        showLeadCard,
        setShowLeadCard,
        openChat,
        closeChat,
        toggleChat,
        minimizeChat,
        sendMessage,
        retryLastMessage,
        handleResetClick,
        confirmReset,
        cancelReset,
        handleLeadSuccess,
        handleLeadDecline,
        launcherRef,
        // Voice Assistant exports
        voiceEnabled: voice.voiceEnabled,
        setVoiceEnabled: voice.setVoiceEnabled,
        toggleVoice: voice.toggleVoice,
        isSpeaking: voice.isSpeaking,
        speakingMessageId: voice.speakingMessageId,
        speak: voice.speak,
        stopSpeaking: voice.stopSpeaking,
        selectedVoice: voice.selectedVoice,
        availableVoices: voice.availableVoices,
        setSelectedVoice: voice.setSelectedVoice,
        isListening: voice.isListening,
        startListening: voice.startListening,
        stopListening: voice.stopListening,
        transcript: voice.transcript,
        clearTranscript: voice.clearTranscript,
        recognitionError: voice.recognitionError,
        isVoiceSupported: voice.isVoiceSupported,
        isRecognitionSupported: voice.isRecognitionSupported,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}