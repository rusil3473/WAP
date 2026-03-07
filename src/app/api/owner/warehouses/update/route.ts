import { NextRequest, NextResponse } from "next/server";
import { updateOwnerWarehouse } from "@/server/services/owner-service";

export async function PUT(req: NextRequest) {
  try {
    const reqBody = (await req.json()) as {
      _id: string;
      name: string;
      address: string;
      capacity: number;
      pricePerMonth: number;
      facilities: string;
      startDate: string;
      endDate: string;
      photos: string;
      status: string;
    };

    const result = await updateOwnerWarehouse({
      id: reqBody._id,
      name: reqBody.name,
      address: reqBody.address,
      capacity: reqBody.capacity,
      pricePerMonth: reqBody.pricePerMonth,
      facilities: reqBody.facilities,
      startDate: reqBody.startDate,
      endDate: reqBody.endDate,
      photos: reqBody.photos,
      status: reqBody.status,
    });

    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error("Error updating warehouse:", error);
    return NextResponse.json({ message: "Error while updating warehouse" }, { status: 500 });
  }
}
