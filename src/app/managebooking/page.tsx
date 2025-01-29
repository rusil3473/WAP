"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Booking {
  _id: string;
  cusomerName:string;
  customerId:string;
  warehouseId:string;
  warehouseName:string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  paymentStatus: string;
  status: string;
}

const demoBookings = [
  {
    _id: "BKG001",
    cusomerName: "John Doe",
    customerId: "CUST001",
    warehouseId: "WH001",
    warehouseName: "Central Storage",
    startDate: "2025-02-01",
    endDate: "2025-02-10",
    totalAmount: 5000,
    paymentStatus: "paid",
    status: "confirmed",
  },
  {
    _id: "BKG002",
    cusomerName: "Jane Smith",
    customerId: "CUST002",
    warehouseId: "WH002",
    warehouseName: "Metro Logistics",
    startDate: "2025-02-05",
    endDate: "2025-02-15",
    totalAmount: 7500,
    paymentStatus: "pending",
    status: "pending",
  },
  {
    _id: "BKG003",
    cusomerName: "Alice Johnson",
    customerId: "CUST003",
    warehouseId: "WH003",
    warehouseName: "Northside Depot",
    startDate: "2025-03-01",
    endDate: "2025-03-10",
    totalAmount: 6200,
    paymentStatus: "paid",
    status: "completed",
  },
];

export default function ManageBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch bookings for the owner
  const fetchBookings = async () => {
    try {
      const res = await axios.get("/api/users/getBookings");
      console.log(res.data.data)
      setBookings(res.data.data);
      setIsLoading(false);
    } catch (error: unknown) {
      console.error("Error fetching bookings:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Failed to fetch bookings");
      } else {
        toast.error("Failed to fetch bookings");
      }
      setIsLoading(false);
    }
  };

  // Update booking status
  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      await axios.put(`/api/users/updateBookingStatus`, {
        bookingId,
        status: newStatus,
      });
      toast.success("Booking status updated successfully");
      fetchBookings(); // Refresh the bookings list
    } catch (error: unknown) {
      console.error("Error updating booking status:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Failed to update status");
      } else {
        toast.error("Failed to update status");
      }
    }
  };

  useEffect(() => {
    fetchBookings();
    setBookings(demoBookings); // Use demo data for now
  }, []);

  // Filter bookings by status
  const filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === filterStatus);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navigation Bar */}
      <header className="sticky top-0 bg-white shadow-md z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-700">
              Warehouse Aggregation
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 text-sm font-medium ${filterStatus === "all"
                  ? "bg-blue-700 text-white"
                  : "text-blue-700 hover:bg-blue-100"
                  } rounded-md transition`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus("pending")}
                className={`px-4 py-2 text-sm font-medium ${filterStatus === "pending"
                  ? "bg-blue-700 text-white"
                  : "text-blue-700 hover:bg-blue-100"
                  } rounded-md transition`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus("confirmed")}
                className={`px-4 py-2 text-sm font-medium ${filterStatus === "confirmed"
                  ? "bg-blue-700 text-white"
                  : "text-blue-700 hover:bg-blue-100"
                  } rounded-md transition`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setFilterStatus("completed")}
                className={`px-4 py-2 text-sm font-medium ${filterStatus === "completed"
                  ? "bg-blue-700 text-white"
                  : "text-blue-700 hover:bg-blue-100"
                  } rounded-md transition`}
              >
                Completed
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Bookings</h2>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700 uppercase">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700 uppercase">
                  Warehouse
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700 uppercase">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700 uppercase">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700 uppercase">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700 uppercase">
                  Booking Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {booking._id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="font-medium">
                        {booking.cusomerName}
                      </div>
                      <div className="text-gray-500">
                        {booking.customerId}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="font-medium">
                        {booking.warehouseId}
                      </div>
                      <div className="text-gray-500">
                        {booking.warehouseName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(booking.startDate).toLocaleDateString()} -{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      ₹{booking.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${booking.paymentStatus === "paid"
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
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${booking.status === "confirmed"
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
                        <div className="flex items-center space-x-2">

                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to confirm this booking?")) {
                                updateBookingStatus(booking._id, "confirmed");
                              }
                            }}
                            className="text-green-600 hover:text-green-800 transition text-xl"
                          >
                            ✔
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to cancel this booking?"))
                                updateBookingStatus(booking._id, "cancelled")
                            }
                            }
                            className="text-red-600 hover:text-red-800 transition text-xl"
                          >
                            ✖
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

      {/* Footer */}
      <footer className="bg-gray-300 text-center py-4">
        <p className="text-gray-700">© 2025 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
}