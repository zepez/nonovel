import { synopsisGenerationQueue, coverGenerationQueue } from "@nonovel/kv";
import { generateSynopsisJob, generateCoverJob } from "./job";

export const main = () => {
  void synopsisGenerationQueue.process(generateSynopsisJob);
  void coverGenerationQueue.process(generateCoverJob);
};
