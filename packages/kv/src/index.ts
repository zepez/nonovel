import { default as Redis } from "ioredis";

export default new Redis(process.env.REDIS_CONNECTION_STRING as string);
