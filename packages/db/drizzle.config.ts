import type { Config } from "drizzle-kit";

export default {
  out: "./src/migrations",
  schema: ["./src/schema/index.ts"],
} satisfies Config;
