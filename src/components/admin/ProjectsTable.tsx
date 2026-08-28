"use client";

import React, { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { Project } from "@/types/project";
import { useAdminProjects } from "@/hooks/useProjects";

/**
 * Table of projects for the admin dashboard.
 * Supports deleting and toggling publish status directly from the table.
 * Links to /admin/projects/[id] for full editing.
 */
export default function ProjectsTable() {
  const { projects, loading, refetchProjects } = useAdminProjects();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  async function togglePublish(project: Project) {
    if (!isSupabaseConfigured()) {
      showToast("error", "Supabase not configured. Changes are preview-only.");
      return;
    }

    setProcessingId(project.id);
    const { error } = await supabase
      .from("projects")
      .update({ published: !project.published })
      .eq("id", project.id);

    if (error) {
      showToast("error", error.message);
    } else {
      showToast("success", `Project ${project.published ? "unpublished" : "published"}`);
      refetchProjects();
    }
    setProcessingId(null);
  }

  async function deleteProject(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    if (!isSupabaseConfigured()) {
      showToast("error", "Supabase not configured. Changes are preview-only.");
      return;
    }

    setProcessingId(id);
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      showToast("error", error.message);
    } else {
      showToast("success", "Project deleted");
      refetchProjects();
    }
    setProcessingId(null);
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse mt-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-white/5 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      {projects.length === 0 ? (
        <div className="text-center py-12 px-6 bento-card rounded-2xl">
          <p style={{ color: "var(--color-muted)" }}>No projects found. Create one to get started.</p>
        </div>
      ) : (
        <div className="bento-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 badge-label text-[var(--color-muted)] font-normal">Order</th>
                  <th className="px-6 py-4 badge-label text-[var(--color-muted)] font-normal">Title</th>
                  <th className="px-6 py-4 badge-label text-[var(--color-muted)] font-normal">Status</th>
                  <th className="px-6 py-4 badge-label text-[var(--color-muted)] font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-[var(--color-muted)]">
                      {project.sort_order}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-[var(--color-text)]">{project.title}</div>
                      <div className="text-xs mt-1 text-[var(--color-muted)] truncate max-w-[200px] md:max-w-xs">
                        /{project.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublish(project)}
                        disabled={processingId === project.id}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          project.published
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                            : "bg-white/5 border-white/10 text-[var(--color-muted)] hover:bg-white/10"
                        }`}
                      >
                        {project.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-4">
                      <a
                        href={`/admin/projects/${project.id}`}
                        data-cursor-hover
                        className="text-sm text-[var(--color-primary)] hover:underline"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => deleteProject(project.id, project.title)}
                        disabled={processingId === project.id}
                        data-cursor-hover
                        className="text-sm text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
