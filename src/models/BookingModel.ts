import mongoose  from 'mongoose'
const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer', 
      required: true
    },
    ownerId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true
    },
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true
    },
    bookingDate: {
      type: Date,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    storageDetails:{
      type:String,
      default:""
    }
  }
);
// Create a model for the booking schema
const Booking =mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;
