import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/db"
import User from "@/models/UserModel";

connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { verifyToken } = reqBody;
    const user = await User.findOne({ verifyToken, verifyTokenExpiry: { $gt: Date.now() } });
    if (!user) {
      return NextResponse.json({ messgae: "Invalid Token" }, { status: 400 })
    }
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();
    return NextResponse.json({ message: "User Verified Succefully ", success: true }, { status: 201 })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }

}