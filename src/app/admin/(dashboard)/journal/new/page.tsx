import React from "react";
import { requireAdminSession } from "@/lib/security/auth";
import { ArticleForm } from "@/components/admin/article-form";

export default async function NewArticlePage() {
  await requireAdminSession();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-mono uppercase tracking-widest text-[#A17C55] block">
          Journal CMS
        </span>
        <h1 className="font-serif text-3xl font-normal text-[#242522]">
          Write Architectural Monograph
        </h1>
      </div>

      <ArticleForm mode="create" />
    </div>
  );
}

