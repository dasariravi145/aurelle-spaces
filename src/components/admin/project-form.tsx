"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PROJECT_CATEGORIES } from "@/lib/validation/project-schema";
import type { ProjectCategory, ContentStatus } from "@/lib/db/types";

interface ProjectFormData {
  id?: string;
  title: string;
  slug: string;
  location: string;
  category: ProjectCategory;
  summary: string;
  conceptNarrative: string;
  spacePlanningNotes: string;
  featured: boolean;
  publicationStatus: ContentStatus;
  metaTitle: string;
  metaDescription: string;
}

interface ProjectFormProps {
  mode: "create" | "edit";
  initialData?: Partial<ProjectFormData>;
}

export function ProjectForm({ mode, initialData }: ProjectFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ProjectFormData>({
    id: initialData?.id || "",
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    location: initialData?.location || "",
    category: initialData?.category || "Residential Interiors",
    summary: initialData?.summary || "",
    conceptNarrative: initialData?.conceptNarrative || "",
    spacePlanningNotes: initialData?.spacePlanningNotes || "",
    featured: initialData?.featured || false,
    publicationStatus: initialData?.publicationStatus || "draft",
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-generate slug from title during creation if slug is empty
  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const updates: Partial<ProjectFormData> = { title: val };
      if (mode === "create" && (!prev.slug || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""))) {
        updates.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      }
      return { ...prev, ...updates };
    });
  };

  const handleSubmit = async (targetStatus?: ContentStatus) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const statusToSave = targetStatus || formData.publicationStatus;

    const payload = {
      title: formData.title,
      slug: formData.slug,
      location: formData.location,
      category: formData.category,
      summary: formData.summary,
      detailedContent: {
        conceptNarrative: formData.conceptNarrative.split("\n\n").filter(Boolean),
        spacePlanningNotes: formData.spacePlanningNotes.split("\n").filter(Boolean),
        designApproach: [],
        keyConsiderations: [],
        materialPalette: [],
        galleryItems: [],
        coverAspect: "landscape",
      },
      featured: formData.featured,
      publicationStatus: statusToSave,
      seoMetadata: {
        metaTitle: formData.metaTitle || `${formData.title} | Aurelle Spaces Portfolio`,
        metaDescription: formData.metaDescription || formData.summary,
      },
    };

    try {
      const url = mode === "create" ? "/api/admin/projects" : `/api/admin/projects/${formData.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setErrorMessage(data?.error?.message || "Failed to save project.");
        setLoading(false);
        return;
      }

      setSuccessMessage(
        statusToSave === "published"
          ? "Project published successfully."
          : "Project draft saved successfully."
      );

      if (mode === "create" && data.project?.id) {
        router.push(`/admin/projects/${data.project.id}`);
      } else {
        router.refresh();
      }
    } catch {
      setErrorMessage("Network error while communicating with the server.");
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
          {mode === "create" ? "New Portfolio Monograph" : "Edit Portfolio Monograph"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#242522]">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. The Gulmohar Sanctuary"
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:border-[#A17C55] focus:outline-none"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#242522]">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "") })}
              placeholder="e.g. gulmohar-sanctuary"
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] font-mono text-xs focus:border-[#A17C55] focus:outline-none"
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#242522]">
              Site Location (City, State) *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Sadashivnagar, Bengaluru"
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:border-[#A17C55] focus:outline-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#242522]">
              Design Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:border-[#A17C55] focus:outline-none cursor-pointer"
            >
              {PROJECT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#242522]">
              Publication Status
            </label>
            <select
              value={formData.publicationStatus}
              onChange={(e) => setFormData({ ...formData, publicationStatus: e.target.value as ContentStatus })}
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:border-[#A17C55] focus:outline-none cursor-pointer"
            >
              <option value="draft">Draft (Restricted to Admins)</option>
              <option value="published">Published (Public)</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Featured Checkbox */}
          <div className="md:col-span-2 flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="featured-check"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 accent-[#A17C55] cursor-pointer"
            />
            <label htmlFor="featured-check" className="text-xs text-[#242522] font-mono uppercase tracking-wider cursor-pointer">
              Feature on Homepage &amp; Top of Portfolio
            </label>
          </div>

          {/* Summary */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#242522]">
              Brief Summary * (approx. 1-2 sentences)
            </label>
            <textarea
              rows={3}
              required
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="A private residential villa framed by monolithic stone columns..."
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:border-[#A17C55] focus:outline-none leading-relaxed"
            />
          </div>

          {/* Concept Narrative */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#242522]">
              Detailed Concept Narrative (Separate paragraphs with double enter)
            </label>
            <textarea
              rows={6}
              value={formData.conceptNarrative}
              onChange={(e) => setFormData({ ...formData, conceptNarrative: e.target.value })}
              placeholder="Framed by ancient Gulmohar canopies in North Bengaluru..."
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:border-[#A17C55] focus:outline-none leading-relaxed"
            />
          </div>

          {/* Space Planning Notes */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#242522]">
              Space Planning &amp; Climate Notes (One per line)
            </label>
            <textarea
              rows={4}
              value={formData.spacePlanningNotes}
              onChange={(e) => setFormData({ ...formData, spacePlanningNotes: e.target.value })}
              placeholder="Central courtyard acts as a thermal chimney..."
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:border-[#A17C55] focus:outline-none leading-relaxed font-mono text-xs"
            />
          </div>

          {/* SEO Metadata Block */}
          <div className="space-y-1.5 md:col-span-2 pt-4 border-t border-[#DCD5CB]">
            <span className="font-mono text-xs uppercase tracking-widest text-[#A17C55] block">
              Search Engine Optimization (SEO)
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#242522]">
              SEO Meta Title
            </label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              placeholder="Leave blank for automatic title"
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:border-[#A17C55] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#242522]">
              SEO Meta Description
            </label>
            <input
              type="text"
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              placeholder="Leave blank to use summary"
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:border-[#A17C55] focus:outline-none"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-6 border-t border-[#DCD5CB] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/projects"
              className="px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-[#6B6C67] hover:text-[#242522] transition-colors"
            >
              Cancel
            </Link>
            {formData.id && (
              <Link
                href={`/admin/preview/project/${formData.id}`}
                target="_blank"
                className="px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-[#A17C55] hover:text-[#242522] border border-[#DCD5CB] rounded-[2px] transition-colors"
              >
                Preview ↗
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit("draft")}
              className="px-5 py-2.5 bg-[#EAE4D9] hover:bg-[#DCD5CB] text-[#242522] text-xs font-mono uppercase tracking-widest rounded-[2px] transition-colors disabled:opacity-60 cursor-pointer"
            >
              Save as Draft
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit("published")}
              className="px-6 py-2.5 bg-[#242522] hover:bg-[#3A3B37] text-[#F7F4EF] text-xs font-mono uppercase tracking-widest rounded-[2px] transition-colors disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Persisting..." : "Publish Project →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

