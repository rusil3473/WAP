"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import toast from "react-hot-toast";


interface CookieStore {
  [key: string]: string;
}

export default function BookNowPage() {
  const [loading,setIsLoading]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const [wareHouseData, setWarehousData] = useState({
    customerId: "",
    ownerId: "",
    pricePerMonth: "",
    startDate: new Date(),
    endDate: new Date()
  })
  const param = useParams();
  const getWarehouseData = async () => {
    try {
      const res = await axios.post("/api/users/getWarehouse", { _id: param.id })
      const data = res.data.Warehouse;
      setWarehousData({
        ...wareHouseData,
        ownerId: data.owner,
        pricePerMonth: data.pricePerMonth,
        startDate: data.startDate,
        endDate: data.endDate
      })
      setIsLoading(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
      console.log(error)
    }
  }
  const getUserInfo = async (token: string) => {
    try {

      const res = await axios.post("/api/users/getUserInfo", { token });
      const data = res.data.data;
      setWarehousData((pre) => {
        return { ...pre, customerId: data._id }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response.data.message)
      console.log(error)
    }
  }
  useEffect(() => {
    try {
      const cookies = document.cookie.split(';').reduce<CookieStore>((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      
      const token = cookies['token'];
      if (token) {
        getWarehouseData();
        getUserInfo(token);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Cookie parsing error:", error);
      setIsLoading(false);
    }

    
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
      const totalAmount = (endDate.getMonth() - startDate.getMonth()) * Number(wareHouseData.pricePerMonth);
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
      await axios.post("/api/users/newBooking", {
        customerId: wareHouseData.customerId,
        ownerId: wareHouseData.ownerId,
        warehouseId: param.id,
        bookingDate: new Date(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalAmount: formData.totalPrice,
        storageDetails: formData.storageDetails
      })
      router.push("/dashboard/customer")

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
      console.log(error)
    }

  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <header className="sticky top-0 bg-white shadow-md z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-700">
              Book Warehouse
            </h1>
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition"
                aria-expanded={menuOpen}
                aria-label="Toggle menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
            <div
              className={`md:flex md:items-center md:space-x-4 ${
                menuOpen ? "block" : "hidden"
              } md:block absolute md:static top-full left-0 w-full md:w-auto bg-white shadow-md md:shadow-none z-10`}
            >
              <button
                onClick={() => router.push("/dashboard/customer")}
                className="block md:inline px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push("/search")}
                className="block md:inline px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
              >
                Search
              </button>
              <button
                onClick={() => router.push("/profile")}
                className="block md:inline px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
              >
                Profile
              </button>
            </div>
          </div>
        </nav>
      </header>
  
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-6 text-center">
            Booking Form
          </h2>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
  
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
  
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholderText="Select start date"
            />
          </div>
  
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholderText="Select end date"
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Total Price</label>
            <p className="text-lg font-bold text-blue-700">₹{formData.totalPrice}</p>
          </div>
  
          <div className="mb-4">
            <label htmlFor="storageDetails" className="block text-sm font-medium text-gray-700">
              What will be stored?
            </label>
            <textarea
              id="storageDetails"
              name="storageDetails"
              value={formData.storageDetails}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Provide details about the items to be stored..."
              required
            />
          </div>
  
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium shadow-lg transition"
          >
            Confirm Booking
          </button>
        </form>
      </main>
  
      <footer className="bg-blue-600 text-white text-center py-4 mt-auto">
        <p>© 2025 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
  


}
