"use client";

import React, { useEffect, useState, useRef } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import Wordmark from "@/components/brand/Wordmark";

/**
 * Admin shell — wraps all /admin/* pages.
 * Auth-gated behind Supabase Auth (email + password).
 *
 * BUG-03: Redirects unauthenticated visitors before any data fetch fires.
 * No flash of admin UI — shows login form until authenticated.
 */
export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    async function checkAuth() {
      if (!isSupabaseConfigured()) {
        /* No Supabase configured — allow access for dev/demo mode */
        setAuthenticated(true);
        setLoading(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (isMounted.current) {
        setAuthenticated(!!session);
        setLoading(false);
      }
    }

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted.current) {
        setAuthenticated(!!session);
      }
    });

    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginError(error.message);
    }
    setLoggingIn(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setAuthenticated(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse badge-label">Loading admin…</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="bento-card rounded-2xl p-8 w-full max-w-md">
          <Wordmark className="mb-6" />
          <h1 className="text-2xl font-black tracking-tight mb-6">
            Admin Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="badge-label block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                placeholder="admin@digigrow.com"
              />
            </div>
            <div>
              <label className="badge-label block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                placeholder="••••••••"
              />
            </div>
            {loginError && (
              <p className="text-red-400 text-sm">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loggingIn}
              data-cursor-hover
              className="w-full py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-text)",
              }}
            >
              {loggingIn ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Admin header */}
      <header className="glass-nav sticky top-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/" data-cursor-hover>
            <Wordmark />
          </a>
          <span className="badge-label">Admin</span>
        </div>
        <nav className="flex items-center gap-4">
          <a
            href="/admin/profile"
            data-cursor-hover
            className="badge-label hover:text-[var(--color-primary)] transition-colors"
          >
            Profile
          </a>
          <a
            href="/admin/projects"
            data-cursor-hover
            className="badge-label hover:text-[var(--color-primary)] transition-colors"
          >
            Projects
          </a>
          <button
            onClick={handleSignOut}
            data-cursor-hover
            className="badge-label hover:text-red-400 transition-colors"
          >
            Sign Out
          </button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-8 py-8">{children}</main>
    </div>
  );
}
