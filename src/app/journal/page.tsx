import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { ConsultationCTA } from "@/components/ui/consultation-cta";
import { getPublicArticles } from "@/lib/cms/content-service";
import { studioImages } from "@/lib/content/images";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Studio Journal | Notes on Spaces, Materials & Everyday Living",
  description:
    "Thoughts on thoughtful interiors, practical planning, regional materials and the details that shape the way we use our spaces across India.",
  path: "/journal",
});

function getArticleImage(slug: string) {
  if (slug.includes("planning") || slug.includes("everyday")) {
    return studioImages.journal["planning-a-home-that-works-for-everyday-life"];
  }
  if (slug.includes("material") || slug.includes("care")) {
    return studioImages.journal["choosing-materials-with-care"];
  }
  if (slug.includes("compact") || slug.includes("space")) {
    return studioImages.journal["making-better-use-of-compact-spaces"];
  }
  return studioImages.heroLivingRoom;
}

export default async function JournalPage() {
  const allArticles = await getPublicArticles();
  const featuredArticle = allArticles.find((a) => a.featured) || allArticles[0];
  const secondaryArticles = allArticles.filter((a) => a.slug !== featuredArticle?.slug);

  const featuredImage = featuredArticle ? getArticleImage(featuredArticle.slug) : null;

  return (
    <div className="w-full flex flex-col bg-[#F7F5F1] text-[#242522]">
      {/* 1. Publication Header (Height reduced ~35%, imagery brought near top) */}
      <section className="w-full pt-6 pb-6 sm:pt-8 sm:pb-8 border-b border-[#E6E0D8] bg-[#FFFFFF]">
        <Container size="wide">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="max-w-2xl space-y-1 sm:space-y-1.5">
              <span className="text-[0.6875rem] uppercase tracking-widest text-[#A17C55] font-medium block">
                Studio Journal
              </span>
              <h1 className="h1-editorial text-[#242522]">
                Notes on Spaces, Materials &amp; Living
              </h1>
              <p className="text-sm sm:text-base text-[#62615D] max-w-xl">
                Practical perspectives on domestic planning, regional materiality, and the
                subtle architectural details that shape our daily routines across India.
              </p>
            </div>
            <div className="text-xs text-[#7E7F7A] shrink-0 md:text-right pt-1 md:pt-0">
              <span className="text-[#242522] font-medium block">Studio Essays</span>
              <span>Observations from active practice and on-site craft.</span>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Featured Article Spread (Pristine editorial composition, image leads) */}
      {featuredArticle && featuredImage && (
        <section className="w-full pt-6 sm:pt-8 pb-12 sm:pb-16 bg-[#F7F5F1] border-b border-[#E6E0D8]">
          <Container size="wide">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              {/* Cover Canvas */}
              <div className="lg:col-span-7">
                <Link
                  href={`/journal/${featuredArticle.slug}`}
                  className="group block relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A17C55] rounded-xs"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
                    <Image
                      src={featuredImage.url}
                      alt={featuredImage.alt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="mt-2.5 px-1 flex justify-between text-xs text-[#7E7F7A]">
                    <span>Featured Essay · {featuredArticle.category}</span>
                    <span className="text-[#A17C55] font-medium group-hover:underline flex items-center gap-1">
                      Read Essay
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </div>

              {/* Narrative Summary */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#A17C55] font-medium">
                  <span>{featuredArticle.category}</span>
                  <span>·</span>
                  <span className="text-[#7E7F7A]">{featuredArticle.readingTime}</span>
                </div>

                <h2 className="h2-editorial text-[#242522]">
                  <Link
                    href={`/journal/${featuredArticle.slug}`}
                    className="hover:text-[#A17C55] transition-colors"
                  >
                    {featuredArticle.title}
                  </Link>
                </h2>

                <p className="body-large text-[#62615D] line-clamp-3">
                  {featuredArticle.excerpt}
                </p>

                <div className="pt-3 border-t border-[#E6E0D8] flex items-center justify-between text-xs text-[#7E7F7A]">
                  <span>Published {featuredArticle.publicationDate}</span>
                  <TextLink href={`/journal/${featuredArticle.slug}`} direction="right">
                    Read Complete Article
                  </TextLink>
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 3. Secondary Articles Grid (Clean editorial grid, no redundant card boxes) */}
      <section className="w-full py-12 sm:py-16 bg-[#FFFFFF] border-b border-[#E6E0D8]">
        <Container size="wide">
          <div className="mb-8 pb-3 border-b border-[#E6E0D8] flex justify-between items-baseline">
            <h3 className="font-serif text-2xl font-normal text-[#242522]">
              Recent Editorial Notes
            </h3>
            <span className="text-xs text-[#7E7F7A]">
              {allArticles.length} Studio Articles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {secondaryArticles.map((article) => {
              const image = getArticleImage(article.slug);

              return (
                <article key={article.slug} className="group flex flex-col space-y-3.5">
                  <Link
                    href={`/journal/${article.slug}`}
                    className="block relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A17C55] rounded-xs"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                    </div>
                  </Link>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#A17C55] font-medium">
                      <span>{article.category}</span>
                      <span>·</span>
                      <span className="text-[#7E7F7A]">{article.readingTime}</span>
                    </div>

                    <h4 className="font-serif text-xl sm:text-2xl font-normal text-[#242522]">
                      <Link
                        href={`/journal/${article.slug}`}
                        className="hover:text-[#A17C55] transition-colors"
                      >
                        {article.title}
                      </Link>
                    </h4>

                    <p className="text-sm text-[#62615D] line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E6E0D8] flex items-center justify-between text-xs text-[#7E7F7A]">
                    <span>{article.publicationDate}</span>
                    <TextLink href={`/journal/${article.slug}`} direction="right">
                      Read Essay
                    </TextLink>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. Consultation CTA */}
      <ConsultationCTA
        heading="Have a space you wish to discuss?"
        description="We approach every commission as an ongoing dialogue between your daily living routines and thoughtful architectural planning."
        actionLabel="Start a Consultation"
        actionHref="/contact"
        background="surface"
      />
    </div>
  );
}
