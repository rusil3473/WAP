import Booking from "@/models/BookingModel";
import { NextRequest, NextResponse } from "next/server";



export async function PUT(req:NextRequest){
    try {
        const reqBody=await req.json();
        const {bookingId:_id,status}=reqBody;
        await Booking.findByIdAndUpdate(_id,{status});
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({messsgae:"Error ehile updating staus"},{status:500})
    }
}