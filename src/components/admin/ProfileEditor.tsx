"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { UserProfile, SocialLinks, Theme } from "@/types/profile";
import { FALLBACK_PROFILE, DEFAULT_SOCIAL_LINKS, DEFAULT_THEME } from "@/types/profile";
import MediaUploader from "./MediaUploader";
import SocialLinksEditor from "./SocialLinksEditor";
import ThemeEditor from "./ThemeEditor";

/**
 * Profile editor: identity form, social links, and theme editor.
 * Single Save button → supabase.from('profile').upsert().
 *
 * Deep-copies form state on load so cancelling never mutates the source.
 */
export default function ProfileEditor() {
  const [formData, setFormData] = useState<UserProfile>(FALLBACK_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    async function fetchProfile() {
      if (!isSupabaseConfigured()) {
        setFormData(JSON.parse(JSON.stringify(FALLBACK_PROFILE)));
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (!isMounted.current) return;

      if (error || !data) {
        setFormData(JSON.parse(JSON.stringify(FALLBACK_PROFILE)));
      } else {
        const normalized: UserProfile = {
          ...data,
          social_links: {
            ...DEFAULT_SOCIAL_LINKS,
            ...(data.social_links as Record<string, unknown> ?? {}),
            custom_links: Array.isArray((data.social_links as Record<string, unknown>)?.custom_links)
              ? (data.social_links as Record<string, unknown>).custom_links as UserProfile["social_links"]["custom_links"]
              : [],
          },
          theme: {
            ...DEFAULT_THEME,
            ...(data.theme as Record<string, unknown> ?? {}),
          },
        } as UserProfile;
        /* Deep copy to isolate form state */
        setFormData(JSON.parse(JSON.stringify(normalized)));
      }

      setLoading(false);
    }

    fetchProfile();

    return () => {
      isMounted.current = false;
    };
  }, []);

  function handleFieldChange(field: keyof UserProfile, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleSocialLinksChange(socialLinks: SocialLinks) {
    setFormData((prev) => ({ ...prev, social_links: socialLinks }));
  }

  function handleThemeChange(theme: Theme) {
    setFormData((prev) => ({ ...prev, theme }));
  }

  async function handleSave() {
    setSaving(true);
    setToast(null);

    /* BUG-05: Auto-prefix https:// on social links */
    const prefixedSocials = { ...formData.social_links };
    const socialKeys = ["instagram", "facebook", "linkedin", "github", "twitter", "youtube", "discord"] as const;
    for (const key of socialKeys) {
      const val = prefixedSocials[key];
      if (val && !val.startsWith("http://") && !val.startsWith("https://") && val.trim().length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (prefixedSocials as any)[key] = `https://${val}`;
      }
    }
    prefixedSocials.custom_links = prefixedSocials.custom_links.map((link) => ({
      ...link,
      url:
        link.url && !link.url.startsWith("http://") && !link.url.startsWith("https://") && link.url.trim().length > 0
          ? `https://${link.url}`
          : link.url,
    }));

    const payload = {
      id: formData.id !== "fallback" ? formData.id : undefined,
      brand_name: formData.brand_name,
      full_name: formData.full_name,
      role_title: formData.role_title,
      tagline: formData.tagline,
      bio: formData.bio,
      avatar_url: formData.avatar_url,
      resume_url: formData.resume_url,
      location: formData.location,
      social_links: prefixedSocials,
      theme: formData.theme,
    };

    if (!isSupabaseConfigured()) {
      setToast({ type: "error", message: "Supabase not configured. Changes are preview-only." });
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("profile").upsert(payload);

    if (error) {
      setToast({ type: "error", message: error.message });
    } else {
      setToast({ type: "success", message: "Profile saved successfully!" });
    }

    setSaving(false);

    /* Auto-dismiss toast */
    setTimeout(() => setToast(null), 4000);
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 bg-white/5 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-20 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-medium shadow-xl ${
            toast.type === "success"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-red-500/20 text-red-300 border border-red-500/30"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Identity */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black tracking-tight">Identity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(
            [
              ["brand_name", "Brand Name"],
              ["full_name", "Full Name"],
              ["role_title", "Role / Title"],
              ["location", "Location"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="badge-label block mb-1">{label}</label>
              <input
                type="text"
                value={(formData[key] as string) ?? ""}
                onChange={(e) => handleFieldChange(key, e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="badge-label block mb-1">Tagline</label>
          <input
            type="text"
            value={formData.tagline ?? ""}
            onChange={(e) => handleFieldChange("tagline", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <div>
          <label className="badge-label block mb-1">Bio</label>
          <textarea
            rows={4}
            value={formData.bio ?? ""}
            onChange={(e) => handleFieldChange("bio", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-y"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="badge-label block mb-1">Resume URL</label>
            <input
              type="url"
              value={formData.resume_url ?? ""}
              onChange={(e) => handleFieldChange("resume_url", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="badge-label block mb-1">Avatar</label>
            <div className="flex items-center gap-4">
              {formData.avatar_url && (
                <img
                  src={formData.avatar_url}
                  alt="Avatar preview"
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <MediaUploader
                folder="avatars"
                onUpload={(url) => handleFieldChange("avatar_url", url)}
                label="Upload Avatar"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section>
        <SocialLinksEditor
          socialLinks={formData.social_links}
          onChange={handleSocialLinksChange}
        />
      </section>

      {/* Theme */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black tracking-tight">Theme</h2>
        <ThemeEditor theme={formData.theme} onChange={handleThemeChange} />
      </section>

      {/* Save */}
      <div className="sticky bottom-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          data-cursor-hover
          className="px-8 py-3 rounded-full font-semibold text-sm shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-text)",
          }}
        >
          {saving ? "Saving…" : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
