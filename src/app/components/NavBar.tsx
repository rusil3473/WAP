"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { AppRole, normalizeRole } from "@/lib/role-routing";

export function NavBar({
  landing,
  role,
}: {
  landing?: boolean;
  role?: "Customer" | "Owner" | "Admin" | AppRole;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const roleFromProp = normalizeRole(role);
  const resolvedRole = user?.role ?? roleFromProp;

  const customerLinks = [
    { label: "Dashboard", href: "/customer/dashboard" },
    { label: "Search", href: "/customer/search" },
    { label: "Bookings", href: "/customer/bookings" },
    { label: "Payments", href: "/customer/payments" },
    { label: "Support", href: "/support" },
    { label: "Profile", href: "/customer/profile" },
  ];

  const ownerLinks = [
    { label: "Dashboard", href: "/owner/dashboard" },
    { label: "Search", href: "/customer/search" },
    { label: "My Listings", href: "/owner/listings" },
    { label: "Bookings", href: "/owner/bookings" },
    { label: "Earnings", href: "/earnings" },
    { label: "Support", href: "/support" },
    { label: "Profile", href: "/profile" },
  ];

  const adminLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Owner View", href: "/owner/dashboard" },
    { label: "Customer View", href: "/customer/dashboard" },
    { label: "Search", href: "/customer/search" },
    { label: "Support", href: "/support" },
    { label: "Profile", href: "/profile" },
  ];

  const landingLinks = [
    { label: "Login", href: "/login" },
    { label: "Search", href: "/customer/search" },
  ];

  const authFallbackLinks = [
    { label: "Login", href: "/login" },
    { label: "Continue", href: "/login" },
    { label: "Search", href: "/customer/search" },
  ];

  const navLinks = landing
    ? landingLinks
    : resolvedRole === "owner"
      ? ownerLinks
      : resolvedRole === "admin"
        ? adminLinks
        : resolvedRole === "customer"
          ? customerLinks
          : authFallbackLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-xl font-bold text-blue-700 sm:text-2xl"
          >
            WAP
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-md p-2 text-blue-700 transition hover:bg-blue-100 md:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <div className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => router.push(link.href)}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-blue-100 hover:text-blue-700"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 pb-3 pt-2 md:hidden">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push(link.href);
                  }}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-100 hover:text-blue-700"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
