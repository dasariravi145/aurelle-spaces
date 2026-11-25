"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { FormField } from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { trackEvent } from "@/lib/analytics/events";
import {
  projectTypeOptions,
  propertyTypeOptions,
  budgetRangeOptions,
  timelineOptions,
  validateEnquiryForm,
  type EnquiryFormData,
} from "@/lib/validation/enquiry-schema";

export function ConsultationForm() {
  const [formData, setFormData] = useState<Partial<EnquiryFormData>>({
    fullName: "",
    email: "",
    mobileNumber: "",
    city: "",
    projectType: "",
    propertyType: "",
    approximateArea: "",
    budgetRange: "",
    expectedTimeline: "",
    projectDescription: "",
    privacyConsent: false,
  });

  // Honeypot field for spam bots
  const [honeypot, setHoneypot] = useState("");

  // Client-side idempotency tracking to prevent double-submit
  const [idempotencyKey, setIdempotencyKey] = useState(
    () => `cl_idemp_${Math.random().toString(36).substring(2)}_${Date.now()}`
  );
  const formStartedRef = useRef(false);

  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryFormData, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "confirmed" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackEvent("contact_form_started", { initialProjectType: formData.projectType });
    }

    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));

    if (errors[id as keyof EnquiryFormData]) {
      setErrors((prev) => ({
        ...prev,
        [id]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerMessage(null);

    // Initial client validation check
    const clientValidation = validateEnquiryForm(formData);
    if (!clientValidation.isValid) {
      setErrors(clientValidation.errors);
      trackEvent("contact_form_failed", {
        errorCode: "CLIENT_VALIDATION",
        validationFieldCount: Object.keys(clientValidation.errors).length,
      });
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({
          ...formData,
          websiteUrl: honeypot, // Honeypot field
          idempotencyKey,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        setStatus("error");
        setServerMessage(
          data?.error?.message || "We could not process your submission. Please verify your information."
        );
        if (data?.error?.details) {
          setErrors(data.error.details);
        }
        trackEvent("contact_form_failed", {
          errorCode: data?.error?.code || "SERVER_ERROR",
        });
        return;
      }

      // Persistence confirmed by backend
      setStatus("confirmed");
      setSubmittedEnquiryId(data.enquiryId || null);

      // Track conversion event (data minimised: no PII)
      trackEvent("contact_form_submitted", {
        enquiryId: data.enquiryId,
        projectType: formData.projectType || "General",
        city: formData.city || "Unknown",
        propertyType: formData.propertyType || null,
        budgetRange: formData.budgetRange || null,
      });
    } catch {
      setStatus("error");
      setServerMessage("A network communication error occurred. Please check your internet connection.");
      trackEvent("contact_form_failed", { errorCode: "NETWORK_ERROR" });
    }
  };

  const handleResetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      mobileNumber: "",
      city: "",
      projectType: "",
      propertyType: "",
      approximateArea: "",
      budgetRange: "",
      expectedTimeline: "",
      projectDescription: "",
      privacyConsent: false,
    });
    setErrors({});
    setStatus("idle");
    setServerMessage(null);
    setSubmittedEnquiryId(null);
    setIdempotencyKey(`cl_idemp_${Math.random().toString(36).substring(2)}_${Date.now()}`);
  };

  /* Confirmed Submission Screen */
  if (status === "confirmed") {
    return (
      <div className="bg-[#FFFFFF] border border-[#DCD5CB] p-8 sm:p-12 rounded-[2px] shadow-[0_4px_24px_rgba(36,37,34,0.03)] space-y-6 text-center">
        <div className="w-14 h-14 mx-auto bg-[#F7F4EF] rounded-full flex items-center justify-center text-[#A17C55] font-serif text-2xl border border-[#DCD5CB]">
          ✓
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <span className="font-mono text-xs uppercase tracking-widest text-[#A17C55] block">
            Submission Confirmed
          </span>
          <h2 className="font-serif text-3xl font-light text-[#242522]">
            Thank you for sharing your requirements.
          </h2>
          <p className="text-sm text-[#6B6C67] leading-relaxed">
            Your enquiry has been received. Our architectural directors will review your spatial brief, site context, and project scope before coordinating an initial exploratory conversation.
          </p>
        </div>

        {submittedEnquiryId && (
          <div className="p-4 bg-[#F7F4EF] border border-[#DCD5CB] rounded-[2px] max-w-xs mx-auto">
            <span className="text-[0.68rem] font-mono uppercase tracking-wider text-[#6B6C67] block">
              Enquiry Reference
            </span>
            <code className="text-xs font-mono font-medium text-[#242522] block pt-0.5">
              {submittedEnquiryId}
            </code>
          </div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/portfolio"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#242522] hover:bg-[#3A3B37] text-[#F7F4EF] text-xs font-mono uppercase tracking-wider rounded-[2px] transition-colors"
          >
            Explore Portfolio Monograph →
          </Link>
          <button
            type="button"
            onClick={handleResetForm}
            className="w-full sm:w-auto px-6 py-2.5 border border-[#DCD5CB] text-[#242522] hover:bg-[#F7F4EF] text-xs font-mono uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
          >
            Submit Another Brief
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] border border-[#DCD5CB] p-6 sm:p-10 rounded-[2px] shadow-[0_4px_24px_rgba(36,37,34,0.03)]">
      <div className="mb-8 space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#242522]">
          Project Scoping Brief
        </h2>
        <p className="text-xs sm:text-sm text-[#6B6C67] leading-relaxed">
          Please outline your site context, spatial objectives, and target timeline. Every inquiry is reviewed by our lead architects to verify typology alignment.
        </p>
      </div>

      {status === "error" && serverMessage && (
        <div
          role="alert"
          className="mb-8 p-4 bg-[#FAF2EF] border-l-2 border-[#A14B3A] text-xs text-[#A14B3A] rounded-[2px] space-y-1"
        >
          <p className="font-medium font-mono uppercase tracking-wider">Submission Alert</p>
          <p>{serverMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Invisible Honeypot Field */}
        <div style={{ display: "none" }} aria-hidden="true">
          <label htmlFor="websiteUrl">Leave this field blank</label>
          <input
            type="text"
            id="websiteUrl"
            name="websiteUrl"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* 1. Client Identity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            id="fullName"
            label="Full Name *"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Anandita Sen"
            error={errors.fullName}
            disabled={status === "submitting"}
            required
          />

          <FormField
            id="email"
            label="Email Address *"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. anandita@domain.com"
            error={errors.email}
            disabled={status === "submitting"}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            id="mobileNumber"
            label="Mobile Number (Optional)"
            type="tel"
            value={formData.mobileNumber}
            onChange={handleChange}
            placeholder="e.g. +91 98450 12345"
            error={errors.mobileNumber}
            disabled={status === "submitting"}
            helpText="For scheduling calls and WhatsApp project coordination."
          />

          <FormField
            id="city"
            label="Project City / Location *"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Bengaluru, Sadashivnagar"
            error={errors.city}
            disabled={status === "submitting"}
            required
          />
        </div>

        {/* 2. Typology & Architecture Scope */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Select
            id="projectType"
            label="Design Discipline *"
            value={formData.projectType}
            onChange={handleChange}
            options={projectTypeOptions}
            error={errors.projectType}
            disabled={status === "submitting"}
            placeholder="Select a discipline"
            required
          />

          <Select
            id="propertyType"
            label="Spatial Typology"
            value={formData.propertyType}
            onChange={handleChange}
            options={propertyTypeOptions}
            error={errors.propertyType}
            disabled={status === "submitting"}
            placeholder="Select property format"
          />
        </div>

        {/* 3. Scale, Budget & Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <FormField
            id="approximateArea"
            label="Approx. Area (Sq. Ft.)"
            value={formData.approximateArea}
            onChange={handleChange}
            placeholder="e.g. 4,200 sq.ft."
            error={errors.approximateArea}
            disabled={status === "submitting"}
          />

          <Select
            id="budgetRange"
            label="Indicative Budget"
            value={formData.budgetRange}
            onChange={handleChange}
            options={budgetRangeOptions}
            error={errors.budgetRange}
            disabled={status === "submitting"}
            placeholder="Select bracket"
          />

          <Select
            id="expectedTimeline"
            label="Target Timeline"
            value={formData.expectedTimeline}
            onChange={handleChange}
            options={timelineOptions}
            error={errors.expectedTimeline}
            disabled={status === "submitting"}
            placeholder="Select timeline"
          />
        </div>

        {/* 4. Project Narrative */}
        <Textarea
          id="projectDescription"
          label="Project Narrative & Lifestyle Brief *"
          value={formData.projectDescription}
          onChange={handleChange}
          placeholder="Tell us about the space, family habits, light requirements, or functional friction you wish to solve..."
          rows={5}
          error={errors.projectDescription}
          disabled={status === "submitting"}
          helpText="Minimum 10 characters. Include any structural context, old memory, or orientation notes."
          required
        />

        {/* 5. Privacy Consent Checkbox */}
        <div className="pt-2">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="privacyConsent"
              checked={formData.privacyConsent || false}
              onChange={handleChange}
              disabled={status === "submitting"}
              className="mt-1 h-4 w-4 rounded border-[#DCD5CB] text-[#A17C55] accent-[#A17C55] focus:ring-[#A17C55] cursor-pointer"
            />
            <label
              htmlFor="privacyConsent"
              className="text-xs text-[#6B6C67] leading-relaxed cursor-pointer"
            >
              I consent to Aurelle Spaces reviewing and processing my submitted project brief in accordance with the{" "}
              <Link href="/privacy-policy" target="_blank" className="text-[#242522] underline underline-offset-2 hover:text-[#A17C55]">
                Privacy Policy
              </Link>
              . Data is strictly utilized for studio consultation scoping and never distributed to third parties. *
            </label>
          </div>
          {errors.privacyConsent && (
            <p className="mt-1 text-xs text-[#A14B3A]">{errors.privacyConsent}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-[#DCD5CB]">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#242522] hover:bg-[#3A3B37] text-[#F7F4EF] text-xs font-mono uppercase tracking-widest rounded-[2px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A17C55] focus-visible:ring-offset-2 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
          >
            {status === "submitting" ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#F7F4EF]/30 border-t-[#F7F4EF] rounded-full animate-spin" />
                <span>Submitting Brief to Studio...</span>
              </>
            ) : (
              <span>Submit Scoping Brief →</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
