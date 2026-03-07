import { NextRequest, NextResponse } from "next/server";
import { resetPassword } from "@/server/services/auth-service";

export async function POST(req: NextRequest) {
  try {
    const reqBody = (await req.json()) as { token?: string; password?: string };
    const token = reqBody.token;
    const password = reqBody.password;

    if (!token || !password) {
      return NextResponse.json({ message: "Token and password are required" }, { status: 400 });
    }

    const result = await resetPassword(token, password);
    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error("Reset password route failed:", error);
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }
    if (error instanceof Error && error.name === "TokenExpiredError") {
      return NextResponse.json({ message: "Token expired" }, { status: 400 });
    }
    return NextResponse.json({ message: "Error resetting password" }, { status: 500 });
  }
}
