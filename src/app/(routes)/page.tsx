"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { NavBar } from "@/app/components/NavBar";
import { useUser } from "@/context/UserContext";
import { getDashboardRouteForRole } from "@/lib/role-routing";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(getDashboardRouteForRole(user.role));
    }
  }, [isLoading, router, user]);

  if (isLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
          <p className="text-sm text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <NavBar landing />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <section className="mb-10 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              Warehouse Aggregation Platform
            </p>
            <h1 className="mb-4 text-4xl font-bold text-slate-900 sm:text-5xl">
              Book storage faster. Manage logistics smarter.
            </h1>
            <p className="mb-8 max-w-xl text-base text-slate-600 sm:text-lg">
              Search trusted warehouses, manage owner listings, and track bookings in one
              place with role-based dashboards.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Get Started
              </Link>
              <Link
                href="/customer/search"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
              >
                Browse Warehouses
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">What you can do</h2>
            <ul className="space-y-3">
              <li className="rounded-lg bg-slate-50 p-4">
                <p className="font-medium text-slate-900">Search by location, capacity, and date</p>
                <p className="mt-1 text-sm text-slate-600">
                  Find the best warehouse options for your shipment profile.
                </p>
              </li>
              <li className="rounded-lg bg-slate-50 p-4">
                <p className="font-medium text-slate-900">Manage owner inventory</p>
                <p className="mt-1 text-sm text-slate-600">
                  Create and update listings with status and availability windows.
                </p>
              </li>
              <li className="rounded-lg bg-slate-50 p-4">
                <p className="font-medium text-slate-900">Track booking lifecycle</p>
                <p className="mt-1 text-sm text-slate-600">
                  Monitor pending, confirmed, and completed bookings from dashboards.
                </p>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        &copy; 2026 Warehouse Aggregation Platform
      </footer>
    </div>
  );
}
