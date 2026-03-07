import { NextRequest, NextResponse } from "next/server";
import { createCustomerBooking } from "@/server/services/customer-service";

export async function POST(req: NextRequest) {
  try {
    const reqBody = (await req.json()) as {
      customerId: string;
      ownerId: string;
      warehouseId: string;
      warehouseName: string;
      bookingDate: string;
      startDate: string;
      endDate: string;
      totalAmount: number;
      storageDetails: string;
    };

    const result = await createCustomerBooking(reqBody);
    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ message: "Error creating a new booking" }, { status: 500 });
  }
}
