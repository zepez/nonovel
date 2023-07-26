import { qs } from "@nonovel/kv";
import { generateCoverJob, generateSearchJob } from "./job";

export const main = () => {
  void qs.genSearch.queue.process(generateSearchJob);
  void qs.genCover.queue.process(generateCoverJob);

  void qs.genSearch.add();
};
