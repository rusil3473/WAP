"use client";
import axios from "axios";
import Link from "next/link"
import { useParams,useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditWarehousePage() {
  const [formData, setFormData] = useState({
    _id:"",
    name: "",
    address: "",
    capacity: "",
    pricePerMonth: "",
    facilities: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    photos: "",
    status: "available",
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const router=useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const param = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put("/api/users/editlisting",formData)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.respnse.data.message)
      
    }
  };

  const getWarehouseData = async () => {
    try {
      const warehouse=await axios.post("/api/users/getWarehouse", { _id: param.id })
      const warehouseData=warehouse.data.Warehouse;
      const {_id,name,address,capacity,pricePerMonth,facilities,startDate,endDate,photos,status}=warehouseData;
      setFormData({_id,name,address,capacity,pricePerMonth,facilities,startDate,endDate,photos,status})
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response.data.message)
      console.log(error)
    }
  }

  useEffect(() => {

    getWarehouseData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Edit Warehouse</h1>
          <nav className="relative bg-blue-600 text-white">
            {/* Toggle Button for Small Devices */}
            <button
              className="block md:hidden text-white text-2xl px-4 py-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>

            {/* Navigation Links */}
            <div
              className={`absolute left-0 top-full w-auto bg-blue-600 md:static md:w-auto md:flex md:gap-4 md:items-center ${menuOpen ? "block" : "hidden"
                }`}
              style={{
                left: menuOpen ? "0" : "-100%", // Moves the menu to the left when closed
              }}
            >
              <Link
                href="/search"
                className="block md:inline px-4 py-2 hover:bg-blue-700 text-lg"
              >
                Search
              </Link>
              <Link
                href="/listings"
                className="block md:inline px-4 py-2 hover:bg-blue-700 text-lg"
              >
                My Listings
              </Link>
              <Link
                href="/bookings"
                className="block md:inline px-4 py-2 hover:bg-blue-700 text-lg"
              >
                Bookings
              </Link>
              <Link
                href="/earnings"
                className="block md:inline px-4 py-2 hover:bg-blue-700 text-lg"
              >
                Earnings
              </Link>
              <Link
                href="/support"
                className="block md:inline px-4 py-2 hover:bg-blue-700 text-lg"
              >
                Support
              </Link>
            </div>
          </nav>
        </div>
      </header>


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
      <main className="flex-grow container mx-auto py-8 px-6">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md hover:scale-105 transition-all">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            <div className="col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Warehouse Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition duration-300"
                required
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition duration-300"
                required
              />
            </div>

            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                Capacity (sq. ft.)
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full p-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition duration-300"
                required
              />
            </div>


            <div>
              <label htmlFor="pricePerMonth" className="block text-sm font-medium text-gray-700 mb-2">
                Price per Month
              </label>
              <input
                type="number"
                id="pricePerMonth"
                name="pricePerMonth"
                value={formData.pricePerMonth}
                onChange={handleChange}
                className="w-full p-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition duration-300"
                required
              />
            </div>

            <div>
              <label htmlFor="facilities" className="block text-sm font-medium text-gray-700 mb-2">
                Facilities
              </label>
              <input
                type="text"
                id="facilities"
                name="facilities"
                value={formData.facilities}
                onChange={handleChange}
                className="w-full p-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition duration-300"
              />
              <small className="text-gray-500 text-xs">Separate with commas</small>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition duration-300"
                required
              >
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="col-span-2 text-center mt-6">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Update Warehouse
              </button>
            </div>
          </div>
        </form>
      </main>

      <footer className="bg-gray-300 text-center py-4">
        <p className="text-gray-700 text-xs">© 2025 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
}
