import { query, quoteIdentifier } from "@/lib/db";
import {
  mapWarehouseRow,
  WAREHOUSE_TABLE,
  type WarehouseRecord,
} from "@/lib/supabase-data";

const WAREHOUSE_TABLE_SQL = quoteIdentifier(WAREHOUSE_TABLE);

export default async function getWarehouseData(ownerId: string): Promise<WarehouseRecord[]> {
  try {
    const rows = await query<Record<string, unknown>>(
      `select * from ${WAREHOUSE_TABLE_SQL} where owner_id = $1`,
      [ownerId],
    );

    return rows.map((row) => mapWarehouseRow(row));
  } catch (error) {
    console.error("Failed to fetch warehouse data:", error);
    return [];
  }
}
