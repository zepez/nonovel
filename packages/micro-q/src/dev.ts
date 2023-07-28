import { qs } from "@nonovel/kv";
import { main } from "./app";

const dev = async () => {
  await qs.genCover.add({
    projectId: "d4aa5394-ae3d-49d6-a39b-da9773c33985",
  });
  main();
};

void dev();
