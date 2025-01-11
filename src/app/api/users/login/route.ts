import User from "@/models/UserModel";
import {connect} from "@/dbConfig/db"
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken" 
import { cookies } from "next/headers";
connect()
export async function POST(req:NextRequest){
  try {

    const reqBody=await req.json();
    const {email,password}=reqBody;
    const user=await User.findOne({email})
   
    if(!user){
      return NextResponse.json({message:"No such user"},{status:400})
    }
    const isCorrect=await bcrypt.compare(password,user.password);
    if(!isCorrect){
      return NextResponse.json({message:"Password Does not match"},{status:400})
    }
    console.log(isCorrect)
    const data={
     id:user._id,
     username:user.username,
     email,
     role:user.role,
     isVerified:user.isVerified
    }
    
    const cookie=await cookies();
    const token=jwt.sign(data,process.env.SECRET!);
    cookie.set("token",token);
    return NextResponse.json({message:"Login Success",success:true},{status:200})

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  } catch (error:any) {
    return NextResponse.json({message:"Erroe while login "},{status:500})
  }
}