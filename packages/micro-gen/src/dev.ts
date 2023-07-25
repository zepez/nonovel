import { coverGenerationQueue } from "@nonovel/kv";
import { main } from "./app";

const dev = async () => {
  await coverGenerationQueue.add({
    projectId: "eb6c6c17-1675-4dfa-a0a8-64b5d68ae154",
  });
  main();
};

void dev();
