import getBookingData from "@/helper/getBookingData";
import getUserData from "@/helper/getUserData";
import getWarehouseData from "@/helper/getWarehouseData";
import {
  getBookingsByOwnerId,
  updateBookingStatus,
} from "@/server/services/booking-service";
import {
  createWarehouse,
  deleteWarehouseAndCancelBookings,
  getWarehousesByOwnerId,
  hasWarehouseNameOrAddress,
  updateWarehouse,
} from "@/server/services/warehouse-service";

export async function getOwnerDashboard(userId: string) {
  const [user, bookings, warehouses] = await Promise.all([
    getUserData(userId),
    getBookingData(userId, "owner"),
    getWarehouseData(userId),
  ]);

  if (!user) {
    return null;
  }

  const activeBooking = bookings.filter((booking) => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    return booking.status === "confirmed" && startDate < new Date() && endDate > new Date();
  }).length;

  const totalWarehouses = warehouses.length;
  const totalPayment = bookings.reduce((sum, booking) => {
    if (booking.status === "confirmed") {
      return sum + booking.totalAmount;
    }
    return sum;
  }, 0);

  return {
    user,
    totalWarehouses,
    activeBooking,
    totalPayment,
  };
}

export async function getOwnerBookings(ownerId: string) {
  return getBookingsByOwnerId(ownerId);
}

export async function getOwnerEarnings(ownerId: string) {
  const bookings = await getBookingsByOwnerId(ownerId);
  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime(),
  );

  const summary = sortedBookings.reduce(
    (accumulator, booking) => {
      const isPaid = booking.paymentStatus === "paid";
      const isCancelled = booking.status === "cancelled";

      if (isPaid) {
        accumulator.totalPaid += booking.totalAmount;
        accumulator.paidCount += 1;
      } else if (!isCancelled) {
        accumulator.pendingAmount += booking.totalAmount;
        accumulator.pendingCount += 1;
      }

      return accumulator;
    },
    {
      totalPaid: 0,
      pendingAmount: 0,
      paidCount: 0,
      pendingCount: 0,
    },
  );

  const monthlyMap = new Map<string, { paid: number; pending: number }>();
  for (const booking of sortedBookings) {
    const bookingDate = new Date(booking.bookingDate);
    const monthKey = `${bookingDate.getFullYear()}-${String(bookingDate.getMonth() + 1).padStart(2, "0")}`;
    const existing = monthlyMap.get(monthKey) ?? { paid: 0, pending: 0 };

    if (booking.paymentStatus === "paid") {
      existing.paid += booking.totalAmount;
    } else if (booking.status !== "cancelled") {
      existing.pending += booking.totalAmount;
    }

    monthlyMap.set(monthKey, existing);
  }

  const monthly = Array.from(monthlyMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 6)
    .map(([month, values]) => ({
      month,
      paid: values.paid,
      pending: values.pending,
    }));

  return {
    summary: {
      totalTransactions: sortedBookings.length,
      totalPaid: summary.totalPaid,
      pendingAmount: summary.pendingAmount,
      paidCount: summary.paidCount,
      pendingCount: summary.pendingCount,
    },
    monthly,
    transactions: sortedBookings,
  };
}

export async function getOwnerWarehouses(ownerId: string) {
  return getWarehousesByOwnerId(ownerId);
}

export async function createOwnerWarehouse(input: {
  name: string;
  owner: string;
  address: string;
  capacity: number;
  pricePerMonth: number;
  facilities: string;
  startDate: string;
  endDate: string;
  photos: string;
  status: string;
}) {
  const existing = await hasWarehouseNameOrAddress(input.name, input.address);

  if (existing) {
    return {
      error: "Warehouse with same name or address already exists",
      status: 400 as const,
    };
  }

  await createWarehouse(input);

  return {
    status: 201 as const,
    data: { message: "Warehouse created" },
  };
}

export async function updateOwnerWarehouse(input: {
  id: string;
  name: string;
  address: string;
  capacity: number;
  pricePerMonth: number;
  facilities: string;
  startDate: string;
  endDate: string;
  photos: string;
  status: string;
}) {
  const warehouse = await updateWarehouse(input);

  if (!warehouse) {
    return { error: "Warehouse not found", status: 404 as const };
  }

  return {
    status: 200 as const,
    data: {
      message: "Warehouse updated successfully",
      data: warehouse,
    },
  };
}

export async function deleteOwnerWarehouse(warehouseId: string) {
  await deleteWarehouseAndCancelBookings(warehouseId);

  return {
    status: 200 as const,
    data: { message: "Warehouse deleted successfully" },
  };
}

export async function updateOwnerBookingStatus(
  bookingId: string,
  status: "pending" | "confirmed" | "completed" | "cancelled",
) {
  const booking = await updateBookingStatus(bookingId, status);

  if (!booking) {
    return { error: "Booking not found", status: 404 as const };
  }

  return {
    status: 200 as const,
    data: { message: "Booking updated", data: booking },
  };
}
