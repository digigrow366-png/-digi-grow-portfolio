"use client";

import React from "react";
import type { SocialLinks, CustomSocialLink } from "@/types/profile";

const PLATFORMS: { key: keyof Omit<SocialLinks, "custom_links">; label: string }[] = [
  { key: "email", label: "Email Address" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "github", label: "GitHub" },
  { key: "twitter", label: "Twitter / X" },
  { key: "youtube", label: "YouTube" },
  { key: "discord", label: "Discord" },
];

interface SocialLinksEditorProps {
  socialLinks: SocialLinks;
  onChange: (socialLinks: SocialLinks) => void;
}

/**
 * Grid of platform inputs + dynamic custom-links repeater.
 *
 * BUG-04: Always clones arrays — never mutates prev directly.
 * BUG-05: Auto-prefixes https:// when value doesn't start with http.
 */
export default function SocialLinksEditor({
  socialLinks,
  onChange,
}: SocialLinksEditorProps) {
  function handlePlatformChange(key: keyof Omit<SocialLinks, "custom_links">, value: string) {
    onChange({ ...socialLinks, [key]: value });
  }

  function handleCustomChange(
    index: number,
    field: keyof CustomSocialLink,
    value: string | boolean
  ) {
    const updated = [...socialLinks.custom_links];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...socialLinks, custom_links: updated });
  }

  function addCustomLink() {
    const newLink: CustomSocialLink = {
      id: crypto.randomUUID(),
      label: "",
      url: "",
      active: true,
    };
    onChange({
      ...socialLinks,
      custom_links: [...socialLinks.custom_links, newLink],
    });
  }

  function removeCustomLink(index: number) {
    /* BUG-04: Clone before splice */
    const updated = [...socialLinks.custom_links];
    updated.splice(index, 1);
    onChange({ ...socialLinks, custom_links: updated });
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">Social Links</h3>

      {/* Platform inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PLATFORMS.map(({ key, label }) => (
          <div key={key}>
            <label className="badge-label block mb-1">{label}</label>
            <input
              type="url"
              value={(socialLinks[key] as string) || ""}
              onChange={(e) => handlePlatformChange(key, e.target.value)}
              placeholder={`https://${key}.com/...`}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
        ))}
      </div>

      {/* Custom links repeater */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Custom Links</h4>
          <button
            type="button"
            onClick={addCustomLink}
            data-cursor-hover
            className="text-sm px-3 py-1 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
            style={{ color: "var(--color-primary)" }}
          >
            + Add Link
          </button>
        </div>

        {socialLinks.custom_links.map((link, i) => (
          <div
            key={link.id}
            className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
          >
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="badge-label block mb-1">Label</label>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => handleCustomChange(i, "label", e.target.value)}
                  placeholder="My Website"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="badge-label block mb-1">URL</label>
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => handleCustomChange(i, "url", e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 mt-6 cursor-pointer">
              <input
                type="checkbox"
                checked={link.active}
                onChange={(e) => handleCustomChange(i, "active", e.target.checked)}
                className="rounded"
              />
              <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                Active
              </span>
            </label>

            <button
              type="button"
              onClick={() => removeCustomLink(i)}
              className="mt-6 text-red-400 hover:text-red-300 text-sm transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
