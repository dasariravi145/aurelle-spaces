import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Quotation } from "@/components/editorial/quotation";
import { ConsultationCTA } from "@/components/ui/consultation-cta";
import { TextLink } from "@/components/ui/text-link";
import { journalArticles, type JournalArticleDetail } from "@/lib/content/journal-data";
import { getPublicArticleBySlug } from "@/lib/cms/content-service";
import { studioImages } from "@/lib/content/images";
import { createMetadata } from "@/lib/seo/metadata";
import { ArticleJsonLd } from "@/components/seo/structured-data";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(journalArticles).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);

  if (!article) {
    return createMetadata({
      title: "Article Not Found",
      path: `/journal/${slug}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: article.metaTitle,
    description: article.metaDescription,
    path: `/journal/${article.slug}`,
    ogType: "article",
    publishedTime: article.publicationDate,
    authors: ["Aurelle Spaces Editorial Studio"],
  });
}

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

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const coverImage = getArticleImage(article.slug);

  // Resolve related articles
  const relatedArticles: JournalArticleDetail[] = article.relatedSlugs
    .map((s) => journalArticles[s])
    .filter((a): a is JournalArticleDetail => Boolean(a) && a.slug !== article.slug);

  return (
    <article className="w-full flex flex-col bg-[#F7F5F1] text-[#242522]">
      <ArticleJsonLd
        title={article.title}
        description={article.metaDescription}
        url={`/journal/${article.slug}`}
        datePublished={article.publicationDate}
        authorName="Aurelle Spaces Editorial Studio"
      />

      {/* 1. Article Editorial Header (Padding reduced ~35%) */}
      <header className="w-full pt-6 pb-6 sm:pt-8 sm:pb-8 border-b border-[#E6E0D8] bg-[#FFFFFF]">
        <Container size="reading">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#A17C55] font-medium">
              <span>{article.category}</span>
              <span>·</span>
              <span className="text-[#62615D]">{article.readingTime}</span>
              <span>·</span>
              <span className="text-[#7E7F7A]">{article.publicationDate}</span>
            </div>

            <h1 className="h1-editorial text-[#242522]">
              {article.title}
            </h1>

            <p className="body-large text-[#62615D] pt-1">
              {article.excerpt}
            </p>
          </div>
        </Container>
      </header>

      {/* 2. Cover Visual Photography (Clean unboxed editorial frame) */}
      <section className="w-full pt-4 sm:pt-6 pb-8 sm:pb-12 bg-[#F7F5F1]">
        <Container size="standard">
          <div>
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
              <Image
                src={coverImage.url}
                alt={coverImage.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1000px"
                className="object-cover object-center"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#242421]/20 via-transparent to-transparent opacity-30"
                aria-hidden="true"
              />
            </div>
            <div className="mt-2.5 px-1 flex justify-between text-xs text-[#7E7F7A]">
              <span>{coverImage.caption}</span>
              <span className="italic">Aurelle Spaces Editorial</span>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Article Body Content */}
      <section className="w-full py-12 sm:py-16 bg-[#FFFFFF] border-y border-[#E6E0D8]">
        <Container size="reading">
          <div className="space-y-12">
            {article.sections.map((sec, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#242522] pt-4">
                  {sec.heading}
                </h2>

                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="body-large text-[#242522]">
                    {p}
                  </p>
                ))}

                {sec.quote && (
                  <div className="py-4">
                    <Quotation
                      quote={sec.quote.text}
                      author={sec.quote.attribution}
                      className="border-l-[#A17C55]"
                    />
                  </div>
                )}
              </div>
            ))}

            {/* Key Takeaways */}
            {article.keyTakeaways.length > 0 && (
              <div className="mt-12 p-6 sm:p-8 border border-[#E6E0D8] bg-[#F7F5F1] rounded-[2px] space-y-4">
                <h3 className="font-serif text-xl font-normal text-[#242522]">
                  Key Design Takeaways
                </h3>
                <ul className="space-y-2.5 text-sm text-[#62615D]">
                  {article.keyTakeaways.map((point, kIdx) => (
                    <li key={kIdx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55] mt-2 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* 4. Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="w-full py-16 sm:py-20 bg-[#F7F5F1] border-b border-[#E6E0D8]">
          <Container size="wide">
            <div className="mb-10 pb-4 border-b border-[#E6E0D8] flex justify-between items-baseline">
              <h3 className="font-serif text-2xl font-normal text-[#242522]">
                Related Editorial Notes
              </h3>
              <TextLink href="/journal" direction="right">
                View All Journal Articles
              </TextLink>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedArticles.map((rel) => {
                const relImage = getArticleImage(rel.slug);

                return (
                  <div
                    key={rel.slug}
                    className="group flex flex-col space-y-3 p-4 border border-[#E6E0D8] bg-[#FFFFFF] rounded-[2px] shadow-studio hover:shadow-studio-hover transition-all"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#EAE6DE]">
                      <Image
                        src={relImage.url}
                        alt={rel.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs uppercase tracking-wider text-[#A17C55] font-medium">
                        {rel.category} · {rel.readingTime}
                      </span>
                      <h4 className="font-serif text-xl text-[#242522]">
                        <Link href={`/journal/${rel.slug}`} className="hover:text-[#A17C55] transition-colors">
                          {rel.title}
                        </Link>
                      </h4>
                    </div>
                    <p className="text-sm text-[#62615D] line-clamp-2">
                      {rel.excerpt}
                    </p>
                    <TextLink href={`/journal/${rel.slug}`} direction="right">
                      Read Essay
                    </TextLink>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* 5. Consultation CTA */}
      <ConsultationCTA
        heading="Have an architectural idea you wish to explore?"
        description="We approach every commission as an ongoing dialogue between your daily living rituals and thoughtful architectural planning."
        actionLabel="Start a Consultation"
        actionHref="/contact"
        background="surface"
      />
    </article>
  );
}
