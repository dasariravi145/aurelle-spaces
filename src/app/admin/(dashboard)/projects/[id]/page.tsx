import React from "react";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/security/auth";
import { getDatabase } from "@/lib/db/client";
import { projectsRepository } from "@/lib/db/repositories/projects.repository";
import { portfolioProjects } from "@/lib/content/portfolio-data";
import { ProjectForm } from "@/components/admin/project-form";

interface EditProjectProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectProps) {
  await requireAdminSession();
  const { id } = await params;

  let initialData;

  try {
    const db = getDatabase();
    let record = await projectsRepository.findById(db, id);
    if (!record) {
      record = await projectsRepository.findBySlug(db, id);
    }

    if (record) {
      let content: Record<string, unknown> = {};
      try {
        content = JSON.parse(record.detailed_content || "{}");
      } catch {
        content = {};
      }

      let seo: { metaTitle?: string; metaDescription?: string } = {};
      try {
        seo = JSON.parse(record.seo_metadata || "{}");
      } catch {
        seo = {};
      }

      initialData = {
        id: record.id,
        title: record.title,
        slug: record.slug,
        location: record.location,
        category: record.category,
        summary: record.summary,
        conceptNarrative: ((content.conceptNarrative as string[]) || []).join("\n\n"),
        spacePlanningNotes: ((content.spacePlanningNotes as string[]) || []).join("\n"),
        featured: record.featured === 1,
        publicationStatus: record.publication_status,
        metaTitle: seo.metaTitle || "",
        metaDescription: seo.metaDescription || "",
      };
    }
  } catch {
    // Fallback
  }

  if (!initialData) {
    const staticProj = Object.values(portfolioProjects).find(
      (p) => p.id === id || p.slug === id
    );

    if (staticProj) {
      initialData = {
        id: staticProj.id,
        title: staticProj.title,
        slug: staticProj.slug,
        location: `${staticProj.location}, ${staticProj.city}`,
        category: staticProj.category,
        summary: staticProj.shortDescription,
        conceptNarrative: staticProj.conceptNarrative.join("\n\n"),
        spacePlanningNotes: staticProj.spacePlanningNotes.join("\n"),
        featured: staticProj.featured || false,
        publicationStatus: "published" as const,
        metaTitle: staticProj.metaTitle,
        metaDescription: staticProj.metaDescription,
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
          Portfolio CMS
        </span>
        <h1 className="font-serif text-3xl font-normal text-[#242522]">
          Edit Project: {initialData.title}
        </h1>
      </div>

      <ProjectForm mode="edit" initialData={initialData} />
    </div>
  );
}

