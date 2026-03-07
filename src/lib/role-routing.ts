export type AppRole = "customer" | "owner" | "admin";

const OWNER_ONLY_ROUTES = [
  "/owner/dashboard",
  "/owner/listings",
  "/owner/bookings",
  "/earnings",
  "/dashboard/owner",
  "/listings",
  "/managebooking",
  "/bookings/owner",
] as const;

const CUSTOMER_ONLY_ROUTES = [
  "/customer/dashboard",
  "/customer/bookings",
  "/customer/book",
  "/customer/payments",
  "/customer/profile",
  "/dashboard/customer",
  "/viewbooking",
  "/bookings/customer",
  "/book",
] as const;

const AUTH_ONLY_ROUTES = ["/dashboard", "/support", "/profile"] as const;
const ONBOARDING_ONLY_ROUTES = ["/choose-role", "/set-password"] as const;

const AUTH_PAGES = [
  "/login",
  "/signup",
  "/signup/customer",
  "/signup/owner",
  "/customer/sign-up",
  "/owner/sign-up",
] as const;

function normalizePath(pathname: string) {
  if (!pathname) {
    return "/";
  }

  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function matchesRoute(pathname: string, route: string) {
  const normalizedPath = normalizePath(pathname);
  const normalizedRoute = normalizePath(route);

  if (normalizedPath === normalizedRoute) {
    return true;
  }

  return normalizedPath.startsWith(`${normalizedRoute}/`);
}

export function normalizeRole(role: string | null | undefined): AppRole | null {
  if (!role) {
    return null;
  }

  const normalized = role.trim().toLowerCase();
  if (normalized === "customer" || normalized === "owner" || normalized === "admin") {
    return normalized;
  }

  return null;
}

export function getDashboardRouteForRole(role: string | null | undefined) {
  const normalized = normalizeRole(role);

  if (normalized === "owner") {
    return "/owner/dashboard";
  }

  if (normalized === "customer") {
    return "/customer/dashboard";
  }

  if (normalized === "admin") {
    return "/dashboard";
  }

  return "/choose-role";
}

export function getRequiredRole(pathname: string): Exclude<AppRole, "admin"> | null {
  if (OWNER_ONLY_ROUTES.some((route) => matchesRoute(pathname, route))) {
    return "owner";
  }

  if (CUSTOMER_ONLY_ROUTES.some((route) => matchesRoute(pathname, route))) {
    return "customer";
  }

  return null;
}

export function requiresAuth(pathname: string) {
  if (AUTH_ONLY_ROUTES.some((route) => matchesRoute(pathname, route))) {
    return true;
  }

  if (ONBOARDING_ONLY_ROUTES.some((route) => matchesRoute(pathname, route))) {
    return true;
  }

  return getRequiredRole(pathname) !== null;
}

export function isAuthPage(pathname: string) {
  return AUTH_PAGES.some((route) => matchesRoute(pathname, route));
}
