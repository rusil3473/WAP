"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NavBar } from "@/app/components/NavBar";

type Warehouse = {
  _id: string;
  name: string;
  address: string;
  capacity: string;
  pricePerMonth: string;
  facilities: string;
  status: string;
  startDate: string;
  endDate: string;
  photos: string[];
};

export default function WarehouseDetailsPage() {
  const [warehouse, setWarehouse] = useState<Warehouse>({
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
  const params = useParams();
  const router = useRouter();

  const fetchWarehouseDetails = async (warehouseId: string) => {
    try {
      const response = await axios.post("/api/customer/warehouse", { _id: warehouseId });
      setWarehouse(response.data.Warehouse);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Error fetching warehouse details");
      } else {
        toast.error("Error fetching warehouse details");
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return "N/A";
    }

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    if (typeof params.id === "string") {
      void fetchWarehouseDetails(params.id);
    }
  }, [params.id]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 text-blue-700">
      <NavBar landing={false} role="Customer" />

      <main className="container mx-auto px-6 py-8">
        <div className="rounded-lg bg-white p-8 shadow-xl">
          <h2 className="mb-6 text-2xl font-semibold text-black">Warehouse Details</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-700">
                <strong>Name:</strong> {warehouse.name}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Address:</strong> {warehouse.address}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Capacity:</strong> {warehouse.capacity} sq. ft.
              </p>
              <p className="text-sm text-gray-700">
                <strong>Price per Month:</strong> Rs. {warehouse.pricePerMonth}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Facilities:</strong> {warehouse.facilities}
              </p>
              <p
                className={`text-sm ${
                  warehouse.status === "available" ? "text-green-600" : "text-red-600"
                }`}
              >
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
              <button
                type="button"
                onClick={() => router.push(`/customer/book/${warehouse._id}`)}
                className="w-full rounded-lg bg-blue-600 py-3 text-white transition duration-200 hover:bg-blue-700"
              >
                Book Now
              </button>
              <button
                type="button"
                onClick={() => toast("Saved for later")}
                className="w-full rounded-lg bg-gray-500 py-3 text-white transition duration-200 hover:bg-gray-600"
              >
                Save for Later
              </button>
              <button
                type="button"
                onClick={() => toast("Owner contact flow will be added")}
                className="w-full rounded-lg bg-red-600 py-3 text-white transition duration-200 hover:bg-red-700"
              >
                Contact Owner
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-4 text-center">
        <p className="text-gray-700">&copy; 2026 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
}
