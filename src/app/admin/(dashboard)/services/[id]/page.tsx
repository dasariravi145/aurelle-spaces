import React from "react";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/security/auth";
import { getDatabase } from "@/lib/db/client";
import { servicesRepository } from "@/lib/db/repositories/services.repository";
import { servicesData } from "@/lib/content/services-data";
import { ServiceForm } from "@/components/admin/service-form";

interface EditServiceProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: EditServiceProps) {
  await requireAdminSession();
  const { id } = await params;

  let initialData;

  try {
    const db = getDatabase();
    let record = await servicesRepository.findById(db, id);
    if (!record) {
      record = await servicesRepository.findBySlug(db, id);
    }

    if (record) {
      let seo: { metaTitle?: string; metaDescription?: string } = {};
      try {
        seo = JSON.parse(record.seo_metadata || "{}");
      } catch {
        seo = {};
      }

      initialData = {
        id: record.id,
        slug: record.slug,
        title: record.title,
        summary: record.summary,
        description: record.description,
        status: record.status,
        sortOrder: record.sort_order,
        metaTitle: seo.metaTitle || "",
        metaDescription: seo.metaDescription || "",
      };
    }
  } catch {
    // Fallback
  }

  if (!initialData) {
    const staticService = servicesData[id];
    if (staticService) {
      initialData = {
        id: staticService.slug,
        slug: staticService.slug,
        title: staticService.title,
        summary: staticService.shortDescription,
        description: staticService.heroSynopsis,
        status: "published" as const,
        sortOrder: parseInt(staticService.number, 10) || 1,
        metaTitle: staticService.metaTitle,
        metaDescription: staticService.metaDescription,
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
          Services CMS
        </span>
        <h1 className="font-serif text-3xl font-normal text-[#242522]">
          Edit Discipline: {initialData.title}
        </h1>
      </div>

      <ServiceForm mode="edit" initialData={initialData} />
    </div>
  );
}

