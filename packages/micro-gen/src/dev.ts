import { qs } from "@nonovel/kv";
import { main } from "./app";

const dev = async () => {
  await qs.cover.add({
    projectId: "a0d7ef9a-5c2f-46dc-89f5-9fa35a610b9c",
  });
  main();
};

void dev();
