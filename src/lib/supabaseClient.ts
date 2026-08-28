import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

/**
 * Public Supabase client — used for public reads (anon role).
 * Falls back gracefully when env vars are empty (offline/dev mode).
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Returns true when Supabase env vars are configured.
 * Components should check this before making DB calls and fall back
 * to seed data from head.md when false.
 */
export function isSupabaseConfigured(): boolean {
  return supabaseUrl.length > 0 && supabaseAnonKey.length > 0;
}
