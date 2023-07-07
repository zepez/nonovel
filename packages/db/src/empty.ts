import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

import config from "@nonovel/config-server";

const { Pool } = pg;

const connectionString = config.PG_URI;
if (!connectionString) throw new Error("Missing PG_URI");

console.dir({ connectionString });

const pool = new Pool({ connectionString, max: 1 });
const db = drizzle(pool, { logger: true });

const main = async () => {
  await db.execute(sql`DROP SCHEMA public CASCADE`);
  await db.execute(sql`DROP SCHEMA drizzle CASCADE`);
  process.exit(0);
};

void main();
