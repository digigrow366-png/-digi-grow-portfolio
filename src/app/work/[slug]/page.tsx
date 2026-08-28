"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { Project } from "@/types/project";
import { FALLBACK_PROJECTS } from "@/types/project";
import { ProjectSubCards } from "@/components/projects/ProjectSubCards";
import Wordmark from "@/components/brand/Wordmark";
import Link from "next/link";

/**
 * §1.3 Visual Hierarchy: F-pattern for text-heavy project detail.
 * Sub-cards (Stage 7) sit as scannable blocks, not paragraphs.
 *
 * 404s gracefully with a styled empty state, not a raw Next.js error.
 */
export default function WorkDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    async function fetchProject() {
      if (!isSupabaseConfigured()) {
        /* Offline fallback: search seed data */
        const found = FALLBACK_PROJECTS.find((p) => p.slug === params.slug);
        if (found) {
          setProject(found);
        } else {
          setNotFound(true);
        }
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("slug", params.slug)
          .maybeSingle();

        if (!isMounted.current) return;

        if (error) {
          console.error("Work detail fetch error:", error);
          setNotFound(true);
        } else if (!data) {
          setNotFound(true);
        } else {
          setProject({
            ...data,
            gallery: Array.isArray(data.gallery) ? data.gallery : [],
            sub_cards: Array.isArray(data.sub_cards) ? data.sub_cards : [],
          } as Project);
        }
      } catch (err) {
        if (!isMounted.current) return;
        console.error("Work detail error:", err);
        setNotFound(true);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    }

    fetchProject();

    return () => {
      isMounted.current = false;
    };
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-2xl px-8">
          <div className="h-64 bg-white/5 rounded-2xl" />
          <div className="h-4 w-24 bg-white/5 rounded" />
          <div className="h-8 w-64 bg-white/5 rounded" />
          <div className="h-4 w-full bg-white/5 rounded" />
          <div className="h-4 w-3/4 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8">
        <Wordmark className="mb-8" />
        <h1 className="text-4xl font-black tracking-tighter mb-4">
          Project not found
        </h1>
        <p style={{ color: "var(--color-muted)" }} className="mb-8">
          The project you&apos;re looking for doesn&apos;t exist or isn&apos;t published yet.
        </p>
        <Link
          href="/"
          data-cursor-hover
          className="px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-text)",
          }}
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="glass-nav sticky top-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" data-cursor-hover>
          <Wordmark />
        </Link>
        <Link
          href="/#work"
          data-cursor-hover
          className="badge-label hover:text-[var(--color-primary)] transition-colors"
        >
          ← All Work
        </Link>
      </header>

      {/* Cover Image */}
      {project.cover_image_url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden"
        >
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      )}

      {/* F-pattern content block */}
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="badge-label mb-3 block">
            {project.category || "Project"}
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            {project.title}
          </h1>
          {project.summary && (
            <p
              className="text-lg leading-relaxed max-w-2xl"
              style={{ color: "var(--color-muted)" }}
            >
              {project.summary}
            </p>
          )}
        </motion.div>
      </div>

      {/* Gallery */}
      {project.gallery.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 md:px-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.gallery.map((url, i) => (
              <motion.img
                key={i}
                src={url}
                alt={`${project.title} gallery ${i + 1}`}
                className="w-full rounded-2xl object-cover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      )}

      {/* Sub-cards grid (Stage 7) */}
      <ProjectSubCards cards={project.sub_cards} />

      {/* External link CTA */}
      {project.external_url && (
        <div className="flex justify-center py-16">
          <a
            href={project.external_url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text)",
            }}
          >
            View Live Project →
          </a>
        </div>
      )}
    </main>
  );
}
