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
    photos: [],
  });

  const params = useParams();
  const router = useRouter();

  const fetchWarehouseDetails = async (_id: string) => {
    try {
      const res = await axios.post("/api/users/getWarehouse", { _id });
      setWarehouse(res.data.Warehouse);
    } catch (error) {
      toast.error("Error fetching warehouse details:")
      console.error("Error fetching warehouse details:", error);
    }
  };

  useEffect(() => {
    if (typeof params.id === "string") {
      fetchWarehouseDetails(params.id);
    }
  }, [params.id]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-3xl font-semibold">{warehouse.name}</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/search")}
              className="text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Search
            </button>
            <button
              onClick={() => router.push("/dashboard/customer")}
              className="text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Profile
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-6">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Warehouse Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-700">
                <strong>address:</strong> {warehouse.address}
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
            </div>

            <div className="flex flex-col gap-4">
              {/* Add Image Section */}
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

              {/* Action Buttons */}
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
