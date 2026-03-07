"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { UserProvider } from "@/context/UserContext";
import RoleRouteGuard from "@/app/components/RoleRouteGuard";

export default function SessionAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <UserProvider>
        <RoleRouteGuard>{children}</RoleRouteGuard>
      </UserProvider>
    </SessionProvider>
  );
}
