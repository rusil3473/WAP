import { randomUUID } from "crypto";
import { compare, hash } from "bcryptjs";
import { query, queryOne, quoteIdentifier, resolveTableName } from "@/lib/db";

export const PROFILE_TABLE = resolveTableName(
  "PROFILE_TABLE",
  "SUPABASE_PROFILE_TABLE",
  "profiles",
);
export const WAREHOUSE_TABLE = resolveTableName(
  "WAREHOUSE_TABLE",
  "SUPABASE_WAREHOUSE_TABLE",
  "warehouses",
);
export const BOOKING_TABLE = resolveTableName(
  "BOOKING_TABLE",
  "SUPABASE_BOOKING_TABLE",
  "bookings",
);

const PROFILE_TABLE_SQL = quoteIdentifier(PROFILE_TABLE);

type GenericRow = Record<string, unknown>;
type StoredRole = "customer" | "owner" | "admin";

export type UserProfile = {
  _id: string;
  fullName: string;
  email: string;
  role: StoredRole | null;
  isVerified: boolean;
  hasPassword: boolean;
};

export type WarehouseRecord = {
  _id: string;
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
  location: string;
};

export type BookingRecord = {
  _id: string;
  customerId: string;
  ownerId: string;
  warehouseId: string;
  warehouseName: string;
  bookingDate: string;
  startDate: string;
  endDate: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  storageDetails: string;
};

export type DatabaseAuthUser = {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    role?: StoredRole;
  };
  app_metadata?: {
    role?: StoredRole;
  };
  email_confirmed_at?: string | null;
};

function normalizeRole(role: unknown): StoredRole | null {
  if (typeof role !== "string" || role.trim() === "") {
    return null;
  }

  const normalized = role.trim().toLowerCase();
  if (normalized === "customer" || normalized === "owner" || normalized === "admin") {
    return normalized;
  }

  return null;
}

function asString(value: unknown, fallback = "") {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function asNumber(value: unknown, fallback = 0) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") return Number(value);
  return fallback;
}

function getPasswordHashRounds() {
  const raw = process.env.PASSWORD_HASH_ROUNDS ?? "10";
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 8 || parsed > 14) {
    return 10;
  }
  return parsed;
}

async function hashPassword(password: string) {
  return hash(password, getPasswordHashRounds());
}

function mapProfileRowWithPassword(row: GenericRow) {
  return {
    profile: mapProfileRow(row),
    passwordHash: asString(row.password_hash ?? null, ""),
  };
}

function mapProfileToAuthUser(row: GenericRow): DatabaseAuthUser {
  const role = normalizeRole(row.role);
  return {
    id: asString(row.id),
    email: asString(row.email),
    user_metadata: {
      full_name: asString(row.full_name ?? row.name),
      role: role ?? undefined,
    },
    app_metadata: {
      role: role ?? undefined,
    },
    email_confirmed_at: Boolean(row.is_verified) ? new Date().toISOString() : null,
  };
}

export function mapProfileRow(row: GenericRow): UserProfile {
  return {
    _id: asString(row.id),
    fullName: asString(row.full_name ?? row.name),
    email: asString(row.email),
    role: normalizeRole(row.role ?? row.Role),
    isVerified: Boolean(row.is_verified ?? row.isVerified ?? true),
    hasPassword: Boolean(asString(row.password_hash).trim()),
  };
}

export function mapWarehouseRow(row: GenericRow): WarehouseRecord {
  const address = asString(row.address ?? row.location);
  return {
    _id: asString(row.id ?? row._id),
    name: asString(row.name),
    owner: asString(row.owner_id ?? row.owner),
    address,
    capacity: asNumber(row.capacity),
    pricePerMonth: asNumber(row.price_per_month ?? row.pricePerMonth),
    facilities: asString(row.facilities),
    startDate: asString(row.start_date ?? row.startDate),
    endDate: asString(row.end_date ?? row.endDate),
    photos: asString(row.photos),
    status: asString(row.status, "available"),
    location: address,
  };
}

