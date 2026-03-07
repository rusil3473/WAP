import getBookingData from "@/helper/getBookingData";
import getUserData from "@/helper/getUserData";
import { updateProfileFullName } from "@/lib/supabase-data";
import {
  createBooking,
  getBookingByIdForCustomer,
  getBookingsByCustomerId,
  hasConfirmedBookingForWarehouse,
  updateBookingPaymentStatus,
} from "@/server/services/booking-service";
import {
  getAvailableWarehouses,
  getWarehouseById,
  type WarehouseRecord,
} from "@/server/services/warehouse-service";

type DashboardData = {
  user: Awaited<ReturnType<typeof getUserData>>;
  totalBooking: number;
  activeBooking: number;
  totalPayment: number;
};

export async function getCustomerDashboard(userId: string): Promise<DashboardData | null> {
  const [user, bookings] = await Promise.all([
    getUserData(userId),
    getBookingData(userId, "customer"),
  ]);

  if (!user) {
    return null;
  }

  const totalBooking = bookings.length;
  const activeBooking = bookings.filter((booking) => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    return booking.status === "confirmed" && startDate < new Date() && endDate > new Date();
  }).length;

  const totalPayment = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

  return {
    user,
    totalBooking,
    activeBooking,
    totalPayment,
  };
}

export async function getCustomerBookings(userId: string) {
  return getBookingsByCustomerId(userId);
}

export async function getCustomerProfile(userId: string) {
  const user = await getUserData(userId);
  if (!user) {
    return null;
  }

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    hasPassword: user.hasPassword,
  };
}

export async function updateCustomerProfileName(userId: string, fullName: string) {
  const trimmedName = fullName.trim();
  if (trimmedName.length < 2) {
    return { error: "Full name must be at least 2 characters", status: 400 as const };
  }

  const updatedProfile = await updateProfileFullName(userId, trimmedName);
  if (!updatedProfile) {
    return { error: "User not found", status: 404 as const };
  }

  return {
    status: 200 as const,
    data: {
      message: "Profile updated successfully",
      profile: updatedProfile,
    },
  };
}

export async function getCustomerPayments(userId: string) {
  const bookings = await getBookingsByCustomerId(userId);
  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime(),
  );

  const totalPaid = sortedBookings.reduce((sum, booking) => {
    if (booking.paymentStatus === "paid") {
      return sum + booking.totalAmount;
    }
    return sum;
  }, 0);

  const pendingAmount = sortedBookings.reduce((sum, booking) => {
    if (
      booking.paymentStatus !== "paid" &&
      booking.status !== "cancelled"
    ) {
      return sum + booking.totalAmount;
    }
    return sum;
  }, 0);

  return {
    summary: {
      totalTransactions: sortedBookings.length,
      totalPaid,
      pendingAmount,
    },
    payments: sortedBookings,
  };
}

export async function payForCustomerBooking(customerId: string, bookingId: string) {
  const booking = await getBookingByIdForCustomer(bookingId, customerId);
  if (!booking) {
    return { error: "Booking not found", status: 404 as const };
  }

  if (booking.status === "cancelled") {
    return { error: "Cancelled booking cannot be paid", status: 400 as const };
  }

  if (booking.paymentStatus === "paid") {
    return {
      status: 200 as const,
      data: {
        message: "Booking is already paid",
        payment: booking,
      },
    };
  }

  const updatedBooking = await updateBookingPaymentStatus(bookingId, "paid");
  if (!updatedBooking) {
    return { error: "Unable to complete payment", status: 400 as const };
  }

  return {
    status: 200 as const,
    data: {
      message: "Payment completed successfully",
      payment: updatedBooking,
    },
  };
}

export async function getCustomerWarehouses() {
  return getAvailableWarehouses();
}

export async function getWarehouseForCustomer(warehouseId: string): Promise<WarehouseRecord | null> {
  return getWarehouseById(warehouseId);
}

export async function createCustomerBooking(input: {
  customerId: string;
  ownerId: string;
  warehouseId: string;
  warehouseName: string;
  bookingDate: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  storageDetails: string;
}) {
  const occupied = await hasConfirmedBookingForWarehouse(input.warehouseId);

  if (occupied) {
    return {
      error: "Warehouse is already occupied. Try a different one.",
      status: 409 as const,
    };
  }

  await createBooking(input);

  return {
    status: 200 as const,
    data: { message: "Booking request sent to warehouse owner" },
  };
}
