import { NextRequest, NextResponse } from "next/server";
import { getWarehouseForCustomer } from "@/server/services/customer-service";

export async function POST(req: NextRequest) {
  try {
    const reqBody = (await req.json()) as { _id?: string };
    const warehouseId = reqBody._id;

    if (!warehouseId) {
      return NextResponse.json({ message: "Warehouse id is required" }, { status: 400 });
    }

    const warehouse = await getWarehouseForCustomer(warehouseId);
    if (!warehouse) {
      return NextResponse.json({ message: "Warehouse not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Warehouse fetched", Warehouse: warehouse },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error getting warehouse:", error);
    return NextResponse.json(
      { message: "Error while fetching warehouse data" },
      { status: 500 },
    );
  }
}
