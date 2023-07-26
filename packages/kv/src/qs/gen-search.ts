import Queue from "bull";
import { connect } from "./connect";

const name = "gen_search";

const queue = new Queue(name, connect);

const add = async () =>
  await queue.add(null, { repeat: { cron: "* * * * *" } });

export const genSearch = {
  queue,
  add,
};
