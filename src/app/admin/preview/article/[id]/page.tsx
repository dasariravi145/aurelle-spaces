import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdminSession } from "@/lib/security/auth";
import { getArticleForPreview } from "@/lib/cms/content-service";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Eyebrow } from "@/components/ui/eyebrow";

interface PreviewProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Admin Article Preview | Aurelle Spaces",
  robots: { index: false, follow: false },
};

export default async function AdminArticlePreviewPage({ params }: PreviewProps) {
  await requireAdminSession();
  const { id } = await params;

  const preview = await getArticleForPreview(id);
  if (!preview) {
    notFound();
  }

  const { article, isDraft } = preview;

  return (
    <div className="w-full flex flex-col bg-[#F7F4EF] text-[#242522]">
      {/* Sticky Admin Preview Warning Banner */}
      <div className="sticky top-0 z-50 w-full bg-[#A17C55] text-[#FFFFFF] px-4 py-2.5 text-xs font-mono uppercase tracking-wider flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <span className="font-bold bg-[#242522] text-[#F7F4EF] px-2 py-0.5 rounded-[2px]">
            {isDraft ? "DRAFT PREVIEW" : "PREVIEW MODE"}
          </span>
          <span>Article rendered via administrative session. Not indexed by search engines.</span>
        </div>
        <Link
          href={`/admin/journal/${id}`}
          className="bg-[#242522] hover:bg-[#3A3B37] text-[#F7F4EF] px-3 py-1 rounded-[2px] transition-colors"
        >
          ← Return to Editor
        </Link>
      </div>

      {/* Render Monograph Content */}
      <article className="w-full">
        <section className="w-full pt-10 pb-16 border-b border-[#DCD5CB] bg-[#FFFFFF]">
          <Container size="wide">
            <div className="mb-8">
              <Breadcrumb items={[{ label: "Admin Console", href: "/admin/journal" }, { label: "Preview" }, { label: article.title }]} />
            </div>

            <div className="max-w-4xl space-y-6">
              <div className="flex items-center gap-4">
                <Eyebrow>{article.category}</Eyebrow>
                <span className="text-xs font-mono text-[#A17C55]">·</span>
                <span className="text-xs font-mono uppercase tracking-wider text-[#6B6C67]">{article.readingTime}</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#242522] tracking-tight">
                {article.title}
              </h1>

              <p className="body-large text-[#6B6C67] leading-relaxed max-w-3xl">
                {article.excerpt}
              </p>
            </div>
          </Container>
        </section>

        {/* Article Body Sections */}
        <section className="w-full py-16 border-b border-[#DCD5CB]">
          <Container size="reading">
            <div className="space-y-12 max-w-3xl">
              {article.sections.map((section, idx) => (
                <div key={idx} className="space-y-4">
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#242522]">
                    {section.heading}
                  </h2>
                  <div className="space-y-4 text-base sm:text-lg text-[#242522] leading-relaxed">
                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Key Takeaways */}
        {article.keyTakeaways.length > 0 && (
          <section className="w-full py-16 bg-[#FFFFFF]">
            <Container size="reading">
              <div className="p-8 border border-[#DCD5CB] bg-[#F7F4EF] rounded-[2px] space-y-4 max-w-3xl">
                <span className="font-mono text-xs uppercase tracking-widest text-[#A17C55] block">
                  Key Takeaways
                </span>
                <ul className="list-disc pl-5 space-y-2 text-sm text-[#242522]">
                  {article.keyTakeaways.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            </Container>
          </section>
        )}
      </article>
    </div>
  );
}

