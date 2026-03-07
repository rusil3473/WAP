import { NextRequest, NextResponse } from "next/server";
import { deleteOwnerWarehouse } from "@/server/services/owner-service";

export async function POST(req: NextRequest) {
  try {
    const reqBody = (await req.json()) as { _id?: string };
    const warehouseId = reqBody._id;

    if (!warehouseId) {
      return NextResponse.json({ message: "Warehouse id is required" }, { status: 400 });
    }

    const result = await deleteOwnerWarehouse(warehouseId);
    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error("Error deleting warehouse:", error);
    return NextResponse.json({ message: "Error while deleting warehouse" }, { status: 500 });
  }
}
