import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import config from "@nonovel/config-server";
import * as schema from "./schema";

export * from "./schema";

export const pool = new pg.Pool({ connectionString: config.PG_URI });

export const db = drizzle(pool, { schema, logger: true });
