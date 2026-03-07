import { NextRequest, NextResponse } from "next/server";
import { setPasswordForAuthenticatedUser } from "@/server/services/auth-service";
import { getAuthenticatedProfileFromToken, getTokenFromCookie } from "@/server/services/session-service";

export async function POST(req: NextRequest) {
  try {
    const reqBody = (await req.json()) as { password?: string };
    const password = reqBody.password?.trim() ?? "";

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const token = await getTokenFromCookie();
    if (!token) {
      return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
    }

    const profile = await getAuthenticatedProfileFromToken(token);
    if (!profile) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    const result = await setPasswordForAuthenticatedUser(profile._id, password);
    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error("Set password route failed:", error);
    return NextResponse.json({ message: "Error while setting password" }, { status: 500 });
  }
}
