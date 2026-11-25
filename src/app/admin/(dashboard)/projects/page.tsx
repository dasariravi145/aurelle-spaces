import React from "react";
import Link from "next/link";
import { requireAdminSession } from "@/lib/security/auth";
import { getDatabase } from "@/lib/db/client";
import { projectsRepository } from "@/lib/db/repositories/projects.repository";
import { portfolioProjects } from "@/lib/content/portfolio-data";

export default async function AdminProjectsPage() {
  await requireAdminSession();

  let projectsList: Array<{
    id: string;
    title: string;
    slug: string;
    location: string;
    category: string;
    status: string;
    featured: boolean;
  }> = [];

  try {
    const db = getDatabase();
    const result = await projectsRepository.listAll(db);
    if (result.data.length > 0) {
      projectsList = result.data.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        location: p.location,
        category: p.category,
        status: p.publication_status,
        featured: p.featured === 1,
      }));
    }
  } catch {
    // Fallback
  }

  if (projectsList.length === 0) {
    projectsList = Object.values(portfolioProjects).map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      location: `${p.location}, ${p.city}`,
      category: p.category,
      status: "published",
      featured: p.featured || false,
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#A17C55] block">
            Portfolio Management
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#242522]">
            Architectural Projects
          </h1>
          <p className="text-xs text-[#6B6C67] pt-1">
            Create, edit, publish and manage architectural case studies and spatial photography.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="px-5 py-2.5 bg-[#242522] hover:bg-[#3A3B37] text-[#F7F4EF] text-xs font-mono uppercase tracking-wider rounded-[2px] transition-colors"
        >
          + Add New Project
        </Link>
      </div>

      <div className="p-4 bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#DCD5CB] text-[#6B6C67] font-mono uppercase tracking-wider">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCD5CB]">
              {projectsList.map((p) => (
                <tr key={p.id} className="hover:bg-[#F7F4EF] transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[#242522]">
                    {p.title}
                  </td>
                  <td className="py-3.5 px-4 text-[#6B6C67]">{p.location}</td>
                  <td className="py-3.5 px-4 text-[#6B6C67]">{p.category}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[0.65rem] font-mono uppercase tracking-wider rounded-[2px] ${
                        p.status === "published"
                          ? "bg-[#E2EBE2] text-[#345938]"
                          : p.status === "draft"
                          ? "bg-[#FAF2EF] text-[#A14B3A]"
                          : "bg-[#EAE4D9] text-[#6B6C67]"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[0.7rem] text-[#A17C55]">
                    {p.featured ? "★ Featured" : "—"}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-3">
                    <Link
                      href={`/admin/preview/project/${p.id}`}
                      target="_blank"
                      className="text-[#6B6C67] hover:text-[#242522] font-mono text-[0.7rem]"
                    >
                      Preview ↗
                    </Link>
                    <Link
                      href={`/admin/projects/${p.id}`}
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
