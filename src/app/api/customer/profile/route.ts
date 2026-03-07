import { NextRequest, NextResponse } from "next/server";
import {
  getCustomerProfile,
  updateCustomerProfileName,
} from "@/server/services/customer-service";
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

    const customerProfile = await getCustomerProfile(profile._id);
    if (!customerProfile) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Profile fetched successfully", data: customerProfile },
      { status: 200 },
    );
  } catch (error) {
    console.error("Customer profile GET failed:", error);
    return NextResponse.json({ message: "Failed to fetch profile" }, { status: 500 });
  }
}

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

    const reqBody = (await req.json()) as { fullName?: string };
    const fullName = reqBody.fullName ?? "";

    const result = await updateCustomerProfileName(profile._id, fullName);
    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error("Customer profile PUT failed:", error);
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
  }
}
