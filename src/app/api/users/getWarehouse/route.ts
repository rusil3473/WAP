import Warehouse from "@/models/Warehouse";
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connect } from "@/dbConfig/db"
connect()


export async function POST(req:NextRequest){
  try {
    const reqBody=await req.json();
    const {token}=reqBody;
    if(!token){
      const allWarehouses=await Warehouse.find({status:"available"});
      return NextResponse.json({message:"All warehouses with status active are sent ",Warehouse:allWarehouses},{status:200})
    }
    const info=jwt.verify(token,process.env.SECERET!)
    if(typeof info ==="string" || !info){
      return NextResponse.json({message:"invalid Token "},{status:200})
    }
    const {_id}=info;
    
    const warehouseById=await Warehouse.findById(_id);
    return NextResponse.json({message:"All warehouse with given id are sent ",Warehouse:warehouseById},{status:200})
    
  } catch (error) {
    console.log(error)
    return NextResponse.json({messgae:"Error while getting data"},{status:500})
  }

}