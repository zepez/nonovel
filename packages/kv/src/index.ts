import { default as Redis } from "ioredis";
import Queue from "bull";
import config from "@nonovel/config-server";

export const client = new Redis(config.REDIS_URI);

const qConnection = {
  redis: {
    port: config.REDIS_PORT,
    host: config.REDIS_HOST,
    password: config.REDIS_PASSWORD,
    tls: {},
  },
};

export const coverGenerationQueue = new Queue<{ projectId: string }>(
  "cover generation",
  qConnection
);
