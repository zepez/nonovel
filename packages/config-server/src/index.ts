import * as z from "zod";
import clientConfig from "@nonovel/config-client";

const getWebUrl = (protocol: string, host: string, port: string) => {
  // use vercel defaults if possible
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    `${protocol}://${host}:${port}`;

  // add protocol if missing
  url = url.includes("http") ? url : `${protocol}://${url}`;

  // remove trailing slash if present
  url = url.charAt(url.length - 1) === "/" ? url.slice(0, -1) : url;

  return url;
};

const schema = z
  .object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    WEB_PROTOCOL: z.enum(["http", "https"]).default("https"),
    WEB_HOST: z.string().default("localhost"),
    WEB_PORT: z.string().default("3000"),
    PG_PROTOCOL: z.enum(["postgres", "postgresql"]).default("postgres"),
    PG_HOST: z.string().default("127.0.0.1"),
    PG_PORT: z.string().default("5432"),
    PG_USERNAME: z.string().default("postgres"),
    PG_PASSWORD: z.string().default(""),
    PG_DATABASE: z.string().default("postgres"),
    PG_OPTS: z.string().default(""),
    NB_GEN_SECRET_KEY: z.string().default(""),
    S3_ENDPOINT: z.string().url(),
    S3_BUCKET_NAME: z.string(),
    S3_ACCESS_KEY_ID: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
    OPENAI_API_KEY: z.string(),
    STABILITY_API_KEY: z.string(),
    MICRO_Q_SEARCH_CRON: z.string().default("0 0 * * *"),
    NEXTAUTH_URL: z.string(),
    NEXTAUTH_SECRET: z.string(),
    NEXTAUTH_GITHUB_CLIENT_ID: z.string(),
    NEXTAUTH_GITHUB_CLIENT_SECRET: z.string(),
    NEXTAUTH_DISCORD_CLIENT_ID: z.string(),
    NEXTAUTH_DISCORD_CLIENT_SECRET: z.string(),
    NEXTAUTH_GOOGLE_CLIENT_ID: z.string(),
    NEXTAUTH_GOOGLE_CLIENT_SECRET: z.string(),
  })
  .transform((obj) => ({
    ...obj,
    WEB_PORT: parseInt(obj.WEB_PORT, 10),
    WEB_URL: getWebUrl(obj.WEB_PROTOCOL, obj.WEB_HOST, obj.WEB_PORT),
    PG_PORT: parseInt(obj.PG_PORT, 10),
    PG_URI: `${obj.PG_PROTOCOL}://${obj.PG_USERNAME}:${obj.PG_PASSWORD}@${obj.PG_HOST}:${obj.PG_PORT}/${obj.PG_DATABASE}?${obj.PG_OPTS}`,
  }));

export default { ...schema.parse(process.env), ...clientConfig };
