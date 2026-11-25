import React from "react";
import { requireAdminSession } from "@/lib/security/auth";
import { getDatabase } from "@/lib/db/client";
import { mediaRepository } from "@/lib/db/repositories/media.repository";
import { getPublicMediaUrl } from "@/lib/storage/r2";
import { MediaManager } from "@/components/admin/media-manager";

export default async function AdminMediaPage() {
  await requireAdminSession();

  let initialAssets: Array<{
    id: string;
    r2_object_key: string;
    original_filename: string;
    mime_type: string;
    file_size: number;
    width: number | null;
    height: number | null;
    alt_text: string;
    uploading_admin_id: string | null;
    created_at: string;
    publicUrl: string | null;
  }> = [];

  try {
    const db = getDatabase();
    const result = await mediaRepository.list(db, { page: 1, limit: 30 });
    initialAssets = result.data.map((item) => ({
      ...item,
      publicUrl: getPublicMediaUrl(item.r2_object_key),
    }));
  } catch {
    // If D1 empty or local preview, initialAssets defaults to []
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-[#A17C55] block">
          Asset Management
        </span>
        <h1 className="font-serif text-3xl font-normal text-[#242522]">
          Cloudflare R2 Media Library
        </h1>
        <p className="text-xs text-[#6B6C67] pt-1">
          Upload, manage, and inspect high-resolution photography stored in Cloudflare R2 bucket (`aurelle-media`).
        </p>
      </div>

      <MediaManager initialAssets={initialAssets} />
    </div>
  );
}
