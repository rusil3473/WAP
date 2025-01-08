import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getData } from "@/helper/getData";

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { token } = reqBody;
    
    const user = jwt.verify(token, process.env.SECRET!);
    if (typeof user === "string" || !user) {
      return NextResponse.json({ message: "Invalid token", success: false },{ status: 400 }
      );
    }
    const { id } = user;
    const data=await getData(id);
    return NextResponse.json({ message: "Got the data", success: true, data }, { status: 200 });
  }

  catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ message: "Invalid or expired token", success: false }, { status: 400 }
    );
  }
}
