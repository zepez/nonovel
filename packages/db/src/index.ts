import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export * from "./schema";

export const pool = new pg.Pool({
  connectionString: process.env.PG_CONNECTION_STRING as string,
});

export const db = drizzle(pool, { schema, logger: true });
