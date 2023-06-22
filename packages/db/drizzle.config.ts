import type { Config } from "drizzle-kit";

export default {
  out: "./src/migrations",
  schema: ["./src/index.ts"],
} satisfies Config;
