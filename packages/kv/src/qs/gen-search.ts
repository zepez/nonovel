import Queue from "bull";
import config from "@nonovel/config-server";

const name = "gen_search";

const queue = new Queue(name, config.REDIS_URI);

const add = async () =>
  await queue.add(null, { repeat: { cron: config.MICRO_Q_SEARCH_CRON } });

export const genSearch = {
  queue,
  add,
};
