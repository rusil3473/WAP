"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Booking {
    _id: string;
    warehouseId: {
        name: string;
        address: string;
    };
    startDate: string;
    endDate: string;
    totalAmount: number;
    paymentStatus: string;
    status: string;
}

/* 
const demoBookings: Booking[] = [
    {
        _id: "1",
        warehouseId: {
            name: "Central Storage Hub",
            address: "123 Main St, New York, NY",
        },
        startDate: "2025-02-01",
        endDate: "2025-02-28",
        totalAmount: 5000,
        paymentStatus: "paid",
        status: "confirmed",
    },
    {
        _id: "2",
        warehouseId: {
            name: "Metro Logistics",
            address: "45 Industrial Ave, Los Angeles, CA",
        },
        startDate: "2025-03-01",
        endDate: "2025-03-15",
        totalAmount: 3000,
        paymentStatus: "pending",
        status: "pending",
    },
    {
        _id: "3",
        warehouseId: {
            name: "Quick Storage Solutions",
            address: "78 Warehouse Rd, Chicago, IL",
        },
        startDate: "2025-04-01",
        endDate: "2025-04-30",
        totalAmount: 7000,
        paymentStatus: "failed",
        status: "cancelled",
    },
]; */

export default function ViewBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Fetch bookings data
    const fetchBookings = async () => {
        try {
            const res = await axios.get("/api/users/getBookings");
            console.log(res)
            setBookings(res.data.data);
            setIsLoading(false);
        } catch (error: unknown) {
            console.error("Error fetching bookings:", error);
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message || "Failed to fetch bookings");
            } else {
                toast.error("Failed to fetch bookings");
            }
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    /*     setBookings(demoBookings); */
    }, []);

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
                                onClick={() => router.push("/search")}
                                className="px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
                            >
                                Search
                            </button>
                            <button
                                onClick={() => router.push("/bookings/customer")}
                                className="px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
                            >
                                Bookings
                            </button>
                            <button
                                onClick={() => router.push("/profile")}
                                className="px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
                            >
                                Profile
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Bookings</h2>

                {/* Bookings Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-blue-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700 uppercase">
                                    Booking ID
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {booking._id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            <div className="font-medium">{booking.warehouseId.name}</div>
                                            <div className="text-gray-500">{booking.warehouseId.address}</div>
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

            {/* Footer */}
            <footer className="bg-gray-300 text-center py-4">
                <p className="text-gray-700">© 2025 Warehouse Aggregation Platform</p>
            </footer>
        </div>
    );
}