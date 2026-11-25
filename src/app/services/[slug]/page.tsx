import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { ConsultationCTA } from "@/components/ui/consultation-cta";
import { servicesData } from "@/lib/content/services-data";
import { getPublicServiceBySlug } from "@/lib/cms/content-service";
import { studioImages } from "@/lib/content/images";
import { createMetadata } from "@/lib/seo/metadata";
import { ServiceJsonLd } from "@/components/seo/structured-data";

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublicServiceBySlug(slug);

  if (!service) {
    return createMetadata({
      title: "Service Not Found",
      path: `/services/${slug}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
  });
}

function getServiceHeroImage(slug: string) {
  if (slug.includes("residential")) return studioImages.services.residential;
  if (slug.includes("commercial")) return studioImages.services.commercial;
  if (slug.includes("architecture")) return studioImages.services.architecture;
  if (slug.includes("renovation")) return studioImages.services.renovation;
  return studioImages.services.residential;
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getPublicServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const heroImage = getServiceHeroImage(service.slug);

  return (
    <div className="w-full flex flex-col bg-[#F7F5F1] text-[#242522]">
      <ServiceJsonLd
        name={service.title}
        description={service.metaDescription}
        url={`/services/${service.slug}`}
        serviceType={service.title}
      />

      {/* 1. Service Hero Header */}
      <section className="w-full pt-6 pb-6 sm:pt-8 sm:pb-8 border-b border-[#E6E0D8] bg-[#FFFFFF]">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[0.6875rem] uppercase tracking-widest text-[#A17C55] font-medium block">
                Design Discipline
              </span>
              <h1 className="h1-editorial text-[#242522]">
                {service.title}
              </h1>
              <p className="body-large text-[#62615D] max-w-xl">
                {service.heroSynopsis}
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Button href={`/contact?service=${service.slug}`} variant="primary" size="sm">
                  Discuss a Project Brief
                </Button>
                <Button href="/services" variant="outline" size="sm">
                  All Disciplines
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
                <Image
                  src={heroImage.url}
                  alt={heroImage.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
                />
              </div>
              <p className="mt-2.5 px-1 text-xs text-[#7E7F7A] italic">
                {heroImage.caption}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Overview & Scope */}
      <section className="w-full py-12 sm:py-16 bg-[#F7F5F1]">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
                Scope &amp; Approach
              </span>
              <h2 className="h2-editorial text-[#242522]">
                How we plan and execute this discipline.
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-4 text-[#62615D]">
              {service.overview.map((para, idx) => (
                <p key={idx} className="body-large text-[#242522]">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 3. What the Service Includes */}
      <section className="w-full py-16 sm:py-24 bg-[#FFFFFF] border-y border-[#E6E0D8]">
        <Container size="wide">
          <div className="max-w-2xl mb-12 space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
              Deliverables
            </span>
            <h2 className="h2-editorial text-[#242522]">
              What the Service Includes
            </h2>
            <p className="body-regular text-[#62615D]">
              Our service scopes provide complete transparency, actionable drawing packages, and detailed material specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {service.scopeItems.map((item, idx) => (
              <div
                key={idx}
                className="p-7 border border-[#E6E0D8] bg-[#F7F5F1] rounded-[2px] shadow-studio space-y-4"
              >
                <h3 className="font-serif text-2xl font-normal text-[#242522]">
                  {item.category}
                </h3>
                <p className="text-sm text-[#62615D] leading-relaxed">
                  {item.description}
                </p>
                <ul className="pt-4 border-t border-[#E6E0D8] space-y-2 text-sm text-[#242522]">
                  {item.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55] mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Design Considerations */}
      <section className="w-full py-16 sm:py-24 bg-[#F7F5F1]">
        <Container size="wide">
          <div className="max-w-2xl mb-12 space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
              Key Parameters
            </span>
            <h2 className="h2-editorial text-[#242522]">
              Design &amp; Spatial Considerations
            </h2>
            <p className="body-regular text-[#62615D]">
              Essential climate, material, and structural factors we evaluate during project development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {service.keyConsiderations.map((con, idx) => (
              <div
                key={idx}
                className="p-6 border border-[#E6E0D8] bg-[#FFFFFF] rounded-[2px] shadow-studio space-y-3"
              >
                <h3 className="font-serif text-xl font-normal text-[#242522]">
                  {con.title}
                </h3>
                <p className="text-sm text-[#62615D] leading-relaxed">
                  {con.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Relevant Concept Projects */}
      {service.relevantProjects.length > 0 && (
        <section className="w-full py-16 sm:py-24 bg-[#FFFFFF] border-t border-[#E6E0D8]">
          <Container size="wide">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-8 border-b border-[#E6E0D8]">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
                  Demonstration Studies
                </span>
                <h2 className="h2-editorial text-[#242522]">
                  Relevant Concept Studies
                </h2>
              </div>
              <TextLink href="/portfolio" direction="right">
                View All Projects
              </TextLink>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              {service.relevantProjects.map((p, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col space-y-3 p-4 border border-[#E6E0D8] bg-[#F7F5F1] rounded-[2px] shadow-studio hover:shadow-studio-hover transition-all"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#EAE6DE]">
                    <Image
                      src={
                        studioImages.projects[p.slug as keyof typeof studioImages.projects]?.cover.url ||
                        heroImage.url
                      }
                      alt={
                        studioImages.projects[p.slug as keyof typeof studioImages.projects]?.cover.alt ||
                        p.title
                      }
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-[#A17C55] font-medium">
                      {p.typology} · {p.city}
                    </span>
                    <h3 className="font-serif text-xl text-[#242522]">
                      <Link href={`/portfolio/${p.slug}`} className="hover:text-[#A17C55] transition-colors">
                        {p.title}
                      </Link>
                    </h3>
                  </div>
                  <TextLink href={`/portfolio/${p.slug}`} direction="right">
                    View Concept Study
                  </TextLink>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 6. Consultation CTA */}
      <ConsultationCTA
        heading={`Ready to discuss your ${service.title.toLowerCase()} project?`}
        description="Share a few initial notes about your site, timing, and spatial ambitions. Our studio team will review your brief and schedule an exploratory discussion."
        actionLabel="Start a Consultation"
        actionHref={`/contact?service=${service.slug}`}
        background="primary"
      />
    </div>
  );
}
