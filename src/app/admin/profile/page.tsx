"use client";

import AdminShell from "@/components/admin/AdminShell";
import ProfileEditor from "@/components/admin/ProfileEditor";

export default function AdminProfilePage() {
  return (
    <AdminShell>
      <ProfileEditor />
    </AdminShell>
  );
}
