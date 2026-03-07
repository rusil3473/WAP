"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { NavBar } from "@/app/components/NavBar";

type Booking = {
  _id: string;
  customerName?: string;
  customerId: string;
  warehouseId: string;
  warehouseName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  paymentStatus: string;
  status: string;
};

export default function ManageBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchBookings = async () => {
    try {
      const response = await axios.get("/api/owner/bookings");
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

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      await axios.put("/api/owner/bookings/update-status", {
        bookingId,
        status: newStatus,
      });
      toast.success("Booking status updated");
      await fetchBookings();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update status");
      } else {
        toast.error("Failed to update status");
      }
    }
  };

  useEffect(() => {
    void fetchBookings();
  }, []);

  const filteredBookings = useMemo(
    () =>
      filterStatus === "all"
        ? bookings
        : bookings.filter((booking) => booking.status === filterStatus),
    [bookings, filterStatus],
  );

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
      <NavBar landing={false} role="Owner" />

      <main className="container mx-auto flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-3xl font-bold text-gray-800">Manage Bookings</h2>
          <select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 sm:w-52"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <table className="min-w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase text-blue-700">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase text-blue-700">
                  Customer
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
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase text-blue-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking._id} className="transition hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{booking._id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="font-medium">{booking.customerName ?? "Customer"}</div>
                      <div className="text-gray-500">{booking.customerId}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="font-medium">{booking.warehouseId}</div>
                      <div className="text-gray-500">{booking.warehouseName}</div>
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
                    <td className="px-6 py-4 text-sm">
                      {booking.status === "pending" ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm("Confirm this booking?")) {
                                void updateBookingStatus(booking._id, "confirmed");
                              }
                            }}
                            className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-200"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm("Cancel this booking?")) {
                                void updateBookingStatus(booking._id, "cancelled");
                              }
                            }}
                            className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
                          >
                            Reject
                          </button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
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

