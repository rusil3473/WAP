import { NextRequest, NextResponse } from "next/server";
import { updateProfileFullName } from "@/lib/supabase-data";
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
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    const reqBody = (await req.json()) as { fullName?: string };
    const fullName = reqBody.fullName?.trim() ?? "";
    if (fullName.length < 2) {
      return NextResponse.json(
        { message: "Full name must be at least 2 characters" },
        { status: 400 },
      );
    }

    const updatedProfile = await updateProfileFullName(profile._id, fullName);
    if (!updatedProfile) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        data: updatedProfile,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Auth profile update failed:", error);
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
  }
}
