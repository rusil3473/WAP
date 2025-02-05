import Booking from "@/models/BookingModel";
import Warehouse from "@/models/WarehouseModel";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
  try {
    const reqBody=await req.json();
    const {_id}=reqBody;
    await Warehouse.findByIdAndDelete(_id);
    await Booking.updateMany({warehouseId:_id},{$set:{status:"cancelled"}})
    return NextResponse.json({message:"Warehouse is deleted successfully "},{status:200})
  } catch (error) {
    console.log(error)
    return NextResponse.json({messgage:"Error while deleting warehouse"},{status:500})
  }
}