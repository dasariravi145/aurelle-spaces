"use client";

import React, { useState } from "react";
import type { MediaAssetRecord } from "@/lib/db/types";

interface EnrichedMediaAsset extends MediaAssetRecord {
  publicUrl: string | null;
}

interface MediaManagerProps {
  initialAssets: EnrichedMediaAsset[];
}

export function MediaManager({ initialAssets }: MediaManagerProps) {
  const [assets, setAssets] = useState<EnrichedMediaAsset[]>(initialAssets);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<EnrichedMediaAsset | null>(null);
  const [altText, setAltText] = useState("");
  const [savingAlt, setSavingAlt] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "projects");
    formData.append("altText", file.name.replace(/\.[^.]+$/, ""));

    try {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setUploadError(data?.error?.message || "File upload failed.");
        setUploading(false);
        return;
      }

      setAssets((prev) => [data.asset, ...prev]);
    } catch {
      setUploadError("A network error occurred during upload.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSaveAltText = async () => {
    if (!selectedAsset) return;
    setSavingAlt(true);

    try {
      const res = await fetch(`/api/admin/media/${selectedAsset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ altText }),
      });

      if (res.ok) {
        setAssets((prev) =>
          prev.map((a) => (a.id === selectedAsset.id ? { ...a, alt_text: altText } : a))
        );
        setSelectedAsset((prev) => (prev ? { ...prev, alt_text: altText } : null));
      }
    } finally {
      setSavingAlt(false);
    }
  };

  const handleDelete = async (asset: EnrichedMediaAsset) => {
    if (!confirm(`Delete '${asset.original_filename}' from Cloudflare R2 and database?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/media/${asset.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAssets((prev) => prev.filter((a) => a.id !== asset.id));
        if (selectedAsset?.id === asset.id) setSelectedAsset(null);
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.error?.message || "Failed to delete asset.");
      }
    } catch {
      alert("Error communicating with server.");
    }
  };

  const copyUrl = (url: string | null, key: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredAssets = assets.filter((a) =>
    a.original_filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.alt_text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Upload & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#FFFFFF] border border-[#DCD5CB] p-4 rounded-[2px]">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search assets by filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 text-xs bg-[#F7F4EF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:outline-none focus:border-[#A17C55]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#242522] hover:bg-[#3A3B37] text-[#F7F4EF] text-xs font-mono uppercase tracking-wider rounded-[2px] cursor-pointer transition-colors w-full sm:w-auto">
            {uploading ? (
              <span>Uploading to R2...</span>
            ) : (
              <span>+ Upload Image</span>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {uploadError && (
        <div className="p-4 bg-[#FAF2EF] border-l-2 border-[#A14B3A] text-xs text-[#A14B3A] rounded-[2px]">
          {uploadError}
        </div>
      )}

      {/* Media Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Assets Grid */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#DCD5CB] p-6 rounded-[2px] space-y-4">
          <div className="flex justify-between items-center text-xs font-mono text-[#6B6C67]">
            <span>Total Assets: {filteredAssets.length}</span>
            <span>Formats: JPEG, PNG, WebP, AVIF</span>
          </div>

          {filteredAssets.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id;
                return (
                  <div
                    key={asset.id}
                    onClick={() => {
                      setSelectedAsset(asset);
                      setAltText(asset.alt_text);
                    }}
                    className={`group relative border rounded-[2px] overflow-hidden p-2 text-left cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#A17C55] ring-2 ring-[#A17C55]/20 bg-[#F7F4EF]"
                        : "border-[#DCD5CB] hover:border-[#A17C55] bg-[#FFFFFF]"
                    }`}
                  >
                    <div className="aspect-square w-full bg-[#EAE4D9] flex items-center justify-center rounded-[2px] overflow-hidden">
                      <span className="font-mono text-2xl text-[#A17C55]/60">🖼</span>
                    </div>
                    <div className="pt-2 space-y-0.5">
                      <p className="text-xs font-medium text-[#242522] truncate" title={asset.original_filename}>
                        {asset.original_filename}
                      </p>
                      <p className="text-[0.65rem] text-[#6B6C67] font-mono">
                        {(asset.file_size / 1024).toFixed(0)} KB · {asset.mime_type.split("/")[1]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-[#F7F4EF] rounded-[2px] space-y-2">
              <p className="text-xs font-mono text-[#6B6C67]">No media assets found.</p>
              <p className="text-[0.7rem] text-[#6B6C67]/70">
                Upload architectural photography directly to your Cloudflare R2 bucket.
              </p>
            </div>
          )}
        </div>

        {/* Selected Asset Inspector */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#DCD5CB] p-6 rounded-[2px] space-y-5">
          <h3 className="font-serif text-lg font-normal text-[#242522]">
            Asset Details
          </h3>

          {selectedAsset ? (
            <div className="space-y-4 text-xs">
              <div className="aspect-video w-full bg-[#EAE4D9] rounded-[2px] flex items-center justify-center text-4xl text-[#A17C55]/60">
                🖼
              </div>

              <div className="space-y-2 font-mono text-[0.72rem] text-[#6B6C67] border-b border-[#DCD5CB] pb-4">
                <p>
                  <strong className="text-[#242522]">File:</strong> {selectedAsset.original_filename}
                </p>
                <p>
                  <strong className="text-[#242522]">Size:</strong> {(selectedAsset.file_size / 1024).toFixed(1)} KB
                </p>
                <p>
                  <strong className="text-[#242522]">MIME:</strong> {selectedAsset.mime_type}
                </p>
                <p className="break-all">
                  <strong className="text-[#242522]">R2 Key:</strong> {selectedAsset.r2_object_key}
                </p>
              </div>

              {/* Alt Text Editor */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#242522]">
                  Accessibility Alt Text
                </label>
                <textarea
                  rows={2}
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] focus:border-[#A17C55] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveAltText}
                  disabled={savingAlt}
                  className="w-full py-1.5 bg-[#EAE4D9] hover:bg-[#DCD5CB] text-[#242522] text-[0.7rem] font-mono uppercase tracking-wider rounded-[2px]"
                >
                  {savingAlt ? "Saving..." : "Update Alt Text"}
                </button>
              </div>

              {/* Public URL Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => copyUrl(selectedAsset.publicUrl, selectedAsset.id)}
                  className="w-full py-2 bg-[#242522] text-[#F7F4EF] text-[0.7rem] font-mono uppercase tracking-wider rounded-[2px]"
                >
                  {copiedKey === selectedAsset.id ? "✓ URL Copied to Clipboard" : "Copy R2 URL"}
                </button>
              </div>

              {/* Delete Action */}
              <div className="pt-2 border-t border-[#DCD5CB]">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedAsset)}
                  className="w-full py-2 text-[0.7rem] font-mono uppercase tracking-wider text-[#A14B3A] hover:bg-[#FAF2EF] border border-[#A14B3A]/30 rounded-[2px] transition-colors"
                >
                  Delete Asset from Storage
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#6B6C67] italic">
              Select an asset from the grid to view metadata, edit alt text, or copy its public R2 delivery URL.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

