import { NextRequest, NextResponse } from "next/server";
import { signupWithEmail } from "@/server/services/auth-service";

type SignupBody = {
  email?: string;
  password?: string;
  fullName?: string;
};

export async function POST(req: NextRequest) {
  try {
    const reqBody = (await req.json()) as SignupBody;
    const email = reqBody.email?.trim();
    const password = reqBody.password?.trim();
    const fullName = reqBody.fullName?.trim();

    if (!email || !password || !fullName) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const result = await signupWithEmail({ email, password, fullName });
    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error("Signup route failed:", error);
    return NextResponse.json({ message: "Error while creating account" }, { status: 500 });
  }
}
