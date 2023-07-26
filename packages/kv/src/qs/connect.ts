import config from "@nonovel/config-server";

export const connect = {
  redis: {
    port: config.REDIS_PORT,
    host: config.REDIS_HOST,
    password: config.REDIS_PASSWORD,
    tls: {},
  },
};
