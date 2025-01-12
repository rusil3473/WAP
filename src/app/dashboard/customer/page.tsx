"use client";
import Link from "next/link";
import { useState } from "react";

export default function CustomerDashboard() {
  const customerData = {
    name: "",
    email: "",
    totalBookings: 0,
    activeBookings: 0,
    totalPayments: 0,
  };
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navigation Bar */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Warehouse Aggregation</h1>
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
              className={`absolute top-full w-auto bg-blue-600 md:static md:w-auto md:flex md:gap-4 md:items-center ${menuOpen ? "block" : "hidden"
                }`}>
              
              <div className="flex flex-col">
                <Link href="/search">Search</Link>
                <Link href="/Search">Booking</Link>
                <Link href="/Search">Payments</Link>
                <Link href="/Search">Support</Link>

              </div>
            </div>
          </nav>
        </div>
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
              href="/bookings"
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