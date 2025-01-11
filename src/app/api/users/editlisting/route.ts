import Warehouse from "@/models/Warehouse";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/db";

connect();

export async function PUT(req: NextRequest) {
  try {
    const reqBody = await req.json();  
    const {_id,name, address, capacity, pricePerMonth, facilities, startDate, endDate, photos, status } = reqBody;

    const warehouse = await Warehouse.findByIdAndUpdate(_id, {
      name,
      address,
      capacity,
      pricePerMonth,
      facilities,
      startDate,
      endDate,
      photos,
      status
    });

    if (!warehouse) {
      return NextResponse.json({ message: "Warehouse not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Warehouse updated successfully", data: warehouse }, { status: 200 });
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error while changing the data" }, { status: 500 });
  }
}
