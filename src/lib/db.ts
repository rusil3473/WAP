import { Pool, type PoolClient, type QueryResultRow } from "pg";

declare global {
  var __wapPgPool: Pool | undefined;
}

function requiredEnv(names: string[]) {
  for (const name of names) {
    const value = process.env[name];
    if (value) {
      return value;
    }
  }

  throw new Error(`${names.join(" or ")} is not configured.`);
}

function createPool() {
  const connectionString = requiredEnv(["DATABASE_URL", "NEON_DATABASE_URL"]);

  return new Pool({
    connectionString,
  });
}

function getPool() {
  if (!globalThis.__wapPgPool) {
    globalThis.__wapPgPool = createPool();
  }

  return globalThis.__wapPgPool;
}

export function resolveTableName(primaryEnv: string, legacyEnv: string, fallback: string) {
  const rawValue = process.env[primaryEnv] ?? process.env[legacyEnv] ?? fallback;
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(rawValue)) {
    throw new Error(`${primaryEnv} must be a valid SQL identifier.`);
  }
  return rawValue;
}

export function quoteIdentifier(identifier: string) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(identifier)) {
    throw new Error(`Invalid SQL identifier: ${identifier}`);
  }

  return `"${identifier}"`;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
) {
  const result = await getPool().query<T>(text, params);
  return result.rows;
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
) {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
) {
  const client = await getPool().connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
