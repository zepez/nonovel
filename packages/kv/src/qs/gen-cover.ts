import Queue from "bull";
import config from "@nonovel/config-server";

interface GenCoverQueueOpts {
  projectId: string;
}

const name = "gen_cover";

const queue = new Queue<GenCoverQueueOpts>(name, config.REDIS_URI);

const add = async ({ projectId }: GenCoverQueueOpts) =>
  await queue.add(
    { projectId },
    { jobId: `${name}:${projectId}`, removeOnComplete: true, attempts: 3 }
  );

export const genCover = {
  queue,
  add,
};
