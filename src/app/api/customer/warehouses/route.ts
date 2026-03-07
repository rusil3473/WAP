import { NextResponse } from "next/server";
import { getCustomerWarehouses } from "@/server/services/customer-service";

export async function GET() {
  try {
    const warehouses = await getCustomerWarehouses();
    return NextResponse.json(
      { message: "Available warehouses fetched", Warehouse: warehouses },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching available warehouses:", error);
    return NextResponse.json({ message: "Failed to fetch warehouses" }, { status: 500 });
  }
}
