import { NextResponse } from "next/server";
import { getCustomerPayments } from "@/server/services/customer-service";
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
      return NextResponse.json({ message: "Invalid auth token" }, { status: 400 });
    }

    const paymentsData = await getCustomerPayments(profile._id);
    return NextResponse.json(
      { message: "Payments fetched successfully", data: paymentsData },
      { status: 200 },
    );
  } catch (error) {
    console.error("Customer payments GET failed:", error);
    return NextResponse.json({ message: "Failed to fetch payments" }, { status: 500 });
  }
}
