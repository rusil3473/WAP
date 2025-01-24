import User from "@/models/UserModel";
import { connect } from "@/dbConfig/db"
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import { setToken } from "@/helper/setToken";
connect()
export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { formData, session } = reqBody;
    const {email,password}=formData
    /*user login with session*/
    if (session && session.user && session.user.email) {
      const user = await User.findOne({ email: session.user.email });
      if (!user) {
        return NextResponse.json({ message: "No such user" }, { status: 400 })
      }
      const token = await setToken(user);
      if (token) {
        return NextResponse.json({ message: "Login Success", success: true }, { status: 200 })
      }
      return NextResponse.json({ message: "Error while setting token", success: true }, { status: 400 })
    }
    /*user login with email & passsword*/
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "No such user abc" }, { status: 400 })
    }
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return NextResponse.json({ message: "Password Does not match" }, { status: 400 })
    }
    const token = await setToken(user);
    if (token) {
      return NextResponse.json({ message: "Login Success", success: true }, { status: 200 })
    }
    return NextResponse.json({ message: "Error while setting token", success: true }, { status: 400 })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  } catch (error: any) {
    return NextResponse.json({ message: "Erroe while login " }, { status: 500 })
  }
}