import { NextResponse } from "next/server";
import { getOwnerEarnings } from "@/server/services/owner-service";
import {
  getAuthenticatedProfileFromToken,
  getTokenFromCookie,
} from "@/server/services/session-service";

export async function GET() {
  try {
    const token = await getTokenFromCookie();
    if (!token) {
      return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
    }

    const profile = await getAuthenticatedProfileFromToken(token);
    if (!profile?._id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    const data = await getOwnerEarnings(profile._id);
    return NextResponse.json({ message: "Earnings fetched", data }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch owner earnings:", error);
    return NextResponse.json({ message: "Error while fetching earnings" }, { status: 500 });
  }
}
