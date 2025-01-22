"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CustomerDashboard() {
  const [customerData,setCustomerData] =useState( {
    name: "",
    email: "",
    totalBookings: 0,
    activeBookings: 0,
    totalPayments: 0,
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const router=useRouter();
  const getData=async()=>{
    try {
      const res= await axios.get("/api/users/dashboard/customer")
      
      setCustomerData({
        name:res.data.info.user.fullName,
        email:res.data.info.user.email,
        totalBookings:res.data.info.totalBooking,
        activeBookings:res.data.info.activeBooking,
        totalPayments:res.data.info.totalPayment,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    getData();

  },[]);



  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navigation Bar */}
      <header className="sticky top-0 bg-white shadow-md z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-700">
            Warehouse Aggregation
            </h1>
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
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
                onClick={() => router.push("/bookings/customer")}
                className="block md:inline px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
              >
                Bookings
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

      {/* Dashboard Content */}
      <main className="flex-grow container mx-auto py-8 px-6">
        {/* Welcome Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {customerData.name}</h2>
          <p className="text-gray-600">Email: {customerData.email}</p>
        </div>

        {/* Quick Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-bold text-blue-700">{customerData.totalBookings}</h3>
            <p className="text-gray-600">Total Bookings</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-bold text-blue-700">{customerData.activeBookings}</h3>
            <p className="text-gray-600">Active Bookings</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-bold text-blue-700">{customerData.totalPayments}</h3>
            <p className="text-gray-600">Total Payments</p>
          </div>
        </section>

        {/* Quick Links Section */}
        <section>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/search"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg text-center"
            >
              <h4 className="text-lg font-bold text-blue-700">Search Warehouses</h4>
              <p className="text-gray-600">Find available warehouses.</p>
            </Link>
            <Link
              href="/bookings/customer"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg text-center"
            >
              <h4 className="text-lg font-bold text-blue-700">View Bookings</h4>
              <p className="text-gray-600">Manage your current and past bookings.</p>
            </Link>
            <Link
              href="/payments"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg text-center"
            >
              <h4 className="text-lg font-bold text-blue-700">Payments</h4>
              <p className="text-gray-600">View payment history and details.</p>
            </Link>
            <Link
              href="/support"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg text-center"
            >
              <h4 className="text-lg font-bold text-blue-700">Support</h4>
              <p className="text-gray-600">Contact us for any help or queries.</p>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-300 text-center py-4">
        <p className="text-gray-700">© 2025 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
}

/* 
<Link
                href="/search"
                className="block md:inline px-4 py-2 hover:bg-blue-700 text-lg"
              >
                Search
              </Link>
              <Link
                href="/bookings"
                className="block md:inline px-4 py-2 hover:bg-blue-700 text-lg"
              >
                Bookings
              </Link>
              <Link
                href="/payments"
                className="block md:inline px-4 py-2 hover:bg-blue-700 text-lg"
              >
                Payments
              </Link>
              <Link
                href="/support"
                className="block md:inline px-4 py-2 hover:bg-blue-700 text-lg"
              >
                Support
              </Link>
              <Link
                href="/profile"
                className="block md:inline px-4 py-2 hover:bg-blue-700 text-lg"
              >
                Profile
              </Link> */