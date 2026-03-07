import { query, quoteIdentifier } from "@/lib/db";
import {
  BOOKING_TABLE,
  mapBookingRow,
  type BookingRecord,
} from "@/lib/supabase-data";

const BOOKING_TABLE_SQL = quoteIdentifier(BOOKING_TABLE);

export default async function getBookingData(
  userId: string,
  role: "customer" | "owner",
): Promise<BookingRecord[]> {
  try {
    const column = role === "customer" ? "customer_id" : "owner_id";
    const rows = await query<Record<string, unknown>>(
      `select * from ${BOOKING_TABLE_SQL} where ${column} = $1`,
      [userId],
    );

    return rows.map((row) => mapBookingRow(row));
  } catch (error) {
    console.error("Failed to fetch booking data:", error);
    return [];
  }
}
