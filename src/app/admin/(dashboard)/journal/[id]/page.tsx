import React from "react";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/security/auth";
import { getDatabase } from "@/lib/db/client";
import { articlesRepository } from "@/lib/db/repositories/articles.repository";
import { journalArticles } from "@/lib/content/journal-data";
import { ArticleForm } from "@/components/admin/article-form";

interface EditArticleProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticleProps) {
  await requireAdminSession();
  const { id } = await params;

  let initialData;

  try {
    const db = getDatabase();
    let record = await articlesRepository.findById(db, id);
    if (!record) {
      record = await articlesRepository.findBySlug(db, id);
    }

    if (record) {
      let content: Record<string, unknown> = {};
      try {
        content = JSON.parse(record.article_content || "{}");
      } catch {
        content = {};
      }

      let seo: { metaTitle?: string; metaDescription?: string } = {};
      try {
        seo = JSON.parse(record.seo_metadata || "{}");
      } catch {
        seo = {};
      }

      const sections = (content.sections as Array<{ heading: string; paragraphs: string[] }>) || [];
      const markdown = sections
        .map((s) => `## ${s.heading}\n\n${s.paragraphs.join("\n\n")}`)
        .join("\n\n");

      initialData = {
        id: record.id,
        title: record.title,
        slug: record.slug,
        category: record.category,
        readingTime: (content.readingTime as string) || "5 min read",
        excerpt: record.excerpt,
        contentMarkdown: markdown,
        keyTakeaways: ((content.keyTakeaways as string[]) || []).join("\n"),
        publicationStatus: record.publication_status,
        metaTitle: seo.metaTitle || "",
        metaDescription: seo.metaDescription || "",
      };
    }
  } catch {
    // Fallback
  }

  if (!initialData) {
    const staticArt = Object.values(journalArticles).find(
      (a) => a.id === id || a.slug === id
    );

    if (staticArt) {
      const markdown = staticArt.sections
        .map((s) => `## ${s.heading}\n\n${s.paragraphs.join("\n\n")}`)
        .join("\n\n");

      initialData = {
        id: staticArt.id,
        title: staticArt.title,
        slug: staticArt.slug,
        category: staticArt.category,
        readingTime: staticArt.readingTime,
        excerpt: staticArt.excerpt,
        contentMarkdown: markdown,
        keyTakeaways: staticArt.keyTakeaways.join("\n"),
        publicationStatus: "published" as const,
        metaTitle: staticArt.metaTitle,
        metaDescription: staticArt.metaDescription,
      };
    }
  }

  if (!initialData) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-mono uppercase tracking-widest text-[#A17C55] block">
          Journal CMS
        </span>
        <h1 className="font-serif text-3xl font-normal text-[#242522]">
          Edit Monograph: {initialData.title}
        </h1>
      </div>

      <ArticleForm mode="edit" initialData={initialData} />
    </div>
  );
}

