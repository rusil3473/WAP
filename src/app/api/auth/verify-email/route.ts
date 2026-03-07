import { NextRequest, NextResponse } from "next/server";
import { verifyEmail } from "@/server/services/auth-service";

export async function POST(req: NextRequest) {
  try {
    const reqBody = (await req.json()) as { verifyToken?: string };
    const verifyToken = reqBody.verifyToken;

    if (!verifyToken) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    const result = await verifyEmail(verifyToken);
    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error("Verify email route failed:", error);
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }
    if (error instanceof Error && error.name === "TokenExpiredError") {
      return NextResponse.json({ message: "Token expired" }, { status: 400 });
    }
    return NextResponse.json({ message: "Error verifying email" }, { status: 500 });
  }
}
