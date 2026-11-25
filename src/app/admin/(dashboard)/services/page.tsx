import React from "react";
import Link from "next/link";
import { requireAdminSession } from "@/lib/security/auth";
import { getDatabase } from "@/lib/db/client";
import { servicesRepository } from "@/lib/db/repositories/services.repository";
import { servicesData } from "@/lib/content/services-data";

export default async function AdminServicesPage() {
  await requireAdminSession();

  let serviceList: Array<{
    id: string;
    number: string;
    title: string;
    slug: string;
    status: string;
  }> = [];

  try {
    const db = getDatabase();
    const result = await servicesRepository.listAll(db);
    if (result.data.length > 0) {
      serviceList = result.data.map((s) => ({
        id: s.id,
        number: String(s.sort_order).padStart(2, "0"),
        title: s.title,
        slug: s.slug,
        status: s.status,
      }));
    }
  } catch {
    // Fallback
  }

  if (serviceList.length === 0) {
    serviceList = Object.values(servicesData).map((s) => ({
      id: s.slug,
      number: s.number,
      title: s.title,
      slug: s.slug,
      status: "published",
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#A17C55] block">
            Discipline Management
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#242522]">
            Studio Services
          </h1>
          <p className="text-xs text-[#6B6C67] pt-1">
            Configure core architectural service descriptions, scope items, and technical FAQs.
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="px-5 py-2.5 bg-[#242522] hover:bg-[#3A3B37] text-[#F7F4EF] text-xs font-mono uppercase tracking-wider rounded-[2px] transition-colors"
        >
          + Add Service
        </Link>
      </div>

      <div className="p-4 bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#DCD5CB] text-[#6B6C67] font-mono uppercase tracking-wider">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Service Title</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCD5CB]">
              {serviceList.map((s) => (
                <tr key={s.id} className="hover:bg-[#F7F4EF] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[#A17C55]">{s.number}</td>
                  <td className="py-3.5 px-4 font-medium text-[#242522]">{s.title}</td>
                  <td className="py-3.5 px-4 font-mono text-[#6B6C67]">{s.slug}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 text-[0.65rem] font-mono uppercase tracking-wider bg-[#EAE4D9] text-[#242522] rounded-[2px]">
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-3">
                    <Link
                      href={`/services/${s.slug}`}
                      target="_blank"
                      className="text-[#6B6C67] hover:text-[#242522] font-mono text-[0.7rem]"
                    >
                      View Live ↗
                    </Link>
                    <Link
                      href={`/admin/services/${s.id}`}
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
