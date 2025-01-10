import mongoose  from "mongoose";
const warehouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    location: {
      type:String,
      required:true
    },
    capacity: {
      type: Number, // Capacity in square feet or cubic meters
      required: true,
    },
    pricePerMonth: {
      type: Number, // Price per month
      required: true,
    },
    facilities: {
      type:String, // List of facilities (e.g., CCTV, temperature control)
      default: "",
    },
    startDate:{
      type:Date,
      requied:true
    },
    endDate:{
      type:Date,
      requied:true
    },
    photos: {
      type: String, // Array of image URLs
      default: "",
    },
    status: {
      type: String,
      enum: ["available", "booked", "inactive"],
      default: "available",
    },
  },

);

const Warehouse =
  mongoose.models.Warehouse || mongoose.model("Warehouse", warehouseSchema);

export default Warehouse;
