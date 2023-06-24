import { default as Redis } from "ioredis";
import config from "@nonovel/config-server";

export default new Redis(config.REDIS_URI);
