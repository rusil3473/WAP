"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NavBar } from "@/app/components/NavBar";

type Warehouse = {
  _id: string;
  name: string;
  pricePerMonth: string;
  capacity: string;
  status: string;
  location: string;
};

export default function ListingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  const getWarehouses = async () => {
    try {
      const response = await axios.post("/api/owner/warehouses/details", {});
      const listingData: Warehouse[] = response.data.Warehouse.map((warehouse: Warehouse) => ({
        _id: warehouse._id,
        location: warehouse.location,
        name: warehouse.name,
        capacity: warehouse.capacity,
        pricePerMonth: warehouse.pricePerMonth,
        status: warehouse.status,
      }));
      setWarehouses(listingData);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to fetch warehouses");
      } else {
        toast.error("Failed to fetch warehouses");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (warehouseId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this warehouse?");
    if (!confirmed) {
      return;
    }

    try {
      await axios.post("/api/owner/warehouses/delete", { _id: warehouseId });
      setWarehouses((previous) =>
        previous.filter((warehouse) => warehouse._id !== warehouseId),
      );
      toast.success("Warehouse deleted");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Error deleting warehouse");
      } else {
        toast.error("Error deleting warehouse");
      }
    }
  };

  useEffect(() => {
    void getWarehouses();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <NavBar landing={false} role="Owner" />

      <main className="container mx-auto flex-grow px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800">My Warehouses</h2>
          <Link
            href="/owner/listings/new"
            className="rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition duration-300 hover:bg-blue-600"
          >
            + Add New Warehouse
          </Link>
        </div>

        {warehouses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {warehouses.map((warehouse) => (
              <div
                key={warehouse._id}
                className="rounded-lg bg-white p-6 shadow-xl transition duration-300 hover:shadow-2xl"
              >
                <h3 className="mb-2 text-2xl font-bold text-blue-700">{warehouse.name}</h3>
                <p className="mb-2 text-gray-600">Location: {warehouse.location}</p>
                <p className="mb-2 text-gray-600">Capacity: {warehouse.capacity} sq. ft.</p>
                <p className="mb-2 text-gray-600">Price: Rs. {warehouse.pricePerMonth}/month</p>
                <p
                  className={`mt-2 text-sm font-medium ${
                    warehouse.status === "available" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  Status: {warehouse.status}
                </p>
                <div className="mt-4 flex justify-between">
                  <Link
                    href={`/owner/listings/edit/${warehouse._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(warehouse._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No warehouses found.</p>
        )}
      </main>

      <footer className="mt-auto bg-gray-800 py-4 text-center">
        <p className="text-sm text-white">&copy; 2026 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
}

