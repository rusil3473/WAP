import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import getUserData from "@/helper/getUserData";
import jwt from "jsonwebtoken"
import Booking from "@/models/BookingModel";
export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized user" }, { status: 400 });
        }
        const decodedToken = jwt.decode(token);
        if (!decodedToken || typeof decodedToken !== 'object' || !('_id' in decodedToken)) {
            return NextResponse.json({ message: "Invalid token" }, { status: 400 });
        }
        const { _id } = decodedToken as { _id: string };
        const user = await getUserData(_id);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized user" }, { status: 400 });
        }
        if(user.role==="cutomer"){
            const bookings=await Booking.find({customerId:user._id});
            return NextResponse.json({message:"sent data",data:bookings},{status:200});
        }
        if(user.role==="owner"){
            const bookings=await Booking.find({ownerId:user._id});
            return NextResponse.json({message:"sent data",data:bookings},{status:200});
        }
        return NextResponse.json({message:"Looks like your role is not decide first fix that"},{status:400})
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error while geting booking Data" }, { status: 500 })
    }
}