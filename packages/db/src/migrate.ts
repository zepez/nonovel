import path from "path";
import pg from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";

const { Pool } = pg;

const connectionString = process.env.PG_URI as string;
if (!connectionString) throw new Error("Missing PG_URI");

console.dir({ connectionString });

const pool = new Pool({ connectionString, max: 1 });
const db = drizzle(pool, { logger: true });

const main = async () => {
  await migrate(db, { migrationsFolder: path.join(__dirname, "migrations") });
  process.exit(0);
};

void main();
