import { NextRequest, NextResponse } from "next/server";
import { createOwnerWarehouse, getOwnerWarehouses } from "@/server/services/owner-service";
import { getAuthenticatedProfileFromToken, getTokenFromCookie } from "@/server/services/session-service";

export async function GET() {
  try {
    const token = await getTokenFromCookie();
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

export async function POST(req: NextRequest) {
  try {
    const token = await getTokenFromCookie();
    if (!token) {
      return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
    }

    const profile = await getAuthenticatedProfileFromToken(token);
    if (!profile?._id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    const reqBody = (await req.json()) as {
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

    const result = await createOwnerWarehouse({
      ...reqBody,
      owner: profile._id,
    });
    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error("Error creating warehouse:", error);
    return NextResponse.json({ message: "Error while creating warehouse" }, { status: 500 });
  }
}
