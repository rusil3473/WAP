"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";


export default function BookNowPage() {


  const [wareHouseData, setWarehousData] = useState({
    customerId:"",
    ownerId:"",
    pricePerMonth: "",
    startDate: new Date(),
    endDate: new Date()
  })
  const param = useParams();
  const getWarehouseData = async () => {
    try {
      const res = await axios.post("/api/users/getWarehouse", { _id: param.id })
      const data = res.data.Warehouse;
      setWarehousData({...wareHouseData,
        ownerId:data.owner,
        pricePerMonth: data.pricePerMonth,
        startDate: data.startDate,
        endDate: data.endDate
      })
    } catch (error) {
      console.log(error)
    }
  }
   const getUserInfo=async(token:string)=>{
    try {
     
      const res=await axios.post("/api/users/getUserInfo",{token});
      const data=res.data.data;
      setWarehousData((pre)=>{
        return {...pre,customerId:data._id}
      })
    } catch (error) {
      console.log(error)
    }
  } 
  useEffect(() => {
    const token =document.cookie.split("=")[1]
    
    getWarehouseData();
     getUserInfo(token); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [formData, setFormData] = useState({
    userName: "",
    contactInfo: "",
    startDate: null,
    endDate: null,
    pricePerDay: 1000,
    totalPrice: 0,
    paymentMethod: "",
    storageDetails: "",
  });
  const router = useRouter();
  const warehouseStartDate = wareHouseData.startDate;
  const warehouseEndDate = wareHouseData.endDate;

  const calculateTotalPrice = (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      const totalAmount =(endDate.getMonth()-startDate.getMonth())*Number(wareHouseData.pricePerMonth);
      return totalAmount
    }
    return 0;
  };

  const handleDateChange = (name: string, value: Date | null) => {
    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: value };
      return {
        ...updatedForm,
        totalPrice: calculateTotalPrice(updatedForm.startDate, updatedForm.endDate),
      };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/api/users/newBooking",{
        customerId:wareHouseData.customerId,
        ownerId:wareHouseData.ownerId,
        warehouseId:param.id,
        bookingDate:new Date(),
        startDate:formData.startDate,
        endDate:formData.endDate,
        totalAmount:formData.totalPrice,
        storageDetails:formData.storageDetails
      })
      router.push("/dashboard/user")
      
    } catch (error) {
      console.log(error)
    }

  };
 

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">Book Warehouse</h1>
          <nav className="space-x-4">
            <button
              onClick={() => router.push("/dashboard/user")}
              className="px-4 py-2  text-white rounded-lg hover:bg-blue-700"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push("/search")}
              className="px-4 py-2  text-white rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="px-4 py-2  text-white rounded-lg hover:bg-blue-700"
            >
              Profile
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-8 px-4 md:px-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto"
        >
          <h2 className="text-xl font-bold mb-6">Booking Form</h2>
          {/* User Name */}
          <div className="mb-4">
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Contact Info */}
          <div className="mb-4">
            <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">
              Contact Information
            </label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Start Date */}
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) => handleDateChange("startDate", date)}
              minDate={warehouseStartDate}
              maxDate={warehouseEndDate}
              dateFormat="yyyy-MM-dd"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Select start date"
            />
          </div>

          {/* End Date */}
          <div className="mb-4">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <DatePicker
              selected={formData.endDate}
              onChange={(date) => handleDateChange("endDate", date)}
              minDate={formData.startDate || warehouseStartDate}
              maxDate={warehouseEndDate}
              dateFormat="yyyy-MM-dd"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Select end date"
            />
          </div>

          {/* Total Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Total Price</label>
            <p className="text-lg font-bold text-blue-700">₹{formData.totalPrice}</p>
          </div>



          {/* Storage Details */}
          <div className="mb-4">
            <label htmlFor="storageDetails" className="block text-sm font-medium text-gray-700">
              What will be stored?
            </label>
            <textarea
              id="storageDetails"
              name="storageDetails"
              value={formData.storageDetails}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Provide details about the items to be stored..."
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 font-medium"
          >
            Confirm Booking
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="bg-gray-300 text-center py-4">
        <p className="text-gray-700">© 2025 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
}
