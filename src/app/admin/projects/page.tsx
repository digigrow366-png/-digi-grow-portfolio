"use client";

import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ProjectsTable from "@/components/admin/ProjectsTable";

export default function AdminProjectsPage() {
  const router = useRouter();

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight">Projects</h2>
          <button
            onClick={() => router.push("/admin/projects/new")}
            data-cursor-hover
            className="px-6 py-2 rounded-full font-semibold text-sm transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text)",
            }}
          >
            + New Project
          </button>
        </div>

        <ProjectsTable />
      </div>
    </AdminShell>
  );
}
