"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NavBar } from "@/app/components/NavBar";

type CustomerDashboardData = {
  name: string;
  email: string;
  totalBookings: number;
  activeBookings: number;
  totalPayments: number;
};

export default function CustomerDashboard() {
  const [customerData, setCustomerData] = useState<CustomerDashboardData>({
    name: "",
    email: "",
    totalBookings: 0,
    activeBookings: 0,
    totalPayments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await axios.get("/api/customer/dashboard");
      setCustomerData({
        name: response.data.info.user.fullName,
        email: response.data.info.user.email,
        totalBookings: response.data.info.totalBooking,
        activeBookings: response.data.info.activeBooking,
        totalPayments: response.data.info.totalPayment,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to load dashboard");
      } else {
        toast.error("Failed to load dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void getData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <NavBar landing={false} role="Customer" />

      <main className="container mx-auto flex-grow px-6 py-8">
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-2 text-3xl font-bold text-gray-800">Welcome, {customerData.name}</h2>
          <p className="text-gray-600">Email: {customerData.email}</p>
        </div>

        <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 text-center shadow-md">
            <h3 className="text-2xl font-bold text-blue-700">{customerData.totalBookings}</h3>
            <p className="text-gray-600">Total Bookings</p>
          </div>
          <div className="rounded-lg bg-white p-6 text-center shadow-md">
            <h3 className="text-2xl font-bold text-blue-700">{customerData.activeBookings}</h3>
            <p className="text-gray-600">Active Bookings</p>
          </div>
          <div className="rounded-lg bg-white p-6 text-center shadow-md">
            <h3 className="text-2xl font-bold text-blue-700">{customerData.totalPayments}</h3>
            <p className="text-gray-600">Total Payments</p>
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-2xl font-semibold text-gray-800">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/customer/search"
              className="rounded-lg bg-white p-6 text-center shadow-md hover:shadow-lg"
            >
              <h4 className="text-lg font-bold text-blue-700">Search Warehouses</h4>
              <p className="text-gray-600">Find available warehouses.</p>
            </Link>
            <Link
              href="/customer/bookings"
              className="rounded-lg bg-white p-6 text-center shadow-md hover:shadow-lg"
            >
              <h4 className="text-lg font-bold text-blue-700">View Bookings</h4>
              <p className="text-gray-600">Manage your current and past bookings.</p>
            </Link>
            <Link
              href="/customer/payments"
              className="rounded-lg bg-white p-6 text-center shadow-md hover:shadow-lg"
            >
              <h4 className="text-lg font-bold text-blue-700">Payments</h4>
              <p className="text-gray-600">View payment history and details.</p>
            </Link>
            <Link
              href="/customer/profile"
              className="rounded-lg bg-white p-6 text-center shadow-md hover:shadow-lg"
            >
              <h4 className="text-lg font-bold text-blue-700">Profile</h4>
              <p className="text-gray-600">Manage your account details.</p>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-300 py-4 text-center">
        <p className="text-gray-700">&copy; 2026 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
}

