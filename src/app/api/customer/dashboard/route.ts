import { NextResponse } from "next/server";
import { getCustomerDashboard } from "@/server/services/customer-service";
import { getAuthenticatedProfileFromToken, getTokenFromCookie } from "@/server/services/session-service";

export async function GET() {
  try {
    const token = await getTokenFromCookie();
    if (!token) {
      return NextResponse.json({ message: "Missing auth token" }, { status: 401 });
    }

    const profile = await getAuthenticatedProfileFromToken(token);
    if (!profile?._id) {
      return NextResponse.json({ message: "Invalid auth token" }, { status: 400 });
    }

    const info = await getCustomerDashboard(profile._id);
    if (!info) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Success", info }, { status: 200 });
  } catch (error) {
    console.error("Customer dashboard route failed:", error);
    return NextResponse.json({ message: "Error getting dashboard data" }, { status: 500 });
  }
}
