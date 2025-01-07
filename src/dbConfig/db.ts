 import mongoose from "mongoose" 
import { NextResponse } from "next/server"

export async function connect() {
  try {
     await mongoose.connect(process.env.MONGO_URI!) 
      const connection=mongoose.connection;
      connection.on('connected',()=>{
        console.log("Connected to database ")
      })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    NextResponse.json({message:error.message},{status:500})
  }
}