import { NextRequest, NextResponse } from "next/server";
import User from "@/models/UserModel";
import bcrypt from "bcryptjs"
import { connect } from "@/dbConfig/db"
connect()
export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { token, password } = reqBody;
    const user = await User.findOne({ forgotToken: token, forgotTokenExpiry: { $gt: Date.now() } })
    if (!user) {
      return NextResponse.json({ message: "Invalid Token " }, { status: 400 })
    }
    const secPass = await bcrypt.hash(password, await bcrypt.genSalt(10));
    console.log(secPass)
    user.password = secPass;
    user.forgotToken = undefined;
    user.forgotTokenExpiry = undefined;
    await user.save();
    return NextResponse.json({ message: "password reset succesful", success: true }, { status: 200 })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ messgae: error }, { status: 500 })
  }
}