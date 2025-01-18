"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


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
  const router=useRouter();
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      toast.error(error.response.data.message)
      console.log(error);
    }
  };

  const handleDelete = async (_id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this warehouse?");
    if (confirmed) {
      try {
        await axios.post("/api/users/deletelisting", { _id });
        setWarehouses((prev) => prev.filter((warehouse) => warehouse._id !== _id));
        alert("Warehouse deleted successfully.");
      } catch (error) {
        console.log(error);
        toast.error("Error while deleting the warehouse.");
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
                onClick={() => router.push("/owner/dashboard")}
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
                onClick={() => router.push("/owner/booking")}
                className="block md:inline px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
              >
                Bookings
              </button>
              <button
                onClick={() => router.push("/earning")}
                className="block md:inline px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
              >
                Earning
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
