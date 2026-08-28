"use client";

import { useEffect, useRef } from "react";
import type { Theme } from "@/types/profile";
import { DEFAULT_THEME } from "@/types/profile";

/**
 * Applies theme colors and fonts from profile.theme as CSS custom properties
 * on document.documentElement. Falls back to DEFAULT_THEME while loading.
 *
 * BUG-06: Writes CSS vars ONLY inside useEffect, never during render,
 * to avoid hydration mismatches.
 */
export function useTheme(theme: Theme | null | undefined): void {
  const prevThemeRef = useRef<string>("");

  useEffect(() => {
    const t = theme ?? DEFAULT_THEME;
    const serialized = JSON.stringify(t);

    /* Skip if theme hasn't changed (prevents unnecessary DOM writes) */
    if (serialized === prevThemeRef.current) return;
    prevThemeRef.current = serialized;

    const root = document.documentElement;

    root.style.setProperty("--color-primary", t.color_primary);
    root.style.setProperty("--color-background", t.color_background);
    root.style.setProperty("--color-surface", t.color_surface);
    root.style.setProperty("--color-text", t.color_text);
    root.style.setProperty("--color-muted", t.color_muted);
    root.style.setProperty(
      "--font-heading",
      `'${t.font_heading}', sans-serif`
    );
    root.style.setProperty("--font-mono", `'${t.font_mono}', monospace`);

    /* Also update body background to match the theme */
    document.body.style.backgroundColor = t.color_background;
    document.body.style.color = t.color_text;
  }, [theme]);
}
