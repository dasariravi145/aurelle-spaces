"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ContentStatus } from "@/lib/db/types";

interface ArticleFormData {
  id?: string;
  title: string;
  slug: string;
  category: string;
  readingTime: string;
  excerpt: string;
  contentMarkdown: string;
  keyTakeaways: string;
  publicationStatus: ContentStatus;
  metaTitle: string;
  metaDescription: string;
}

interface ArticleFormProps {
  mode: "create" | "edit";
  initialData?: Partial<ArticleFormData>;
}

export function ArticleForm({ mode, initialData }: ArticleFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ArticleFormData>({
    id: initialData?.id || "",
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "Residential Design",
    readingTime: initialData?.readingTime || "5 min read",
    excerpt: initialData?.excerpt || "",
    contentMarkdown: initialData?.contentMarkdown || "",
    keyTakeaways: initialData?.keyTakeaways || "",
    publicationStatus: initialData?.publicationStatus || "draft",
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (targetStatus?: ContentStatus) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const statusToSave = targetStatus || formData.publicationStatus;

    // Convert Markdown / sections
    const rawSections = formData.contentMarkdown.split("\n\n## ").map((block, idx) => {
      if (idx === 0) {
        const parts = block.split("\n\n");
        return {
          heading: "Introduction",
          paragraphs: parts.filter(Boolean),
        };
      }
      const lines = block.split("\n\n");
      const heading = lines[0].replace(/^##\s*/, "").trim();
      const paragraphs = lines.slice(1).filter(Boolean);
      return { heading, paragraphs };
    });

    const payload = {
      title: formData.title,
      slug: formData.slug,
      category: formData.category,
      excerpt: formData.excerpt,
      articleContent: {
        readingTime: formData.readingTime,
        sections: rawSections,
        keyTakeaways: formData.keyTakeaways.split("\n").filter(Boolean),
        relatedSlugs: [],
        coverAspect: "widescreen",
      },
      publicationStatus: statusToSave,
      publishedAt: statusToSave === "published" ? new Date().toISOString() : undefined,
      seoMetadata: {
        metaTitle: formData.metaTitle || `${formData.title} | Aurelle Spaces Journal`,
        metaDescription: formData.metaDescription || formData.excerpt,
      },
    };

    try {
      const url = mode === "create" ? "/api/admin/journal" : `/api/admin/journal/${formData.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setErrorMessage(data?.error?.message || "Failed to save article.");
        setLoading(false);
        return;
      }

      setSuccessMessage(
        statusToSave === "published"
          ? "Journal article published successfully."
          : "Article draft saved."
      );

      if (mode === "create" && data.article?.id) {
        router.push(`/admin/journal/${data.article.id}`);
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
          {mode === "create" ? "Write Architectural Monograph" : "Edit Monograph"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#242522]">
              Article Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => {
                const val = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  title: val,
                  slug: mode === "create" && !prev.slug ? val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : prev.slug,
                }));
              }}
              placeholder="e.g. Planning a Home That Works for Everyday Life"
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
              placeholder="e.g. planning-a-home-that-works"
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] font-mono text-xs focus:border-[#A17C55] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#242522]">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Residential Design, Materials & Craft, Workspace..."
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:border-[#A17C55] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#242522]">
              Excerpt / Synopsis *
            </label>
            <textarea
              rows={3}
              required
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Why thoughtful residential architecture begins not with luxury decor..."
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:border-[#A17C55] focus:outline-none leading-relaxed"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#242522]">
              Article Body Content (Markdown format, use ## for headings)
            </label>
            <textarea
              rows={10}
              value={formData.contentMarkdown}
              onChange={(e) => setFormData({ ...formData, contentMarkdown: e.target.value })}
              placeholder="Write the architectural monograph here..."
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] font-mono text-xs focus:border-[#A17C55] focus:outline-none leading-relaxed"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#242522]">
              Key Takeaways (One per line)
            </label>
            <textarea
              rows={3}
              value={formData.keyTakeaways}
              onChange={(e) => setFormData({ ...formData, keyTakeaways: e.target.value })}
              placeholder="Choreograph floor plans around domestic routines..."
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] font-mono text-xs focus:border-[#A17C55] focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-[#DCD5CB] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/journal"
              className="text-xs font-mono uppercase tracking-wider text-[#6B6C67] hover:text-[#242522]"
            >
              Cancel
            </Link>
            {formData.id && (
              <Link
                href={`/admin/preview/article/${formData.id}`}
                target="_blank"
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#A17C55] hover:text-[#242522] border border-[#DCD5CB] rounded-[2px]"
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
              className="px-5 py-2.5 bg-[#EAE4D9] hover:bg-[#DCD5CB] text-[#242522] text-xs font-mono uppercase tracking-widest rounded-[2px]"
            >
              Save Draft
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit("published")}
              className="px-6 py-2.5 bg-[#242522] hover:bg-[#3A3B37] text-[#F7F4EF] text-xs font-mono uppercase tracking-widest rounded-[2px]"
            >
              {loading ? "Persisting..." : "Publish Monograph →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

