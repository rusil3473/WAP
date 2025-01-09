"use client";
import Link from "next/link";

export default function CustomerDashboard() {
  const customerData = {
    name: "John Doe",
    email: "johndoe@example.com",
    totalBookings: 5,
    activeBookings: 2,
    totalPayments: "$2000",
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
            <Link href="/bookings" className="hover:underline">
              Bookings
            </Link>
            <Link href="/payments" className="hover:underline">
              Payments
            </Link>
            <Link href="/support" className="hover:underline">
              Support
            </Link>
            <Link href="/profile" className="hover:underline">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto py-8 px-6">
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
