import * as z from "zod";

const schema = z
  .object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
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
    S3_ENDPOINT: z.string().url(),
    S3_ACCESS_KEY_ID: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
    OPENAI_API_KEY: z.string(),
    STABILITY_API_KEY: z.string(),
    NEXTAUTH_URL: z.string(),
    NEXTAUTH_SECRET: z.string(),
    NEXTAUTH_GITHUB_CLIENT_ID: z.string(),
    NEXTAUTH_GITHUB_CLIENT_SECRET: z.string(),
    NEXTAUTH_DISCORD_CLIENT_ID: z.string(),
    NEXTAUTH_DISCORD_CLIENT_SECRET: z.string(),
  })
  .transform((obj) => ({
    ...obj,
    PG_PORT: parseInt(obj.PG_PORT, 10),
    PG_URI: `postgres://${obj.PG_USERNAME}:${obj.PG_PASSWORD}@${obj.PG_HOST}:${obj.PG_PORT}/${obj.PG_DATABASE}?${obj.PG_OPTS}`,
    REDIS_PORT: parseInt(obj.REDIS_PORT, 10),
    REDIS_URI: `rediss://${obj.REDIS_USERNAME}:${obj.REDIS_PASSWORD}@${obj.REDIS_HOST}:${obj.REDIS_PORT}`,
  }));

export default schema.parse(process.env);
