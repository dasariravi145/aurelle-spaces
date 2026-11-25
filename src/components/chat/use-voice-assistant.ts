"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  selectDefaultMaleVoice,
  getPrioritizedEnglishVoices,
  cleanTextForSpeech,
  isLikelyMaleVoice,
} from "@/lib/chat/voice-service";

// Browser SpeechRecognition typing
type SpeechRecognitionType = any;

export interface VoiceAssistantState {
  // Speech Output (TTS)
  isSpeechSupported: boolean;
  isVoiceSupported: boolean;
  isSpeaking: boolean;
  speakingMessageId: string | null;
  voiceEnabled: boolean;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setVoiceEnabled: (enabled: boolean) => void;
  toggleVoice: () => void;
  setSelectedVoiceURI: (uri: string) => void;
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void;
  speak: (text: string, messageId?: string) => void;
  stopSpeaking: () => void;

  // Speech Input (STT)
  isRecognitionSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  recognitionError: string | null;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
}

export function useVoiceAssistant(): VoiceAssistantState {
  // TTS State
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabledState] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoiceState] = useState<SpeechSynthesisVoice | null>(null);

  // STT State
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [recognitionError, setRecognitionError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize SpeechSynthesis and Voice List
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSpeechSupported(false);
      return;
    }

    setIsSpeechSupported(true);

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices.length === 0) return;

      const englishVoices = getPrioritizedEnglishVoices(allVoices);
      setAvailableVoices(englishVoices);

      // Check stored preference or default to optimal male voice
      const storedURI = sessionStorage.getItem("aurelle_voice_uri");
      if (storedURI) {
        const found = englishVoices.find((v) => v.voiceURI === storedURI);
        if (found) {
          setSelectedVoiceState(found);
          return;
        }
      }

      const defaultMale = selectDefaultMaleVoice(englishVoices);
      setSelectedVoiceState(defaultMale);
    };

    loadVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Check if voice was previously enabled in this session
    const storedVoiceEnabled = sessionStorage.getItem("aurelle_voice_enabled");
    if (storedVoiceEnabled === "true") {
      setVoiceEnabledState(true);
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Initialize SpeechRecognition Support
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    setIsRecognitionSupported(Boolean(SpeechRecognitionAPI));
  }, []);

  // Toggle voice output preference
  const setVoiceEnabled = useCallback((enabled: boolean) => {
    setVoiceEnabledState(enabled);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("aurelle_voice_enabled", enabled ? "true" : "false");
      if (!enabled && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      }
    }
  }, []);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled(!voiceEnabled);
  }, [setVoiceEnabled, voiceEnabled]);

  // Select custom voice from dropdown
  const setSelectedVoiceURI = useCallback(
    (uri: string) => {
      const found = availableVoices.find((v) => v.voiceURI === uri);
      if (found) {
        setSelectedVoiceState(found);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("aurelle_voice_uri", uri);
        }
      }
    },
    [availableVoices]
  );

  const setSelectedVoice = useCallback(
    (voice: SpeechSynthesisVoice | null) => {
      setSelectedVoiceState(voice);
      if (voice && typeof window !== "undefined") {
        sessionStorage.setItem("aurelle_voice_uri", voice.voiceURI);
      }
    },
    []
  );

  // Stop active speech
  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    }
  }, []);

  // Speak text using SpeechSynthesis
  const speak = useCallback(
    (text: string, messageId?: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

      const cleanText = cleanTextForSpeech(text);
      if (!cleanText) return;

      // Cancel previous speech to prevent overlapping utterances
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utteranceRef.current = utterance;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Calm, measured, professional cadence for an architectural concierge
      utterance.rate = 0.96;
      utterance.pitch = 0.95;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setSpeakingMessageId(messageId || null);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      };

      utterance.onerror = (e) => {
        if (e.error !== "canceled" && e.error !== "interrupted") {
          console.warn("SpeechSynthesis error:", e.error);
        }
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      };

      window.speechSynthesis.speak(utterance);
    },
    [selectedVoice]
  );

  // Start Voice Recognition (Microphone)
  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setRecognitionError("Speech recognition is not supported in this browser.");
      return;
    }

    // Stop speaking if currently speaking
    stopSpeaking();

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognitionAPI();
      recognitionRef.current = recognition;

      // Prefer Indian English, browser will fallback
      recognition.lang = "en-IN";
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      setRecognitionError(null);
      setTranscript("");
      setInterimTranscript("");

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let finalStr = "";
        let interimStr = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            finalStr += item[0].transcript;
          } else {
            interimStr += item[0].transcript;
          }
        }

        if (finalStr) {
          setTranscript((prev) => (prev ? `${prev} ${finalStr}` : finalStr).trim());
          setInterimTranscript("");
        } else {
          setInterimTranscript(interimStr);
        }
      };

      recognition.onerror = (event: any) => {
        const errType = event.error;
        if (errType === "not-allowed" || errType === "permission-denied") {
          setRecognitionError("Microphone access was denied. Please allow microphone permissions.");
        } else if (errType === "no-speech") {
          setRecognitionError("No speech detected. Please click the microphone to try again.");
        } else if (errType === "audio-capture") {
          setRecognitionError("No microphone found. Please check your audio input device.");
        } else if (errType !== "aborted") {
          setRecognitionError("Speech recognition error. You can still type your message.");
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript("");
      };

      recognition.start();
    } catch (err) {
      console.warn("Failed to start SpeechRecognition:", err);
      setRecognitionError("Unable to access microphone. Please type your message.");
      setIsListening(false);
    }
  }, [stopSpeaking]);

  // Stop Voice Recognition
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Safe ignore
      }
    }
    setIsListening(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setRecognitionError(null);
  }, []);

  return {
    isSpeechSupported,
    isVoiceSupported: isSpeechSupported,
    isSpeaking,
    speakingMessageId,
    voiceEnabled,
    availableVoices,
    selectedVoice,
    setVoiceEnabled,
    toggleVoice,
    setSelectedVoiceURI,
    setSelectedVoice,
    speak,
    stopSpeaking,
    isRecognitionSupported,
    isListening,
    transcript,
    interimTranscript,
    recognitionError,
    startListening,
    stopListening,
    clearTranscript,
  };
}
