import { NextResponse } from "next/server";
import { getCustomerBookings } from "@/server/services/customer-service";
import { getAuthenticatedProfileFromToken, getTokenFromCookie } from "@/server/services/session-service";

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

    const bookings = await getCustomerBookings(profile._id);
    return NextResponse.json({ message: "Data fetched", data: bookings }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch customer bookings:", error);
    return NextResponse.json({ message: "Error while getting booking data" }, { status: 500 });
  }
}
