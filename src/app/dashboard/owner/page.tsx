"use client";
import Link from "next/link";

export default function OwnerDashboard() {
  const ownerData = {
    name: "Jane Doe",
    email: "janedoe@example.com",
    totalWarehouses: 3,
    activeBookings: 5,
    totalEarnings: "$5,000",
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold">Warehouse Aggregation</h1>
          <nav className="space-x-6">
            <Link href="/search" className="hover:underline">
              Search
            </Link>
            <Link href="/listings" className="hover:underline">
              My Listings
            </Link>
            <Link href="/bookings" className="hover:underline">
              Bookings
            </Link>
            <Link href="/earnings" className="hover:underline">
              Earnings
            </Link>
            <Link href="/support" className="hover:underline">
              Support
            </Link>
          </nav>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto py-8 px-6">
        {/* Welcome Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {ownerData.name}</h2>
          <p className="text-gray-600">Email: {ownerData.email}</p>
        </div>

        {/* Quick Stats Section */}
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

        {/* Quick Links Section */}
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
              href="/bookings"
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

      {/* Footer */}
      <footer className="bg-gray-300 text-center py-4">
        <p className="text-gray-700">© 2025 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
}
