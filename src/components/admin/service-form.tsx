"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ContentStatus } from "@/lib/db/types";

interface ServiceFormData {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  status: ContentStatus;
  sortOrder: number;
  metaTitle: string;
  metaDescription: string;
}

interface ServiceFormProps {
  mode: "create" | "edit";
  initialData?: Partial<ServiceFormData>;
}

export function ServiceForm({ mode, initialData }: ServiceFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ServiceFormData>({
    id: initialData?.id || "",
    slug: initialData?.slug || "",
    title: initialData?.title || "",
    summary: initialData?.summary || "",
    description: initialData?.description || "",
    status: initialData?.status || "published",
    sortOrder: initialData?.sortOrder ?? 1,
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const payload = {
      slug: formData.slug,
      title: formData.title,
      summary: formData.summary,
      description: formData.description,
      status: formData.status,
      sortOrder: Number(formData.sortOrder),
      seoMetadata: {
        metaTitle: formData.metaTitle || `${formData.title} | Aurelle Spaces`,
        metaDescription: formData.metaDescription || formData.summary,
      },
    };

    try {
      const url = mode === "create" ? "/api/admin/services" : `/api/admin/services/${formData.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setErrorMessage(data?.error?.message || "Failed to save service discipline.");
        setLoading(false);
        return;
      }

      setSuccessMessage("Service discipline saved successfully.");
      if (mode === "create" && data.service?.id) {
        router.push(`/admin/services/${data.service.id}`);
      } else {
        router.refresh();
      }
    } catch {
      setErrorMessage("Network error communicating with server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {errorMessage && (
        <div className="p-4 bg-[#FAF2EF] border-l-2 border-[#A14B3A] text-xs text-[#A14B3A] rounded-[2px]">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-[#F2F7F2] border-l-2 border-[#4A7C59] text-xs text-[#4A7C59] rounded-[2px]">
          {successMessage}
        </div>
      )}

      <div className="bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] p-6 sm:p-8 space-y-6">
        <h2 className="font-serif text-xl font-normal text-[#242522]">
          {mode === "create" ? "Create Service Discipline" : "Edit Service Discipline"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#242522]">
              Service Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Residential Interiors"
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:border-[#A17C55] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#242522]">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "") })}
              placeholder="e.g. residential-interiors"
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] font-mono text-xs focus:border-[#A17C55] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#242522]">
              Sort Order (0, 1, 2, ...)
            </label>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 0 })}
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:border-[#A17C55] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#242522]">
              Short Summary *
            </label>
            <textarea
              rows={2}
              required
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Bespoke joinery, tailored spatial flow..."
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:border-[#A17C55] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#242522]">
              Hero Synopsis &amp; Detailed Discipline Approach *
            </label>
            <textarea
              rows={5}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="We design home interiors that celebrate the quiet rituals of domestic life..."
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:border-[#A17C55] focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-[#DCD5CB] flex justify-between items-center">
          <Link
            href="/admin/services"
            className="text-xs font-mono uppercase tracking-wider text-[#6B6C67] hover:text-[#242522]"
          >
            Cancel
          </Link>

          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-[#242522] hover:bg-[#3A3B37] text-[#F7F4EF] text-xs font-mono uppercase tracking-widest rounded-[2px] transition-colors disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Persisting..." : "Save Discipline →"}
          </button>
        </div>
      </div>
    </div>
  );
}

