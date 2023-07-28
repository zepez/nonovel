import { qs } from "@nonovel/kv";
import { main } from "./app";

const dev = async () => {
  await qs.genCover.add({
    projectId: "fa99a128-0454-4f2a-8cc9-685640d757d0",
  });
  main();
};

void dev();
