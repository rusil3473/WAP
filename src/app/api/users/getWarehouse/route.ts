import Warehouse from "@/models/Warehouse";
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connect } from "@/dbConfig/db"
connect()


export async function POST(req:NextRequest){
  try {
    const reqBody=await req.json();
    const {token}=reqBody; // this is for owner to get all warehouses
    const {_id}=reqBody; //this is for user to find data of single warehouse with id _id

    // Below is for user to serch the the warehouse from list of all warehouses 
    if(!token && !_id){
      const allWarehouses=await Warehouse.find({status:"available"});
      return NextResponse.json({message:"All warehouses with status active are sent ",Warehouse:allWarehouses},{status:200})
    }
    if(_id){
      const warehouseData=await Warehouse.findById(_id);
      return NextResponse.json({message:"ware house with id _id is sent  ",Warehouse:warehouseData},{status:200})
    }
    const info=jwt.verify(token,process.env.SECRET!)
    if(typeof info ==="string" || !info){
      return NextResponse.json({message:"invalid Token "},{status:200})
    }

    const {id}=info;
    const warehouseById=await Warehouse.find({owner:id});
    return NextResponse.json({message:"All warehouse with given id are sent ",Warehouse:warehouseById},{status:200})
    
  }catch (error) {
    console.log(error)
    return NextResponse.json({messgae:"Error while getting data"},{status:500})
  }


}