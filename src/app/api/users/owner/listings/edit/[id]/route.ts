import Warehouse from "@/models/Warehouse";
import {  NextResponse } from "next/server"
import {connect} from "@/dbConfig/db"


connect()
export async function GET(req: Request, { params }: { params: { id: string } }) {

  try {

    const { id } = await params;
    const warehouse = await Warehouse.findById(id);

    return NextResponse.json({ message: "Data sent successfully", data: warehouse }, { status: 200 }
    );
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Error while getting data of this warehouse " }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const p=await params;
    console.log(p)
    const {name,address,capacity,pricePerDay,pricePerMonth,facilities,startDate,endDate,photos,status}=await req.json();
    const warehouse=await Warehouse.findByIdAndUpdate(p.id,{name,location:address,capacity,pricePerDay,pricePerMonth,facilities,startDate,endDate,photos,status});
    

    return NextResponse.json({ message: "Warehouse updated successfully", data: warehouse },{ status: 200 }
    );
  } catch (error) {
    console.log(error)
    return NextResponse.json({message:"Error while changing the data"},{status:500})
  }
}