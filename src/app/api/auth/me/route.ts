import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedProfileFromToken, getTokenFromBodyOrCookie, getTokenFromCookie } from "@/server/services/session-service";

export async function GET() {
  try {
    const token = await getTokenFromCookie();
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized user", success: false },
        { status: 401 },
      );
    }

    const profile = await getAuthenticatedProfileFromToken(token);
    if (!profile) {
      return NextResponse.json(
        { message: "Invalid token", success: false },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Got the data", success: true, data: profile },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { message: "Invalid or expired token", success: false },
      { status: 400 },
    );
  }
}

export async function POST(req: NextRequest) {
  const token = await getTokenFromBodyOrCookie(req);

  try {
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized user", success: false },
        { status: 401 },
      );
    }

    const profile = await getAuthenticatedProfileFromToken(token);
    if (!profile) {
      return NextResponse.json(
        { message: "Invalid token", success: false },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Got the data", success: true, data: profile },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { message: "Invalid or expired token", success: false },
      { status: 400 },
    );
  }
}
