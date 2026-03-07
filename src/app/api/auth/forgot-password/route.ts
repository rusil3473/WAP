import { NextRequest, NextResponse } from "next/server";
import { forgotPassword } from "@/server/services/auth-service";

export async function POST(req: NextRequest) {
  try {
    const reqBody = (await req.json()) as { email?: string };
    const email = reqBody.email?.trim();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const result = await forgotPassword(email);
    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error("Forgot password route failed:", error);
    return NextResponse.json({ message: "Failed to send password reset email" }, { status: 500 });
  }
}
