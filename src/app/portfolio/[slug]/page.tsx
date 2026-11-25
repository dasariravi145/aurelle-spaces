import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { MaterialPalette } from "@/components/portfolio/material-palette";
import { ProjectGallery } from "@/components/portfolio/project-gallery";
import { RelatedProjects } from "@/components/portfolio/related-projects";
import { ConsultationCTA } from "@/components/ui/consultation-cta";
import { portfolioProjects } from "@/lib/content/portfolio-data";
import { getPublicProjectBySlug } from "@/lib/cms/content-service";
import { studioImages } from "@/lib/content/images";
import { createMetadata } from "@/lib/seo/metadata";
import { WebPageJsonLd } from "@/components/seo/structured-data";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(portfolioProjects).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);

  if (!project) {
    return createMetadata({
      title: "Project Not Found",
      path: `/portfolio/${slug}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: project.metaTitle,
    description: project.metaDescription,
    path: `/portfolio/${project.slug}`,
  });
}

function getProjectCoverImage(slug: string) {
  const match = studioImages.projects[slug as keyof typeof studioImages.projects];
  if (match) return match.cover;

  if (slug.includes("hyderabad") && slug.includes("courtyard")) return studioImages.projects["courtyard-residence-hyderabad"].cover;
  if (slug.includes("bengaluru") || slug.includes("quiet")) return studioImages.projects["quiet-house-bengaluru"].cover;
  if (slug.includes("pune") || slug.includes("atelier")) return studioImages.projects["atelier-workspace-pune"].cover;
  if (slug.includes("chennai") || slug.includes("veranda")) return studioImages.projects["veranda-home-chennai"].cover;
  if (slug.includes("mumbai") || slug.includes("gallery")) return studioImages.projects["gallery-office-mumbai"].cover;
  if (slug.includes("renewal") || slug.includes("hyderabad")) return studioImages.projects["renewal-apartment-hyderabad"].cover;

  return studioImages.heroLivingRoom;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const coverImage = getProjectCoverImage(project.slug);

  return (
    <div className="w-full flex flex-col bg-[#F7F5F1] text-[#242522]">
      <WebPageJsonLd
        name={project.title}
        description={project.metaDescription}
        url={`/portfolio/${project.slug}`}
      />

      {/* 1. Project Hero Header (Padding reduced ~35%, hero photograph close to top) */}
      <section className="w-full pt-6 pb-6 sm:pt-8 sm:pb-8 border-b border-[#E6E0D8] bg-[#FFFFFF]">
        <Container size="wide">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#A17C55] font-medium">
              <span>{project.category}</span>
              <span>·</span>
              <span className="text-[#62615D]">{project.location}</span>
              <span>·</span>
              <span className="text-[#7E7F7A]">Concept Study {project.year}</span>
            </div>

            <h1 className="h1-editorial text-[#242522]">
              {project.title}
            </h1>

            <p className="body-large text-[#62615D] max-w-3xl">
              {project.shortDescription}
            </p>
          </div>

          {/* Large Architectural Hero Photography (Clean unboxed editorial canvas) */}
          <div className="mt-6 sm:mt-8">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
              <Image
                src={coverImage.url}
                alt={coverImage.alt || project.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover object-center"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#242421]/20 via-transparent to-transparent opacity-30"
                aria-hidden="true"
              />
            </div>
            <div className="mt-2.5 px-1 flex flex-col sm:flex-row justify-between text-xs text-[#7E7F7A] gap-1">
              <span>{project.location} · Estimated Area: {project.areaSqFt} sq. ft.</span>
              <span className="italic text-[#A17C55]">Demonstration Study · Aurelle Spaces</span>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Concept Narrative & Parameters */}
      <section className="w-full py-12 sm:py-16 bg-[#F7F5F1]">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left Narrative Column */}
            <div className="lg:col-span-8 space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
                Design Concept
              </span>
              <h2 className="h2-editorial text-[#242522]">
                Concept &amp; Spatial Flow
              </h2>
              {project.conceptNarrative.map((p, idx) => (
                <p key={idx} className="body-large text-[#242522]">
                  {p}
                </p>
              ))}

              {/* Space Planning Notes */}
              <div className="pt-6 border-t border-[#E6E0D8] space-y-3">
                <span className="text-xs uppercase tracking-wider text-[#A17C55] block font-medium">
                  Spatial Planning Considerations:
                </span>
                <ul className="space-y-2 text-sm text-[#62615D]">
                  {project.spacePlanningNotes.map((note, nIdx) => (
                    <li key={nIdx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55] mt-2 shrink-0" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Project Parameters Sidebar */}
            <div className="lg:col-span-4">
              <div className="border border-[#E6E0D8] bg-[#FFFFFF] p-6 sm:p-8 rounded-[2px] shadow-studio space-y-6">
                <h3 className="text-xs uppercase tracking-widest text-[#A17C55] font-medium pb-3 border-b border-[#E6E0D8]">
                  Project Overview
                </h3>
                <dl className="divide-y divide-[#E6E0D8] text-sm">
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#7E7F7A]">Category</dt>
                    <dd className="font-medium text-[#242522]">{project.category}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#7E7F7A]">Location</dt>
                    <dd className="font-medium text-[#242522]">{project.location}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#7E7F7A]">Area</dt>
                    <dd className="font-medium text-[#242522]">{project.areaSqFt} sq. ft.</dd>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#7E7F7A]">Study Year</dt>
                    <dd className="font-medium text-[#242522]">{project.year}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#7E7F7A]">Status</dt>
                    <dd className="font-medium text-[#A17C55]">Concept Study</dd>
                  </div>
                </dl>

                <div className="pt-2">
                  <Button
                    href={`/contact?project=${project.slug}`}
                    variant="primary"
                    size="sm"
                    className="w-full"
                  >
                    Discuss Similar Brief
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Design Solutions & Approach */}
      <section className="w-full py-16 sm:py-24 bg-[#FFFFFF] border-y border-[#E6E0D8]">
        <Container size="wide">
          <div className="max-w-2xl mb-12 space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
              Approach
            </span>
            <h2 className="h2-editorial text-[#242522]">
              Design Solutions &amp; Spatial Details
            </h2>
            <p className="body-regular text-[#62615D]">
              How we translated climatic context and functional priorities into physical form.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {project.designApproach.map((app, idx) => (
              <div
                key={idx}
                className="p-6 border border-[#E6E0D8] bg-[#F7F5F1] rounded-[2px] shadow-studio space-y-3"
              >
                <h3 className="font-serif text-xl font-normal text-[#242522]">
                  {app.title}
                </h3>
                <p className="text-sm text-[#62615D] leading-relaxed">
                  {app.narrative}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Visual Image Gallery (Real Photography) */}
      <section className="w-full py-16 sm:py-24 bg-[#F7F5F1]">
        <Container size="wide">
          <div className="mb-10 space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
              Visual Studies
            </span>
            <h2 className="h2-editorial text-[#242522]">
              Selected Spaces &amp; Moments
            </h2>
            <p className="body-regular text-[#62615D]">
              Interior perspectives, joinery detailing, and atmospheric natural lighting.
            </p>
          </div>

          <ProjectGallery
            plates={project.galleryItems}
            projectTitle={project.title}
            projectSlug={project.slug}
          />
        </Container>
      </section>

      {/* 5. Material Palette Section */}
      <section className="w-full py-16 sm:py-24 bg-[#FFFFFF] border-y border-[#E6E0D8]">
        <Container size="wide">
          <div className="mb-10 space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
              Materiality
            </span>
            <h2 className="h2-editorial text-[#242522]">
              Curated Material Palette
            </h2>
            <p className="body-regular text-[#62615D]">
              A calibrated selection of authentic regional stones, seasoned solid timbers, and tactile metalwork.
            </p>
          </div>

          <MaterialPalette swatches={project.materialPalette} />
        </Container>
      </section>

      {/* 6. Key Considerations */}
      <section className="w-full py-16 sm:py-24 bg-[#F7F5F1]">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            <div className="lg:col-span-4 space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
                Considerations
              </span>
              <h2 className="h2-editorial text-[#242522]">
                Key Technical Parameters
              </h2>
              <p className="text-sm text-[#62615D]">
                Critical environmental and structural factors evaluated during the design of this space.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {project.keyConsiderations.map((con, idx) => (
                <div
                  key={idx}
                  className="p-5 border border-[#E6E0D8] bg-[#FFFFFF] rounded-[2px] shadow-studio space-y-2"
                >
                  <h3 className="font-serif text-lg text-[#242522]">
                    {con.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#62615D] leading-relaxed">
                    {con.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 7. Related Projects */}
      <section className="w-full py-16 sm:py-24 bg-[#FFFFFF] border-t border-[#E6E0D8]">
        <Container size="wide">
          <RelatedProjects
            currentSlug={project.slug}
            relatedSlugs={project.relatedSlugs}
          />
        </Container>
      </section>

      {/* 8. Consultation CTA */}
      <ConsultationCTA
        heading={`Inspired by ${project.title}?`}
        description="Every project begins with a conversation. Let us discuss how we can tailor our architectural and interior design approach to your site."
        actionLabel="Discuss Your Space"
        actionHref={`/contact?project=${project.slug}`}
        background="primary"
      />
    </div>
  );
}
