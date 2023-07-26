import { coverGenerationQueue } from "@nonovel/kv";
import { generateCoverJob } from "./job";

export const main = () => {
  void coverGenerationQueue.process(generateCoverJob);
};
