"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChatLeadState, CreateChatEnquiryResponse } from "@/lib/chat/types";
import {
  projectTypeOptions,
  propertyTypeOptions,
  budgetRangeOptions,
  timelineOptions,
} from "@/lib/validation/enquiry-schema";
import { trackEvent } from "@/lib/analytics/events";

export interface LeadQualificationCardProps {
  conversationId: string;
  initialLeadState?: Partial<ChatLeadState>;
  onSuccess?: (enquiryId: string, referenceCode: string) => void;
  onDecline?: () => void;
}

/**
 * Interactive Studio Lead Qualification & Consent Card
 * Features:
 * - Pre-populates extracted scoping fields while allowing visitor edits.
 * - Enforces mandatory affirmative privacy consent prior to submission.
 * - Submits directly to POST /api/chat/enquiry with duplicate protection.
 * - Displays official confirmation message and reference code.
 */
export function LeadQualificationCard({
  conversationId,
  initialLeadState = {},
  onSuccess,
  onDecline,
}: LeadQualificationCardProps) {
  const [formData, setFormData] = useState({
    fullName: initialLeadState.fullName || "",
    email: initialLeadState.email || "",
    mobileNumber: initialLeadState.mobileNumber || "",
    city: initialLeadState.city || "",
    projectType: initialLeadState.projectType || "Residential Interiors",
    propertyType: initialLeadState.propertyType || "Independent Villa / Bungalow",
    approximateArea: initialLeadState.approximateArea || "",
    budgetRange: initialLeadState.budgetRange || "₹50 Lakhs – ₹1 Crore (Approx.)",
    expectedTimeline: initialLeadState.expectedTimeline || "1 to 3 Months",
    projectDescription:
      initialLeadState.projectDescription ||
      "Discussed spatial design inquiry via studio assistant.",
  });

  const [consentGiven, setConsentGiven] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submissionResult, setSubmissionResult] = useState<{
    referenceCode: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setValidationErrors({});

    // Client-side quick check
    if (!formData.fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!formData.city.trim()) {
      setErrorMessage("Please specify your project city or location.");
      return;
    }
    if (!consentGiven) {
      setErrorMessage("Please grant privacy consent to allow our studio team to review your enquiry.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/chat/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          leadData: formData,
          consentGiven: true,
          idempotencyKey: `chat_${conversationId}_${Date.now()}`,
        }),
      });

      const data = (await res.json()) as CreateChatEnquiryResponse;

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to submit your enquiry. Please try again.");
        if (data.details) {
          setValidationErrors(data.details);
        }
        setIsSubmitting(false);
        return;
      }

      setSubmissionResult({
        referenceCode: data.referenceCode || "AUR-CONFIRMED",
        message: data.message,
      });

      // Track confirmed chatbot lead conversion
      trackEvent("chatbot_lead_submitted", {
        conversationId,
        projectType: formData.projectType,
        city: formData.city,
        referenceCode: data.referenceCode,
      });

      if (onSuccess && data.enquiryId && data.referenceCode) {
        onSuccess(data.enquiryId, data.referenceCode);
      }
    } catch {
      setErrorMessage("Network error occurred while submitting your enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirmed success screen
  if (submissionResult) {
    return (
      <div className="my-3 p-4 bg-[#FFFFFF] border border-[#3B6E4C]/60 rounded-sm shadow-xs space-y-3 animate-in fade-in duration-200">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#E6F4EA] text-[#3B6E4C] flex items-center justify-center font-bold text-xs" aria-hidden="true">
            ✓
          </span>
          <span className="text-[0.65rem] font-mono uppercase tracking-[0.2em] text-[#3B6E4C] font-semibold">
            Enquiry Received • Reference: {submissionResult.referenceCode}
          </span>
        </div>
        <p className="text-xs text-[#242522] leading-relaxed">
          {submissionResult.message}
        </p>
        <div className="pt-1 text-[0.68rem] font-mono text-[#6B6C67]">
          <span>Our studio principal will review your spatial brief and reach out shortly.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="my-3 p-4 bg-[#FFFFFF] border border-[#A17C55]/60 rounded-sm shadow-sm space-y-3.5 text-xs animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#DCD5CB] pb-2.5">
        <div>
          <span className="text-[0.65rem] font-mono uppercase tracking-[0.18em] text-[#A17C55] font-semibold block">
            Studio Consultation Review
          </span>
          <h4 className="font-serif text-base text-[#242522]">
            Project Consultation Brief
          </h4>
        </div>
        {onDecline && (
          <button
            type="button"
            onClick={onDecline}
            aria-label="Decline and close card"
            className="text-[#6B6C67] hover:text-[#242522] text-sm p-1"
          >
            &times;
          </button>
        )}
      </div>

      <p className="text-[0.72rem] text-[#6B6C67] leading-relaxed">
        Review your project details below before sending them to our architectural studio.
      </p>

      {errorMessage && (
        <div className="p-2.5 bg-[#FFF5F5] border border-[#A83E3E]/40 text-[#A83E3E] text-xs rounded-xs">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[0.68rem] font-mono uppercase text-[#242522] mb-1">
              Full Name <span className="text-[#A17C55]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Radhika Sharma"
              className="w-full p-2 bg-[#F7F4EF] border border-[#DCD5CB] focus:border-[#A17C55] rounded-xs text-xs text-[#242522] focus:outline-none"
            />
            {validationErrors.fullName && (
              <span className="text-[0.65rem] text-[#A83E3E] mt-0.5 block">{validationErrors.fullName}</span>
            )}
          </div>

          <div>
            <label className="block text-[0.68rem] font-mono uppercase text-[#242522] mb-1">
              Email Address <span className="text-[#A17C55]">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
              className="w-full p-2 bg-[#F7F4EF] border border-[#DCD5CB] focus:border-[#A17C55] rounded-xs text-xs text-[#242522] focus:outline-none"
            />
            {validationErrors.email && (
              <span className="text-[0.65rem] text-[#A83E3E] mt-0.5 block">{validationErrors.email}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[0.68rem] font-mono uppercase text-[#242522] mb-1">
              Mobile Number (Optional)
            </label>
            <input
              type="tel"
              value={formData.mobileNumber}
              onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full p-2 bg-[#F7F4EF] border border-[#DCD5CB] focus:border-[#A17C55] rounded-xs text-xs text-[#242522] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[0.68rem] font-mono uppercase text-[#242522] mb-1">
              Project City / Location <span className="text-[#A17C55]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="e.g. Bengaluru, Hyderabad"
              className="w-full p-2 bg-[#F7F4EF] border border-[#DCD5CB] focus:border-[#A17C55] rounded-xs text-xs text-[#242522] focus:outline-none"
            />
            {validationErrors.city && (
              <span className="text-[0.65rem] text-[#A83E3E] mt-0.5 block">{validationErrors.city}</span>
            )}
          </div>
        </div>

        {/* Spatial Specifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[0.68rem] font-mono uppercase text-[#242522] mb-1">
              Design Discipline
            </label>
            <select
              value={formData.projectType}
              onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              className="w-full p-2 bg-[#F7F4EF] border border-[#DCD5CB] focus:border-[#A17C55] rounded-xs text-xs text-[#242522] focus:outline-none"
            >
              {projectTypeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[0.68rem] font-mono uppercase text-[#242522] mb-1">
              Property Typology
            </label>
            <select
              value={formData.propertyType}
              onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
              className="w-full p-2 bg-[#F7F4EF] border border-[#DCD5CB] focus:border-[#A17C55] rounded-xs text-xs text-[#242522] focus:outline-none"
            >
              {propertyTypeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[0.68rem] font-mono uppercase text-[#242522] mb-1">
              Budget Range
            </label>
            <select
              value={formData.budgetRange}
              onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
              className="w-full p-2 bg-[#F7F4EF] border border-[#DCD5CB] focus:border-[#A17C55] rounded-xs text-xs text-[#242522] focus:outline-none"
            >
              {budgetRangeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[0.68rem] font-mono uppercase text-[#242522] mb-1">
              Expected Timeline
            </label>
            <select
              value={formData.expectedTimeline}
              onChange={(e) => setFormData({ ...formData, expectedTimeline: e.target.value })}
              className="w-full p-2 bg-[#F7F4EF] border border-[#DCD5CB] focus:border-[#A17C55] rounded-xs text-xs text-[#242522] focus:outline-none"
            >
              {timelineOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Project Description */}
        <div>
          <label className="block text-[0.68rem] font-mono uppercase text-[#242522] mb-1">
            Brief Spatial Notes <span className="text-[#A17C55]">*</span>
          </label>
          <textarea
            rows={2}
            required
            value={formData.projectDescription}
            onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
            placeholder="Describe your property, lifestyle priorities, or specific requirements..."
            className="w-full p-2 bg-[#F7F4EF] border border-[#DCD5CB] focus:border-[#A17C55] rounded-xs text-xs text-[#242522] focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Explicit Privacy Consent Checkbox (Task 7) */}
        <div className="p-3 bg-[#F2EAE0]/50 border border-[#A17C55]/30 rounded-xs space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded-xs border-[#A17C55] text-[#242522] focus:ring-[#A17C55]"
            />
            <span className="text-[0.72rem] text-[#242522] leading-snug">
              May we save these details so the Aurelle Spaces team can review your enquiry and contact you about your project?{" "}
              <Link
                href="/privacy-policy"
                target="_blank"
                className="text-[#A17C55] underline hover:text-[#242522] transition-colors"
              >
                Privacy Policy
              </Link>
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-1 gap-2">
          {onDecline && (
            <button
              type="button"
              onClick={onDecline}
              disabled={isSubmitting}
              className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-[#6B6C67] hover:text-[#242522] border border-[#DCD5CB] hover:bg-[#F7F4EF] rounded-xs transition-colors cursor-pointer"
            >
              Continue Chatting
            </button>
          )}

          <button
            type="submit"
            disabled={!consentGiven || isSubmitting}
            className="ml-auto px-4 py-2 text-xs font-mono uppercase tracking-widest text-[#FFFFFF] bg-[#242522] hover:bg-[#A17C55] disabled:bg-[#DCD5CB] disabled:text-[#8E8F8A] disabled:cursor-not-allowed rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Submit Consultation Brief &rarr;</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
