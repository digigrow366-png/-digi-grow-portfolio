"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CometCard } from "@/components/ui/comet-card";
import { useProjects } from "@/hooks/useProjects";
import { NothingDotText, ndotFont } from "@/components/NothingDotText";

/**
 * §1.3 Visual Hierarchy: Commitment/grid pattern.
 * Equal-weight items in a predictable scan — this is a catalog, not a narrative.
 *
 * Each card is one Project from useProjects(), wrapped in CometCard,
 * linking to /work/[slug].
 *
 * BUG-01: Optional chaining on cover_image_url and category.
 * Skeleton loading state shown while data loads.
 * Empty state renders a clear message when no published work exists.
 */

function ProjectGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 max-w-6xl mx-auto">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bento-card rounded-2xl overflow-hidden animate-pulse"
        >
          <div className="w-full h-64 bg-white/5" />
          <div className="p-4 space-y-2">
            <div className="h-3 w-20 bg-white/5 rounded" />
            <div className="h-5 w-40 bg-white/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProjectGrid() {
  const { projects, loading } = useProjects();

  if (loading) return <ProjectGridSkeleton />;

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-8">
        <span className="badge-label mb-2">Portfolio</span>
        <p style={{ color: "var(--color-muted)" }}>
          No published work yet — check back soon.
        </p>
      </div>
    );
  }

  return (
    <section id="work" className="py-20">
      {/* Subtle Ambient Red Glow */}
      <div 
        className="absolute w-[1000px] h-[600px] blur-[150px] pointer-events-none rounded-full top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" 
        style={{
          background: "radial-gradient(circle, var(--color-primary) 0%, transparent 60%)",
          opacity: 0.08,
        }}
      />
      <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 border-b border-white/10 pb-8"
        >
          <div className="mb-4">
            <NothingDotText text="SELECTED WORK" variant="theme" size="sm" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white flex items-center gap-4">
            Projects <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--color-primary)" }} />
          </h2>
        </motion.div>

        <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8 md:pb-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {projects.map((p, idx) => (
            <Link key={p.id} href={`/work/${p.slug}`} className="shrink-0 snap-center w-[80vw] sm:w-[50vw] md:w-auto h-auto block">
              <motion.div
                data-cursor-hover
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: Math.min(idx, 5) * 0.1 }}
                className="h-auto block"
              >
                <CometCard className="h-full group">
                <div 
                  className="bento-card rounded-xl overflow-hidden relative transition-all duration-500 hover:border-white/20 flex flex-col h-full"
                  style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 2%, #09090b)" }}
                >
                  {/* Hover glow effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
                    style={{ background: "radial-gradient(circle at center, var(--color-primary) 0%, transparent 70%)" }}
                  />
                  {p.cover_image_url ? (
                    <div className="w-full h-64 overflow-hidden relative border-b border-white/5">
                      <img
                        src={p.cover_image_url}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-zinc-950 flex items-center justify-center border-b border-white/5">
                      <span
                        className={`text-6xl font-black opacity-5 ${ndotFont.className}`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )}
                  <div className="p-6 relative z-10">
                    <span 
                      className={`inline-block px-2 py-1 rounded bg-white/5 border border-white/10 text-[8px] md:text-[9px] uppercase tracking-widest ${ndotFont.className}`}
                      style={{ color: "var(--color-primary)" }}
                    >
                      {p.category || "Project"}
                    </span>
                    <h3 className="text-xl font-black tracking-tight mt-3">
                      {p.title}
                    </h3>
                    {p.summary && (
                      <p
                        className="text-sm mt-2 line-clamp-2"
                        style={{ color: "var(--color-muted)" }}
                      >
                        {p.summary}
                      </p>
                    )}
                  </div>
                </div>
              </CometCard>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
