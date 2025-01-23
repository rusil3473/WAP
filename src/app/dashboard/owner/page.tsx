"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import toast from "react-hot-toast"
import axios from "axios"

interface CookieStore {
  [key: string]: string;
}

export default function OwnerDashboard() {
  const [ownerData,setOwnerData] =useState( {
    name: "",
    email: "",
    totalWarehouses: 0,
    activeBookings: 0,
    totalEarnings: "",
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const router=useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const getData=async()=>{
    try {
      const res= await axios.get("/api/users/dashboard/owner")
      
      setOwnerData({
        name:res.data.info.user.fullName,
        email:res.data.info.user.email,
        totalWarehouses:res.data.info.totalWarehouses,
        activeBookings:res.data.info.activeBooking,
        totalEarnings:res.data.info.totalPayment,
      });
      setIsLoading(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      console.log(error)
      toast.error(error.message)
    }
  }
  useEffect(()=>{
    try {
      const cookies = document.cookie.split(';').reduce<CookieStore>((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      
      const token = cookies['token'];
      if (token) {
        getData();
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Cookie parsing error:", error);
      setIsLoading(false);
    }
  },[]);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
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
                onClick={() => router.push("/listings")}
                className="block md:inline px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
              >
                My Listings
              </button>

              <button
                onClick={() => router.push("/bookings/owner")}
                className="block md:inline px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
              >
                Bookings
              </button>
              <button
                onClick={() => router.push("/earnings")}
                className="block md:inline px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
              >
                Earnings
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

      <main className="flex-grow container mx-auto py-8 px-6">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {ownerData.name}</h2>
          <p className="text-gray-600">Email: {ownerData.email}</p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-bold text-blue-700">{ownerData.totalWarehouses}</h3>
            <p className="text-gray-600">Total Warehouses</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-bold text-blue-700">{ownerData.activeBookings}</h3>
            <p className="text-gray-600">Active Bookings</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-bold text-blue-700">{ownerData.totalEarnings}</h3>
            <p className="text-gray-600">Total Earnings</p>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/listings"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg text-center"
            >
              <h4 className="text-lg font-bold text-blue-700">Manage Listings</h4>
              <p className="text-gray-600">Add, edit, or delete your warehouses.</p>
            </Link>
            <Link
              href="/bookings/owner"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg text-center"
            >
              <h4 className="text-lg font-bold text-blue-700">View Bookings</h4>
              <p className="text-gray-600">Check current and upcoming bookings.</p>
            </Link>
            <Link
              href="/earnings"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg text-center"
            >
              <h4 className="text-lg font-bold text-blue-700">Track Earnings</h4>
              <p className="text-gray-600">View earnings and payment details.</p>
            </Link>
            <Link
              href="/analytics"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg text-center"
            >
              <h4 className="text-lg font-bold text-blue-700">View Analytics</h4>
              <p className="text-gray-600">Monitor performance and trends.</p>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-300 text-center py-4">
        <p className="text-gray-700">© 2025 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
}