export function mapBookingRow(row: GenericRow): BookingRecord {
  return {
    _id: asString(row.id ?? row._id),
    customerId: asString(row.customer_id ?? row.customerId),
    ownerId: asString(row.owner_id ?? row.ownerId),
    warehouseId: asString(row.warehouse_id ?? row.warehouseId),
    warehouseName: asString(row.warehouse_name ?? row.warehouseName),
    bookingDate: asString(row.booking_date ?? row.bookingDate),
    startDate: asString(row.start_date ?? row.startDate),
    endDate: asString(row.end_date ?? row.endDate),
    status: asString(row.status, "pending"),
    totalAmount: asNumber(row.total_amount ?? row.totalAmount),
    paymentStatus: asString(row.payment_status ?? row.paymentStatus, "pending"),
    storageDetails: asString(row.storage_details ?? row.storageDetails),
  };
}

export async function getProfileById(id: string): Promise<UserProfile | null> {
  const row = await queryOne<GenericRow>(
    `select * from ${PROFILE_TABLE_SQL} where id = $1 limit 1`,
    [id],
  );

  if (!row) {
    return null;
  }

  return mapProfileRow(row);
}

export async function getProfileByEmail(email: string): Promise<UserProfile | null> {
  const row = await queryOne<GenericRow>(
    `select * from ${PROFILE_TABLE_SQL} where lower(email) = lower($1) limit 1`,
    [email],
  );

  if (!row) {
    return null;
  }

  return mapProfileRow(row);
}

export async function upsertProfile(input: {
  id: string;
  fullName: string;
  email: string;
  role?: string | null;
  isVerified: boolean;
}) {
  const normalizedRole = normalizeRole(input.role);
  const row = await queryOne<GenericRow>(
    `
      insert into ${PROFILE_TABLE_SQL} (id, full_name, email, role, is_verified)
      values ($1, $2, $3, $4, $5)
      on conflict (email)
      do update set
        full_name = excluded.full_name,
        role = coalesce(excluded.role, ${PROFILE_TABLE_SQL}.role),
        is_verified = excluded.is_verified
      returning *
    `,
    [
      input.id,
      input.fullName.trim(),
      input.email.trim().toLowerCase(),
      normalizedRole,
      input.isVerified,
    ],
  );

  if (!row) {
    throw new Error("Unable to upsert profile.");
  }

  return mapProfileRow(row);
}

export async function findAuthUserByEmail(email: string): Promise<DatabaseAuthUser | null> {
  const row = await queryOne<GenericRow>(
    `select * from ${PROFILE_TABLE_SQL} where lower(email) = lower($1) limit 1`,
    [email],
  );

  if (!row) {
    return null;
  }

  return mapProfileToAuthUser(row);
}

export async function ensureAuthUserByEmail(input: {
  email: string;
  password?: string;
  fullName?: string;
  role?: string;
}) {
  const existingRow = await queryOne<GenericRow>(
    `select * from ${PROFILE_TABLE_SQL} where lower(email) = lower($1) limit 1`,
    [input.email],
  );

  const fullName = input.fullName?.trim() || null;
  const role = input.role?.trim() ? normalizeRole(input.role) : null;

  if (existingRow) {
    const passwordHash = input.password ? await hashPassword(input.password) : null;

    const updatedRow = await queryOne<GenericRow>(
      `
        update ${PROFILE_TABLE_SQL}
        set
          full_name = coalesce($2, full_name),
          role = coalesce($3, role),
          password_hash = coalesce($4, password_hash)
        where id = $1
        returning *
      `,
      [
        asString(existingRow.id),
        fullName,
        role,
        passwordHash,
      ],
    );

    if (!updatedRow) {
      throw new Error("Unable to update existing user profile.");
    }

    return mapProfileToAuthUser(updatedRow);
  }

  const passwordHash = input.password ? await hashPassword(input.password) : null;
  const fallbackFullName = input.fullName?.trim() || input.email.split("@")[0];
  const fallbackRole = normalizeRole(input.role);
  const createdRow = await queryOne<GenericRow>(
    `
      insert into ${PROFILE_TABLE_SQL} (id, full_name, email, role, is_verified, password_hash)
      values ($1, $2, $3, $4, $5, $6)
      returning *
    `,
    [
      randomUUID(),
      fallbackFullName,
      input.email.trim().toLowerCase(),
      fallbackRole,
      !input.password,
      passwordHash,
    ],
  );

  if (!createdRow) {
    throw new Error("Unable to create auth user.");
  }

  return mapProfileToAuthUser(createdRow);
}

