"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";
import { getDashboardRouteForRole } from "@/lib/role-routing";

export default function ChooseRolePage() {
  const router = useRouter();
  const { user, isLoading, refreshUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState<"owner" | "customer" | null>(null);

  useEffect(() => {
    if (!isLoading && user?.role) {
      router.replace(getDashboardRouteForRole(user.role));
    }
  }, [isLoading, router, user]);

  const selectRole = async (role: "owner" | "customer") => {
    setIsSubmitting(role);
    try {
      await axios.post("/api/auth/select-role", { role });
      await refreshUser();
      toast.success("Role selected successfully");
      router.replace(role === "owner" ? "/owner/dashboard" : "/customer/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Unable to set role");
      } else {
        toast.error("Unable to set role");
      }
    } finally {
      setIsSubmitting(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-4">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200/20 bg-white p-8 shadow-2xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-900">Choose Your Role</h1>
        <p className="mb-8 text-center text-sm text-slate-600">
          You can choose your role once. This selection will be fixed for your account.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => void selectRole("owner")}
            disabled={isSubmitting !== null}
            className="group rounded-xl border border-slate-200 p-6 text-left transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 21h18" />
                <path d="M5 21V8l7-4 7 4v13" />
                <path d="M9 21v-6h6v6" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Warehouse Owner</h2>
            <p className="mt-1 text-sm text-slate-600">I want to rent out my warehouse space.</p>
            <p className="mt-3 text-xs font-medium text-blue-700 group-hover:underline">
              {isSubmitting === "owner" ? "Saving..." : "Continue as Owner"}
            </p>
          </button>

          <button
            type="button"
            onClick={() => void selectRole("customer")}
            disabled={isSubmitting !== null}
            className="group rounded-xl border border-slate-200 p-6 text-left transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h10" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Customer</h2>
            <p className="mt-1 text-sm text-slate-600">I want to rent a warehouse for storage.</p>
            <p className="mt-3 text-xs font-medium text-emerald-700 group-hover:underline">
              {isSubmitting === "customer" ? "Saving..." : "Continue as Customer"}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

