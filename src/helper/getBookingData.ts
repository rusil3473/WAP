import Booking from "@/models/BookingModel";
import {connect} from "@/dbConfig/db"
connect();

type bookingObj={
    _id:string,
    customerId:string,
    ownerId:string,
    warehouseId:string,
    bookingDate:Date,
    startDate:Date,
    endDate:Date,
    status:string,
    totalAmount:number,
    paymentStatus:string,
    storageDetails:string,

}


export default async function getBookingData(_id: string) {
  try {
    const Bookings:bookingObj[]=await Booking.find({_id});
    return Bookings;
  } catch (error) {
    console.log(error)
    return -1;
  }
}