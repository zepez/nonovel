import { coverGenerationQueue } from "@nonovel/kv";
import { main } from "./app";

const dev = async () => {
  await coverGenerationQueue.add({
    projectId: "6880e930-3a46-491c-ae5d-350f6352ad4e",
  });
  main();
};

void dev();
