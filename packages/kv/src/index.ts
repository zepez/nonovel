import { default as Redis } from "ioredis";
import config from "@nonovel/config-server";
export * as qs from "./qs";

export const client = new Redis(config.REDIS_URI);