export async function ensureProfileForAuthUser(
  authUser: DatabaseAuthUser,
  overrides?: {
    role?: string | null;
    fullName?: string;
    isVerified?: boolean;
  },
) {
  const email = authUser.email;
  if (!email) {
    throw new Error("Auth user has no email.");
  }

  const fullName =
    overrides?.fullName ??
    asString(authUser.user_metadata?.full_name ?? authUser.user_metadata?.name, email);
  const role = normalizeRole(
    overrides?.role ?? authUser.user_metadata?.role ?? authUser.app_metadata?.role,
  );
  const isVerified = overrides?.isVerified ?? Boolean(authUser.email_confirmed_at);

  return upsertProfile({
    id: authUser.id,
    fullName,
    email,
    role,
    isVerified,
  });
}

export async function authenticateWithPassword(email: string, password: string) {
  const row = await queryOne<GenericRow>(
    `select * from ${PROFILE_TABLE_SQL} where lower(email) = lower($1) limit 1`,
    [email],
  );

  if (!row) {
    return null;
  }

  const { profile, passwordHash } = mapProfileRowWithPassword(row);
  if (!passwordHash) {
    return null;
  }

  const matches = await compare(password, passwordHash);
  if (!matches) {
    return null;
  }

  return profile;
}

export async function setPasswordByUserId(userId: string, password: string) {
  const passwordHash = await hashPassword(password);
  const row = await queryOne<GenericRow>(
    `
      update ${PROFILE_TABLE_SQL}
      set password_hash = $2
      where id = $1
      returning id
    `,
    [userId, passwordHash],
  );

  return Boolean(row);
}

export async function setUserVerified(userId: string, isVerified: boolean) {
  const row = await queryOne<GenericRow>(
    `
      update ${PROFILE_TABLE_SQL}
      set is_verified = $2
      where id = $1
      returning id
    `,
    [userId, isVerified],
  );

  return Boolean(row);
}

export async function updateProfileFullName(userId: string, fullName: string) {
  const row = await queryOne<GenericRow>(
    `
      update ${PROFILE_TABLE_SQL}
      set full_name = $2
      where id = $1
      returning *
    `,
    [userId, fullName.trim()],
  );

  if (!row) {
    return null;
  }

  return mapProfileRow(row);
}

export async function selectInitialRole(
  userId: string,
  role: "customer" | "owner",
): Promise<{
  status: "updated" | "already_selected" | "locked" | "not_found";
  profile: UserProfile | null;
}> {
  const updatedRow = await queryOne<GenericRow>(
    `
      update ${PROFILE_TABLE_SQL}
      set role = $2
      where id = $1 and (role is null or btrim(role) = '')
      returning *
    `,
    [userId, role],
  );

  if (updatedRow) {
    return {
      status: "updated",
      profile: mapProfileRow(updatedRow),
    };
  }

  const existing = await getProfileById(userId);
  if (!existing) {
    return { status: "not_found", profile: null };
  }

  if (existing.role === role) {
    return { status: "already_selected", profile: existing };
  }

  return { status: "locked", profile: existing };
}

export async function listRowsByColumn(
  tableName: string,
  columnName: string,
  value: string,
): Promise<GenericRow[]> {
  const tableSql = quoteIdentifier(tableName);
  const columnSql = quoteIdentifier(columnName);
  return query<GenericRow>(
    `select * from ${tableSql} where ${columnSql} = $1`,
    [value],
  );
}
