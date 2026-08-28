"use client";

import React, { useState, useRef } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

interface MediaUploaderProps {
  bucket?: string;
  folder?: string;
  onUpload: (url: string) => void;
  accept?: string;
  label?: string;
}

/**
 * Uploads files to a Supabase Storage bucket.
 * Shows per-file progress, returns the public URL.
 *
 * Image upload failures show an inline error on that specific field,
 * not a full-form failure.
 */
export default function MediaUploader({
  bucket = "project-media",
  folder = "uploads",
  onUpload,
  accept = "image/*",
  label = "Upload Image",
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setProgress(0);

    if (!isSupabaseConfigured()) {
      setError("Supabase not configured — cannot upload files.");
      setUploading(false);
      return;
    }

    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      /* Simulate progress since Supabase JS client doesn't expose upload progress */
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      clearInterval(progressInterval);

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(fileName);

      setProgress(100);
      onUpload(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <label
        data-cursor-hover
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
        style={{ color: "var(--color-muted)" }}
      >
        <span className="text-sm">{uploading ? "Uploading…" : label}</span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {uploading && (
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
