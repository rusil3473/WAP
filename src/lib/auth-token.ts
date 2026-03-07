import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export type AuthTokenPayload = {
  _id: string;
  fullName: string;
  email: string;
  role: "customer" | "owner" | "admin" | null;
  isVerified: boolean;
};

function getAuthSecret() {
  const secret = process.env.SECRET;
  if (!secret) {
    throw new Error("SECRET is not configured.");
  }
  return secret;
}

export function signAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, getAuthSecret(), { expiresIn: "7d" });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, getAuthSecret()) as AuthTokenPayload;
}

export async function setAuthTokenCookie(payload: AuthTokenPayload) {
  const cookieStore = await cookies();
  const token = signAuthToken(payload);
  cookieStore.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return token;
}
