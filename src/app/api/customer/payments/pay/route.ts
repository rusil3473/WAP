import { NextRequest, NextResponse } from "next/server";
import { payForCustomerBooking } from "@/server/services/customer-service";
import {
  getAuthenticatedProfileFromToken,
  getTokenFromCookie,
} from "@/server/services/session-service";

export async function PUT(req: NextRequest) {
  try {
    const token = await getTokenFromCookie();
    if (!token) {
      return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
    }

    const profile = await getAuthenticatedProfileFromToken(token);
    if (!profile?._id) {
      return NextResponse.json({ message: "Invalid auth token" }, { status: 400 });
    }

    const reqBody = (await req.json()) as { bookingId?: string };
    const bookingId = reqBody.bookingId?.trim();

    if (!bookingId) {
      return NextResponse.json({ message: "Booking ID is required" }, { status: 400 });
    }

    const result = await payForCustomerBooking(profile._id, bookingId);
    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error("Customer payment PUT failed:", error);
    return NextResponse.json({ message: "Failed to complete payment" }, { status: 500 });
  }
}
