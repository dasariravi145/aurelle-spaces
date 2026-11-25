import React from "react";
import Link from "next/link";
import { requireAdminSession } from "@/lib/security/auth";
import { getDatabase } from "@/lib/db/client";
import { articlesRepository } from "@/lib/db/repositories/articles.repository";
import { journalArticles } from "@/lib/content/journal-data";

export default async function AdminJournalPage() {
  await requireAdminSession();

  let articleList: Array<{
    id: string;
    title: string;
    slug: string;
    category: string;
    status: string;
    date: string;
  }> = [];

  try {
    const db = getDatabase();
    const result = await articlesRepository.listAll(db);
    if (result.data.length > 0) {
      articleList = result.data.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        category: a.category,
        status: a.publication_status,
        date: a.published_at ? new Date(a.published_at).toLocaleDateString() : "Draft",
      }));
    }
  } catch {
    // Fallback
  }

  if (articleList.length === 0) {
    articleList = Object.values(journalArticles).map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      category: a.category,
      status: "published",
      date: a.publicationDate,
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#A17C55] block">
            Editorial Management
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#242522]">
            Journal Articles
          </h1>
          <p className="text-xs text-[#6B6C67] pt-1">
            Author, edit, publish and preview architectural monographs and research essays.
          </p>
        </div>
        <Link
          href="/admin/journal/new"
          className="px-5 py-2.5 bg-[#242522] hover:bg-[#3A3B37] text-[#F7F4EF] text-xs font-mono uppercase tracking-wider rounded-[2px] transition-colors"
        >
          + Write Article
        </Link>
      </div>

      <div className="p-4 bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#DCD5CB] text-[#6B6C67] font-mono uppercase tracking-wider">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCD5CB]">
              {articleList.map((a) => (
                <tr key={a.id} className="hover:bg-[#F7F4EF] transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[#242522]">{a.title}</td>
                  <td className="py-3.5 px-4 text-[#6B6C67]">{a.category}</td>
                  <td className="py-3.5 px-4 text-[#6B6C67]">{a.date}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[0.65rem] font-mono uppercase tracking-wider rounded-[2px] ${
                        a.status === "published"
                          ? "bg-[#E2EBE2] text-[#345938]"
                          : "bg-[#FAF2EF] text-[#A14B3A]"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-3">
                    <Link
                      href={`/admin/preview/article/${a.id}`}
                      target="_blank"
                      className="text-[#6B6C67] hover:text-[#242522] font-mono text-[0.7rem]"
                    >
                      Preview ↗
                    </Link>
                    <Link
                      href={`/admin/journal/${a.id}`}
                      className="text-[#A17C55] hover:text-[#242522] font-mono text-[0.7rem] font-medium"
                    >
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
