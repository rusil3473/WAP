import { query, queryOne, quoteIdentifier, withTransaction } from "@/lib/db";
import { mapWarehouseRow, WAREHOUSE_TABLE, BOOKING_TABLE, type WarehouseRecord } from "@/lib/supabase-data";

export type { WarehouseRecord } from "@/lib/supabase-data";

const WAREHOUSE_TABLE_SQL = quoteIdentifier(WAREHOUSE_TABLE);
const BOOKING_TABLE_SQL = quoteIdentifier(BOOKING_TABLE);

type WarehouseInput = {
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
};

type WarehouseUpdateInput = {
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
};

export async function getWarehouseById(warehouseId: string): Promise<WarehouseRecord | null> {
  const row = await queryOne<Record<string, unknown>>(
    `select * from ${WAREHOUSE_TABLE_SQL} where id = $1 limit 1`,
    [warehouseId],
  );

  return row ? mapWarehouseRow(row) : null;
}

export async function getWarehousesByOwnerId(ownerId: string): Promise<WarehouseRecord[]> {
  const rows = await query<Record<string, unknown>>(
    `select * from ${WAREHOUSE_TABLE_SQL} where owner_id = $1`,
    [ownerId],
  );

  return rows.map((warehouse) => mapWarehouseRow(warehouse));
}

export async function getAvailableWarehouses(): Promise<WarehouseRecord[]> {
  const rows = await query<Record<string, unknown>>(
    `select * from ${WAREHOUSE_TABLE_SQL} where status = $1`,
    ["available"],
  );

  return rows.map((warehouse) => mapWarehouseRow(warehouse));
}

export async function hasWarehouseNameOrAddress(name: string, address: string): Promise<boolean> {
  const existing = await queryOne<Record<string, unknown>>(
    `
      select id
      from ${WAREHOUSE_TABLE_SQL}
      where lower(name) = lower($1) or lower(address) = lower($2)
      limit 1
    `,
    [name, address],
  );

  return Boolean(existing);
}

export async function createWarehouse(input: WarehouseInput): Promise<void> {
  await query(
    `
      insert into ${WAREHOUSE_TABLE_SQL}
        (name, owner_id, address, capacity, price_per_month, facilities, start_date, end_date, photos, status)
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `,
    [
      input.name,
      input.owner,
      input.address,
      Number(input.capacity),
      Number(input.pricePerMonth),
      input.facilities,
      input.startDate,
      input.endDate,
      input.photos,
      input.status,
    ],
  );
}

export async function updateWarehouse(input: WarehouseUpdateInput): Promise<WarehouseRecord | null> {
  const row = await queryOne<Record<string, unknown>>(
    `
      update ${WAREHOUSE_TABLE_SQL}
      set
        name = $2,
        address = $3,
        capacity = $4,
        price_per_month = $5,
        facilities = $6,
        start_date = $7,
        end_date = $8,
        photos = $9,
        status = $10
      where id = $1
      returning *
    `,
    [
      input.id,
      input.name,
      input.address,
      Number(input.capacity),
      Number(input.pricePerMonth),
      input.facilities,
      input.startDate,
      input.endDate,
      input.photos,
      input.status,
    ],
  );

  return row ? mapWarehouseRow(row) : null;
}

export async function deleteWarehouseAndCancelBookings(warehouseId: string): Promise<void> {
  await withTransaction(async (client) => {
    await client.query(
      `update ${BOOKING_TABLE_SQL} set status = 'cancelled' where warehouse_id = $1`,
      [warehouseId],
    );

    await client.query(`delete from ${WAREHOUSE_TABLE_SQL} where id = $1`, [warehouseId]);
  });
}
