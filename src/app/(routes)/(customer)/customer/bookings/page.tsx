"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NavBar } from "@/app/components/NavBar";

type Booking = {
  _id: string;
  warehouseId: string;
  warehouseName?: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  paymentStatus: string;
  status: string;
};

export default function ViewBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await axios.get("/api/customer/bookings");
      setBookings(response.data.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch bookings");
      } else {
        toast.error("Failed to fetch bookings");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchBookings();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600" />
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <NavBar landing={false} role="Customer" />

      <main className="container mx-auto flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-3xl font-bold text-gray-800">Your Bookings</h2>

        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <table className="min-w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase text-blue-700">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase text-blue-700">
                  Warehouse
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase text-blue-700">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase text-blue-700">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase text-blue-700">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase text-blue-700">
                  Booking Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking._id} className="transition hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{booking._id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="font-medium">{booking.warehouseName ?? "Warehouse"}</div>
                      <div className="text-gray-500">{booking.warehouseId}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(booking.startDate).toLocaleDateString()} -{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      Rs. {booking.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          booking.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : booking.paymentStatus === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <footer className="bg-gray-300 py-4 text-center">
        <p className="text-gray-700">&copy; 2026 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
}

