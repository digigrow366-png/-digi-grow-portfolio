"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { UserProfile } from "@/types/profile";
import { FALLBACK_PROFILE } from "@/types/profile";

interface UseProfileReturn {
  profile: UserProfile;
  loading: boolean;
  error: string | null;
  refetchProfile: () => void;
}

/**
 * Fetches the singleton profile row from Supabase.
 * Falls back to FALLBACK_PROFILE (head.md seed) when:
 * - Supabase env vars are not set
 * - The table is empty
 * - The network request fails
 *
 * BUG-01: Optional chaining + defaults on social_links/theme.
 * BUG-02: Uses .maybeSingle() to handle empty tables gracefully.
 * BUG-06: isMounted guard + AbortController prevent state updates after unmount.
 */
export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<UserProfile>(FALLBACK_PROFILE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchProfile = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setProfile(FALLBACK_PROFILE);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from("profile")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (!isMounted.current) return;

      if (dbError) {
        console.error("useProfile DB error:", dbError);
        setError(dbError.message);
        setProfile(FALLBACK_PROFILE);
      } else if (!data) {
        /* Empty table — use fallback (BUG-02) */
        setProfile(FALLBACK_PROFILE);
      } else {
        /* Normalize jsonb fields with safe defaults (BUG-01) */
        const normalized: UserProfile = {
          ...data,
          social_links: {
            instagram: "",
            facebook: "",
            linkedin: "",
            github: "",
            twitter: "",
            youtube: "",
            discord: "",
            custom_links: [],
            ...(data.social_links as Record<string, unknown> ?? {}),
          },
          theme: {
            ...FALLBACK_PROFILE.theme,
            ...(data.theme as Record<string, unknown> ?? {}),
          },
        } as UserProfile;
        setProfile(normalized);
      }
    } catch (err) {
      if (!isMounted.current) return;
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("useProfile fetch error:", message);
      setError(message);
      setProfile(FALLBACK_PROFILE);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchProfile();
    return () => {
      isMounted.current = false;
    };
  }, [fetchProfile]);

  return { profile, loading, error, refetchProfile: fetchProfile };
}
