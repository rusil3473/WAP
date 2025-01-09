"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

type warehouseObject = {
  _id: string;
  name: string;
  pricePerMonth: string;
  capacity: string;
  status: string;
  location: string;
};

export default function ListingsPage() {
  const [warehouses, setWarehouses] = useState([
    { _id: "", location: "", name: "", capacity: "", pricePerMonth: "", status: "" },
  ]);

  const getWarehouse = async (t: string) => {
    try {
      const res = await axios.post("/api/users/getWarehouse", { token: t });
      setWarehouses(() => {
        const data = res.data.Warehouse.map((obj: warehouseObject) => {
          const { _id, location, name, capacity, pricePerMonth, status } = obj;
          return { _id,location, name, capacity, pricePerMonth, status };
        });
        return data;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (_id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this warehouse?");
    if (confirmed) {
      try {
        await axios.post("/api/users/owner/listings/delete", { _id });
        setWarehouses((prev) => prev.filter((warehouse) => warehouse._id !== _id));
        alert("Warehouse deleted successfully.");
      } catch (error) {
        console.log(error);
        alert("Error while deleting the warehouse.");
      }
    }
  };

  useEffect(() => {
    const t = document.cookie.split("=")[1];
    getWarehouse(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold">Warehouse Aggregation</h1>
          <nav className="space-x-6">
            <Link href="/dashboard" className="hover:underline">Home</Link>
            <Link href="/search" className="hover:underline">Search</Link>
            <Link href="/listings" className="hover:underline">My Listings</Link>
            <Link href="/bookings" className="hover:underline">Bookings</Link>
            <Link href="/support" className="hover:underline">Support</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-8 px-6 flex-grow">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">My Warehouses</h2>
          <Link
            href="/listings/new"
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
          >
            + Add New Warehouse
          </Link>
        </div>

        {warehouses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warehouses.map((warehouse) => (
              <div key={warehouse._id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-blue-700">{warehouse.name}</h3>
                <p className="text-gray-600">Location: {warehouse.location}</p>
                <p className="text-gray-600">Capacity: {warehouse.capacity} sq. ft.</p>
                <p className="text-gray-600">Price: ₹{warehouse.pricePerMonth}/month</p>
                <p
                  className={`text-sm font-medium mt-2 ${
                    warehouse.status === "available" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  Status: {warehouse.status}
                </p>
                <div className="flex justify-between mt-4">
                  <Link href={`/listings/edit/${warehouse._id}`} className="text-blue-500 hover:underline">Edit</Link>
                  <button
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
          <p className="text-gray-600 text-center">No warehouses found.</p>
        )}
      </main>

      <footer className="bg-gray-300 text-center py-4 mt-auto">
        <p className="text-gray-700">© 2025 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
}
