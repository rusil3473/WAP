import { NextRequest, NextResponse } from "next/server";
import { updateOwnerBookingStatus } from "@/server/services/owner-service";

export async function PUT(req: NextRequest) {
  try {
    const reqBody = (await req.json()) as {
      bookingId: string;
      status: "pending" | "confirmed" | "completed" | "cancelled";
    };

    const result = await updateOwnerBookingStatus(reqBody.bookingId, reqBody.status);
    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return NextResponse.json({ message: "Error while updating booking status" }, { status: 500 });
  }
}
