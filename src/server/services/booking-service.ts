import { query, queryOne, quoteIdentifier } from "@/lib/db";
import { BOOKING_TABLE, mapBookingRow, type BookingRecord } from "@/lib/supabase-data";

const BOOKING_TABLE_SQL = quoteIdentifier(BOOKING_TABLE);

type NewBookingInput = {
  customerId: string;
  ownerId: string;
  warehouseId: string;
  warehouseName: string;
  bookingDate: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  storageDetails: string;
};

export async function getBookingsByCustomerId(customerId: string): Promise<BookingRecord[]> {
  const rows = await query<Record<string, unknown>>(
    `select * from ${BOOKING_TABLE_SQL} where customer_id = $1`,
    [customerId],
  );

  return rows.map((row) => mapBookingRow(row));
}

export async function getBookingsByOwnerId(ownerId: string): Promise<BookingRecord[]> {
  const rows = await query<Record<string, unknown>>(
    `select * from ${BOOKING_TABLE_SQL} where owner_id = $1`,
    [ownerId],
  );

  return rows.map((row) => mapBookingRow(row));
}

export async function getBookingByIdForCustomer(
  bookingId: string,
  customerId: string,
): Promise<BookingRecord | null> {
  const row = await queryOne<Record<string, unknown>>(
    `
      select *
      from ${BOOKING_TABLE_SQL}
      where id = $1 and customer_id = $2
      limit 1
    `,
    [bookingId, customerId],
  );

  return row ? mapBookingRow(row) : null;
}

export async function hasConfirmedBookingForWarehouse(warehouseId: string): Promise<boolean> {
  const existingBooking = await queryOne<Record<string, unknown>>(
    `
      select id
      from ${BOOKING_TABLE_SQL}
      where warehouse_id = $1 and status = 'confirmed'
      limit 1
    `,
    [warehouseId],
  );

  return Boolean(existingBooking);
}

export async function createBooking(input: NewBookingInput): Promise<void> {
  await query(
    `
      insert into ${BOOKING_TABLE_SQL}
        (customer_id, owner_id, warehouse_id, warehouse_name, booking_date, start_date, end_date, total_amount, storage_details)
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `,
    [
      input.customerId,
      input.ownerId,
      input.warehouseId,
      input.warehouseName,
      input.bookingDate,
      input.startDate,
      input.endDate,
      input.totalAmount,
      input.storageDetails,
    ],
  );
}

export async function updateBookingStatus(
  bookingId: string,
  status: "pending" | "confirmed" | "completed" | "cancelled",
): Promise<BookingRecord | null> {
  const row = await queryOne<Record<string, unknown>>(
    `
      update ${BOOKING_TABLE_SQL}
      set status = $2
      where id = $1
      returning *
    `,
    [bookingId, status],
  );

  return row ? mapBookingRow(row) : null;
}

export async function updateBookingPaymentStatus(
  bookingId: string,
  paymentStatus: "pending" | "paid" | "failed",
): Promise<BookingRecord | null> {
  const row = await queryOne<Record<string, unknown>>(
    `
      update ${BOOKING_TABLE_SQL}
      set payment_status = $2
      where id = $1
      returning *
    `,
    [bookingId, paymentStatus],
  );

  return row ? mapBookingRow(row) : null;
}
