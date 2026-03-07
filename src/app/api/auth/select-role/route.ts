import { NextRequest, NextResponse } from "next/server";
import { selectRole } from "@/server/services/auth-service";
import { getAuthenticatedProfileFromToken, getTokenFromCookie } from "@/server/services/session-service";

export async function POST(req: NextRequest) {
  try {
    const reqBody = (await req.json()) as { role?: "customer" | "owner" };
    const role = reqBody.role;

    if (role !== "customer" && role !== "owner") {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    const token = await getTokenFromCookie();
    if (!token) {
      return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
    }

    const profile = await getAuthenticatedProfileFromToken(token);
    if (!profile) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    const result = await selectRole(profile._id, role);
    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error("Select role route failed:", error);
    return NextResponse.json({ message: "Error while selecting role" }, { status: 500 });
  }
}
