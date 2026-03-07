"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NavBar } from "@/app/components/NavBar";

type OwnerDashboardState = {
  name: string;
  email: string;
  totalWarehouses: number;
  activeBookings: number;
  totalEarnings: number;
};

export default function OwnerDashboardPage() {
  const [ownerData, setOwnerData] = useState<OwnerDashboardState>({
    name: "",
    email: "",
    totalWarehouses: 0,
    activeBookings: 0,
    totalEarnings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await axios.get("/api/owner/dashboard");
      const info = response.data.info;

      if (info) {
        setOwnerData({
          name: info.user?.fullName ?? "Owner",
          email: info.user?.email ?? "",
          totalWarehouses: info.totalWarehouses ?? 0,
          activeBookings: info.activeBooking ?? 0,
          totalEarnings: info.totalPayment ?? 0,
        });
      }
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
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <NavBar landing={false} role="Owner" />

      <main className="container mx-auto flex-grow px-6 py-8">
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-2 text-3xl font-bold text-gray-800">Welcome, {ownerData.name}</h2>
          <p className="text-gray-600">Email: {ownerData.email}</p>
        </div>

        <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 text-center shadow-md">
            <h3 className="text-2xl font-bold text-blue-700">{ownerData.totalWarehouses}</h3>
            <p className="text-gray-600">Total Warehouses</p>
          </div>
          <div className="rounded-lg bg-white p-6 text-center shadow-md">
            <h3 className="text-2xl font-bold text-blue-700">{ownerData.activeBookings}</h3>
            <p className="text-gray-600">Active Bookings</p>
          </div>
          <div className="rounded-lg bg-white p-6 text-center shadow-md">
            <h3 className="text-2xl font-bold text-blue-700">Rs. {ownerData.totalEarnings}</h3>
            <p className="text-gray-600">Total Earnings</p>
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-2xl font-semibold text-gray-800">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/owner/listings"
              className="rounded-lg bg-white p-6 text-center shadow-md hover:shadow-lg"
            >
              <h4 className="text-lg font-bold text-blue-700">Manage Listings</h4>
              <p className="text-gray-600">Add, edit, or delete warehouses.</p>
            </Link>
            <Link
              href="/owner/bookings"
              className="rounded-lg bg-white p-6 text-center shadow-md hover:shadow-lg"
            >
              <h4 className="text-lg font-bold text-blue-700">View Bookings</h4>
              <p className="text-gray-600">Review current and upcoming bookings.</p>
            </Link>
            <Link
              href="/customer/search"
              className="rounded-lg bg-white p-6 text-center shadow-md hover:shadow-lg"
            >
              <h4 className="text-lg font-bold text-blue-700">Browse Market</h4>
              <p className="text-gray-600">Explore listings as a customer view.</p>
            </Link>
            <Link
              href="/earnings"
              className="rounded-lg bg-white p-6 text-center shadow-md hover:shadow-lg"
            >
              <h4 className="text-lg font-bold text-blue-700">Earnings</h4>
              <p className="text-gray-600">Track paid and pending revenue.</p>
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

