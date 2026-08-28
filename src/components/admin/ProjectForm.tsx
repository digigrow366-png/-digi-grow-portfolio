"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { Project, SubCard } from "@/types/project";
import MediaUploader from "./MediaUploader";

interface ProjectFormProps {
  projectId?: string; // If provided, edit mode. If undefined, create mode.
  onSaved: (id: string) => void;
  onCancel: () => void;
}

const DEFAULT_PROJECT: Partial<Project> = {
  title: "",
  slug: "",
  category: "",
  summary: "",
  cover_image_url: "",
  gallery: [],
  sub_cards: [],
  external_url: "",
  published: false,
  sort_order: 0,
};

/**
 * Editor for a single project (Create or Update).
 * Uses deep copies to prevent mutating the parent state on cancel.
 * BUG-11: sort_order defaults to 0 and parses as int.
 */
export default function ProjectForm({ projectId, onSaved, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<Partial<Project>>(DEFAULT_PROJECT);
  const [loading, setLoading] = useState(!!projectId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    async function fetchProject() {
      if (!projectId) return;

      if (!isSupabaseConfigured()) {
        setError("Supabase not configured. Cannot edit in offline mode.");
        setLoading(false);
        return;
      }

      const { data, error: dbError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .maybeSingle();

      if (!isMounted.current) return;

      if (dbError || !data) {
        setError(dbError?.message || "Project not found");
      } else {
        const normalized = {
          ...data,
          gallery: Array.isArray(data.gallery) ? data.gallery : [],
          sub_cards: Array.isArray(data.sub_cards) ? data.sub_cards : [],
        };
        setFormData(JSON.parse(JSON.stringify(normalized)));
      }
      setLoading(false);
    }

    fetchProject();

    return () => {
      isMounted.current = false;
    };
  }, [projectId]);

  function handleChange(field: keyof Project, value: unknown) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  /* ─── Gallery ─── */
  function addGalleryImage(url: string) {
    setFormData((prev) => ({
      ...prev,
      gallery: [...(prev.gallery || []), url],
    }));
  }

  function removeGalleryImage(index: number) {
    const updated = [...(formData.gallery || [])];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, gallery: updated }));
  }

  /* ─── Sub-Cards ─── */
  function addSubCard() {
    setFormData((prev) => ({
      ...prev,
      sub_cards: [...(prev.sub_cards || []), { title: "", description: "" }],
    }));
  }

  function updateSubCard(index: number, field: keyof SubCard, value: string) {
    const updated = [...(formData.sub_cards || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, sub_cards: updated }));
  }

  function removeSubCard(index: number) {
    const updated = [...(formData.sub_cards || [])];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, sub_cards: updated }));
  }

  /* ─── Save ─── */
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    if (!isSupabaseConfigured()) {
      setError("Supabase not configured. Changes are preview-only.");
      setSaving(false);
      return;
    }

    /* Auto-generate slug if empty */
    const finalSlug = formData.slug?.trim() 
      ? formData.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      : formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `project-${Date.now()}`;

    const payload = {
      ...(projectId ? { id: projectId } : {}),
      title: formData.title || "Untitled Project",
      slug: finalSlug,
      category: formData.category || "",
      summary: formData.summary || "",
      cover_image_url: formData.cover_image_url || "",
      gallery: formData.gallery || [],
      sub_cards: formData.sub_cards || [],
      external_url: formData.external_url || "",
      published: !!formData.published,
      sort_order: parseInt(String(formData.sort_order), 10) || 0,
    };

    let resultError;
    let savedId = projectId;

    if (projectId) {
      const { error: updateError } = await supabase.from("projects").update(payload).eq("id", projectId);
      resultError = updateError;
    } else {
      const { data, error: insertError } = await supabase.from("projects").insert(payload).select().single();
      resultError = insertError;
      if (data) savedId = data.id;
    }

    if (resultError) {
      setError(resultError.message);
      setSaving(false);
    } else if (savedId) {
      onSaved(savedId);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-12 bg-white/5 rounded-xl" />
        <div className="h-12 bg-white/5 rounded-xl" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-10 pb-20">
      {error && (
        <div className="px-5 py-3 rounded-xl text-sm font-medium bg-red-500/20 text-red-300 border border-red-500/30">
          {error}
        </div>
      )}

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight">
          {projectId ? "Edit Project" : "New Project"}
        </h2>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="text-sm font-medium hover:text-[var(--color-primary)] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            data-cursor-hover
            className="px-6 py-2 rounded-full font-semibold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text)",
            }}
          >
            {saving ? "Saving…" : "Save Project"}
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="badge-label block mb-1">Title</label>
          <input
            type="text"
            required
            value={formData.title ?? ""}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>
        <div>
          <label className="badge-label block mb-1">Slug (URL)</label>
          <input
            type="text"
            value={formData.slug ?? ""}
            onChange={(e) => handleChange("slug", e.target.value)}
            placeholder="Auto-generated if empty"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>
        <div>
          <label className="badge-label block mb-1">Category</label>
          <input
            type="text"
            value={formData.category ?? ""}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>
        <div>
          <label className="badge-label block mb-1">Sort Order</label>
          <input
            type="number"
            value={formData.sort_order ?? 0}
            onChange={(e) => handleChange("sort_order", parseInt(e.target.value, 10))}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="badge-label block mb-1">Summary (Short Description)</label>
        <textarea
          rows={3}
          value={formData.summary ?? ""}
          onChange={(e) => handleChange("summary", e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-y"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="badge-label block mb-1">External URL (CTA Link)</label>
          <input
            type="url"
            value={formData.external_url ?? ""}
            onChange={(e) => handleChange("external_url", e.target.value)}
            placeholder="https://"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>
        <div className="flex flex-col justify-center">
          <label className="flex items-center gap-3 cursor-pointer mt-4">
            <input
              type="checkbox"
              checked={!!formData.published}
              onChange={(e) => handleChange("published", e.target.checked)}
              className="w-5 h-5 rounded bg-white/5 border-white/10"
            />
            <span className="font-semibold">Published (Visible to public)</span>
          </label>
        </div>
      </div>

      <hr className="border-white/5" />

      {/* Media */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold">Media</h3>
        
        <div>
          <label className="badge-label block mb-3">Cover Image</label>
          <div className="flex items-start gap-6">
            {formData.cover_image_url ? (
              <div className="relative w-48 h-32 rounded-xl overflow-hidden group">
                <img src={formData.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleChange("cover_image_url", "")}
                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="w-48 h-32 rounded-xl border border-dashed border-white/20 flex items-center justify-center bg-white/[0.02]">
                <span className="text-xs text-[var(--color-muted)]">No Cover</span>
              </div>
            )}
            <div className="mt-2">
              <MediaUploader
                folder="projects"
                onUpload={(url) => handleChange("cover_image_url", url)}
                label="Upload Cover"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="badge-label block mb-3">Gallery Images</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {(formData.gallery || []).map((url, i) => (
              <div key={i} className="relative aspect-video rounded-xl overflow-hidden group">
                <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(i)}
                  className="absolute inset-0 bg-black/50 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <MediaUploader
            folder="projects"
            onUpload={addGalleryImage}
            label="+ Add Gallery Image"
          />
        </div>
      </section>

      <hr className="border-white/5" />

      {/* Sub-Cards */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Detail Sub-Cards (Stage 7)</h3>
          <button
            type="button"
            onClick={addSubCard}
            data-cursor-hover
            className="text-sm px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
            style={{ color: "var(--color-primary)" }}
          >
            + Add Card
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(formData.sub_cards || []).map((card, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 relative">
              <button
                type="button"
                onClick={() => removeSubCard(i)}
                className="absolute top-4 right-4 text-red-400 hover:text-red-300 text-sm"
              >
                ✕
              </button>
              <div className="space-y-4">
                <div>
                  <label className="badge-label block mb-1">Card {i + 1} Title</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => updateSubCard(i, "title", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="badge-label block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={card.description}
                    onChange={(e) => updateSubCard(i, "description", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] resize-y"
                  />
                </div>
                <div>
                  <label className="badge-label block mb-1">Link URL (Optional)</label>
                  <input
                    type="url"
                    value={card.url || ""}
                    onChange={(e) => updateSubCard(i, "url", e.target.value)}
                    placeholder="https://"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="badge-label block mb-1">Image (Optional)</label>
                  <div className="flex flex-col gap-2">
                    {card.image && (
                      <div className="relative h-20 w-32 rounded-lg overflow-hidden group">
                        <img src={card.image} alt="Card Image" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => updateSubCard(i, "image", "")}
                          className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    <MediaUploader
                      folder="projects"
                      onUpload={(url) => updateSubCard(i, "image", url)}
                      label="Upload Image"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </form>
  );
}
