import path from "path";
import pg from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";

import config from "@nonovel/config-server";

const { Pool } = pg;

const connectionString = config.PG_URI;
if (!connectionString) throw new Error("Missing PG_URI");

console.dir({ connectionString });

const pool = new Pool({ connectionString, max: 1 });
const db = drizzle(pool, { logger: true });

const main = async () => {
  await migrate(db, { migrationsFolder: path.join(__dirname, "migrations") });
  process.exit(0);
};

void main();
