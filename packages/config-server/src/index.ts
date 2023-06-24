import "server-only";
import * as z from "zod";

const schema = z
  .object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    NEXTAUTH_URL: z.string(),
    NEXTAUTH_SECRET: z.string(),
    NEXTAUTH_GITHUB_ID: z.string(),
    NEXTAUTH_GITHUB_SECRET: z.string(),
    PG_HOST: z.string().default("127.0.0.1"),
    PG_PORT: z.string().default("5432"),
    PG_USERNAME: z.string().default("postgres"),
    PG_PASSWORD: z.string().default(""),
    PG_DATABASE: z.string().default("postgres"),
    PG_OPTS: z.string().default(""),
    REDIS_USERNAME: z.string().default(""),
    REDIS_PASSWORD: z.string().default(""),
    REDIS_HOST: z.string().default("127.0.0.1"),
    REDIS_PORT: z.string().default("6379"),
  })
  .transform((obj) => ({
    ...obj,
    PG_PORT: parseInt(obj.PG_PORT, 10),
    PG_URI: `postgres://${obj.PG_USERNAME}:${obj.PG_PASSWORD}@${obj.PG_HOST}:${obj.PG_PORT}/${obj.PG_DATABASE}?${obj.PG_OPTS}`,
    REDIS_PORT: parseInt(obj.REDIS_PORT, 10),
    REDIS_URI: `redis://${obj.REDIS_USERNAME}:${obj.REDIS_PASSWORD}@${obj.REDIS_HOST}:${obj.REDIS_PORT}`,
  }));

export default schema.parse(process.env);
