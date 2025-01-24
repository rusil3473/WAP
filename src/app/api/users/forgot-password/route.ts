import { sendMail } from "@/helper/sendMail";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req:NextRequest) {
  try {
    const reqBody=await req.json();
    const {email}=reqBody;
    const user=await User.findOne({email});
    if(!user){
      return NextResponse.json({message:"There is no account detected with this email "},{status:400})
    }
  await  sendMail({_id:user._id,email,requestType:"RESET"})
    return NextResponse.json({messgage:"Email sent succefully",success:true},{status:200})
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    return NextResponse.json({messgae:error},{status:500})
  }
}