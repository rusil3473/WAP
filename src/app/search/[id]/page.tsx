"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
export default function WarehouseDetailsPage() {
  const [warehouse, setWarehouses] = useState({
    _id: "",
    name: "",
    location: "",
    capacity: "",
    pricePerDay: "",
    facilities: "",
    pricePerMonth: "",
    status: "",
    photos: [], // For photos if needed
  });

  const params = useParams();

  const fetchWarehouses = async (_id: string) => {
    try {
      const res = await axios.post("/api/users/getWarehouse", { _id });
      setWarehouses(res.data.Warehouse);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  useEffect(() => {
    if (typeof params.id === "string") {
      const _id = params.id;
      fetchWarehouses(_id);
    }
  }, [params.id]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto py-4 px-6 flex flex-row items-center justify-between">
          <h1 className="text-3xl font-bold ">{warehouse.name}</h1>
          <Link href="/search" className="hover:underline ">
              Search
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-8 px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Gallery Section */}
          <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md">
            {warehouse.photos.length > 0 ? (
              <img
                src={warehouse.photos[0]}
                alt="Warehouse"
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-700">No Photos Available</span>
              </div>
            )}
          </div>

          {/* Warehouse Details Section */}
          <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Warehouse Details</h2>
            <p className="text-gray-600 mb-2">
              <strong>Location:</strong> {warehouse.location}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Capacity:</strong> {warehouse.capacity} sq. ft.
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Price per Day:</strong> ₹{warehouse.pricePerDay}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Price per Month:</strong> ₹{warehouse.pricePerMonth}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Facilities:</strong> {warehouse.facilities}
            </p>
            <p
              className={`text-gray-600 mb-2 ${
                warehouse.status === "available"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              <strong>Status:</strong> {warehouse.status}
            </p>

            {/* Action Buttons */}
            <div className="mt-8">
              <button
                className="w-full px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 mb-4"
                onClick={() => alert("Booking warehouse...")}
              >
                Book Now
              </button>
              <button
                className="w-full px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 mb-4"
                onClick={() => alert("Saving warehouse...")}
              >
                Save for Later
              </button>
              <button
                className="w-full px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600"
                onClick={() => alert("Contacting owner...")}
              >
                Contact Owner
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-300 text-center py-4">
        <p className="text-gray-700">© 2025 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
}
