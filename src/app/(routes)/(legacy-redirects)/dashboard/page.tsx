"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { getDashboardRouteForRole } from "@/lib/role-routing";

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      router.replace("/login?next=/dashboard");
      return;
    }

    router.replace(getDashboardRouteForRole(user.role));
  }, [isLoading, router, user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
