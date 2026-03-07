"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import {
  getDashboardRouteForRole,
  getRequiredRole,
  isAuthPage,
  requiresAuth,
} from "@/lib/role-routing";

function normalizePath(pathname: string) {
  if (!pathname) {
    return "/";
  }

  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

export default function RoleRouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const routeState = useMemo(() => {
    const normalizedPath = normalizePath(pathname);
    const requiredRole = getRequiredRole(normalizedPath);
    const authRequired = requiredRole !== null || requiresAuth(normalizedPath);
    const authPage = isAuthPage(normalizedPath);
    const isRoleSelectionPage = normalizedPath === "/choose-role";
    const isPasswordSetupPage = normalizedPath === "/set-password";

    return {
      normalizedPath,
      requiredRole,
      authRequired,
      authPage,
      isRoleSelectionPage,
      isPasswordSetupPage,
    };
  }, [pathname]);

  useEffect(() => {
    if (isLoading) {
      setIsRedirecting(false);
      return;
    }

    if (!user) {
      if (routeState.authRequired) {
        setIsRedirecting(true);
        const nextPath = encodeURIComponent(routeState.normalizedPath || "/");
        router.replace(`/login?next=${nextPath}`);
        return;
      }

      setIsRedirecting(false);
      return;
    }

    const needsPasswordSetup = !user.hasPassword;
    const needsRoleSelection = !user.role;

    if (routeState.authPage) {
      setIsRedirecting(true);
      if (needsPasswordSetup) {
        router.replace("/set-password");
        return;
      }

      if (needsRoleSelection) {
        router.replace("/choose-role");
        return;
      }

      router.replace(getDashboardRouteForRole(user.role));
      return;
    }

    if (needsPasswordSetup && !routeState.isPasswordSetupPage) {
      setIsRedirecting(true);
      router.replace("/set-password");
      return;
    }

    if (!needsPasswordSetup && routeState.isPasswordSetupPage) {
      setIsRedirecting(true);
      if (needsRoleSelection) {
        router.replace("/choose-role");
        return;
      }

      router.replace(getDashboardRouteForRole(user.role));
      return;
    }

    if (!needsPasswordSetup && needsRoleSelection && !routeState.isRoleSelectionPage) {
      setIsRedirecting(true);
      router.replace("/choose-role");
      return;
    }

    if (!needsRoleSelection && routeState.isRoleSelectionPage) {
      setIsRedirecting(true);
      router.replace(getDashboardRouteForRole(user.role));
      return;
    }

    if (
      routeState.requiredRole &&
      user.role &&
      user.role !== "admin" &&
      user.role !== routeState.requiredRole
    ) {
      setIsRedirecting(true);
      router.replace(getDashboardRouteForRole(user.role));
      return;
    }

    setIsRedirecting(false);
  }, [isLoading, routeState, router, user]);

  if ((isLoading && (routeState.authRequired || routeState.authPage)) || isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
          <p className="text-sm text-slate-600">Checking access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
