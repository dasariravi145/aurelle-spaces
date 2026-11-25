import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { studioImages } from "@/lib/content/images";

/**
 * Journal Preview Component (Part 7 Spec)
 * Highlights two editorial stories on domestic planning and materiality.
 */
export function JournalPreview() {
  const articles = [
    {
      slug: "planning-a-home-that-works-for-everyday-life",
      category: "Domestic Planning",
      readingTime: "5 min read",
      title: "Planning a home that works for everyday life.",
      excerpt:
        "How circulation paths, kitchen flow, and natural daylight orientation create calm order in contemporary residences.",
      image: studioImages.journal["planning-a-home-that-works-for-everyday-life"],
    },
    {
      slug: "choosing-materials-with-care",
      category: "Materiality",
      readingTime: "4 min read",
      title: "Choosing materials that age with dignity.",
      excerpt:
        "Selecting regional stones, solid timbers, and breathable mineral plasters that grow richer over decades of honest use.",
      image: studioImages.journal["choosing-materials-with-care"],
    },
  ];

  return (
    <section className="w-full py-20 sm:py-28 bg-[#FFFFFF] border-b border-[#E6E0D8]">
      <Container size="wide">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-10 border-b border-[#E6E0D8]">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
              Studio Journal
            </span>
            <h2 className="h2-editorial text-[#242421]">
              Notes on spaces, materials and everyday living.
            </h2>
            <p className="body-regular text-[#62615D]">
              Practical perspectives on architecture, residential planning, and regional materials across India.
            </p>
          </div>
          <TextLink href="/journal" direction="right">
            All Journal Articles
          </TextLink>
        </div>

        {/* 2 Editorial Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
          {articles.map((article) => (
            <article key={article.slug} className="group flex flex-col space-y-4">
              <Link
                href={`/journal/${article.slug}`}
                className="block relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A17C55] rounded-xs"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
                  <Image
                    src={article.image.url}
                    alt={article.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#242421]/20 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity"
                    aria-hidden="true"
                  />
                </div>
              </Link>

              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-[#A17C55] font-medium">
                  <span>{article.category}</span>
                  <span>·</span>
                  <span className="text-[#7E7F7A]">{article.readingTime}</span>
                </div>

                <h3 className="font-serif text-2xl font-normal text-[#242421]">
                  <Link
                    href={`/journal/${article.slug}`}
                    className="hover:text-[#A17C55] transition-colors"
                  >
                    {article.title}
                  </Link>
                </h3>

                <p className="text-sm text-[#62615D] leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E6E0D8] flex items-center justify-between text-xs text-[#7E7F7A]">
                <span>Aurelle Spaces Editorial</span>
                <TextLink href={`/journal/${article.slug}`} direction="right">
                  Read Article
                </TextLink>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

