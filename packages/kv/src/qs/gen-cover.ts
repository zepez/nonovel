import Queue from "bull";
import { connect } from "./connect";

interface GenCoverQueueOpts {
  projectId: string;
}

const name = "gen_cover";

const queue = new Queue<GenCoverQueueOpts>(name, connect);

const add = async ({ projectId }: GenCoverQueueOpts) =>
  await queue.add(
    { projectId },
    { jobId: `${name}:${projectId}`, removeOnComplete: true, attempts: 3 }
  );

export const genCover = {
  queue,
  add,
};
