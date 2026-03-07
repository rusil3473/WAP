import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { verifyAuthToken, type AuthTokenPayload } from "@/lib/auth-token";
import { getProfileById } from "@/lib/supabase-data";

export async function getTokenFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

export async function getTokenFromBodyOrCookie(req: NextRequest) {
  let bodyToken: string | undefined;

  try {
    const reqBody = (await req.json()) as { token?: string };
    bodyToken = reqBody?.token;
  } catch {
    bodyToken = undefined;
  }

  const cookieToken = await getTokenFromCookie();
  return bodyToken ?? cookieToken;
}

export function decodeAuthToken(token: string): AuthTokenPayload | null {
  try {
    return verifyAuthToken(token);
  } catch {
    return null;
  }
}

export async function getAuthenticatedProfileFromToken(token: string) {
  const payload = decodeAuthToken(token);
  if (!payload?._id) {
    return null;
  }

  return getProfileById(payload._id);
}
