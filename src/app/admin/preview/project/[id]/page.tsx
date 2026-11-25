import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdminSession } from "@/lib/security/auth";
import { getProjectForPreview } from "@/lib/cms/content-service";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MaterialPalette } from "@/components/portfolio/material-palette";
import { ProjectGallery } from "@/components/portfolio/project-gallery";

interface PreviewProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Admin Project Preview | Aurelle Spaces",
  robots: { index: false, follow: false },
};

export default async function AdminProjectPreviewPage({ params }: PreviewProps) {
  await requireAdminSession();
  const { id } = await params;

  const preview = await getProjectForPreview(id);
  if (!preview) {
    notFound();
  }

  const { project, isDraft } = preview;

  return (
    <div className="w-full flex flex-col bg-[#F7F4EF] text-[#242522]">
      {/* Sticky Admin Preview Warning Banner */}
      <div className="sticky top-0 z-50 w-full bg-[#A17C55] text-[#FFFFFF] px-4 py-2.5 text-xs font-mono uppercase tracking-wider flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <span className="font-bold bg-[#242522] text-[#F7F4EF] px-2 py-0.5 rounded-[2px]">
            {isDraft ? "DRAFT PREVIEW" : "PREVIEW MODE"}
          </span>
          <span>This content is rendered via administrative session. Not indexed by search engines.</span>
        </div>
        <Link
          href={`/admin/projects/${id}`}
          className="bg-[#242522] hover:bg-[#3A3B37] text-[#F7F4EF] px-3 py-1 rounded-[2px] transition-colors"
        >
          ← Return to Editor
        </Link>
      </div>

      {/* Render Project Content */}
      <article className="w-full">
        <section className="w-full pt-10 pb-16 border-b border-[#DCD5CB] bg-[#FFFFFF]">
          <Container size="wide">
            <div className="mb-8">
              <Breadcrumb items={[{ label: "Admin Console", href: "/admin/projects" }, { label: "Preview" }, { label: project.title }]} />
            </div>

            <div className="max-w-4xl space-y-6">
              <div className="flex items-center gap-4">
                <Eyebrow>{project.category}</Eyebrow>
                <span className="text-xs font-mono text-[#A17C55]">·</span>
                <span className="text-xs font-mono uppercase tracking-wider text-[#6B6C67]">{project.location}</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#242522] tracking-tight">
                {project.title}
              </h1>

              <p className="body-large text-[#6B6C67] leading-relaxed max-w-3xl">
                {project.shortDescription}
              </p>
            </div>
          </Container>
        </section>

        {/* Concept Narrative */}
        <section className="w-full py-16 border-b border-[#DCD5CB]">
          <Container size="reading">
            <div className="space-y-6 text-[#242522] leading-relaxed text-base sm:text-lg max-w-3xl">
              {project.conceptNarrative.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Container>
        </section>

        {/* Material Palette */}
        {project.materialPalette.length > 0 && (
          <section className="w-full py-16 border-b border-[#DCD5CB] bg-[#FFFFFF]">
            <Container size="wide">
              <MaterialPalette swatches={project.materialPalette} />
            </Container>
          </section>
        )}

        {/* Gallery */}
        {project.galleryItems.length > 0 && (
          <section className="w-full py-16">
            <Container size="wide">
              <ProjectGallery plates={project.galleryItems} projectTitle={project.title} />
            </Container>
          </section>
        )}
      </article>
    </div>
  );
}

