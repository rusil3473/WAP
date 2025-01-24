import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import getUserData from "@/helper/getUserData";
import getBookingData from "@/helper/getBookingData";
import getWarehouseData from "@/helper/getWarehouseData";



export async function GET() {
  try {
    const cookie = await cookies();
    const token = cookie.get("token")?.value;
    if (!token) {
      return NextResponse.json({ messgae: "Error while getting token " }, { status: 400 })
    }
    const tokenData = jwt.verify(token, process.env.SECRET!);
    if (typeof tokenData !== "object") {
      return NextResponse.json({ messgae: "Error while getting token " }, { status: 400 })
    }
   
    const [user, bookings,Warehouses] = await Promise.all([
      getUserData(tokenData._id),
      getBookingData(tokenData._id,"owner"),
      getWarehouseData(tokenData._id)
    ]);
    if (!Array.isArray(bookings) || !Array.isArray(Warehouses)) {
      return NextResponse.json(
        { message: "Error retrieving bookings data" },
        { status: 500 }
      );
    }
    const activeBooking = bookings.filter((obj) => {
      return (
        obj.status === "confirmed" &&
        obj.startDate < new Date() &&
        obj.endDate > new Date()
      );
    }).length;
    const totalWarehouses=Warehouses.length;
    const totalPayment = bookings.reduce((sum, booking) => {
      if(booking.status==="confirmed"){
        return (sum + booking.totalAmount)
      }
      return sum;
    }, 0);


    const data = {
      user, totalWarehouses,activeBooking, totalPayment
    }

    return NextResponse.json({ message: "Success", info: data }, { status: 200 })

  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Error while geting user data " }, { status: 500 })
  }
} 