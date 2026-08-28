"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect root /admin to /admin/profile
    router.replace("/admin/profile");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <span className="badge-label animate-pulse">Redirecting...</span>
    </div>
  );
}
