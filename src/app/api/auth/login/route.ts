import { NextRequest, NextResponse } from "next/server";
import { loginOrCreate } from "@/server/services/auth-service";

type LoginBody = {
  formData?: {
    email?: string;
    password?: string;
  };
  session?: {
    user?: {
      email?: string;
      name?: string;
    };
  };
};

export async function POST(req: NextRequest) {
  try {
    const reqBody = (await req.json()) as LoginBody;
    const sessionEmail = reqBody.session?.user?.email;
    const sessionName = reqBody.session?.user?.name;
    const email = sessionEmail ?? reqBody.formData?.email;
    const password = reqBody.formData?.password;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const result = await loginOrCreate({
      email,
      password,
      sessionName,
      viaGoogle: Boolean(sessionEmail),
    });

    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error("Login route failed:", error);
    return NextResponse.json({ message: "Error while logging in" }, { status: 500 });
  }
}
