import {  NextRequest , NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import User from "@/models/UserModel"
import { sendMail } from "@/helper/sendMail";
import {connect} from "@/dbConfig/db"
connect();
export async function POST (req : NextRequest ){
  try{
    const reqBody=await req.json();
    const {email,password,firstName,lastName,username,role} =reqBody;
    const user=await User.findOne({email}) || await User.findOne({username});
    if(user){
      return NextResponse.json({message:"Email alerady in use or try another username "},{status:400})
    }
    const secPass=await bcrypt.hash(password,await bcrypt.genSalt(10));
    const savedUser=await User.create({
      username,password:secPass,email,firstName,lastName,role
    })
    await sendMail({_id:savedUser._id,email,requestType:"VERIFY"});
    return NextResponse.json({Message:"User Created Succefully ",success:true},{status:201})
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(err:any){
   return NextResponse.json({message: err.message},{status:500})
  }
}