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
export default async function getBookingData(_id: string,type:string) {
  try {
    if(type==="customer"){
      const Bookings:bookingObj[]=await Booking.find({customerId:_id});
      return Bookings;
    }
    else if(type==="owner"){
      const Bookings:bookingObj[]=await Booking.find({ownerId:_id});
      return Bookings;
    }
    else{
      return "Wrong Type"
    }
  } catch (error) {
    console.log(error)
    return -1;
  }
}