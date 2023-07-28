import { qs } from "@nonovel/kv";
import { main } from "./app";

const dev = async () => {
  await qs.genCover.add({
    projectId: "48e3a5ca-8f71-44f8-812e-70c620217d7c",
  });
  main();
};

void dev();
