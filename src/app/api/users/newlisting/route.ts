import { NextRequest, NextResponse } from "next/server";
import Warehouse from "@/models/Warehouse";
import { connect } from "@/dbConfig/db"

connect()

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { name, owner, address, capacity, pricePerDay, pricePerMonth, facilities, startDate, endDate, photos, status } = reqBody;
    const warehouse=await Warehouse.findOne({name}) || await Warehouse.findOne({address});
    if(warehouse){
      return NextResponse.json({messgae:"Warehouse with same name or address already exist"},{status:400})
    }

    await Warehouse.create({
      name, owner, address, capacity, pricePerDay, pricePerMonth, facilities, startDate, endDate, photos, status
    });

    return NextResponse.json({ message: "Success " }, { status: 201 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Error while adding the warehouse to list " }, { status: 500 })
  }
}