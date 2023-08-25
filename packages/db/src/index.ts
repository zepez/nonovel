import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import config from "@nonovel/config-server";
import * as schema from "./schema";

export * from "./schema";

neonConfig.fetchConnectionCache = true;
export const sql = neon(config.PG_URI);

export const db = drizzle(sql, { schema, logger: false });
