import { NextRequest, NextResponse } from "next/server";
import { getOwnerWarehouses } from "@/server/services/owner-service";
import { getWarehouseById } from "@/server/services/warehouse-service";
import { getAuthenticatedProfileFromToken, getTokenFromCookie } from "@/server/services/session-service";

export async function POST(req: NextRequest) {
  try {
    const reqBody = (await req.json()) as { token?: string; _id?: string };
    const warehouseId = reqBody._id;

    if (warehouseId) {
      const warehouse = await getWarehouseById(warehouseId);
      if (!warehouse) {
        return NextResponse.json({ message: "Warehouse not found" }, { status: 404 });
      }
      return NextResponse.json(
        { message: "Warehouse fetched", Warehouse: warehouse },
        { status: 200 },
      );
    }

    const token = reqBody.token ?? (await getTokenFromCookie());
    if (!token) {
      return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
    }

    const profile = await getAuthenticatedProfileFromToken(token);
    if (!profile?._id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    const warehouses = await getOwnerWarehouses(profile._id);
    return NextResponse.json(
      { message: "Owner warehouses fetched", Warehouse: warehouses },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error getting owner warehouses:", error);
    return NextResponse.json(
      { message: "Error while fetching warehouse data" },
      { status: 500 },
    );
  }
}
