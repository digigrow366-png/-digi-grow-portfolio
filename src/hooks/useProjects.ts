"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { Project } from "@/types/project";
import { FALLBACK_PROJECTS } from "@/types/project";

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refetchProjects: () => void;
}

/**
 * Fetches published projects ordered by sort_order for public display.
 * Falls back to FALLBACK_PROJECTS when Supabase is unreachable.
 *
 * BUG-01: Optional chaining + defaults on gallery/sub_cards.
 * BUG-06: isMounted guard prevents state updates after unmount.
 * BUG-10: Public client only sees rows where published = true (via RLS).
 */
export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchProjects = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setProjects(FALLBACK_PROJECTS);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!isMounted.current) return;

      if (dbError) {
        console.error("useProjects DB error:", dbError);
        setError(dbError.message);
        setProjects(FALLBACK_PROJECTS);
      } else if (!data || data.length === 0) {
        setProjects(FALLBACK_PROJECTS);
      } else {
        const normalized: Project[] = data.map((row) => ({
          ...row,
          gallery: Array.isArray(row.gallery) ? row.gallery : [],
          sub_cards: Array.isArray(row.sub_cards) ? row.sub_cards : [],
        })) as Project[];
        setProjects(normalized);
      }
    } catch (err) {
      if (!isMounted.current) return;
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("useProjects fetch error:", message);
      setError(message);
      setProjects(FALLBACK_PROJECTS);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchProjects();
    return () => {
      isMounted.current = false;
    };
  }, [fetchProjects]);

  return { projects, loading, error, refetchProjects: fetchProjects };
}

/**
 * Fetches ALL projects (published + unpublished) for the admin dashboard.
 * Requires an authenticated Supabase session to bypass the public RLS policy.
 */
export function useAdminProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchProjects = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!isMounted.current) return;

      if (dbError) {
        console.error("useAdminProjects DB error:", dbError);
        setError(dbError.message);
        setProjects([]);
      } else {
        const normalized: Project[] = (data ?? []).map((row) => ({
          ...row,
          gallery: Array.isArray(row.gallery) ? row.gallery : [],
          sub_cards: Array.isArray(row.sub_cards) ? row.sub_cards : [],
        })) as Project[];
        setProjects(normalized);
      }
    } catch (err) {
      if (!isMounted.current) return;
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("useAdminProjects fetch error:", message);
      setError(message);
      setProjects([]);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchProjects();
    return () => {
      isMounted.current = false;
    };
  }, [fetchProjects]);

  return { projects, loading, error, refetchProjects: fetchProjects };
}
