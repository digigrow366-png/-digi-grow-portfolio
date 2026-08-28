"use client";

import React, { useState } from "react";
import type { Theme } from "@/types/profile";
import { DEFAULT_THEME } from "@/types/profile";

interface ThemeEditorProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
}

const COLOR_FIELDS: { key: keyof Theme; label: string }[] = [
  { key: "color_primary", label: "Primary (CTAs, Accents)" },
  { key: "color_background", label: "Background" },
  { key: "color_surface", label: "Surface (Cards)" },
  { key: "color_text", label: "Text" },
  { key: "color_muted", label: "Muted Text" },
];

const FONT_FIELDS: { key: keyof Theme; label: string }[] = [
  { key: "font_heading", label: "Heading Font" },
  { key: "font_mono", label: "Mono / Label Font" },
];

/**
 * Theme editor with color pickers and font inputs.
 * Live preview pane shows Wordmark + sample bento card as values change,
 * BEFORE saving.
 */
export default function ThemeEditor({ theme, onChange }: ThemeEditorProps) {
  const [localTheme, setLocalTheme] = useState<Theme>({
    ...DEFAULT_THEME,
    ...theme,
  });

  function handleChange(key: keyof Theme, value: string) {
    const updated = { ...localTheme, [key]: value };
    setLocalTheme(updated);
    onChange(updated);
  }

  /* Basic WCAG AA contrast check (simplified) */
  function getContrastWarning(bg: string, fg: string): string | null {
    try {
      const lum = (hex: string) => {
        const rgb = parseInt(hex.replace("#", ""), 16);
        const r = ((rgb >> 16) & 255) / 255;
        const g = ((rgb >> 8) & 255) / 255;
        const b = (rgb & 255) / 255;
        const lin = (c: number) =>
          c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
      };
      const l1 = lum(bg);
      const l2 = lum(fg);
      const ratio =
        (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      if (ratio < 4.5) return `Low contrast (${ratio.toFixed(1)}:1 — WCAG AA requires 4.5:1)`;
    } catch {
      /* ignore invalid hex during typing */
    }
    return null;
  }

  const contrastWarning = getContrastWarning(
    localTheme.color_background,
    localTheme.color_text
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Controls */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold">Colors</h3>
        {COLOR_FIELDS.map((field) => (
          <div key={field.key} className="flex items-center gap-4">
            <input
              type="color"
              value={localTheme[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent"
            />
            <div className="flex-1">
              <label className="badge-label block mb-1">{field.label}</label>
              <input
                type="text"
                value={localTheme[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        ))}

        {contrastWarning && (
          <p className="text-amber-400 text-xs">⚠ {contrastWarning}</p>
        )}

        <h3 className="text-lg font-bold mt-8">Fonts</h3>
        {FONT_FIELDS.map((field) => (
          <div key={field.key}>
            <label className="badge-label block mb-1">{field.label}</label>
            <input
              type="text"
              value={localTheme[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
              placeholder="Font family name"
            />
          </div>
        ))}
      </div>

      {/* Live Preview */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Live Preview</h3>
        <div
          className="rounded-2xl p-8 space-y-6 border"
          style={{
            backgroundColor: localTheme.color_background,
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          {/* Wordmark preview */}
          <div className="flex items-center gap-1">
            <span
              className="text-2xl font-black tracking-tighter"
              style={{
                fontFamily: `'${localTheme.font_heading}', sans-serif`,
                color: localTheme.color_text,
              }}
            >
              Digi
            </span>
            <span
              className="text-2xl font-black tracking-tighter"
              style={{
                fontFamily: `'${localTheme.font_heading}', sans-serif`,
                color: localTheme.color_primary,
              }}
            >
              Grow
            </span>
          </div>

          {/* Sample bento card */}
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span
              className="text-xs uppercase tracking-[0.35em]"
              style={{
                fontFamily: `'${localTheme.font_mono}', monospace`,
                color: localTheme.color_muted,
              }}
            >
              01 — Sample Project
            </span>
            <h3
              className="text-xl font-black tracking-tight mt-2"
              style={{
                fontFamily: `'${localTheme.font_heading}', sans-serif`,
                color: localTheme.color_text,
              }}
            >
              Website Design
            </h3>
            <p
              className="text-sm mt-2"
              style={{ color: localTheme.color_muted }}
            >
              Modern, responsive website design built for performance.
            </p>
            <button
              className="mt-4 px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: localTheme.color_primary,
                color: localTheme.color_text,
              }}
            >
              View Project →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
