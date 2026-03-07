const fs = require("fs/promises");
const path = require("path");
const { Pool } = require("pg");

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;

  const idx = trimmed.indexOf("=");
  if (idx === -1) return null;

  const key = trimmed.slice(0, idx).trim();
  let value = trimmed.slice(idx + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return { key, value };
}

async function loadEnvFile(envPath) {
  try {
    const content = await fs.readFile(envPath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const parsed = parseEnvLine(line);
      if (!parsed) continue;
      if (process.env[parsed.key] === undefined) {
        process.env[parsed.key] = parsed.value;
      }
    }
  } catch (error) {
    if (error && error.code !== "ENOENT") {
      throw error;
    }
  }
}

function getConnectionString() {
  return process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || "";
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

async function getSchemaPath(projectRoot) {
  const candidates = [
    path.join(projectRoot, "db", "schema.sql"),
    path.join(projectRoot, "supabase", "schema.sql"),
  ];

  for (const candidate of candidates) {
    if (await fileExists(candidate)) {
      return candidate;
    }
  }

  throw new Error(`Schema file not found. Checked: ${candidates.join(", ")}`);
}

async function main() {
  const projectRoot = path.resolve(__dirname, "..");
  await loadEnvFile(path.join(projectRoot, ".env"));

  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL (or NEON_DATABASE_URL) in your environment.");
  }

  const sqlPath = await getSchemaPath(projectRoot);
  const sql = await fs.readFile(sqlPath, "utf8");

  const pool = new Pool({
    connectionString,
  });

  try {
    await pool.query(sql);
    console.log("Neon schema initialized successfully.");
    console.log("Tables ensured: profiles, warehouses, bookings.");
    console.log("Relations ensured: warehouse->profile, booking->profile, booking->warehouse.");
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Failed to initialize Neon schema:", error.message || error);
  process.exit(1);
});
