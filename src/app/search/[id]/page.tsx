"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function WarehouseDetailsPage() {
  const [warehouse, setWarehouse] = useState({
    _id: "",
    name: "",
    address: "",
    capacity: "",
    pricePerMonth: "",
    facilities: "",
    status: "",
    startDate: "",
    endDate: "",
    photos: [],
  });
  const [menuOpen,setMenuOpen]=useState(false);
  const params = useParams();
  const router = useRouter();

  const fetchWarehouseDetails = async (_id: string) => {
    try {
      const res = await axios.post("/api/users/getWarehouse", { _id });
      setWarehouse(res.data.Warehouse);
    } catch (error) {
      toast.error("Error fetching warehouse details:");
      console.error("Error fetching warehouse details:", error);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "N/A";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    if (typeof params.id === "string") {
      fetchWarehouseDetails(params.id);
    }
  }, [params.id]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 text-blue-700">
      <header className="sticky top-0 bg-white shadow-md z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-700">
            Warehouse Aggregation
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
                onClick={() => router.push("/search")}
                className="block md:inline px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
              >
                Search
              </button>
              <button
                onClick={() => router.push("//bookings")}
                className="block md:inline px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
              >
                Booking
              </button>

              <button
                onClick={() => router.push("/payments")}
                className="block md:inline px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
              >
                Payments
              </button>
              <button
                onClick={() => router.push("/support")}
                className="block md:inline px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
              >
                Support
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

      <main className="container mx-auto py-8 px-6">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl text-black font-semibold mb-6">Warehouse Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-700">
                <strong>Address:</strong> {warehouse.address}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Capacity:</strong> {warehouse.capacity} sq. ft.
              </p>
              <p className="text-sm text-gray-700">
                <strong>Price per Month:</strong> ₹{warehouse.pricePerMonth}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Facilities:</strong> {warehouse.facilities}
              </p>
              <p className={`text-sm ${warehouse.status === "available" ? "text-green-600" : "text-red-600"}`}>
                <strong>Status:</strong> {warehouse.status}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Start Date:</strong> {formatDate(warehouse.startDate)}
              </p>
              <p className="text-sm text-gray-700">
                <strong>End Date:</strong> {formatDate(warehouse.endDate)}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/*warehouse.photos.length > 0 ? (
                <img
                  src={warehouse.photos[0]}
                  alt="Warehouse"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              ) : (
                <div className="bg-gray-200 w-full h-64 rounded-lg flex items-center justify-center text-gray-600">
                  No Photos Available
                </div>
              )*/}

              <button
                onClick={() => router.push(`/book/${warehouse._id}`)}
                className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Book Now
              </button>
              <button
                onClick={() => alert("Saving warehouse for later...")}
                className="w-full py-3 text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Save for Later
              </button>
              <button
                onClick={() => alert("Contacting the owner...")}
                className="w-full py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-200"
              >
                Contact Owner
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 text-center py-4">
        <p className="text-gray-700">© 2025 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
}
