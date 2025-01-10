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
  const [token, setToken] = useState("");
  const [warehouses, setWarehouses] = useState([
    { _id: "", location: "", name: "", capacity: "", pricePerMonth: "", status: "" },
  ]);
  
  const[menuOpen,setMenuOpen]=useState(false);
  const getWarehouse = async (t: string) => {
    try {
      const res = await axios.post("/api/users/getWarehouse", { token: t });
      setWarehouses(() => {
        const data = res.data.Warehouse.map((obj: warehouseObject) => {
          const { _id, location, name, capacity, pricePerMonth, status } = obj;
          return { _id, location, name, capacity, pricePerMonth, status };
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
    if (t) {
      setToken(t);
      getWarehouse(t);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-3xl font-semibold">Warehouse Aggregation</h1>
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

      <main className="container mx-auto py-8 px-6 flex-grow">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">My Warehouses</h2>
          <Link
            href="/listings/new"
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition duration-300"
          >
            + Add New Warehouse
          </Link>
        </div>

        {warehouses.length > 0 && token ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warehouses.map((warehouse) => (
              <div key={warehouse._id} className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
                <h3 className="text-2xl font-bold text-blue-700 mb-2">{warehouse.name}</h3>
                <p className="text-gray-600 mb-2">Location: {warehouse.location}</p>
                <p className="text-gray-600 mb-2">Capacity: {warehouse.capacity} sq. ft.</p>
                <p className="text-gray-600 mb-2">Price: ₹{warehouse.pricePerMonth}/month</p>
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

      <footer className="bg-gray-800 text-center py-4 mt-auto">
        <p className="text-white text-sm">© 2025 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
}
