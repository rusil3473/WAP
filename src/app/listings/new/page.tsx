"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import DatePicker from "react-datepicker";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NewWarehousePage() {
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    address: '',
    capacity: '',
    pricePerMonth: '',
    facilities: "",
    startDate: new Date(),
    endDate: new Date(),
    photos: "",
    status: 'available',
  });

  const router = useRouter();

  const handleDateChange = (date: Date | null, field: string) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        [field]: date,
      }));
    }
  };
  const[menuOpen,setMenuOpen]=useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/users/newlisting", formData);
      router.push("/listings");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      toast.error(error.message)
      console.log(error);
    }
  };

  const getOwner = async (token: string) => {
    try {
      const res = await axios.post("/api/users/getUserInfo", { token });
      setFormData((prev) => ({
        ...prev,
        owner: res.data.data._id,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = document.cookie.split("=")[1];
    getOwner(token);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-3xl font-semibold">Create New Warehouse</h1>
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
              className={`z-10 absolute left-0 top-full w-auto bg-blue-600 md:static md:w-auto md:flex md:gap-4 md:items-center ${menuOpen ? "block" : "hidden"
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

      <main className="container mx-auto py-8 px-6">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl hover:scale-105 transform transition-all duration-300">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">

            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Warehouse Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="owner" className="block text-sm font-medium text-gray-700">Owner</label>
              <input
                type="text"
                id="owner"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
                disabled
              />
            </div>

            <div className="mb-6">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter the full address"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity (sq. ft.)</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              />
            </div>

            

            <div className="mb-6">
              <label htmlFor="pricePerMonth" className="block text-sm font-medium text-gray-700">Price per Month</label>
              <input
                type="number"
                id="pricePerMonth"
                name="pricePerMonth"
                value={formData.pricePerMonth}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="facilities" className="block text-sm font-medium text-gray-700">Facilities</label>
              <input
                type="text"
                id="facilities"
                name="facilities"
                value={formData.facilities}
                onChange={handleChange}
                placeholder="e.g. CCTV, Temperature Control"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
              <small className="text-gray-500">Separate facilities with commas</small>
            </div>

            <div className="mb-6">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
              <DatePicker
                selected={formData.startDate}
                onChange={(date) => handleDateChange(date, "startDate")}
                dateFormat="yyyy-MM-dd"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
              <DatePicker
                selected={formData.endDate}
                onChange={(date) => handleDateChange(date, "endDate")}
                dateFormat="yyyy-MM-dd"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="photos" className="block text-sm font-medium text-gray-700">Photos (Image URLs)</label>
              <input
                type="text"
                id="photos"
                name="photos"
                value={formData.photos}
                onChange={handleChange}
                placeholder="e.g. https://example.com/photo1.jpg"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
              <small className="text-gray-500">Separate URLs with commas</small>
            </div>

            <div className="mb-6">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              >
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="mb-6 text-center">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                Create Listing
              </button>
            </div>

          </div>
        </form>
      </main>
    </div>
  );
}
