import Booking from "@/models/BookingModel";
import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/db"
connect()
export async function POST(req:NextRequest){
  try {
    const reqBody=await req.json();
    const {customerId,ownerId,warehouseId,bookingDate,startDate,endDate,totalAmount,storageDetails}=reqBody;
    const isAvailable=await Booking.findOne({warehouseId}) 
    if(isAvailable?.status === "confirmed"){
      return NextResponse.json({messgae:"Warehouse is already occupied try diffrent one "},{status:200})
    }
    await Booking.create({customerId,ownerId,warehouseId,bookingDate,startDate,endDate,totalAmount,storageDetails})
    return NextResponse.json({message:"Sent a request to warehouse owner "},{status:200})
  } catch (error) {
    console.log(error)
    return NextResponse.json({message:"error creating a new bokking "},{status:500})
  }
}
