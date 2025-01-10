import Warehouse from "@/models/Warehouse";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/db";

connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { id } = reqBody;
    const warehouse = await Warehouse.findById(id);

    if (!warehouse) {
      return NextResponse.json({ message: "Warehouse not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Data sent successfully", data: warehouse }, { status: 200 });

  }

  catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error while getting data of this warehouse" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const reqBody = await req.json();  // Fetch the body once
    console.log(reqBody);

    const { id, name, address, capacity, pricePerDay, pricePerMonth, facilities, startDate, endDate, photos, status } = reqBody;

    const warehouse = await Warehouse.findByIdAndUpdate(id, {
      name,
      location: address,
      capacity,
      pricePerDay,
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
