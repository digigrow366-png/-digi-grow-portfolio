"use client";

import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ProjectForm from "@/components/admin/ProjectForm";

export default function AdminProjectEditorPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const isNew = params.id === "new";

  return (
    <AdminShell>
      <ProjectForm
        projectId={isNew ? undefined : params.id}
        onSaved={() => router.push("/admin/projects")}
        onCancel={() => router.push("/admin/projects")}
      />
    </AdminShell>
  );
}
